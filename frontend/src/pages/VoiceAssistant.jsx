import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  Volume2,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Square,
  HelpCircle,
  Radio,
  Code2,
  Cpu,
  Globe,
  Check,
  X,
  Database,
  CalendarCheck
} from 'lucide-react';
import { quickVoiceSuggestions } from '../data/mockData';
import {
  processIntentWithAlternatives,
  formatTodayRemindersVoiceResponse,
  formatNextReminderVoiceResponse,
  formatCreateReminderConfirmationPrompt,
  formatCreateReminderSuccessResponse,
  formatAmbiguousTimeClarificationPrompt,
  resolveAmbiguousTimeAnswer,
  formatProgressVoiceResponse,
  PROGRESS_ERROR_RESPONSE,
  formatRecentActivityVoiceResponse,
  RECENT_ACTIVITY_ERROR_RESPONSE,
  START_MEMORY_GAME_RESPONSE,
  UNSUPPORTED_GAME_RESPONSE,
  CREATE_REMINDER_CANCELLED_RESPONSE,
  CREATE_REMINDER_MISSING_TIME_PROMPT,
  CREATE_REMINDER_MISSING_TASK_PROMPT,
  CREATE_REMINDER_FAILURE_RESPONSE,
  extractTimeFromUtterance,
  INTENTS
} from '../utils/intentProcessor';
import {
  fetchTodayReminders,
  fetchNextReminder,
  createReminderApi,
  fetchPatientProgress,
  fetchRecentActivities
} from '../api/api';
import {
  setGlobalSpeaking,
  isGlobalSpeaking,
  setActiveRecognition,
} from '../utils/speechCoordinator';

// Test phrase suite for Phase 2 & 3 validation
const TEST_PHRASES = [
  "What do I have today?",
  "What medicine do I take next?",
  "Remind me to drink water at 4 PM",
  "Remind me to call my daughter at 6 PM",
  "Remind me to drink water",
  "Start a memory game",
  "How am I doing?",
  "What did I do recently?",
  "I need help",
  "Tell me something random",
];

// Available Speech Recognition Language Models
const RECOGNITION_LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'hi-IN', label: 'Hindi / Hinglish' },
];

const getSpeechRecognitionClass = () => {
  if (typeof window !== 'undefined') {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }
  return null;
};

const checkRecognitionSupport = () => Boolean(getSpeechRecognitionClass());
const checkSynthesisSupport = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export default function VoiceAssistant() {
  const navigate = useNavigate();

  // Speech Recognition & Synthesis capability states
  const [isRecognitionSupported] = useState(checkRecognitionSupport);
  const [isSynthesisSupported] = useState(checkSynthesisSupport);

  // Selected recognition accent / language model (Default: en-IN for Indian demographics)
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');

  // Interaction states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState(
    "Hello! Tap the big microphone below and speak to me. I am listening."
  );
  const [errorMessage, setErrorMessage] = useState(() =>
    checkRecognitionSupport()
      ? null
      : 'Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Apple Safari for voice input.'
  );

  // Phase 3C: Multi-turn Dialog & Pending Confirmation State
  const [pendingReminder, setPendingReminder] = useState(null); // { task: string, time?: string, step: 'awaiting_time' | 'awaiting_confirmation' }
  const [createdSuccessBanner, setCreatedSuccessBanner] = useState(null);

  // Phase 2 & 3: Detected Intent state & Live Database Reminders
  const [detectedIntentResult, setDetectedIntentResult] = useState(null);

  // Refs for SpeechRecognition, duplicate submission prevention & STT/TTS synchronization
  const recognitionRef = useRef(null);
  const isStoppingExplicitlyRef = useRef(false);
  const currentFinalTranscriptRef = useRef('');
  const currentInterimTranscriptRef = useRef('');
  const candidateAlternativesRef = useRef([]);
  const silenceTimerRef = useRef(null);
  const hasSpokenWordsRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const pendingReminderRef = useRef(null);

  // Synchronous TTS speaking lock and acoustic cooldown refs to prevent mic contamination
  const isSpeakingRef = useRef(false);
  const ttsCooldownTimerRef = useRef(null);

  // Keep pendingReminderRef synchronized with state
  useEffect(() => {
    pendingReminderRef.current = pendingReminder;
  }, [pendingReminder]);

  // Cleanup on unmount: stop recognition & cancel active synthesis
  useEffect(() => {
    const handleProactiveAbort = () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.debug('[SpeechRecognition] Abort on proactive event', e);
        }
        setIsListening(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mindcare:abort-speech-recognition', handleProactiveAbort);
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (ttsCooldownTimerRef.current) {
        clearTimeout(ttsCooldownTimerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.debug('[SpeechRecognition] Cleanup abort', e);
        }
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('mindcare:abort-speech-recognition', handleProactiveAbort);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }
      setActiveRecognition(null);
      setGlobalSpeaking(false);
      isSpeakingRef.current = false;
    };
  }, []);

  // Text-To-Speech function with strict STT synchronization
  const speakText = useCallback(
    (textToSpeak) => {
      if (!('speechSynthesis' in window)) {
        return;
      }

      // 1. Immediately abort active speech recognition so mic never captures speaker output
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      if (ttsCooldownTimerRef.current) {
        clearTimeout(ttsCooldownTimerRef.current);
        ttsCooldownTimerRef.current = null;
      }

      isStoppingExplicitlyRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.debug('[SpeechRecognition] Abort on speak', e);
        }
      }
      setIsListening(false);

      // 2. Mark speaking state synchronously in ref and state
      isSpeakingRef.current = true;
      setIsSpeaking(true);

      // Cancel any ongoing speech before starting new speech
      window.speechSynthesis.cancel();

      if (!textToSpeak || textToSpeak.trim() === '') {
        isSpeakingRef.current = false;
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // Elderly-friendly speech settings: clear, calm, moderate pace
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = selectedLanguage;

      // Pick an appropriate natural voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice =
          voices.find(
            (v) =>
              (v.lang.startsWith(selectedLanguage) || v.lang.startsWith('en')) &&
              !v.name.includes('Google')
          ) ||
          voices.find((v) => v.lang.startsWith(selectedLanguage)) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.onstart = () => {
        isSpeakingRef.current = true;
        setGlobalSpeaking(true);
        setIsSpeaking(true);
      };

      const handleSpeechFinished = () => {
        // 250ms acoustic cooldown so room reverb/echo decays before microphone opens
        if (ttsCooldownTimerRef.current) {
          clearTimeout(ttsCooldownTimerRef.current);
        }
        ttsCooldownTimerRef.current = setTimeout(() => {
          isSpeakingRef.current = false;
          setGlobalSpeaking(false);
          setIsSpeaking(false);
        }, 250);
      };

      utterance.onend = () => {
        handleSpeechFinished();
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('[SpeechSynthesis] Error:', e.error);
        }
        isSpeakingRef.current = false;
        setGlobalSpeaking(false);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [selectedLanguage]
  );

  // Stop active speech synthesis
  const handleStopSpeaking = () => {
    if (ttsCooldownTimerRef.current) {
      clearTimeout(ttsCooldownTimerRef.current);
      ttsCooldownTimerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
    setIsSpeaking(false);
  };

  // Replay the current assistant response
  const handleReplayResponse = () => {
    if (assistantReply) {
      speakText(assistantReply);
    }
  };

  // Phase 3C: Confirm and execute reminder creation in PostgreSQL
  const handleConfirmReminder = useCallback(async () => {
    const current = pendingReminderRef.current;
    if (isSubmittingRef.current || !current || !current.task || !current.time) {
      return;
    }

    isSubmittingRef.current = true;
    try {
      const data = await createReminderApi({
        title: current.task,
        reminder_time: current.time,
      });

      const successMsg = formatCreateReminderSuccessResponse(current.task, current.time);
      setAssistantReply(successMsg);
      setPendingReminder(null);
      setCreatedSuccessBanner({
        task: current.task,
        time: current.time,
        reminder: data.reminder,
      });
      setDetectedIntentResult({
        intent: INTENTS.CREATE_REMINDER,
        status: 'created',
        parameters: { task: current.task, time: current.time },
        response: successMsg,
        createdReminder: data.reminder,
        fetchedFromDb: true,
      });
      speakText(successMsg);
    } catch (err) {
      console.warn('[CREATE REMINDER API ERROR]', err);
      const failMsg = CREATE_REMINDER_FAILURE_RESPONSE;
      setAssistantReply(failMsg);
      setPendingReminder(null);
      setDetectedIntentResult({
        intent: INTENTS.CREATE_REMINDER,
        status: 'error',
        response: failMsg,
        apiError: err.message,
      });
      speakText(failMsg);
    } finally {
      isSubmittingRef.current = false;
    }
  }, [speakText]);

  // Phase 3C: Cancel pending reminder creation
  const handleCancelReminder = useCallback(() => {
    setPendingReminder(null);
    const cancelMsg = CREATE_REMINDER_CANCELLED_RESPONSE;
    setAssistantReply(cancelMsg);
    setDetectedIntentResult({
      intent: INTENTS.CANCEL,
      status: 'cancelled',
      parameters: {},
      response: cancelMsg,
    });
    speakText(cancelMsg);
  }, [speakText]);

  // Process user speech through Intent Processor and trigger voice response
  const handleSpeechFinalized = useCallback(
    async (candidates) => {
      const candidateList = Array.isArray(candidates)
        ? candidates.filter((c) => typeof c === 'string' && c.trim() !== '')
        : [candidates].filter(Boolean);

      if (candidateList.length === 0) return;

      const primary = candidateList[0].trim();
      setUserTranscript(primary);
      setInterimTranscript('');
      setCreatedSuccessBanner(null);

      const intentResult = processIntentWithAlternatives(candidateList);
      const activePending = pendingReminderRef.current;

      // ── Multi-turn Dialog Step 1A: In "awaiting_time_clarification" state (e.g. 8 AM or 8 PM?) ──
      if (activePending && activePending.step === 'awaiting_time_clarification') {
        if (intentResult.intent === INTENTS.CANCEL) {
          handleCancelReminder();
          return;
        }

        const resolvedTime = resolveAmbiguousTimeAnswer(primary, activePending.ambiguousHour);
        if (resolvedTime) {
          const nextPending = {
            task: activePending.task,
            time: resolvedTime,
            step: 'awaiting_confirmation',
          };
          setPendingReminder(nextPending);
          const confirmPrompt = formatCreateReminderConfirmationPrompt(
            activePending.task,
            resolvedTime
          );
          setAssistantReply(confirmPrompt);
          setDetectedIntentResult({
            intent: INTENTS.CREATE_REMINDER,
            status: 'awaiting_confirmation',
            parameters: { task: activePending.task, time: resolvedTime },
            response: confirmPrompt,
          });
          speakText(confirmPrompt);
          return;
        }

        // Clarify again
        const clarifyPrompt = formatAmbiguousTimeClarificationPrompt(activePending.ambiguousHour);
        setAssistantReply(clarifyPrompt);
        speakText(clarifyPrompt);
        return;
      }

      // ── Multi-turn Dialog Step 1B: In "awaiting_time" state ───────────────────
      if (activePending && activePending.step === 'awaiting_time') {
        if (intentResult.intent === INTENTS.CANCEL) {
          handleCancelReminder();
          return;
        }

        // Try extracting time from user response e.g. "4 PM" / "at 5:30 PM"
        const extractedTime = extractTimeFromUtterance(primary) || intentResult.parameters?.time;
        if (extractedTime) {
          const nextPending = {
            task: activePending.task,
            time: extractedTime,
            step: 'awaiting_confirmation',
          };
          setPendingReminder(nextPending);
          const confirmPrompt = formatCreateReminderConfirmationPrompt(
            activePending.task,
            extractedTime
          );
          setAssistantReply(confirmPrompt);
          setDetectedIntentResult({
            intent: INTENTS.CREATE_REMINDER,
            status: 'awaiting_confirmation',
            parameters: { task: activePending.task, time: extractedTime },
            response: confirmPrompt,
          });
          speakText(confirmPrompt);
          return;
        }

        // Time not recognized, ask again
        setAssistantReply(CREATE_REMINDER_MISSING_TIME_PROMPT);
        speakText(CREATE_REMINDER_MISSING_TIME_PROMPT);
        return;
      }

      // ── Multi-turn Dialog Step 2: In "awaiting_confirmation" state ───────────
      if (activePending && activePending.step === 'awaiting_confirmation') {
        if (intentResult.intent === INTENTS.CONFIRM) {
          handleConfirmReminder();
          return;
        }

        if (intentResult.intent === INTENTS.CANCEL) {
          handleCancelReminder();
          return;
        }

        // If user changed their mind and uttered another valid intent (e.g. "What do I have today?")
        if (
          intentResult.intent !== INTENTS.UNKNOWN &&
          intentResult.intent !== INTENTS.CONFIRM &&
          intentResult.intent !== INTENTS.CANCEL
        ) {
          setPendingReminder(null);
          // Fall through to regular intent execution below
        }
      }

      // ── 1. CREATE_REMINDER Intent Handling ──────────────────────────────────
      if (intentResult.intent === INTENTS.CREATE_REMINDER) {
        const { task, time, isAmbiguous, ambiguousHour } = intentResult.parameters || {};

        if (!task || task.trim() === '') {
          setAssistantReply(CREATE_REMINDER_MISSING_TASK_PROMPT);
          setDetectedIntentResult({
            ...intentResult,
            status: 'missing_task',
            response: CREATE_REMINDER_MISSING_TASK_PROMPT,
          });
          speakText(CREATE_REMINDER_MISSING_TASK_PROMPT);
          return;
        }

        // Ambiguous time e.g. "at 8" -> Ask: "Do you mean 8 AM or 8 PM?"
        if (isAmbiguous) {
          const h = ambiguousHour || 8;
          setPendingReminder({
            task: task.trim(),
            ambiguousHour: h,
            step: 'awaiting_time_clarification',
          });
          const clarifyPrompt = formatAmbiguousTimeClarificationPrompt(h);
          setAssistantReply(clarifyPrompt);
          setDetectedIntentResult({
            ...intentResult,
            status: 'awaiting_time_clarification',
            response: clarifyPrompt,
          });
          speakText(clarifyPrompt);
          return;
        }

        if (!time) {
          setPendingReminder({ task: task.trim(), step: 'awaiting_time' });
          setAssistantReply(CREATE_REMINDER_MISSING_TIME_PROMPT);
          setDetectedIntentResult({
            ...intentResult,
            status: 'awaiting_time',
            response: CREATE_REMINDER_MISSING_TIME_PROMPT,
          });
          speakText(CREATE_REMINDER_MISSING_TIME_PROMPT);
          return;
        }

        // Both task and time are present: ask for confirmation first!
        const nextPending = {
          task: task.trim(),
          time: time.trim(),
          step: 'awaiting_confirmation',
        };
        setPendingReminder(nextPending);
        const confirmPrompt = formatCreateReminderConfirmationPrompt(task.trim(), time.trim());
        setAssistantReply(confirmPrompt);
        setDetectedIntentResult({
          ...intentResult,
          status: 'awaiting_confirmation',
          response: confirmPrompt,
        });
        speakText(confirmPrompt);
        return;
      }

      // ── 2. GET_TODAY_REMINDERS ──────────────────────────────────────────────
      if (intentResult.intent === INTENTS.GET_TODAY_REMINDERS) {
        setPendingReminder(null);
        setAssistantReply("Checking your reminders for today...");
        try {
          const data = await fetchTodayReminders();
          const spoken = formatTodayRemindersVoiceResponse(data.reminders);
          setAssistantReply(spoken);
          setDetectedIntentResult({
            ...intentResult,
            response: spoken,
            databaseReminders: data.reminders,
            fetchedFromDb: true,
            remindersCount: data.count,
          });
          speakText(spoken);
        } catch (err) {
          console.warn('[VOICE REMINDERS API ERROR]', err);
          const fallbackMsg = "I'm sorry, I couldn't check your reminders right now.";
          setAssistantReply(fallbackMsg);
          setDetectedIntentResult({
            ...intentResult,
            response: fallbackMsg,
            apiError: err.message,
          });
          speakText(fallbackMsg);
        }
        return;
      }

      // ── 3. GET_NEXT_REMINDER ────────────────────────────────────────────────
      if (intentResult.intent === INTENTS.GET_NEXT_REMINDER) {
        setPendingReminder(null);
        setAssistantReply("Checking your next reminder...");
        try {
          const data = await fetchNextReminder();
          const spoken = formatNextReminderVoiceResponse(data.reminder);
          setAssistantReply(spoken);
          setDetectedIntentResult({
            ...intentResult,
            response: spoken,
            nextReminder: data.reminder,
            fetchedFromDb: true,
          });
          speakText(spoken);
        } catch (err) {
          console.warn('[VOICE NEXT REMINDER API ERROR]', err);
          const fallbackMsg = "I'm sorry, I couldn't check your next reminder right now.";
          setAssistantReply(fallbackMsg);
          setDetectedIntentResult({
            ...intentResult,
            response: fallbackMsg,
            apiError: err.message,
          });
          speakText(fallbackMsg);
        }
        return;
      }

      // ── 4. START_GAME ────────────────────────────────────────────────────────
      if (intentResult.intent === INTENTS.START_GAME) {
        setPendingReminder(null);
        const gameType = intentResult.parameters?.gameType || 'memory';

        if (gameType === 'memory') {
          const spoken = START_MEMORY_GAME_RESPONSE;
          setAssistantReply(spoken);
          setDetectedIntentResult({
            ...intentResult,
            response: spoken,
            navigatingTo: '/games/memory',
          });
          speakText(spoken);

          // Stop active recognition
          if (recognitionRef.current) {
            try {
              recognitionRef.current.abort();
            } catch (e) {
              console.debug('[SpeechRecognition] Abort on navigation', e);
            }
          }
          setIsListening(false);

          // Navigate to MemoryGame route using React Router
          setTimeout(() => {
            navigate('/games/memory');
          }, 500);
          return;
        }

        // Unsupported game type
        const spoken = UNSUPPORTED_GAME_RESPONSE;
        setAssistantReply(spoken);
        setDetectedIntentResult({
          ...intentResult,
          response: spoken,
          unsupported: true,
        });
        speakText(spoken);
        return;
      }

      // ── 5. GET_PROGRESS ─────────────────────────────────────────────────────
      if (intentResult.intent === INTENTS.GET_PROGRESS) {
        setPendingReminder(null);
        setAssistantReply("Checking your progress...");
        try {
          const data = await fetchPatientProgress();
          const spoken = formatProgressVoiceResponse(data.progress);
          setAssistantReply(spoken);
          setDetectedIntentResult({
            ...intentResult,
            response: spoken,
            progressData: data.progress,
            fetchedFromDb: true,
          });
          speakText(spoken);
        } catch (err) {
          console.warn('[VOICE PROGRESS API ERROR]', err);
          const fallbackMsg = PROGRESS_ERROR_RESPONSE;
          setAssistantReply(fallbackMsg);
          setDetectedIntentResult({
            ...intentResult,
            response: fallbackMsg,
            apiError: err.message,
          });
          speakText(fallbackMsg);
        }
        return;
      }

      // ── 6. GET_RECENT_ACTIVITY ──────────────────────────────────────────────
      if (intentResult.intent === INTENTS.GET_RECENT_ACTIVITY) {
        setPendingReminder(null);
        setAssistantReply("Checking your recent activity...");
        try {
          const data = await fetchRecentActivities();
          const spoken = formatRecentActivityVoiceResponse(data.activities);
          setAssistantReply(spoken);
          setDetectedIntentResult({
            ...intentResult,
            response: spoken,
            recentActivities: data.activities,
            fetchedFromDb: true,
          });
          speakText(spoken);
        } catch (err) {
          console.warn('[VOICE RECENT ACTIVITY API ERROR]', err);
          const fallbackMsg = RECENT_ACTIVITY_ERROR_RESPONSE;
          setAssistantReply(fallbackMsg);
          setDetectedIntentResult({
            ...intentResult,
            response: fallbackMsg,
            apiError: err.message,
          });
          speakText(fallbackMsg);
        }
        return;
      }

      // ── Default Responses for Other Intents ─────────────────────────────────
      setPendingReminder(null);
      setDetectedIntentResult(intentResult);
      setAssistantReply(intentResult.response);
      speakText(intentResult.response);
    },
    [handleCancelReminder, handleConfirmReminder, speakText, navigate]
  );

  // Finalize speech recognition when user finishes or pause timer fires
  const finalizeRecognition = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.debug('[SpeechRecognition] Stop error', e);
      }
    }
    setIsListening(false);

    // If currently speaking, do not process any buffered audio
    if (isSpeakingRef.current) {
      return;
    }

    // Build the final combined transcript (finalized chunks + any lingering interim chunk)
    const combined = (
      currentFinalTranscriptRef.current.trim() +
      ' ' +
      currentInterimTranscriptRef.current.trim()
    ).trim();

    if (combined && !isStoppingExplicitlyRef.current) {
      const allCandidates = [
        combined,
        ...candidateAlternativesRef.current.filter((c) => c !== combined),
      ];
      handleSpeechFinalized(allCandidates);
    }
  }, [handleSpeechFinalized]);

  // Start listening with Web Speech API
  const startListening = () => {
    const SpeechRecognition = getSpeechRecognitionClass();

    if (!SpeechRecognition) {
      setErrorMessage(
        'Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Apple Safari.'
      );
      return;
    }

    // Cancel active synthesis so mic doesn't catch own speaker output
    if (ttsCooldownTimerRef.current) {
      clearTimeout(ttsCooldownTimerRef.current);
      ttsCooldownTimerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
    setIsSpeaking(false);

    // Clean up any existing recognition instance or timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        console.debug('[SpeechRecognition] Abort existing', e);
      }
    }

    // Optional microphone audio stream priming with auto gain control
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
        .then((stream) => {
          stream.getTracks().forEach((track) => track.stop());
        })
        .catch((err) => {
          console.debug('[AudioPriming] Note:', err.name);
        });
    }

    setErrorMessage(null);
    setUserTranscript('');
    setInterimTranscript('');
    currentFinalTranscriptRef.current = '';
    currentInterimTranscriptRef.current = '';
    candidateAlternativesRef.current = [];
    isStoppingExplicitlyRef.current = false;
    hasSpokenWordsRef.current = false;

    // If TTS is currently speaking (proactive reminder or assistant reply), cancel speech immediately
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setGlobalSpeaking(false);
    isSpeakingRef.current = false;
    setIsSpeaking(false);

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      setActiveRecognition(recognition);

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 5;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);

        // Max initial wait timer: if no words are spoken for 12 seconds, stop gracefully
        silenceTimerRef.current = setTimeout(() => {
          if (!hasSpokenWordsRef.current) {
            stopListening();
            setErrorMessage(
              'No speech was heard. Please tap the microphone and speak whenever you are ready.'
            );
          }
        }, 12000);
      };

      recognition.onresult = (event) => {
        // CRITICAL: If MindCare is speaking (assistant or proactive reminder), ignore all microphone audio
        if (isSpeakingRef.current || isGlobalSpeaking()) {
          return;
        }

        hasSpokenWordsRef.current = true;

        let aggregatedFinal = '';
        let aggregatedInterim = '';
        const candidateSet = new Set();

        for (let i = 0; i < event.results.length; ++i) {
          const result = event.results[i];

          for (let a = 0; a < result.length; a++) {
            if (result[a]?.transcript) {
              candidateSet.add(result[a].transcript.trim());
            }
          }

          if (result.isFinal) {
            aggregatedFinal += (aggregatedFinal ? ' ' : '') + result[0].transcript.trim();
          } else {
            aggregatedInterim += (aggregatedInterim ? ' ' : '') + result[0].transcript.trim();
          }
        }

        currentFinalTranscriptRef.current = aggregatedFinal;
        currentInterimTranscriptRef.current = aggregatedInterim;
        candidateAlternativesRef.current = Array.from(candidateSet);

        if (aggregatedFinal) {
          setUserTranscript(aggregatedFinal);
        }
        setInterimTranscript(aggregatedInterim);

        // Reset adaptive pause timer (2500ms)
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        silenceTimerRef.current = setTimeout(() => {
          finalizeRecognition();
        }, 2500);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }

        if (isStoppingExplicitlyRef.current || event.error === 'aborted') {
          return;
        }

        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            setErrorMessage(
              'Microphone access was denied. Please allow microphone permissions in your browser address bar.'
            );
            break;

          case 'no-speech':
            setErrorMessage(
              'No speech was detected. Tap the microphone and try speaking again clearly.'
            );
            break;

          case 'audio-capture':
            setErrorMessage(
              'No microphone found. Please check your audio input settings.'
            );
            break;

          case 'network':
            setErrorMessage(
              'Network error during voice recognition. Please check your internet connection and try again.'
            );
            break;

          default:
            setErrorMessage(`Recognition error: ${event.error}. Please try again.`);
            break;
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setActiveRecognition(null);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }

        // If currently speaking or stopping explicitly, do NOT process residual buffered chunks
        if (
          isSpeakingRef.current ||
          isStoppingExplicitlyRef.current ||
          isGlobalSpeaking()
        ) {
          return;
        }

        const combined = (
          currentFinalTranscriptRef.current.trim() +
          ' ' +
          currentInterimTranscriptRef.current.trim()
        ).trim();

        if (combined) {
          const allCandidates = [
            combined,
            ...candidateAlternativesRef.current.filter((c) => c !== combined),
          ];
          handleSpeechFinalized(allCandidates);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('[SpeechRecognition] Start error:', err);
      setIsListening(false);
      setActiveRecognition(null);
      setErrorMessage(
        'Could not activate the microphone. Please tap the button to try again.'
      );
    }
  };

  // Stop listening cleanly
  const stopListening = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    isStoppingExplicitlyRef.current = true;
    setActiveRecognition(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.debug('[SpeechRecognition] Stop error', e);
      }
    }
    setIsListening(false);
  };

  // Toggle microphone button click
  const handleMicToggle = () => {
    if (isListening) {
      finalizeRecognition();
    } else {
      startListening();
    }
  };

  // Handle Quick Suggestion / Test Phrase clicks
  const handlePhraseClick = (phrase) => {
    if (isListening) {
      stopListening();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
      setIsSpeaking(false);
    }

    setErrorMessage(null);
    handleSpeechFinalized(phrase);
  };

  // Helper color map for intent badges
  const getIntentBadgeColor = (intent) => {
    switch (intent) {
      case INTENTS.GET_TODAY_REMINDERS:
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case INTENTS.GET_NEXT_REMINDER:
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case INTENTS.CREATE_REMINDER:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case INTENTS.CONFIRM:
        return 'bg-green-100 text-green-900 border-green-300';
      case INTENTS.CANCEL:
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case INTENTS.START_GAME:
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case INTENTS.GET_PROGRESS:
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case INTENTS.GET_RECENT_ACTIVITY:
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case INTENTS.HELP:
        return 'bg-orange-100 text-orange-900 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto">
      {/* ── Breadcrumb / Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-800 hover:text-purple-950 font-extrabold text-base sm:text-lg hover:underline mb-2 py-1 px-2 -ml-2 rounded-lg transition"
            aria-label="Navigate back to Home page"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Voice Companion
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 font-semibold mt-1">
            Tap the big microphone button below and speak naturally.
          </p>
        </div>

        {/* Language / Accent Model Selector */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border-2 border-purple-200 shadow-sm shrink-0">
          <Globe className="w-4 h-4 text-purple-700" />
          <label htmlFor="voice-lang" className="text-xs font-bold text-gray-600 sr-only">
            Speech Language
          </label>
          <select
            id="voice-lang"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-transparent font-bold text-xs sm:text-sm text-purple-950 outline-none cursor-pointer"
          >
            {RECOGNITION_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Success Confirmation Banner ── */}
      {createdSuccessBanner && (
        <div
          role="status"
          className="p-5 sm:p-6 bg-emerald-50 border-3 border-emerald-400 rounded-2xl flex items-center justify-between gap-4 text-emerald-950 shadow-md animate-in fade-in"
        >
          <div className="flex items-center gap-3">
            <CalendarCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-emerald-900">
                Reminder Created in PostgreSQL!
              </h2>
              <p className="text-base font-semibold text-emerald-800">
                "{createdSuccessBanner.task}" scheduled for {createdSuccessBanner.time}
              </p>
            </div>
          </div>
          <Link
            to="/reminders"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl transition shadow cursor-pointer shrink-0"
          >
            View Reminders
          </Link>
        </div>
      )}

      {/* ── Browser Support / Permission Warning Banner ── */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-5 sm:p-6 bg-amber-50 border-3 border-amber-400 rounded-2xl flex items-start gap-4 text-amber-950 shadow-md animate-in fade-in"
        >
          <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-amber-900">
              Notice: Microphone & Audio
            </h2>
            <p className="text-base sm:text-lg font-medium text-amber-950 leading-relaxed">
              {errorMessage}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              {isRecognitionSupported && (
                <button
                  onClick={startListening}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-base rounded-xl transition shadow cursor-pointer inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              )}
              <button
                onClick={() => setErrorMessage(null)}
                className="px-4 py-2 bg-white border-2 border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-base rounded-xl transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Senior-Friendly Voice Interaction Card ── */}
      <section
        aria-label="Voice Interaction Area"
        className="senior-card p-6 sm:p-10 text-center space-y-8 bg-gradient-to-b from-white via-purple-50/40 to-purple-100/30 border-3 border-purple-300 shadow-xl"
      >
        {/* 1. MindCare Assistant Speech Bubble (Text + TTS) */}
        <div
          role="region"
          aria-label="MindCare Assistant Response"
          aria-live="polite"
          className="max-w-2xl mx-auto p-6 sm:p-8 bg-purple-800 text-white rounded-3xl shadow-xl relative text-left border-2 border-purple-900"
        >
          <div className="flex items-center justify-between gap-3 text-purple-200 text-sm font-bold uppercase tracking-wider mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-white font-black text-base">MindCare Assistant</span>
            </div>

            {/* Speaking Status Tag */}
            {isSpeaking ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs sm:text-sm font-black animate-pulse">
                <Volume2 className="w-4 h-4" />
                Speaking...
              </span>
            ) : (
              <span className="text-purple-300 text-xs sm:text-sm font-semibold">
                Voice Ready
              </span>
            )}
          </div>

          {/* Assistant Text */}
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-relaxed text-white">
            "{assistantReply}"
          </p>

          {/* Phase 3C: Large Touch Confirmation Buttons */}
          {pendingReminder && pendingReminder.step === 'awaiting_confirmation' && (
            <div className="mt-6 pt-5 border-t border-purple-600/70 space-y-3 animate-in fade-in">
              <p className="text-sm sm:text-base font-bold text-purple-200 uppercase tracking-wide">
                Tap an option or say "Yes" / "No":
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleConfirmReminder}
                  className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg sm:text-xl rounded-2xl shadow-lg flex items-center justify-center gap-3 transition active:scale-95 cursor-pointer border-2 border-emerald-400"
                  aria-label="Confirm setting reminder"
                >
                  <Check className="w-7 h-7 stroke-[3]" />
                  <span>Yes, set reminder</span>
                </button>
                <button
                  onClick={handleCancelReminder}
                  className="w-full py-4 px-6 bg-rose-700 hover:bg-rose-800 text-white font-black text-lg sm:text-xl rounded-2xl shadow-lg flex items-center justify-center gap-3 transition active:scale-95 cursor-pointer border-2 border-rose-500"
                  aria-label="Cancel reminder creation"
                >
                  <X className="w-7 h-7 stroke-[3]" />
                  <span>No, cancel</span>
                </button>
              </div>
            </div>
          )}

          {/* Audio Playback Controls */}
          {isSynthesisSupported && (
            <div className="mt-5 pt-4 border-t border-purple-700/60 flex items-center justify-between gap-3">
              {isSpeaking ? (
                <button
                  onClick={handleStopSpeaking}
                  aria-label="Stop MindCare voice playback"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base rounded-xl transition shadow cursor-pointer active:scale-95"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Speaking</span>
                </button>
              ) : (
                <button
                  onClick={handleReplayResponse}
                  aria-label="Listen to assistant response again"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm sm:text-base rounded-xl transition shadow cursor-pointer border border-purple-400 active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Response</span>
                </button>
              )}

              <span className="text-purple-200 text-xs sm:text-sm font-medium">
                Clear voice audio
              </span>
            </div>
          )}
        </div>

        {/* 2. Big Touch-Friendly Animated Microphone Core */}
        <div className="py-2 flex flex-col items-center justify-center">
          {/* Outer Ripple effect when listening */}
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <span className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-red-400/30 animate-ping" />
                <span className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-red-500/20 animate-pulse" />
              </>
            )}

            <button
              onClick={handleMicToggle}
              role="button"
              aria-pressed={isListening}
              aria-label={
                isListening
                  ? "Finish speaking now"
                  : "Tap to start speaking to MindCare"
              }
              className={`w-36 h-36 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 cursor-pointer relative z-10 select-none border-4 ${
                isListening
                  ? 'bg-red-600 text-white border-red-300 ring-8 sm:ring-12 ring-red-200 scale-105'
                  : 'bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white border-purple-300 hover:scale-105 ring-6 sm:ring-8 ring-purple-200'
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-16 h-16 sm:w-20 sm:h-20 animate-bounce text-white drop-shadow-md" />
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider mt-1 text-red-100">
                    Done Speaking
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-md" />
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider mt-1 text-purple-200">
                    Tap to Speak
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Status Label */}
          <div className="mt-6 space-y-1">
            <p
              role="status"
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-purple-950 tracking-tight"
            >
              {isListening ? (
                <span className="inline-flex items-center gap-2 text-red-600">
                  <Radio className="w-6 h-6 animate-pulse" />
                  Listening... Speak at your own pace
                </span>
              ) : pendingReminder && pendingReminder.step === 'awaiting_confirmation' ? (
                'Waiting for your confirmation...'
              ) : pendingReminder && pendingReminder.step === 'awaiting_time' ? (
                'Please tell me what time...'
              ) : (
                'Tap Microphone to Speak'
              )}
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-600">
              {isListening
                ? 'You can pause between words. MindCare will wait before responding.'
                : 'Click once, speak in your natural voice, and take your time.'}
            </p>
          </div>

          {/* Quick Finish / Cancel Controls */}
          {isListening && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button
                onClick={finalizeRecognition}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base sm:text-lg rounded-2xl transition active:scale-95 cursor-pointer inline-flex items-center gap-2 shadow-md"
                aria-label="Finish speaking and process intent"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Done Speaking</span>
              </button>
              <button
                onClick={stopListening}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-300 font-bold text-base rounded-2xl transition active:scale-95 cursor-pointer inline-flex items-center gap-2"
                aria-label="Cancel listening"
              >
                <Square className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}

          {/* 3. Live Spoken Speech Display Box */}
          {(userTranscript || interimTranscript) && (
            <div
              role="region"
              aria-label="Your spoken words"
              aria-live="polite"
              className="mt-6 w-full max-w-xl p-5 bg-white rounded-2xl border-3 border-purple-200 shadow-md text-left"
            >
              <div className="flex items-center justify-between text-purple-700 text-xs sm:text-sm font-black uppercase tracking-wider mb-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>You Spoke:</span>
                </div>
                {isListening && (
                  <span className="text-xs text-red-500 font-bold animate-pulse">
                    Live Recording
                  </span>
                )}
              </div>
              <p className="text-lg sm:text-xl font-extrabold text-gray-900">
                "{userTranscript} {interimTranscript}"
                {interimTranscript && (
                  <span className="text-purple-500 animate-pulse font-normal ml-1">
                    ...
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* 4. Suggested Voice Phrases (Senior-friendly one-tap prompts) */}
        <div className="space-y-3 pt-6 border-t-2 border-purple-200 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-extrabold text-gray-800">
            <HelpCircle className="w-5 h-5 text-purple-700" />
            <span>Or tap any common request below:</span>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {quickVoiceSuggestions.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => handlePhraseClick(phrase)}
                className="bg-white hover:bg-purple-100 border-2 border-purple-300 hover:border-purple-500 text-purple-950 font-bold text-base sm:text-lg px-4 py-3 rounded-2xl transition shadow-sm text-left active:scale-95 cursor-pointer"
                aria-label={`Ask: ${phrase}`}
              >
                "{phrase}"
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVELOPER / INTENT INSPECTION PANEL (Phase 3C) ── */}
      <section
        aria-label="Developer Intent Inspector"
        className="p-6 bg-slate-900 text-slate-100 rounded-3xl border-2 border-slate-700 shadow-xl space-y-5"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
              Intent Processor Inspector <span className="text-xs text-purple-300 font-bold px-2 py-0.5 bg-purple-950/80 rounded-full border border-purple-800">Phase 3C: Create Reminder DB API</span>
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL Connected</span>
          </div>
        </div>

        {/* Structured Intent Output Preview */}
        {detectedIntentResult ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Intent Name */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                  Detected Intent
                </span>
                <span
                  className={`inline-block px-3 py-1 text-sm sm:text-base font-black rounded-lg border ${getIntentBadgeColor(
                    detectedIntentResult.intent
                  )}`}
                >
                  {detectedIntentResult.intent}
                </span>
              </div>

              {/* Transcript */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                  Raw Transcript
                </span>
                <p className="text-sm font-semibold text-slate-200 line-clamp-2">
                  "{detectedIntentResult.rawTranscript}"
                </p>
              </div>
            </div>

            {/* Extracted Parameters & DB Payload */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-sans">
                <span className="uppercase tracking-wider font-bold">Structured Parameters & Live Database Results</span>
                <Code2 className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <pre className="text-xs sm:text-sm text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    intent: detectedIntentResult.intent,
                    status: detectedIntentResult.status,
                    parameters: detectedIntentResult.parameters,
                    pendingReminder: pendingReminder,
                    progressData: detectedIntentResult.progressData || undefined,
                    recentActivities: detectedIntentResult.recentActivities || undefined,
                    createdReminder: detectedIntentResult.createdReminder || undefined,
                    nextReminder: detectedIntentResult.nextReminder || undefined,
                    liveReminders: detectedIntentResult.databaseReminders || undefined,
                    apiError: detectedIntentResult.apiError || undefined,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center text-slate-400 text-sm font-medium">
            Speak or select a test phrase below to inspect intent detection & live database queries in real time.
          </div>
        )}

        {/* Quick Intent Test Matrix (All 10 test phrases) */}
        <div className="pt-2 border-t border-slate-800">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Test Phrase Suite (Click to simulate speech):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TEST_PHRASES.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => handlePhraseClick(phrase)}
                className="text-left text-xs sm:text-sm font-medium px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-purple-900/50 hover:border-purple-600 border border-slate-700 text-slate-200 transition cursor-pointer flex items-center justify-between group"
              >
                <span className="truncate">"{phrase}"</span>
                <span className="text-[10px] text-slate-400 group-hover:text-purple-300 font-mono shrink-0 ml-1">
                  Run
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Help / Privacy Reminder Note ── */}
      <footer className="text-center text-sm sm:text-base font-semibold text-gray-500 pb-4">
        🔒 Voice interactions and intent recognition are processed securely with PostgreSQL database sync.
      </footer>
    </div>
  );
}

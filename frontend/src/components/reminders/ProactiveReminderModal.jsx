import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pill, Droplets, Footprints, CalendarClock, Bell, Check } from 'lucide-react';
import { fetchDueReminders } from '../../api/api';
import {
  formatTimeDisplay,
  formatProactiveReminderAnnouncement,
} from '../../utils/intentProcessor';
import {
  setGlobalSpeaking,
  abortActiveRecognition,
} from '../../utils/speechCoordinator';

// Config mapping for dementia-friendly visual themes and headers
const TYPE_CONFIG = {
  medicine: {
    icon: Pill,
    headerText: 'Time for your medicine',
    badgeText: 'Medicine Reminder',
    bgLight: 'bg-purple-50',
    borderClass: 'border-purple-300',
    iconBg: 'bg-purple-600',
    iconText: 'text-white',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-200',
    accentColor: '#9333ea',
  },
  hydration: {
    icon: Droplets,
    headerText: 'Time to drink some water',
    badgeText: 'Hydration Reminder',
    bgLight: 'bg-sky-50',
    borderClass: 'border-sky-300',
    iconBg: 'bg-sky-500',
    iconText: 'text-white',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-200',
    accentColor: '#0284c7',
  },
  activity: {
    icon: Footprints,
    headerText: 'Time for your activity',
    badgeText: 'Daily Activity',
    bgLight: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    iconBg: 'bg-emerald-600',
    iconText: 'text-white',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    accentColor: '#059669',
  },
  appointment: {
    icon: CalendarClock,
    headerText: 'You have an appointment',
    badgeText: 'Appointment',
    bgLight: 'bg-amber-50',
    borderClass: 'border-amber-300',
    iconBg: 'bg-amber-500',
    iconText: 'text-white',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    accentColor: '#d97706',
  },
};

// Module-level dev trigger bridge for instant DevTools availability
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.triggerTestReminder = (type = 'medicine', title = 'Morning Blood Pressure Tablet') => {
    window.dispatchEvent(
      new CustomEvent('mindcare:trigger-test-reminder', {
        detail: { type, title },
      })
    );
  };
}

export default function ProactiveReminderModal() {
  const [queue, setQueue] = useState([]);
  const notifiedIdsRef = useRef(new Set());
  const spokenReminderIdsRef = useRef(new Set());
  const isFetchingRef = useRef(false);
  const ttsCooldownTimerRef = useRef(null);

  // Proactive Text-To-Speech announcement with strict STT synchronization
  const speakAnnouncement = useCallback((textToSpeak) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // 1. Immediately abort active speech recognition if active in the app
    abortActiveRecognition();

    // 2. Set global speaking lock synchronously
    setGlobalSpeaking(true);

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    if (!textToSpeak || !textToSpeak.trim()) {
      setGlobalSpeaking(false);
      return;
    }

    if (ttsCooldownTimerRef.current) {
      clearTimeout(ttsCooldownTimerRef.current);
      ttsCooldownTimerRef.current = null;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferredVoice =
        voices.find((v) => v.lang.startsWith('en') && !v.name.includes('Google')) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0];
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.onstart = () => {
      setGlobalSpeaking(true);
    };

    const handleSpeechFinished = () => {
      // 250ms acoustic cooldown before unlocking
      if (ttsCooldownTimerRef.current) {
        clearTimeout(ttsCooldownTimerRef.current);
      }
      ttsCooldownTimerRef.current = setTimeout(() => {
        setGlobalSpeaking(false);
      }, 250);
    };

    utterance.onend = () => {
      handleSpeechFinished();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('[SpeechSynthesis] Error in proactive announcement:', e.error);
      }
      setGlobalSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Check for due reminders from PostgreSQL backend
  const checkDueReminders = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const data = await fetchDueReminders();
      if (data && Array.isArray(data.reminders) && data.reminders.length > 0) {
        // Filter out reminders that have already been queued/notified in this session
        const freshReminders = data.reminders.filter(
          (r) => !notifiedIdsRef.current.has(r.id)
        );

        if (freshReminders.length > 0) {
          // Track notified IDs to avoid repeat notifications every polling cycle
          freshReminders.forEach((r) => notifiedIdsRef.current.add(r.id));
          setQueue((prevQueue) => [...prevQueue, ...freshReminders]);
        }
      }
    } catch (err) {
      console.warn('[PROACTIVE REMINDER CHECK]', err.message);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Periodic polling setup (30-second interval)
  useEffect(() => {
    // Initial check on mount
    const initialTimer = setTimeout(() => {
      checkDueReminders();
    }, 1500);

    // Periodic interval
    const interval = setInterval(() => {
      checkDueReminders();
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [checkDueReminders]);

  // Development-only manual trigger hook for rapid testing in DevTools
  useEffect(() => {
    if (typeof window === 'undefined' || !import.meta.env.DEV) return;

    const handleTestReminder = (e) => {
      const { type = 'medicine', title = 'Morning Blood Pressure Tablet' } =
        e.detail || {};
      const testItem = {
        id: `dev-test-${Date.now()}`,
        type: type || 'medicine',
        title: title || 'Morning Blood Pressure Tablet',
        description: "It's time for your scheduled reminder.",
        reminder_time: '08:30',
        reminder_date: new Date().toLocaleDateString('en-CA'),
        is_completed: false,
      };
      setQueue((prev) => [...prev, testItem]);
    };

    // Direct invocation handler
    window.triggerTestReminder = (
      type = 'medicine',
      title = 'Morning Blood Pressure Tablet'
    ) => {
      handleTestReminder({ detail: { type, title } });
    };

    window.addEventListener(
      'mindcare:trigger-test-reminder',
      handleTestReminder
    );

    return () => {
      window.removeEventListener(
        'mindcare:trigger-test-reminder',
        handleTestReminder
      );
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        delete window.triggerTestReminder;
      }
    };
  }, []);

  // Active reminder at the top of the queue
  const currentReminder = queue[0] || null;

  // Proactively announce the current reminder exactly once when it appears
  useEffect(() => {
    if (!currentReminder) return;

    if (!spokenReminderIdsRef.current.has(currentReminder.id)) {
      spokenReminderIdsRef.current.add(currentReminder.id);
      const textToSpeak = formatProactiveReminderAnnouncement(currentReminder);
      if (textToSpeak) {
        speakAnnouncement(textToSpeak);
      }
    }
  }, [currentReminder, speakAnnouncement]);

  // Cleanup timers and cancel speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (ttsCooldownTimerRef.current) {
        clearTimeout(ttsCooldownTimerRef.current);
      }
      if (typeof window !== 'undefined') {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setGlobalSpeaking(false);
      }
    };
  }, []);

  // Dismiss current reminder (advances queue or closes without modifying PostgreSQL completion)
  const handleDismiss = () => {
    // If TTS is currently speaking, cancel speech on dismiss
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setGlobalSpeaking(false);
    }
    setQueue((prev) => prev.slice(1));
  };

  if (!currentReminder) return null;

  const typeConfig =
    TYPE_CONFIG[currentReminder.type] || TYPE_CONFIG.medicine;
  const IconComponent = typeConfig.icon;
  const timeFormatted = currentReminder.reminder_time
    ? formatTimeDisplay(currentReminder.reminder_time)
    : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="due-reminder-title"
    >
      <div
        className={`bg-white rounded-3xl border-4 ${typeConfig.borderClass} shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 text-center`}
      >
        {/* Top Queue Badge if multiple are due */}
        {queue.length > 1 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5 text-purple-600 animate-bounce" />
            <span>
              Reminder 1 of {queue.length}
            </span>
          </div>
        )}

        {/* Large Dementia-Friendly Icon */}
        <div className="flex justify-center">
          <div
            className={`p-5 sm:p-6 rounded-3xl ${typeConfig.iconBg} ${typeConfig.iconText} shadow-lg ring-8 ring-purple-100/60`}
          >
            <IconComponent className="w-14 h-14 sm:w-16 sm:h-16 stroke-[2.2]" />
          </div>
        </div>

        {/* Header & Title */}
        <div className="space-y-2">
          <span
            className={`inline-block text-xs sm:text-sm font-black uppercase tracking-wider px-3.5 py-1 rounded-full border ${typeConfig.badgeClass}`}
          >
            {typeConfig.badgeText}
          </span>

          <h2
            id="due-reminder-title"
            className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug"
          >
            {typeConfig.headerText}
          </h2>

          <p className="text-xl sm:text-2xl font-extrabold text-purple-900 pt-1">
            "{currentReminder.title}"
          </p>

          <p className="text-base sm:text-lg text-gray-600 font-medium pt-1">
            {currentReminder.description ||
              "It's time for your scheduled reminder."}
          </p>

          {timeFormatted && (
            <p className="text-xs sm:text-sm font-bold text-gray-400">
              Scheduled for {timeFormatted}
            </p>
          )}
        </div>

        {/* Large, Dementia-Friendly Dismiss Action Button */}
        <div className="pt-2">
          <button
            onClick={handleDismiss}
            aria-label="Dismiss reminder notification"
            className="w-full min-h-[56px] py-4 px-6 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-extrabold text-lg sm:text-xl rounded-2xl transition shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-6 h-6 stroke-[3]" />
            <span>Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );
}

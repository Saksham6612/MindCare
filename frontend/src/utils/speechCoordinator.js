/**
 * Speech Coordinator: Global lock and session tracker for TTS & STT synchronization.
 * Prevents microphone SpeechRecognition from picking up MindCare's Text-To-Speech audio
 * across both the Voice Assistant page and proactive modal notifications.
 */

let isSpeakingGlobally = false;
let activeRecognitionInstance = null;

export function setGlobalSpeaking(speaking) {
  isSpeakingGlobally = Boolean(speaking);
  if (typeof window !== 'undefined') {
    window.__MINDCARE_IS_SPEAKING__ = isSpeakingGlobally;
  }
}

export function isGlobalSpeaking() {
  return (
    isSpeakingGlobally ||
    (typeof window !== 'undefined' && Boolean(window.__MINDCARE_IS_SPEAKING__))
  );
}

export function setActiveRecognition(recognition) {
  activeRecognitionInstance = recognition;
  if (typeof window !== 'undefined') {
    window.__MINDCARE_ACTIVE_RECOGNITION__ = recognition;
  }
}

export function getActiveRecognition() {
  return (
    activeRecognitionInstance ||
    (typeof window !== 'undefined'
      ? window.__MINDCARE_ACTIVE_RECOGNITION__
      : null)
  );
}

export function abortActiveRecognition() {
  if (activeRecognitionInstance) {
    try {
      activeRecognitionInstance.abort();
    } catch (e) {
      console.debug('[SpeechCoordinator] Abort error', e);
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mindcare:abort-speech-recognition'));
  }
}

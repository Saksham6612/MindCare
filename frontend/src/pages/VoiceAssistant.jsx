import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Volume2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const VOICE_SUGGESTIONS_EN = [
  "What medicine do I need to take next?",
  "Tell me what day and time it is today.",
  "Call my daughter Priya.",
  "Show me photos of grandson Aarav.",
  "What is my next reminder?"
];

const VOICE_SUGGESTIONS_BN = [
  "আমার পরবর্তী ওষুধ কী খেতে হবে?",
  "আজকে কী বার এবং এখন কয়টা বাজে?",
  "আমার মেয়ে প্রিয়াকে ফোন করো।",
  "নাতি আরভের ছবি দেখাও।",
  "আমার পরবর্তী অনুস্মারক কী?"
];

export default function VoiceAssistant() {
  const { t, isBengali } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [activeSpeechText, setActiveSpeechText] = useState("");
  const [assistantReply, setAssistantReply] = useState("");

  useEffect(() => {
    setAssistantReply(t('voice.initialGreeting'));
  }, [t]);

  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true);
      setActiveSpeechText(t('voice.listeningPrompt'));
      setTimeout(() => {
        setIsListening(false);
        setActiveSpeechText(t('voice.listeningFeedback'));
        setAssistantReply(t('voice.reminderResponse'));
      }, 3500);
    } else {
      setIsListening(false);
    }
  };

  const handleSuggestionClick = (phrase) => {
    setActiveSpeechText(isBengali ? `আপনি জিজ্ঞাসা করেছেন: "${phrase}"` : `You asked: "${phrase}"`);
    if (phrase.includes("medicine") || phrase.includes("ওষুধ")) {
      setAssistantReply(t('voice.medicineResponse'));
    } else if (phrase.includes("Priya") || phrase.includes("প্রিয়া")) {
      setAssistantReply(t('voice.callPriyaResponse'));
    } else if (phrase.includes("reminder") || phrase.includes("অনুস্মারক")) {
      setAssistantReply(t('voice.reminderResponse'));
    } else {
      setAssistantReply(t('voice.generalResponse', { phrase }));
    }
  };

  const suggestions = isBengali ? VOICE_SUGGESTIONS_BN : VOICE_SUGGESTIONS_EN;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Navigation Header */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-700 font-bold text-base hover:underline mb-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('voice.backToHome')}</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          {t('voice.title')}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 font-medium">
          {t('voice.subtitle')}
        </p>
      </div>

      {/* Main Voice Interaction Card */}
      <div className="senior-card p-8 sm:p-12 text-center space-y-8 bg-gradient-to-b from-white via-purple-50/50 to-purple-100/40 border-3 border-purple-300">
        {/* Assistant Speech Bubble */}
        <div className="max-w-2xl mx-auto p-6 bg-purple-700 text-white rounded-3xl shadow-lg relative text-left">
          <div className="flex items-center gap-2 text-purple-200 text-sm font-bold uppercase tracking-wider mb-2">
            <Volume2 className="w-4 h-4" />
            <span>{t('voice.assistantTitle')}</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold leading-relaxed">
            "{assistantReply}"
          </p>
        </div>

        {/* Big Touch-Friendly Animated Mic Button */}
        <div className="py-4 flex flex-col items-center">
          <button
            onClick={handleMicClick}
            aria-label={isListening ? "Stop listening" : "Start speaking to assistant"}
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 cursor-pointer relative ${
              isListening
                ? 'bg-red-600 text-white ring-12 ring-red-200 animate-pulse'
                : 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white hover:scale-105 ring-8 ring-purple-100'
            }`}
          >
            {isListening ? (
              <Mic className="w-16 h-16 sm:w-20 sm:h-20 animate-bounce" />
            ) : (
              <Mic className="w-16 h-16 sm:w-20 sm:h-20" />
            )}
          </button>

          <p className="mt-5 text-xl sm:text-2xl font-extrabold text-purple-950">
            {isListening ? t('voice.listeningNow') : t('voice.tapToSpeak')}
          </p>
          {activeSpeechText && (
            <p className="mt-2 text-base sm:text-lg font-semibold text-gray-600 bg-white/80 px-4 py-1.5 rounded-full border border-purple-200">
              {activeSpeechText}
            </p>
          )}
        </div>

        {/* Suggested Voice Phrases */}
        <div className="space-y-3 pt-4 border-t border-purple-200 max-w-2xl mx-auto">
          <span className="block text-base font-bold text-gray-700">
            {t('voice.suggestionsHeader')}
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {suggestions.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(phrase)}
                className="bg-white hover:bg-purple-100 border-2 border-purple-200 text-purple-900 font-bold text-base sm:text-lg px-4 py-2.5 rounded-2xl transition shadow-2xs text-left cursor-pointer"
              >
                "{phrase}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

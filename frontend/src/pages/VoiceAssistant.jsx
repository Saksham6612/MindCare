import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, MicOff, Volume2, ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';
import { quickVoiceSuggestions } from '../data/mockData';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [activeSpeechText, setActiveSpeechText] = useState("");
  const [assistantReply, setAssistantReply] = useState(
    "Hello Dadu! I am your MindCare voice assistant. How can I help you right now?"
  );

  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true);
      setActiveSpeechText("Listening to you in English or Assamese...");
      setTimeout(() => {
        setIsListening(false);
        setActiveSpeechText("You asked: 'What is my next reminder?'");
        setAssistantReply("Your next reminder is at 10:30 AM: Enjoy your warm cup of Assam tea with two Marie biscuits.");
      }, 3500);
    } else {
      setIsListening(false);
    }
  };

  const handleSuggestionClick = (phrase) => {
    setActiveSpeechText(`You asked: "${phrase}"`);
    if (phrase.includes("medicine")) {
      setAssistantReply("You have already taken your Blood Pressure medicine at 8:30 AM. Your next medicine is at 1:00 PM (Lunch Joint Care).");
    } else if (phrase.includes("Priya")) {
      setAssistantReply("Connecting you to your daughter Priya Hazarika (+91 98640 12345)...");
    } else {
      setAssistantReply(`I heard your request: "${phrase}". Everything is set and peaceful.`);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Navigation Header */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-700 font-bold text-base hover:underline mb-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Voice Companion
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 font-medium">
          Tap the big purple microphone below and speak naturally.
        </p>
      </div>

      {/* Main Voice Interaction Card */}
      <div className="senior-card p-8 sm:p-12 text-center space-y-8 bg-gradient-to-b from-white via-purple-50/50 to-purple-100/40 border-3 border-purple-300">
        {/* Assistant Speech Bubble */}
        <div className="max-w-2xl mx-auto p-6 bg-purple-700 text-white rounded-3xl shadow-lg relative text-left">
          <div className="flex items-center gap-2 text-purple-200 text-sm font-bold uppercase tracking-wider mb-2">
            <Volume2 className="w-4 h-4" />
            <span>MindCare Assistant</span>
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
            {isListening ? "Listening... Speak now" : "Tap Microphone to Speak"}
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
            Or tap any common question below:
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {quickVoiceSuggestions.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(phrase)}
                className="bg-white hover:bg-purple-100 border-2 border-purple-200 text-purple-900 font-bold text-base sm:text-lg px-4 py-2.5 rounded-2xl transition shadow-2xs text-left"
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

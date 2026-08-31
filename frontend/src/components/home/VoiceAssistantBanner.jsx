import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Volume2, ArrowRight } from 'lucide-react';
import { quickVoiceSuggestions } from '../../data/mockData';

export default function VoiceAssistantBanner() {
  return (
    <section 
      aria-label="Voice Companion Quick Launch"
      className="senior-card p-6 sm:p-8 bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 text-white border-2 border-purple-400 shadow-xl overflow-hidden relative"
    >
      {/* Soft background decor */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-sm">
            <Volume2 className="w-4 h-4" />
            <span>AI Voice Companion</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Need help? Just talk to MindCare
          </h2>

          <p className="text-lg sm:text-xl text-purple-100 font-medium">
            Tap the button and speak in English, Hindi, or Assamese. No typing required.
          </p>

          {/* Quick voice phrase pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {quickVoiceSuggestions.slice(0, 2).map((phrase, idx) => (
              <span 
                key={idx}
                className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm sm:text-base font-medium px-3.5 py-1.5 rounded-xl transition"
              >
                "{phrase}"
              </span>
            ))}
          </div>
        </div>

        {/* Large Voice Action Button */}
        <Link
          to="/voice"
          className="shrink-0 flex items-center justify-center gap-3 bg-white hover:bg-purple-50 text-purple-900 font-extrabold text-xl sm:text-2xl py-4 sm:py-5 px-6 sm:px-8 rounded-2xl shadow-xl transition-all active:scale-95 group border-2 border-white"
        >
          <div className="p-3 bg-purple-600 group-hover:bg-purple-700 text-white rounded-xl transition">
            <Mic className="w-7 h-7 sm:w-8 sm:h-8 animate-bounce" />
          </div>
          <div className="text-left">
            <span className="block text-xl sm:text-2xl font-black">Tap to Speak</span>
            <span className="block text-xs sm:text-sm font-semibold text-purple-700">One-touch voice help</span>
          </div>
          <ArrowRight className="w-6 h-6 text-purple-700 group-hover:translate-x-1 transition ml-1" />
        </Link>
      </div>
    </section>
  );
}

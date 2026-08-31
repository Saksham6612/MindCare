import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Clock, Zap, Play } from 'lucide-react';

export default function BrainExerciseCard() {
  return (
    <section 
      aria-label="Today's Brain Exercise"
      className="senior-card p-6 sm:p-8 bg-gradient-to-br from-white via-purple-50/40 to-indigo-50/30 border-2 border-purple-300 shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Icon & Details */}
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Brain Icon Container */}
          <div className="p-4 sm:p-5 rounded-3xl bg-purple-600 text-white shadow-md shrink-0">
            <Brain className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full inline-block">
              Today's Brain Exercise
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Memory Challenge
            </h3>

            {/* Badges: 5-7 min • Adaptive level */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-sm sm:text-base font-bold text-gray-700">
              <span className="flex items-center gap-1.5 bg-white border border-purple-200 px-3 py-1 rounded-xl shadow-2xs">
                <Clock className="w-4 h-4 text-purple-600" />
                5–7 min
              </span>

              <span className="flex items-center gap-1.5 bg-white border border-purple-200 px-3 py-1 rounded-xl shadow-2xs">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
                Adaptive level
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Large Start Game Button */}
        <Link
          to="/games/memory"
          className="senior-btn-primary py-4 px-8 sm:px-10 text-xl sm:text-2xl font-extrabold rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 group shrink-0"
        >
          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white group-hover:scale-110 transition" />
          <span>Start Game</span>
        </Link>
      </div>
    </section>
  );
}

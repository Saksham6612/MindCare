import React, { useState, useEffect } from 'react';
import { Eye, Clock, ArrowRight } from 'lucide-react';
import MemoryItemCard from './MemoryItemCard';

export default function MemorizeStep({ targetObjects, onComplete, durationSeconds = 5, difficulty = 'Easy' }) {
  const [secondsRemaining, setSecondsRemaining] = useState(durationSeconds);

  useEffect(() => {
    setSecondsRemaining(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, onComplete]);

  const progressPercent = ((durationSeconds - secondsRemaining) / durationSeconds) * 100;

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* Step Header with countdown */}
      <div className="senior-card p-6 sm:p-7 bg-white border-2 border-purple-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-3.5 bg-purple-100 text-purple-700 rounded-2xl shrink-0">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-0.5 rounded-full inline-block">
                Step 1: Memorization
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-200">
                Level: {difficulty}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Memorize these {targetObjects.length} objects
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-semibold">
              Look closely. They will hide in <span className="text-purple-700 font-black">{secondsRemaining} seconds</span>.
            </p>
          </div>
        </div>

        {/* Big Countdown Badge & Skip */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex flex-col items-center justify-center font-black shadow-md shrink-0">
            <span className="text-2xl">{secondsRemaining}s</span>
          </div>

          <button
            onClick={onComplete}
            className="px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-900 border-2 border-purple-300 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <span>I'm Ready</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Countdown Progress Bar */}
      <div className="w-full bg-purple-100 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-purple-600 h-full transition-all duration-1000 ease-linear rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 6 Target Objects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
        {targetObjects.map((item) => (
          <MemoryItemCard
            key={item.id}
            item={item}
            disabled={true}
            size="large"
          />
        ))}
      </div>
    </div>
  );
}

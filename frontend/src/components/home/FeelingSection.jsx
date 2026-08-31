import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

const MOOD_OPTIONS = [
  {
    id: 'good',
    emoji: '😊',
    label: 'Good',
    color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-950',
    activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-102',
    responseMessage: 'Wonderful to hear, Amma! Keep that lovely smile on your face.'
  },
  {
    id: 'okay',
    emoji: '😐',
    label: 'Okay',
    color: 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950',
    activeColor: 'bg-amber-500 text-white border-amber-500 shadow-lg scale-102',
    responseMessage: 'Taking it one step at a time. A warm cup of tea might help you feel refreshed!'
  },
  {
    id: 'not_good',
    emoji: '😔',
    label: 'Not good',
    color: 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-950',
    activeColor: 'bg-rose-600 text-white border-rose-600 shadow-lg scale-102',
    responseMessage: 'We are here for you, Amma. Daughter Priya has been sent a gentle check-in note.'
  }
];

export default function FeelingSection() {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleSelect = (moodId) => {
    setSelectedMood(moodId);
  };

  const selectedOption = MOOD_OPTIONS.find(m => m.id === selectedMood);

  return (
    <section aria-label="Daily Mood Check-in" className="senior-card p-6 sm:p-7 bg-white border-2 border-purple-200 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          How are you feeling today?
        </h2>
        <span className="text-xs sm:text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
          Daily Check-in
        </span>
      </div>

      {/* 3 Large Option Buttons */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {MOOD_OPTIONS.map((option) => {
          const isSelected = selectedMood === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              aria-label={`Feeling ${option.label}`}
              className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-3xl border-3 transition-all duration-200 cursor-pointer min-h-[110px] sm:min-h-[130px] select-none ${
                isSelected
                  ? option.activeColor
                  : `${option.color} hover:shadow-md active:scale-95`
              }`}
            >
              <span className="text-4xl sm:text-5xl md:text-6xl block mb-1">
                {option.emoji}
              </span>
              <span className={`text-base sm:text-xl font-extrabold block tracking-tight ${
                isSelected ? 'text-white' : 'text-gray-900'
              }`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Instant Feedback Message */}
      {selectedOption && (
        <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <Heart className="w-6 h-6 text-purple-700 shrink-0 fill-purple-200" />
          <p className="text-base sm:text-lg font-bold text-purple-950">
            {selectedOption.responseMessage}
          </p>
        </div>
      )}
    </section>
  );
}

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function FeelingSection() {
  const [selectedMood, setSelectedMood] = useState(null);
  const { t } = useLanguage();

  const moodOptions = [
    {
      id: 'good',
      emoji: '😊',
      label: t('home.moodGood'),
      color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-950',
      activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-102',
      responseMessage: t('home.moodGoodResponse')
    },
    {
      id: 'okay',
      emoji: '😐',
      label: t('home.moodOkay'),
      color: 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950',
      activeColor: 'bg-amber-500 text-white border-amber-500 shadow-lg scale-102',
      responseMessage: t('home.moodOkayResponse')
    },
    {
      id: 'not_good',
      emoji: '😔',
      label: t('home.moodNotGood'),
      color: 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-950',
      activeColor: 'bg-rose-600 text-white border-rose-600 shadow-lg scale-102',
      responseMessage: t('home.moodNotGoodResponse')
    }
  ];

  const handleSelect = (moodId) => {
    setSelectedMood(moodId);
  };

  const selectedOption = moodOptions.find(m => m.id === selectedMood);

  return (
    <section aria-label="Daily Mood Check-in" className="senior-card p-6 sm:p-7 bg-white border-2 border-purple-200 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          {t('home.howFeeling')}
        </h2>
        <span className="text-xs sm:text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
          {t('home.dailyCheckIn')}
        </span>
      </div>

      {/* 3 Large Option Buttons */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {moodOptions.map((option) => {
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

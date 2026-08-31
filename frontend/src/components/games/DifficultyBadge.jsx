import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function DifficultyBadge({ difficulty = 'Easy' }) {
  const { t } = useLanguage();
  const norm = difficulty.toLowerCase();

  let colorClasses = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  let dotCount = 1;
  let translatedText = t('difficulty.easy');

  if (norm.includes('medium') || norm.includes('moderate')) {
    colorClasses = 'bg-amber-100 text-amber-900 border-amber-300';
    dotCount = 2;
    translatedText = t('difficulty.medium');
  } else if (norm.includes('adaptive')) {
    colorClasses = 'bg-purple-100 text-purple-900 border-purple-300';
    dotCount = 3;
    translatedText = t('difficulty.adaptive');
  } else if (norm.includes('hard') || norm.includes('challenging')) {
    colorClasses = 'bg-purple-100 text-purple-900 border-purple-300';
    dotCount = 3;
    translatedText = t('difficulty.hard');
  }

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wide border ${colorClasses}`}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((dot) => (
          <span
            key={dot}
            className={`w-2 h-2 rounded-full ${
              dot <= dotCount
                ? norm.includes('medium')
                  ? 'bg-amber-600'
                  : norm.includes('adaptive') || norm.includes('hard')
                  ? 'bg-purple-600'
                  : 'bg-emerald-600'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </span>
      <span>{translatedText}</span>
    </span>
  );
}

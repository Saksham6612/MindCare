import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Sparkles } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function GameCard({
  title,
  description,
  difficulty = 'Easy',
  duration = '5–7 min',
  icon: Icon,
  route = '/games/memory',
  badgeText,
  isComingSoon = false
}) {
  const { t } = useLanguage();

  return (
    <div className="senior-card p-6 sm:p-7 bg-white border-2 border-purple-200 hover:border-purple-400 shadow-sm flex flex-col justify-between space-y-6 transition-all group">
      {/* Card Header & Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-4 rounded-2xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
            {Icon && <Icon className="w-8 h-8 sm:w-9 sm:h-9" />}
          </div>

          <div className="flex items-center gap-2">
            {badgeText && (
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-800 border border-purple-200">
                <Sparkles className="w-3 h-3 text-purple-600" />
                {badgeText}
              </span>
            )}
            <DifficultyBadge difficulty={difficulty} />
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-1 group-hover:text-purple-900 transition-colors">
            {title}
          </h3>
          <p className="text-lg sm:text-xl text-gray-600 font-semibold leading-relaxed">
            {description}
          </p>
        </div>

        {/* Metadata info */}
        <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-gray-500 pt-1">
          <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1 rounded-xl">
            <Clock className="w-4 h-4 text-purple-600" />
            {duration}
          </span>
        </div>
      </div>

      {/* Action Button: Large Play Button */}
      {isComingSoon ? (
        <button
          disabled
          className="w-full py-4 text-lg sm:text-xl font-extrabold rounded-2xl bg-gray-100 text-gray-400 border-2 border-gray-200 flex items-center justify-center gap-2 cursor-not-allowed"
        >
          <span>{t('games.comingSoon')}</span>
        </button>
      ) : (
        <Link
          to={route}
          aria-label={`Play ${title} game`}
          className="senior-btn-primary w-full py-4 text-xl sm:text-2xl font-extrabold rounded-2xl flex items-center justify-center gap-3 shadow-md active:scale-95 group/btn"
        >
          <Play className="w-6 h-6 fill-white group-hover/btn:scale-110 transition-transform" />
          <span>{t('games.playGame')}</span>
        </Link>
      )}
    </div>
  );
}

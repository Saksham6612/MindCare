import React, { useState } from 'react';
import { Droplets, Clock, Plus, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function HydrationCard() {
  const [glassesDrank, setGlassesDrank] = useState(3);
  const [hasLogged, setHasLogged] = useState(false);
  const { t } = useLanguage();

  const handleDrink = () => {
    setGlassesDrank(g => Math.min(8, g + 1));
    setHasLogged(true);
    setTimeout(() => setHasLogged(false), 3000);
  };

  return (
    <section 
      aria-label="Hydration Reminder Card"
      className="senior-card p-6 sm:p-7 bg-white border-2 border-sky-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
    >
      {/* Left: Water Icon & Info */}
      <div className="flex items-start gap-4 sm:gap-5">
        <div className="p-4 rounded-3xl bg-sky-100 text-sky-600 shrink-0">
          <Droplets className="w-9 h-9 sm:w-10 sm:h-10" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-0.5 rounded-full">
              {t('home.hydration')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-500">
              {t('home.glassesCount', { count: glassesDrank })}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('home.drinkWater')}
          </h3>

          <div className="flex items-center gap-1.5 text-base sm:text-lg font-bold text-sky-900 pt-0.5">
            <Clock className="w-5 h-5 text-sky-600" />
            <span>{t('home.nextReminderTime')}</span>
            <span className="text-gray-400 font-normal">• {t('home.glassUnit')}</span>
          </div>
        </div>
      </div>

      {/* Right: Drink Water Action Button */}
      <button
        onClick={handleDrink}
        aria-label="Log that you drank a glass of water"
        className={`w-full sm:w-auto py-4 px-6 sm:px-8 rounded-2xl font-extrabold text-lg sm:text-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-md active:scale-95 cursor-pointer shrink-0 ${
          hasLogged
            ? 'bg-emerald-600 text-white border-2 border-emerald-500'
            : 'bg-sky-600 hover:bg-sky-700 text-white border-2 border-sky-500'
        }`}
      >
        {hasLogged ? (
          <>
            <Check className="w-6 h-6 stroke-[3px]" />
            <span>{t('home.loggedGlassBtn')}</span>
          </>
        ) : (
          <>
            <Plus className="w-6 h-6 stroke-[3px]" />
            <span>{t('home.drinkWaterBtn')}</span>
          </>
        )}
      </button>
    </section>
  );
}

import React from 'react';
import { Sparkles, PhoneCall } from 'lucide-react';
import { useTimeOfDay } from '../../hooks/useTimeOfDay';
import { useLanguage } from '../../context/LanguageContext';

export default function HomeHeader({ onOpenSOS }) {
  const { greeting, formattedDate } = useTimeOfDay();
  const { t } = useLanguage();

  return (
    <header className="senior-card p-6 sm:p-7 bg-white border-2 border-purple-200 shadow-sm flex items-center justify-between gap-4">
      {/* Left: Greeting & Patient Name */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Elderly-friendly Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-purple-200 overflow-hidden shadow-md bg-purple-100 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
              alt="Amma's Profile Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=Amma&hair=long01&glassesProbability=100";
              }}
            />
          </div>
          <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" title={t('header.connected')} />
        </div>

        {/* Name & Time greeting */}
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100/80 text-purple-900 font-bold text-xs sm:text-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>{greeting.text}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t('home.patientName')}
          </h1>

          <p className="text-sm sm:text-base font-semibold text-gray-500">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Right: Emergency SOS Quick Access */}
      {onOpenSOS && (
        <button
          onClick={onOpenSOS}
          aria-label={t('header.sosHelpAria')}
          className="senior-btn-sos px-4 py-2.5 sm:px-5 sm:py-3 flex items-center gap-2 rounded-2xl text-white font-extrabold text-sm sm:text-base transition shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <PhoneCall className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline">{t('header.sosHelp')}</span>
        </button>
      )}
    </header>
  );
}

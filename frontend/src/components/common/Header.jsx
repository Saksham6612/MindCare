import React from 'react';
import { Heart, PhoneCall, Type, Eye, Sparkles, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTimeOfDay } from '../../hooks/useTimeOfDay';

export default function Header({ 
  onOpenSOS, 
  fontScale, 
  onCycleFontSize, 
  highContrast, 
  onToggleContrast 
}) {
  const { formattedTime, formattedDate } = useTimeOfDay();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'as' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b-2 border-[#EADBCE] shadow-xs px-4 sm:px-6 py-3.5 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
            <Heart className="w-7 h-7 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-purple-950 font-heading">
                {t('header.mindcare') || 'MindCare'}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                <Sparkles className="w-3 h-3" /> {t('header.senior_companion')}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 hidden sm:block">
              {t('header.location_sih')}
            </p>
          </div>
        </div>

        {/* Live Date & Time for Elderly Orientation */}
        <div className="hidden lg:flex flex-col items-center bg-white/80 border-2 border-purple-100 px-4 py-1.5 rounded-2xl shadow-xs">
          <span className="text-xl font-extrabold text-purple-900 tracking-wide">
            {formattedTime}
          </span>
          <span className="text-xs font-semibold text-gray-600">
            {formattedDate}
          </span>
        </div>

        {/* Accessibility & SOS Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Font Size Adjuster */}
          <button
            onClick={onCycleFontSize}
            title="Adjust text size"
            aria-label={`Change text size. Currently ${fontScale}`}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-white hover:bg-purple-50 border-2 border-purple-200 text-purple-900 rounded-xl font-bold text-sm sm:text-base transition shadow-xs active:scale-95"
          >
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <span className="uppercase text-xs tracking-wider">
              {fontScale === 'extra-large' ? t('header.xl_text') : fontScale === 'large' ? t('header.large_text') : t('header.normal_text')}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            title="Toggle Language"
            aria-label="Toggle Language"
            className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl border-2 font-bold text-sm sm:text-base flex items-center gap-1.5 transition shadow-xs active:scale-95 bg-white hover:bg-purple-50 border-purple-200 text-gray-700"
          >
            <Languages className="w-5 h-5 text-purple-600" />
            <span className="hidden md:inline text-xs uppercase tracking-wider">
              {i18n.language === 'as' ? 'অসমীয়া' : 'English'}
            </span>
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={onToggleContrast}
            title="Toggle High Contrast"
            aria-label="Toggle High Contrast Mode"
            className={`p-2.5 sm:px-3 sm:py-2.5 rounded-xl border-2 font-bold text-sm sm:text-base flex items-center gap-1.5 transition shadow-xs active:scale-95 ${
              highContrast 
                ? 'bg-black text-yellow-300 border-yellow-300' 
                : 'bg-white hover:bg-purple-50 border-purple-200 text-gray-700'
            }`}
          >
            <Eye className="w-5 h-5 text-purple-600" />
            <span className="hidden md:inline text-xs uppercase tracking-wider">
              {highContrast ? t('header.high_contrast_on') : t('header.contrast')}
            </span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSOS}
            aria-label="Open Emergency and Help Contacts"
            className="senior-btn-sos px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 rounded-xl text-white font-extrabold text-sm sm:text-base transition shadow-md active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-5 h-5 animate-pulse" />
            <span className="tracking-wide">{t('header.sos_help')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

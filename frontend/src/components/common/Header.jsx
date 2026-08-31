import React from 'react';
import { Heart, PhoneCall, Type, Eye, Sparkles, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTimeOfDay } from '../../hooks/useTimeOfDay';
import { logout } from '../../api/api';

export default function Header({ 
  onOpenSOS, 
  fontScale, 
  onCycleFontSize, 
  highContrast, 
  onToggleContrast 
}) {
  const { formattedTime, formattedDate } = useTimeOfDay();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/auth', { replace: true });
  }

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
                Mind<span className="text-purple-600">Care</span>
              </span>

              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                <Sparkles className="w-3 h-3" />
                Senior Companion
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-gray-500 hidden sm:block">
              Guwahati, Assam • SIH 2026
            </p>
          </div>
        </div>

        {/* Live Date & Time */}
        <div className="hidden lg:flex flex-col items-center bg-white/80 border-2 border-purple-100 px-4 py-1.5 rounded-2xl shadow-xs">
          <span className="text-xl font-extrabold text-purple-900 tracking-wide">
            {formattedTime}
          </span>

          <span className="text-xs font-semibold text-gray-600">
            {formattedDate}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Font Size */}
          <button
            onClick={onCycleFontSize}
            title="Adjust text size"
            aria-label={`Change text size. Currently ${fontScale}`}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-white hover:bg-purple-50 border-2 border-purple-200 text-purple-900 rounded-xl font-bold text-sm sm:text-base transition shadow-xs active:scale-95"
          >
            <Type className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />

            <span className="uppercase text-xs tracking-wider">
              {fontScale === 'extra-large'
                ? 'XL Text'
                : fontScale === 'large'
                ? 'Large Text'
                : 'Normal'}
            </span>
          </button>

          {/* High Contrast */}
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
              {highContrast ? 'High Contrast: On' : 'Contrast'}
            </span>
          </button>

          {/* SOS */}
          <button
            onClick={onOpenSOS}
            aria-label="Open Emergency and Help Contacts"
            className="senior-btn-sos px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 rounded-xl text-white font-extrabold text-sm sm:text-base transition shadow-md active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-5 h-5 animate-pulse" />
            <span className="tracking-wide">SOS HELP</span>
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout from MindCare"
            className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white hover:bg-red-50 border-2 border-red-200 text-red-600 font-bold text-sm sm:text-base transition shadow-xs active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">
              Logout
            </span>
          </button>

        </div>
      </div>
    </header>
  );
}

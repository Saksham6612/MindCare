import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Clock, Brain, User, Sparkles, Mic, HeartHandshake } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../utils/constants';
import { useLanguage } from '../../context/LanguageContext';

const ICON_MAP = {
  Home: Home,
  Brain: Brain,
  Clock: Clock,
  User: User,
  Sparkles: Sparkles,
  Mic: Mic,
  HeartHandshake: HeartHandshake,
};

const NAV_TRANSLATION_KEYS = {
  "/": "nav.home",
  "/games": "nav.games",
  "/reminders": "nav.reminders",
  "/caregiver": "nav.profile"
};

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <nav 
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/98 backdrop-blur-lg border-t-2 border-[#EADBCE] shadow-2xl py-2 px-2 sm:px-4"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-around gap-1 sm:gap-2">
        {NAVIGATION_ITEMS.map((item) => {
          const IconComponent = ICON_MAP[item.icon] || Home;
          const label = NAV_TRANSLATION_KEYS[item.path] ? t(NAV_TRANSLATION_KEYS[item.path]) : item.label;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-2xl font-bold transition-all select-none min-w-[70px] sm:min-w-[90px] ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-md scale-102 border-2 border-purple-800'
                    : 'text-gray-700 hover:bg-purple-100/70 hover:text-purple-900 border-2 border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent 
                    className={`w-6 h-6 sm:w-7 sm:h-7 mb-1 transition-transform ${
                      isActive ? 'stroke-[2.5px]' : 'stroke-2'
                    }`} 
                  />
                  <span className={`text-xs sm:text-sm tracking-tight ${
                    isActive ? 'font-extrabold text-white' : 'font-semibold text-gray-700'
                  }`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

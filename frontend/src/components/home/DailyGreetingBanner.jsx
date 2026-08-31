import React from 'react';
import { Sun, SunMedium, Sunset, Moon, MapPin, Sparkles } from 'lucide-react';
import { useTimeOfDay } from '../../hooks/useTimeOfDay';
import { patientProfile } from '../../data/mockData';

const GREETING_ICONS = {
  Sun: Sun,
  SunMedium: SunMedium,
  Sunset: Sunset,
  Moon: Moon
};

export default function DailyGreetingBanner() {
  const { greeting, formattedDate, formattedTime } = useTimeOfDay();
  const IconComponent = GREETING_ICONS[greeting.icon] || Sun;

  return (
    <section 
      aria-label="Daily Orientation and Greeting"
      className="senior-card p-6 sm:p-8 bg-gradient-to-br from-white via-[#FAF5FF] to-[#F3E8FF]/60 border-2 border-purple-200"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Greeting text & Orientation */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 text-purple-900 border border-purple-300 font-bold text-sm sm:text-base">
            <IconComponent className="w-5 h-5 text-purple-700" />
            <span>{greeting.text}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Hello, <span className="text-purple-700">{patientProfile.preferredName}</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-700 font-semibold leading-relaxed">
            {greeting.subtext}
          </p>

          {/* Location & Safety Reassurance */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-gray-600 font-medium text-base sm:text-lg">
            <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
              <MapPin className="w-5 h-5 text-purple-600 shrink-0" />
              <span>{patientProfile.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-200 font-semibold text-sm sm:text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>You are safe at home</span>
            </div>
          </div>
        </div>

        {/* Large Orientation Clock Badge for Elderly */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-purple-200 shadow-sm flex flex-col items-center justify-center text-center min-w-[200px] shrink-0">
          <span className="text-xs font-extrabold tracking-wider uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
            Today's Time
          </span>
          <span className="text-4xl sm:text-5xl font-black text-gray-900 my-2 tracking-tight">
            {formattedTime}
          </span>
          <span className="text-base sm:text-lg font-bold text-gray-700">
            {formattedDate}
          </span>
        </div>
      </div>
    </section>
  );
}

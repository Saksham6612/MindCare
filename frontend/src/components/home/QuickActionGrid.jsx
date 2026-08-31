import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BrainCircuit, HeartHandshake, ChevronRight } from 'lucide-react';
import { todaysReminders, patientProfile } from '../../data/mockData';

export default function QuickActionGrid() {
  const pendingCount = todaysReminders.filter(r => !r.completed).length;

  return (
    <section aria-label="Quick Action Cards" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Quick Shortcuts
        </h2>
        <span className="text-sm font-semibold text-gray-500">
          Tap any card to open
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Reminders & Schedule */}
        <Link
          to="/reminders"
          className="senior-card p-6 sm:p-7 border-2 border-purple-200 bg-white hover:border-purple-500 flex flex-col justify-between group transition-all"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-4 rounded-2xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition">
                <Clock className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 bg-purple-50 text-purple-800 rounded-full font-bold text-sm border border-purple-200">
                {pendingCount} Remaining
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-purple-700 transition">
              Daily Schedule
            </h3>
            <p className="text-base sm:text-lg text-gray-600 font-medium">
              View medicines, tea times, and evening walks scheduled for today.
            </p>
          </div>

          <div className="pt-5 flex items-center justify-between text-purple-700 font-bold text-lg border-t border-gray-100 mt-4">
            <span>Open Reminders</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition" />
          </div>
        </Link>

        {/* Card 2: Memory Games */}
        <Link
          to="/games/memory"
          className="senior-card p-6 sm:p-7 border-2 border-indigo-200 bg-white hover:border-indigo-500 flex flex-col justify-between group transition-all"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-4 rounded-2xl bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full font-bold text-sm border border-indigo-200">
                Daily Brain Exercise
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-indigo-700 transition">
              Memory Game
            </h3>
            <p className="text-base sm:text-lg text-gray-600 font-medium">
              Gentle photo-matching game designed to stimulate recall and focus.
            </p>
          </div>

          <div className="pt-5 flex items-center justify-between text-indigo-700 font-bold text-lg border-t border-gray-100 mt-4">
            <span>Play Memory Match</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition" />
          </div>
        </Link>

        {/* Card 3: Caregiver & Family */}
        <Link
          to="/caregiver"
          className="senior-card p-6 sm:p-7 border-2 border-emerald-200 bg-white hover:border-emerald-500 flex flex-col justify-between group transition-all"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-bold text-sm border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Connected
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-emerald-700 transition">
              Family & Care
            </h3>
            <p className="text-base sm:text-lg text-gray-600 font-medium">
              {patientProfile.caregiver.name} ({patientProfile.caregiver.relationship}) is monitoring your well-being.
            </p>
          </div>

          <div className="pt-5 flex items-center justify-between text-emerald-700 font-bold text-lg border-t border-gray-100 mt-4">
            <span>View Caregiver Info</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition" />
          </div>
        </Link>
      </div>
    </section>
  );
}

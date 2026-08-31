import React from 'react';
import { Heart, Phone, CheckCircle, ShieldCheck } from 'lucide-react';
import { patientProfile } from '../../data/mockData';

export default function CaregiverStatusBanner() {
  const { caregiver } = patientProfile;

  return (
    <section 
      aria-label="Caregiver Assurance Status"
      className="senior-card p-5 sm:p-6 bg-emerald-50/70 border-2 border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-600 text-white rounded-2xl shrink-0 shadow-xs">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-md">
              Family Connection Active
            </span>
            <span className="text-xs font-semibold text-gray-500">
              Synced {caregiver.lastCheckIn}
            </span>
          </div>
          <h4 className="text-lg sm:text-xl font-extrabold text-gray-900">
            {caregiver.name} ({caregiver.relationship}) is connected to your MindCare
          </h4>
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            {caregiver.note}
          </p>
        </div>
      </div>

      <a
        href={`tel:${caregiver.phone}`}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-sm transition active:scale-95 shrink-0"
      >
        <Phone className="w-5 h-5" />
        <span>Call Priya</span>
      </a>
    </section>
  );
}

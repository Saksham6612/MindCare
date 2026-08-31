import React, { useState } from 'react';
import { Pill, Clock, Check, CheckCircle2 } from 'lucide-react';

export default function MedicineCard() {
  const [isTaken, setIsTaken] = useState(false);

  return (
    <section 
      aria-label="Medicine Schedule Card"
      className="senior-card p-6 sm:p-7 bg-white border-2 border-purple-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
    >
      {/* Left: Icon & Info */}
      <div className="flex items-start gap-4 sm:gap-5">
        <div className={`p-4 rounded-3xl shrink-0 transition-colors ${
          isTaken ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
        }`}>
          <Pill className="w-9 h-9 sm:w-10 sm:h-10" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-0.5 rounded-full">
              Medication
            </span>
            {isTaken && (
              <span className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Taken
              </span>
            )}
          </div>

          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isTaken ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}>
            Morning Tablet
          </h3>

          <div className="flex items-center gap-1.5 text-base sm:text-lg font-bold text-purple-900 pt-0.5">
            <Clock className="w-5 h-5 text-purple-600" />
            <span>10:00 AM</span>
            <span className="text-gray-400 font-normal">• 1 Tablet with warm water</span>
          </div>
        </div>
      </div>

      {/* Right: Mark as Taken Action */}
      <button
        onClick={() => setIsTaken(!isTaken)}
        aria-label={isTaken ? "Morning Tablet marked as taken. Tap to undo." : "Mark Morning Tablet as Taken"}
        className={`w-full sm:w-auto py-4 px-6 sm:px-8 rounded-2xl font-extrabold text-lg sm:text-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-md active:scale-95 cursor-pointer shrink-0 ${
          isTaken
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-500'
            : 'bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500'
        }`}
      >
        {isTaken ? (
          <>
            <Check className="w-6 h-6 stroke-[3px]" />
            <span>Taken</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-6 h-6" />
            <span>Mark as Taken</span>
          </>
        )}
      </button>
    </section>
  );
}

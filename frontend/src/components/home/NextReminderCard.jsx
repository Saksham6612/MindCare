import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, Pill, Coffee, Check, ArrowRight } from 'lucide-react';
import { todaysReminders } from '../../data/mockData';

export default function NextReminderCard() {
  // Find first non-completed reminder or fallback to second reminder
  const initialReminder = todaysReminders.find(r => !r.completed) || todaysReminders[1];
  const [reminder, setReminder] = useState(initialReminder);
  const [isCompleted, setIsCompleted] = useState(reminder.completed);
  const [toastMessage, setToastMessage] = useState(null);

  const handleToggleComplete = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    if (nextState) {
      setToastMessage("Wonderful! Marked as done. Caregiver Priya has been notified.");
      setTimeout(() => setToastMessage(null), 5000);
    } else {
      setToastMessage(null);
    }
  };

  const isTeaOrFood = reminder.category === 'routine';

  return (
    <section 
      aria-label="Upcoming Reminder Card"
      className="senior-card p-6 sm:p-7 border-2 border-purple-300 relative bg-white"
    >
      {/* Card Header with Time Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-purple-100 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
            {isTeaOrFood ? <Coffee className="w-7 h-7" /> : <Pill className="w-7 h-7" />}
          </div>
          <div>
            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              Next Action Today
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {reminder.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 border-2 border-purple-200 px-4 py-2 rounded-2xl">
          <Clock className="w-6 h-6 text-purple-700" />
          <span className="text-2xl font-black text-purple-900">{reminder.time}</span>
        </div>
      </div>

      {/* Description & Dosage details in large text */}
      <div className="space-y-4">
        <p className="text-lg sm:text-xl font-semibold text-gray-700 leading-relaxed">
          {reminder.subtitle}
        </p>

        <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-2xl flex items-center gap-3 text-purple-950 font-bold text-base sm:text-lg">
          <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0" />
          <span>Instructions: {reminder.dosage}</span>
        </div>

        {/* Toast confirmation message */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl font-bold text-base sm:text-lg flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Actions row: Big Checkbox / Done button + Link to view all */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            onClick={handleToggleComplete}
            className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-extrabold text-lg sm:text-xl transition shadow-md active:scale-95 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-500'
                : 'bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-7 h-7 stroke-[3px]" />
                <span>Completed! Tap to undo</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-7 h-7" />
                <span>Mark as Done (I took this)</span>
              </>
            )}
          </button>

          <Link
            to="/reminders"
            className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gray-50 hover:bg-purple-50 text-purple-900 font-bold text-base sm:text-lg border-2 border-gray-200 hover:border-purple-300 transition"
          >
            <span>View All Today's Schedule</span>
            <ArrowRight className="w-5 h-5 text-purple-700" />
          </Link>
        </div>
      </div>
    </section>
  );
}

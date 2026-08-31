import React from 'react';
import { Pill, Droplets, Footprints, CalendarClock, Clock, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { REMINDER_TYPES } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

const TYPE_ICONS = {
  medicine: Pill,
  hydration: Droplets,
  activity: Footprints,
  appointment: CalendarClock
};

export default function ReminderCard({ reminder, onToggleComplete, onDelete }) {
  const { t, isBengali } = useLanguage();
  const typeConfig = REMINDER_TYPES[reminder.type] || REMINDER_TYPES.medicine;
  const Icon = TYPE_ICONS[reminder.type] || Pill;
  const typeLabel = t(`reminders.filter${reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}`) || typeConfig.label;
  const displayTitle = isBengali ? (reminder.title_bn || reminder.title) : reminder.title;
  const displayDesc = isBengali ? (reminder.description_bn || reminder.description) : reminder.description;

  return (
    <div
      className={`senior-card p-5 sm:p-6 border-2 transition-all ${
        reminder.completed
          ? 'bg-gray-50/80 border-gray-200 opacity-80'
          : `bg-white hover:border-purple-400 border-purple-200`
      }`}
      role="article"
      aria-label={`${reminder.title} reminder at ${reminder.time}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Icon + Content */}
        <div className="flex items-start gap-4">
          <div className={`p-4 rounded-2xl shrink-0 transition-colors ${
            reminder.completed
              ? 'bg-gray-100 text-gray-500'
              : `${typeConfig.bgClass} ${typeConfig.textClass}`
          }`}>
            <Icon className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          <div className="space-y-1.5 min-w-0">
            {/* Type badge + optional completed tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full border ${typeConfig.badgeBg}`}>
                {typeLabel}
              </span>
              {reminder.completed && (
                <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {t('reminders.completedBadge')}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight leading-snug ${
              reminder.completed ? 'text-gray-500 line-through decoration-gray-400' : 'text-gray-900'
            }`}>
              {displayTitle}
            </h3>

            {/* Description */}
            <p className="text-base sm:text-lg font-medium text-gray-600 leading-relaxed">
              {displayDesc}
            </p>

            {/* Time & date */}
            <div className="flex items-center gap-1.5 pt-1 text-base font-bold text-purple-900">
              <Clock className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{reminder.time}</span>
              <span className="text-gray-400 font-normal">· {reminder.date}</span>
            </div>
          </div>
        </div>

        {/* Right: Toggle + Delete */}
        <div className="flex sm:flex-col items-center sm:items-end gap-2.5 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 shrink-0">
          <button
            onClick={() => onToggleComplete(reminder.id)}
            aria-label={reminder.completed ? `Undo ${reminder.title}` : `Mark ${reminder.title} as done`}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-extrabold text-base sm:text-lg transition-all active:scale-95 cursor-pointer min-w-[160px] ${
              reminder.completed
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-500 shadow-sm'
                : 'bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 shadow-md'
            }`}
          >
            {reminder.completed ? (
              <>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{t('reminders.done')}</span>
              </>
            ) : (
              <>
                <Circle className="w-5 h-5 shrink-0 text-purple-200" />
                <span>{t('reminders.markDone')}</span>
              </>
            )}
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(reminder.id)}
              aria-label={`Delete ${reminder.title}`}
              className="p-3 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 border-2 border-transparent hover:border-rose-200 transition cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

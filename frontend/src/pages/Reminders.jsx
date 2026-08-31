import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, Sparkles, Pill, Droplets, Footprints, CalendarClock, Filter
} from 'lucide-react';
import { todaysReminders, REMINDER_TYPES } from '../data/mockData';
import ReminderCard from '../components/reminders/ReminderCard';
import AddReminderForm from '../components/reminders/AddReminderForm';

const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'All', icon: Filter },
  { value: 'medicine', label: 'Medicine', icon: Pill },
  { value: 'hydration', label: 'Hydration', icon: Droplets },
  { value: 'activity', label: 'Activity', icon: Footprints },
  { value: 'appointment', label: 'Appointment', icon: CalendarClock }
];

export default function Reminders() {
  const [reminders, setReminders] = useState(todaysReminders);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Toggle completion status
  const handleToggleComplete = (id) => {
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
    );
  };

  // Delete a reminder
  const handleDelete = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  // Add new reminder from form
  const handleAdd = (newReminder) => {
    setReminders(prev => [newReminder, ...prev]);
  };

  // Filter reminders: today's date + active type filter
  const todayReminders = reminders.filter(r => r.date === today);
  const filtered = activeFilter === 'all'
    ? todayReminders
    : todayReminders.filter(r => r.type === activeFilter);

  // Sort: incomplete first, then by time
  const sorted = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.time.localeCompare(b.time);
  });

  const completedCount = todayReminders.filter(r => r.completed).length;
  const totalCount = todayReminders.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-7 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-700 font-bold text-base hover:underline mb-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Today's Reminders
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-semibold">
            Tap <strong className="text-purple-700">"Mark Done"</strong> after completing each item.
          </p>
        </div>

        {/* Add Reminder button */}
        <button
          onClick={() => setShowForm(true)}
          className="senior-btn-primary py-3.5 px-6 text-lg sm:text-xl font-extrabold flex items-center gap-2 shrink-0 self-start sm:self-auto"
          aria-label="Add a new reminder"
        >
          <Plus className="w-6 h-6" />
          Add Reminder
        </button>
      </div>

      {/* Progress Summary Card */}
      <div className="senior-card p-5 sm:p-6 bg-white border-2 border-purple-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-base sm:text-lg font-extrabold text-purple-900 uppercase tracking-wide">
              Daily Progress
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-gray-900">
            {completedCount} <span className="text-gray-400 font-semibold text-xl">/ {totalCount} done</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-purple-100 rounded-full h-4 overflow-hidden">
          <div
            className="bg-purple-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progressPct}% reminders completed`}
          />
        </div>

        {/* Type Summary pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.entries(REMINDER_TYPES).map(([key, cfg]) => {
            const count = todayReminders.filter(r => r.type === key).length;
            if (count === 0) return null;
            const done = todayReminders.filter(r => r.type === key && r.completed).length;
            return (
              <span key={key} className={`text-xs font-bold px-3 py-1 rounded-xl border ${cfg.badgeBg}`}>
                {cfg.label}: {done}/{count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {TYPE_FILTER_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = activeFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm sm:text-base border-2 transition cursor-pointer ${
                isActive
                  ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Reminders List */}
      {sorted.length > 0 ? (
        <div className="space-y-4">
          {sorted.map(reminder => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="senior-card p-8 sm:p-12 bg-white border-2 border-purple-100 text-center space-y-3">
          <p className="text-5xl">🌸</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            {activeFilter === 'all'
              ? 'No reminders for today yet.'
              : `No ${REMINDER_TYPES[activeFilter]?.label} reminders today.`}
          </h3>
          <p className="text-lg text-gray-500 font-semibold">
            Tap "Add Reminder" above to create one.
          </p>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showForm && (
        <AddReminderForm
          onAdd={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { X, Plus, Clock, Calendar, AlignLeft, Tag } from 'lucide-react';
import { REMINDER_TYPES } from '../../data/mockData';

const TYPE_OPTIONS = [
  { value: 'medicine', label: '💊 Medicine' },
  { value: 'hydration', label: '💧 Hydration' },
  { value: 'activity', label: '🚶 Daily Activity' },
  { value: 'appointment', label: '🏥 Medical Appointment' }
];

const EMPTY_FORM = {
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  time: '09:00 AM',
  type: 'medicine'
};

export default function AddReminderForm({ onAdd, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Please enter a reminder title.';
    if (!form.time.trim()) next.time = 'Please choose a time.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    onAdd({
      id: `rem-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim() || typeConfig.label + ' reminder',
      date: form.date,
      time: form.time,
      type: form.type,
      completed: false
    });

    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  const typeConfig = REMINDER_TYPES[form.type] || REMINDER_TYPES.medicine;

  const inputBase =
    'w-full px-4 py-3 rounded-2xl border-2 text-lg font-semibold text-gray-900 bg-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-reminder-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 sm:p-7 border-b-2 border-purple-100">
          <div>
            <h2 id="add-reminder-title" className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Add New Reminder
            </h2>
            <p className="text-base sm:text-lg text-gray-500 font-semibold">
              Fill in the details below and tap "Save".
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close form"
            className="p-2.5 rounded-2xl hover:bg-gray-100 text-gray-500 transition cursor-pointer"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {/* Reminder Type */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
              <Tag className="w-5 h-5 text-purple-600" />
              Reminder Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                  className={`p-3.5 rounded-2xl border-2 font-bold text-base sm:text-lg text-left transition cursor-pointer ${
                    form.type === opt.value
                      ? `${REMINDER_TYPES[opt.value].bgClass} ${REMINDER_TYPES[opt.value].borderClass} ${REMINDER_TYPES[opt.value].textClass}`
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="rem-title" className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
              <AlignLeft className="w-5 h-5 text-purple-600" />
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="rem-title"
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Evening Blood Pressure Tablet"
              className={`${inputBase} ${errors.title ? 'border-rose-400' : 'border-gray-200'}`}
            />
            {errors.title && (
              <p className="text-rose-600 font-bold text-sm">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="rem-desc" className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
              <AlignLeft className="w-5 h-5 text-purple-600" />
              Description (Optional)
            </label>
            <textarea
              id="rem-desc"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Extra notes or instructions..."
              rows={3}
              className={`${inputBase} resize-none`}
            />
          </div>

          {/* Date & Time row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="rem-date" className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
                <Calendar className="w-5 h-5 text-purple-600" />
                Date
              </label>
              <input
                id="rem-date"
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className={`${inputBase} border-gray-200`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rem-time" className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
                <Clock className="w-5 h-5 text-purple-600" />
                Time <span className="text-rose-500">*</span>
              </label>
              <input
                id="rem-time"
                type="time"
                value={form.time.includes(':') && !form.time.includes('M')
                  ? form.time
                  : (() => {
                      // Convert "09:00 AM" to "09:00"
                      try {
                        const d = new Date(`1970-01-01 ${form.time}`);
                        return isNaN(d) ? '09:00' : d.toTimeString().slice(0,5);
                      } catch { return '09:00'; }
                    })()
                }
                onChange={e => {
                  // Convert back to "HH:MM AM/PM"
                  try {
                    const [hh, mm] = e.target.value.split(':');
                    const d = new Date();
                    d.setHours(parseInt(hh), parseInt(mm));
                    const formatted = d.toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit', hour12: true
                    });
                    setForm(f => ({ ...f, time: formatted }));
                  } catch {
                    setForm(f => ({ ...f, time: e.target.value }));
                  }
                }}
                className={`${inputBase} ${errors.time ? 'border-rose-400' : 'border-gray-200'}`}
              />
              {errors.time && (
                <p className="text-rose-600 font-bold text-sm">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
            <button
              type="submit"
              className="senior-btn-primary flex items-center justify-center gap-2 py-4 text-xl font-extrabold flex-1"
            >
              <Plus className="w-6 h-6" />
              Save Reminder
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-4 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xl border-2 border-gray-200 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

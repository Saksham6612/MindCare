import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, Clock } from 'lucide-react';
import MemoryItemCard from './MemoryItemCard';

export default function RecallStep({ selectableOptions, onSubmit }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Measure response time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => +(prev + 0.1).toFixed(1));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedIds, elapsedSeconds);
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* Header with instructions & live timer */}
      <div className="senior-card p-6 sm:p-7 bg-white border-2 border-purple-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-3.5 bg-purple-100 text-purple-700 rounded-2xl shrink-0">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-0.5 rounded-full inline-block mb-1">
              Step 2: Recall
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Which objects did you see?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-semibold">
              Tap the cards you remember from earlier, then submit your answers.
            </p>
          </div>
        </div>

        {/* Live response time indicator */}
        <div className="flex items-center gap-2 bg-purple-50 border-2 border-purple-200 px-4 py-2 rounded-2xl shrink-0">
          <Clock className="w-5 h-5 text-purple-600" />
          <span className="text-lg font-black text-purple-900">{elapsedSeconds}s</span>
        </div>
      </div>

      {/* Selectable Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
        {selectableOptions.map((item) => (
          <MemoryItemCard
            key={item.id}
            item={item}
            isSelected={selectedIds.includes(item.id)}
            onClick={() => toggleSelect(item.id)}
            size="large"
          />
        ))}
      </div>

      {/* Submit Action Bar */}
      <div className="senior-card p-5 sm:p-6 bg-white border-2 border-purple-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-gray-700 font-bold text-lg sm:text-xl">
          Selected: <span className="text-purple-700 font-black text-2xl">{selectedIds.length}</span> objects
        </div>

        <button
          onClick={handleSubmit}
          disabled={selectedIds.length === 0}
          className={`w-full sm:w-auto py-4 px-8 sm:px-10 text-xl sm:text-2xl font-extrabold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-md active:scale-95 cursor-pointer ${
            selectedIds.length > 0
              ? 'senior-btn-primary'
              : 'bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed shadow-none'
          }`}
        >
          <CheckCircle className="w-6 h-6" />
          <span>Submit Answers</span>
        </button>
      </div>
    </div>
  );
}

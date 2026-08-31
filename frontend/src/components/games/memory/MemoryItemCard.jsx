import React from 'react';
import { Check, X } from 'lucide-react';

export default function MemoryItemCard({
  item,
  isSelected = false,
  onClick,
  showResult = false,
  isCorrect = false,
  isMissed = false,
  isExtra = false,
  disabled = false,
  size = 'normal'
}) {
  const isLarge = size === 'large';

  // Determine styling based on mode
  let borderBgClass = 'bg-white border-2 border-purple-200 hover:border-purple-400 text-gray-900';

  if (showResult) {
    if (isCorrect) {
      borderBgClass = 'bg-emerald-50 border-3 border-emerald-500 text-emerald-950';
    } else if (isMissed) {
      borderBgClass = 'bg-amber-50 border-3 border-amber-400 text-amber-950';
    } else if (isExtra) {
      borderBgClass = 'bg-rose-50 border-3 border-rose-400 text-rose-950';
    } else {
      borderBgClass = 'bg-gray-50 border-2 border-gray-200 opacity-60 text-gray-500';
    }
  } else if (isSelected) {
    borderBgClass = 'bg-purple-50 border-3 border-purple-600 text-purple-950 shadow-md scale-102';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${item.name} ${isSelected ? '(Selected)' : ''}`}
      className={`rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center transition-all duration-150 select-none relative ${
        disabled && !showResult ? 'cursor-default' : 'cursor-pointer active:scale-95'
      } ${isLarge ? 'min-h-[140px] sm:min-h-[160px]' : 'min-h-[120px] sm:min-h-[140px]'} ${borderBgClass}`}
    >
      {/* Selected Checkmark Badge */}
      {isSelected && !showResult && (
        <span className="absolute top-3 right-3 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-xs">
          <Check className="w-4 h-4 stroke-[3px]" />
        </span>
      )}

      {/* Result Status Badges */}
      {showResult && isCorrect && (
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-emerald-600 text-white text-xs font-black rounded-lg flex items-center gap-1">
          <Check className="w-3.5 h-3.5 stroke-[3px]" /> Correct
        </span>
      )}

      {showResult && isMissed && (
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-amber-600 text-white text-xs font-black rounded-lg">
          Missed
        </span>
      )}

      {showResult && isExtra && (
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-rose-600 text-white text-xs font-black rounded-lg flex items-center gap-1">
          <X className="w-3.5 h-3.5 stroke-[3px]" /> Not Shown
        </span>
      )}

      {/* Emoji Graphic */}
      <span className={`${isLarge ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl'} block mb-2`}>
        {item.emoji}
      </span>

      {/* Label */}
      <span className="text-base sm:text-lg font-extrabold text-center block tracking-tight">
        {item.name}
      </span>
    </button>
  );
}

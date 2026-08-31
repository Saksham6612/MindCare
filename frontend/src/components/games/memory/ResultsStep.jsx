import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, RotateCcw, ArrowLeft, CheckCircle2, XCircle, Clock, Sparkles, Brain, ArrowUpRight, TrendingUp } from 'lucide-react';
import MemoryItemCard from './MemoryItemCard';
import DifficultyBadge from '../DifficultyBadge';

export default function ResultsStep({
  score,
  totalTargets,
  correctItems,
  missedItems,
  extraItems,
  responseTime,
  recommendation,
  nextDifficulty,
  currentDifficulty,
  adaptiveStatus = 'maintained',
  onPlayAgain
}) {
  const percentage = Math.round((score / totalTargets) * 100);

  let celebrationTitle = "Wonderful Memory, Amma! 🎉";
  let celebrationMessage = "You remembered the objects with great accuracy!";
  let badgeColor = "bg-emerald-100 text-emerald-900 border-emerald-300";

  if (percentage === 100) {
    celebrationTitle = "Perfect Recall, Amma! 🌟";
    celebrationMessage = "Outstanding! You remembered all objects without a single mistake!";
  } else if (percentage < 50) {
    celebrationTitle = "Good Practice, Amma! 🌸";
    celebrationMessage = "Every daily exercise strengthens your memory pathways. Great effort!";
    badgeColor = "bg-purple-100 text-purple-900 border-purple-300";
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto">
      {/* 1. Score & Celebration Hero Card */}
      <div className="senior-card p-7 sm:p-9 bg-gradient-to-br from-white via-purple-50/50 to-indigo-50/40 border-3 border-purple-300 text-center space-y-4 shadow-md">
        <div className="w-20 h-20 bg-purple-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg">
          <Trophy className="w-11 h-11" />
        </div>

        <div className="space-y-1">
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-extrabold uppercase tracking-wide border ${badgeColor}`}>
            Game Completed
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            {celebrationTitle}
          </h2>
          <p className="text-lg sm:text-xl font-semibold text-gray-600 max-w-md mx-auto">
            {celebrationMessage}
          </p>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-3 max-w-xl mx-auto">
          {/* Score */}
          <div className="bg-white border-2 border-purple-200 p-4 rounded-2xl shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase block">Score</span>
            <span className="text-3xl sm:text-4xl font-black text-purple-900 block">
              {score} / {totalTargets}
            </span>
            <span className="text-xs font-bold text-emerald-700">{percentage}% Accuracy</span>
          </div>

          {/* Response Time */}
          <div className="bg-white border-2 border-purple-200 p-4 rounded-2xl shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase block">Response Time</span>
            <span className="text-3xl sm:text-4xl font-black text-purple-900 block">
              {responseTime}s
            </span>
            <span className="text-xs font-bold text-purple-700">Elapsed Time</span>
          </div>

          {/* Current Level */}
          <div className="bg-white border-2 border-purple-200 p-4 rounded-2xl shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-xs font-bold text-gray-500 uppercase block">Current Level</span>
            <span className="text-2xl sm:text-3xl font-black text-purple-900 block mt-1">
              {currentDifficulty}
            </span>
            <span className="text-xs font-bold text-purple-600">Adaptive</span>
          </div>
        </div>
      </div>

      {/* 2. Adaptive Difficulty Recommendation Card */}
      {recommendation && (
        <div className="senior-card p-6 sm:p-7 bg-purple-50/80 border-3 border-purple-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm sm:text-base">
              <Brain className="w-5 h-5 text-purple-700 shrink-0" />
              <span>Adaptive Difficulty Recommendation</span>
            </div>
            {nextDifficulty && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-500">Next:</span>
                <DifficultyBadge difficulty={nextDifficulty} />
              </div>
            )}
          </div>

          <p className="text-lg sm:text-xl font-bold text-purple-950 leading-relaxed">
            "{recommendation}"
          </p>
        </div>
      )}

      {/* 3. Breakdown: Correct Answers */}
      {correctItems.length > 0 && (
        <div className="senior-card p-6 sm:p-7 bg-white border-2 border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Correct Answers ({correctItems.length})
              </h3>
              <p className="text-sm sm:text-base font-semibold text-emerald-800">
                Objects you saw and correctly selected
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {correctItems.map((item) => (
              <MemoryItemCard
                key={item.id}
                item={item}
                showResult={true}
                isCorrect={true}
                disabled={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. Breakdown: Missed or Extra Answers (if any) */}
      {(missedItems.length > 0 || extraItems.length > 0) && (
        <div className="senior-card p-6 sm:p-7 bg-white border-2 border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Review & Learn
              </h3>
              <p className="text-sm sm:text-base font-semibold text-gray-600">
                Items missed or unshown cards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {missedItems.map((item) => (
              <MemoryItemCard
                key={item.id}
                item={item}
                showResult={true}
                isMissed={true}
                disabled={true}
              />
            ))}
            {extraItems.map((item) => (
              <MemoryItemCard
                key={item.id}
                item={item}
                showResult={true}
                isExtra={true}
                disabled={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-2">
        <button
          onClick={onPlayAgain}
          className="senior-btn-primary py-4 px-8 text-xl font-extrabold flex items-center justify-center gap-3"
        >
          <RotateCcw className="w-6 h-6" />
          <span>Play Again</span>
        </button>

        <Link
          to="/games"
          className="py-4 px-8 rounded-2xl bg-white hover:bg-purple-50 text-purple-900 font-extrabold text-xl border-2 border-purple-200 flex items-center justify-center gap-2 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>All Brain Games</span>
        </Link>
      </div>
    </div>
  );
}

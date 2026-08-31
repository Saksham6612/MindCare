import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MemorizeStep from '../components/games/memory/MemorizeStep';
import RecallStep from '../components/games/memory/RecallStep';
import ResultsStep from '../components/games/memory/ResultsStep';
import { evaluateAdaptiveDifficulty, DIFFICULTY_CONFIG } from '../utils/adaptiveDifficulty';

const ALL_OBJECTS_POOL = [
  { id: 'tea', name: 'Assam Tea', emoji: '🍵' },
  { id: 'orchid', name: 'Kopou Orchid', emoji: '🌺' },
  { id: 'rhino', name: 'One-horn Rhino', emoji: '🦏' },
  { id: 'apple', name: 'Red Apple', emoji: '🍎' },
  { id: 'mango', name: 'Sweet Mango', emoji: '🥭' },
  { id: 'bell', name: 'Temple Bell', emoji: '🔔' },
  { id: 'lotus', name: 'Pink Lotus', emoji: '🪷' },
  { id: 'banana', name: 'Fresh Banana', emoji: '🍌' },
  { id: 'coconut', name: 'Tender Coconut', emoji: '🥥' },
  { id: 'parrot', name: 'Green Parrot', emoji: '🦜' },
  { id: 'elephant', name: 'Gentle Elephant', emoji: '🐘' },
  { id: 'sun', name: 'Morning Sun', emoji: '☀️' }
];

export default function MemoryGame() {
  const { t } = useTranslation();
  // Adaptive Difficulty State
  const [currentDifficulty, setCurrentDifficulty] = useState(() => {
    return localStorage.getItem('mindcare_memory_difficulty') || 'Easy';
  });

  const [recentScores, setRecentScores] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mindcare_memory_scores') || '[]');
    } catch {
      return [];
    }
  });

  // Game states: 'memorize' | 'recall' | 'results'
  const [gameState, setGameState] = useState('memorize');
  const [targetObjects, setTargetObjects] = useState([]);
  const [selectableOptions, setSelectableOptions] = useState([]);
  const [resultsData, setResultsData] = useState({
    score: 0,
    totalTargets: 6,
    correctItems: [],
    missedItems: [],
    extraItems: [],
    responseTime: 0,
    recommendation: '',
    nextDifficulty: 'Easy',
    adaptiveStatus: 'maintained'
  });

  // Start / Reset Game based on currentDifficulty
  const startNewGame = useCallback((difficultyToUse) => {
    const diff = difficultyToUse || currentDifficulty;
    const config = DIFFICULTY_CONFIG[diff] || DIFFICULTY_CONFIG.Easy;
    
    // Shuffle pool
    const shuffledPool = [...ALL_OBJECTS_POOL].sort(() => 0.5 - Math.random());
    
    // Pick targets according to difficulty config (e.g. 6 for Easy, 7 for Medium, 8 for Hard)
    const targets = shuffledPool.slice(0, config.targetCount);
    
    // Pick distractors
    const distractors = shuffledPool.slice(config.targetCount, config.targetCount + config.distractorCount);
    
    // Combine targets + distractors for recall and shuffle
    const recallPool = [...targets, ...distractors].sort(() => 0.5 - Math.random());

    setTargetObjects(targets);
    setSelectableOptions(recallPool);
    setGameState('memorize');
  }, [currentDifficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Transition from Memorize to Recall
  const handleMemorizeComplete = () => {
    setGameState('recall');
  };

  // Submit recalled answers & run Adaptive Difficulty Evaluation
  const handleRecallSubmit = (selectedIds, responseTime) => {
    const targetIds = targetObjects.map((t) => t.id);

    // Correctly chosen
    const correct = targetObjects.filter((t) => selectedIds.includes(t.id));
    
    // Targets user missed
    const missed = targetObjects.filter((t) => !selectedIds.includes(t.id));
    
    // Extra distractors mistakenly picked
    const extra = selectableOptions.filter(
      (opt) => selectedIds.includes(opt.id) && !targetIds.includes(opt.id)
    );

    const score = correct.length;
    const accuracyPct = Math.round((score / targetObjects.length) * 100);

    // Run Adaptive Engine Evaluation
    const { nextDifficulty, recommendation, status } = evaluateAdaptiveDifficulty({
      accuracy: accuracyPct,
      responseTime,
      currentDifficulty,
      recentScores
    });

    // Save performance entry
    const newEntry = {
      score,
      total: targetObjects.length,
      accuracy: accuracyPct,
      responseTime,
      difficulty: currentDifficulty,
      date: new Date().toISOString()
    };
    const updatedHistory = [newEntry, ...recentScores].slice(0, 10);
    setRecentScores(updatedHistory);
    localStorage.setItem('mindcare_memory_scores', JSON.stringify(updatedHistory));
    localStorage.setItem('mindcare_memory_difficulty', nextDifficulty);

    setResultsData({
      score,
      totalTargets: targetObjects.length,
      correctItems: correct,
      missedItems: missed,
      extraItems: extra,
      responseTime,
      recommendation,
      nextDifficulty,
      adaptiveStatus: status
    });

    setGameState('results');
  };

  // Handle Play Again button click
  const handlePlayAgain = () => {
    const nextDiff = resultsData.nextDifficulty || currentDifficulty;
    setCurrentDifficulty(nextDiff);
    startNewGame(nextDiff);
  };

  const currentConfig = DIFFICULTY_CONFIG[currentDifficulty] || DIFFICULTY_CONFIG.Easy;

  return (
    <div className="space-y-6 sm:space-y-7 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            to="/games"
            className="inline-flex items-center gap-2 text-purple-700 font-bold text-base hover:underline mb-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('games.back_to_games', { defaultValue: 'Back to All Games' })}</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <span>{t('home.memory_challenge', { defaultValue: 'Memory Challenge' })}</span>
            <span className="text-xs font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              {t(`games.${currentDifficulty.toLowerCase()}`, { defaultValue: currentDifficulty })} {t('home.level', { defaultValue: 'Level' })}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-600 bg-white border-2 border-purple-200 px-4 py-2 rounded-2xl self-start sm:self-auto shadow-2xs">
          <Brain className="w-5 h-5 text-purple-600" />
          <span>{t('games.adaptive_engine', { defaultValue: 'Adaptive Cognitive Engine' })}</span>
        </div>
      </div>

      {/* Step 1: Memorization Phase */}
      {gameState === 'memorize' && targetObjects.length > 0 && (
        <MemorizeStep
          targetObjects={targetObjects}
          onComplete={handleMemorizeComplete}
          durationSeconds={currentConfig.memorizeDurationSeconds}
          difficulty={currentDifficulty}
        />
      )}

      {/* Step 2: Selection / Recall Phase */}
      {gameState === 'recall' && (
        <RecallStep
          selectableOptions={selectableOptions}
          onSubmit={handleRecallSubmit}
        />
      )}

      {/* Step 3: Results & Feedback Phase with Adaptive Recommendation */}
      {gameState === 'results' && (
        <ResultsStep
          score={resultsData.score}
          totalTargets={resultsData.totalTargets}
          correctItems={resultsData.correctItems}
          missedItems={resultsData.missedItems}
          extraItems={resultsData.extraItems}
          responseTime={resultsData.responseTime}
          recommendation={resultsData.recommendation}
          nextDifficulty={resultsData.nextDifficulty}
          currentDifficulty={currentDifficulty}
          adaptiveStatus={resultsData.adaptiveStatus}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

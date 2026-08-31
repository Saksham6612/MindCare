// Adaptive Difficulty Engine for MindCare Cognitive Games
// Deterministic, explainable, and tailored for elderly dementia cognitive progression

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

export const DIFFICULTY_CONFIG = {
  Easy: {
    targetCount: 6,
    memorizeDurationSeconds: 5,
    distractorCount: 3,
    label: 'Easy (Gentle)',
    description: '6 objects, 5 seconds study time'
  },
  Medium: {
    targetCount: 7,
    memorizeDurationSeconds: 4,
    distractorCount: 3,
    label: 'Medium (Moderate)',
    description: '7 objects, 4 seconds study time'
  },
  Hard: {
    targetCount: 8,
    memorizeDurationSeconds: 4,
    distractorCount: 4,
    label: 'Hard (Challenging)',
    description: '8 objects, 4 seconds study time'
  }
};

/**
 * Evaluates performance and deterministically calculates the next difficulty and recommendation message.
 *
 * @param {Object} params
 * @param {number} params.accuracy - Accuracy percentage (0 to 100) or decimal (0 to 1)
 * @param {number} params.responseTime - Time taken in seconds
 * @param {string} params.currentDifficulty - 'Easy' | 'Medium' | 'Hard'
 * @param {Array} params.recentScores - Past scores history
 * @returns {{ nextDifficulty: string, recommendation: string, status: 'increased' | 'maintained' | 'decreased' }}
 */
export function evaluateAdaptiveDifficulty({
  accuracy,
  responseTime,
  currentDifficulty = 'Easy',
  recentScores = []
}) {
  // Normalize accuracy to percentage (0 - 100)
  const accPct = accuracy <= 1 ? accuracy * 100 : accuracy;
  const time = typeof responseTime === 'number' ? responseTime : parseFloat(responseTime) || 10;
  
  let nextDifficulty = currentDifficulty;
  let status = 'maintained';
  let recommendation = '';
  let recommendationKey = 'maintained';
  let recommendationParams = {};

  const currentIndex = DIFFICULTY_LEVELS.indexOf(currentDifficulty);
  const validIndex = currentIndex >= 0 ? currentIndex : 0;

  // RULE 1: Excellent performance (High accuracy + prompt recall) -> Increase difficulty
  if (accPct >= 85 && time <= 15) {
    if (validIndex < DIFFICULTY_LEVELS.length - 1) {
      nextDifficulty = DIFFICULTY_LEVELS[validIndex + 1];
      status = 'increased';
      recommendationKey = 'increased';
      recommendationParams = { nextDifficulty };
      recommendation = `Great job! Your recall was fast and accurate. Tomorrow's challenge will be slightly harder (${nextDifficulty}).`;
    } else {
      nextDifficulty = 'Hard';
      status = 'maintained';
      recommendationKey = 'atMax';
      recommendationParams = {};
      recommendation = "Outstanding recall! You are mastering our highest difficulty level with great precision.";
    }
  }
  // RULE 2: Poor performance (Low accuracy or significant struggle) -> Decrease difficulty
  else if (accPct < 50 || (accPct <= 60 && time > 18)) {
    if (validIndex > 0) {
      nextDifficulty = DIFFICULTY_LEVELS[validIndex - 1];
      status = 'decreased';
      recommendationKey = 'decreased';
      recommendationParams = { nextDifficulty };
      recommendation = `Good effort, Amma! We have adjusted the challenge to a gentler pace (${nextDifficulty}) so you can practice comfortably.`;
    } else {
      nextDifficulty = 'Easy';
      status = 'maintained';
      recommendationKey = 'atMin';
      recommendationParams = {};
      recommendation = "Keep practicing at your own gentle pace. Regular daily exercise strengthens memory retention.";
    }
  }
  // RULE 3: Average / Steady performance -> Maintain difficulty
  else {
    nextDifficulty = currentDifficulty;
    status = 'maintained';
    recommendationKey = 'maintained';
    recommendationParams = {};
    recommendation = "Steady progress! You are performing well. We'll keep this comfortable level for your next session.";
  }

  return {
    nextDifficulty,
    recommendation,
    recommendationKey,
    recommendationParams,
    status
  };
}

/**
 * XP Calculator Utility
 * Centralized XP calculations, level thresholds, and progression logic
 */

// XP awarded for each action
const XP_ACTIONS = {
  INTERVIEW_COMPLETED: 50,
  SCORE_ABOVE_8: 30,
  DAILY_PRACTICE: 20,
  QUIZ_COMPLETED: 30,
  CAREER_PATH_CREATED: 40,
  BADGE_EARNED: 25,
  ROADMAP_STEP_COMPLETED: 15,
};

// Level thresholds
const LEVEL_THRESHOLDS = [
  { name: 'Beginner', minXP: 0, maxXP: 199 },
  { name: 'Learner', minXP: 200, maxXP: 499 },
  { name: 'Skilled', minXP: 500, maxXP: 999 },
  { name: 'Interview Ready', minXP: 1000, maxXP: Infinity },
];

/**
 * Calculate level from XP points
 * @param {number} xpPoints - Total XP points
 * @returns {string} Level name
 */
function calculateLevel(xpPoints) {
  if (xpPoints >= 1000) return 'Interview Ready';
  if (xpPoints >= 500) return 'Skilled';
  if (xpPoints >= 200) return 'Learner';
  return 'Beginner';
}

/**
 * Get progress towards next level
 * @param {number} xpPoints - Total XP points
 * @returns {{ currentLevel: string, nextLevel: string|null, progressPercent: number, xpToNextLevel: number }}
 */
function getLevelProgress(xpPoints) {
  const currentLevel = calculateLevel(xpPoints);
  const currentThreshold = LEVEL_THRESHOLDS.find(l => l.name === currentLevel);
  const currentIndex = LEVEL_THRESHOLDS.indexOf(currentThreshold);

  if (currentIndex === LEVEL_THRESHOLDS.length - 1) {
    return {
      currentLevel,
      nextLevel: null,
      progressPercent: 100,
      xpToNextLevel: 0,
    };
  }

  const nextThreshold = LEVEL_THRESHOLDS[currentIndex + 1];
  const xpInCurrentLevel = xpPoints - currentThreshold.minXP;
  const xpNeededForLevel = nextThreshold.minXP - currentThreshold.minXP;
  const progressPercent = Math.round((xpInCurrentLevel / xpNeededForLevel) * 100);

  return {
    currentLevel,
    nextLevel: nextThreshold.name,
    progressPercent: Math.min(progressPercent, 100),
    xpToNextLevel: nextThreshold.minXP - xpPoints,
  };
}

/**
 * Calculate XP earned for completing an interview
 * @param {number} averageScore - Average interview score (0-10)
 * @returns {{ baseXP: number, bonusXP: number, totalXP: number, reason: string }}
 */
function calculateInterviewXP(averageScore) {
  let baseXP = XP_ACTIONS.INTERVIEW_COMPLETED;
  let bonusXP = 0;
  let reason = 'Completed mock interview';

  if (averageScore >= 8) {
    bonusXP = XP_ACTIONS.SCORE_ABOVE_8;
    reason += ` with high score (${averageScore.toFixed(1)}/10)`;
  }

  return {
    baseXP,
    bonusXP,
    totalXP: baseXP + bonusXP,
    reason,
  };
}

/**
 * Calculate adaptive difficulty based on recent scores
 * @param {number[]} recentScores - Array of recent average scores
 * @param {string} currentDifficulty - Current difficulty level
 * @returns {string} Recommended difficulty level
 */
function calculateAdaptiveDifficulty(recentScores, currentDifficulty) {
  if (recentScores.length === 0) return currentDifficulty;

  const avgScore = recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length;

  if (avgScore < 5) {
    return 'beginner';
  } else if (avgScore > 8) {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = levels.indexOf(currentDifficulty);
    return levels[Math.min(currentIndex + 1, levels.length - 1)];
  }

  return currentDifficulty;
}

module.exports = {
  XP_ACTIONS,
  LEVEL_THRESHOLDS,
  calculateLevel,
  getLevelProgress,
  calculateInterviewXP,
  calculateAdaptiveDifficulty,
};

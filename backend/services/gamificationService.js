const XPProgress = require('../models/XPProgress');
const Badge = require('../models/Badge');
const User = require('../models/User');

class GamificationService {
  /**
   * XP Points Rules
   */
  XP_RULES = {
    INTERVIEW_COMPLETED: 50,
    SCORE_ABOVE_8: 30,
    DAILY_PRACTICE: 20,
    QUIZ_COMPLETED: 30,
    CAREER_PATH_CREATED: 40,
    BADGE_EARNED: 25,
  };

  /**
   * Level thresholds
   */
  LEVEL_THRESHOLDS = {
    'Beginner': { min: 0, max: 200 },
    'Learner': { min: 200, max: 500 },
    'Skilled': { min: 500, max: 1000 },
    'Interview Ready': { min: 1000, max: Infinity },
  };

  /**
   * Available badges
   */
  BADGES = {
    FIRST_INTERVIEW: {
      name: 'First Steps',
      description: 'Completed your first mock interview',
      category: 'achievement',
      icon: '🎯',
    },
    FIVE_INTERVIEWS: {
      name: 'Dedicated Learner',
      description: 'Completed 5 mock interviews',
      category: 'milestone',
      icon: '📚',
    },
    TEN_INTERVIEWS: {
      name: 'Interview Master',
      description: 'Completed 10 mock interviews',
      category: 'milestone',
      icon: '🏆',
    },
    SEVEN_DAY_STREAK: {
      name: 'Week Warrior',
      description: '7 day practice streak',
      category: 'streak',
      icon: '🔥',
    },
    THIRTY_DAY_STREAK: {
      name: 'Monthly Champion',
      description: '30 day practice streak',
      category: 'streak',
      icon: '⭐',
    },
    HIGH_SCORER: {
      name: 'High Achiever',
      description: 'Scored above 9 in an interview',
      category: 'special',
      icon: '💎',
    },
    SKILL_BUILDER: {
      name: 'Skill Builder',
      description: 'Created your first career path',
      category: 'achievement',
      icon: '🛠️',
    },
  };

  /**
   * Add XP to user's progress
   * @param {string} userId - User ID
   * @param {number} amount - XP amount to add
   * @param {string} reason - Reason for XP
   */
  async addXP(userId, amount, reason) {
    try {
      let xpProgress = await XPProgress.findOne({ userId });

      if (!xpProgress) {
        xpProgress = new XPProgress({
          userId,
          xpPoints: 0,
          level: 'Beginner',
        });
      }

      // Update XP
      xpProgress.xpPoints += amount;
      xpProgress.totalXPEarned += amount;

      // Add to history
      xpProgress.xpHistory.push({
        xpAmount: amount,
        reason,
      });

      // Update level
      const oldLevel = xpProgress.level;
      xpProgress.level = this.calculateLevel(xpProgress.xpPoints);

      // Update user document
      await User.findByIdAndUpdate(userId, {
        xpPoints: xpProgress.xpPoints,
        level: xpProgress.level,
      });

      await xpProgress.save();

      // Check for level up
      const leveledUp = oldLevel !== xpProgress.level;

      return {
        xpProgress,
        leveledUp,
        oldLevel,
        newLevel: xpProgress.level,
      };
    } catch (error) {
      console.error('Error adding XP:', error);
      throw error;
    }
  }

  /**
   * Calculate level based on XP points
   * @param {number} xpPoints - Total XP points
   * @returns {string} - Level name
   */
  calculateLevel(xpPoints) {
    if (xpPoints >= 1000) return 'Interview Ready';
    if (xpPoints >= 500) return 'Skilled';
    if (xpPoints >= 200) return 'Learner';
    return 'Beginner';
  }

  /**
   * Update daily streak
   * @param {string} userId - User ID
   */
  async updateDailyStreak(userId) {
    try {
      let xpProgress = await XPProgress.findOne({ userId });

      if (!xpProgress) {
        xpProgress = new XPProgress({
          userId,
          dailyStreak: 1,
          lastPracticeDate: new Date(),
        });
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastPractice = xpProgress.lastPracticeDate ? 
          new Date(xpProgress.lastPracticeDate) : null;
        
        if (lastPractice) {
          lastPractice.setHours(0, 0, 0, 0);
        }

        const daysDiff = lastPractice ? 
          Math.floor((today - lastPractice) / (1000 * 60 * 60 * 24)) : 999;

        if (daysDiff === 0) {
          // Already practiced today
          return xpProgress;
        } else if (daysDiff === 1) {
          // Consecutive day
          xpProgress.dailyStreak += 1;
        } else {
          // Streak broken
          xpProgress.dailyStreak = 1;
        }

        xpProgress.lastPracticeDate = new Date();
      }

      await xpProgress.save();

      // Check for streak badges
      await this.checkStreakBadges(userId, xpProgress.dailyStreak);

      return xpProgress;
    } catch (error) {
      console.error('Error updating daily streak:', error);
      throw error;
    }
  }

  /**
   * Award badge to user
   * @param {string} userId - User ID
   * @param {string} badgeKey - Badge key from BADGES object
   */
  async awardBadge(userId, badgeKey) {
    try {
      const badgeData = this.BADGES[badgeKey];
      
      if (!badgeData) {
        throw new Error(`Badge ${badgeKey} not found`);
      }

      // Check if user already has this badge
      const existingBadge = await Badge.findOne({
        userId,
        badgeName: badgeData.name,
      });

      if (existingBadge) {
        return existingBadge;
      }

      // Create new badge
      const badge = new Badge({
        userId,
        badgeName: badgeData.name,
        description: badgeData.description,
        category: badgeData.category,
        icon: badgeData.icon,
      });

      await badge.save();

      // Update user's badges array
      await User.findByIdAndUpdate(userId, {
        $push: {
          badges: {
            badgeName: badgeData.name,
            description: badgeData.description,
            dateUnlocked: new Date(),
          },
        },
      });

      // Award XP for earning badge
      await this.addXP(userId, GamificationService.XP_RULES.BADGE_EARNED, `Badge earned: ${badgeData.name}`);

      return badge;
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw error;
    }
  }

  /**
   * Check and award streak badges
   * @param {string} userId - User ID
   * @param {number} streak - Current streak
   */
  async checkStreakBadges(userId, streak) {
    try {
      if (streak === 7) {
        await this.awardBadge(userId, 'SEVEN_DAY_STREAK');
      } else if (streak === 30) {
        await this.awardBadge(userId, 'THIRTY_DAY_STREAK');
      }
    } catch (error) {
      console.error('Error checking streak badges:', error);
    }
  }

  /**
   * Check and award interview milestone badges
   * @param {string} userId - User ID
   * @param {number} interviewCount - Total interviews completed
   */
  async checkInterviewBadges(userId, interviewCount) {
    try {
      if (interviewCount === 1) {
        await this.awardBadge(userId, 'FIRST_INTERVIEW');
      } else if (interviewCount === 5) {
        await this.awardBadge(userId, 'FIVE_INTERVIEWS');
      } else if (interviewCount === 10) {
        await this.awardBadge(userId, 'TEN_INTERVIEWS');
      }
    } catch (error) {
      console.error('Error checking interview badges:', error);
    }
  }

  /**
   * Get user's XP progress
   * @param {string} userId - User ID
   */
  async getUserProgress(userId) {
    try {
      const xpProgress = await XPProgress.findOne({ userId }).populate('userId', 'name email');
      
      if (!xpProgress) {
        return {
          xpPoints: 0,
          level: 'Beginner',
          interviewsCompleted: 0,
          dailyStreak: 0,
          totalXPEarned: 0,
        };
      }

      const badges = await Badge.find({ userId });
      const nextLevelThreshold = this.getNextLevelThreshold(xpProgress.level);
      const progressToNextLevel = nextLevelThreshold ? 
        ((xpProgress.xpPoints - this.getLevelMinXP(xpProgress.level)) / 
        (nextLevelThreshold - this.getLevelMinXP(xpProgress.level))) * 100 : 100;

      return {
        ...xpProgress.toObject(),
        badges,
        progressToNextLevel: Math.round(progressToNextLevel),
        nextLevelThreshold,
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  /**
   * Get minimum XP for a level
   */
  getLevelMinXP(level) {
    return this.LEVEL_THRESHOLDS[level]?.min || 0;
  }

  /**
   * Get next level threshold
   */
  getNextLevelThreshold(currentLevel) {
    const levels = ['Beginner', 'Learner', 'Skilled', 'Interview Ready'];
    const currentIndex = levels.indexOf(currentLevel);
    
    if (currentIndex < levels.length - 1) {
      return this.LEVEL_THRESHOLDS[levels[currentIndex + 1]].min;
    }
    
    return null; // Max level reached
  }

  /**
   * Complete interview and award XP
   * @param {string} userId - User ID
   * @param {number} score - Interview score (0-10)
   */
  async completeInterview(userId, score) {
    try {
      let xpProgress = await XPProgress.findOne({ userId });
      
      if (!xpProgress) {
        xpProgress = new XPProgress({ userId });
      }

      // Increment interview count
      xpProgress.interviewsCompleted += 1;
      await xpProgress.save();

      // Award XP for completing interview
      const result = await this.addXP(
        userId,
        this.XP_RULES.INTERVIEW_COMPLETED,
        'Completed mock interview'
      );

      // Bonus XP for high score
      if (score >= 8) {
        await this.addXP(
          userId,
          this.XP_RULES.SCORE_ABOVE_8,
          `High score bonus (${score}/10)`
        );

        // Check for high scorer badge
        if (score >= 9) {
          await this.awardBadge(userId, 'HIGH_SCORER');
        }
      }

      // Check for interview milestone badges
      await this.checkInterviewBadges(userId, xpProgress.interviewsCompleted);

      return result;
    } catch (error) {
      console.error('Error completing interview:', error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new GamificationService();

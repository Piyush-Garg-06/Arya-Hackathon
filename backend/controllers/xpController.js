const gamificationService = require('../services/gamificationService');
const XPProgress = require('../models/XPProgress');

/**
 * Get user's XP progress
 * GET /api/xp/progress
 */
exports.getProgress = async (req, res, next) => {
  try {
    const progress = await gamificationService.getUserProgress(req.user.id);

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update daily practice
 * POST /api/xp/daily-practice
 */
exports.updateDailyPractice = async (req, res, next) => {
  try {
    const xpProgress = await gamificationService.updateDailyStreak(req.user.id);

    // Award XP for daily practice
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
      return res.status(200).json({
        success: true,
        message: 'Already practiced today',
        data: xpProgress,
      });
    }

    const result = await gamificationService.addXP(
      req.user.id,
      gamificationService.XP_RULES.DAILY_PRACTICE,
      'Daily practice'
    );

    res.status(200).json({
      success: true,
      message: 'Daily practice recorded',
      data: {
        ...xpProgress,
        xpEarnedToday: gamificationService.XP_RULES.DAILY_PRACTICE,
        leveledUp: result.leveledUp,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get XP history
 * GET /api/xp/history
 */
exports.getXPHistory = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const xpProgress = await XPProgress.findOne({ userId: req.user.id });

    if (!xpProgress) {
      return res.status(404).json({
        success: false,
        message: 'XP progress not found',
      });
    }

    // Get limited history
    const history = xpProgress.xpHistory.slice(-parseInt(limit));

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's badges
 * GET /api/xp/badges
 */
exports.getBadges = async (req, res, next) => {
  try {
    const Badge = require('../models/Badge');
    const badges = await Badge.find({ userId: req.user.id })
      .sort({ dateUnlocked: -1 });

    res.status(200).json({
      success: true,
      count: badges.length,
      data: badges,
    });
  } catch (error) {
    next(error);
  }
};

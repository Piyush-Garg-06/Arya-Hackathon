const XPProgress = require('../models/XPProgress');
const careerService = require('../services/careerService');
const User = require('../models/User');

/**
 * Get leaderboard
 * GET /api/leaderboard
 */
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    // Get top users by XP
    const xpProgress = await XPProgress.find()
      .sort({ xpPoints: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name email profileImage');

    // Format leaderboard entries
    const leaderboard = xpProgress.map((progress, index) => ({
      rank: index + 1,
      userId: progress.userId._id,
      username: progress.userId.name,
      email: progress.userId.email,
      profileImage: progress.userId.profileImage,
      xpPoints: progress.xpPoints,
      level: progress.level,
      interviewsCompleted: progress.interviewsCompleted,
      dailyStreak: progress.dailyStreak,
    }));

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's rank
 * GET /api/leaderboard/rank
 */
exports.getUserRank = async (req, res, next) => {
  try {
    const userProgress = await XPProgress.findOne({ userId: req.user.id });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: 'User progress not found',
      });
    }

    // Calculate user's rank
    const higherRanks = await XPProgress.countDocuments({
      xpPoints: { $gt: userProgress.xpPoints },
    });

    const rank = higherRanks + 1;
    const totalUsers = await XPProgress.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        rank,
        totalUsers,
        percentile: ((rank / totalUsers) * 100).toFixed(2),
        xpPoints: userProgress.xpPoints,
        level: userProgress.level,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get leaderboard stats
 * GET /api/leaderboard/stats
 */
exports.getLeaderboardStats = async (req, res, next) => {
  try {
    const totalUsers = await XPProgress.countDocuments();
    const avgXP = await XPProgress.aggregate([
      { $group: { _id: null, average: { $avg: '$xpPoints' } } },
    ]);

    const maxXP = await XPProgress.findOne().sort({ xpPoints: -1 });
    const levelDistribution = await XPProgress.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        averageXP: avgXP[0]?.average?.toFixed(2) || 0,
        topXP: maxXP ? maxXP.xpPoints : 0,
        levelDistribution: levelDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get premium recommendations for top performers
 * GET /api/leaderboard/recommendations
 */
exports.getPremiumRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get all users sorted by XP to calculate rank and percentile
    const allProgress = await XPProgress.find().sort({ xpPoints: -1 });
    const totalUsers = allProgress.length;
    const userRankIndex = allProgress.findIndex(u => u.userId.toString() === userId);
    const rank = userRankIndex + 1;

    if (userRankIndex === -1) {
      return res.status(404).json({ success: false, message: 'User progress not found' });
    }

    // Only allow for top 30% performers or top 10 rank users
    const percentile = (userRankIndex / totalUsers) * 100;
    if (percentile > 30 && rank > 10) {
      return res.status(403).json({
        success: false,
        message: 'Premium recommendations are available for top 30% performers or top 10 rank users.',
        currentRank: rank,
        totalUsers,
        percentile: percentile.toFixed(2) + '%'
      });
    }

    const user = await User.findById(userId);
    const recommendations = await careerService.recommendPremiumJobs(
      user,
      rank,
      percentile.toFixed(2)
    );

    res.status(200).json({
      success: true,
      data: recommendations,
      stats: {
        rank,
        percentile: percentile.toFixed(2) + '%'
      }
    });
  } catch (error) {
    next(error);
  }
};

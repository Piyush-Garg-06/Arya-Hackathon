const express = require('express');
const router = express.Router();
const { getLeaderboard, getUserRank, getLeaderboardStats, getPremiumRecommendations } = require('../controllers/leaderboardController');
const protect = require('../middleware/authMiddleware');

router.get('/', protect, getLeaderboard);
router.get('/rank', protect, getUserRank);
router.get('/stats', protect, getLeaderboardStats);
router.get('/recommendations', protect, getPremiumRecommendations);

module.exports = router;

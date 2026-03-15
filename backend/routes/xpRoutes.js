const express = require('express');
const router = express.Router();
const { getProgress, updateDailyPractice, getXPHistory, getBadges } = require('../controllers/xpController');
const protect = require('../middleware/authMiddleware');

router.get('/progress', protect, getProgress);
router.post('/daily-practice', protect, updateDailyPractice);
router.get('/history', protect, getXPHistory);
router.get('/badges', protect, getBadges);

module.exports = router;

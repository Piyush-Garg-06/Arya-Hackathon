const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { chat, getCareerAdvice } = require('../controllers/feedbackController');
const { validate, schemas } = require('../middleware/validate');
const { cacheMiddleware } = require('../middleware/cache');

/**
 * AI Chat Routes
 * POST /api/ai/chat - General AI chat for career guidance
 * POST /api/ai/career-advice - Personalized career advice based on user profile
 */
router.post('/chat', authMiddleware, validate(schemas.chat), chat);
router.post('/career-advice', authMiddleware, cacheMiddleware(180), getCareerAdvice);

module.exports = router;

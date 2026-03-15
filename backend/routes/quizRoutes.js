const express = require('express');
const router = express.Router();
const { analyzeAnswers, getQuizResults, getLatestResult } = require('../controllers/quizController');
const protect = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validate');

router.post('/analyze', protect, validate(schemas.quizAnalyze), analyzeAnswers);
router.get('/results', protect, getQuizResults);
router.get('/latest', protect, getLatestResult);

module.exports = router;

const express = require('express');
const router = express.Router();
const { 
  generateQuestions, 
  evaluateAnswer, 
  completeSession, 
  getSessions, 
  getSession,
  getHint
} = require('../controllers/interviewController');
const protect = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validate');
const { cacheMiddleware } = require('../middleware/cache');

router.post('/question', protect, validate(schemas.interviewQuestion), generateQuestions);
router.post('/evaluate', protect, validate(schemas.interviewEvaluate), evaluateAnswer);
router.post('/hint', protect, validate(schemas.interviewHint), getHint);
router.post('/complete', protect, validate(schemas.interviewComplete), completeSession);
router.get('/sessions', protect, getSessions);
router.get('/sessions/:id', protect, cacheMiddleware(120), getSession);

module.exports = router;

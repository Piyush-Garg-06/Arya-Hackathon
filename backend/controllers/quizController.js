const ollamaService = require('../services/ollamaService');
const QuizResult = require('../models/QuizResult');
const gamificationService = require('../services/gamificationService');

/**
 * Analyze quiz answers and generate career recommendations
 * POST /api/quiz/analyze
 */
exports.analyzeAnswers = async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers array',
      });
    }

    // Call Ollama AI to analyze answers
    const analysis = await ollamaService.analyzeQuizAnswers(answers);

    // Save quiz result
    const quizResult = await QuizResult.create({
      userId: req.user.id,
      answers,
      interestProfile: analysis.interestProfile,
      aiAnalysis: analysis.aiAnalysis,
      recommendedCareers: analysis.recommendedCareers,
    });

    // Award XP for completing quiz
    await gamificationService.addXP(
      req.user.id,
      gamificationService.XP_RULES.QUIZ_COMPLETED,
      'Completed interest discovery quiz'
    );

    res.status(200).json({
      success: true,
      message: 'Quiz analysis completed successfully',
      data: {
        quizResult: {
          id: quizResult._id,
          interestProfile: quizResult.interestProfile,
          aiAnalysis: quizResult.aiAnalysis,
          recommendedCareers: quizResult.recommendedCareers,
          createdAt: quizResult.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's quiz results
 * GET /api/quiz/results
 */
exports.getQuizResults = async (req, res, next) => {
  try {
    const quizResults = await QuizResult.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: quizResults.length,
      data: quizResults,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get latest quiz result
 * GET /api/quiz/latest
 */
exports.getLatestResult = async (req, res, next) => {
  try {
    const quizResult = await QuizResult.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });

    if (!quizResult) {
      return res.status(404).json({
        success: false,
        message: 'No quiz results found',
      });
    }

    res.status(200).json({
      success: true,
      data: quizResult,
    });
  } catch (error) {
    next(error);
  }
};

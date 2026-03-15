const InterviewAnswer = require('../models/InterviewAnswer');
const gamificationService = require('../services/gamificationService');
const interviewService = require('../services/interviewService');
const InterviewSession = require('../models/InterviewSession');
const ollamaService = require('../services/ollamaService');

/**
 * Generate interview questions
 * POST /api/interview/question
 */
exports.generateQuestions = async (req, res, next) => {
  try {
    const { careerRole, difficultyLevel } = req.body;

    if (!careerRole || !difficultyLevel) {
      return res.status(400).json({
        success: false,
        message: 'Please provide careerRole and difficultyLevel',
      });
    }

    // Validate difficulty level
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(difficultyLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid difficulty level. Must be beginner, intermediate, or advanced',
      });
    }

    // Generate questions using AI
    const result = await ollamaService.generateInterviewQuestions(careerRole, difficultyLevel);

    // Create interview session
    const session = await InterviewSession.create({
      userId: req.user.id,
      careerRole,
      difficultyLevel,
      questions: result.questions,
      status: 'in-progress',
    });

    res.status(200).json({
      success: true,
      message: 'Interview questions generated successfully',
      data: {
        id: session._id,
        careerRole: session.careerRole,
        difficultyLevel: session.difficultyLevel,
        questions: session.questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit interview answer
 * POST /api/interview/evaluate
 */
exports.evaluateAnswer = async (req, res, next) => {
  try {
    const { sessionId, question, userAnswer } = req.body;

    if (!sessionId || !question || userAnswer === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide sessionId, question, and userAnswer',
      });
    }

    // Evaluate answer using AI
    const evaluation = await ollamaService.evaluateAnswer(question, userAnswer);

    // Save interview answer
    const answer = await InterviewAnswer.create({
      sessionId,
      userId: req.user.id,
      question,
      userAnswer,
      ...evaluation,
    });

    // Update session with new answer
    const session = await InterviewSession.findById(sessionId);
    
    if (session) {
      // Calculate new average score
      const allAnswers = await InterviewAnswer.find({ sessionId });
      const totalScore = allAnswers.reduce((sum, ans) => sum + ans.aiScore, 0);
      const avgScore = totalScore / allAnswers.length;

      session.averageScore = avgScore;
      session.totalScore = Math.round(avgScore * 10);
      await session.save();
    }

    res.status(200).json({
      success: true,
      message: 'Answer evaluated successfully',
      data: {
        answer: {
          id: answer._id,
          question: answer.question,
          aiScore: answer.aiScore,
          strengths: answer.strengths,
          weaknesses: answer.weaknesses,
          improvedAnswer: answer.improvedAnswer,
          communicationScore: answer.communicationScore,
          technicalAccuracy: answer.technicalAccuracy,
          feedback: answer.feedback,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Complete interview session
 * POST /api/interview/complete
 */
exports.completeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    const session = await InterviewSession.findOneAndUpdate(
      { _id: sessionId, userId: req.user.id },
      { status: 'completed' },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    // Get all answers for this session
    const answers = await InterviewAnswer.find({ sessionId });
    
    console.log(`Finalizing session ${sessionId}. Found ${answers.length} answers.`);
    
    let avgScore = 0;
    if (answers.length > 0) {
      avgScore = answers.reduce((sum, ans) => sum + ans.aiScore, 0) / answers.length;
    }

    // Award XP for completing interview
    try {
      await gamificationService.completeInterview(req.user.id, avgScore);
    } catch (gamiErr) {
      console.error('Gamification service failed, but continuing session completion:', gamiErr);
    }

    // Generate overall feedback using AI
    const feedbackPrompt = `Generate comprehensive feedback for an interview session with these details:
- Role: ${session.careerRole}
- Difficulty: ${session.difficultyLevel}
- Average Score: ${avgScore.toFixed(1)}/10
- Number of questions answered: ${answers.length}

Provide constructive feedback highlighting strengths and areas for improvement.`;

    let overallFeedback = "Great job completing the interview! Keep practicing to improve your score.";
    try {
      overallFeedback = await ollamaService.generateAIResponse(feedbackPrompt);
    } catch (aiErr) {
      console.error('AI Feedback generation failed, using default:', aiErr);
    }

    session.feedback = overallFeedback;
    session.averageScore = avgScore; // Ensure this is also updated
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Interview session completed successfully',
      data: {
        session: {
          id: session._id,
          careerRole: session.careerRole,
          difficultyLevel: session.difficultyLevel,
          totalScore: session.totalScore,
          averageScore: session.averageScore,
          feedback: session.feedback,
          completedAt: session.updatedAt,
        },
        xpEarned: gamificationService.XP_RULES.INTERVIEW_COMPLETED + (avgScore >= 8 ? gamificationService.XP_RULES.SCORE_ABOVE_8 : 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's interview sessions
 * GET /api/interview/sessions
 */
exports.getSessions = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get specific interview session
 * GET /api/interview/sessions/:id
 */
exports.getSession = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    // Get all answers for this session
    const answers = await InterviewAnswer.find({ sessionId: session._id });

    res.status(200).json({
      success: true,
      data: {
        session,
        answers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get adaptive difficulty based on performance
 * This helper function calculates next difficulty level
 */
exports.getAdaptiveDifficulty = async (userId, currentDifficulty) => {
  try {
    // Get last 5 sessions
    const recentSessions = await InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    if (recentSessions.length === 0) {
      return currentDifficulty;
    }

    // Calculate average score
    const avgScore = recentSessions.reduce((sum, session) => {
      return sum + (session.averageScore || 0);
    }, 0) / recentSessions.length;

    // Adjust difficulty
    if (avgScore < 5) {
      return 'beginner';
    } else if (avgScore > 8 && currentDifficulty !== 'advanced') {
      const levels = ['beginner', 'intermediate', 'advanced'];
      const currentIndex = levels.indexOf(currentDifficulty);
      return levels[currentIndex + 1] || currentDifficulty;
    }

    return currentDifficulty;
  } catch (error) {
    console.error('Error calculating adaptive difficulty:', error);
    return currentDifficulty;
  }
};

/**
 * Get AI hint for current question
 * POST /api/interview/hint
 */
exports.getHint = async (req, res, next) => {
  try {
    const { question, category } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required',
      });
    }

    const hint = await interviewService.generateHint(question, category || 'technical');

    res.status(200).json({
      success: true,
      data: hint,
    });
  } catch (error) {
    next(error);
  }
};

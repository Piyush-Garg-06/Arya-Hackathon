/**
 * Interview Service
 * Business logic layer for mock interview features: question generation,
 * answer evaluation, and adaptive difficulty.
 * Uses GeminiService for AI features and prompt templates for structured responses.
 */

const ollamaService = require('./ollamaService');
const PROMPT_TEMPLATES = require('../utils/promptTemplates');
const { calculateAdaptiveDifficulty } = require('../utils/xpCalculator');
const InterviewSession = require('../models/InterviewSession');

class InterviewService {
  /**
   * Generate interview questions for a role and difficulty level
   * @param {string} careerRole - Target role
   * @param {string} difficultyLevel - beginner, intermediate, advanced
   * @returns {Promise<object>} Generated questions
   */
  async generateQuestions(careerRole, difficultyLevel) {
    const prompt = PROMPT_TEMPLATES.INTERVIEW_QUESTION(careerRole, difficultyLevel);
    const result = await ollamaService.generateJSONResponse(prompt);

    if (!result.questions || !Array.isArray(result.questions)) {
      throw new Error('AI response missing valid questions array');
    }

    return result;
  }

  /**
   * Evaluate a user's interview answer
   * @param {string} question - The interview question
   * @param {string} userAnswer - User's answer text
   * @returns {Promise<object>} Evaluation with score, strengths, weaknesses, improved answer
   */
  async evaluateAnswer(question, userAnswer) {
    const prompt = PROMPT_TEMPLATES.ANSWER_EVALUATION(question, userAnswer);
    const result = await ollamaService.generateJSONResponse(prompt);

    // Validate required fields
    if (typeof result.aiScore !== 'number' || !result.improvedAnswer) {
      throw new Error('AI response missing required evaluation fields');
    }

    // Clamp scores to valid range
    result.aiScore = Math.max(0, Math.min(10, result.aiScore));
    if (typeof result.communicationScore === 'number') {
      result.communicationScore = Math.max(0, Math.min(10, result.communicationScore));
    }
    if (typeof result.technicalAccuracy === 'number') {
      result.technicalAccuracy = Math.max(0, Math.min(10, result.technicalAccuracy));
    }

    return result;
  }

  /**
   * Generate comprehensive session feedback
   * @param {object} session - Interview session document
   * @param {Array} answers - Answer documents for the session
   * @param {number} avgScore - Average score across answers
   * @returns {Promise<string>} Overall feedback text
   */
  async generateSessionFeedback(session, answers, avgScore) {
    const prompt = PROMPT_TEMPLATES.SESSION_FEEDBACK(session, answers, avgScore);
    return await ollamaService.generateAIResponse(prompt);
  }

  /**
   * Calculate adaptive difficulty based on user's recent performance
   * @param {string} userId - User's ID
   * @param {string} currentDifficulty - Current difficulty level
   * @returns {Promise<string>} Recommended difficulty level
   */
  async getAdaptiveDifficulty(userId, currentDifficulty) {
    const recentSessions = await InterviewSession.find({
      userId,
      status: 'completed',
    })
      .sort({ createdAt: -1 })
      .limit(5);

    if (recentSessions.length === 0) {
      return currentDifficulty;
    }

    const recentScores = recentSessions
      .map(s => s.averageScore)
      .filter(s => typeof s === 'number');

    return calculateAdaptiveDifficulty(recentScores, currentDifficulty);
  }

  /**
   * Generate a helpful hint for an interview question
   * @param {string} question - The interview question
   * @param {string} category - technical|behavioral|problem-solving
   * @returns {Promise<object>} Generated hint
   */
  async generateHint(question, category) {
    const prompt = PROMPT_TEMPLATES.INTERVIEW_HINT(question, category);
    return await ollamaService.generateJSONResponse(prompt);
  }
}

module.exports = new InterviewService();

/**
 * Career Service
 * Business logic layer for career guidance, quiz analysis, and skill gap analysis.
 * Uses GeminiService for AI features and prompt templates for structured responses.
 */

const ollamaService = require('./ollamaService');
const PROMPT_TEMPLATES = require('../utils/promptTemplates');

class CareerService {
  /**
   * Get a generic fallback roadmap if AI fails to provide one
   */
  getFallbackRoadmap(careerName = 'this role') {
    return [
      {
        stepNumber: 1,
        title: `Master Fundamentals for ${careerName}`,
        description: `Learn the core principles, syntax, and basic concepts required for a successful career as a ${careerName}.`,
        estimatedDuration: '2-4 weeks',
        resources: ['FreeCodeCamp', 'YouTube Tutorials', 'Official Documentation'],
        completed: false
      },
      {
        stepNumber: 2,
        title: 'Build Basic Projects',
        description: 'Apply your theoretical knowledge by building 2-3 small starter projects to understand practical implementation.',
        estimatedDuration: '3 weeks',
        resources: ['GitHub', 'Portfolio Guides'],
        completed: false
      },
      {
        stepNumber: 3,
        title: 'Advanced Skills & Certification',
        description: 'Level up your expertise by tackling advanced topics and obtaining industry-recognized certifications.',
        estimatedDuration: '1-2 months',
        resources: ['Coursera', 'Udemy', 'Professional Certificates'],
        completed: false
      },
      {
        stepNumber: 4,
        title: 'Job Readiness & Industry Projects',
        description: 'Prepare for interviews, optimize your resume, and build a high-quality capstone project for your portfolio.',
        estimatedDuration: 'Ongoing',
        resources: ['LinkedIn', 'Mock Interviews'],
        completed: false
      }
    ];
  }

  /**
   * Analyze quiz answers and generate career recommendations
   * @param {Array} answers - User's quiz answers
   * @returns {Promise<object>} Analysis results with interestProfile and recommendedCareers
   */
  async analyzeQuizAnswers(answers) {
    const prompt = PROMPT_TEMPLATES.INTEREST_ANALYSIS(answers);
    const result = await ollamaService.generateJSONResponse(prompt);

    // Validate required fields
    if (!result.interestProfile || !result.recommendedCareers) {
      throw new Error('AI response missing required fields for quiz analysis');
    }

    // Ensure roadmaps exist for all recommended careers
    result.recommendedCareers = result.recommendedCareers.map(career => ({
      ...career,
      learningRoadmap: (career.learningRoadmap && career.learningRoadmap.length > 0) 
        ? career.learningRoadmap 
        : this.getFallbackRoadmap(career.careerName)
    }));

    return result;
  }

  /**
   * Perform skill gap analysis for a desired career
   * @param {string} desiredCareer - Target career
   * @param {string[]} currentSkills - User's current skills
   * @returns {Promise<object>} Skill gap analysis with missingSkills, roadmap, timeline
   */
  async analyzeSkillGap(desiredCareer, currentSkills) {
    const prompt = PROMPT_TEMPLATES.SKILL_GAP(desiredCareer, currentSkills);
    const result = await ollamaService.generateJSONResponse(prompt);

    // Validate required fields
    if (!result.missingSkills || !result.learningRoadmap || !result.estimatedTimeline) {
      throw new Error('AI response missing required fields for skill gap analysis');
    }

    // Ensure roadmap exists
    if (!result.learningRoadmap || result.learningRoadmap.length === 0) {
      result.learningRoadmap = this.getFallbackRoadmap(desiredCareer);
    }

    return result;
  }

  /**
   * Get personalized career recommendations
   * @param {object} userProfile - User profile data
   * @returns {Promise<object>} Career recommendations
   */
  async getCareerRecommendations(userProfile) {
    const prompt = PROMPT_TEMPLATES.CAREER_RECOMMENDATION(userProfile);
    const result = await ollamaService.generateJSONResponse(prompt);

    if (!result.recommendations) {
      throw new Error('AI response missing recommendations');
    }

    return result;
  }

  /**
   * Analyze career transition for professionals
   * @param {string} currentRole - Current job title
   * @param {string} targetRole - Target job title
   * @param {number} yearsOfExp - Total years of experience
   * @param {boolean} motivationIssue - Whether user has motivation issues
   * @returns {Promise<object>} Transition analysis
   */
  async analyzeCareerTransition(currentRole, targetRole, yearsOfExp, motivationIssue) {
    const prompt = PROMPT_TEMPLATES.CAREER_TRANSITION(currentRole, targetRole, yearsOfExp, motivationIssue);
    const result = await ollamaService.generateJSONResponse(prompt);

    if (result.feasibilityScore === undefined || !result.transitionStrategy) {
      throw new Error('AI response missing transition strategy details');
    }

    // Ensure roadmap exists
    if (!result.learningRoadmap || result.learningRoadmap.length === 0) {
      result.learningRoadmap = this.getFallbackRoadmap(targetRole);
    }

    return result;
  }

  /**
   * Recommend premium jobs/companies for top performers
   * @param {object} userProfile - User profile data
   * @param {number} rank - Current leaderboard rank
   * @param {number} topPercentile - Calculated percentile
   * @returns {Promise<object>} Premium job recommendations
   */
  async recommendPremiumJobs(userProfile, rank, topPercentile) {
    const prompt = PROMPT_TEMPLATES.JOB_RECOMMENDATIONS(userProfile, rank, topPercentile);
    const result = await ollamaService.generateJSONResponse(prompt);

    if (!result.recommendedRoles) {
      throw new Error('AI response missing recommended roles');
    }

    return result;
  }
}

module.exports = new CareerService();

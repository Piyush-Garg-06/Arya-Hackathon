/**
 * Validation Middleware
 * Joi-based request validation for all major endpoints.
 */

const Joi = require('joi');

/**
 * Create validation middleware from a Joi schema
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Replace with validated/sanitized values
    req[property] = value;
    next();
  };
};

// ======= Validation Schemas =======

// Auth schemas
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required()
    .messages({ 'string.empty': 'Name is required' }),
  email: Joi.string().trim().email().required()
    .messages({ 'string.email': 'Please provide a valid email' }),
  password: Joi.string().min(6).max(128).required()
    .messages({ 'string.min': 'Password must be at least 6 characters' }),
  userType: Joi.string().valid('student', 'professional').default('student'),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  bio: Joi.string().max(500).allow(''),
  currentSkills: Joi.array().items(Joi.string().trim()),
  desiredCareer: Joi.string().trim(),
  profileImage: Joi.string().uri().allow(''),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(128).required(),
});

// Quiz schemas
const quizAnalyzeSchema = Joi.object({
  answers: Joi.array().items(
    Joi.object({
      questionId: Joi.number(),
      answer: Joi.string(),
      score: Joi.number(),
    })
  ).min(1).required(),
});

// Career schemas
const careerAnalyzeSchema = Joi.object({
  desiredCareer: Joi.string().trim().required()
    .messages({ 'string.empty': 'Desired career is required' }),
  currentSkills: Joi.array().items(Joi.string().trim()).min(1).required()
    .messages({ 'array.min': 'At least one current skill is required' }),
});

const transitionSchema = Joi.object({
  currentRole: Joi.string().trim().required(),
  targetRole: Joi.string().trim().required(),
  yearsOfExperience: Joi.number().min(0).required(),
  motivationIssue: Joi.boolean().default(false),
});

// Interview schemas
const interviewQuestionSchema = Joi.object({
  careerRole: Joi.string().trim().required(),
  difficultyLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
});

const interviewEvaluateSchema = Joi.object({
  sessionId: Joi.string().required(),
  question: Joi.string().required(),
  userAnswer: Joi.string().allow('').required(),
});

const interviewHintSchema = Joi.object({
  question: Joi.string().required(),
  category: Joi.string().valid('technical', 'behavioral', 'problem-solving').default('technical'),
});

const interviewCompleteSchema = Joi.object({
  sessionId: Joi.string().required(),
});

// AI Chat schema
const chatSchema = Joi.object({
  message: Joi.string().trim().min(1).max(2000).required()
    .messages({ 'string.empty': 'Message is required' }),
});

module.exports = {
  validate,
  schemas: {
    register: registerSchema,
    login: loginSchema,
    updateProfile: updateProfileSchema,
    changePassword: changePasswordSchema,
    quizAnalyze: quizAnalyzeSchema,
    careerAnalyze: careerAnalyzeSchema,
    transition: transitionSchema,
    interviewQuestion: interviewQuestionSchema,
    interviewEvaluate: interviewEvaluateSchema,
    interviewHint: interviewHintSchema,
    interviewComplete: interviewCompleteSchema,
    chat: chatSchema,
  },
};

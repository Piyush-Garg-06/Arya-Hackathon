const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    questionId: Number,
    answer: String,
    score: Number,
  }],
  interestProfile: {
    problemSolving: {
      type: Number,
      default: 0,
    },
    creativity: {
      type: Number,
      default: 0,
    },
    analyticalThinking: {
      type: Number,
      default: 0,
    },
    communication: {
      type: Number,
      default: 0,
    },
    leadership: {
      type: Number,
      default: 0,
    },
    technical: {
      type: Number,
      default: 0,
    },
  },
  aiAnalysis: {
    type: String,
    required: true,
  },
  recommendedCareers: [{
    careerName: String,
    matchPercentage: Number,
    description: String,
    requiredSkills: [String],
  }],
}, {
  timestamps: true,
});

// Index for faster queries
quizResultSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);

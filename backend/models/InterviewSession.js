const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  careerRole: {
    type: String,
    required: true,
    trim: true,
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  questions: [{
    questionId: String,
    questionText: String,
    category: String,
    expectedKeyPoints: [String],
  }],
  totalScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  averageScore: {
    type: Number,
    min: 0,
    max: 10,
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress',
  },
  feedback: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for faster queries
interviewSessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);

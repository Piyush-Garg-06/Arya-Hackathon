const mongoose = require('mongoose');

const interviewAnswerSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSession',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  questionCategory: {
    type: String,
  },
  userAnswer: {
    type: String,
    required: true,
  },
  aiScore: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  strengths: [{
    type: String,
  }],
  weaknesses: [{
    type: String,
  }],
  improvedAnswer: {
    type: String,
    required: true,
  },
  communicationScore: {
    type: Number,
    min: 0,
    max: 10,
  },
  technicalAccuracy: {
    type: Number,
    min: 0,
    max: 10,
  },
  feedback: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for faster queries
interviewAnswerSchema.index({ sessionId: 1, userId: 1 });

module.exports = mongoose.model('InterviewAnswer', interviewAnswerSchema);

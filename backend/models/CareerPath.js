const mongoose = require('mongoose');

const careerPathSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  careerName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  matchPercentage: {
    type: Number,
    default: 0,
  },
  currentSkills: [{
    type: String,
    trim: true,
  }],
  missingSkills: [{
    skill: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    estimatedLearningTime: String, // e.g., "2 weeks", "1 month"
  }],
  learningRoadmap: [{
    stepNumber: Number,
    title: String,
    description: String,
    resources: [String],
    estimatedDuration: String,
    completed: {
      type: Boolean,
      default: false,
    },
  }],
  estimatedTimeline: {
    type: String,
    required: true,
  },
  availableRoles: [{
    type: String,
    trim: true,
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
}, {
  timestamps: true,
});

// Index for faster queries
careerPathSchema.index({ userId: 1, careerName: 1 });

module.exports = mongoose.model('CareerPath', careerPathSchema);

const mongoose = require('mongoose');

const xpProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  xpPoints: {
    type: Number,
    default: 0,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Learner', 'Skilled', 'Interview Ready'],
    default: 'Beginner',
  },
  interviewsCompleted: {
    type: Number,
    default: 0,
  },
  dailyStreak: {
    type: Number,
    default: 0,
  },
  lastPracticeDate: {
    type: Date,
  },
  totalXPEarned: {
    type: Number,
    default: 0,
  },
  xpHistory: [{
    xpAmount: Number,
    reason: String,
    date: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Index for faster queries
xpProgressSchema.index({ userId: 1 });
xpProgressSchema.index({ xpPoints: -1 });

module.exports = mongoose.model('XPProgress', xpProgressSchema);

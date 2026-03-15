const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  badgeName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['achievement', 'milestone', 'streak', 'special'],
    default: 'achievement',
  },
  icon: {
    type: String,
    default: '🏆',
  },
  dateUnlocked: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
badgeSchema.index({ userId: 1 });

module.exports = mongoose.model('Badge', badgeSchema);

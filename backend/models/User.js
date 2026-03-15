const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  userType: {
    type: String,
    enum: ['student', 'professional'],
    default: 'student',
  },
  careerState: {
    type: String,
    enum: ['unsure', 'explorer', 'professional'],
    default: 'unsure',
  },
  currentSkills: [{
    type: String,
    trim: true,
  }],
  desiredCareer: {
    type: String,
    trim: true,
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
  badges: [{
    badgeName: String,
    description: String,
    dateUnlocked: Date,
  }],
  profileImage: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update level based on XP
userSchema.methods.updateLevel = function() {
  const xp = this.xpPoints;
  if (xp >= 1000) {
    this.level = 'Interview Ready';
  } else if (xp >= 500) {
    this.level = 'Skilled';
  } else if (xp >= 200) {
    this.level = 'Learner';
  } else {
    this.level = 'Beginner';
  }
};

module.exports = mongoose.model('User', userSchema);

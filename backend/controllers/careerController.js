const gamificationService = require('../services/gamificationService');
const careerService = require('../services/careerService');
const CareerPath = require('../models/CareerPath');
const ollamaService = require('../services/ollamaService');

/**
 * Step 1: Discover Interest (Unsure Tier)
 * POST /api/career/discover
 */
exports.analyzeDiscovery = async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers array',
      });
    }

    const analysis = await careerService.analyzeQuizAnswers(answers);

    // Update user state to unsure if not already
    req.user.careerState = 'unsure';
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Discovery analysis completed',
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 2: Skill Analysis (Explorer Tier)
 * POST /api/career/analyze
 */
exports.analyzeSkills = async (req, res, next) => {
  try {
    const { desiredCareer, currentSkills } = req.body;

    if (!desiredCareer || !currentSkills || !Array.isArray(currentSkills)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide desiredCareer and currentSkills array',
      });
    }

    // Call Ollama AI for skill gap analysis
    const analysis = await ollamaService.analyzeSkillGap(desiredCareer, currentSkills);

    // Create career path in database
    const careerPath = await CareerPath.create({
      userId: req.user.id,
      careerName: desiredCareer,
      currentSkills,
      missingSkills: analysis.missingSkills,
      learningRoadmap: analysis.learningRoadmap || [],
      estimatedTimeline: analysis.estimatedTimeline,
      availableRoles: analysis.availableRoles || []
    });

    // Update user state to explorer
    req.user.careerState = 'explorer';
    req.user.desiredCareer = desiredCareer;
    req.user.currentSkills = currentSkills;
    await req.user.save();

    // Award XP for creating career path
    await gamificationService.addXP(
      req.user.id,
      gamificationService.XP_RULES.CAREER_PATH_CREATED,
      'Created career path'
    );

    res.status(200).json({
      success: true,
      message: 'Skill analysis completed',
      data: {
        careerPath,
        availableRoles: analysis.availableRoles
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's career paths
 * GET /api/career/paths
 */
exports.getCareerPaths = async (req, res, next) => {
  try {
    const careerPaths = await CareerPath.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: careerPaths.length,
      data: careerPaths,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get specific career path
 * GET /api/career/paths/:id
 */
exports.getCareerPath = async (req, res, next) => {
  try {
    const careerPath = await CareerPath.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!careerPath) {
      return res.status(404).json({
        success: false,
        message: 'Career path not found',
      });
    }

    res.status(200).json({
      success: true,
      data: careerPath,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update roadmap step completion
 * PUT /api/career/paths/:id/steps/:stepId
 */
exports.updateStepCompletion = async (req, res, next) => {
  try {
    const { stepId } = req.params;
    const { completed } = req.body;

    const careerPath = await CareerPath.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!careerPath) {
      return res.status(404).json({
        success: false,
        message: 'Career path not found',
      });
    }

    // Find and update the step
    const step = careerPath.learningRoadmap.id(stepId);
    if (!step) {
      return res.status(404).json({
        success: false,
        message: 'Step not found',
      });
    }

    step.completed = completed;
    await careerPath.save();

    // Award XP if completing a step
    if (completed) {
      await gamificationService.addXP(
        req.user.id,
        15,
        `Completed roadmap step: ${step.title}`
      );
    }

    res.status(200).json({
      success: true,
      message: 'Step updated successfully',
      data: careerPath,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete career path
 * DELETE /api/career/paths/:id
 */
exports.deleteCareerPath = async (req, res, next) => {
  try {
    const careerPath = await CareerPath.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!careerPath) {
      return res.status(404).json({
        success: false,
        message: 'Career path not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Career path deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 3: Career Transition (Professional Tier)
 * POST /api/career/transition
 */
exports.analyzeTransition = async (req, res, next) => {
  try {
    const { currentRole, targetRole, yearsOfExperience, motivationIssue } = req.body;

    if (!currentRole || !targetRole || !yearsOfExperience) {
      return res.status(400).json({
        success: false,
        message: 'Please provide currentRole, targetRole, and yearsOfExperience',
      });
    }

    const analysis = await careerService.analyzeCareerTransition(
      currentRole,
      targetRole,
      yearsOfExperience,
      motivationIssue
    );

    // Update user state to professional
    req.user.careerState = 'professional';
    req.user.userType = 'professional';
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Transition analysis completed',
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Activate a recommended career roadmap
 * POST /api/career/activate
 */
exports.activateRoadmap = async (req, res, next) => {
  try {
    const { careerName, description, learningRoadmap, estimatedTimeline, difficulty } = req.body;

    if (!careerName || !learningRoadmap) {
      return res.status(400).json({
        success: false,
        message: 'Please provide careerName and learningRoadmap',
      });
    }

    // Delete previous roadmap with same name for this user to avoid index collisions
    await CareerPath.deleteMany({ userId: req.user.id, careerName });

    const careerPath = await CareerPath.create({
      userId: req.user.id,
      careerName,
      description,
      matchPercentage: req.body.matchPercentage || 100, // Default to 100 if not provided
      learningRoadmap,
      estimatedTimeline: estimatedTimeline || 'Flexible',
      difficulty: difficulty || 'beginner'
    });

    res.status(201).json({
      success: true,
      message: 'Roadmap activated successfully',
      data: careerPath,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the current active roadmap
 * GET /api/career/active
 */
exports.getActiveRoadmap = async (req, res, next) => {
  try {
    const careerPath = await CareerPath.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });

    if (!careerPath) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active roadmap found'
      });
    }

    res.status(200).json({
      success: true,
      data: careerPath,
    });
  } catch (error) {
    next(error);
  }
};

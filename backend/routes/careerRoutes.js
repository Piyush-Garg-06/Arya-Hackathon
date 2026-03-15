const express = require('express');
const router = express.Router();
const { analyzeSkills, getCareerPaths, getCareerPath, updateStepCompletion, deleteCareerPath, analyzeTransition, analyzeDiscovery, activateRoadmap, getActiveRoadmap } = require('../controllers/careerController');
const protect = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validate');

router.post('/discover', protect, analyzeDiscovery);
router.post('/analyze', protect, validate(schemas.careerAnalyze), analyzeSkills);
router.post('/transition', protect, validate(schemas.transition), analyzeTransition);
router.get('/paths', protect, getCareerPaths);
router.get('/active', protect, getActiveRoadmap);
router.post('/activate', protect, activateRoadmap);
router.get('/paths/:id', protect, getCareerPath);
router.put('/paths/:id/steps/:stepId', protect, updateStepCompletion);
router.delete('/paths/:id', protect, deleteCareerPath);

module.exports = router;

const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validate');

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(schemas.updateProfile), updateProfile);
router.put('/change-password', protect, validate(schemas.changePassword), changePassword);

module.exports = router;

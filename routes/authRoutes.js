const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const authController = require('../controllers/authController');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authController.register);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authController.login);

// @desc    Google Auth (Login/Signup)
// @route   POST /api/auth/google
// @access  Public
router.post('/google', authController.googleAuth);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;

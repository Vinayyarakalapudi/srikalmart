const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', authController.login);

// @route   GET /api/auth/user
// @desc    Get current user
router.get('/user', authController.getCurrentUser);

// @route   POST /api/auth/logout
// @desc    Logout user
router.post('/logout', authController.logout);

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
router.put('/update-profile', authController.updateProfile);

module.exports = router;


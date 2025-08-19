const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authMiddleware = require('../middlewares/auth.js');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.get('/user', authMiddleware, authController.getCurrentUser);

module.exports = router;

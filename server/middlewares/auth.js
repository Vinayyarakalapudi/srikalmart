const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // ensure path is correct
const authMiddleware = require('../middleware/auth'); // your auth.js middleware

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes (require token)
router.get('/user', authMiddleware, authController.getCurrentUser);
router.put('/update-profile', authMiddleware, authController.updateProfile);

module.exports = router;

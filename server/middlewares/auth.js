const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout || ((req,res)=>res.sendStatus(200)));

// Protected routes
router.get('/user', authMiddleware, authController.getCurrentUser);
// Add update-profile if you implement later
// router.put('/update-profile', authMiddleware, authController.updateProfile);

module.exports = router;

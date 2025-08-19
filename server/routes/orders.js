const express = require('express');
const router = express.Router();
const { getUserOrders } = require('../controllers/paymentController');
const auth = require('../middlewares/auth'); // Assuming auth middleware exists

// Get orders for authenticated user
router.get('/user/:userId', auth, getUserOrders);

module.exports = router;

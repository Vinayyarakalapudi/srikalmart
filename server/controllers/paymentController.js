const Order = require('../models/Order');
const User = require('../models/User');

const initializePayment = async (req, res) => {
  try {
    const { items, totalAmount, customerInfo } = req.body;
    const userId = req.user?.id; // Assuming user is authenticated
    
    // Create order
    const order = new Order({
      userId: userId || null,
      orderId: "ORD-" + Date.now(),
      items: items,
      totalAmount: totalAmount,
      customerInfo: customerInfo || { name: "Guest", email: "guest@example.com" },
      status: "pending"
    });
    
    const savedOrder = await order.save();
    
    // If user is logged in, add order to their orders array
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $push: { orders: savedOrder._id }
      });
    }
    
    res.json({
      success: true,
      message: "Order placed successfully!",
      order: savedOrder,
      currency: "₹"
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId');
    
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

module.exports = {
  initializePayment,
  getUserOrders
};

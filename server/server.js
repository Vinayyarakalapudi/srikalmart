const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const PORT = process.env.PORT || 5000

// Import database connection
const connectDB = require("./config/db")

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static("public"));
app.use(cors());

// MongoDB connection
connectDB();

// Routes
app.use('/api/items', require("./routes/items"))
app.use('/api/auth', require("./routes/auth"))
app.use('/api/orders', require("./routes/orders"))

// Checkout endpoint with alerts
app.post('/api/checkout', (req, res) => {
    const { items, totalAmount, shippingInfo } = req.body;
    
    // Simple validation
    if (!items || items.length === 0) {
        return res.status(400).json({ 
            alert: 'error',
            message: 'Your cart is empty. Please add items before checkout.' 
        });
    }
    
    if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.email) {
        return res.status(400).json({ 
            alert: 'error',
            message: 'Please fill in all required shipping information.' 
        });
    }
    
    // Simulate order processing
    const orderId = 'ORD-' + Date.now();
    
    // Send success response with alert
    res.json({
        alert: 'success',
        message: 'Order placed successfully!',
        orderId: orderId,
        totalAmount: totalAmount,
        itemsCount: items.length,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', message: 'E-commerce backend with authentication' });
});

app.listen(PORT, console.log("Server is running on port ", PORT))

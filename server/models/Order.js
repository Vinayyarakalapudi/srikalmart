const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        size: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    customerInfo: {
        name: String,
        email: String,
        address: String,
        phone: String
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

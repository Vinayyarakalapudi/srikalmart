const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
    // Register user
    register: async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Combine firstName + lastName
            const name = `${firstName} ${lastName}`.trim();

            const user = new User({ name, firstName, lastName, email, password });
            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

            res.status(201).json({
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            });
        } catch (error) {
            console.error("Register error:", error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            const user = await User.findOne({ email });
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

            res.json({
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get current user data
    getCurrentUser: async (req, res) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) return res.status(401).json({ message: 'No token provided' });

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await User.findById(decoded.id).select('-password');

            if (!user) return res.status(404).json({ message: 'User not found' });

            res.json({
                _id: user._id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    }
};

module.exports = authController;

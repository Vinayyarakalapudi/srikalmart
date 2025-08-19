const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
    // Get current user data
    getCurrentUser: async (req, res) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            });
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
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

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
                expiresIn: '7d'
            });

            res.json({
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Register user
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const user = new User({ name, email, password });
            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
                expiresIn: '7d'
            });

            res.status(201).json({
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Logout user
    logout: async (req, res) => {
        res.json({ message: 'Logged out successfully' });
    },

    // Update user profile
    updateProfile: async (req, res) => {
        try {
            const { name, email, firstName, lastName } = req.body;
            const userId = req.user.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update fields if provided
            if (name) user.name = name;
            if (email) user.email = email;
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;

            await user.save();

            res.json({
                message: 'Profile updated successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = authController;

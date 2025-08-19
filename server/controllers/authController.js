const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const authController = {
    // Register user
    register: async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body;

            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const name = `${firstName} ${lastName}`.trim();

            const user = new User({ name, firstName, lastName, email, password: hashedPassword });
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
            if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

            const user = await User.findOne({ email });
            if (!user) return res.status(401).json({ message: 'Invalid credentials' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

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
            const user = await User.findById(req.user._id).select('-password');
            if (!user) return res.status(404).json({ message: 'User not found' });

            res.json({
                _id: user._id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
        } catch (error) {
            console.error("Get user error:", error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = authController;

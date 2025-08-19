const mongoose = require("mongoose")
const crypto = require("crypto")

// Simple encoding/decoding for demonstration
// In production, use proper environment variables or secure key management
const encodePassword = (password) => {
    return Buffer.from(password).toString('base64')
}

const decodePassword = (encodedPassword) => {
    try {
        return Buffer.from(encodedPassword, 'base64').toString('utf-8')
    } catch (e) {
        return encodedPassword
    }
}

const connectDB = async () => {
    try {
        let connectionString;
        
        // Check for encoded password in environment
        const encodedPassword = process.env.DB_PASSWORD_ENCODED;
        const plainPassword = process.env.DB_PASSWORD;
        
        // Use encoded password if available, otherwise use plain password
        let password = encodedPassword ? decodePassword(encodedPassword) : plainPassword;
        
        // Build connection string with secure password handling
        if (password || process.env.MONGODB_URI) {
            const username = process.env.DB_USERNAME || 'yvinay7989';
            const cluster = process.env.DB_CLUSTER || 'srikalmart.pmu6mqa.mongodb.net';
            const dbname = process.env.DB_NAME || 'mern-ecommerce';
            
            // Use full URI if provided, otherwise build from components
            if (process.env.MONGODB_URI) {
                connectionString = process.env.MONGODB_URI;
            } else {
                connectionString = `mongodb+srv://${username}:${password}@${cluster}/${dbname}?retryWrites=true&w=majority`;
            }
            console.log("Attempting to connect to MongoDB Atlas...")
        } else {
            // Local MongoDB connection (kept as fallback)
            connectionString = 'mongodb://localhost:27017/mern-ecommerce';
            console.log("Using local MongoDB connection...")
        }
        
        const conn = await mongoose.connect(connectionString)
        console.log("MongoDB Connected Successfully")
        console.log("Database: ", conn.connection.name)
        console.log("Host: ", conn.connection.host)
    }
    catch(err) {
        console.log("Error connecting to MongoDB:", err)
        console.log("Falling back to localhost connection...")
        try {
            const fallbackConn = await mongoose.connect('mongodb://localhost:27017/mern-ecommerce')
            console.log("Connected to local MongoDB successfully")
            console.log("Database: ", fallbackConn.connection.name)
        } catch (localErr) {
            console.log("Error connecting to local MongoDB:", localErr)
            process.exit(1)
        }
    }
}

// Helper function to encode your password (run once to get encoded version)
const encodeYourPassword = (plainPassword) => {
    return encodePassword(plainPassword)
}

module.exports = connectDB

// Export helper for encoding passwords
module.exports.encodeYourPassword = encodeYourPassword

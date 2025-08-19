const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        let connectionString;
        
        const username = process.env.DB_USERNAME || 'yvinay7989';
        let password = process.env.DB_PASSWORD || '';
        const cluster = process.env.DB_CLUSTER || 'srikalmart.pmu6mqa.mongodb.net';
        const dbname = process.env.DB_NAME || 'mern-ecommerce';

        // 🔥 Encode password so special chars (@, #, $, etc.) don't break the URI
        if (password) {
            password = encodeURIComponent(password);
        }

        // Use full URI if provided, otherwise build from parts
        if (process.env.MONGODB_URI) {
            connectionString = process.env.MONGODB_URI;
        } else {
            connectionString = `mongodb+srv://${username}:${password}@${cluster}/${dbname}?retryWrites=true&w=majority`;
        }

        console.log("Attempting to connect to MongoDB Atlas...");
        const conn = await mongoose.connect(connectionString);
        console.log("✅ MongoDB Connected Successfully");
        console.log("Database:", conn.connection.name);
        console.log("Host:", conn.connection.host);

    } catch (err) {
        console.error("❌ Error connecting to MongoDB:", err.message);
        console.log("Falling back to localhost connection...");

        try {
            const fallbackConn = await mongoose.connect('mongodb://localhost:27017/mern-ecommerce');
            console.log("✅ Connected to local MongoDB successfully");
            console.log("Database:", fallbackConn.connection.name);
        } catch (localErr) {
            console.error("❌ Error connecting to local MongoDB:", localErr.message);
            process.exit(1);
        }
    }
};

module.exports = connectDB;

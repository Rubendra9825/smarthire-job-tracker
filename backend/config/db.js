/* ============================================================
   config/db.js — MongoDB connection  (Stage 4)
   ============================================================
   This file is a STUB in Stage 3 — it does nothing yet.
   In Stage 4 we will:
     1. Install mongoose: npm install mongoose
     2. Call connectDB() from server.js before starting the server
     3. Replace the in-memory array in controllers with DB queries
   ============================================================ */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅  MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌  MongoDB connection failed: ${error.message}`);
        process.exit(1); // Stop the server if DB fails
    }
};

module.exports = connectDB;

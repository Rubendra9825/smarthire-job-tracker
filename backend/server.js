

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');      const applicationRoutes = require('./routes/applications');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARE ───────────────────────────────────────────────
app.use(express.json());
app.use(cors());

// ── ROUTES ───────────────────────────────────────────────────
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', require('./routes/auth')); app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'SmartHire API is running 🚀',
        timestamp: new Date().toISOString(),
        stage: 'Stage 4 — MongoDB connected',
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// Central error handler (must be last)
app.use(errorHandler);

// ── START SERVER ─────────────────────────────────────────────
if (require.main === module) {
    // We wait for the database connection before doing anything else.
    // If the DB connection fails, the server never starts.
    connectDB();

    app.listen(PORT, () => {
        console.log(`\n✅  SmartHire API running at http://localhost:${PORT}`);
        console.log(`   Health check: http://localhost:${PORT}/api/health`);
        console.log(`   Applications: http://localhost:${PORT}/api/applications\n`);
    });
}

module.exports = app; // Export for testing

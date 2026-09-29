

const User = require('../models/User');

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({
        success: true,
        token,
    });
};

// ── REGISTER USER ──────────────────────────────────────────
// POST /api/auth/register
// Public

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Create user (password is hashed by pre-save hook in model)
        const user = await User.create({
            name,
            email,
            password,
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// ── LOGIN USER ─────────────────────────────────────────────
// POST /api/auth/login
// Public

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email and password',
            });
        }

        // Check for user
        // We add +password because we set select: false in the schema
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// ── GET CURRENT LOGGED IN USER ──────────────────────────────
// GET /api/auth/me
// Private (requires token)

const getMe = async (req, res, next) => {
    try {
        // req.user is set by the protect middleware
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    getMe,
};

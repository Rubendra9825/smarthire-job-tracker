

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check if header string starts with "Bearer "
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Format is "Bearer <token>". Split by space to get just the token.
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route (token missing)',
        });
    }

    try {
        // Verify token using the secret key in .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to req object (so next middleware/controllers can access it)
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'The user belonging to this token no longer exists.',
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route (invalid or expired token)',
        });
    }
};

module.exports = { protect };

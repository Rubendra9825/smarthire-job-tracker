

const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

// Requires valid JWT token to access
router.get('/me', protect, getMe);

module.exports = router;

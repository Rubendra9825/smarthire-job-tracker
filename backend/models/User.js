/* ============================================================
   models/User.js — Mongoose Schema for Users
   ============================================================ */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return the password when querying users
        },
        // Optional profile fields for Stage 7/8
        bio: { type: String, default: '' },
        skills: { type: [String], default: [] },
    },
    {
        timestamps: true,
    }
);

// ── PRE-SAVE HOOK (Hash Password) ──────────────────────────
// Before saving the user to the database, hash the password
// using bcrypt if it was modified (or recently created).
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ── INSTANCE METHODS ────────────────────────────────────────
// Method to generate JWT token for the user
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Method to verify entered password matches hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

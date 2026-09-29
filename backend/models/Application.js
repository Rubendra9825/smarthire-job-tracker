

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        // Who is the user that created this application?
                user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
            maxlength: [100, 'Company name cannot exceed 100 characters'],
        },

        jobTitle: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
            maxlength: [100, 'Job title cannot exceed 100 characters'],
        },

        location: {
            type: String,
            trim: true,
            default: '',
        },

        jobType: {
            type: String,
            enum: ['Full-time', 'Internship', 'Part-time', 'Contract', 'Remote'],
            default: 'Full-time',
        },

        salary: {
            type: String,
            default: '',
        },

        status: {
            type: String,
            enum: ['Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'],
            default: 'Applied',
        },

        applicationDate: {
            type: Date,
            required: [true, 'Application date is required'],
            default: Date.now,
        },

        interviewDate: {
            type: Date,
            default: null,
        },

        jobUrl: {
            type: String,
            default: '',
        },

        notes: {
            type: String,
            maxlength: [2000, 'Notes cannot exceed 2000 characters'],
            default: '',
        },
    },
    {
        // Automatically adds createdAt and updatedAt fields
        timestamps: true,
    }
);

module.exports = mongoose.model('Application', applicationSchema);

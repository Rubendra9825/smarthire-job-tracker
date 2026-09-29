

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Application = require('./models/Application');

// ── SAMPLE DATA ───────────────────────────────────────────────
// Same 10 applications as the frontend SAMPLE_APPS.
// instead of using its own copy.

const sampleApps = [
    { company: 'Google', jobTitle: 'Software Engineer Intern', location: 'Bangalore, India', jobType: 'Internship', salary: '₹80,000/mo', status: 'Interview', applicationDate: '2025-09-10', interviewDate: '2025-10-05', jobUrl: 'https://careers.google.com', notes: 'Referred by alumni. Prepare system design + DSA.' },
    { company: 'Microsoft', jobTitle: 'Frontend Developer', location: 'Hyderabad, India', jobType: 'Full-time', salary: '₹18 LPA', status: 'Applied', applicationDate: '2025-09-15', interviewDate: null, jobUrl: 'https://careers.microsoft.com', notes: '' },
    { company: 'Flipkart', jobTitle: 'Backend Engineer', location: 'Bangalore, India', jobType: 'Full-time', salary: '₹22 LPA', status: 'Assessment', applicationDate: '2025-09-12', interviewDate: null, jobUrl: 'https://flipkartcareers.com', notes: 'Online test on Sept 20.' },
    { company: 'Amazon', jobTitle: 'SDE-1', location: 'Remote', jobType: 'Full-time', salary: '₹26 LPA', status: 'Rejected', applicationDate: '2025-08-28', interviewDate: '2025-09-18', jobUrl: 'https://amazon.jobs', notes: 'Failed final round — improve LP answers.' },
    { company: 'Razorpay', jobTitle: 'Product Engineer', location: 'Bangalore, India', jobType: 'Full-time', salary: '₹20 LPA', status: 'Offer', applicationDate: '2025-08-20', interviewDate: '2025-09-05', jobUrl: 'https://razorpay.com/jobs', notes: 'Got verbal offer! Waiting for final letter.' },
    { company: 'Swiggy', jobTitle: 'Data Analyst Intern', location: 'Pune, India', jobType: 'Internship', salary: '₹30,000/mo', status: 'Applied', applicationDate: '2025-09-18', interviewDate: null, jobUrl: 'https://careers.swiggy.com', notes: '' },
    { company: 'Zepto', jobTitle: 'React Developer', location: 'Mumbai, India', jobType: 'Full-time', salary: '₹15 LPA', status: 'Interview', applicationDate: '2025-09-08', interviewDate: '2025-10-12', jobUrl: '', notes: 'Round 2 scheduled.' },
    { company: 'CRED', jobTitle: 'Full Stack Engineer', location: 'Bangalore, India', jobType: 'Full-time', salary: '₹28 LPA', status: 'Applied', applicationDate: '2025-09-20', interviewDate: null, jobUrl: 'https://careers.cred.club', notes: '' },
    { company: 'Atlassian', jobTitle: 'Software Engineer', location: 'Remote', jobType: 'Full-time', salary: '₹35 LPA', status: 'Assessment', applicationDate: '2025-09-14', interviewDate: null, jobUrl: 'https://www.atlassian.com/company/careers', notes: 'Skills test sent on Sept 16.' },
    { company: 'Meesho', jobTitle: 'Mobile Developer', location: 'Bangalore, India', jobType: 'Full-time', salary: '₹16 LPA', status: 'Rejected', applicationDate: '2025-09-01', interviewDate: null, jobUrl: '', notes: 'Rejected at resume screening stage.' },
];

const importData = async () => {
    try {
        await connectDB();

        // Load models
        const User = require('./models/User');

        // Clear existing
        await Application.deleteMany();
        await User.deleteMany();

        // 1. Create a demo user
        const demoUser = await User.create({
            name: 'Demo User',
            email: 'test@example.com',
            password: 'password123',
        });

        // 2. Attach the demo user's ID to all sample applications
        const appsWithUser = sampleApps.map(app => {
            return { ...app, user: demoUser._id };
        });

        // 3. Insert applications
        await Application.insertMany(appsWithUser);

        console.log('✅  Sample data (with Demo User) imported to MongoDB successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌  Error importing data:', err.message);
        process.exit(1);
    }
};

// ── DELETE DATA ───────────────────────────────────────────────
const deleteData = async () => {
    try {
        await connectDB();
        await Application.deleteMany();
        console.log('✅  All data deleted from MongoDB.');
        process.exit(0);
    } catch (err) {
        console.error('❌  Error deleting data:', err.message);
        process.exit(1);
    }
};

// ── RUN BASED ON FLAG ─────────────────────────────────────────
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
} else {
    console.log('Usage: node seeder.js --import | --delete');
    process.exit(1);
}

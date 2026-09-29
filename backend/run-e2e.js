const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./server'); // This doesn't start the server because of our require.main check!
const User = require('./models/User');
const Application = require('./models/Application');

async function start() {
    console.log('Spinning up MongoMemoryServer...');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    console.log('Connected to mock MongoDB.');

    // Create demo user
    const demoUser = await User.create({
        name: 'Demo User',
        email: 'test@example.com',
        password: 'password123'
    });
    console.log('Demo user test@example.com created.');

    // Create mock apps
    await Application.insertMany([
        { company: 'Google (Mock)', jobTitle: 'Software Engineer', location: 'Remote', jobType: 'Full-time', salary: '20 LPA', status: 'Applied', applicationDate: '2026-09-10', user: demoUser._id },
        { company: 'Microsoft (Mock)', jobTitle: 'Frontend Developer', location: 'Seattle', jobType: 'Full-time', salary: '150k USD', status: 'Interview', applicationDate: '2026-09-15', user: demoUser._id },
        { company: 'Startup XYZ (Mock)', jobTitle: 'Intern', location: 'Local', jobType: 'Internship', salary: 'Unpaid', status: 'Rejected', applicationDate: '2026-09-18', user: demoUser._id }
    ]);
    console.log('Mock applications seeded.');

    app.listen(5000, () => {
        console.log('✅ Mock Backend API listening on port 5000');
    });
}

start();

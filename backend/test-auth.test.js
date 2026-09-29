const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('./server'); // Our Express app

let mongoServer;

describe('Stage 5 - JWT Authentication', () => {

    beforeAll(async () => {
        // 1. Start MongoDB in memory
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        // 2. Connect Mongoose to the memory server
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        // Clean up
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    afterEach(async () => {
        // Clear collections between tests to avoid collisions
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    });

    let token;

    it('1. POST /api/auth/register should create a user and return a JWT', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();

        token = res.body.token; // Save token for next tests
    });

    it('2. POST /api/auth/login should return a JWT', async () => {
        // First, register
        await request(app).post('/api/auth/register').send({
            name: 'Login User',
            email: 'login@example.com',
            password: 'password123'
        });

        // Then login
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });

    it('3. GET /api/auth/me should fail without a token', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('4. GET /api/auth/me should succeed with a valid token', async () => {
        // Register
        const regRes = await request(app).post('/api/auth/register').send({
            name: 'Me User',
            email: 'me@example.com',
            password: 'password123'
        });

        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${regRes.body.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Me User');
    });

    it('5. Application routes should be protected', async () => {
        // Should fail without token
        const resFail = await request(app).get('/api/applications');
        expect(resFail.statusCode).toBe(401);

        // Should succeed with token
        const regRes = await request(app).post('/api/auth/register').send({
            name: 'App User',
            email: 'app@example.com',
            password: 'password123'
        });

        const resSuccess = await request(app)
            .get('/api/applications')
            .set('Authorization', `Bearer ${regRes.body.token}`);

        expect(resSuccess.statusCode).toBe(200); // OK, empty array of apps
        expect(resSuccess.body.data.length).toBe(0);
    });

});

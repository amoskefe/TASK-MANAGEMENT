const request = require('supertest');
const app = require('../server'); // Assuming your Express app is exported from server.js
const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const chai = require('chai');
const expect = chai.expect;

describe('Task API', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('should create a new task', async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password' });
    const token = 'your_jwt_token'; // Generate a valid JWT token for the user

    const res = await request(app)
      .post('/api/tasks')
      .set('x-auth-token', token)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        status: 'To Do',
        priority: 'Medium'
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('title', 'Test Task');
  });

  // Add more tests for other endpoints
});

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const swaggerSetup = require('./swagger');

dotenv.config();
const app = express();

connectDB();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.json({ limit: '10kb' }));

// Apply rate limiting to all requests
app.use(apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Swagger documentation
swaggerSetup(app);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

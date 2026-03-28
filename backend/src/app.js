const express = require('express');
const app = express();

const feedbackRoutes = require('./routes/feedback.routes');
const authRoutes = require('./routes/auth.routes');

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);

module.exports = app;
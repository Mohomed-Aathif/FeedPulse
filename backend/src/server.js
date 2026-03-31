const app = require('./app');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB connection failed:', err.message);
  });

  const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,
  message: {
    success: false,
    message: 'Too many submissions. Try again later.'
  }
});
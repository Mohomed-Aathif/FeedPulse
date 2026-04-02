// One-time script to create initial admin user
// Run manually using: node scripts/createAdmin.js
// Do NOT expose via API routes

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/user.model');

require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash('Admin123', 10);

    const user = new User({
      email: 'admin@example.com',
      password: hashedPassword
    });

    await user.save();

    console.log('Admin user created successfully');
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
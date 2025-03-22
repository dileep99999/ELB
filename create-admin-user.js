const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB connected');
    
    // Check if admin user already exists
    const existingUser = await User.findOne({ username: 'admin' });
    
    if (existingUser) {
      console.log('Admin user already exists!');
    } else {
      // Create salt & hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin@123', salt);
      
      // Create new user
      const newUser = new User({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      
      // Save user to database
      await newUser.save();
      console.log('Admin user created successfully!');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

// Run the function
createAdminUser();
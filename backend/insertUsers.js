// backend/insertUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Use your existing User model
const User = require('../models/user'); // Adjust path if needed

async function insertTestUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Clear existing users (optional)
    const existingCount = await User.countDocuments();
    console.log(`📊 Current users in database: ${existingCount}`);
    
    if (existingCount > 0) {
      console.log('🗑️ Clearing existing users...');
      await User.deleteMany({});
    }

    // Create test users with plain passwords (your User model will hash them)
    const testUsersData = [
      {
        name: 'Sarah Ahmed',
        email: 'sarah@example.com',
        phoneNumber: '+8801712345678',
        password: 'password123',
        role: 'user',
        trustedContacts: ['+8801987654321', '+8801876543210']
      },
      {
        name: 'Test User',
        email: 'test@test.com',
        phoneNumber: '+8801111111111',
        password: '123456',
        role: 'user',
        trustedContacts: ['+8801222222222']
      },
      {
        name: 'Admin User1',
        email: 'admin@gmail.com',
        phoneNumber: '+8801700000000',
        password: 'admin123',
        role: 'admin',
        trustedContacts: ['+880133333349']
      }
 
    ];

    console.log('👤 Creating users...');
    
    // Insert users one by one to trigger your model's password hashing
    for (const userData of testUsersData) {
      try {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created: ${user.name} (${user.email})`);
      } catch (error) {
        console.error(`❌ Failed to create ${userData.email}:`, error.message);
      }
    }

    // Verify the data
    const users = await User.find({}).select('-password');
    console.log(`\n👥 Total users created: ${users.length}`);
    
    console.log('\n📋 Login Credentials:');
    users.forEach((user, index) => {
      const passwords = ['password123', '123456', 'admin123'];
      console.log(`${index + 1}. Email: ${user.email} | Password: ${passwords[index]} | Role: ${user.role}`);
    });

    console.log('\n🎉 Data insertion completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 11000) {
      console.log('💡 Duplicate key error - some users might already exist');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

insertTestUsers();
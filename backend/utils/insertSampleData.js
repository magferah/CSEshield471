// backend/utils/insertSampleData.js
// Run this script to insert sample data into MongoDB

const mongoose = require('mongoose');
const User = require('../models/user'); // Adjust path as needed
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample users data
const sampleUsers = [
  {
    name: 'Sarah Ahmed',
    email: 'sarah@example.com',
    phoneNumber: '+8801712345678',
    password: 'password123',
    role: 'user',
    trustedContacts: ['+8801987654321', '+8801876543210'],
    emergencyMessage: 'Emergency! Please help me immediately!',
    currentLocation: {
      latitude: 23.8103,
      longitude: 90.4125,
      address: 'Dhaka, Bangladesh'
    }
  },
  {
    name: 'Fatima Khan',
    email: 'fatima@example.com',
    phoneNumber: '+8801812345679',
    password: 'password123',
    role: 'user',
    trustedContacts: ['+8801987654322', '+8801876543211'],
    emergencyMessage: 'I need help! This is an emergency!',
    currentLocation: {
      latitude: 23.7808,
      longitude: 90.2792,
      address: 'Gulshan, Dhaka'
    }
  },
  {
    name: 'Rashida Begum',
    email: 'rashida@example.com',
    phoneNumber: '+8801912345680',
    password: 'password123',
    role: 'user',
    trustedContacts: ['+8801987654323'],
    emergencyMessage: 'Emergency situation! Please contact authorities!',
    currentLocation: {
      latitude: 23.7461,
      longitude: 90.3742,
      address: 'Dhanmondi, Dhaka'
    }
  },
  {
    name: 'Admin User',
    email: 'admin@safetyapp.com',
    phoneNumber: '+8801700000000',
    password: 'admin123',
    role: 'admin',
    trustedContacts: [],
    emergencyMessage: 'Admin emergency contact',
    currentLocation: {
      latitude: 23.8103,
      longitude: 90.4125,
      address: 'Dhaka, Bangladesh'
    }
  }
];

// Function to insert sample data
const insertSampleData = async () => {
  try {
    // Clear existing users (optional - remove this if you want to keep existing data)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert sample users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`${insertedUsers.length} sample users inserted successfully`);
    
    // Display inserted users (without passwords)
    insertedUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};

// Function to verify data insertion
const verifyData = async () => {
  try {
    const users = await User.find({}).select('-password');
    console.log('\n=== Current Users in Database ===');
    users.forEach(user => {
      console.log(`ID: ${user._id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Phone: ${user.phoneNumber}`);
      console.log(`Role: ${user.role}`);
      console.log(`Trusted Contacts: ${user.trustedContacts.join(', ')}`);
      console.log(`Created: ${user.createdAt}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error verifying data:', error);
  }
};

// Main execution function
const main = async () => {
  await connectDB();
  
  console.log('Starting sample data insertion...');
  await insertSampleData();
  
  console.log('\nVerifying inserted data...');
  await verifyData();
  
  console.log('\nSample data insertion completed!');
  mongoose.connection.close();
};

// Run the script
main().catch(error => {
  console.error('Script execution error:', error);
  mongoose.connection.close();
});

// Export for use in other files if needed
module.exports = { insertSampleData, verifyData };
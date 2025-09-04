// backend/testConnection.js
require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Environment Variables Check:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

if (process.env.MONGODB_URI) {
  console.log('MONGODB_URI (first 50 chars):', process.env.MONGODB_URI.substring(0, 50) + '...');
} else {
  console.log('❌ MONGODB_URI is undefined!');
}

async function testConnection() {
  try {
    console.log('\n🔌 Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ name: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ name: 'Connection Test' });
    await testDoc.save();
    console.log('✅ Successfully created test document!');
    
    // Clean up
    await TestModel.deleteOne({ name: 'Connection Test' });
    console.log('✅ Test document cleaned up!');
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 This looks like a password/username issue');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('💡 This looks like a network connectivity issue');
    } else if (error.message.includes('uri')) {
      console.log('💡 This looks like an invalid connection string');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

testConnection();
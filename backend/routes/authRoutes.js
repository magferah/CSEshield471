// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Test route to check if API is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth API is working!', 
    timestamp: new Date().toISOString(),
    server: 'Safety App Backend'
  });
});

// Get all users (for debugging - remove in production)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({
      message: 'Users retrieved successfully',
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    console.log('📝 Signup request received:', { 
      name: req.body.name, 
      email: req.body.email, 
      phoneNumber: req.body.phoneNumber 
    });
    
    const { name, email, phoneNumber, password } = req.body;
    
    // Validation
    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ 
        message: 'All fields are required (name, email, phoneNumber, password)' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase().trim() }, 
        { phoneNumber: phoneNumber.trim() }
      ] 
    });
    
    if (existingUser) {
      console.log('❌ User already exists:', existingUser.email);
      return res.status(400).json({ 
        message: 'User already exists with this email or phone number' 
      });
    }
    
    // Create new user (password will be hashed by pre-save middleware)
    const user = new User({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      phoneNumber: phoneNumber.trim(), 
      password,
      role: 'user'
    });
    
    await user.save();
    console.log('✅ User created successfully:', user.email);
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login request received for email:', req.body.email);
    
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user (case-insensitive email search)
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    console.log('✅ User found:', user.email);
    
    // Check password using your model's method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    console.log('✅ Password matched for user:', email);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    console.log('✅ Login successful for user:', email);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

module.exports = router;
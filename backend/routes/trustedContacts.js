// backend/routes/TrustedContacts.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Make sure this path is correct to your User model

// GET all contacts for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('🔍 Fetching contacts for userId:', userId);
    
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Convert the trustedContacts array (phone numbers) to objects with IDs
    // This makes it compatible with your existing frontend
    const contacts = user.trustedContacts.map((phone, index) => ({
      _id: `${userId}_${index}`, // Create a unique ID for frontend compatibility
      userId: userId,
      name: phone, // Initially, use phone as name (you can enhance this later)
      phone: phone
    }));
    
    console.log(`✅ Found ${contacts.length} contacts for user`);
    res.json(contacts);
  } catch (err) {
    console.error('❌ Error fetching contacts:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ADD a new trusted contact
router.post('/', async (req, res) => {
  try {
    console.log('📥 Received POST request body:', req.body);
    
    const { userId, name, phone } = req.body;
    
    // Detailed validation
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      console.log('❌ Invalid userId:', userId);
      return res.status(400).json({ msg: 'Valid User ID is required' });
    }
    
    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      console.log('❌ Invalid phone:', phone);
      return res.status(400).json({ msg: 'Phone number is required and cannot be empty' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if phone already exists in trusted contacts
    if (user.trustedContacts.includes(phone.trim())) {
      console.log('⚠️ Duplicate contact detected:', phone.trim());
      return res.status(400).json({ 
        msg: 'This phone number is already in your trusted contacts' 
      });
    }
    
    // Add phone to trusted contacts array
    user.trustedContacts.push(phone.trim());
    await user.save();
    
    console.log('✅ All fields validated successfully');
    console.log('- userId:', userId);
    console.log('- name:', name?.trim() || 'Not provided');
    console.log('- phone:', phone.trim());
    
    // Return the new contact in the expected format
    const newContact = {
      _id: `${userId}_${user.trustedContacts.length - 1}`,
      userId: userId,
      name: name?.trim() || phone.trim(), // Use name if provided, otherwise use phone
      phone: phone.trim()
    };
    
    console.log('✅ Contact added successfully:', newContact);
    res.status(201).json(newContact);
  } catch (err) {
    console.error('❌ Database error:', err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: errors.join(', ') });
    }
    
    // Handle invalid ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid user ID format' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE a contact by userId and phone number
router.delete('/:userId/:phone', async (req, res) => {
  try {
    const { userId, phone } = req.params;
    const decodedPhone = decodeURIComponent(phone); // Decode the phone number
    
    console.log('🗑️ Deleting contact:', decodedPhone, 'for user:', userId);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const originalLength = user.trustedContacts.length;
    user.trustedContacts = user.trustedContacts.filter(contact => contact !== decodedPhone);
    
    if (user.trustedContacts.length === originalLength) {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    
    await user.save();
    
    console.log('✅ Contact deleted successfully');
    res.json({ msg: 'Contact deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    
    // Handle invalid ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid user ID format' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// BONUS: Get a user's emergency info (for panic situations)
router.get('/emergency/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('trustedContacts emergencyMessage name');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json({
      userName: user.name,
      emergencyMessage: user.emergencyMessage,
      trustedContacts: user.trustedContacts
    });
  } catch (err) {
    console.error('❌ Emergency info error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
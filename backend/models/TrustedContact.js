// Enhanced TrustedContact model that stores both name and phone
const mongoose = require('mongoose');

const trustedContactSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId reference
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  name: { 
    type: String, 
    required: [true, 'Contact name is required'],
    trim: true,
    minlength: [1, 'Name cannot be empty'],
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true,
    minlength: [1, 'Phone number cannot be empty'],
  },
}, {
  timestamps: true
});

// Compound index to prevent duplicate contacts per user
trustedContactSchema.index({ userId: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model('TrustedContact', trustedContactSchema);

// Updated routes for separate collection approach
const express = require('express');
const router = express.Router();
const TrustedContact = require('../models/TrustedContact');

// GET all contacts for a user  
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('🔍 Fetching contacts for userId:', userId);
    
    const contacts = await TrustedContact.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${contacts.length} contacts for user ${userId}`);
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
    
    if (!userId || userId.trim() === '') {
      return res.status(400).json({ msg: 'Valid User ID is required' });
    }
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ msg: 'Contact name is required' });
    }
    
    if (!phone || phone.trim() === '') {
      return res.status(400).json({ msg: 'Phone number is required' });
    }
    
    const contact = new TrustedContact({ 
      userId: userId.trim(), 
      name: name.trim(), 
      phone: phone.trim() 
    });
    
    const savedContact = await contact.save();
    console.log('✅ Contact saved successfully:', savedContact);
    
    res.status(201).json(savedContact);
  } catch (err) {
    console.error('❌ Database error:', err);
    
    if (err.code === 11000) { // Duplicate key error
      return res.status(400).json({ msg: 'This contact already exists for this user' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting contact with ID:', id);
    
    const deletedContact = await TrustedContact.findByIdAndDelete(id);
    
    if (!deletedContact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    
    console.log('✅ Contact deleted successfully:', deletedContact.name);
    res.json({ msg: 'Contact deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;



const User = require('../models/User');

// Demo user ID for demonstration without authentication
const DEMO_USER_ID = '507f1f77bcf86cd799439011';

async function listContacts(req, res, next) {
  try {
    // Use demo user ID since we removed authentication
    const user = await User.findById(DEMO_USER_ID).select('contacts').lean();
    if (!user) {
      // Create demo user if doesn't exist
      const newUser = new User({ 
        _id: DEMO_USER_ID, 
        name: 'Demo User',
        email: 'demo@shield.com',
        passwordHash: 'demo_hash',
        contacts: [] 
      });
      await newUser.save();
      return res.json([]);
    }
    res.json(user.contacts || []);
  } catch (err) {
    next(err);
  }
}

async function addContact(req, res, next) {
  try {
    const { name, phone, email } = req.body;
    let user = await User.findById(DEMO_USER_ID);
    
    if (!user) {
      // Create demo user if doesn't exist
      user = new User({ 
        _id: DEMO_USER_ID, 
        name: 'Demo User',
        email: 'demo@shield.com',
        passwordHash: 'demo_hash',
        contacts: [] 
      });
    }
    
    user.contacts.push({ name, phone, email });
    await user.save();
    res.status(201).json(user.contacts);
  } catch (err) {
    next(err);
  }
}

async function removeContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const user = await User.findById(DEMO_USER_ID);
    if (!user) {
      return res.json([]);
    }
    const c = user.contacts.id(contactId);
    if (c) c.deleteOne();
    await user.save();
    res.json(user.contacts);
  } catch (err) {
    next(err);
  }
}

module.exports = { listContacts, addContact, removeContact };
// backend/routes/liveLocationRoutes.js
const express = require('express');
const router = express.Router();
const LiveLocation = require('../models/LiveLocation');
const User = require('../models/user'); // Make sure you have User model

// POST /api/live/update
router.post('/update', async (req, res) => {
  const { userId, latitude, longitude, isSharing } = req.body;
  
  if (!userId || latitude == null || longitude == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let live = await LiveLocation.findOne({ userId });

    if (live) {
      live.latitude = latitude;
      live.longitude = longitude;
      live.isSharing = isSharing !== false;
      live.updatedAt = new Date();
      await live.save();
    } else {
      live = await LiveLocation.create({ userId, latitude, longitude, isSharing: true });
    }

    // ✅ Also update User model
    await User.findByIdAndUpdate(userId, {
      currentLocation: {
        latitude,
        longitude,
        lastUpdated: new Date()
      }
    });

    res.json({ message: 'Location updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/live/stop
router.post('/stop', async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) return res.status(400).json({ message: 'User ID is required' });
  
  try {
    const existing = await LiveLocation.findOne({ userId });
    
    if (existing) {
      existing.isSharing = false;
      existing.updatedAt = new Date();
      await existing.save();
      res.json({ message: 'Live location sharing stopped' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Stop error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/live/shared - Get all users currently sharing their location
router.get('/shared', async (req, res) => {
  try {
    // Get all active live locations with user details
    const sharedLocations = await LiveLocation.find({ isSharing: true })
      .populate('userId', 'name phone email') // Populate user details
      .sort({ updatedAt: -1 });
    
    // Format the response
    const formattedLocations = sharedLocations.map(location => ({
      contactId: location.userId._id,
      name: location.userId.name,
      phone: location.userId.phone,
      email: location.userId.email,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      lastUpdated: location.updatedAt
    }));
    
    res.json({ 
      success: true,
      sharedLocations: formattedLocations 
    });
  } catch (err) {
    console.error('Get shared locations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/live/user/:userId - Get specific user's location if they're sharing
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const location = await LiveLocation.findOne({ 
      userId, 
      isSharing: true 
    }).populate('userId', 'name phone email');
    
    if (!location) {
      return res.status(404).json({ message: 'User not sharing location' });
    }
    
    res.json({
      success: true,
      location: {
        contactId: location.userId._id,
        name: location.userId.name,
        phone: location.userId.phone,
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        lastUpdated: location.updatedAt
      }
    });
  } catch (err) {
    console.error('Get user location error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const PoliceStation = require('../models/PoliceStation');

// Get nearby police stations
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    let policeStations = [];
    try {
      // Try to get police stations within the radius
      policeStations = await PoliceStation.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseInt(radius)
          }
        }
      }).limit(20);
      
      // If no police stations found within radius, get all (for testing)
      if (policeStations.length === 0) {
        console.log('No police stations found within radius, getting all for testing');
        policeStations = await PoliceStation.find().limit(20);
      }
    } catch (error) {
      console.error('Database query error:', error);
      // Fallback to getting all police stations
      policeStations = await PoliceStation.find().limit(20);
    }

    console.log(`Found ${policeStations.length} police stations`);

    res.json({
      success: true,
      policeStations: policeStations,
      total: policeStations.length
    });

  } catch (error) {
    console.error('Error getting nearby police stations:', error);
    res.status(500).json({ error: 'Failed to get nearby police stations' });
  }
});

// Get all police stations
router.get('/', async (req, res) => {
  try {
    const policeStations = await PoliceStation.find();
    res.json({
      success: true,
      policeStations: policeStations,
      total: policeStations.length
    });
  } catch (error) {
    console.error('Error getting police stations:', error);
    res.status(500).json({ error: 'Failed to get police stations' });
  }
});

module.exports = router;

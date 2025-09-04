// backend/routes/incidentRoutes.js - IMPROVED VERSION
const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');

// Add debugging middleware for this route
router.use((req, res, next) => {
  console.log(`🔍 Incident Route Hit: ${req.method} ${req.originalUrl}`);
  console.log('📦 Request Body:', req.body);
  console.log('📦 Request Headers:', req.headers);
  next();
});

// POST /api/incident/report - Submit new incident report
router.post('/report', async (req, res) => {
  console.log('🚨 POST /api/incident/report called');
  console.log('📦 Received data:', JSON.stringify(req.body, null, 2));
  
  try {
    const { type, description, location } = req.body;

    // Validate required fields
    if (!type || !description || !location) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Type, description, and location are required',
        received: { type: !!type, description: !!description, location: !!location }
      });
    }

    // Validate location coordinates
    if (!location.latitude || !location.longitude) {
      console.log('❌ Validation failed - invalid location coordinates');
      return res.status(400).json({
        success: false,
        message: 'Valid location coordinates are required',
        received: location
      });
    }

    // Validate incident type
    const validTypes = ['harassment', 'unsafe_road', 'suspicious_activity', 'location', 'other'];
    if (!validTypes.includes(type)) {
      console.log('❌ Validation failed - invalid incident type');
      return res.status(400).json({
        success: false,
        message: 'Invalid incident type',
        validTypes,
        received: type
      });
    }

    console.log('✅ Validation passed, creating incident...');

    // Create new incident
    const incidentData = {
      type,
      description,
      location: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude)
      },
      status: 'reported',
      createdAt: new Date()
    };

    console.log('📝 Creating incident with data:', JSON.stringify(incidentData, null, 2));

    const newIncident = new Incident(incidentData);
    
    // Save to database
    console.log('💾 Saving to database...');
    const savedIncident = await newIncident.save();
    console.log('✅ Incident saved successfully:', savedIncident._id);

    res.status(201).json({
      success: true,
      message: 'Incident reported successfully',
      incident: {
        id: savedIncident._id,
        type: savedIncident.type,
        description: savedIncident.description,
        location: savedIncident.location,
        status: savedIncident.status,
        createdAt: savedIncident.createdAt
      }
    });

  } catch (error) {
    console.error('💥 Error reporting incident:', error);
    console.error('💥 Error stack:', error.stack);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to report incident',
      error: error.message,
      errorType: error.name
    });
  }
});

// GET /api/incident/all - Get all incidents
router.get('/all', async (req, res) => {
  console.log('📋 GET /api/incident/all called');
  
  try {
    const incidents = await Incident.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    console.log(`📊 Found ${incidents.length} incidents`);
    
    res.status(200).json({
      success: true,
      count: incidents.length,
      incidents
    });

  } catch (error) {
    console.error('💥 Error fetching incidents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incidents',
      error: error.message
    });
  }
});

// GET /api/incident/test - Test route
router.get('/test', (req, res) => {
  console.log('🧪 Test route called');
  res.json({
    success: true,
    message: 'Incident routes are working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;




// backend/routes/emergencyRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
// const Report = require('../models/Report'); // You'll create this later
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Emergency API is working!', 
    timestamp: new Date().toISOString(),
    server: 'Safety App Emergency Service'
  });
});

// POST /api/emergency/sos - Trigger SOS emergency
router.post('/sos', authenticateToken, async (req, res) => {
  try {
    console.log('🚨 SOS request received from user:', req.user.email);
    
    const { location, emergencyType, message } = req.body;
    
    // Find the user who triggered SOS
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create emergency record (you can create Emergency model later)
    const emergencyData = {
      userId: user._id,
      userName: user.name,
      userPhone: user.phoneNumber,
      userEmail: user.email,
      location: location || {
        latitude: null,
        longitude: null,
        address: 'Location unavailable'
      },
      emergencyType: emergencyType || 'general',
      message: message || user.emergencyMessage || 'Emergency assistance needed!',
      trustedContacts: user.trustedContacts || [],
      timestamp: new Date(),
      status: 'active'
    };
    
    console.log('📍 Emergency data prepared:', {
      userId: emergencyData.userId,
      location: emergencyData.location.address,
      contactsCount: emergencyData.trustedContacts.length
    });
    
    // TODO: Here you would:
    // 1. Save to Emergency model
    // 2. Send SMS to trusted contacts
    // 3. Send push notifications
    // 4. Alert emergency services if needed
    
    // For now, just simulate the response
    console.log('✅ SOS processed successfully for user:', user.email);
    
    res.json({
      success: true,
      message: 'SOS activated successfully',
      emergency: {
        id: Date.now().toString(), // Temporary ID
        status: 'active',
        timestamp: emergencyData.timestamp,
        location: emergencyData.location,
        contactsNotified: emergencyData.trustedContacts.length
      }
    });
    
  } catch (error) {
    console.error('❌ SOS trigger error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to activate SOS',
      error: error.message 
    });
  }
});

// POST /api/emergency/cancel-sos - Cancel active SOS
router.post('/cancel-sos', authenticateToken, async (req, res) => {
  try {
    console.log('⏹️ Cancel SOS request from user:', req.user.email);
    
    const { emergencyId } = req.body;
    
    // TODO: Update emergency status in database
    // const emergency = await Emergency.findByIdAndUpdate(emergencyId, { status: 'cancelled' });
    
    console.log('✅ SOS cancelled successfully');
    
    res.json({
      success: true,
      message: 'SOS cancelled successfully',
      timestamp: new Date()
    });
    
  } catch (error) {
    console.error('❌ Cancel SOS error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to cancel SOS',
      error: error.message 
    });
  }
});

// POST /api/emergency/quick-questions - Process quick questions
router.post('/quick-questions', authenticateToken, async (req, res) => {
  try {
    console.log('❓ Quick questions received from user:', req.user.email);
    
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        success: false,
        message: 'Answers array is required' 
      });
    }
    
    // Simple risk assessment logic
    let riskScore = 0;
    let riskLevel = 'low';
    let shouldTriggerSOS = false;
    
    // Analyze answers (you can make this more sophisticated)
    answers.forEach(answer => {
      if (answer.critical) riskScore += 3;
      else if (answer.moderate) riskScore += 2;
      else if (answer.mild) riskScore += 1;
    });
    
    // Determine risk level
    if (riskScore >= 6) {
      riskLevel = 'high';
      shouldTriggerSOS = true;
    } else if (riskScore >= 3) {
      riskLevel = 'medium';
    }
    
    // Generate recommendations
    let recommendations = [];
    
    switch (riskLevel) {
      case 'high':
        recommendations = [
          'Activate SOS immediately',
          'Contact emergency services (999)',
          'Move to a safe location if possible',
          'Stay on the line with emergency services'
        ];
        break;
      case 'medium':
        recommendations = [
          'Contact a trusted friend or family member',
          'Move to a well-lit, public area',
          'Keep your phone charged and ready',
          'Consider contacting local authorities'
        ];
        break;
      default:
        recommendations = [
          'Stay alert and aware of your surroundings',
          'Trust your instincts',
          'Keep emergency contacts handy',
          'Consider sharing your location with trusted contacts'
        ];
    }
    
    console.log(`📊 Risk assessment: ${riskLevel} (score: ${riskScore})`);
    
    res.json({
      success: true,
      riskLevel,
      riskScore,
      shouldTriggerSOS,
      recommendations,
      message: `Risk level assessed as ${riskLevel}`
    });
    
  } catch (error) {
    console.error('❌ Quick questions error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to process questions',
      error: error.message 
    });
  }
});

// GET /api/emergency/police-stations - Get nearby police stations
router.get('/police-stations', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    
    console.log('🚔 Police stations request:', { latitude, longitude, radius });
    
    // TODO: Implement actual police station lookup
    // For now, return mock data
    const mockPoliceStations = [
      {
        id: 1,
        name: 'Central Police Station',
        address: 'Main Street, City Center',
        phone: '+880-XXX-XXXX',
        distance: 2.5,
        latitude: parseFloat(latitude) + 0.01,
        longitude: parseFloat(longitude) + 0.01,
        isOpen24Hours: true
      },
      {
        id: 2,
        name: 'North Division Police Station',
        address: 'North Avenue, Business District',
        phone: '+880-XXX-YYYY',
        distance: 4.2,
        latitude: parseFloat(latitude) + 0.02,
        longitude: parseFloat(longitude) - 0.01,
        isOpen24Hours: true
      }
    ];
    
    res.json({
      success: true,
      policeStations: mockPoliceStations,
      location: { latitude, longitude },
      searchRadius: radius
    });
    
  } catch (error) {
    console.error('❌ Police stations error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch police stations',
      error: error.message 
    });
  }
});

// GET /api/emergency/user-status - Get user's emergency status
router.get('/user-status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // TODO: Check for active emergencies
    // const activeEmergency = await Emergency.findOne({ userId: user._id, status: 'active' });
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        emergencyMessage: user.emergencyMessage,
        trustedContacts: user.trustedContacts,
        hasActiveEmergency: false // TODO: Check actual emergency status
      }
    });
    
  } catch (error) {
    console.error('❌ User status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get user status',
      error: error.message 
    });
  }
});

module.exports = router;
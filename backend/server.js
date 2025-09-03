const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// Add these debug lines before your routes
console.log('=== DEBUGGING ROUTE IMPORTS ===');
const authRoutes = require('./routes/authRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const liveLocationRoutes = require('./routes/LiveLocationRoutes');
const redZoneRoutes = require('./routes/redZoneRoutes');





console.log('authRoutes type:', typeof authRoutes);
console.log('authRoutes value:', authRoutes);
console.log('emergencyRoutes type:', typeof emergencyRoutes);  
console.log('emergencyRoutes value:', emergencyRoutes);
console.log('=== END DEBUG ===');

// Then use the variables
app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/live', liveLocationRoutes);
app.use('/api/redzones', redZoneRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Safety App Backend is running!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    requestedPath: req.originalUrl,
    availableRoutes: [
      'GET /',
      'GET /api/auth/test',
      'POST /api/auth/login',
      'POST /api/auth/signup',
      'GET /api/emergency/test',
      'POST /api/emergency/sos'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}`);
  console.log(`Auth API: http://localhost:${PORT}/api/auth/test`);
  console.log(`Emergency API: http://localhost:${PORT}/api/emergency/test`);
});




// backend/models/Incident.js
const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['harassment', 'unsafe_road', 'suspicious_activity', 'location', 'other'],
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  location: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  status: {
    type: String,
    enum: ['reported', 'investigating', 'resolved', 'dismissed'],
    default: 'reported',
    index: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // If you want to link to user who reported
    required: false // Make optional for anonymous reports
  },
  adminNotes: {
    type: String,
    default: '',
    maxLength: 500
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // For red zone calculation
  redZoneContribution: {
    type: Number,
    default: 1, // Each incident contributes 1 point by default
    min: 0,
    max: 10
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for location-based queries (for finding incidents near coordinates)
incidentSchema.index({ "location.latitude": 1, "location.longitude": 1 });

// Index for time-based queries
incidentSchema.index({ createdAt: -1 });

// Virtual for getting incident age
incidentSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Static method to find incidents within a radius (for red zone calculation)
incidentSchema.statics.findNearby = function(latitude, longitude, radiusKm = 1) {
  // Simple distance calculation (for more accuracy, use MongoDB's geospatial queries)
  const kmToLatitude = 1 / 111.32; // 1 km in latitude degrees
  const kmToLongitude = 1 / (111.32 * Math.cos(latitude * Math.PI / 180)); // 1 km in longitude degrees
  
  const latDelta = radiusKm * kmToLatitude;
  const lonDelta = radiusKm * kmToLongitude;
  
  return this.find({
    'location.latitude': {
      $gte: latitude - latDelta,
      $lte: latitude + latDelta
    },
    'location.longitude': {
      $gte: longitude - lonDelta,
      $lte: longitude + lonDelta
    },
    status: { $ne: 'dismissed' } // Don't count dismissed incidents
  });
};

// Method to calculate red zone score for an area
incidentSchema.statics.calculateRedZoneScore = async function(latitude, longitude, radiusKm = 0.5) {
  const incidents = await this.findNearby(latitude, longitude, radiusKm);
  
  let score = 0;
  const now = Date.now();
  
  incidents.forEach(incident => {
    const daysSinceReport = (now - incident.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Weight recent incidents more heavily
    let timeWeight = 1;
    if (daysSinceReport <= 7) timeWeight = 3;
    else if (daysSinceReport <= 30) timeWeight = 2;
    else if (daysSinceReport <= 90) timeWeight = 1;
    else timeWeight = 0.5;
    
    // Weight by incident type
    let typeWeight = 1;
    switch (incident.type) {
      case 'harassment': typeWeight = 3; break;
      case 'suspicious_activity': typeWeight = 2.5; break;
      case 'unsafe_road': typeWeight = 2; break;
      case 'location': typeWeight = 1.5; break;
      case 'other': typeWeight = 1; break;
    }
    
    score += incident.redZoneContribution * timeWeight * typeWeight;
  });
  
  return {
    score,
    incidentCount: incidents.length,
    incidents: incidents
  };
};

module.exports = mongoose.model('Incident', incidentSchema);

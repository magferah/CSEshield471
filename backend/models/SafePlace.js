const mongoose = require('mongoose');

const safePlaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['hospital', 'police_station', 'shopping_mall', 'restaurant', 'hotel', 'bank', 'pharmacy', 'gas_station'],
      required: true 
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    address: { type: String },
    phone: { type: String },
    googleRating: { type: Number, min: 0, max: 5 },
    googleReviews: { type: Number, default: 0 },
    safetyScore: { type: Number, min: 0, max: 100, default: 50 },
    isOpen: { type: Boolean, default: true },
    description: { type: String },
    emergencyServices: { type: Boolean, default: false },
    securityFeatures: [{ type: String }], // CCTV, Security Guards, etc.
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

safePlaceSchema.index({ location: '2dsphere' });
safePlaceSchema.index({ type: 1 });
safePlaceSchema.index({ safetyScore: -1 });

module.exports = mongoose.model('SafePlace', safePlaceSchema);

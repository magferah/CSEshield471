const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderName: String,
  senderPhone: String,

  recipientId: { // ✅ NEW FIELD
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  recipientPhone: String,
  recipientName: String,

  message: String,
  locationLink: String,
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SOSAlert', sosAlertSchema);

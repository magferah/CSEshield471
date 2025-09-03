const express = require('express');
const router = express.Router();
const { sendSOS } = require('../controllers/sosController');
const SOSAlert = require('../models/SOSAlert');

// Send SOS alert
router.post('/alert', sendSOS);

// Get received SOS alerts for a specific userId (recipient)
router.get('/received/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const alerts = await SOSAlert.find({ recipientId: userId }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ msg: 'Server error fetching alerts' });
  }
});

module.exports = router;

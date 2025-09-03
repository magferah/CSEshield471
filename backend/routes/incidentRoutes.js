// backend/routes/incidents.js or similar
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// Incident model
const Incident = mongoose.model('Incident', new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now }
}));




router.get('/all', async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});




// POST /api/incident/report
router.post('/report', async (req, res) => {
  const { type, description, location } = req.body;


  if (!type || !description || !location || !location.latitude || !location.longitude) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }


  try {
    const newIncident = new Incident({
      type,
      description,
      location
    });


    await newIncident.save();
    return res.status(201).json({ msg: 'Incident reported successfully' });
  } catch (err) {
    console.error('Error saving incident:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;





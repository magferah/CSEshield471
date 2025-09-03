const express = require('express');
const router = express.Router();
const { getRedZones } = require('../controllers/manageRedZoneController');

router.get('/zones', getRedZones);

module.exports = router;

const express = require('express');
const router = express.Router();
const safePlaceController = require('../controllers/safePlaceController');
const { requireAuth } = require('../middleware/auth');

// Get nearby safe places (main endpoint)
router.get('/nearby', safePlaceController.getNearbySafePlaces);

// Get real nearby places using external APIs
router.get('/real-nearby', safePlaceController.getRealNearbyPlaces);

// Create safe places from current location (public route)
router.post('/create-from-location', safePlaceController.createSafePlacesFromLocation);

// CRUD routes (protected)
router.get('/', requireAuth, safePlaceController.getAllSafePlaces);
router.get('/:id', requireAuth, safePlaceController.getSafePlaceById);
router.post('/', requireAuth, safePlaceController.createSafePlace);
router.put('/:id', requireAuth, safePlaceController.updateSafePlace);
router.delete('/:id', requireAuth, safePlaceController.deleteSafePlace);

module.exports = router;

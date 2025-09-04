// backend/controllers/manageRedZoneController.js

const Incident = require('../models/Incident'); // ✅ Correct model import

// Radius in meters to group incidents
const DANGER_RADIUS_METERS = 200;

// Helper to calculate distance between two lat/lng points (Haversine Formula)
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const toRad = (val) => (val * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function getRedZones(req, res) {
  try {
    const incidents = await Incident.find();

    const redZones = [];

    for (let i = 0; i < incidents.length; i++) {
      const current = incidents[i];
      const { latitude, longitude } = current.location;

      // Check if already part of an existing red zone
      const alreadyGrouped = redZones.some(zone => {
        const dist = getDistanceInMeters(
          zone.latitude,
          zone.longitude,
          latitude,
          longitude
        );
        return dist <= DANGER_RADIUS_METERS;
      });

      if (!alreadyGrouped) {
        // Count how many incidents fall into this zone
        let count = 0;
        for (let j = 0; j < incidents.length; j++) {
          const compare = incidents[j];
          const dist = getDistanceInMeters(
            latitude,
            longitude,
            compare.location.latitude,
            compare.location.longitude
          );
          if (dist <= DANGER_RADIUS_METERS) count++;
        }

        if (count >= 2) {
          redZones.push({
            latitude,
            longitude,
            count
          });
        }
      }
    }

    res.status(200).json({ redZones });
  } catch (err) {
    console.error('Failed to process red zones:', err);
    res.status(500).json({ error: 'Failed to calculate red zones' });
  }
}

module.exports = {
  getRedZones
};

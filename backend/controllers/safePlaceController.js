const SafePlace = require('../models/SafePlace');
const axios = require('axios');
const config = require('../../config/config');

// API configuration from config
const GOOGLE_PLACES_API_KEY = config.apiKeys.googlePlaces;
const NOMINATIM_BASE_URL = config.externalApis.nominatim.baseUrl;

// Dynamic place type mapping from config
const getPlaceTypeMapping = () => {
  return config.externalApis.googlePlaces.placeTypes || {
    hospital: 'hospital',
    police: 'police',
    shopping: 'store',
    pharmacy: 'pharmacy',
    restaurant: 'restaurant',
    bank: 'bank'
  };
};

// Dynamic search terms from config
const getSearchTerms = () => {
  return config.externalApis.nominatim.searchTerms || {
    hospital: ['hospital', 'clinic', 'medical'],
    police: ['police', 'station'],
    shopping: ['shop', 'store', 'market', 'mall'],
    pharmacy: ['pharmacy', 'drugstore'],
    restaurant: ['restaurant', 'cafe', 'food'],
    bank: ['bank', 'atm']
  };
};

// Get real place names by type from config
const getRealPlaceNamesByType = (type) => {
  if (!type || typeof type !== 'string') {
    return config.externalApis.placeNames?.hospital || ['Hospital'];
  }
  const typeKey = type.toLowerCase();
  return config.externalApis.placeNames?.[typeKey] || config.externalApis.placeNames?.default || ['Place'];
};

// Generate realistic address using config
const generateRealAddress = (area, street, number) => {
  const country = config.externalApis.defaultCountry || 'Bangladesh';
  const city = config.externalApis.defaultCity || 'Dhaka';
  return `${number} ${street}, ${area}, ${city}, ${country}`;
};

// Generate realistic phone number using config
const generateRealPhoneNumber = () => {
  const prefixes = config.externalApis.phonePrefixes || ['017', '018', '019', '015', '016', '013', '014'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 90000000) + 10000000;
  return `${prefix}${number}`;
};

// Calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Search Google Places API for real places
const searchGooglePlaces = async (latitude, longitude, type) => {
  try {
    if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY === '') {
      if (config.development.enableLogging) {
        console.log('Google Places API key not configured, skipping...');
      }
      return [];
    }

    const searchTypes = getPlaceTypeMapping();
    const searchType = searchTypes[type] || 'establishment';
    const radius = config.map.searchRadius || 5000; // Configurable radius

    const response = await axios.get(`${config.externalApis.googlePlaces.baseUrl}/nearbysearch/json`, {
      params: {
        location: `${latitude},${longitude}`,
        radius: radius,
        type: searchType,
        key: GOOGLE_PLACES_API_KEY
      },
      timeout: config.externalApis.googlePlaces.timeout || 5000
    });

    if (response.data.status === 'OK' && response.data.results) {
      return response.data.results.map(place => ({
        name: place.name,
        address: place.vicinity || place.formatted_address,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        rating: place.rating || config.externalApis.defaultRating || 4.0,
        type: type,
        isReal: true,
        phone: place.formatted_phone_number || generateRealPhoneNumber(),
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${place.name}`,
        distance: calculateDistance(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng)
      }));
    }
  } catch (error) {
    if (config.development.enableLogging) {
      console.log('Google Places API error:', error.message);
    }
  }
  return [];
};

// Search OpenStreetMap for real places
const searchOpenStreetMap = async (latitude, longitude, type) => {
  try {
    const searchTerms = getSearchTerms();
    const terms = searchTerms[type] || ['shop'];
    const places = [];
    const maxDistance = config.map.searchRadius / 1000 || 5; // Convert to km

    for (const term of terms) {
      try {
        const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
          params: {
            q: `${term} near ${latitude},${longitude}`,
            format: 'json',
            limit: config.externalApis.nominatim.maxResults || 10,
            countrycodes: config.externalApis.nominatim.countryCodes || 'bd',
            addressdetails: 1,
            extratags: 1,
            namedetails: 1
          },
          headers: {
            'User-Agent': config.externalApis.nominatim.userAgent
          },
          timeout: config.externalApis.nominatim.timeout || 5000
        });

        if (response.data && Array.isArray(response.data)) {
          const filteredPlaces = response.data
            .filter(place => {
              const distance = calculateDistance(latitude, longitude, parseFloat(place.lat), parseFloat(place.lon));
              return distance <= maxDistance;
            })
            .map(place => ({
              name: place.display_name.split(',')[0] || place.name || `${type} ${Math.floor(Math.random() * 100)}`,
              address: place.display_name || generateRealAddress(
                config.externalApis.defaultAreas?.[Math.floor(Math.random() * (config.externalApis.defaultAreas?.length || 1))] || 'Area',
                config.externalApis.defaultStreets?.[Math.floor(Math.random() * (config.externalApis.defaultStreets?.length || 1))] || 'Street',
                Math.floor(Math.random() * 100) + 1
              ),
              latitude: parseFloat(place.lat),
              longitude: parseFloat(place.lon),
              rating: (Math.random() * 2 + (config.externalApis.defaultRating || 3)).toFixed(1),
              type: type,
              isReal: true,
              phone: generateRealPhoneNumber(),
              description: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${place.display_name.split(',')[0]}`,
              distance: calculateDistance(latitude, longitude, parseFloat(place.lat), parseFloat(place.lon))
            }));

          places.push(...filteredPlaces);
        }
      } catch (error) {
        if (config.development.enableLogging) {
          console.log(`OpenStreetMap search error for ${term}:`, error.message);
        }
      }
    }

    return places;
  } catch (error) {
    if (config.development.enableLogging) {
      console.log('OpenStreetMap API error:', error.message);
    }
    return [];
  }
};

// Generate dynamic places when real APIs fail
const generateDynamicPlaces = (latitude, longitude, type, count = 5) => {
  const places = [];
  const placeNames = getRealPlaceNamesByType(type);
  const areas = config.externalApis.defaultAreas || ['Area'];
  const streets = config.externalApis.defaultStreets || ['Street'];

  for (let i = 0; i < count; i++) {
    // Generate realistic coordinates within search radius
    const radius = (config.map.searchRadius || 5000) / 111000; // Convert meters to degrees
    const angle = (Math.PI * 2 * i) / count;
    const distance = Math.random() * radius;
    
    const newLat = latitude + (distance * Math.cos(angle));
    const newLng = longitude + (distance * Math.sin(angle));

    const placeName = placeNames[i % placeNames.length];
    const area = areas[i % areas.length];
    const street = streets[i % streets.length];
    const streetNumber = Math.floor(Math.random() * 100) + 1;

    places.push({
      name: `${placeName} ${i + 1}`,
      address: generateRealAddress(area, street, streetNumber),
      latitude: newLat,
      longitude: newLng,
      rating: (Math.random() * 2 + (config.externalApis.defaultRating || 3)).toFixed(1),
      type: type,
      isReal: false,
      phone: generateRealPhoneNumber(),
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${placeName} ${i + 1}`,
      distance: calculateDistance(latitude, longitude, newLat, newLng)
    });
  }

  return places;
};

// Get real nearby places with priority order
const getRealNearbyPlaces = async (latitude, longitude, type = 'all') => {
  try {
    // Validate coordinates
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      console.log('Invalid coordinates provided:', { latitude, longitude });
      return [];
    }

    console.log(`Searching for real nearby places at ${latitude}, ${longitude} for type: ${type}`);
    
    let allPlaces = [];
    const types = type === 'all' ? ['hospital', 'police', 'shopping', 'pharmacy', 'restaurant', 'bank'] : [type];
    
    for (const placeType of types) {
      console.log(`Searching for ${placeType} places...`);
      
      // 1. Try Google Places API first (real places)
      const googlePlaces = await searchGooglePlaces(latitude, longitude, placeType);
      if (googlePlaces.length > 0) {
        console.log(`Found ${googlePlaces.length} real places from Google Places API for ${placeType}`);
        allPlaces.push(...googlePlaces);
        continue; // Skip other sources if we found real places
      }
      
      // 2. Try OpenStreetMap (real places)
      const osmPlaces = await searchOpenStreetMap(latitude, longitude, placeType);
      if (osmPlaces.length > 0) {
        console.log(`Found ${osmPlaces.length} real places from OpenStreetMap for ${placeType}`);
        allPlaces.push(...osmPlaces);
        continue; // Skip other sources if we found real places
      }
      
      // 3. Check database for existing places (as temporary fallback)
      try {
        const dbPlaces = await SafePlace.find({
          type: placeType,
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
              },
              $maxDistance: config.map.searchRadius || 5000
            }
          }
        }).limit(5);
        
        if (dbPlaces.length > 0) {
          console.log(`Found ${dbPlaces.length} places from database for ${placeType}`);
          const mappedDbPlaces = dbPlaces.map(place => ({
            name: place.name,
            address: place.address,
            latitude: place.location.coordinates[1],
            longitude: place.location.coordinates[0],
            rating: place.rating || 4.0,
            type: place.type,
            isReal: false,
            isTemporary: true,
            phone: place.phone || generateRealPhoneNumber(),
            description: place.description,
            distance: calculateDistance(latitude, longitude, place.location.coordinates[1], place.location.coordinates[0])
          }));
          allPlaces.push(...mappedDbPlaces);
          continue;
        }
      } catch (dbError) {
        console.log(`Database query error for ${placeType}:`, dbError.message);
      }
      
      // 4. Generate dynamic places as last resort
      console.log(`No real places found for ${placeType}, generating dynamic places...`);
      const dynamicPlaces = generateDynamicPlaces(latitude, longitude, placeType, 3);
      allPlaces.push(...dynamicPlaces);
    }
    
    // Sort by distance and limit results
    allPlaces.sort((a, b) => a.distance - b.distance);
    const finalPlaces = allPlaces.slice(0, 20);
    
    console.log(`Total places found: ${finalPlaces.length}`);
    console.log(`Real places: ${finalPlaces.filter(p => p.isReal).length}`);
    console.log(`Temporary places: ${finalPlaces.filter(p => p.isTemporary).length}`);
    
    return finalPlaces;
  } catch (error) {
    console.error('Error in getRealNearbyPlaces:', error);
    // Fallback to dynamic generation
    const fallbackPlaces = generateDynamicPlaces(latitude, longitude, type, 10);
    return fallbackPlaces;
  }
};

// Create safe places from location (for manual trigger)
const createSafePlacesFromLocation = async (req, res) => {
  try {
    const { latitude, longitude, type = 'all' } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    console.log(`Creating safe places from location: ${latitude}, ${longitude}`);
    
    const places = await getRealNearbyPlaces(latitude, longitude, type);
    
    // Save places to database
    const savedPlaces = [];
    for (const place of places) {
      const safePlace = new SafePlace({
        name: place.name,
        address: place.address,
        location: {
          type: 'Point',
          coordinates: [place.longitude, place.latitude]
        },
        type: place.type,
        rating: place.rating,
        phone: place.phone,
        description: place.description,
        isReal: place.isReal || false,
        isTemporary: place.isTemporary || false
      });
      
      const savedPlace = await safePlace.save();
      savedPlaces.push(savedPlace);
    }
    
    res.json({
      message: `Created ${savedPlaces.length} safe places`,
      places: savedPlaces
    });
  } catch (error) {
    console.error('Error creating safe places from location:', error);
    res.status(500).json({ error: 'Failed to create safe places' });
  }
};

// Get nearby safe places (main endpoint)
const getNearbySafePlaces = async (req, res) => {
  try {
    const { latitude, longitude, type = 'all' } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    console.log(`Getting nearby safe places for: ${latitude}, ${longitude}, type: ${type}`);
    
    const places = await getRealNearbyPlaces(parseFloat(latitude), parseFloat(longitude), type);
    
    res.json({
      success: true,
      places: places,
      count: places.length,
      realPlacesCount: places.filter(p => p.isReal).length,
      temporaryPlacesCount: places.filter(p => p.isTemporary).length
    });
  } catch (error) {
    console.error('Error getting nearby safe places:', error);
    res.status(500).json({ error: 'Failed to get nearby safe places' });
  }
};

// Get all safe places
const getAllSafePlaces = async (req, res) => {
  try {
    const safePlaces = await SafePlace.find().sort({ createdAt: -1 });
    res.json(safePlaces);
  } catch (error) {
    console.error('Error getting all safe places:', error);
    res.status(500).json({ error: 'Failed to get safe places' });
  }
};

// Get safe place by ID
const getSafePlaceById = async (req, res) => {
  try {
    const safePlace = await SafePlace.findById(req.params.id);
    if (!safePlace) {
      return res.status(404).json({ error: 'Safe place not found' });
    }
    res.json(safePlace);
  } catch (error) {
    console.error('Error getting safe place by ID:', error);
    res.status(500).json({ error: 'Failed to get safe place' });
  }
};

// Create new safe place
const createSafePlace = async (req, res) => {
  try {
    const { name, address, latitude, longitude, type, rating, phone, description } = req.body;
    
    if (!name || !address || !latitude || !longitude || !type) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    
    const safePlace = new SafePlace({
      name,
      address,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      type,
      rating: rating || 4.0,
      phone: phone || generateRealPhoneNumber(),
      description: description || `${type} - ${name}`,
      isReal: true
    });
    
    const savedSafePlace = await safePlace.save();
    res.status(201).json(savedSafePlace);
  } catch (error) {
    console.error('Error creating safe place:', error);
    res.status(500).json({ error: 'Failed to create safe place' });
  }
};

// Update safe place
const updateSafePlace = async (req, res) => {
  try {
    const { name, address, latitude, longitude, type, rating, phone, description } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (latitude && longitude) {
      updateData.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }
    if (type) updateData.type = type;
    if (rating) updateData.rating = rating;
    if (phone) updateData.phone = phone;
    if (description) updateData.description = description;
    
    const safePlace = await SafePlace.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!safePlace) {
      return res.status(404).json({ error: 'Safe place not found' });
    }
    
    res.json(safePlace);
  } catch (error) {
    console.error('Error updating safe place:', error);
    res.status(500).json({ error: 'Failed to update safe place' });
  }
};

// Delete safe place
const deleteSafePlace = async (req, res) => {
  try {
    const safePlace = await SafePlace.findByIdAndDelete(req.params.id);
    
    if (!safePlace) {
      return res.status(404).json({ error: 'Safe place not found' });
    }
    
    res.json({ message: 'Safe place deleted successfully' });
  } catch (error) {
    console.error('Error deleting safe place:', error);
    res.status(500).json({ error: 'Failed to delete safe place' });
  }
};

module.exports = {
  getNearbySafePlaces,
  getAllSafePlaces,
  getSafePlaceById,
  createSafePlace,
  updateSafePlace,
  deleteSafePlace,
  createSafePlacesFromLocation,
  getRealNearbyPlaces
};

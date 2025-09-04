import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  Linking,
  FlatList,
  Modal,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import MapView, { Marker, Polyline, Polygon, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../../theme/ThemeProvider';
import { safePlacesAPI } from '../../api/safePlaces';
import { api } from '../../api/client';
import { Ionicons } from '@expo/vector-icons';
import config from '../../config/config';

export default function EnhancedMapScreen() {
  const { colors } = useTheme();
  const mapRef = useRef(null);
  
  // State variables
  const [location, setLocation] = useState({ 
    latitude: config.map.defaultRegion.latitude, 
    longitude: config.map.defaultRegion.longitude 
  });
  const [police, setPolice] = useState([]);
  const [redZones, setRedZones] = useState([]);
  const [safePlaces, setSafePlaces] = useState([]);
  const [currentLocationSafety, setCurrentLocationSafety] = useState('safe');
  const [route, setRoute] = useState(null);
  const [routeSafety, setRouteSafety] = useState('safe');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeDetailsModal, setPlaceDetailsModal] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Place type options
  const placeTypes = [
    { key: 'hospital', label: '🏥 Hospitals', icon: 'medical' },
    { key: 'police_station', label: '👮 Police Stations', icon: 'shield' },
    { key: 'shopping_mall', label: '🛍️ Shopping Malls', icon: 'bag' },
    { key: 'restaurant', label: '🍽️ Restaurants', icon: 'restaurant' },
    { key: 'hotel', label: '🏨 Hotels', icon: 'bed' },
    { key: 'bank', label: '🏦 Banks', icon: 'card' },
    { key: 'pharmacy', label: '💊 Pharmacies', icon: 'medical' },
    { key: 'gas_station', label: '⛽ Gas Stations', icon: 'car' }
  ];

  useEffect(() => {
    initializeLocationTracking();
    loadInitialData();
    
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const initializeLocationTracking = async () => {
    try {
      console.log('Requesting location permissions...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for safety features.');
        console.log('Location permission denied');
        return;
      }

      console.log('Getting current location...');
      // Get initial location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      console.log('Current location:', currentLocation.coords);
      setLocation(currentLocation.coords);

      // Start location tracking
      console.log('Starting location tracking...');
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 50 // Update every 50 meters
        },
        (newLocation) => {
          console.log('Location updated:', newLocation.coords);
          setLocation(newLocation.coords);
          checkLocationSafety(newLocation.coords);
          loadNearbySafePlaces(newLocation.coords);
        }
      );

      setLocationSubscription(subscription);
      console.log('Location tracking initialized successfully');
    } catch (error) {
      console.error('Error initializing location tracking:', error);
      Alert.alert('Location Error', 'Could not get your location. Using default location.');
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPoliceStations(),
        loadRedZones(),
        loadNearbySafePlaces(location)
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

     const loadNearbySafePlaces = async (coords = location) => {
     try {
       console.log('Loading nearby places for coordinates:', coords);
       
       // Get nearby places from the main API endpoint
       const response = await safePlacesAPI.getNearbySafePlaces(
         coords.latitude,
         coords.longitude,
         searchRadius,
         selectedTypes
       );
       
       console.log('Nearby places response:', response);
       // Handle backend response format: { success: true, data: places }
       if (response.success && response.data && response.data.length > 0) {
         // Transform places to ensure consistent structure
         const transformedPlaces = response.data.map(place => ({
           ...place,
           _id: place._id || place.name, // Ensure _id exists
           safetyLevel: place.safetyLevel || 'safe',
           safetyScore: place.safetyScore || 85,
           googleRating: place.googleRating || 4.0,
           googleReviews: place.googleReviews || Math.floor(Math.random() * 100) + 10,
           latitude: place.location?.coordinates?.[1] || 0,
           longitude: place.location?.coordinates?.[0] || 0
         }));
         setSafePlaces(transformedPlaces);
         console.log(`Loaded ${transformedPlaces.length} nearby places`);
       } else {
         console.log('No places found, setting empty array');
         setSafePlaces([]);
       }
     } catch (error) {
       console.error('Error loading nearby safe places:', error);
       setSafePlaces([]);
     }
   };

  // Filter places based on selected types
  const getFilteredPlaces = () => {
    if (selectedTypes.length === 0) {
      return safePlaces; // Show all places if no filters selected
    }
    return safePlaces.filter(place => selectedTypes.includes(place.type));
  };

  const loadPoliceStations = async () => {
    try {
      const response = await api.get(`/location/police?latitude=${location.latitude}&longitude=${location.longitude}`);
      setPolice(response.data);
    } catch (error) {
      console.error('Error loading police stations:', error);
      setPolice([]);
    }
  };

  const loadRedZones = async () => {
    try {
      const response = await api.get(`/admin/red-zones`);
      setRedZones(response.data);
    } catch (error) {
      console.error('Error loading red zones:', error);
      setRedZones([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const checkLocationSafety = (coords = location) => {
    const userInRedZone = redZones.find(zone => {
      return isPointInPolygon(coords, zone.area.coordinates[0]);
    });

    if (userInRedZone) {
      setCurrentLocationSafety(userInRedZone.severity);
      Alert.alert(
        '⚠️ SAFETY WARNING',
        `You are in a ${userInRedZone.severity.toUpperCase()} risk area: ${userInRedZone.name}\n\nPlease exercise extreme caution and consider leaving the area immediately.`,
        [
          { text: 'Find Safe Places', onPress: () => showSafePlacesNearby() },
          { text: 'Call Police', onPress: () => callEmergency() },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } else {
      setCurrentLocationSafety('safe');
    }
  };

  const isPointInPolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (((polygon[i][1] > point.latitude) !== (polygon[j][1] > point.latitude)) &&
          (point.longitude < (polygon[j][0] - polygon[i][0]) * (point.latitude - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0])) {
        inside = !inside;
      }
    }
    return inside;
  };

  const createSafePlacesForLocation = async () => {
    try {
      console.log('Creating safe places for current location:', location);
      const response = await safePlacesAPI.createSafePlacesFromLocation(
        location.latitude,
        location.longitude,
        searchRadius
      );
      
      if (response.success) {
        setSafePlaces(response.places);
        Alert.alert(
          '✅ Safe Places Created',
          `Successfully created ${response.places.length} safe places around your location!\n\nThese places are now saved in the database and will be available for future searches.`,
          [
            { text: 'Show on Map', onPress: () => centerMapOnSafePlaces() },
            { text: 'OK', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to create safe places. Please try again.');
      }
    } catch (error) {
      console.error('Error creating safe places:', error);
      Alert.alert('Error', 'Failed to create safe places. Please check your connection.');
    }
  };



  const showSafePlacesNearby = () => {
    Alert.alert(
      'Safe Places Nearby',
      `Found ${safePlaces.length} safe places in your area.\n\nTap on green markers on the map to see details and ratings.`,
      [
        { text: 'Create New Safe Places', onPress: () => createSafePlacesForLocation() },
        { text: 'Show on Map', onPress: () => centerMapOnSafePlaces() },
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

     const centerMapOnSafePlaces = () => {
     if (safePlaces.length > 0 && mapRef.current) {
       const coordinates = safePlaces.map(place => ({
         latitude: place.latitude || (place.location && place.location.coordinates ? place.location.coordinates[1] : 0),
         longitude: place.longitude || (place.location && place.location.coordinates ? place.location.coordinates[0] : 0)
       }));
       
       mapRef.current.fitToCoordinates(coordinates, {
         edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
         animated: true
       });
     }
   };

  const handlePlacePress = async (place) => {
    setSelectedPlace(place);
    
    // Try to get additional details from Google Places API
    if (place.placeId) {
      try {
        const details = await safePlacesAPI.getPlaceDetails(place.placeId);
        setSelectedPlace({ ...place, ...details.place });
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    }
    
    setPlaceDetailsModal(true);
  };

  const getSafetyColor = (safety) => {
    switch (safety) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#ffdd00';
      case 'very_safe': return '#44ff44';
      case 'safe': return '#44ff44';
      case 'moderate': return '#ffdd00';
      case 'caution': return '#ffaa00';
      default: return '#44ff44';
    }
  };

  const getSafetyText = (safety) => {
    switch (safety) {
      case 'high': return 'HIGH RISK';
      case 'medium': return 'MEDIUM RISK';
      case 'low': return 'LOW RISK';
      case 'very_safe': return 'VERY SAFE';
      case 'safe': return 'SAFE';
      case 'moderate': return 'MODERATE';
      case 'caution': return 'CAUTION';
      default: return 'SAFE';
    }
  };

  const getPlaceIcon = (type) => {
    const iconMap = {
      'hospital': '🏥',
      'police_station': '👮',
      'shopping_mall': '🛍️',
      'restaurant': '🍽️',
      'hotel': '🏨',
      'bank': '🏦',
      'pharmacy': '💊',
      'gas_station': '⛽'
    };
    return iconMap[type] || '📍';
  };

  const callEmergency = () => {
    Alert.alert(
      'Emergency Call',
      'Calling nearest police station...',
      [
        { text: 'Call Police', onPress: () => Linking.openURL('tel:+880-2-9555555') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const ceilingRating = Math.ceil(rating); // Round up to nearest whole number
    
    for (let i = 0; i < ceilingRating; i++) {
      stars.push('⭐');
    }
    return stars.join('');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading live location and safety data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
      >
        {/* Current Location */}
        <Marker
          coordinate={location}
          title="Your Location"
          description="You are here"
          pinColor="blue"
        />

                 {/* Safe Places */}
         {getFilteredPlaces().map((place) => (
           <Marker
             key={place._id || place.name}
             coordinate={{
               latitude: place.latitude || (place.location && place.location.coordinates ? place.location.coordinates[1] : 0),
               longitude: place.longitude || (place.location && place.location.coordinates ? place.location.coordinates[0] : 0)
             }}
             title={place.name}
             description={`${getPlaceIcon(place.type)} ${place.type.replace('_', ' ')}`}
             pinColor={getSafetyColor(place.safetyLevel)}
             onPress={() => handlePlacePress(place)}
           >
             <View style={[styles.customMarker, { backgroundColor: getSafetyColor(place.safetyLevel) }]}>
               <Text style={styles.markerText}>{getPlaceIcon(place.type)}</Text>
             </View>
           </Marker>
         ))}

                 {/* Police Stations */}
         {police.map((station) => (
           <Marker
             key={station._id || station.name}
             coordinate={{
               latitude: station.latitude || (station.location && station.location.coordinates ? station.location.coordinates[1] : 0),
               longitude: station.longitude || (station.location && station.location.coordinates ? station.location.coordinates[0] : 0)
             }}
             title={station.name}
             description={`Hotline: ${station.hotline}`}
             pinColor="green"
           />
         ))}

                 {/* Red Zones */}
         {redZones.map((zone) => (
           <Polygon
             key={zone._id || zone.name}
             coordinates={(zone.area && zone.area.coordinates && zone.area.coordinates[0] ? zone.area.coordinates[0] : []).map(coord => ({
               latitude: coord[1] || 0,
               longitude: coord[0] || 0
             }))}
             fillColor={`${getSafetyColor(zone.severity)}40`}
             strokeColor={getSafetyColor(zone.severity)}
             strokeWidth={2}
             tappable={true}
             onPress={() => Alert.alert(
               'Red Zone Alert',
               `${zone.name}\nSeverity: ${zone.severity.toUpperCase()}\n\nThis area has been marked as dangerous.`
             )}
           />
         ))}

        {/* Search Radius Circle */}
        <Circle
          center={location}
          radius={searchRadius}
          strokeColor="rgba(0, 122, 255, 0.3)"
          strokeWidth={2}
          fillColor="rgba(0, 122, 255, 0.1)"
        />
      </MapView>

      {/* Safety Indicator */}
      <View style={[styles.safetyIndicator, { backgroundColor: getSafetyColor(currentLocationSafety) }]}>
        <Text style={styles.safetyText}>{getSafetyText(currentLocationSafety)}</Text>
      </View>

      {/* Type Filter Panel */}
      <View style={styles.filterPanel}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filter Places:</Text>
          {selectedTypes.length > 0 && (
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={async () => {
                setSelectedTypes([]);
                await loadNearbySafePlaces(location);
              }}
            >
              <Text style={styles.clearFilterButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {placeTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.filterButton,
                selectedTypes.includes(type.key) && styles.filterButtonActive
              ]}
              onPress={async () => {
                let newSelectedTypes;
                if (selectedTypes.includes(type.key)) {
                  newSelectedTypes = selectedTypes.filter(t => t !== type.key);
                } else {
                  newSelectedTypes = [...selectedTypes, type.key];
                }
                setSelectedTypes(newSelectedTypes);
                
                // Reload places with new filter
                await loadNearbySafePlaces(location);
              }}
            >
              <Text style={[
                styles.filterButtonText,
                selectedTypes.includes(type.key) && styles.filterButtonTextActive
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Create New Safe Places Button */}
      <TouchableOpacity 
        style={styles.createSafePlacesButton} 
        onPress={createSafePlacesForLocation}
      >
        <Text style={styles.createSafePlacesButtonText}>➕ Create New Safe Places</Text>
      </TouchableOpacity>

      

      {/* Safe Places List */}
      <View style={styles.placesPanel}>
        <Text style={styles.placesTitle}>Safe Places Nearby ({getFilteredPlaces().length})</Text>
                 <FlatList
           data={getFilteredPlaces().slice(0, 5)}
           keyExtractor={(item) => item._id || item.name || Math.random().toString()}
           renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.placeItem}
              onPress={() => handlePlacePress(item)}
            >
                             <View style={styles.placeInfo}>
                 <Text style={styles.placeName}>{item.name}</Text>
                 <Text style={styles.placeType}>{getPlaceIcon(item.type)} {item.type.replace('_', ' ')}</Text>
                 <Text style={styles.placeRating}>
                   {renderStars(item.googleRating)} ({item.googleReviews} reviews)
                 </Text>
                 {item.isTemporary && (
                   <Text style={styles.temporaryIndicator}>⚠️ Temporary Place</Text>
                 )}
                 {item.isReal && (
                   <Text style={styles.realIndicator}>✅ Real Place</Text>
                 )}
               </View>
              <View style={[styles.safetyBadge, { backgroundColor: getSafetyColor(item.safetyLevel) }]}>
                <Text style={styles.safetyBadgeText}>{item.safetyScore}%</Text>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      {/* Emergency Button */}
      <TouchableOpacity style={styles.emergencyButton} onPress={callEmergency}>
        <Text style={styles.emergencyButtonText}>🚨 EMERGENCY</Text>
      </TouchableOpacity>

      {/* Place Details Modal */}
      <Modal
        visible={placeDetailsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPlaceDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPlace && (
              <ScrollView>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedPlace.name}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setPlaceDetailsModal(false)}
                  >
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.placeTypeRow}>
                    <Text style={styles.placeTypeText}>
                      {getPlaceIcon(selectedPlace.type)} {selectedPlace.type.replace('_', ' ')}
                    </Text>
                    <View style={[styles.safetyBadge, { backgroundColor: getSafetyColor(selectedPlace.safetyLevel) }]}>
                      <Text style={styles.safetyBadgeText}>{selectedPlace.safetyScore}% Safe</Text>
                    </View>
                  </View>

                                     {selectedPlace.googleRating && (
                     <View style={styles.ratingRow}>
                       <Text style={styles.ratingText}>
                         {renderStars(selectedPlace.googleRating)} {Math.ceil(selectedPlace.googleRating)}/5
                       </Text>
                       <Text style={styles.reviewsText}>
                         ({selectedPlace.googleReviews} reviews)
                       </Text>
                     </View>
                   )}

                  {selectedPlace.address && (
                    <Text style={styles.addressText}>📍 {selectedPlace.address}</Text>
                  )}

                  {selectedPlace.phone && (
                    <TouchableOpacity
                      style={styles.phoneButton}
                      onPress={() => Linking.openURL(`tel:${selectedPlace.phone}`)}
                    >
                      <Text style={styles.phoneButtonText}>📞 Call {selectedPlace.phone}</Text>
                    </TouchableOpacity>
                  )}

                  {selectedPlace.description && (
                    <Text style={styles.descriptionText}>{selectedPlace.description}</Text>
                  )}

                  {selectedPlace.securityFeatures && selectedPlace.securityFeatures.length > 0 && (
                    <View style={styles.securityFeatures}>
                      <Text style={styles.securityTitle}>Security Features:</Text>
                      {selectedPlace.securityFeatures.map((feature, index) => (
                        <Text key={index} style={styles.securityFeature}>• {feature}</Text>
                      ))}
                    </View>
                  )}

                                     <TouchableOpacity
                     style={styles.directionsButton}
                     onPress={() => {
                       const lat = selectedPlace.latitude || (selectedPlace.location && selectedPlace.location.coordinates ? selectedPlace.location.coordinates[1] : 0);
                       const lng = selectedPlace.longitude || (selectedPlace.location && selectedPlace.location.coordinates ? selectedPlace.location.coordinates[0] : 0);
                       const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                       Linking.openURL(url);
                     }}
                   >
                     <Text style={styles.directionsButtonText}>🗺️ Get Directions</Text>
                   </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  safetyIndicator: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  safetyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  filterPanel: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  clearFilterButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearFilterButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#333',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  placesPanel: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  placesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  placeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  placeType: {
    fontSize: 12,
    color: '#666',
  },
  placeRating: {
    fontSize: 12,
    color: '#007AFF',
  },
  safetyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  safetyBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emergencyButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ff4444',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerText: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  placeTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeTypeText: {
    fontSize: 16,
    color: '#666',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  phoneButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  phoneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  securityFeatures: {
    marginBottom: 15,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  securityFeature: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  directionsButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createSafePlacesButton: {
    position: 'absolute',
    top: 200,
    right: 20,
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
     createSafePlacesButtonText: {
     color: '#fff',
     fontSize: 14,
     fontWeight: 'bold',
   },
   temporaryIndicator: {
     fontSize: 10,
     color: '#ff6b35',
     fontWeight: 'bold',
     marginTop: 2,
   },
   realIndicator: {
     fontSize: 10,
     color: '#34C759',
     fontWeight: 'bold',
     marginTop: 2,
   },

});

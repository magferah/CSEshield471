// frontend/views/screens/Location/LiveLocationScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
  StatusBar,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import apiClient from '../../../services/apiClient';
import redZoneTriangle from '../../../assets/images/red-zone.png'; // You’ll need to add this image


const LiveLocationScreen = ({ navigation, route }) => {
  const mapRef = useRef(null);
  const locationWatcherRef = useRef(null);
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redZones, setRedZones] = useState([]);
  const [showRedZones, setShowRedZones] = useState(false);
  const [trustedContactsLocations, setTrustedContactsLocations] = useState([]);
  const [region, setRegion] = useState(null);  // no default Dhaka

  // Get user data from route params
  const user = route?.params?.user;
  const userId = user?._id || user?.id;

  useEffect(() => {
    requestLocationPermission();
    loadTrustedContactsLocations();
    
    return () => {
      if (locationWatcherRef.current) {
        locationWatcherRef.current.remove();
      }
    };
  }, []);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is required for this feature');
        return;
      }
      getCurrentLocation();
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
   setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    setRegion(newLocation);

    // Center map immediately
    if (mapRef.current) {
      mapRef.current.animateToRegion(newLocation, 1000);
    }
  } catch (error) {
    console.error('Location error:', error);
  } finally {
    setLoading(false);
  }
};
const fetchRedZones = async () => {
  try {
    const response = await apiClient.get('/redzones/zones');
    setRedZones(response.data.redZones || []);
  } catch (error) {
    console.error('Failed to load red zones:', error);
    Alert.alert('Error', 'Unable to fetch red zones');
  }
};
const toggleRedZones = async () => {
  if (!showRedZones) {
    await fetchRedZones(); // only fetch if turning on
  }
  setShowRedZones(!showRedZones);
};

  const startLocationSharing = async () => {
  try {
    if (!currentLocation) {
      Alert.alert('Error', 'Please get your location first');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User information not found');
      return;
    }

    // Request foreground (not background) location for live tracking
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Location permission is needed for live sharing'
      );
      return;
    }

    setIsSharing(true);

    // ✅ Start watching user position
    locationWatcherRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,    // every 5 seconds
        distanceInterval: 10,  // or every 10 meters
      },
      async (location) => {
        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setCurrentLocation(newLocation);

        try {
          // ✅ Update backend safely
          await updateLocationInBackend(newLocation, true);
        } catch (err) {
          console.warn('Failed to update backend location:', err.message);
        }
      }
    );

      /// Show success message
      Alert.alert('Location Shared',
      'Your live location has been shared with your selected contacts.',
      [{ text: 'OK', style: 'default' }]
);

    } catch (error) {
    console.error('Start sharing error:', error);
    Alert.alert('Error', 'Failed to start location sharing');
  }
  };

const stopLocationSharing = async () => {
  Alert.alert(
    '⏹️ Stop Location Sharing',
    'Are you sure you want to stop sharing your location?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Stop & Go Home',
        style: 'destructive',
        onPress: async () => {
          try {
            // ✅ Stop watcher safely
            if (locationWatcherRef.current) {
              try {
                locationWatcherRef.current.remove();
              } catch (err) {
                console.warn("Watcher already removed:", err);
              }
              locationWatcherRef.current = null;
            }

            // ✅ Update backend
            if (userId) {
              await apiClient.post('/live/stop', { userId, sharing: false });
            }

            // ✅ Update state
            setIsSharing(false);
            setCurrentLocation(null);

            // ✅ Navigate back to Panic
            navigation.navigate('Panic', { user });

          } catch (error) {
            Alert.alert('Error', 'Failed to stop location sharing');
            console.error('Stop sharing error:', error);
          }
        }
      }
    ]
  );
};

  const updateLocationInBackend = async (location, sharing = false) => {
    try {
      if (!userId) return;
      
      await apiClient.post('/live/update', {
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
        isSharing: sharing
      });
    } catch (error) {
      console.error('Backend update error:', error);
    }
  };

  const loadTrustedContactsLocations = async () => {
    try {
      // Load locations of trusted contacts who are sharing
      const response = await apiClient.get('/live/shared');
      setTrustedContactsLocations(response.data.sharedLocations || []);
    } catch (error) {
      console.error('Error loading trusted contacts locations:', error);
      // Don't show alert for this error as it's not critical
    }
  };

  const shareCurrentLocation = async () => {
    if (!currentLocation) {
      Alert.alert('No Location', 'Please get your location first');
      return;
    }

    const { latitude, longitude } = currentLocation;
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const message = `🚨 EMERGENCY LOCATION SHARE 🚨\n\nMy current location:\nGoogle Maps: ${googleMapsUrl}\n\nCoordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nTime: ${new Date().toLocaleString()}`;

    try {
      await Share.share({
        message: message,
        title: 'Emergency Location Share'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share location');
    }
  };

  const centerMapOnUser = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

return (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
    
    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Live Location</Text>
      <View style={styles.placeholder} />
    </View>

    {/* Loading Overlay */}
    {loading && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    )}

    {/* Status Indicator */}
    {isSharing && (
      <View style={styles.statusContainer}>
        <View style={styles.statusIndicator} />
        <Text style={styles.statusText}>📍 Live location sharing active</Text>
      </View>
    )}

    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={region}
      onRegionChangeComplete={setRegion}
      showsUserLocation={true}         // Blue dot + arrow
      showsMyLocationButton={true}     // Android button
      followsUserLocation={isSharing}  // Only follow if sharing
      showsCompass={true}
      showsScale={true}
    >
      {/* 🔹 Trusted Contacts Markers */}
      {trustedContactsLocations.map((contact) => (
        <Marker
          key={contact.contactId}
          coordinate={{
            latitude: contact.location.latitude,
            longitude: contact.location.longitude,
          }}
          title={contact.name}
          description={`Sharing location • ${contact.phone}`}
          pinColor="#2196F3"
        />
      ))}

      {/* 🔺 Red Zone Markers */}
      {showRedZones && redZones.map((zone, index) => (
        <Marker
          key={`redzone-${index}`}
          coordinate={{
            latitude: zone.latitude,
            longitude: zone.longitude,
          }}
          title="Red Zone"
          description={`Reported Incidents: ${zone.count}`}
          image={redZoneTriangle}
        />
      ))}
    </MapView>

    {/* Main Action Button */}
    <View style={styles.mainControls}>
      <TouchableOpacity
        style={[
          styles.mainActionButton,
          isSharing ? styles.stopSharingButton : styles.startSharingButton
        ]}
        onPress={isSharing ? stopLocationSharing : startLocationSharing}
      >
        <FontAwesome 
          name={isSharing ? "stop" : "play"} 
          size={20} 
          color="white" 
        />
        <Text style={styles.mainActionText}>
          {isSharing ? "Stop Sharing" : "Start Live Sharing"}
        </Text>
      </TouchableOpacity>
    </View>

    {/* Bottom Controls */}
    <View style={styles.bottomControls}>
      <TouchableOpacity
        style={[styles.secondaryButton, styles.shareLocationButton]}
        onPress={shareCurrentLocation}
      >
        <FontAwesome name="share" size={16} color="white" />
        <Text style={styles.secondaryButtonText}>Share Location</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryButton, styles.refreshButton]}
        onPress={toggleRedZones}
      >
        <FontAwesome name="exclamation-triangle" size={16} color="white" />
        <Text style={styles.secondaryButtonText}>
          {showRedZones ? "Hide" : "Show"} Red Zones
        </Text>
      </TouchableOpacity>
    </View>

    {/* Center Map Button */}
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={centerMapOnUser}
    >
      <FontAwesome name="crosshairs" size={24} color="white" />
    </TouchableOpacity>

    {/* Home Button */}
    <TouchableOpacity
      style={styles.homeButton}
      onPress={() => navigation.navigate('Panic', { user })}
    >
      <FontAwesome name="home" size={20} color="white" />
      <Text style={styles.homeButtonText}>Back to Home</Text>
    </TouchableOpacity>
  </View>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 36,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  statusContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    elevation: 3,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginRight: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mainControls: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  mainActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    gap: 12,
  },
  startSharingButton: {
    backgroundColor: '#4CAF50',
  },
  stopSharingButton: {
    backgroundColor: '#FF4444',
  },
  mainActionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    zIndex: 100,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    gap: 8,
  },
  shareLocationButton: {
    backgroundColor: '#2196F3',
  },
  refreshButton: {
    backgroundColor: '#FF9800',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 200,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 100,
  },
  homeButton: {
  position: 'absolute',
  bottom: 20,
  left: 20,
  right: 20,
  backgroundColor: '#4CAF50',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 15,
  borderRadius: 25,
  elevation: 5,
  gap: 10,
  zIndex: 100,
},
homeButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},

});
export default LiveLocationScreen;
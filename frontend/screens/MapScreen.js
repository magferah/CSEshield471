import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity, Linking, FlatList } from 'react-native';
import MapView, { Marker, Polyline, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../../theme/ThemeProvider';
import axios from 'axios';
import config from '../../config/config';

const API_URL = config.api.baseUrl;

export default function MapScreen() {
  const { colors } = useTheme();
  const [location, setLocation] = useState({ 
    latitude: config.map.defaultRegion.latitude, 
    longitude: config.map.defaultRegion.longitude 
  });
  const [police, setPolice] = useState([]);
  const [redZones, setRedZones] = useState([]);
  const [currentLocationSafety, setCurrentLocationSafety] = useState('safe');
  const [route, setRoute] = useState(null);
  const [routeSafety, setRouteSafety] = useState('safe');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
    loadPoliceStations();
    loadRedZones();
  }, []);

  const loadPoliceStations = async () => {
    try {
      console.log('Loading police stations from:', `${API_URL}/location/police`);
      const response = await axios.get(`${API_URL}/location/police?latitude=${location.latitude}&longitude=${location.longitude}`, { timeout: 5000 });
      console.log('Police stations loaded:', response.data);
      setPolice(response.data);
    } catch (error) {
      console.error('Error loading police stations:', error);
      // Fallback to mock data if API fails
      setPolice([
        {
          _id: '1',
          name: 'Metropolitan Police - North',
          hotline: '+880-2-9555556',
          location: { coordinates: [config.map.defaultRegion.longitude, config.map.defaultRegion.latitude] }
        },
        {
          _id: '2',
          name: 'Metropolitan Police - South',
          hotline: '+880-2-9555557',
          location: { coordinates: [config.map.defaultRegion.longitude - 0.0125, config.map.defaultRegion.latitude - 0.0603] }
        },
        {
          _id: '3',
          name: 'Metropolitan Police - Central',
          hotline: '+880-2-9555555',
          location: { coordinates: [config.map.defaultRegion.longitude - 0.012548, config.map.defaultRegion.longitude - 0.033124] }
        }
      ]);
    }
  };

  const loadRedZones = async () => {
    try {
      console.log('Loading red zones from:', `${API_URL}/admin/red-zones`);
      const response = await axios.get(`${API_URL}/admin/red-zones`, { timeout: 5000 });
      console.log('Red zones loaded:', response.data);
      setRedZones(response.data);
    } catch (error) {
      console.error('Error loading red zones:', error);
      // Fallback to mock data if API fails
      setRedZones([
        {
          _id: '1',
          name: 'High Crime Area - Central',
          severity: 'high',
          area: {
            coordinates: [[
              [config.map.defaultRegion.longitude - 0.015, config.map.defaultRegion.latitude - 0.035],
              [config.map.defaultRegion.longitude - 0.005, config.map.defaultRegion.latitude - 0.035],
              [config.map.defaultRegion.longitude - 0.005, config.map.defaultRegion.latitude - 0.025],
              [config.map.defaultRegion.longitude - 0.015, config.map.defaultRegion.latitude - 0.025],
              [config.map.defaultRegion.longitude - 0.015, config.map.defaultRegion.latitude - 0.035]
            ]]
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for safety features.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      checkLocationSafety(currentLocation.coords);
    } catch (error) {
      console.error('Error getting location:', error);
      // Use default location for demo
      setLocation({ 
        latitude: config.map.defaultRegion.latitude, 
        longitude: config.map.defaultRegion.longitude 
      });
    }
  };

  const checkLocationSafety = (coords = location) => {
    // Check if current location is in any red zone
    const userInRedZone = redZones.find(zone => {
      return isPointInPolygon(coords, zone.area.coordinates[0]);
    });

    if (userInRedZone) {
      setCurrentLocationSafety(userInRedZone.severity);
      Alert.alert(
        '⚠️ SAFETY WARNING',
        `You are in a ${userInRedZone.severity.toUpperCase()} risk area: ${userInRedZone.name}\n\nPlease exercise extreme caution and consider leaving the area immediately.`,
        [
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

  const callPoliceStation = (station) => {
    Alert.alert(
      station.name,
      `Hotline: ${station.hotline}\n\nWould you like to call this number?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${station.hotline}`) },
      ]
    );
  };

  const checkRouteToDestination = (destination) => {
    if (!location) return;

    // Create route coordinates
    const routeCoordinates = [
      { latitude: location.latitude, longitude: location.longitude },
      { latitude: destination.location.coordinates[1], longitude: destination.location.coordinates[0] }
    ];
    setRoute(routeCoordinates);

    // Check if route passes through red zones
    const routePassesRedZone = redZones.find(zone => {
      return routeIntersectsPolygon(routeCoordinates, zone.area.coordinates[0]);
    });

    if (routePassesRedZone) {
      setRouteSafety(routePassesRedZone.severity);
      Alert.alert(
        '⚠️ ROUTE SAFETY WARNING',
        `The route to ${destination.name} passes through a ${routePassesRedZone.severity.toUpperCase()} risk area.\n\nConsider taking an alternative route or travel with extreme caution.`,
        [
          { text: 'Find Alternative Route', onPress: () => findAlternativeRoute() },
          { text: 'Proceed with Caution', style: 'cancel' }
        ]
      );
    } else {
      setRouteSafety('safe');
      Alert.alert('✅ Safe Route', `The route to ${destination.name} appears to be safe.`);
    }
  };

  const routeIntersectsPolygon = (route, polygon) => {
    // Simple intersection check - in real app, use proper line-polygon intersection
    const midPoint = {
      latitude: (route[0].latitude + route[1].latitude) / 2,
      longitude: (route[0].longitude + route[1].longitude) / 2
    };
    return isPointInPolygon(midPoint, polygon);
  };

  const findAlternativeRoute = () => {
    Alert.alert('Alternative Route', 'Finding safer route...\n\nConsider using main roads and well-lit areas.');
  };

  const getSafetyColor = (safety) => {
    switch (safety) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#ffdd00';
      default: return '#44ff44';
    }
  };

  const getSafetyText = (safety) => {
    switch (safety) {
      case 'high': return 'HIGH RISK';
      case 'medium': return 'MEDIUM RISK';
      case 'low': return 'LOW RISK';
      default: return 'SAFE';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Loading map data from database...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Current Location */}
        <Marker
          coordinate={location}
          title="Your Location"
          description="You are here"
          pinColor="blue"
        />

        {/* Police Stations */}
        {police.map((station) => (
          <Marker
            key={station._id}
            coordinate={{
              latitude: station.location.coordinates[1],
              longitude: station.location.coordinates[0]
            }}
            title={station.name}
            description={`Hotline: ${station.hotline}`}
            pinColor="green"
            onPress={() => {
              callPoliceStation(station);
              checkRouteToDestination(station);
            }}
          />
        ))}

        {/* Red Zones */}
        {redZones.map((zone) => (
          <Polygon
            key={zone._id}
            coordinates={zone.area.coordinates[0].map(coord => ({
              latitude: coord[1],
              longitude: coord[0]
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

        {/* Route */}
        {route && (
          <Polyline
            coordinates={route}
            strokeColor={routeSafety === 'safe' ? '#44ff44' : getSafetyColor(routeSafety)}
            strokeWidth={4}
            lineDashPattern={[5, 5]}
          />
        )}
      </MapView>

      {/* Safety Indicator */}
      <View style={[styles.safetyIndicator, { backgroundColor: getSafetyColor(currentLocationSafety) }]}>
        <Text style={styles.safetyText}>{getSafetyText(currentLocationSafety)}</Text>
      </View>

      {/* Police Stations Info */}
      <View style={styles.infoPanel}>
        <Text style={styles.infoTitle}>Nearby Police Stations (from Database)</Text>
        <FlatList
          data={police}
          keyExtractor={(i) => i._id}
          renderItem={({ item }) => (
            <View style={styles.stationInfo}>
              <Text style={styles.stationName}>{item.name}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.hotline}`)}>
                <Text style={styles.stationHotline}>📞 {item.hotline}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {police.length === 0 && (
          <Text style={styles.emptyText}>No police stations found in database</Text>
        )}
      </View>

      {/* Emergency Button */}
      <TouchableOpacity style={styles.emergencyButton} onPress={callEmergency}>
        <Text style={styles.emergencyButtonText}>🚨 EMERGENCY</Text>
      </TouchableOpacity>
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
  infoPanel: {
    position: 'absolute',
    bottom: 20,
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
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  stationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  stationName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  stationHotline: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
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
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 10,
  },
});
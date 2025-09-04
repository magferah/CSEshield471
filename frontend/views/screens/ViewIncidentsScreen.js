//frontend/views/screens/ViewIncidentScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';


const BACKEND_URL = 'http://192.168.0.102:5000';


export default function ViewIncidentsScreen() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/incident/all`);
        setIncidents(res.data);
      } catch (err) {
        console.error('Failed to load incidents', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.type.toUpperCase()}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>


      <MapView
        style={styles.map}
        initialRegion={{
          latitude: item.location.latitude,
          longitude: item.location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        pointerEvents="none"
      >
        <Marker
          coordinate={{
            latitude: item.location.latitude,
            longitude: item.location.longitude,
          }}
        />
      </MapView>


      <Text style={styles.location}>
        📍 {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
      </Text>
      <Text style={styles.date}>🕒 {new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );


  if (loading)
    return <ActivityIndicator size="large" color="#76c043" style={{ marginTop: 100 }} />;


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reported Incidents</Text>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50'
  },
  listContent: {
    paddingBottom: 40
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4
  },
  badge: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333'
  },
  map: {
    height: 150,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10
  },
  location: {
    fontSize: 13,
    color: '#555'
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 6
  }
});



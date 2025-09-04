// frontend/views/screens/Admin/AdminDashboardScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, Entypo, MaterialIcons } from '@expo/vector-icons';

export default function AdminDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {/* Manage Crowded Places */}
        <TouchableOpacity style={styles.tile}>
          <FontAwesome5 name="city" size={30} color="#000" />
          <Text style={styles.tileText}>MANAGE{"\n"}CROWDED{"\n"}PLACES</Text>
        </TouchableOpacity>

        {/* Manage Police Stations */}
        <TouchableOpacity style={styles.tile}>
          <Ionicons name="shield-checkmark" size={30} color="#000" />
          <Text style={styles.tileText}>manage{"\n"}POLICE{"\n"}STATIONS</Text>
        </TouchableOpacity>

        {/* Manage Red Zone */}
        <TouchableOpacity style={styles.tile}>
          <Entypo name="triangle-up" size={30} color="#000" />
          <Text style={styles.tileText}>MANAGE{"\n"}RED{"\n"}ZONE</Text>
        </TouchableOpacity>

        {/* Manage Users */}
        <TouchableOpacity style={styles.tile}>
          <Ionicons name="people" size={30} color="#000" />
          <Text style={styles.tileText}>MANAGE{"\n"}USERS</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="people" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="location" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="alert-circle" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  tile: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#7ed957', // green shade
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: {
    textAlign: 'center',
    marginTop: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#d1f0c1',
  },
});

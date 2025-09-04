// frontend/views/screens/Admin/AdminDashboardScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, Entypo, MaterialIcons } from '@expo/vector-icons';

export default function AdminDashboardScreen() {
  const navigation = useNavigation();

  const handleNavigation = (screenName, title) => {
    if (screenName === 'ManageRedZones') {
      navigation.navigate('ManageRedZones');
    } else {
      // For screens not yet implemented
      Alert.alert(
        'Coming Soon',
        `${title} feature is under development and will be available soon.`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="log-out-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome, Administrator</Text>
        <Text style={styles.welcomeSubtext}>Manage safety zones and monitor incidents</Text>
      </View>

      <View style={styles.gridContainer}>
        {/* Manage Crowded Places */}
        <TouchableOpacity 
          style={styles.tile}
          onPress={() => handleNavigation('ManagePlaces', 'Manage Crowded Places')}
        >
          <FontAwesome5 name="city" size={30} color="#000" />
          <Text style={styles.tileText}>MANAGE{"\n"}CROWDED{"\n"}PLACES</Text>
        </TouchableOpacity>

        {/* Manage Police Stations */}
        <TouchableOpacity 
          style={styles.tile}
          onPress={() => handleNavigation('ManagePoliceStations', 'Manage Police Stations')}
        >
          <Ionicons name="shield-checkmark" size={30} color="#000" />
          <Text style={styles.tileText}>MANAGE{"\n"}POLICE{"\n"}STATIONS</Text>
        </TouchableOpacity>

        {/* Manage Red Zone */}
        <TouchableOpacity 
          style={styles.tile}
          onPress={() => handleNavigation('ManageRedZones', 'Manage Red Zone')}
        >
          <Entypo name="triangle-up" size={30} color="#000" />
          <Text style={styles.tileText}>MANAGE{"\n"}RED{"\n"}ZONE</Text>
        </TouchableOpacity>

        {/* Manage Users */}
        <TouchableOpacity 
          style={styles.tile}
          onPress={() => handleNavigation('ManageUsers', 'Manage Users')}
        >
          <Ionicons name="people" size={30} color="#000" />
          <Text style={styles.tileText}>MANAGE{"\n"}USERS</Text>
        </TouchableOpacity>

        {/* View Incidents */}
        <TouchableOpacity 
          style={[styles.tile, styles.fullWidthTile]}
          onPress={() => handleNavigation('ViewAllIncidents', 'View All Incidents')}
        >
          <MaterialIcons name="report-problem" size={30} color="#000" />
          <Text style={styles.tileText}>VIEW ALL INCIDENTS</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics Section */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Quick Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Red Zones</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>127</Text>
            <Text style={styles.statLabel}>Total Incidents</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>High Risk Areas</Text>
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#4CAF50" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleNavigation('ManageUsers', 'Manage Users')}
        >
          <Ionicons name="people" size={24} color="#666" />
          <Text style={styles.navLabelInactive}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleNavigation('ManageRedZones', 'Manage Red Zone')}
        >
          <Ionicons name="location" size={24} color="#666" />
          <Text style={styles.navLabelInactive}>Zones</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleNavigation('ViewAllIncidents', 'View All Incidents')}
        >
          <Ionicons name="alert-circle" size={24} color="#666" />
          <Text style={styles.navLabelInactive}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleNavigation('Settings', 'Settings')}
        >
          <Ionicons name="settings" size={24} color="#666" />
          <Text style={styles.navLabelInactive}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#666',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  tile: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#7ed957',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidthTile: {
    width: '100%',
    aspectRatio: 2.5,
  },
  tileText: {
    textAlign: 'center',
    marginTop: 12,
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 18,
  },
  statsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 'auto',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  navLabel: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '600',
  },
  navLabelInactive: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

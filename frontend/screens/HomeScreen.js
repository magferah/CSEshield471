import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';

const BACKEND_IP = '192.168.0.103'; // Change to your backend server's local IP
const USER_ID = '689caaa96748f9d55de331b3'; // Replace with AsyncStorage or context later

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      checkForIncomingAlerts();
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const checkForIncomingAlerts = async () => {
    try {
      const response = await fetch(
        `http://${BACKEND_IP}:5000/api/sos/received-alerts/${USER_ID}`
      );
      if (!response.ok) return;

      const alerts = await response.json();

      alerts.forEach((alert) => {
        Alert.alert(
          `🚨 SOS from ${alert.from}`,
          `${alert.message}`,
          [
            {
              text: 'Open Map',
              onPress: () => {
                Linking.openURL(alert.location);
              },
            },
            { text: 'Dismiss', style: 'cancel' },
          ],
          { cancelable: false }
        );
      });
    } catch (err) {
      console.error('❌ Error checking alerts:', err);
    }
  };

  const handleSosPress = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location access is required to send SOS.'
        );
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;

      const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
      const sosMessage = `🚨 SOS ALERT! User needs help. Location: ${locationUrl}`;

      const startTime = Date.now();

      const response = await fetch(
        `http://${BACKEND_IP}:5000/api/sos/alert`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: USER_ID,
            location: locationUrl,
            message: sosMessage,
          }),
        }
      );

      const duration = Date.now() - startTime;

      console.log(`🔁 SOS API Request Duration: ${duration} ms`);
      console.log('✅ Response Status:', response.status);

      const data = await response.json();
      console.log('📦 Response Body:', data);

      if (response.ok) {
        const { notifiedNames } = data;
        const message = `SOS Sent!\nNotified: ${notifiedNames.join(', ')}`;
        Alert.alert('Success', message);
        navigation.navigate('SosSent');
      } else {
        Alert.alert('Error', data.msg || 'Something went wrong.');
      }
    } catch (error) {
      console.error('❌ SOS Network Error:', error);
      Alert.alert('Error', 'Unable to send SOS. Check your backend or network.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HI, USER!</Text>
      <Text style={styles.subtitle}>We are here to shield you from danger!!</Text>

      <TouchableOpacity style={styles.sosButton} onPress={handleSosPress}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.helpBox}
        onPress={() => navigation.navigate('DangerInfo')}
      >
        <Text style={styles.helpText}>
          Not sure what to do? Let us know your danger!
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => navigation.navigate('ReportIncident')}
      >
        <Text style={styles.reportText}>Report Incidents</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>we will help you!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textShadowColor: '#aaa',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
    color: '#4CAF50',
  },
  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#76c043',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  sosText: {
    fontSize: 50,
    color: 'black',
    fontWeight: 'bold',
  },
  helpBox: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  helpText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  reportButton: {
    marginTop: 10,
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  reportText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#76c043',
    textShadowColor: '#ccc',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
});

export default HomeScreen;


// frontend/views/screens/ReportIncidentScreen.js - IMPROVED VERSION
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Location from 'expo-location';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

const BACKEND_URL = 'http://192.168.0.102:5000'; // Replace with your IP

// Custom Dropdown Component (same as before)
const CustomDropdown = ({ value, onValueChange, options, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsVisible(true)}>
        <Text style={value ? styles.dropdownButtonTextSelected : styles.dropdownButtonText}>
          {value ? options.find(opt => opt.value === value)?.label : placeholder}
        </Text>
        <FontAwesome name="chevron-down" size={16} color="#666" />
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Incident Type</Text>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  onValueChange(option.value);
                  setIsVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function ReportIncidentScreen({ navigation }) {
  const { control, handleSubmit, formState: { errors }, reset } = useForm();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const incidentOptions = [
    { label: 'Harassment', value: 'harassment' },
    { label: 'Unsafe Road', value: 'unsafe_road' },
    { label: 'Suspicious Activity', value: 'suspicious_activity' },
    { label: 'Location (for Red Zone)', value: 'location' },
    { label: 'Other', value: 'other' },
  ];

  useEffect(() => {
    (async () => {
      try {
        console.log('🌍 Requesting location permission...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required.');
          setDebugInfo('Location permission denied');
          return;
        }
        
        console.log('📍 Getting current position...');
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 10000,
        });
        
        const locationData = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        };
        
        setLocation(locationData);
        setDebugInfo(`Location: ${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`);
        console.log('✅ Location obtained:', locationData);
        
      } catch (error) {
        console.error('❌ Location error:', error);
        setDebugInfo(`Location error: ${error.message}`);
        Alert.alert('Location Error', `Could not get location: ${error.message}`);
      }
    })();
  }, []);

  // Test backend connection
  const testConnection = async () => {
    try {
      console.log('🧪 Testing backend connection...');
      const response = await axios.get(`${BACKEND_URL}/api/incident/test`);
      console.log('✅ Backend test response:', response.data);
      Alert.alert('Connection Test', 'Backend is working!');
    } catch (error) {
      console.error('❌ Backend test failed:', error);
      Alert.alert('Connection Error', `Could not connect to backend: ${error.message}`);
    }
  };

  const onSubmit = async (formData) => {
    console.log('📝 Form submission started');
    console.log('📦 Form data:', formData);
    console.log('📍 Location data:', location);

    if (!location) {
      Alert.alert('Location Error', 'Location not available. Please wait for location to load.');
      return;
    }

    if (!formData.type || !formData.description) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    
    const submissionData = {
      type: formData.type,
      description: formData.description.trim(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    };

    console.log('🚀 Submitting data:', JSON.stringify(submissionData, null, 2));

    try {
      const response = await axios.post(`${BACKEND_URL}/api/incident/report`, submissionData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('✅ Submission successful:', response.data);
      
      Alert.alert(
        'Report Submitted', 
        'Thank you for reporting. Your report has been saved successfully.',
        [{ text: 'OK', onPress: () => {
          reset();
          navigation.goBack();
        }}]
      );

    } catch (error) {
      console.error('❌ Submission error:', error);
      
      let errorMessage = 'Could not submit report. ';
      
      if (error.response) {
        // Server responded with error
        console.error('Server error response:', error.response.data);
        errorMessage += `Server error: ${error.response.data.message || error.response.statusText}`;
        
        if (error.response.data.errors) {
          errorMessage += `\nValidation errors: ${JSON.stringify(error.response.data.errors)}`;
        }
      } else if (error.request) {
        // Network error
        console.error('Network error:', error.request);
        errorMessage += 'Network error. Please check your internet connection and backend server.';
      } else {
        // Other error
        console.error('Other error:', error.message);
        errorMessage += error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report an Incident</Text>

      {/* Debug Info */}
      {debugInfo ? (
        <Text style={styles.debugText}>{debugInfo}</Text>
      ) : null}

      {/* Test Connection Button */}
      <TouchableOpacity style={styles.testButton} onPress={testConnection}>
        <Text style={styles.testButtonText}>Test Backend Connection</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Type:</Text>
      <Controller
        control={control}
        name="type"
        defaultValue=""
        rules={{ required: 'Incident type is required' }}
        render={({ field: { onChange, value } }) => (
          <CustomDropdown
            value={value}
            onValueChange={onChange}
            options={incidentOptions}
            placeholder="Select incident type..."
          />
        )}
      />
      {errors.type && <Text style={styles.error}>{errors.type.message}</Text>}

      <Text style={styles.label}>Description:</Text>
      <Controller
        control={control}
        name="description"
        defaultValue=""
        rules={{ 
          required: 'Description is required',
          minLength: { value: 10, message: 'Description must be at least 10 characters' }
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Write a detailed description of the incident..."
            multiline
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#76c043" />
          <Text style={styles.loadingText}>Submitting report...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Submit Report</Text>
        </TouchableOpacity>
      )}

      {/* VIEW INCIDENTS BUTTON */}
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate('ViewIncidents')}
      >
        <Text style={styles.viewButtonText}>View All Incidents</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 20 },
  debugText: { fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 10, fontStyle: 'italic' },
  testButton: { 
    backgroundColor: '#2196F3', 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 15, 
    alignSelf: 'center',
    marginBottom: 20 
  },
  testButtonText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', backgroundColor: '#f9f9f9',
    padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 16
  },
  // Custom Dropdown Styles (same as before)
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: { color: '#999', fontSize: 16 },
  dropdownButtonTextSelected: { color: '#333', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalOptionText: { fontSize: 16, color: '#333' },
  modalCancel: { padding: 15, alignItems: 'center', marginTop: 10 },
  modalCancelText: { fontSize: 16, color: '#666', fontWeight: 'bold' },
  loadingContainer: { alignItems: 'center', marginTop: 20 },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  button: {
    backgroundColor: '#76c043', 
    paddingVertical: 14, 
    borderRadius: 30, 
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    elevation: 6,
  },
  buttonText: { color: 'black', fontSize: 18, fontWeight: 'bold' },
  viewButton: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderColor: '#4CAF50',
    borderWidth: 1
  },
  viewButtonText: { color: '#4CAF50', fontWeight: 'bold', fontSize: 16 },
  error: { color: 'red', marginBottom: 12, fontSize: 14 }
});
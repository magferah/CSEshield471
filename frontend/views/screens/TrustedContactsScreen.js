import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BACKEND_IP = '192.168.0.102:5000';

export default function TrustedContactsScreen() {
  const [userId, setUserId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Load logged-in user
  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem('user');
      console.log('📱 Retrieved user from storage:', user);
      if (user) {
        const parsedUser = JSON.parse(user);
        console.log('👤 Parsed user:', parsedUser);
        console.log('🆔 User ID:', parsedUser._id);
        setUserId(parsedUser._id);
      }
    };
    loadUser();
  }, []);

  // Fetch contacts whenever userId changes
  useEffect(() => {
    if (userId) {
      console.log('🔄 Fetching contacts for userId:', userId);
      fetchContacts();
    }
  }, [userId]);

  const fetchContacts = async () => {
    try {
      console.log('🌐 Fetching from:', `http://${BACKEND_IP}/api/trustedContacts/${userId}`);
      const res = await axios.get(`http://${BACKEND_IP}/api/trustedContacts/${userId}`);
      console.log('✅ Contacts fetched:', res.data);
      setContacts(res.data);
    } catch (err) {
      console.error('❌ Fetch contacts error:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

  const addContact = async () => {
    if (!name || !phone) {
      return Alert.alert('Error', 'Fill both name and phone');
    }

    // Debug logging
    console.log('📝 Adding contact with data:');
    console.log('- userId:', userId);
    console.log('- name:', name);
    console.log('- phone:', phone);

    const contactData = {
      userId,
      name: name.trim(),
      phone: phone.trim(),
    };

    console.log('📤 Sending data:', contactData);

    try {
      const response = await axios.post(`http://${BACKEND_IP}/api/trustedContacts`, contactData);
      console.log('✅ Contact added successfully:', response.data);
      setName('');
      setPhone('');
      Alert.alert('Success', `${name} added to your trusted contacts`);
      fetchContacts();
    } catch (err) {
      console.error('❌ Add contact error:', err.response?.data || err.message);
      console.error('❌ Full error object:', err);
      Alert.alert('Error', `Could not add contact: ${err.response?.data?.msg || err.message}`);
    }
  };

  // Updated delete function for Option 1 (User model approach)
  const deleteContact = async (contactPhone) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete this contact?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // For Option 1, we delete by userId and phone number
              await axios.delete(`http://${BACKEND_IP}/api/trustedContacts/${userId}/${encodeURIComponent(contactPhone)}`);
              console.log('✅ Contact deleted:', contactPhone);
              Alert.alert('Success', 'Contact deleted successfully');
              fetchContacts();
            } catch (err) {
              console.error('❌ Delete contact error:', err.response?.data || err.message);
              Alert.alert('Error', 'Could not delete contact');
            }
          }
        }
      ]
    );
  };

  // Function to add example contacts quickly
  const addExampleContact = (exampleName, examplePhone) => {
    setName(exampleName);
    setPhone(examplePhone);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trusted Contacts</Text>
      
      {/* Debug info */}
      <Text style={styles.debugText}>User ID: {userId || 'Loading...'}</Text>
      <Text style={styles.subtitle}>Add people you trust for emergency situations</Text>

      <TextInput
        style={styles.input}
        placeholder="Contact Name (e.g., Mom, John Doe)"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number (e.g., +8801234567890)"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      
      {/* Example contacts buttons */}
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>Quick Examples:</Text>
        <View style={styles.exampleButtons}>
          <TouchableOpacity 
            style={styles.exampleButton} 
            onPress={() => addExampleContact('Mom', '+8801234567890')}
          >
            <Text style={styles.exampleText}>Mom</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.exampleButton} 
            onPress={() => addExampleContact('Emergency', '999')}
          >
            <Text style={styles.exampleText}>999</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.exampleButton} 
            onPress={() => addExampleContact('Best Friend', '+8801555123456')}
          >
            <Text style={styles.exampleText}>Friend</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addContact}>
        <Text style={styles.addText}>Add Contact</Text>
      </TouchableOpacity>

      <Text style={styles.listTitle}>My Trusted Contacts ({contacts.length})</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => `${item.userId}_${index}`} // Updated keyExtractor for Option 1
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone}</Text>
            </View>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => deleteContact(item.phone)} // Pass phone number for deletion
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No trusted contacts yet. Add some above!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  debugText: { fontSize: 12, color: '#999', marginBottom: 10 },
  input: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 10,
    fontSize: 16,
  },
  exampleContainer: { marginBottom: 15 },
  exampleTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 8 },
  exampleButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  exampleButton: { 
    backgroundColor: '#e8f5e8', 
    padding: 8, 
    borderRadius: 6, 
    minWidth: 70, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  exampleText: { fontSize: 12, color: '#2e7d32', fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#76c043', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 20,
  },
  addText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  contactItem: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 15,
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    borderRadius: 8, 
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  contactPhone: { fontSize: 14, color: '#666', marginTop: 2 },
  deleteButton: { 
    backgroundColor: '#f44336', 
    borderRadius: 6, 
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  emptyText: { 
    textAlign: 'center', 
    color: '#999', 
    fontStyle: 'italic',
    marginTop: 20,
  },
});
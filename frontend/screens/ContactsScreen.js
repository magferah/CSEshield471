import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { api } from '../../api/client';

export default function ContactsScreen() {
  const { colors } = useTheme();
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      console.log('Loading contacts from:', `/contacts`);
      const response = await api.get(`/contacts`, { timeout: 5000 });
      console.log('Contacts loaded:', response.data);
      // Handle backend response format: { success: true, data: contacts }
      if (response.data.success && response.data.data) {
        setContacts(response.data.data);
      } else {
        setContacts(response.data);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      if (error.code === 'ECONNABORTED') {
        Alert.alert('Error', 'Request timeout. Backend server might not be running.');
      } else {
        Alert.alert('Error', 'Failed to load contacts from database. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addContactHandler = async () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      Alert.alert('Error', 'Please fill in both name and phone number');
      return;
    }

    try {
      console.log('Adding contact to:', `/contacts`);
      const response = await api.post(`/contacts`, {
        name: newContact.name.trim(),
        phone: newContact.phone.trim(),
        type: 'family' // Default type
      });
      
      console.log('Contact added:', response.data);
      // Reload contacts after adding
      await loadContacts();
      setNewContact({ name: '', phone: '' });
      setModalVisible(false);
      Alert.alert('Success', 'Contact added successfully to database!');
    } catch (error) {
      console.error('Error adding contact:', error);
      Alert.alert('Error', 'Failed to add contact to database. Please try again.');
    }
  };

  const removeContactHandler = async (contactId) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this contact from database?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Removing contact:', contactId);
              await api.delete(`/contacts/${contactId}`);
              await loadContacts(); // Reload contacts from database
              Alert.alert('Success', 'Contact removed successfully from database!');
            } catch (error) {
              console.error('Error removing contact:', error);
              Alert.alert('Error', 'Failed to remove contact from database. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderContact = ({ item }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeContactHandler(item._id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.title, { color: colors.text }]}>Loading contacts from database...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Trusted Contacts</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>Connected to MongoDB Database</Text>

      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item._id}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No contacts in database yet.
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text }]}>
              Add your trusted contacts for emergency situations.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Contact to Database</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Contact to Database</Text>
            <TextInput
              style={styles.input}
              placeholder="Contact Name"
              value={newContact.name}
              onChangeText={(text) => setNewContact({ ...newContact, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={newContact.phone}
              onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
              keyboardType="phone-pad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addContactHandler}
              >
                <Text style={styles.saveButtonText}>Save to Database</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.6,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
    opacity: 0.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
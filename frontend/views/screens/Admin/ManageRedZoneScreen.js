// frontend/views/screens/Admin/ManageRedZonesScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';

const ManageRedZonesScreen = ({ navigation }) => {
  const [redZones, setRedZones] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Hardcoded initial red zones with common Dhaka locations
  const initialRedZones = [
    {
      id: '1',
      name: 'Mohammadpur',
      area: 'Mohammadpur, Dhaka',
      latitude: 23.7588,
      longitude: 90.3633,
      radius: 500, // meters
      incidentType: 'harassment',
      incidentCount: 15,
      severity: 'high',
      lastUpdated: '2024-12-15',
      description: 'High harassment incidents reported near shopping areas'
    },
    {
      id: '2',
      name: 'Middle Badda',
      area: 'Middle Badda, Dhaka',
      latitude: 23.7806,
      longitude: 90.4254,
      radius: 700,
      incidentType: 'unsafe_road',
      incidentCount: 12,
      severity: 'high',
      lastUpdated: '2024-12-14',
      description: 'Poorly lit roads and unsafe walking conditions'
    },
    {
      id: '3',
      name: 'Dhanmondi Lake Area',
      area: 'Dhanmondi, Dhaka',
      latitude: 23.7461,
      longitude: 90.3742,
      radius: 400,
      incidentType: 'suspicious_activity',
      incidentCount: 8,
      severity: 'medium',
      lastUpdated: '2024-12-13',
      description: 'Suspicious individuals reported around lake area'
    },
    {
      id: '4',
      name: 'New Market Area',
      area: 'New Market, Dhaka',
      latitude: 23.7311,
      longitude: 90.3883,
      radius: 600,
      incidentType: 'harassment',
      incidentCount: 20,
      severity: 'critical',
      lastUpdated: '2024-12-12',
      description: 'Crowded market area with frequent harassment reports'
    },
    {
      id: '5',
      name: 'Uttara Sector 7',
      area: 'Uttara, Dhaka',
      latitude: 23.8759,
      longitude: 90.3795,
      radius: 800,
      incidentType: 'location',
      incidentCount: 6,
      severity: 'medium',
      lastUpdated: '2024-12-11',
      description: 'Isolated area with limited security presence'
    },
    {
      id: '6',
      name: 'Gulshan 1 Circle',
      area: 'Gulshan, Dhaka',
      latitude: 23.7925,
      longitude: 90.4077,
      radius: 300,
      incidentType: 'other',
      incidentCount: 4,
      severity: 'low',
      lastUpdated: '2024-12-10',
      description: 'Minor incidents reported near commercial area'
    },
    {
      id: '7',
      name: 'Farmgate Intersection',
      area: 'Farmgate, Dhaka',
      latitude: 23.7581,
      longitude: 90.3897,
      radius: 450,
      incidentType: 'unsafe_road',
      incidentCount: 10,
      severity: 'high',
      lastUpdated: '2024-12-09',
      description: 'Traffic congestion creates unsafe conditions for pedestrians'
    },
    {
      id: '8',
      name: 'Mirpur 10 Roundabout',
      area: 'Mirpur, Dhaka',
      latitude: 23.8069,
      longitude: 90.3684,
      radius: 550,
      incidentType: 'harassment',
      incidentCount: 13,
      severity: 'high',
      lastUpdated: '2024-12-08',
      description: 'Busy transport hub with harassment incidents'
    }
  ];

  useEffect(() => {
    setRedZones(initialRedZones);
  }, []);

  const incidentTypes = [
    { label: 'Harassment', value: 'harassment' },
    { label: 'Unsafe Road', value: 'unsafe_road' },
    { label: 'Suspicious Activity', value: 'suspicious_activity' },
    { label: 'General Location Risk', value: 'location' },
    { label: 'Other', value: 'other' }
  ];

  const severityLevels = [
    { label: 'Low Risk', value: 'low' },
    { label: 'Medium Risk', value: 'medium' },
    { label: 'High Risk', value: 'high' },
    { label: 'Critical Risk', value: 'critical' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#FF5722';
      case 'critical': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getIncidentTypeIcon = (type) => {
    switch (type) {
      case 'harassment': return 'warning';
      case 'unsafe_road': return 'road';
      case 'suspicious_activity': return 'eye';
      case 'location': return 'location-on';
      case 'other': return 'info';
      default: return 'help';
    }
  };

  const handleAddZone = () => {
    setEditingZone(null);
    reset();
    setModalVisible(true);
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setValue('name', zone.name);
    setValue('area', zone.area);
    setValue('latitude', zone.latitude.toString());
    setValue('longitude', zone.longitude.toString());
    setValue('radius', zone.radius.toString());
    setValue('incidentType', zone.incidentType);
    setValue('severity', zone.severity);
    setValue('description', zone.description);
    setModalVisible(true);
  };

  const handleDeleteZone = (zoneId) => {
    Alert.alert(
      'Delete Red Zone',
      'Are you sure you want to delete this red zone? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setRedZones(redZones.filter(zone => zone.id !== zoneId));
            Alert.alert('Success', 'Red zone deleted successfully');
          }
        }
      ]
    );
  };

  const onSubmit = (data) => {
    const newZone = {
      id: editingZone ? editingZone.id : Date.now().toString(),
      name: data.name,
      area: data.area,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      radius: parseInt(data.radius),
      incidentType: data.incidentType,
      incidentCount: editingZone ? editingZone.incidentCount : 1,
      severity: data.severity,
      lastUpdated: new Date().toISOString().split('T')[0],
      description: data.description
    };

    if (editingZone) {
      setRedZones(redZones.map(zone => zone.id === editingZone.id ? newZone : zone));
      Alert.alert('Success', 'Red zone updated successfully');
    } else {
      setRedZones([...redZones, newZone]);
      Alert.alert('Success', 'Red zone added successfully');
    }

    setModalVisible(false);
    reset();
  };

  const renderRedZoneCard = ({ item }) => (
    <View style={styles.zoneCard}>
      <View style={styles.zoneHeader}>
        <View style={styles.zoneInfo}>
          <MaterialIcons 
            name={getIncidentTypeIcon(item.incidentType)} 
            size={24} 
            color={getSeverityColor(item.severity)} 
          />
          <View style={styles.zoneTitleContainer}>
            <Text style={styles.zoneName}>{item.name}</Text>
            <Text style={styles.zoneArea}>{item.area}</Text>
          </View>
        </View>
        <View style={styles.zoneActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditZone(item)}
          >
            <FontAwesome name="edit" size={16} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteZone(item.id)}
          >
            <FontAwesome name="trash" size={16} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.zoneStats}>
        <View style={styles.statItem}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.statText}>
            {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="radio-button-unchecked" size={16} color="#666" />
          <Text style={styles.statText}>{item.radius}m radius</Text>
        </View>
      </View>

      <View style={styles.zoneDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>
            {incidentTypes.find(t => t.value === item.incidentType)?.label}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Incidents:</Text>
          <Text style={styles.detailValue}>{item.incidentCount} reports</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Severity:</Text>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
            <Text style={styles.severityText}>
              {severityLevels.find(s => s.value === item.severity)?.label}
            </Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Updated:</Text>
          <Text style={styles.detailValue}>{item.lastUpdated}</Text>
        </View>
      </View>

      <Text style={styles.zoneDescription}>{item.description}</Text>
    </View>
  );

  const CustomDropdown = ({ value, onValueChange, options, placeholder, control, name, rules }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <View>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsVisible(true)}>
              <Text style={value ? styles.dropdownButtonTextSelected : styles.dropdownButtonText}>
                {value ? options.find(opt => opt.value === value)?.label : placeholder}
              </Text>
              <FontAwesome name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>

            <Modal visible={isVisible} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.dropdownModalContent}>
                  <Text style={styles.dropdownModalTitle}>{placeholder}</Text>
                  {options.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.dropdownModalOption}
                      onPress={() => {
                        onChange(option.value);
                        setIsVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownModalOptionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.dropdownModalCancel}
                    onPress={() => setIsVisible(false)}
                  >
                    <Text style={styles.dropdownModalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Red Zones</Text>
        <TouchableOpacity onPress={handleAddZone}>
          <FontAwesome name="plus" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{redZones.length}</Text>
          <Text style={styles.statsLabel}>Total Zones</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>
            {redZones.filter(z => z.severity === 'critical' || z.severity === 'high').length}
          </Text>
          <Text style={styles.statsLabel}>High Risk</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>
            {redZones.reduce((sum, zone) => sum + zone.incidentCount, 0)}
          </Text>
          <Text style={styles.statsLabel}>Total Incidents</Text>
        </View>
      </View>

      <FlatList
        data={redZones}
        renderItem={renderRedZoneCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingZone ? 'Edit Red Zone' : 'Add New Red Zone'}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <FontAwesome name="times" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>Zone Name *</Text>
              <Controller
                control={control}
                name="name"
                rules={{ required: 'Zone name is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Dhanmondi 15"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

              <Text style={styles.inputLabel}>Area Description *</Text>
              <Controller
                control={control}
                name="area"
                rules={{ required: 'Area description is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Dhanmondi, Dhaka"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.area && <Text style={styles.errorText}>{errors.area.message}</Text>}

              <View style={styles.coordinateRow}>
                <View style={styles.coordinateInput}>
                  <Text style={styles.inputLabel}>Latitude *</Text>
                  <Controller
                    control={control}
                    name="latitude"
                    rules={{ required: 'Latitude is required' }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.input}
                        placeholder="23.7461"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="numeric"
                      />
                    )}
                  />
                  {errors.latitude && <Text style={styles.errorText}>{errors.latitude.message}</Text>}
                </View>

                <View style={styles.coordinateInput}>
                  <Text style={styles.inputLabel}>Longitude *</Text>
                  <Controller
                    control={control}
                    name="longitude"
                    rules={{ required: 'Longitude is required' }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.input}
                        placeholder="90.3742"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="numeric"
                      />
                    )}
                  />
                  {errors.longitude && <Text style={styles.errorText}>{errors.longitude.message}</Text>}
                </View>
              </View>

              <Text style={styles.inputLabel}>Radius (meters) *</Text>
              <Controller
                control={control}
                name="radius"
                rules={{ required: 'Radius is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="500"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.radius && <Text style={styles.errorText}>{errors.radius.message}</Text>}

              <Text style={styles.inputLabel}>Incident Type *</Text>
              <CustomDropdown
                control={control}
                name="incidentType"
                rules={{ required: 'Incident type is required' }}
                options={incidentTypes}
                placeholder="Select incident type"
              />
              {errors.incidentType && <Text style={styles.errorText}>{errors.incidentType.message}</Text>}

              <Text style={styles.inputLabel}>Severity Level *</Text>
              <CustomDropdown
                control={control}
                name="severity"
                rules={{ required: 'Severity level is required' }}
                options={severityLevels}
                placeholder="Select severity level"
              />
              {errors.severity && <Text style={styles.errorText}>{errors.severity.message}</Text>}

              <Text style={styles.inputLabel}>Description *</Text>
              <Controller
                control={control}
                name="description"
                rules={{ required: 'Description is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Brief description of the risk factors"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={3}
                  />
                )}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={styles.submitButtonText}>
                  {editingZone ? 'Update Zone' : 'Add Zone'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  zoneCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  zoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  zoneTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  zoneArea: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  zoneActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#E3F2FD',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#FFEBEE',
  },
  zoneStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  zoneDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  zoneDescription: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  coordinateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  coordinateInput: {
    flex: 1,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: '#999',
    fontSize: 16,
  },
  dropdownButtonTextSelected: {
    color: '#333',
    fontSize: 16,
  },
  dropdownModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  dropdownModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  dropdownModalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownModalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownModalCancel: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  dropdownModalCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 4,
  },
});

export default ManageRedZonesScreen;
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const BACKEND_IP = '192.168.0.103'; // Change to your local IP
const USER_ID = '689caaa96748f9d55de331b3';

export default function ScheduleScreen() {
  const [date, setDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [planText, setPlanText] = useState('');
  const [parentPhones, setParentPhones] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`http://${BACKEND_IP}:5000/api/schedules?userId=${USER_ID}`);
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load schedules');
    }
  };

  const resetForm = () => {
    setDate('');
    setReturnTime('');
    setPlanText('');
    setParentPhones('');
    setEditId(null);
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      // Format time as "HH:mm" 24-hour
      const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      setReturnTime(formattedTime);
    }
  };

  const saveSchedule = async () => {
    if (!date || !returnTime || !planText.trim()) {
      return Alert.alert('Missing fields', 'Please fill date, return time, and your plan.');
    }

    const phones = parentPhones
      .split(',')
      .map(p => p.trim())
      .filter(p => p);

    const payload = {
      userId: USER_ID,
      date,
      returnTime,
      planText: planText.trim(),
      visibleTo: phones,
    };

    try {
      if (editId) {
        await axios.put(`http://${BACKEND_IP}:5000/api/schedules/${editId}`, payload);
        Alert.alert('Updated', 'Schedule updated.');
      } else {
        await axios.post(`http://${BACKEND_IP}:5000/api/schedules`, payload);
        Alert.alert('Saved', 'Schedule saved.');
      }
      resetForm();
      fetchSchedules();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save schedule.');
    }
  };

  const deleteSchedule = (id) => {
    Alert.alert(
      'Delete Schedule?',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`http://${BACKEND_IP}:5000/api/schedules/${id}`);
              Alert.alert('Deleted', 'Schedule deleted.');
              fetchSchedules();
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Could not delete.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const editSchedule = (item) => {
    setEditId(item._id);
    setDate(item.date);
    setReturnTime(item.returnTime);
    setPlanText(item.planText);
    setParentPhones((item.visibleTo || []).join(', '));
  };

  const sendScheduleViaSMS = (item) => {
    const phones = item.visibleTo || [];
    if (!phones.length) {
      return Alert.alert('No numbers', 'No phone numbers saved for this schedule.');
    }

    const msg = `📅: ${item.date}\n🕒 Return at ${item.returnTime}\n📝 ${item.planText}`;

    phones.forEach(phone => {
      const smsUrl = `sms:${phone}?body=${encodeURIComponent(msg)}`;
      Linking.openURL(smsUrl);
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Schedule Planner</Text>

        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: date ? '#000' : '#aaa' }}>{date || 'Select Date'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
          <Text style={{ color: returnTime ? '#000' : '#aaa' }}>{returnTime || 'Select Return Time'}</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textArea}
          placeholder="Write your plan..."
          value={planText}
          onChangeText={setPlanText}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Phone numbers (comma separated)"
          value={parentPhones}
          onChangeText={setParentPhones}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.saveBtn} onPress={saveSchedule}>
          <Text style={styles.saveBtnText}>{editId ? 'Update' : 'Save'}</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Saved Plans</Text>
        {schedules.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 10, color: '#888' }}>
            No plans yet.
          </Text>
        ) : (
          schedules.map(item => (
            <View key={item._id} style={styles.scheduleItem}>
              <Text style={styles.dateTime}>{item.date} — Return at {item.returnTime}</Text>
              <Text style={styles.planText}>{item.planText}</Text>
              <Text style={styles.phones}>
                To: {item.visibleTo?.length ? item.visibleTo.join(', ') : 'None'}
              </Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={[styles.button, styles.smsBtn]} onPress={() => sendScheduleViaSMS(item)}>
                  <Text style={styles.buttonText}>SMS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.editBtn]} onPress={() => editSchedule(item)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteBtn]} onPress={() => deleteSchedule(item._id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={date ? new Date(date) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onChangeDate}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={
            returnTime
              ? (() => {
                  const [h, m] = returnTime.split(':');
                  const d = new Date();
                  d.setHours(+h, +m);
                  return d;
                })()
              : new Date()
          }
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeTime}
          is24Hour={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollArea: {
    flex: 1,
    paddingBottom: 100,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 100,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  dateTime: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  planText: {
    marginBottom: 8,
  },
  phones: {
    color: '#555',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  smsBtn: {
    backgroundColor: '#ff9800',
  },
  editBtn: {
    backgroundColor: '#2196F3',
  },
  deleteBtn: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});








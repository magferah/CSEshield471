// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';

// const BACKEND_IP = '192.168.0.103'; // your backend IP
// const CURRENT_USER_ID = '689caaa96748f9d55de331b3'; // Replace with your MongoDB userId

// const ReceivedAlertsScreen = () => {
//   const [alerts, setAlerts] = useState([]);

//   const fetchAlerts = async () => {
//     try {
//       const response = await fetch(`http://${BACKEND_IP}:5000/api/sos/received/${CURRENT_USER_ID}`);
//       const data = await response.json();

//       if (Array.isArray(data)) {
//         setAlerts(data);
//       } else {
//         Alert.alert('Error', 'Failed to load alerts.');
//       }
//     } catch (error) {
//       console.error('Fetch alerts error:', error);
//       Alert.alert('Error', 'Could not fetch alerts.');
//     }
//   };

//   useEffect(() => {
//     fetchAlerts();
//   }, []);

//   const openLocation = (link) => {
//     Linking.openURL(link).catch(err => console.error("Couldn't open link:", err));
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.alertCard}>
//       <Text style={styles.senderName}>{item.senderName} needs help!</Text>
//       <Text>Phone: {item.senderPhone}</Text>
//       <Text>Time: {new Date(item.createdAt).toLocaleString()}</Text>
//       <TouchableOpacity onPress={() => openLocation(item.locationLink)}>
//         <Text style={styles.linkText}>📍 View Location</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Received SOS Alerts</Text>
//       <FlatList
//         data={alerts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
//   alertCard: {
//     padding: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     marginBottom: 15,
//     backgroundColor: '#f0f8ff',
//   },
//   senderName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
//   linkText: { color: 'blue', marginTop: 8 },
// });

// export default ReceivedAlertsScreen;

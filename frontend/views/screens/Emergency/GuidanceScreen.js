import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
const GuidanceScreen = ({ route }) => {
  const { answers } = route.params;
  const { inVehicle, isFollowed, offender } = answers;

  let guidanceMessage = "";

  // Case 1: in vehicle, offender is driver, not followed
  if (inVehicle === "yes" && offender === "driver" && isFollowed === "no") {
    guidanceMessage = `Pretend you have a sudden call, and you have to take off from vehicle, 
just get out as naturally as you can. And get to near schools/hospitals if you still feel unsafe.  
If takeoff is not possible, go through our self-defense tips section, 
or make a phone call in near stations, or press sos button.`;
  }
  // Case 2: not in vehicle, followed, offender passerby
  else if (inVehicle === "no" && isFollowed === "yes" && offender === "passerby") {
    guidanceMessage = `Stay calm. Pretend you have a sudden call and walk towards near safe/crowded places. 
Click location button and find the route of the place.`;
  }
  // Case 3: in vehicle, passenger is offender, not followed
  else if (inVehicle === "yes" && offender === "passenger" && isFollowed === "no") {
    guidanceMessage = `Get off from the vehicle quickly, if not possible make call in near police stations. 
Click shield button to get the informations about near stations.`;
  }
  // Case 4: in vehicle, being followed, offender exists (driver/passenger/passerby)
  else if (inVehicle === "yes" && isFollowed === "yes" && ["driver", "passenger", "passerby"].includes(offender)) {
    guidanceMessage = `Stay calm. Take a picture of licenseplate if possible. Or, try to take a picture of that person. 
Drive near policestations. Click location button to find the route and make a call in that station. 
If not possible and interaction is unavoidable, open your audio recording and keep the phone in bag, 
at the same time press sos button.`;
  }
  // Default fallback
  else {
    guidanceMessage = "Stay safe. Follow basic safety guidelines.";
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Safety Guidance</Text>
      <Text style={styles.message}>{guidanceMessage}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
});

export default GuidanceScreen;

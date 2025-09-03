import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SosSentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HI, USER!</Text>
      <Text style={styles.subtitle}>
        Notification has been sent to your contacts.{"\n"}
        Stay calm, stay focused!
      </Text>
      <View style={styles.checkmarkCircle}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
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
    marginVertical: 20,
    color: '#4CAF50',
    textAlign: 'center',
  },
  checkmarkCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#76c043',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  checkmark: {
    fontSize: 72,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SosSentScreen;

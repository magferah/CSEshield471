import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginSelectionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login as User</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.adminButton]} 
        onPress={() => navigation.navigate('AdminLogin')}
      >
        <Text style={styles.buttonText}>Login as Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2C3E50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  adminButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

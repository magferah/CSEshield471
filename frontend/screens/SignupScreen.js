import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import AuthController from '../../../controllers/AuthController';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await AuthController.signup(
        name.trim(),
        phoneNumber.trim(),
        email.trim(),
        password
      );
      
      console.log('Signup success:', response);
      
      Alert.alert(
        'Success', 
        'Account created successfully! You can now login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
      
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginNavigation = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Message */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Join our safety community! Your security is our priority.
          </Text>
        </View>

        {/* Signup Form Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Create your Account</Text>
          
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number (e.g., +8801712345678)"
              placeholderTextColor="#666"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 characters)"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Signup Button */}
        <TouchableOpacity 
          style={[styles.signupButton, loading && styles.buttonDisabled]} 
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.signupButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Section */}
        <View style={styles.loginSection}>
          <Text style={styles.alreadyMemberText}>Already have an account?</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLoginNavigation}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Icon Placeholder */}
        <TouchableOpacity style={styles.settingsIcon}>
          <Text style={styles.settingsIconText}>⚙️</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6AB04C', // Green background matching your design
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 24,
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signupButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginBottom: 25,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#7F8C8D',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  alreadyMemberText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  settingsIcon: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIconText: {
    fontSize: 24,
  },
});
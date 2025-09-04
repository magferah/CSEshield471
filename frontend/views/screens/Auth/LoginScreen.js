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
//new line added
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle route params (from successful signup)
  React.useEffect(() => {
    if (route.params?.message) {
      Alert.alert('Success', route.params.message);
    }
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params]);
const handleLogin = async () => {
  // Basic validation
  if (!email.trim() || !password.trim()) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  if (!email.includes('@')) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }

  setLoading(true);
  try {
    // Pass navigation to AuthController
    const response = await AuthController.login(email.trim(), password, navigation);
    
    console.log('Login response:', response);
    
    if (response.success) {
      // Success! AuthController will handle navigation to PanicScreen
      console.log('✅ Login successful, navigating to Panic screen');
      
      // Fix: Get user from response data
      if (response.user && response.user._id) {
        await AsyncStorage.setItem('userID', response.user._id);
      } else if (response.data && response.data.user && response.data.user._id) {
        await AsyncStorage.setItem('userID', response.data.user._id);
      }
      
    } else {
      // Handle login failure
      Alert.alert('Login Failed', response.message || 'Login failed. Please try again.');
    }
          
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle unexpected errors
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    Alert.alert('Login Failed', errorMessage);
  } finally {
    setLoading(false);
  }
};
  // const handleLogin = async () => {
  //   // Basic validation
  //   if (!email.trim() || !password.trim()) {
  //     Alert.alert('Error', 'Please fill in all fields');
  //     return;
  //   }

  //   if (!email.includes('@')) {
  //     Alert.alert('Error', 'Please enter a valid email address');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     // Pass navigation to AuthController
  //     const response = await AuthController.login(email.trim(), password, navigation);
      
  //     console.log('Login response:', response);
      
  //     if (response.success) {
  //       // Success! AuthController will handle navigation to PanicScreen
  //       console.log('✅ Login successful, navigating to Panic screen');
  //       await AsyncStorage.setItem('userID', user._id);
        
  //     } else {
  //       // Handle login failure
  //       Alert.alert('Login Failed', response.message || 'Login failed. Please try again.');
  //     }
            
  //   } catch (error) {
  //     console.error('Login error:', error);
      
  //     // Handle unexpected errors
  //     let errorMessage = 'Login failed. Please try again.';
      
  //     if (error.response?.data?.message) {
  //       errorMessage = error.response.data.message;
  //     } else if (error.message) {
  //       errorMessage = error.message;
  //     }
      
  //     Alert.alert('Login Failed', errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSignupNavigation = () => {
    navigation.navigate('Signup');
  };

  const handleAdminLoginNavigation = () => {
    navigation.navigate('AdminLogin');
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
            In every moment of danger, we will try our best! Believe in us!
          </Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Login your Account</Text>
          
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

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Signup Section */}
        <View style={styles.signupSection}>
          <Text style={styles.firstTimeText}>First time?</Text>
          <TouchableOpacity 
            style={styles.getStartButton}
            onPress={handleSignupNavigation}
          >
            <Text style={styles.getStartButtonText}>GET START!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.linkContainer}>
            <TouchableOpacity onPress={handleAdminLoginNavigation} disabled={loading}>
              <Text style={styles.adminLinkText}>
                Admin Login
              </Text>
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
    marginBottom: 40,
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
    padding: 30,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
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
  loginButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginBottom: 30,
    minWidth: 150,
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
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  firstTimeText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    fontWeight: '500',
  },
  getStartButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  getStartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: 16,
    color: '#ae8686ff',
  },
  linkHighlight: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  adminLinkText: {
    fontSize: 14,
    color: '#000000ff',
    fontWeight: '600',
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
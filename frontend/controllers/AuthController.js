// frontend/controllers/AuthController.js
import AuthService from '../services/AuthService';
import apiClient from '../services/apiClient';

const AuthController = {
  signup: async (name, phoneNumber, email, password, navigation) => {
    try {
      const response = await AuthService.signup(name, phoneNumber, email, password);
      
      if (response.success) {
        // Navigate to login screen after successful signup
        navigation.navigate('Login', {
          message: 'Registration successful! Please login.',
          email: email
        });
        
        return {
          success: true,
          message: 'Registration successful! Please login.',
          user: response.user
        };
      } else {
        return {
          success: false,
          message: response.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('AuthController signup error:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please try again.'
      };
    }
  },

  login: async (email, password, navigation) => {
    try {
      const response = await AuthService.login(email, password);
      
      if (response.success) {
        // Store token in apiClient
        apiClient.setToken(response.token);
        
        // Navigate to PanicScreen (main dashboard) after successful login
        navigation.navigate('Panic', {
          user: response.user
        });
        
        return {
          success: true,
          message: 'Login successful!',
          user: response.user
        };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('AuthController login error:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please try again.'
      };
    }
  },

  adminLogin: async (email, password, navigation) => {
    try {
      const response = await AuthService.adminLogin(email, password);
      
      if (response.success) {
        // Store token in apiClient
        apiClient.setToken(response.token);
        
        // Navigate to admin dashboard (you can create this later)
        navigation.navigate('AdminDashboard', {
          user: response.user
        });
        
        return {
          success: true,
          message: 'Admin login successful!',
          user: response.user
        };
      } else {
        return {
          success: false,
          message: response.message || 'Admin login failed'
        };
      }
    } catch (error) {
      console.error('AuthController admin login error:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please try again.'
      };
    }
  },

  logout: async (navigation) => {
    try {
      // Clear token from apiClient
      apiClient.clearToken();
      
      // Navigate to login
      navigation.navigate('Login');
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Error logging out'
      };
    }
  }
};

export default AuthController;
// frontend/services/AuthService.js
import apiClient from './apiClient';

const AuthService = {
  // Test auth API connection
  testConnection: async () => {
    try {
      const response = await apiClient.get('/auth/test');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Auth API test failed:', error);
      throw error;
    }
  },

  // User login
  login: async (email, password) => {
    try {
      console.log('🔐 AuthService login attempt for:', email);
      
      const response = await apiClient.post('/auth/login', {
        email: email,
        password: password
      });
      
      console.log('✅ AuthService login successful');
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ AuthService login failed:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  },

  // User signup
  signup: async (name, phoneNumber, email, password) => {
    try {
      console.log('📝 AuthService signup attempt for:', email);
      
      const response = await apiClient.post('/auth/signup', {
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        password: password
      });
      
      console.log('✅ AuthService signup successful');
      
      return {
        success: true,
        user: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ AuthService signup failed:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed. Please try again.'
      };
    }
  },

  // Admin login
  adminLogin: async (email, password) => {
    try {
      console.log('🔐 AuthService admin login attempt for:', email);
      
      const response = await apiClient.post('/auth/admin-login', {
        email: email,
        password: password
      });
      
      console.log('✅ AuthService admin login successful');
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ AuthService admin login failed:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Admin login failed. Please try again.'
      };
    }
  },

  // Verify token (check if user is still authenticated)
  verifyToken: async (token) => {
    try {
      const response = await apiClient.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.valid || false;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  },

  // Update user profile
  updateProfile: async (updateData) => {
    try {
      const response = await apiClient.put('/auth/profile', updateData);
      
      return {
        success: true,
        user: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      console.error('Profile update failed:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword: currentPassword,
        newPassword: newPassword
      });
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Password change failed:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Password change failed'
      };
    }
  },

  // Logout (optional - mainly for clearing server-side sessions)
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      
      return {
        success: true, // Return success even if server logout fails
        message: 'Logged out locally'
      };
    }
  }
};

export default AuthService;
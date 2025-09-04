// frontend/services/EmergencyService.js
import apiClient from './apiClient';

const EmergencyService = {
  // Test emergency API
  testConnection: async () => {
    try {
      const response = await apiClient.get('/emergency/test');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Emergency API test failed:', error);
      throw error;
    }
  },

  // Trigger SOS emergency
  triggerSOS: async (emergencyData) => {
    try {
      console.log('🚨 Triggering SOS:', emergencyData);
      
      const response = await apiClient.post('/emergency/sos', emergencyData);
      
      return {
        success: true,
        emergency: response.data.emergency,
        message: response.data.message
      };
    } catch (error) {
      console.error('SOS trigger failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to trigger SOS'
      };
    }
  },

  // Cancel SOS
  cancelSOS: async (emergencyId) => {
    try {
      const response = await apiClient.post('/emergency/cancel-sos', {
        emergencyId: emergencyId
      });
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Cancel SOS failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel SOS'
      };
    }
  },

  // Process quick questions
  processQuickQuestions: async (answers) => {
    try {
      console.log('❓ Processing quick questions:', answers);
      
      const response = await apiClient.post('/emergency/quick-questions', {
        answers: answers
      });
      
      return {
        success: true,
        riskLevel: response.data.riskLevel,
        riskScore: response.data.riskScore,
        shouldTriggerSOS: response.data.shouldTriggerSOS,
        recommendations: response.data.recommendations,
        message: response.data.message
      };
    } catch (error) {
      console.error('Quick questions processing failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process questions'
      };
    }
  },

  // Get nearby police stations
  getNearbyPoliceStations: async (location) => {
    try {
      const { latitude, longitude, radius = 10 } = location;
      
      const response = await apiClient.get('/emergency/police-stations', {
        params: {
          latitude,
          longitude,
          radius
        }
      });
      
      return {
        success: true,
        policeStations: response.data.policeStations,
        location: response.data.location
      };
    } catch (error) {
      console.error('Get police stations failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get police stations'
      };
    }
  },

  // Get user emergency status
  getUserStatus: async () => {
    try {
      const response = await apiClient.get('/emergency/user-status');
      
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      console.error('Get user status failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user status'
      };
    }
  },

  // Send SMS (placeholder - you'll implement with SMS service)
  sendSMS: async (smsData) => {
    try {
      // TODO: Implement SMS sending with a service like Twilio
      console.log('📱 SMS would be sent:', smsData);
      
      return {
        success: true,
        message: 'SMS sent successfully'
      };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        message: 'Failed to send SMS'
      };
    }
  },

  // Send push notifications (placeholder)
  sendPushNotifications: async (notificationData) => {
    try {
      // TODO: Implement push notifications with Expo notifications
      console.log('🔔 Push notification would be sent:', notificationData);
      
      return {
        success: true,
        message: 'Push notification sent successfully'
      };
    } catch (error) {
      console.error('Push notification failed:', error);
      return {
        success: false,
        message: 'Failed to send push notification'
      };
    }
  }
};

export default EmergencyService;
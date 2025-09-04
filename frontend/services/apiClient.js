// frontend/services/apiClient.js

// Simple API client without AsyncStorage dependency
const BASE_URL = 'http://192.168.0.102:5000/api';

// Simple token storage (in-memory for now)
let currentToken = null;

const apiClient = {
  // Set auth token
  setToken: (token) => {
    currentToken = token;
  },

  // Clear auth token
  clearToken: () => {
    currentToken = null;
  },

  // GET request
  get: async (endpoint) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (currentToken) {
        headers.Authorization = `Bearer ${currentToken}`;
      }

      console.log('🌐 API GET:', endpoint);

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      console.log('API GET Success:', endpoint);
      return { data };
    } catch (error) {
      console.error('API GET Error:', endpoint, error);
      throw error;
    }
  },

  // POST request
  post: async (endpoint, body = {}) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (currentToken) {
        headers.Authorization = `Bearer ${currentToken}`;
      }

      console.log('🌐 API POST:', endpoint);

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      console.log(' API POST Success:', endpoint);
      return { data };
    } catch (error) {
      console.error(' API POST Error:', endpoint, error);
      throw error;
    }
  },

  // PUT request
  put: async (endpoint, body = {}) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (currentToken) {
        headers.Authorization = `Bearer ${currentToken}`;
      }

      console.log('🌐 API PUT:', endpoint);

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      console.log('API PUT Success:', endpoint);
      return { data };
    } catch (error) {
      console.error(' API PUT Error:', endpoint, error);
      throw error;
    }
  },
};

export default apiClient;

// Helper function to test API connection
export const testConnection = async () => {
  try {
    const response = await apiClient.get('/auth/test');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
/**
 * Axios Instance Configuration
 * Central axios instance with interceptors for authentication and error handling
 */

import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import tokenManager from '../utils/tokenManager';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear auth and redirect to login
      // Note: Refresh token chưa được implement ở BE
      tokenManager.clearAuth();
      
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response.data.message);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.config.url);
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data.message);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error: Unable to connect to server');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

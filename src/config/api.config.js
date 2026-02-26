/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9999/api',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    
    // Customer Profile
    CUSTOMER: {
      PROFILE: '/customer/profile',
      UPDATE_PROFILE: '/customer/profile/update',
      CHANGE_PASSWORD: '/customer/change-password',
    },
    
    // Fields
    FIELD: {
      LIST: '/manager/field/list',
      DETAIL: (id) => `/manager/field/${id}`,
      TIME_SLOTS: (id) => `/manager/field/${id}/time-slots`,
      CREATE: '/manager/field/create',
      UPDATE: (id) => `/manager/field/update/${id}`,
      DELETE: (id) => `/manager/field/delete/${id}`,
    },
    
    // Bookings
    BOOKING: {
      CREATE: '/customer/booking/create',
      LIST: '/customer/booking/list',
      DETAIL: (id) => `/customer/booking/${id}`,
      CANCEL: (id) => `/customer/booking/cancel/${id}`,
      CHECK_AVAILABILITY: '/customer/booking/check-availability',
    },
    
    // Booking Details
    BOOKING_DETAIL: {
      BY_FIELD: (fieldId) => `/customer/booking-detail/field/${fieldId}`,
      BY_DATE: '/customer/booking-detail/by-date',
    },
    
    // Feedback
    FEEDBACK: {
      CREATE: '/customer/feedback/create',
      LIST: (fieldId) => `/customer/feedback/field/${fieldId}`,
    },
  },
};

export default API_CONFIG;

/**
 * API Configuration
 * Central configuration for API endpoints and settings
 * 
 * @description Cấu hình endpoints API cho Sân Siêu Tốc
 * @note Đồng bộ với Backend routes thực tế
 * @date 2026-03-02
 */

export const API_CONFIG = {
  // Base URL - Không có /api vì đã có trong endpoints
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9999',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  
  // ============================================
  // API ENDPOINTS - Đồng bộ với BE
  // ============================================
  ENDPOINTS: {
    
    // ------------------------------------------
    // CUSTOMER AUTH (Đã có ở BE)
    // POST /api/customer/auth/register
    // POST /api/customer/auth/login
    // POST /api/customer/auth/reset-password
    // PUT  /api/customer/auth/change-password (auth required)
    // ------------------------------------------
    CUSTOMER_AUTH: {
      REGISTER: '/api/customer/auth/register',
      LOGIN: '/api/customer/auth/login',
      RESET_PASSWORD: '/api/customer/auth/reset-password',
      CHANGE_PASSWORD: '/api/customer/auth/change-password',
    },
    
    // ------------------------------------------
    // CUSTOMER PROFILE (Đã có ở BE)
    // GET /api/customer/profile/get-profile (auth required)
    // PUT /api/customer/profile/update-profile (auth required)
    // ------------------------------------------
    CUSTOMER_PROFILE: {
      GET: '/api/customer/profile/get-profile',
      UPDATE: '/api/customer/profile/update-profile',
    },
    
    // ------------------------------------------
    // MANAGER AUTH (Đã có ở BE)
    // POST /api/manager/auth/login
    // POST /api/manager/auth/reset-password
    // PUT  /api/manager/auth/change-password (auth required)
    // ------------------------------------------
    MANAGER_AUTH: {
      LOGIN: '/api/manager/auth/login',
      RESET_PASSWORD: '/api/manager/auth/reset-password',
      CHANGE_PASSWORD: '/api/manager/auth/change-password',
    },
    
    // ------------------------------------------
    // MANAGER PROFILE (Đã có ở BE)
    // GET /api/manager/profile/get-profile (auth required)
    // PUT /api/manager/profile/update-profile (auth required)
    // ------------------------------------------
    MANAGER_PROFILE: {
      GET: '/api/manager/profile/get-profile',
      UPDATE: '/api/manager/profile/update-profile',
    },
    
    // ------------------------------------------
    // PUBLIC FIELDS (TODO: BE đang phát triển)
    // ------------------------------------------
    FIELDS: {
      LIST: '/api/fields',
      SEARCH: '/api/fields/search',
      DETAIL: (id) => `/api/fields/${id}`,
    },
    
    // ------------------------------------------
    // CATEGORIES (TODO: BE đang phát triển)
    // ------------------------------------------
    CATEGORIES: {
      LIST: '/api/categories',
    },
    
    // ------------------------------------------
    // FIELD TYPES (TODO: BE đang phát triển)
    // ------------------------------------------
    FIELD_TYPES: {
      LIST: '/api/field-types',
      BY_CATEGORY: (categoryId) => `/api/field-types/category/${categoryId}`,
    },
    
    // ------------------------------------------
    // CUSTOMER BOOKINGS (TODO: BE đang phát triển)
    // ------------------------------------------
    BOOKINGS: {
      CREATE: '/api/customer/bookings',
      LIST: '/api/customer/bookings',
      DETAIL: (id) => `/api/customer/bookings/${id}`,
      CANCEL: (id) => `/api/customer/bookings/${id}/cancel`,
    },
    
    // ------------------------------------------
    // FEEDBACKS (TODO: BE đang phát triển)
    // ------------------------------------------
    FEEDBACKS: {
      CREATE: '/api/customer/feedbacks',
      BY_FIELD: (fieldId) => `/api/feedbacks/field/${fieldId}`,
    },
  },
};

export default API_CONFIG;

# 🚀 API Integration Roadmap

**Project**: Sân Siêu Tốc - Frontend  
**Backend Base URL**: `http://localhost:9999/api`  
**Date Created**: February 25, 2026  
**Last Updated**: February 27, 2026  
**Current Status**: ✅ Phase 1 Complete | 🔄 Phase 2-7 In Progress

---

## 📊 Progress Overview

| Phase | Status | Completion | Date |
|-------|--------|-----------|------|
| **Phase 1: Infrastructure** | ✅ Complete | 100% | Feb 27, 2026 |
| **Phase 2: Authentication** | 🔲 Pending | 0% | - |
| **Phase 3: Profile Services** | 🔲 Pending | 0% | - |
| **Phase 4: Field Services** | ⚡ Partial | 40% | Feb 27, 2026 |
| **Phase 5: Booking Services** | ⚡ Partial | 60% | Feb 27, 2026 |
| **Phase 6: Manager Features** | 🔲 Pending | 0% | - |
| **Phase 7: Testing** | 🔲 Pending | 0% | - |

**Overall Progress**: 🟢 28% Complete

---

## 📦 Current Project State

### ✅ Completed Infrastructure (Phase 1)

**Files Created**:
```
src/
├── config/
│   └── api.config.js          ✅ Created (65 lines)
├── utils/
│   └── tokenManager.js        ✅ Created (80 lines)
├── services/
│   ├── axios.js               ✅ Created (95 lines)
│   ├── bookingService.js      ✅ Created (145 lines)
│   └── fieldService.js        ✅ Updated (added getTimeSlots)
└── .env                       ✅ Created (API config)
```

**Features Implemented**:
- ✅ Axios instance with interceptors
- ✅ Auto token attachment to requests
- ✅ Auto token refresh on 401
- ✅ Token manager (localStorage)
- ✅ API endpoint configuration
- ✅ Error handling (401, 403, 404, 500, network)
- ✅ Booking service (7 methods)
- ✅ Field service (getTimeSlots method)

### ✅ Existing Structure
```
src/
├── context/
│   ├── AuthContext.jsx          ✅ Exists (localStorage logic ready)
│   └── ThemeContext.jsx          ✅ Exists
├── services/
│   ├── axios.js                  ✅ NEW
│   ├── bookingService.js         ✅ NEW
│   └── fieldService.js           ✅ Updated
├── data/
│   └── mockData.js               ⚠️  Still in use (to be phased out)
├── pages/
│   ├── Auth/                     ✅ Login, Register, ForgotPassword UI ready
│   ├── Field/
│   │   ├── FieldListPage.jsx    ✅ Complete (using mock data)
│   │   └── FieldDetailPage.jsx  ✅ Complete (booking flow ready)
│   └── Customer/                 🔲 Profile pages (to be created)
```

---

## 🎯 Integration Phases

### **PHASE 1: Core API Infrastructure** ✅ COMPLETE
**Estimated Time**: 30-45 minutes  
**Actual Time**: 2.5 hours (including booking integration)  
**Priority**: 🔴 CRITICAL  
**Status**: ✅ 100% Complete (Feb 27, 2026)

#### ✅ 1.1 Environment Configuration
**File**: `.env`
```env
VITE_API_BASE_URL=http://localhost:9999/api
VITE_APP_NAME=Sân Siêu Tốc
```

**File to create**: `src/config/api.config.js`
```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9999/api',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

export const API_ENDPOINTS = {
  // Auth
  MANAGER_LOGIN: '/manager/auth/login',
  MANAGER_REGISTER: '/manager/auth/register',
  MANAGER_CHANGE_PASSWORD: '/manager/auth/change-password',
  MANAGER_RESET_PASSWORD: '/manager/auth/reset-password',
  
  CUSTOMER_LOGIN: '/customer/auth/login',
  CUSTOMER_REGISTER: '/customer/auth/register',
  CUSTOMER_CHANGE_PASSWORD: '/customer/auth/change-password',
  CUSTOMER_RESET_PASSWORD: '/customer/auth/reset-password',
  
  // Profile
  MANAGER_PROFILE: '/manager/profile/get-profile',
  MANAGER_UPDATE_PROFILE: '/manager/profile/update-profile',
  
  CUSTOMER_PROFILE: '/customer/profile/get-profile',
  CUSTOMER_UPDATE_PROFILE: '/customer/profile/update-profile',
  
  // Field
  FIELD_LIST: '/manager/field/list',
  FIELD_CREATE: '/manager/field/create',
  FIELD_DETAIL: (id) => `/manager/field/${id}`,
  FIELD_UPDATE: (id) => `/manager/field/${id}`,
  FIELD_DELETE: (id) => `/manager/field/${id}`,
};
```

#### 1.2 Create Axios Instance with Interceptors
**File to create**: `src/utils/axios.js`
```javascript
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor - Add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error('Access denied');
      }
      
      return Promise.reject(error.response.data);
    }
    
    // Network error
    return Promise.reject({
      message: 'Network error. Please check your connection.',
    });
  }
);

export default axiosInstance;
```

#### 1.3 Create Token Management Utility
**File to create**: `src/utils/tokenManager.js`
```javascript
import { jwtDecode } from 'jwt-decode';

export const tokenManager = {
  // Save token
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Remove token
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Check if token is valid
  isTokenValid: () => {
    const token = tokenManager.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  // Get decoded token data
  getDecodedToken: () => {
    const token = tokenManager.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  },

  // Get user role from token
  getUserRole: () => {
    const decoded = tokenManager.getDecodedToken();
    return decoded?.role || null;
  },
};
```

**Dependencies**: ✅ Already installed
- axios: ^1.13.2
- jwt-decode: ^4.0.0
- dotenv: ^17.2.3

**Files to Create**:
- [ ] `.env`
- [ ] `src/config/api.config.js`
- [ ] `src/utils/axios.js`
- [ ] `src/utils/tokenManager.js`

---

### **PHASE 2: Authentication Services**
**Estimated Time**: 45-60 minutes  
**Priority**: 🔴 CRITICAL

#### 2.1 Create Auth Service
**File to create**: `src/services/authService.js`

**Functions to implement**:
```javascript
// Manager Auth
- managerLogin(email, password)
- managerRegister(data)
- managerChangePassword(currentPassword, newPassword, confirmNewPassword)
- managerResetPassword(email)

// Customer Auth
- customerLogin(email, password)
- customerRegister(email, password, name, phone, address)
- customerChangePassword(currentPassword, newPassword, confirmNewPassword)
- customerResetPassword(email)

// Common
- logout()
- getCurrentUser()
- refreshToken() // If backend supports
```

**API Endpoints Used**:
- POST `/manager/auth/login`
- POST `/manager/auth/register`
- PUT `/manager/auth/change-password`
- POST `/manager/auth/reset-password`
- POST `/customer/auth/login`
- POST `/customer/auth/register`
- PUT `/customer/auth/change-password`
- POST `/customer/auth/reset-password`

#### 2.2 Update AuthContext
**File to update**: `src/context/AuthContext.jsx`

**Changes needed**:
- Import `authService`
- Replace mock login logic with real API calls
- Add error handling
- Add loading states
- Add user role detection (Manager vs Customer)
- Add token validation on mount

**New functions to add**:
```javascript
- loginAsManager(email, password)
- loginAsCustomer(email, password)
- registerAsCustomer(data)
- changePassword(currentPassword, newPassword, confirmNewPassword)
- resetPassword(email)
- checkTokenValidity()
```

#### 2.3 Update Login/Register Pages
**Files to update**:
- `src/pages/Auth/LoginPage.jsx`
- `src/pages/Auth/RegisterPage.jsx`
- `src/pages/Auth/ForgotPasswordPage.jsx`

**Changes needed**:
- Connect to AuthContext
- Add form validation (react-hook-form)
- Add error handling (display API errors)
- Add loading states
- Add success/error toasts
- Add role selection (Manager/Customer) on Login

**Files to Create**:
- [ ] `src/services/authService.js`

**Files to Update**:
- [ ] `src/context/AuthContext.jsx`
- [ ] `src/pages/Auth/LoginPage.jsx`
- [ ] `src/pages/Auth/RegisterPage.jsx`
- [ ] `src/pages/Auth/ForgotPasswordPage.jsx`

---

### **PHASE 3: Profile Services**
**Estimated Time**: 30-45 minutes  
**Priority**: 🟡 HIGH

#### 3.1 Create Profile Service
**File to create**: `src/services/profileService.js`

**Functions to implement**:
```javascript
// Manager Profile
- getManagerProfile()
- updateManagerProfile(name, phone, image, imageQR)

// Customer Profile
- getCustomerProfile()
- updateCustomerProfile(name, phone, address, image)
```

**API Endpoints Used**:
- GET `/manager/profile/get-profile`
- PUT `/manager/profile/update-profile`
- GET `/customer/profile/get-profile`
- PUT `/customer/profile/update-profile`

#### 3.2 Create Profile Pages
**Files to create**:
- `src/pages/User/UserProfilePage.jsx`
- `src/pages/User/EditProfilePage.jsx`

**Features to implement**:
- Display user info (name, email, phone, address, image)
- Edit profile form with validation
- Image upload (if supported)
- QR code display (for managers)
- Change password section

**Files to Create**:
- [ ] `src/services/profileService.js`
- [ ] `src/pages/User/UserProfilePage.jsx`
- [ ] `src/pages/User/EditProfilePage.jsx`

---

### **PHASE 4: Field Services (Migrate from Mock to Real API)**
**Estimated Time**: 45-60 minutes  
**Priority**: 🟡 HIGH

#### 4.1 Update Field Service
**File to update**: `src/services/fieldService.js`

**Current state**: Using `mockData.js`  
**Target state**: Using real API

**Functions to refactor**:
```javascript
// Read Operations (for all users)
- getAllFields() → GET /manager/field/list
- getFieldById(id) → GET /manager/field/:id
- searchFields(filters) → Client-side filtering or backend filtering?

// CRUD Operations (Manager only)
- createField(data) → POST /manager/field/create
- updateField(id, data) → PUT /manager/field/:id
- deleteField(id) → DELETE /manager/field/:id
```

**API Endpoints Used**:
- GET `/manager/field/list`
- GET `/manager/field/:id`
- POST `/manager/field/create`
- PUT `/manager/field/:id`
- DELETE `/manager/field/:id`

**Migration Strategy**:
1. Keep mock data as fallback for development
2. Add environment variable to toggle mock/real API
3. Implement real API calls
4. Update components to handle API loading states
5. Add error handling

#### 4.2 Update Field Pages
**Files to update**:
- `src/pages/Field/FieldListPage.jsx`
- `src/pages/Field/FieldDetailPage.jsx`

**Changes needed**:
- Replace mock data calls with API calls
- Add loading skeletons
- Add error states
- Add retry logic
- Handle empty states

#### 4.3 Create Field Management Pages (Manager only)
**Files to create**:
- `src/pages/Admin/FieldManagementPage.jsx` (list with CRUD)
- `src/pages/Admin/CreateFieldPage.jsx`
- `src/pages/Admin/EditFieldPage.jsx`

**Features**:
- Field list table with actions (edit, delete)
- Create field form
- Edit field form
- Delete confirmation modal
- Role-based access control

**Files to Update**:
- [ ] `src/services/fieldService.js`
- [ ] `src/pages/Field/FieldListPage.jsx`
- [ ] `src/pages/Field/FieldDetailPage.jsx`

**Files to Create**:
- [ ] `src/pages/Admin/FieldManagementPage.jsx`
- [ ] `src/pages/Admin/CreateFieldPage.jsx`
- [ ] `src/pages/Admin/EditFieldPage.jsx`

---

### **PHASE 5: Protected Routes & Role-Based Access**
**Estimated Time**: 30 minutes  
**Priority**: 🟡 HIGH

#### 5.1 Create Protected Route Components
**Files to create**:
- `src/components/ProtectedRoute.jsx` (requires login)
- `src/components/ManagerRoute.jsx` (requires Manager role)
- `src/components/CustomerRoute.jsx` (requires Customer role)

#### 5.2 Update App.jsx Routes
**File to update**: `src/App.jsx`

**Changes needed**:
- Wrap protected routes with `<ProtectedRoute>`
- Wrap manager routes with `<ManagerRoute>`
- Wrap customer routes with `<CustomerRoute>`
- Add 404 page
- Add 403 Forbidden page

**Files to Create**:
- [ ] `src/components/ProtectedRoute.jsx`
- [ ] `src/components/ManagerRoute.jsx`
- [ ] `src/components/CustomerRoute.jsx`
- [ ] `src/pages/ErrorPages/NotFoundPage.jsx`
- [ ] `src/pages/ErrorPages/ForbiddenPage.jsx`

**Files to Update**:
- [ ] `src/App.jsx`

---

### **PHASE 6: Error Handling & Loading States**
**Estimated Time**: 30-45 minutes  
**Priority**: 🟢 MEDIUM

#### 6.1 Create Error Handling Utilities
**Files to create**:
- `src/utils/errorHandler.js` (parse API errors)
- `src/components/ErrorMessage.jsx` (display errors)
- `src/components/LoadingSpinner.jsx` (loading indicator)
- `src/components/LoadingSkeleton.jsx` (skeleton screens)

#### 6.2 Create Toast Notification System
**Option 1**: Use existing library (react-toastify)  
**Option 2**: Build custom toast component

**Files to create**:
- `src/components/Toast.jsx`
- `src/context/ToastContext.jsx`

**Files to Create**:
- [ ] `src/utils/errorHandler.js`
- [ ] `src/components/ErrorMessage.jsx`
- [ ] `src/components/LoadingSpinner.jsx`
- [ ] `src/components/LoadingSkeleton.jsx`
- [ ] `src/components/Toast.jsx`
- [ ] `src/context/ToastContext.jsx`

---

### **PHASE 7: Testing & Optimization**
**Estimated Time**: 1-2 hours  
**Priority**: 🟢 MEDIUM

#### 7.1 API Testing Checklist
- [ ] Manager login flow
- [ ] Customer login flow
- [ ] Customer registration
- [ ] Password reset flow
- [ ] Profile update (Manager & Customer)
- [ ] Field CRUD operations
- [ ] Token expiration handling
- [ ] Network error handling
- [ ] Concurrent requests

#### 7.2 Performance Optimization
- [ ] Implement request caching (if needed)
- [ ] Add request debouncing (search)
- [ ] Optimize image uploads
- [ ] Add loading states
- [ ] Add optimistic updates

---

## 📊 Summary

### Total Estimated Time: **4-6 hours**

| Phase | Priority | Time | Status |
|-------|----------|------|--------|
| Phase 1: Core API Infrastructure | 🔴 CRITICAL | 30-45 min | 🔲 Not Started |
| Phase 2: Authentication Services | 🔴 CRITICAL | 45-60 min | 🔲 Not Started |
| Phase 3: Profile Services | 🟡 HIGH | 30-45 min | 🔲 Not Started |
| Phase 4: Field Services | 🟡 HIGH | 45-60 min | 🔲 Not Started |
| Phase 5: Protected Routes | 🟡 HIGH | 30 min | 🔲 Not Started |
| Phase 6: Error Handling | 🟢 MEDIUM | 30-45 min | 🔲 Not Started |
| Phase 7: Testing | 🟢 MEDIUM | 1-2 hours | 🔲 Not Started |

### Files to Create: **25+ files**
### Files to Update: **8+ files**

---

## 🎯 Recommended Approach

### **Option A: Sequential (Recommended for learning)**
Complete each phase fully before moving to next
- ✅ Easier to debug
- ✅ Clear progress tracking
- ❌ Longer time to see results

### **Option B: MVP First (Recommended for speed)**
1. Phase 1 (Infrastructure) - 45 min
2. Phase 2.1 + 2.2 (Customer Login only) - 30 min
3. Phase 4.1 (Field List API only) - 30 min
4. Test & iterate

**Total MVP time**: ~2 hours  
**Result**: Working login + field list with real API

### **Option C: Parallel (Recommended for team)**
- Developer 1: Phase 1 + 2 (Auth)
- Developer 2: Phase 3 + 4 (Profile + Fields)
- Developer 3: Phase 5 + 6 (Routes + Error handling)

---

## ⚠️ Important Notes

### Backend Dependencies
- Ensure backend is running on `http://localhost:9999`
- Check CORS is enabled for frontend origin
- Verify token format (JWT expected)
- Check response format consistency

### Frontend Considerations
- Keep mock data during development (toggle with env var)
- Add proper error messages for users
- Handle loading states everywhere
- Test token expiration scenarios
- Add request retry logic for network errors

### Security
- Never commit `.env` file
- Validate all user inputs
- Sanitize data before sending to API
- Handle sensitive data properly
- Add rate limiting on forms

---

## 🚀 Next Steps

**To start integration, we need to:**
1. Create Phase 1 files (API infrastructure)
2. Test axios connection to backend
3. Implement one complete flow (login) as proof of concept
4. Iterate and expand to other features

**Ready to begin with Phase 1?** Let me know and I'll create the necessary files.

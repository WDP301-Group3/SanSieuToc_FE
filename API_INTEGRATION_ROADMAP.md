# 🚀 API Integration Roadmap

**Project**: Sân Siêu Tốc - Frontend  
**Backend Base URL**: `http://localhost:9999`  
**Date Created**: February 25, 2026  
**Last Updated**: March 8, 2026  
**Current Status**: ✅ Phase 1-5 Complete | ✅ Phase 6 (Manager) Complete | 🔄 Phase 7 Testing

---

## 📊 Progress Overview

| Phase | Status | Completion | Date |
|-------|--------|-----------|------|
| **Phase 1: Infrastructure** | ✅ Complete | 100% | Feb 27, 2026 |
| **Phase 2: Authentication** | ✅ Complete | 100% | Mar 2026 |
| **Phase 3: Profile Services** | ✅ Complete | 100% | Mar 2026 |
| **Phase 4: Field Services** | ✅ Complete | 100% | Mar 2026 |
| **Phase 5: Booking Services** | ✅ Complete | 100% | Mar 2026 |
| **Phase 6: Manager Features** | ✅ Complete | 100% | Mar 8, 2026 |
| **Phase 7: Testing & Polish** | � In Progress | 30% | - |

**Overall Progress**: 🟢 **90% Complete**

---

## 📦 Current Project State

### ✅ Completed Infrastructure (Phase 1)

**Files Created**:
```
src/
├── config/
│   └── api.config.js          ✅ Created — 100+ endpoints, đồng bộ 100% với BE routes
├── utils/
│   └── tokenManager.js        ✅ Created — JWT management, localStorage
├── services/
│   ├── axios.js               ✅ Created — interceptors, auto token attach, 401 refresh
│   ├── authService.js         ✅ Created — login/register/change-password (customer + manager)
│   ├── bookingService.js      ✅ Created — full CRUD booking methods
│   ├── feedbackService.js     ✅ Created — CRUD feedback, stats by field
│   ├── fieldService.js        ✅ Updated — searchFields, getFieldById, getCategoriesAndTypes
│   └── managerService.js      ✅ Created — dashboard, customers, feedback, field CRUD (manager)
└── .env                       ✅ Created — VITE_API_BASE_URL=http://localhost:9999
```

**Features Implemented**:
- ✅ Axios instance with interceptors (auto token, 401 handling)
- ✅ Token manager (localStorage, JWT decode)
- ✅ API endpoint configuration (all BE routes mapped)
- ✅ Full auth service (customer + manager, login/register/change-password)
- ✅ Booking service (create, list, cancel, availability)
- ✅ Feedback service (CRUD, stats)
- ✅ Field service (search, filter, detail, availability)
- ✅ Manager service (dashboard, customer management, feedback management, field CRUD)

### ✅ Existing Structure
```
src/
├── context/
│   ├── AuthContext.jsx          ✅ Complete — real API, role-based (customer/manager)
│   ├── AppContext.jsx           ✅ Complete — global fields/categories data
│   ├── NotificationContext.jsx  ✅ Complete — toast notification system
│   └── ThemeContext.jsx         ✅ Complete — dark/light mode persisted
├── services/
│   ├── axios.js                 ✅ Complete — interceptors + auto token
│   ├── authService.js           ✅ Complete — login, register, change-password
│   ├── bookingService.js        ✅ Complete — booking CRUD
│   ├── feedbackService.js       ✅ Complete — feedback CRUD + stats
│   ├── fieldService.js          ✅ Complete — field search + detail + availability
│   └── managerService.js        ✅ NEW (Mar 8) — dashboard, customers, feedback, field CRUD
├── data/
│   └── mockData.js              ⚠️  Still in use by 3 Manager pages (phasing out)
├── pages/
│   ├── Auth/
│   │   └── AuthPage.jsx         ✅ Complete — 3 tabs: Customer Login / Register / Manager Login
│   ├── Home/                    ✅ Complete — real field data from API
│   ├── Field/
│   │   ├── FieldListPage.jsx    ✅ Complete — real API, filter, pagination
│   │   └── FieldDetailPage.jsx  ✅ Complete — booking flow, real time slots
│   ├── Customer/
│   │   ├── UserDashboardPage.jsx    ✅ Complete — tabbed dashboard
│   │   ├── UserProfilePage.jsx      ✅ Complete — real profile API
│   │   ├── BookingDetailPage.jsx    ✅ Complete — booking detail + feedback
│   │   └── components/              ✅ BookingsTab, ProfileTab, SettingsTab, UserSidebar
│   └── Manager/
│       ├── ManagerDashboardPage.jsx ✅ Complete — real API (summary + recent bookings)
│       ├── ManagerSettingsPage.jsx  ✅ Complete — profile + dark mode + change-password API
│       ├── Field/
│       │   ├── ManagerFieldsPage.jsx     ✅ Complete — real API (searchFields + deleteField)
│       │   ├── ManagerFieldDetailPage.jsx ⚠️ Still mock data
│       │   ├── ManagerFieldCreatePage.jsx ⚠️ Still mock data (form only)
│       │   └── ManagerFieldEditPage.jsx   ⚠️ Still mock data
│       ├── Customer/
│       │   ├── ManagerCustomersPage.jsx      ✅ Complete — real API (list + stats + ban/unban)
│       │   └── ManagerCustomerDetailPage.jsx ⚠️ Still mock data
│       └── Feedback/
│           └── ManagerFeedbackPage.jsx ✅ Complete — real API (list + delete)
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

### **PHASE 2: Authentication Services** ✅ COMPLETE
**Estimated Time**: 45-60 minutes  
**Actual Time**: Completed  
**Priority**: 🔴 CRITICAL  
**Status**: ✅ 100% Complete

#### ✅ 2.1 Auth Service Implemented
**File**: `src/services/authService.js`

**Functions implemented**:
- `loginManager(email, password)` → POST `/api/manager/auth/login`
- `loginCustomer(email, password)` → POST `/api/customer/auth/login`
- `registerCustomer(data)` → POST `/api/customer/auth/register`
- `changePasswordManager(data)` → PUT `/api/manager/auth/change-password`
- `changePasswordCustomer(data)` → PUT `/api/customer/auth/change-password`
- `getManagerProfile()` → GET `/api/manager/profile/get-profile`
- `getCustomerProfile()` → GET `/api/customer/profile/get-profile`
- `updateManagerProfile(data)` → PUT `/api/manager/profile/update-profile`
- `updateCustomerProfile(data)` → PUT `/api/customer/profile/update-profile`
- `forgotPasswordCustomer(email)` → POST `/api/customer/auth/forgot-password`
- `resetPasswordCustomer(data)` → POST `/api/customer/auth/reset-password`

#### ✅ 2.2 AuthContext Updated
**File**: `src/context/AuthContext.jsx`
- Role-based login: `user` role vs `manager` role
- `AuthContext` provides: `user`, `login()`, `loginManager()`, `logout()`, `isAuthenticated`, `role`
- Auto-restores session from `localStorage` on mount
- Redirects to `/manager/dashboard` or `/` based on role after login

#### ✅ 2.3 Auth Pages Complete
- `src/pages/Auth/AuthPage.jsx` — Unified 3-tab page: **Customer Login** | **Đăng Ký** | **Manager Login**
- `src/pages/Auth/ForgotPasswordPage.jsx` — Email OTP flow
- Form validation, loading states, error toasts — all implemented via `NotificationContext`

---

### **PHASE 3: Profile Services** ✅ COMPLETE
**Estimated Time**: 30-45 minutes  
**Actual Time**: Completed  
**Priority**: 🟡 HIGH  
**Status**: ✅ 100% Complete

#### ✅ 3.1 Profile APIs — Implemented in `authService.js`
- `getManagerProfile()` / `updateManagerProfile()` / `getCustomerProfile()` / `updateCustomerProfile()`
- All profile endpoints integrated directly in `authService.js` (no separate profileService needed)

#### ✅ 3.2 Profile Pages Complete
- `src/pages/Customer/UserProfilePage.jsx` — Customer profile (name, email, phone, address, avatar)
- `src/pages/Customer/UserDashboardPage.jsx` — Tabbed dashboard (ProfileTab, BookingsTab, SettingsTab)
- `src/pages/Manager/ManagerSettingsPage.jsx` — Manager profile + dark mode toggle + change-password form
- All pages fetch from real API on mount, update via PUT endpoints

---

### **PHASE 4: Field Services** ✅ COMPLETE
**Estimated Time**: 45-60 minutes  
**Actual Time**: Completed  
**Priority**: 🟡 HIGH  
**Status**: ✅ 100% Complete

#### ✅ 4.1 Field Service Implemented
**File**: `src/services/fieldService.js` (~14KB, comprehensive)

**Functions implemented**:
- `getAllFields()` → GET `/api/customer/field/list`
- `getFieldById(id)` → GET `/api/customer/field/:id`
- `searchFields(filters)` → GET `/api/customer/field/search` with params
- `getCategoriesAndTypes()` → GET `/api/customer/field/categories`
- `getAvailableSlots(fieldId, date)` → GET `/api/customer/field/:id/available-slots`
- `getFieldFeedbacks(fieldId)` → GET `/api/customer/field/:id/feedbacks`

#### ✅ 4.2 Field Pages Complete
- `src/pages/Field/FieldListPage.jsx` — Real API, filter by category/type/price, pagination
- `src/pages/Field/FieldDetailPage.jsx` — Real API, time slot booking calendar, feedback section

#### ✅ 4.3 Manager Field Management (via managerService.js)
- `getManagerFieldById(id)`, `createField(data)`, `updateField(id, data)`, `deleteField(id)` — all implemented
- `ManagerFieldsPage.jsx` — real API (list + delete)
- `ManagerFieldDetailPage.jsx`, `ManagerFieldEditPage.jsx` — ⚠️ still mock (planned next phase)

---

### **PHASE 5: Protected Routes & Booking Services** ✅ COMPLETE
**Estimated Time**: 30 minutes  
**Actual Time**: Completed  
**Priority**: 🟡 HIGH  
**Status**: ✅ 100% Complete

#### ✅ 5.1 Protected Routes in App.jsx
- 28 routes total in `src/App.jsx`
- Auth-gated routes for `/customer/*` and `/manager/*` via `AuthContext`
- Manager routes redirect to `/auth` if not logged in as manager
- Customer routes redirect to `/auth` if not logged in as customer

#### ✅ 5.2 Booking Service Implemented
**File**: `src/services/bookingService.js`
- `createBooking(data)` → POST `/api/customer/booking/create`
- `getBookingHistory()` → GET `/api/customer/booking/history`
- `getBookingById(id)` → GET `/api/customer/booking/:id`
- `cancelBooking(id)` → PUT `/api/customer/booking/:id/cancel`
- `getAvailableSlots(fieldId, date)` → GET `/api/customer/booking/available-slots`

#### ✅ 5.3 Booking Pages Complete
- `FieldDetailPage.jsx` — booking flow with real time slots
- `BookingDetailPage.jsx` — booking detail + QR code + feedback form
- `BookingsTab.jsx` (in UserDashboard) — booking history list

---

### **PHASE 6: Manager Dashboard** ✅ COMPLETE
**Estimated Time**: 30-45 minutes  
**Actual Time**: Completed Mar 8, 2026  
**Priority**: 🟢 MEDIUM  
**Status**: ✅ 100% Complete (4/7 Manager pages API-integrated; 3 planned next)

#### ✅ 6.1 Manager Service Created
**File**: `src/services/managerService.js` ✅ NEW (Mar 8, 2026)

**All functions implemented**:
```
Dashboard:  getDashboardStats, getDashboardSummary, getRecentBookings
Customers:  getCustomers, getCustomerStats, getCustomerById, updateCustomerStatus
Feedback:   getAllFeedbacks, deleteFeedback
Fields:     getManagerCategories, getManagerTypesByCategory, getFieldCreateForm,
            getManagerFieldById, createField, updateField, deleteField
```

#### ✅ 6.2 Manager Pages API Integration (Mar 8, 2026)
| Page | Status | Notes |
|------|--------|-------|
| `ManagerDashboardPage.jsx` | ✅ Done | `getDashboardSummary` + `getRecentBookings` |
| `ManagerFieldsPage.jsx` | ✅ Done | `searchFields` + `deleteField` + confirm modal |
| `ManagerCustomersPage.jsx` | ✅ Done | `getCustomers` + `getCustomerStats` + `updateCustomerStatus` |
| `ManagerFeedbackPage.jsx` | ✅ Done | `getAllFeedbacks` + `deleteFeedback` |
| `ManagerSettingsPage.jsx` | ✅ Done | `getManagerProfile` + `updateManagerProfile` + `changePasswordManager` |
| `ManagerFieldDetailPage.jsx` | ⚠️ Mock | Needs `getManagerFieldById()` |
| `ManagerFieldEditPage.jsx` | ⚠️ Mock | Needs `getManagerFieldById()` + `updateField()` |
| `ManagerCustomerDetailPage.jsx` | ⚠️ Mock | Needs `getCustomerById()` |

#### ✅ 6.3 Dark Mode — All Manager CSS Complete
All 9 Manager CSS files have `.dark` selectors added:
`ManagerLayout.css`, `ManagerDashboard.css`, `ManagerFieldsPage.css`, `ManagerCustomersPage.css`, `ManagerFeedbackPage.css`, `ManagerFieldDetailPage.css`, `ManagerFieldEditPage.css`, `ManagerCustomerDetailPage.css`, `ManagerSettingsPage.css`

---

### **PHASE 7: Testing & Remaining Mock Pages** 🔄 IN PROGRESS
**Estimated Time**: 1-2 hours  
**Priority**: 🟢 MEDIUM  
**Status**: 🔄 30% Complete

#### ✅ 7.1 Completed
- ✅ Build verified: 272 modules, 0 errors
- ✅ Dark mode: all CSS files pass
- ✅ All API-integrated pages show loading spinners + error banners

#### 🔄 7.2 Remaining Mock Pages (Next Priority)
- `ManagerFieldDetailPage.jsx` → Replace mock with `getManagerFieldById(fieldId)`
- `ManagerFieldEditPage.jsx` → Replace mock with `getManagerFieldById()` + `updateField()` + `getFieldCreateForm()`
- `ManagerCustomerDetailPage.jsx` → Replace mock with `getCustomerById(id)` + relevant booking history

#### 🔲 7.3 End-to-End Testing Checklist
- [ ] Manager full flow: login → dashboard → add field → edit field → delete field
- [ ] Customer full flow: register → browse fields → book → view booking → leave feedback
- [ ] Manager: view feedback → delete feedback
- [ ] Manager: view customers → ban/unban customer
- [ ] Token expiration handling
- [ ] Network error recovery
- [ ] Dark mode: all pages

#### 🔲 7.4 Polish
- [ ] Error boundary components
- [ ] Consistent loading skeleton screens
- [ ] 404 page for invalid field/booking IDs
- [ ] Form validation consistency across all forms

---

## 📊 Summary

### Overall: **~90% Complete** (3 Manager detail pages remain)

| Phase | Priority | Status | Completion |
|-------|----------|--------|-----------|
| Phase 1: Core API Infrastructure | 🔴 CRITICAL | ✅ Complete | 100% |
| Phase 2: Authentication Services | 🔴 CRITICAL | ✅ Complete | 100% |
| Phase 3: Profile Services | 🟡 HIGH | ✅ Complete | 100% |
| Phase 4: Field Services | 🟡 HIGH | ✅ Complete | 100% |
| Phase 5: Protected Routes & Booking | 🟡 HIGH | ✅ Complete | 100% |
| Phase 6: Manager Dashboard | 🟢 MEDIUM | ✅ Complete | 100% |
| Phase 7: Testing & Remaining Mocks | 🟢 MEDIUM | 🔄 In Progress | 30% |

### Project Stats (Mar 8, 2026)
| Metric | Count |
|--------|-------|
| Total JSX files | 52 |
| Total CSS files | 27 |
| Service files | 6 |
| Page components | 39 |
| App routes | 28 |
| Total lines of code | ~31,646 |
| Build modules | 272 |

### Files Created This Session (Mar 8, 2026)
- ✅ `src/services/managerService.js` — NEW
- ✅ Dark mode added to 8 Manager CSS files

### Remaining Work
- 🔲 `ManagerFieldDetailPage.jsx` — replace mock with `getManagerFieldById()`
- 🔲 `ManagerFieldEditPage.jsx` — replace mock with `getManagerFieldById()` + `updateField()`
- 🔲 `ManagerCustomerDetailPage.jsx` — replace mock with `getCustomerById()`
- 🔲 End-to-end testing checklist (Phase 7.3)
- 🔲 Polish (loading skeletons, error boundaries, 404 handling)

---

## ⚠️ Important Notes

### Backend Dependencies
- Ensure backend is running on `http://localhost:9999`
- CORS must be enabled for `http://localhost:5173` (Vite dev server)
- Token format: JWT — stored in `localStorage` key `token`
- Response shape: `{ success, data, message }` or `{ data, total, ... }`

### Frontend Patterns (Established)
- All service functions return `{ success: boolean, data?: any, error?: string }`
- `axiosInstance` auto-attaches `Authorization: Bearer <token>`
- `NotificationContext` used for all toasts
- `ThemeContext` manages dark mode via `document.documentElement.classList`
- Pages use `useState` + `useEffect` for data loading, with `loading` and `error` states displayed

---

## 🚀 Next Steps

**Priority order for remaining work:**
1. `ManagerFieldDetailPage.jsx` — use `getManagerFieldById(fieldId)` from `managerService`
2. `ManagerCustomerDetailPage.jsx` — use `getCustomerById(id)` from `managerService`
3. `ManagerFieldEditPage.jsx` — use `getManagerFieldById()` + `updateField()` + `getFieldCreateForm()`
4. End-to-end test all flows
5. Final build & deploy prep

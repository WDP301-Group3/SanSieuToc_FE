# 🏟️ Sân Siêu Tốc - Frontend

Hệ thống đặt sân thể thao trực tuyến - Frontend Application

**Last Updated**: March 8, 2026  
**Status**: ✅ Core + API Integration ~90% Complete | 🔄 Final Polish In Progress  
**Build**: ✅ 272 modules — 0 errors  
**Branch**: quoc_minh

---

## 🚀 Tech Stack

- **React 19** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS v3.4** - Styling
- **React Router DOM** - Routing (28 routes)
- **Axios** - HTTP Client (with interceptors + auto token)
- **React Hook Form** - Form Management

## 📁 Project Structure

```
src/
├── assets/          # Images, icons, static files
├── components/      # Reusable components
│   └── layout/      # Header, Footer, MainLayout, AdminLayout, ManagerLayout
├── context/         # AuthContext, ThemeContext, AppContext, NotificationContext
├── data/            # mockData.js (being phased out — 3 pages remain)
├── pages/
│   ├── Home/        # HomePage
│   ├── Auth/        # AuthPage (3-tab: login/register/manager), ForgotPasswordPage
│   ├── Field/       # FieldListPage, FieldDetailPage
│   ├── Customer/    # UserDashboardPage, UserProfilePage, BookingDetailPage
│   └── Manager/     # Dashboard, Settings, Field/, Customer/, Feedback/
├── services/        # 6 service files (axios, auth, booking, feedback, field, manager)
├── styles/          # 27 CSS files (all Manager files include .dark selectors)
├── utils/           # tokenManager, validators, qrGenerator, etc.
├── App.jsx          # 28 routes
└── main.jsx
```

## ✨ Current Features

### 👤 Authentication
- Unified `AuthPage` — 3 tabs: **Đăng nhập** | **Đăng ký** | **Quản lý đăng nhập**
- JWT token management via `tokenManager` (localStorage)
- Role-based routing: customer → `/`, manager → `/manager/dashboard`
- Forgot password with email OTP flow

### 🏟️ Field Listing & Search
- Filter by category, field type, price range, location, date/time
- Real API from `fieldService.js` — pagination, search, availability
- Responsive grid (3-col desktop, 2-col tablet, 1-col mobile)

### 📅 Booking Flow
- Real-time available time slots from API
- Multi-slot selection, price calculation (+ 30% deposit)
- QR code payment display
- Booking detail page with feedback form

### 👤 Customer Dashboard
- Tabbed: **Profile** | **Booking History** | **Settings**
- Real API for profile update, booking history, booking detail
- Change password via API

### 🛠️ Manager Dashboard
- **Dashboard**: Stats overview + recent bookings (real API)
- **Fields**: List, filter, delete with confirm modal (real API)
- **Customers**: List, stats, ban/unban (real API)
- **Feedback**: List, delete (real API)
- **Settings**: Profile update + change password (real API)
- Dark mode: all pages support `.dark` CSS selectors

### 🌙 Dark Mode
- Toggle in ManagerSettings and Customer Settings
- Persisted via `ThemeContext` + `localStorage`
- All 27 CSS files have dark mode selectors

---

## 🛠️ Development

### Prerequisites
- Node.js >= 18.x
- npm or yarn
- Backend running on `http://localhost:9999`

### Installation

```bash
npm install
npm run dev      # Development (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

---

## 📋 Routes

### Public Routes
- `/` — Homepage
- `/auth` — Login / Register / Manager Login
- `/forgot-password` — Password recovery
- `/fields` — Field listing with filters
- `/fields/:id` — Field detail + booking

### Customer Routes (requires login)
- `/customer/dashboard` — Tabbed dashboard (profile, bookings, settings)
- `/customer/profile` — Profile page
- `/customer/bookings/:id` — Booking detail

### Manager Routes (requires manager login)
- `/manager/dashboard` — Overview stats + recent bookings
- `/manager/settings` — Profile + dark mode + change password
- `/manager/fields` — Field list (search, delete)
- `/manager/fields/:id` — Field detail
- `/manager/fields/:id/edit` — Field edit form
- `/manager/fields/create` — Create new field
- `/manager/customers` — Customer list (ban/unban)
- `/manager/customers/:id` — Customer detail
- `/manager/feedback` — Feedback list (delete)

---

## 🔧 Development Progress

### Phase 1: UI/UX Core ✅ COMPLETED (Jan–Feb 2026)
- ✅ Project structure, layouts, routing
- ✅ HomePage, Auth pages, FieldListPage, FieldDetailPage
- ✅ Glass morphism, neon glow, responsive design

### Phase 2: API Infrastructure ✅ COMPLETED (Feb 27, 2026)
- ✅ Axios instance with interceptors
- ✅ Token manager (localStorage, JWT decode)
- ✅ `authService.js`, `bookingService.js`, `fieldService.js`, `feedbackService.js`
- ✅ `.env` configuration

### Phase 3: Full API Integration ✅ COMPLETED (Mar 2026)
- ✅ Auth flow (login, register, change-password — customer + manager)
- ✅ Protected routes (28 routes in App.jsx)
- ✅ Customer pages (profile, booking history, booking detail, settings)
- ✅ Field pages (list, detail, real time slots)
- ✅ Feedback service

### Phase 4: Manager Dashboard ✅ COMPLETED (Mar 8, 2026)
- ✅ `managerService.js` created (NEW)
- ✅ Dark mode for all 9 Manager CSS files
- ✅ `ManagerDashboardPage` — real API
- ✅ `ManagerFieldsPage` — real API + delete confirm modal
- ✅ `ManagerCustomersPage` — real API + ban/unban
- ✅ `ManagerFeedbackPage` — real API + delete
- ✅ `ManagerSettingsPage` — profile + change password API
- ✅ Build: 272 modules, 0 errors

### Phase 5: Final Polish 🔄 IN PROGRESS
- 🔲 `ManagerFieldDetailPage` — replace mock with `getManagerFieldById()`
- 🔲 `ManagerFieldEditPage` — replace mock with `updateField()` + `getFieldCreateForm()`
- 🔲 `ManagerCustomerDetailPage` — replace mock with `getCustomerById()`
- 🔲 End-to-end testing all flows
- 🔲 Error boundary, 404 handling

---

## 📊 Current Statistics (Mar 8, 2026)

| Metric | Count |
|--------|-------|
| Total JSX files | 52 |
| Total CSS files | 27 |
| Service files | 6 |
| Page components | 39 |
| App routes | 28 |
| Lines of code | ~31,646 |
| Build modules | 272 |

**Completion**:
- ✅ UI/UX: 100%
- ✅ API Integration: ~95% (3 Manager detail pages remain)
- 🔄 Testing & Polish: 30%
- 📊 **Overall: ~90% Complete**

---

## 📚 Documentation

- **[API_INTEGRATION_ROADMAP.md](./API_INTEGRATION_ROADMAP.md)** — API integration plan (phases + status)
- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** — Comprehensive project documentation

## 👥 Team

WDP301 - Group 3

## 📁 Project Structure

```
src/
├── assets/          # Images, icons, static files
├── components/      # Reusable components
│   └── layout/      # Layout components (Header, Footer, MainLayout, AdminLayout)
├── context/         # React Context (AuthContext, etc.)
├── data/            # Mock data for development
│   └── mockData.js  # Field, FieldType, Category mock data
├── pages/           # Page components
│   ├── Home/        # HomePage - Landing page with hero section
│   ├── Auth/        # Login, Register, ForgotPassword pages
│   ├── Field/       # FieldListPage (with filters), FieldDetailPage
│   ├── User/        # User Profile, Booking History (planned)
│   └── Admin/       # Admin Dashboard pages (planned)
├── services/        # Service layer for API calls
│   └── fieldService.js  # Field search/filter logic
├── styles/          # Component-specific CSS files
│   ├── common.css   # Common utilities and components
│   ├── HomePage.css # Homepage styles
│   └── FieldListPage.css  # Field list with sticky sidebar
├── utils/           # Helper functions, constants
├── App.jsx          # Main App component with routing
├── main.jsx         # Application entry point
└── index.css        # Global styles with Tailwind
```

## ✨ Key Features

### 🏟️ Field Listing & Search
- **Smart Filters**: 6 filter criteria (text search, category, field type, location, price range, date/time)
- **Conditional Filters**: Field type options only show for Football category
- **Sticky Sidebar**: Filter panel stays visible while scrolling
- **Real-time Search**: Instant results as you type
- **Pagination**: Navigate through results easily
- **Responsive Grid**: 3 columns (desktop), 2 columns (tablet), 1 column (mobile)

### 🎨 Modern UI/UX
- **Glass Morphism**: Translucent card effects
- **Neon Glow**: Vibrant hover effects
- **Custom Scrollbar**: Sleek 6px rounded scrollbar
- **Smooth Animations**: Fade-in effects and transitions
- **Dark Theme**: Beautiful dark mode design
- **Mobile Optimized**: Fully responsive on all devices

### 📊 Data Management
- **Mock Data**: 12 fields, 7 field types, 5 categories
- **Service Layer**: Centralized business logic
- **Filter Logic**: Advanced multi-criteria filtering
- **Validation**: Input validation and error handling

## 🎨 Design System

### Colors
- **Primary**: `#00E536` (Bright Green)
- **Secondary**: `#166534` (Dark Green)
- **Accent**: `#FDE047` (Yellow/Gold)
- **Background Light**: `#F0FDF4`
- **Background Dark**: `#052e16`

### Typography
- **Font Family**: Montserrat, sans-serif
- **Font Weights**: 400, 500, 600, 700, 800

### Custom Utilities
- `.glass-effect` - Glass morphism effect
- `.logo-text-shadow` - Logo text shadow
- `.shadow-neon` - Neon glow effect

## 🛠️ Development

### Prerequisites
- Node.js >= 18.x
- npm or yarn

### Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## 📋 Pages Structure

### Public Pages (MainLayout with Header & Footer)
- `/` - Homepage
- `/login` - Login page
- `/register` - Register page
- `/forgot-password` - Password recovery
- `/fields` - Field listing with filters
- `/fields/:id` - Field detail page
- `/profile` - User profile
- `/booking-history` - Booking history

### Admin Pages (AdminLayout with Sidebar)
- `/admin/dashboard` - Statistics overview
- `/admin/users` - User management
- `/admin/fields` - Field management
- `/admin/managers` - Manager permissions

## 🔧 Development Progress

### Phase 1: Core Features ✅ COMPLETED (Jan 2026)
- ✅ Setup project structure
- ✅ Create layouts (MainLayout, AdminLayout)
- ✅ Setup routing with React Router
- ✅ Create HomePage with modern UI
- ✅ Create Auth pages (Login, Register, ForgotPassword)
- ✅ Create Field List page with advanced filters
- ✅ Implement responsive design (mobile/desktop)

### Phase 2: UI/UX Enhancements ✅ COMPLETED (Feb 24, 2026)
- ✅ Sticky sidebar for Field List filters
- ✅ Custom scrollbar styling
- ✅ Filter simplification (removed utilities filter)
- ✅ Conditional field type filter (Football only)
- ✅ Auto-reset dependent filters
- ✅ Standardized field types (7 types total)
- ✅ Glass morphism effects
- ✅ Neon glow effects
- ✅ Smooth animations and transitions

### Phase 3: Field Detail & Booking ✅ COMPLETED (Feb 27, 2026)
- ✅ FieldDetailPage UI (image gallery, reviews, amenities)
- ✅ Booking sidebar with date picker
- ✅ Time slot selection (multi-slot support)
- ✅ Date validation (không cho chọn quá khứ)
- ✅ Booking flow (Chọn ngày → Chọn slot → Đặt sân)
- ✅ Price calculation (tiền sân + tiền cọc 30%)
- ✅ Smart validation (authentication, date, slots)
- ✅ Backend integration for time slots (BE calculates availability)

### Phase 4: API Infrastructure ✅ COMPLETED (Feb 27, 2026)
- ✅ Setup Axios instance with interceptors
- ✅ Auto token attachment to requests
- ✅ Auto token refresh on 401
- ✅ Token manager (localStorage)
- ✅ API endpoint configuration
- ✅ Booking service (7 methods: create, list, detail, cancel, check-availability, etc.)
- ✅ Field service (getTimeSlots method)
- ✅ Error handling (401, 403, 404, 409, 500, network)
- ✅ Environment configuration (.env)

### Phase 5: Full API Integration 🔄 IN PROGRESS (Est: 1-2 weeks)
- ✅ Booking API integration (Done)
- ✅ Time slot fetching (Done)
- 🔲 Replace mock data with real APIs
- 🔲 Authentication flow (login, register, logout)
- 🔲 Protected routes implementation
- 🔲 Field list/detail API connection
- 🔲 User profile API integration

### Phase 6: Payment & Booking Management 📋 PLANNED (Next 2 weeks)
- 🔲 Payment integration (VNPay/MoMo)
- 🔲 Booking confirmation page
- 🔲 Email notifications
- 🔲 User booking history page
- 🔲 Booking detail page
- 🔲 Cancel booking feature

### Phase 7: Manager Dashboard 📋 PLANNED (Next 3-4 weeks)
- 🔲 Dashboard overview (stats, charts)
- 🔲 Field management (CRUD operations)
- 🔲 Booking management (view, approve, cancel)
- 🔲 Customer management
- 🔲 Revenue reports

### Phase 8: Advanced Features 📋 PLANNED (Future)
- 🔲 Real-time notifications
- 🔲 Review/rating system
- 🔲 Favorite fields feature
- 🔲 Performance optimization (code splitting, caching)
- 🔲 Unit & E2E testing
- 🔲 Multi-language support (i18n)

---

## 📊 Current Statistics (Feb 27, 2026)

| Metric | Count |
|--------|-------|
| **Total Pages** | 7 pages |
| **Components** | 15+ components |
| **Services** | 3 services (field, booking, axios) |
| **API Methods** | 15+ methods |
| **Lines of Code** | ~8,000+ lines |
| **CSS Files** | 8 files |
| **Mock Data** | 12 fields, 7 types, 5 categories |

**Completion**: 
- ✅ UI/UX: 95% Complete
- ✅ Core Features: 85% Complete
- 🔄 API Integration: 40% Complete
- 📋 Overall: ~70% Complete

---

## 📝 Naming Conventions

- **Components**: PascalCase (`HomePage.jsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **CSS Classes**: Tailwind utility classes + custom classes
- **Routes**: kebab-case (`/forgot-password`)
- **API Endpoints**: kebab-case (`/manager/field/list`)

## 🎯 Component Guidelines

1. Use functional components with hooks
2. Keep components small and focused (< 500 lines)
3. Extract reusable logic into custom hooks
4. Use Tailwind classes instead of custom CSS when possible
5. Add comprehensive Vietnamese comments for complex logic
6. Validate all user inputs (date, slots, forms)
5. Follow the existing folder structure

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Redux Toolkit](https://redux-toolkit.js.org)

## � Documentation

- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Comprehensive project documentation
- **[API_INTEGRATION_ROADMAP.md](./API_INTEGRATION_ROADMAP.md)** - API integration plan

## �👥 Team

WDP301 - Group 3

---

**Note**: HTML templates in `pages template/` folder are design references from Stitch. Convert them to React components following the patterns in this project.

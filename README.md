# 🏟️ Sân Siêu Tốc - Frontend

Hệ thống đặt sân thể thao trực tuyến - Frontend Application

## 🚀 Tech Stack

- **React 19** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS v3.4** - Styling (Stable version)
- **React Router DOM** - Routing
- **Redux Toolkit** - State Management
- **Axios** - HTTP Client
- **React Hook Form** - Form Management

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

### Phase 1: Core Features ✅ COMPLETED
- ✅ Setup project structure
- ✅ Create layouts (MainLayout, AdminLayout)
- ✅ Setup routing with React Router
- ✅ Create HomePage with modern UI
- ✅ Create Auth pages (Login, Register, ForgotPassword)
- ✅ Create Field List page with advanced filters
- ✅ Create Field Detail page
- ✅ Implement responsive design (mobile/desktop)

### Phase 2: UI/UX Enhancements ✅ COMPLETED
- ✅ Sticky sidebar for Field List filters
- ✅ Custom scrollbar styling
- ✅ Filter simplification (removed utilities filter)
- ✅ Conditional field type filter (Football only)
- ✅ Auto-reset dependent filters
- ✅ Standardized field types (7 types total)
- ✅ Glass morphism effects
- ✅ Neon glow effects
- ✅ Smooth animations and transitions

### Phase 3: Data Layer & Services ✅ COMPLETED
- ✅ Setup mock data structure
- ✅ Create fieldService with 6 filter criteria
- ✅ Implement search/filter logic
- ✅ Add pagination support
- ✅ Create data models (Field, FieldType, Category, etc.)
- ✅ Service layer validation

### Phase 4: API Integration 🔄 IN PROGRESS
- 🔲 Setup Axios service layer
- 🔲 Connect to backend API
- 🔲 Implement authentication flow
- 🔲 Add error handling
- 🔲 API token management

### Phase 5: State Management 📋 PLANNED
- 🔲 Setup Redux store
- 🔲 Create slices (auth, fields, bookings)
- 🔲 Implement global state
- 🔲 Add Redux DevTools

### Phase 6: Advanced Features 📋 PLANNED
- 🔲 User dashboard
- 🔲 Admin dashboard with charts
- 🔲 Booking system
- 🔲 Payment integration
- 🔲 Real-time notifications
- 🔲 Dark mode toggle
- 🔲 Multi-language support (i18n)

## 📝 Naming Conventions

- **Components**: PascalCase (`HomePage.jsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **CSS Classes**: Tailwind utility classes
- **Routes**: kebab-case (`/forgot-password`)

## 🎯 Component Guidelines

1. Use functional components with hooks
2. Keep components small and focused
3. Extract reusable logic into custom hooks
4. Use Tailwind classes instead of custom CSS when possible
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

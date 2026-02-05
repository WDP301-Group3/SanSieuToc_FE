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
├── auth/            # Authentication utilities
├── components/      # Reusable components
│   └── layout/      # Layout components (Header, Footer, MainLayout, AdminLayout)
├── context/         # React Context (Auth, Theme, etc.)
├── pages/           # Page components
│   ├── Home/        # Homepage
│   ├── Auth/        # Login, Register, ForgotPassword
│   ├── Field/       # Field List, Field Detail
│   ├── User/        # User Profile, Booking History
│   └── Admin/       # Admin Dashboard pages
├── utils/           # Helper functions, constants
├── App.jsx          # Main App component with routing
├── main.jsx         # Application entry point
└── index.css        # Global styles with Tailwind
```

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

## 🔧 Next Steps

### Phase 1: Core Features (Current)
- ✅ Setup project structure
- ✅ Create layouts (MainLayout, AdminLayout)
- ✅ Setup routing
- ✅ Create HomePage
- 🔲 Create Auth pages (Login, Register)
- 🔲 Create Field pages (List, Detail)

### Phase 2: API Integration
- 🔲 Setup Axios service layer
- 🔲 Connect to backend API
- 🔲 Implement authentication flow
- 🔲 Add error handling

### Phase 3: State Management
- 🔲 Setup Redux store
- 🔲 Create slices (auth, fields, bookings)
- 🔲 Implement global state

### Phase 4: Advanced Features
- 🔲 User dashboard
- 🔲 Admin dashboard with charts
- 🔲 Booking system
- 🔲 Payment integration
- 🔲 Real-time notifications
- 🔲 Dark mode toggle

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

## 👥 Team

WDP301 - Group 3

---

**Note**: HTML templates in `pages template/` folder are design references from Stitch. Convert them to React components following the patterns in this project.

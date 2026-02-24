import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ManagerLayout from './components/layout/ManagerLayout';

// Pages
import HomePage from './pages/Home/HomePage';
import TestTailwind from './pages/TestTailwind';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from '../pages template/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Field Pages
import FieldListPage from './pages/Field/FieldListPage';
import FieldDetailPage from './pages/Field/FieldDetailPage';

// Customer Pages
import UserProfilePage from './pages/Customer/UserProfilePage';
import BookingHistoryPage from './pages/Customer/BookingHistoryPage';
import BookingDetailPage from './pages/Customer/BookingDetailPage';
import UserSettingsPage from './pages/Customer/UserSettingsPage';

// Manager Pages (Placeholder)
const ManagerDashboardPage = () => (
  <div className="placeholder-container">
    <h1 className="placeholder-title">Manager Dashboard</h1>
    <p className="placeholder-text">Statistics and overview will be displayed here.</p>
  </div>
);

const ManagerCustomersPage = () => (
  <div className="placeholder-container">
    <h1 className="placeholder-title">Customer Management</h1>
    <p className="placeholder-text">Customer list and management tools will be displayed here.</p>
  </div>
);

const ManagerFieldsPage = () => (
  <div className="placeholder-container">
    <h1 className="placeholder-title">Field Management</h1>
    <p className="placeholder-text">Field list and management tools will be displayed here.</p>
  </div>
);

const ManagerBookingsPage = () => (
  <div className="placeholder-container">
    <h1 className="placeholder-title">Booking Management</h1>
    <p className="placeholder-text">Booking list and management tools will be displayed here.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/test-tailwind" element={<TestTailwind />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/fields" element={<FieldListPage />} />
          <Route path="/fields/:id" element={<FieldDetailPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/booking-history" element={<BookingHistoryPage />} />
          <Route path="/booking-history/:id" element={<BookingDetailPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
        </Route>

        {/* Manager Routes with ManagerLayout */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboardPage />} />
          <Route path="customers" element={<ManagerCustomersPage />} />
          <Route path="fields" element={<ManagerFieldsPage />} />
          <Route path="bookings" element={<ManagerBookingsPage />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

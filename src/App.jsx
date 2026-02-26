import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import HomePage from './pages/Home/HomePage';
import AuthPage from './pages/Auth/AuthPage'; // Unified Auth Interface
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

// Admin Pages
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminFieldsPage from './pages/Admin/Field/AdminFieldsPage';
import AdminFieldDetailPage from './pages/Admin/Field/AdminFieldDetailPage';
import AdminFieldCreatePage from './pages/Admin/Field/AdminFieldCreatePage';
import AdminFieldEditPage from './pages/Admin/Field/AdminFieldEditPage';
import AdminCustomersPage from './pages/Admin/Customer/AdminCustomersPage';
import AdminCustomerDetailPage from './pages/Admin/Customer/AdminCustomerDetailPage';
import AdminFeedbackPage from './pages/Admin/Feedback/AdminFeedbackPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          {/* Auth Routes (inside MainLayout with Header/Footer) */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/forgot-password" element={<AuthPage />} />
          
          {/* Field & Customer Routes */}
          <Route path="/fields" element={<FieldListPage />} />
          <Route path="/fields/:id" element={<FieldDetailPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/booking-history" element={<BookingHistoryPage />} />
          <Route path="/booking-history/:id" element={<BookingDetailPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="fields" element={<AdminFieldsPage />} />
          <Route path="fields/create" element={<AdminFieldCreatePage />} />
          <Route path="fields/:id" element={<AdminFieldDetailPage />} />
          <Route path="fields/:id/edit" element={<AdminFieldEditPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
          <Route path="feedback" element={<AdminFeedbackPage />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

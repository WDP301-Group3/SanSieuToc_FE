import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import HomePage from './pages/Home/HomePage';
import TestTailwind from './pages/TestTailwind';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from '../pages template/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import TermsPage from './pages/TermsPage';

// Field Pages (Placeholder)
const FieldListPage = () => <div className="p-8">Field List Page (Coming Soon)</div>;
const FieldDetailPage = () => <div className="p-8">Field Detail Page (Coming Soon)</div>;

// User Pages (Placeholder)
const UserProfilePage = () => <div className="p-8">User Profile Page (Coming Soon)</div>;
const BookingHistoryPage = () => <div className="p-8">Booking History Page (Coming Soon)</div>;

// Admin Pages (Placeholder)
const AdminDashboardPage = () => <div className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow"><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="mt-4 text-gray-600">Statistics and overview will be displayed here.</p></div>;
const AdminUsersPage = () => <div className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow"><h1 className="text-2xl font-bold">User Management</h1><p className="mt-4 text-gray-600">User list and management tools will be displayed here.</p></div>;
const AdminFieldsPage = () => <div className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow"><h1 className="text-2xl font-bold">Field Management</h1><p className="mt-4 text-gray-600">Field list and management tools will be displayed here.</p></div>;
const AdminManagersPage = () => <div className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow"><h1 className="text-2xl font-bold">Manager Permissions</h1><p className="mt-4 text-gray-600">Assign field owner permissions here.</p></div>;

// Not Found Page
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-[#00E536] mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Trang không tồn tại
      </p>
      <a
        href="/"
        className="inline-block bg-[#00E536] hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full transition-colors"
      >
        Về trang chủ
      </a>
    </div>
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
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="fields" element={<AdminFieldsPage />} />
          <Route path="managers" element={<AdminManagersPage />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

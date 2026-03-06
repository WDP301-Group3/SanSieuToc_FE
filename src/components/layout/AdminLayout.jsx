import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getUserAvatar } from '../../utils/defaultAvatar';
import logo from '../../assets/images/logo.png';
import '../../styles/AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Redirect non-admin users
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    
    { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admin/fields', icon: 'stadium', label: 'Manage Fields' },
    { path: '/admin/customers', icon: 'group', label: 'Manage Customers' },
    { path: '/admin/feedback', icon: 'chat_bubble', label: 'Manage Feedback' },
    { path: '/settings', icon: 'settings', label: 'Settings' },
    
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <img src={logo} alt="Sân Siêu Tốc" className="admin-logo-img" />
          <div>
            <h1 className="admin-logo-title">Sân Siêu Tốc</h1>
            <p className="admin-logo-subtitle">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="admin-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <h2 className="admin-header-title">
              {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h2>
            <p className="admin-header-subtitle">Chào mừng trở lại, Quản trị viên</p>
          </div>
          <div className="admin-header-right">
            <button
              className="admin-notification-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button className="admin-notification-btn">
              <span className="material-symbols-outlined">notifications</span>
              <span className="admin-notification-dot" />
            </button>
            <div className="admin-header-divider" />
            <div className="admin-avatar-wrapper" ref={dropdownRef}>
              <button
                className="admin-avatar-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src={getUserAvatar(user?.image, user?.name)}
                  alt={user?.name || 'Admin'}
                  className="admin-avatar-img"
                />
              </button>

              {showDropdown && (
                <div className="admin-dropdown">
                  <div className="admin-dropdown-header">
                    <p className="admin-dropdown-name">{user?.name || 'Admin User'}</p>
                    <p className="admin-dropdown-email">{user?.email || 'admin@sieutoc.vn'}</p>
                  </div>
                  <div className="admin-dropdown-divider" />
                  <Link
                    to="/profile"
                    className="admin-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="material-symbols-outlined">person</span>
                    Profile
                  </Link>
                  <Link
                    to="/"
                    className="admin-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="material-symbols-outlined">home</span>
                    Trang chủ
                  </Link>
                  <div className="admin-dropdown-divider" />
                  <button
                    className="admin-dropdown-item logout"
                    onClick={() => { logout(); setShowDropdown(false); navigate('/login'); }}
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

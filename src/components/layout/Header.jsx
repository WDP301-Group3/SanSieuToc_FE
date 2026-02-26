import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/images/logo.png';
import '../../styles/Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [hidden, setHidden] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <nav className={`header-nav ${hidden ? 'header-hidden' : ''}`}>
      <div className="header-container">
        <div className="header-inner">
          {/* Logo */}
          <div className="header-logo-section">
            <Link to="/" className="header-logo-link">
              <img
                alt="Sân Siêu Tốc Logo"
                className="header-logo-image"
                src={logo}
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="header-nav-links">
            <Link
              className="header-nav-link"
              to="/"
            >
              Trang chủ
            </Link>
            <Link
              className="header-nav-link"
              to="/fields"
            >
              Đặt sân
            </Link>
            <Link
              className="header-nav-link"
              to="/terms"
            >
              Điều khoản
            </Link>
          </div>

          {/* Actions */}
          <div className="header-actions">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="header-icon-btn"
              aria-label="Toggle theme"
            >
              <span className="material-icons-outlined">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notifications */}
            <button className="header-icon-btn header-notification-btn">
              <span className="material-icons-outlined">notifications</span>
              <span className="header-notification-dot" />
            </button>

            <div className="header-divider" />

            {isAuthenticated ? (
              <div className="header-avatar-wrapper" ref={dropdownRef}>
                <button
                  className="header-avatar"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img
                    src={user?.image || 'https://via.placeholder.com/40'}
                    alt={user?.name || 'User Avatar'}
                    className="header-avatar-image"
                  />
                </button>

                {showDropdown && (
                  <div className="header-dropdown">
                    <div className="header-dropdown-header">
                      <p className="header-dropdown-name">{user?.name || 'User'}</p>
                      <p className="header-dropdown-email">{user?.email || ''}</p>
                    </div>
                    <div className="header-dropdown-divider" />
                    <Link
                      to="/profile"
                      className="header-dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span className="material-icons-outlined">person</span>
                      Profile
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="header-dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span className="material-icons-outlined">dashboard</span>
                        Dashboard
                      </Link>
                    )}
                    <div className="header-dropdown-divider" />
                    <button
                      className="header-dropdown-item logout"
                      onClick={() => { logout(); setShowDropdown(false); }}
                    >
                      <span className="material-icons-outlined">logout</span>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="header-login-btn">
                  <span className="material-icons-outlined text-sm">login</span>
                  Đăng nhập
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/images/logo.png';
import '../../styles/Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="header-nav">
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
              <span className="header-logo-text">
                Sân Siêu Tốc
              </span>
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
            <button className="header-icon-btn">
              <span className="material-icons-outlined">notifications</span>
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <div className="header-avatar">
                    <img
                      src={user?.image || 'https://via.placeholder.com/40'}
                      alt={user?.name || 'User Avatar'}
                      className="header-avatar-image"
                    />
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="header-logout-btn"
                >
                  <span className="material-icons-outlined">logout</span>
                </button>
              </>
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

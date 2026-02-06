import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'manager'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call based on activeTab
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login based on role
      const mockUser = {
        id: '1',
        name: activeTab === 'customer' ? 'Nguyen Van A' : 'Manager Nguyen',
        email: formData.email,
        image: 'https://via.placeholder.com/100',
        role: activeTab, // 'customer' or 'manager'
      };
      const mockToken = 'mock-jwt-token-123';

      login(mockUser, mockToken);
      
      // Redirect based on role
      if (activeTab === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-main">
        {/* Login Card Container */}
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              {/* Headline */}
              <h1 className="login-title">
                Chào mừng trở lại!
              </h1>
              {/* Description */}
              <p className="login-subtitle">
                Đặt sân nhanh chóng, thi đấu hết mình cùng Sân Siêu Tốc.
              </p>
            </div>

            {/* Role Tabs */}
            <div className="login-tabs-wrapper">
              <div className="login-tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab('customer')}
                  className={`login-tab ${activeTab === 'customer' ? 'active' : ''}`}
                >
                  <span className="material-icons-outlined">person</span>
                  Khách hàng
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('manager')}
                  className={`login-tab ${activeTab === 'manager' ? 'active' : ''}`}
                >
                  <span className="material-icons-outlined">admin_panel_settings</span>
                  Chủ sân
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Error Message */}
              {error && (
                <div className="error-alert">
                  {error}
                </div>
              )}

              {/* Email/Username Field */}
              <div className="form-field">
                <label className="form-label-wrapper">
                  <p className="form-label">
                    Email hoặc Tên đăng nhập
                  </p>
                  <div className="form-input-wrapper">
                    <span className="material-icons-outlined form-input-icon">
                      person
                    </span>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="example@gmail.com"
                      type="text"
                      required
                    />
                  </div>
                </label>
              </div>

              {/* Password Field */}
              <div className="form-field">
                <div className="password-label-wrapper">
                  <p className="form-label">
                    Mật khẩu
                  </p>
                  <Link
                    to="/forgot-password"
                    className="forgot-password-link"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="password-input-container">
                  <div className="form-input-wrapper">
                    <span className="material-icons-outlined form-input-icon">
                      lock
                    </span>
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input password-input"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      required
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="toggle-password-btn"
                      type="button"
                    >
                      <span className="material-icons-outlined">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Me */}
              <div className="remember-me-group">
                <input
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="remember-me-checkbox"
                  id="remember"
                  type="checkbox"
                />
                <label
                  className="remember-me-label"
                  htmlFor="remember"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                <span>
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}
                </span>
              </button>
            </form>

            {/* Registration Link */}
            <div className="login-footer">
              <p className="login-footer-text">
                Bạn chưa có tài khoản?{' '}
                <Link to="/register" className="login-footer-link">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>

          {/* Simple Footer Links */}
          <footer className="login-page-footer">
            <div className="login-page-footer-links">
              <Link to="/terms" className="footer-link">
                Điều khoản
              </Link>
              <Link to="/privacy" className="footer-link">
                Bảo mật
              </Link>
              <Link to="/contact" className="footer-link">
                Hỗ trợ
              </Link>
            </div>
            <p>© 2024 Sân Siêu Tốc. Bản quyền thuộc về đội ngũ phát triển.</p>
          </footer>
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="login-decorative-bg">
        <div className="login-decorative-circle-1" />
        <div className="login-decorative-circle-2" />
      </div>
    </div>
  );
};

export default LoginPage;

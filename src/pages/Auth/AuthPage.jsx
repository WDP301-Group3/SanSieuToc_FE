import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockUsers } from '../../data/mockData';
import '../../styles/AuthPage.css';

/**
 * AuthPage Component - Unified Authentication Interface
 * Handles Login, Register, and Forgot Password flows in a single component with tab switching
 * 
 * Features:
 * - Tab-based navigation between auth modes (Login/Register/Forgot Password)
 * - Automatic mode detection based on URL path
 * - Role-based login (Customer/Admin) with credential validation
 * - Form validation with error handling
 * - Password visibility toggle
 * - Success/Error state management
 * - Responsive design with decorative backgrounds
 */
const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /**
   * Determine initial auth mode based on URL
   */
  const getInitialAuthMode = () => {
    const path = location.pathname;
    if (path.includes('register')) return 'register';
    if (path.includes('forgot-password')) return 'forgot-password';
    return 'login'; // default
  };
  
  /**
   * Main authentication mode
   * @type {'login' | 'register' | 'forgot-password'}
   */
  const [authMode, setAuthMode] = useState(getInitialAuthMode());
  
  /**
   * Password visibility toggles
   */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  /**
   * Loading state for async operations
   */
  const [loading, setLoading] = useState(false);
  
  /**
   * Success state for forgot password flow
   */
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  
  /**
   * Error messages (can be string or object for field-specific errors)
   */
  const [errors, setErrors] = useState({});
  
  // ============================================================================
  // FORM DATA
  // ============================================================================
  
  /**
   * Login form data
   */
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  
  /**
   * Registration form data
   */
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
  });
  
  /**
   * Forgot password form data
   */
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Update auth mode when URL changes
   */
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('register')) {
      setAuthMode('register');
    } else if (path.includes('forgot-password')) {
      setAuthMode('forgot-password');
    } else {
      setAuthMode('login');
    }
  }, [location.pathname]);
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle input changes for login form
   * @param {Event} e - Input change event
   */
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };
  
  /**
   * Handle input changes for register form
   * @param {Event} e - Input change event
   */
  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };
  
  /**
   * Switch authentication mode and reset states
   * Also updates the URL to match the mode
   * @param {string} mode - New auth mode ('login', 'register', 'forgot-password')
   */
  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setErrors({});
    setForgotPasswordSuccess(false);
    
    // Update URL based on mode
    if (mode === 'register') {
      navigate('/register', { replace: true });
    } else if (mode === 'forgot-password') {
      navigate('/forgot-password', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };
  
  // ============================================================================
  // VALIDATION FUNCTIONS
  // ============================================================================
  
  /**
   * Validate registration form
   * @returns {boolean} - True if form is valid
   */
  const validateRegisterForm = () => {
    const newErrors = {};

    // Username validation
    if (!registerData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    } else if (registerData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    // Email validation
    if (!registerData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Password validation
    if (!registerData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Confirm password validation
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // Phone validation (optional field)
    if (registerData.phone && !/^[0-9]{10}$/.test(registerData.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số';
    }

    // Terms agreement validation
    if (!registerData.agreeToTerms) {
      newErrors.agreeToTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Validate email for forgot password
   * @param {string} email - Email to validate
   * @returns {boolean} - True if email is valid
   */
  const validateEmail = (email) => {
    if (!email) {
      setErrors({ email: 'Vui lòng nhập địa chỉ email' });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Email không hợp lệ' });
      return false;
    }

    return true;
  };
  
  // ============================================================================
  // SUBMIT HANDLERS
  // ============================================================================
  
  /**
   * Handle login form submission
   * Validates credentials against mockUsers
   * @param {Event} e - Form submit event
   */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Basic field validation
    const newErrors = {};
    if (!loginData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    }
    if (!loginData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Find user by email
      const foundUser = mockUsers.find(
        (account) => account.email === loginData.email.trim()
      );

      // Validate email exists
      if (!foundUser) {
        setErrors({ submit: 'Email không tồn tại trong hệ thống.' });
        setLoading(false);
        return;
      }

      // Validate password
      if (foundUser.password !== loginData.password) {
        setErrors({ submit: 'Mật khẩu không chính xác.' });
        setLoading(false);
        return;
      }

      // Validate account is active (if applicable)
      if (foundUser.isActive === false) {
        setErrors({ submit: 'Tài khoản đã bị vô hiệu hóa.' });
        setLoading(false);
        return;
      }

      // Build user object for context
      const userData = {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone || '',
        image: foundUser.image || 'https://via.placeholder.com/100',
        role: foundUser.role,
      };
      const mockToken = 'mock-jwt-token-' + foundUser._id;

      login(userData, mockToken);

      // Redirect based on role
      if (foundUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrors({ submit: 'Đăng nhập thất bại. Vui lòng thử lại.' });
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Handle registration form submission
   * @param {Event} e - Form submit event
   */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateRegisterForm()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful registration
      const mockUser = {
        id: '1',
        name: registerData.username,
        email: registerData.email,
        phone: registerData.phone,
        image: 'https://via.placeholder.com/100',
        role: 'customer',
      };
      const mockToken = 'mock-jwt-token-123';

      // Auto login after successful registration
      login(mockUser, mockToken);
      navigate('/');
    } catch (err) {
      setErrors({ submit: 'Đăng ký thất bại. Vui lòng thử lại.' });
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Handle forgot password form submission
   * @param {Event} e - Form submit event
   */
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(forgotPasswordEmail)) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success state
      setForgotPasswordSuccess(true);
    } catch (err) {
      setErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  /**
   * Render Login Form
   */
  const renderLoginForm = () => (
    <div className="auth-form-wrapper">
      {/* Header */}
      <div className="auth-header">
        <h1 className="auth-title">Chào mừng trở lại!</h1>
        <p className="auth-subtitle">
          Đặt sân nhanh chóng, thi đấu hết mình cùng Sân Siêu Tốc.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLoginSubmit} className="auth-form">
        {/* Error Message */}
        {errors.submit && (
          <div className="error-alert">
            {errors.submit}
          </div>
        )}

        {/* Email Field */}
        <div className="form-field">
          <label className="form-label">
            <span className="material-icons-outlined form-input-icon">person</span>
            Email hoặc Tên đăng nhập
          </label>
          <div className="form-input-wrapper">
            <input
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="form-input"
              placeholder="example@gmail.com"
              type="text"
              required
            />
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Password Field */}
        <div className="form-field">
          <label className="form-label">
            <span className="material-icons-outlined form-input-icon">lock</span>
            Mật khẩu
          </label>
          <div className="password-input-container">
            <input
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="form-input password-input"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              required
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password-btn"
              type="button"
              aria-label="Toggle password visibility"
            >
              <span className="material-icons-outlined">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        {/* Forgot Password Link */}
        <div className="form-footer-link">
          <button
            type="button"
            onClick={() => switchAuthMode('forgot-password')}
            className="forgot-password-link"
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="auth-submit-btn"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="auth-switch">
        <p className="auth-switch-text">
          Bạn chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={() => switchAuthMode('register')}
            className="auth-switch-link"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
  
  /**
   * Render Register Form
   */
  const renderRegisterForm = () => (
    <div className="auth-form-wrapper">
      {/* Header */}
      <div className="auth-header">
        <h1 className="auth-title">Tạo tài khoản mới</h1>
        <p className="auth-subtitle">
          Chào mừng bạn! Hãy điền các thông tin dưới đây để bắt đầu.
        </p>
      </div>

      {/* Register Form */}
      <form onSubmit={handleRegisterSubmit} className="auth-form">
        {/* Error Message */}
        {errors.submit && (
          <div className="error-alert">
            {errors.submit}
          </div>
        )}

        {/* Username & Email Row */}
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">
              <span className="material-icons-outlined">person</span>
              Tên đăng nhập
            </label>
            <input
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              className="form-input"
              placeholder="johndoe"
              type="text"
              required
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="material-icons-outlined">email</span>
              Email
            </label>
            <input
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              className="form-input"
              placeholder="john@example.com"
              type="email"
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>

        {/* Phone Number */}
        <div className="form-field">
          <label className="form-label">
            <span className="material-icons-outlined">call</span>
            Số điện thoại
          </label>
          <input
            name="phone"
            value={registerData.phone}
            onChange={handleRegisterChange}
            className="form-input"
            placeholder="0901234567"
            type="tel"
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        {/* Password & Confirm Password Row */}
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">
              <span className="material-icons-outlined">lock</span>
              Mật khẩu
            </label>
            <div className="password-field">
              <input
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                className="form-input"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                required
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-btn"
                type="button"
                aria-label="Toggle password visibility"
              >
                <span className="material-icons-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="material-icons-outlined">check_circle</span>
              Xác nhận mật khẩu
            </label>
            <div className="password-field">
              <input
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                className="form-input"
                placeholder="••••••••"
                type={showConfirmPassword ? 'text' : 'password'}
                required
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="toggle-password-btn"
                type="button"
                aria-label="Toggle confirm password visibility"
              >
                <span className="material-icons-outlined">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="terms-group">
          <input
            name="agreeToTerms"
            checked={registerData.agreeToTerms}
            onChange={handleRegisterChange}
            className="terms-checkbox"
            id="terms"
            type="checkbox"
          />
          <label className="terms-label" htmlFor="terms">
            Tôi đồng ý với{' '}
            <Link to="/terms" className="terms-link">
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link to="/privacy" className="terms-link">
              Chính sách bảo mật
            </Link>
          </label>
        </div>
        {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="auth-submit-btn"
        >
          {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="auth-switch">
        <p className="auth-switch-text">
          Đã có tài khoản?{' '}
          <button
            type="button"
            onClick={() => switchAuthMode('login')}
            className="auth-switch-link"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>
    </div>
  );
  
  /**
   * Render Forgot Password Form
   */
  const renderForgotPasswordForm = () => {
    // Success state - Show confirmation message
    if (forgotPasswordSuccess) {
      return (
        <div className="auth-form-wrapper forgot-password-success">
          {/* Success Icon */}
          <div className="success-icon-wrapper">
            <span className="material-icons-outlined success-icon">
              check_circle
            </span>
          </div>

          {/* Success Message */}
          <h2 className="success-title">Email đã được gửi!</h2>
          <p className="success-text">
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email{' '}
            <strong className="email-highlight">{forgotPasswordEmail}</strong>.
            Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn.
          </p>

          {/* Info Box */}
          <div className="info-box">
            <span className="material-icons-outlined">info</span>
            <span>
              Không thấy email? Kiểm tra thư mục spam hoặc thư rác. 
              Email có thể mất vài phút để đến.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="success-actions">
            <button
              type="button"
              onClick={() => switchAuthMode('login')}
              className="success-btn-primary"
            >
              <span className="material-icons-outlined">arrow_back</span>
              Quay lại đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setForgotPasswordSuccess(false);
                setForgotPasswordEmail('');
              }}
              className="success-btn-secondary"
            >
              Gửi lại email
            </button>
          </div>
        </div>
      );
    }

    // Initial state - Show email input form
    return (
      <div className="auth-form-wrapper">
        {/* Header with Icon */}
        <div className="auth-header forgot-password-header">
          <div className="forgot-password-icon-wrapper">
            <span className="material-icons-outlined forgot-password-icon">
              lock_reset
            </span>
          </div>
          <h1 className="auth-title">Quên mật khẩu?</h1>
          <p className="auth-subtitle">
            Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn 
            để đặt lại mật khẩu cho tài khoản của bạn.
          </p>
        </div>

        {/* Forgot Password Form */}
        <form onSubmit={handleForgotPasswordSubmit} className="auth-form">
          {/* Error Message */}
          {errors.email && (
            <div className="error-alert">
              <span className="material-icons-outlined">error</span>
              {errors.email}
            </div>
          )}

          {/* Email Field */}
          <div className="form-field">
            <label className="form-label">
              <span className="material-icons-outlined form-input-icon">mail</span>
              Địa chỉ Email
            </label>
            <input
              type="email"
              value={forgotPasswordEmail}
              onChange={(e) => {
                setForgotPasswordEmail(e.target.value);
                setErrors({});
              }}
              placeholder="vidu@email.com"
              className="form-input"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? (
              <>
                <span className="material-icons-outlined animate-spin">refresh</span>
                Đang xử lý...
              </>
            ) : (
              'Gửi yêu cầu đặt lại'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="auth-footer">
          <button
            type="button"
            onClick={() => switchAuthMode('login')}
            className="auth-back-link"
          >
            <span className="material-icons-outlined">arrow_back</span>
            Quay lại trang Đăng nhập
          </button>
          <p className="auth-support-text">
            Bạn gặp khó khăn?{' '}
            <a href="#" className="auth-support-link">
              Liên hệ bộ phận hỗ trợ
            </a>
          </p>
        </div>
      </div>
    );
  };
  
  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="auth-page">
      <main className="auth-main">
        {/* Main Container */}
        <div className="auth-container">
          {/* Auth Mode Tabs - Main Navigation */}
          <div className="auth-mode-tabs">
            <button
              type="button"
              onClick={() => switchAuthMode('login')}
              className={`auth-mode-tab ${authMode === 'login' ? 'active' : ''}`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchAuthMode('register')}
              className={`auth-mode-tab ${authMode === 'register' ? 'active' : ''}`}
            >
              Đăng ký
            </button>
          </div>

          {/* Auth Card */}
          <div className="auth-card">
            {/* Render appropriate form based on auth mode */}
            {authMode === 'login' && renderLoginForm()}
            {authMode === 'register' && renderRegisterForm()}
            {authMode === 'forgot-password' && renderForgotPasswordForm()}
          </div>
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="auth-decorative-bg">
        <div className="auth-decorative-circle-1" />
        <div className="auth-decorative-circle-2" />
      </div>
    </div>
  );
};

export default AuthPage;

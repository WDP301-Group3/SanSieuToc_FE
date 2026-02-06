import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful registration
      const mockUser = {
        id: '1',
        name: formData.username,
        email: formData.email,
        phone: formData.phone,
        image: 'https://via.placeholder.com/100',
        role: 'customer',
      };
      const mockToken = 'mock-jwt-token-123';

      login(mockUser, mockToken);
      navigate('/');
    } catch (err) {
      setErrors({ submit: 'Đăng ký thất bại. Vui lòng thử lại.' });
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <main className="register-main">
        <div className="register-container">
          {/* Hero Visual Section */}
          <div className="register-hero">
            <div className="register-hero-image-wrapper">
              <div className="register-hero-overlay" />
              <img
                alt="Sân vận động cỏ nhân tạo hiện đại"
                className="register-hero-image"
                src="https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=1000&fit=crop"
              />
              <div className="register-hero-content">
                <div className="register-hero-badge">
                  <span className="material-icons-outlined">bolt</span>
                  ĐẶT SÂN NHANH CHÓNG
                </div>
                <h2 className="register-hero-title">
                  Nâng tầm trận đấu,<br />kết nối đam mê.
                </h2>
                <p className="register-hero-desc">
                  Tham gia cộng đồng người chơi thể thao lớn nhất. Đặt sân dễ dàng chỉ với vài cú chạm.
                </p>
              </div>
            </div>
          </div>

          {/* Registration Form Card */}
          <div className="register-form-card">
            <div className="register-form-header">
              <h2 className="register-form-title">
                Tạo tài khoản mới
              </h2>
              <p className="register-form-subtitle">
                Chào mừng bạn! Hãy điền các thông tin dưới đây để bắt đầu.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {/* Submit Error */}
              {errors.submit && (
                <div className="error-alert">
                  {errors.submit}
                </div>
              )}

              {/* Username & Email */}
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">
                    <span className="material-icons-outlined">person</span>
                    Tên đăng nhập
                  </label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
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
                    value={formData.email}
                    onChange={handleChange}
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
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0901234567"
                  type="tel"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {/* Password Fields */}
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">
                    <span className="material-icons-outlined">lock</span>
                    Mật khẩu
                  </label>
                  <div className="password-field">
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input"
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
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="••••••••"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="toggle-password-btn"
                      type="button"
                    >
                      <span className="material-icons-outlined">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="terms-group">
                <input
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
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

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="register-submit-btn"
              >
                {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
              </button>
            </form>

            {/* Login Link */}
            <div className="register-footer">
              <p className="register-footer-text">
                Đã có tài khoản?{' '}
                <Link to="/login" className="register-footer-link">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Background */}
      <div className="register-decorative-bg">
        <div className="register-decorative-circle-1" />
        <div className="register-decorative-circle-2" />
      </div>
    </div>
  );
};

export default RegisterPage;

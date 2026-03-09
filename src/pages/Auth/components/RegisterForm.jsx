/**
 * @fileoverview RegisterForm - Form đăng ký
 */

import { Link } from 'react-router-dom';

const RegisterForm = ({
  registerData,
  errors,
  loading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handleRegisterChange,
  handleRegisterSubmit,
  switchAuthMode,
}) => {
  return (
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
};

export default RegisterForm;

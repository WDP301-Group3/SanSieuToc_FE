/**
 * @fileoverview LoginForm - Form đăng nhập
 */

const LoginForm = ({
  loginData,
  errors,
  loading,
  showPassword,
  setShowPassword,
  handleLoginChange,
  handleLoginSubmit,
  switchAuthMode,
}) => {
  return (
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
            Đăng nhập bằng Email
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
};

export default LoginForm;

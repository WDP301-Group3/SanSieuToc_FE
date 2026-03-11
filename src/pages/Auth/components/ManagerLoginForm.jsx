/**
 * @fileoverview ManagerLoginForm - Form đăng nhập dành cho Chủ sân (Manager)
 */

const ManagerLoginForm = ({
  loginData,
  errors,
  loading,
  showPassword,
  setShowPassword,
  handleLoginChange,
  handleManagerLoginSubmit,
  onForgotPassword,
}) => {
  return (
    <div className="auth-form-wrapper">
      {/* Header */}
      <div className="auth-header">
        <div className="manager-login-badge">
          <span className="material-symbols-outlined">manage_accounts</span>
          Cổng quản lý
        </div>
        <h1 className="auth-title">Đăng nhập quản lý</h1>
        <p className="auth-subtitle">
          Quản lý sân, theo dõi lịch đặt và doanh thu dễ dàng.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleManagerLoginSubmit} className="auth-form">
        {/* Error Message */}
        {errors.submit && (
          <div className="error-alert">
            {errors.submit}
          </div>
        )}

        {/* Email Field */}
        <div className="form-field">
          <label className="form-label">
            <span className="material-icons-outlined form-input-icon">business_center</span>
            Email đăng nhập
          </label>
          <div className="form-input-wrapper">
            <input
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="form-input"
              placeholder="manager@sansieutoc.com"
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
          <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
            <button
              type="button"
              onClick={onForgotPassword}
              className="forgot-password-link"
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="auth-submit-btn manager-submit-btn"
        >
          {loading ? (
            <>
              <span className="auth-btn-spinner" />
              Đang đăng nhập...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
                login
              </span>
              Đăng nhập
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ManagerLoginForm;

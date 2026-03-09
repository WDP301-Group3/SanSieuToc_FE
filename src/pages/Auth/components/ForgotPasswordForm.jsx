/**
 * @fileoverview ForgotPasswordForm - Form quên mật khẩu
 */

const ForgotPasswordForm = ({
  forgotPasswordEmail,
  setForgotPasswordEmail,
  forgotPasswordSuccess,
  setForgotPasswordSuccess,
  errors,
  setErrors,
  loading,
  handleForgotPasswordSubmit,
  switchAuthMode,
}) => {
  // Success state
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

  // Initial state - email input form
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

export default ForgotPasswordForm;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Email validation
    if (!email) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful response
      setSuccess(true);
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      {/* Decorative Background Elements */}
      <div className="forgot-password-decorative-bg">
        <div className="forgot-password-decorative-circle-1"></div>
        <div className="forgot-password-decorative-circle-2"></div>
      </div>

      {/* Main Content Card */}
      <div className="forgot-password-card">
        {!success ? (
          <>
            {/* Icon and Headline */}
            <div className="forgot-password-header">
              <div className="forgot-password-icon-wrapper">
                <span className="material-icons-outlined forgot-password-icon">lock_reset</span>
              </div>
              <h1 className="forgot-password-title">
                Quên mật khẩu?
              </h1>
              <p className="forgot-password-subtitle">
                Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu cho tài khoản của bạn.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="forgot-password-error">
                <p className="forgot-password-error-text">
                  <span className="material-icons-outlined">error</span>
                  {error}
                </p>
              </div>
            )}

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="forgot-password-field">
                <label className="forgot-password-label">
                  Địa chỉ Email
                </label>
                <div className="forgot-password-input-wrapper">
                  <span className="material-icons-outlined forgot-password-input-icon">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="vidu@email.com"
                    className={`forgot-password-input ${error ? 'error' : ''}`}
                    required
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="forgot-password-actions">
                <button
                  type="submit"
                  disabled={loading}
                  className="forgot-password-submit-btn"
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
              </div>
            </form>

            {/* Footer Links */}
            <div className="forgot-password-footer">
              <Link
                to="/login"
                className="forgot-password-back-link"
              >
                <span className="material-icons-outlined">arrow_back</span>
                Quay lại trang Đăng nhập
              </Link>
              <p className="forgot-password-support-text">
                Bạn gặp khó khăn?{' '}
                <a href="#" className="forgot-password-support-link">
                  Liên hệ bộ phận hỗ trợ
                </a>
              </p>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="forgot-password-success">
            {/* Success Icon */}
            <div className="forgot-password-success-icon-wrapper">
              <span className="material-icons-outlined forgot-password-success-icon">
                check_circle
              </span>
            </div>

            {/* Success Message */}
            <h2 className="forgot-password-success-title">
              Email đã được gửi!
            </h2>
            <p className="forgot-password-success-text">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <strong className="forgot-password-email-highlight">{email}</strong>. 
              Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn.
            </p>

            {/* Info Box */}
            <div className="forgot-password-info-box">
              <p className="forgot-password-info-text">
                <span className="material-icons-outlined">info</span>
                <span>
                  Không thấy email? Kiểm tra thư mục spam hoặc thư rác. Email có thể mất vài phút để đến.
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="forgot-password-success-actions">
              <Link
                to="/login"
                className="forgot-password-success-btn"
              >
                <span className="material-icons-outlined">arrow_back</span>
                Quay lại đăng nhập
              </Link>
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="forgot-password-resend-btn"
              >
                Gửi lại email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

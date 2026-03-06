import '../../styles/AuthPage.css';
import useAuthPage from './useAuthPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

/**
 * AuthPage Component - Unified Authentication Interface
 * Handles Login, Register, and Forgot Password flows in a single component with tab switching
 */
const AuthPage = () => {
  const {
    authMode,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    errors,
    setErrors,
    loginData,
    registerData,
    forgotPasswordEmail,
    setForgotPasswordEmail,
    forgotPasswordSuccess,
    setForgotPasswordSuccess,
    handleLoginChange,
    handleRegisterChange,
    switchAuthMode,
    handleLoginSubmit,
    handleRegisterSubmit,
    handleForgotPasswordSubmit,
  } = useAuthPage();

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
            {authMode === 'login' && (
              <LoginForm
                loginData={loginData}
                errors={errors}
                loading={loading}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleLoginChange={handleLoginChange}
                handleLoginSubmit={handleLoginSubmit}
                switchAuthMode={switchAuthMode}
              />
            )}
            {authMode === 'register' && (
              <RegisterForm
                registerData={registerData}
                errors={errors}
                loading={loading}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                handleRegisterChange={handleRegisterChange}
                handleRegisterSubmit={handleRegisterSubmit}
                switchAuthMode={switchAuthMode}
              />
            )}
            {authMode === 'forgot-password' && (
              <ForgotPasswordForm
                forgotPasswordEmail={forgotPasswordEmail}
                setForgotPasswordEmail={setForgotPasswordEmail}
                forgotPasswordSuccess={forgotPasswordSuccess}
                setForgotPasswordSuccess={setForgotPasswordSuccess}
                errors={errors}
                setErrors={setErrors}
                loading={loading}
                handleForgotPasswordSubmit={handleForgotPasswordSubmit}
                switchAuthMode={switchAuthMode}
              />
            )}
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

import '../../styles/AuthPage.css';
import useAuthPage from './useAuthPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ManagerLoginForm from './components/ManagerLoginForm';
import { useTranslation } from 'react-i18next';

/**
 * AuthPage Component - Unified Authentication Interface
 * Handles Login, Register, and Forgot Password flows in a single component with tab switching
 */
const AuthPage = () => {
  const { t } = useTranslation();
  const {
    authMode,
    loginRole,
    setLoginRole,
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
    managerForgotActive,
    setManagerForgotActive,
    handleLoginChange,
    handleRegisterChange,
    switchAuthMode,
    switchToManagerForgot,
    switchBackFromManagerForgot,
    handleLoginSubmit,
    handleManagerLoginSubmit,
    handleRegisterSubmit,
    handleForgotPasswordSubmit,
    handleManagerForgotPasswordSubmit,
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
              onClick={() => { switchAuthMode('login'); setLoginRole('customer'); }}
              className={`auth-mode-tab ${authMode === 'login' && loginRole === 'customer' ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '4px' }}>person</span>
              {t('auth.tabs.user')}
            </button>
            <button
              type="button"
              onClick={() => { switchAuthMode('register'); }}
              className={`auth-mode-tab ${authMode === 'register' ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '4px' }}>person_add</span>
              {t('auth.tabs.register')}
            </button>
            <button
              type="button"
              onClick={() => { switchAuthMode('login'); setLoginRole('manager'); setErrors({}); }}
              className={`auth-mode-tab manager-tab ${authMode === 'login' && loginRole === 'manager' ? 'active manager-tab-active' : ''}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '4px' }}>manage_accounts</span>
              {t('auth.tabs.manager')}
            </button>
          </div>

          {/* Auth Card */}
          <div className="auth-card">
            {authMode === 'login' && loginRole === 'customer' && (
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
            {authMode === 'login' && loginRole === 'manager' && !managerForgotActive && (
              <ManagerLoginForm
                loginData={loginData}
                errors={errors}
                loading={loading}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleLoginChange={handleLoginChange}
                handleManagerLoginSubmit={handleManagerLoginSubmit}
                onForgotPassword={switchToManagerForgot}
              />
            )}
            {authMode === 'login' && loginRole === 'manager' && managerForgotActive && (
              <ForgotPasswordForm
                forgotPasswordEmail={forgotPasswordEmail}
                setForgotPasswordEmail={setForgotPasswordEmail}
                forgotPasswordSuccess={forgotPasswordSuccess}
                setForgotPasswordSuccess={setForgotPasswordSuccess}
                errors={errors}
                setErrors={setErrors}
                loading={loading}
                handleForgotPasswordSubmit={handleManagerForgotPasswordSubmit}
                switchAuthMode={(mode) => {
                  if (mode === 'login') {
                    switchBackFromManagerForgot();
                  } else {
                    switchAuthMode(mode);
                  }
                }}
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

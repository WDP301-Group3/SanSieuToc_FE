/**
 * @fileoverview Custom hook cho AuthPage
 * 
 * Quản lý state, validation, và submit handlers cho Login, Register, Forgot Password
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import authService from '../../services/authService';

const useAuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const notification = useNotification();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const getInitialAuthMode = () => {
    const path = location.pathname;
    if (path.includes('register')) return 'register';
    if (path.includes('forgot-password')) return 'forgot-password';
    return 'login';
  };

  const [authMode, setAuthMode] = useState(getInitialAuthMode());
  const [loginRole, setLoginRole] = useState('customer'); // 'customer' | 'manager'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
  });

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // ============================================================================
  // EFFECTS
  // ============================================================================

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

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setErrors({});
    setForgotPasswordSuccess(false);

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

  const validateRegisterForm = () => {
    const newErrors = {};

    if (!registerData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    } else if (registerData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (!registerData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!registerData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (registerData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(registerData.password)) {
      newErrors.password = 'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&#)';
    }

    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!registerData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (!/^(0|\+84)[0-9]{9,10}$/.test(registerData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0901234567)';
    }

    if (!registerData.agreeToTerms) {
      newErrors.agreeToTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!loginData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    if (!loginData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        email: loginData.email.trim(),
        password: loginData.password,
      });

      if (!response.success) {
        setErrors({ submit: response.message || 'Đăng nhập thất bại.' });
        setLoading(false);
        return;
      }

      const { customer, token, accessToken } = response.data;
      const userData = {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        image: customer.image || 'https://via.placeholder.com/100',
        role: 'customer',
      };

      login(userData, token || accessToken);
      notification.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      setErrors({ submit: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.' });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManagerLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!loginData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    if (!loginData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.loginManager({
        email: loginData.email.trim(),
        password: loginData.password,
      });

      if (!response.success) {
        setErrors({ submit: response.message || 'Đăng nhập thất bại.' });
        setLoading(false);
        return;
      }

      const { manager, token, accessToken } = response.data;
      const userData = {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        phone: manager.phone || '',
        image: manager.image || '',
        imageQR: manager.imageQR || null,
        role: 'manager',          // luôn đặt cứng — BE không trả về role
      };

      login(userData, token || accessToken);
      notification.success('Đăng nhập thành công! Chào mừng trở lại.');
      navigate('/admin/dashboard');
    } catch (error) {
      setErrors({ submit: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.' });
      console.error('Manager login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    setLoading(true);
    try {
      const response = await authService.register({
        name: registerData.username.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
        phone: registerData.phone.trim(),
      });

      if (!response.success) {
        setErrors({ submit: response.message || 'Đăng ký thất bại.' });
        setLoading(false);
        return;
      }

      const { customer, token } = response.data;
      const userData = {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        image: customer.image || 'https://via.placeholder.com/100',
        role: 'customer',
      };

      login(userData, token);
      notification.success('Đăng ký thành công! Chào mừng bạn đến với Sân Siêu Tốc.');
      navigate('/');
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ submit: error.message || 'Đăng ký thất bại. Vui lòng thử lại.' });
      }
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(forgotPasswordEmail)) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await authService.resetPassword(forgotPasswordEmail.trim());
      if (!response.success) {
        setErrors({ submit: response.message || 'Có lỗi xảy ra.' });
        setLoading(false);
        return;
      }
      setForgotPasswordSuccess(true);
    } catch (error) {
      setErrors({ submit: error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
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
    handleLoginChange,
    handleRegisterChange,
    switchAuthMode,
    handleLoginSubmit,
    handleManagerLoginSubmit,
    handleRegisterSubmit,
    handleForgotPasswordSubmit,
  };
};

export default useAuthPage;

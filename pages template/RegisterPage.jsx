import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
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

  const handleSocialRegister = (provider) => {
    // TODO: Implement social registration
    alert(`Tính năng đăng ký bằng ${provider} đang được phát triển`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Hero Visual Section */}
          <div className="hidden lg:flex flex-col gap-8">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <img
                alt="Sân vận động cỏ nhân tạo hiện đại"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=1000&fit=crop"
              />
              <div className="absolute bottom-10 left-10 right-10 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-4">
                  <span className="material-icons-outlined text-sm">bolt</span>
                  ĐẶT SÂN NHANH CHÓNG
                </div>
                <h2 className="text-4xl font-black text-white leading-tight mb-4">
                  Nâng tầm trận đấu,<br />kết nối đam mê.
                </h2>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Tham gia cộng đồng người chơi thể thao lớn nhất. Đặt sân dễ dàng chỉ với vài cú chạm.
                </p>
              </div>
            </div>
          </div>

          {/* Registration Form Card */}
          <div className="bg-white dark:bg-gray-900/50 dark:border dark:border-gray-800 p-8 sm:p-10 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-8">
              <h2 className="text-background-dark dark:text-white text-3xl font-extrabold mb-2">
                Tạo tài khoản mới
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Chào mừng bạn! Hãy điền các thông tin dưới đây để bắt đầu.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Username & Email */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <span className="material-icons-outlined text-base">person</span>
                    Tên đăng nhập
                  </label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="johndoe"
                    type="text"
                    required
                  />
                  {errors.username && <span className="text-xs text-red-600">{errors.username}</span>}
                </div>

                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <span className="material-icons-outlined text-base">email</span>
                    Email
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="john@example.com"
                    type="email"
                    required
                  />
                  {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
                </div>
              </div>

              {/* Full Name & Phone */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <span className="material-icons-outlined text-base">call</span>
                    Số điện thoại
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="0901234567"
                    type="tel"
                  />
                  {errors.phone && <span className="text-xs text-red-600">{errors.phone}</span>}
                </div>
              </div>

              {/* Password Fields */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <span className="material-icons-outlined text-base">lock</span>
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input h-12 w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary pr-10"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      required
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                      type="button"
                    >
                      <span className="material-icons-outlined text-sm">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {errors.password && <span className="text-xs text-red-600">{errors.password}</span>}
                </div>

                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <span className="material-icons-outlined text-base">check_circle</span>
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-input h-12 w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary pr-10"
                      placeholder="••••••••"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                      type="button"
                    >
                      <span className="material-icons-outlined text-sm">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="text-xs text-red-600">{errors.confirmPassword}</span>}
                </div>
              </div>


              {/* Terms Checkbox */}
              <div className="flex items-start gap-2">
                <input
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  id="terms"
                  type="checkbox"
                />
                <label className="text-sm text-gray-600 dark:text-gray-400" htmlFor="terms">
                  Tôi đồng ý với{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Điều khoản sử dụng
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && <span className="text-xs text-red-600 -mt-3">{errors.agreeToTerms}</span>}

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center rounded-lg h-14 px-4 bg-primary text-white dark:text-green-900 text-base font-bold hover:brightness-105 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
              </button>

              {/* Social Register Separator */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
              </div>

            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-[10%] right-[5%] w-64 h-64 bg-primary/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default RegisterPage;

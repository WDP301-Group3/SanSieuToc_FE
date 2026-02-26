import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserMemberTier } from '../../data/mockData';
import '../../styles/UserSettingsPage.css';

const UserSettingsPage = () => {
  const { user, logout } = useAuth();

  const memberTier = useMemo(() => {
    if (!user?.id) return { name: 'Thành viên Đồng', color: '#cd7f32' };
    return getUserMemberTier(user.id);
  }, [user]);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
  });

  const [language, setLanguage] = useState('vi');

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const menuItems = [
    { key: 'profile', icon: 'person', label: 'Thông tin cá nhân', to: '/profile' },
    { key: 'bookings', icon: 'calendar_month', label: 'Lịch sử đặt sân', to: '/booking-history' },
    
    { key: 'settings', icon: 'settings', label: 'Cài đặt', to: '/settings' },
  ];

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };

  const handlePasswordFormChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setPasswordError('');
    setPasswordSuccess(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }

    // TODO: Call API to change password
    console.log('Password changed:', passwordForm);
    setPasswordError('');
    setPasswordSuccess(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSuccessContinue = () => {
    setShowPasswordModal(false);
    setPasswordSuccess(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-layout">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          <div className="settings-sidebar-card">
            {/* User Brief */}
            <div className="settings-user-brief">
              <div className="settings-avatar-wrapper">
                <img
                  src={user?.image || 'https://via.placeholder.com/100'}
                  alt="User Avatar"
                  className="settings-avatar"
                />
                <button className="bh-avatar-edit">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <h1 className="settings-user-name">{user?.name || 'Nguyen Van A'}</h1>
              <span
                className="settings-user-badge"
                style={{ backgroundColor: memberTier.color, color: '#fff' }}
              >
                {memberTier.name}
              </span>
            </div>

            {/* Navigation */}
            <nav className="settings-nav">
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`settings-nav-item ${item.key === 'settings' ? 'active' : ''}`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <p>{item.label}</p>
                </Link>
              ))}
              <div className="settings-nav-divider" />
              <button className="settings-nav-item logout" onClick={logout}>
                <span className="material-symbols-outlined">logout</span>
                <p>Đăng xuất</p>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="settings-main">
          <h2 className="settings-page-title">Cài đặt</h2>

          {/* Notifications Section */}
          <section className="settings-section">
            <div className="settings-section-header">
              <h3 className="settings-section-title">
                <span className="material-symbols-outlined">notifications</span>
                Thông báo
              </h3>
              <p className="settings-section-desc">
                Quản lý cách bạn nhận thông tin về lịch đặt sân và ưu đãi.
              </p>
            </div>
            <div className="settings-section-body">
              {/* Email */}
              <div className="settings-toggle-row">
                <div>
                  <p className="settings-toggle-label">Thông báo qua Email</p>
                  <p className="settings-toggle-desc">Nhận xác nhận đặt sân và hóa đơn qua email.</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                    className="sr-only peer"
                  />
                  <div className="settings-toggle-track" />
                </label>
              </div>

              {/* SMS */}
              <div className="settings-toggle-row bordered">
                <div>
                  <p className="settings-toggle-label">Thông báo qua SMS</p>
                  <p className="settings-toggle-desc">Nhận mã nhắc nhở giờ đá qua tin nhắn điện thoại.</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={() => handleNotificationChange('sms')}
                    className="sr-only peer"
                  />
                  <div className="settings-toggle-track" />
                </label>
              </div>

              {/* Push */}
              <div className="settings-toggle-row bordered">
                <div>
                  <p className="settings-toggle-label">Thông báo trên Ứng dụng</p>
                  <p className="settings-toggle-desc">Thông báo đẩy trực tiếp trên trình duyệt hoặc điện thoại.</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                    className="sr-only peer"
                  />
                  <div className="settings-toggle-track" />
                </label>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="settings-section">
            <div className="settings-section-header">
              <h3 className="settings-section-title">
                <span className="material-symbols-outlined">security</span>
                Bảo mật
              </h3>
              <p className="settings-section-desc">
                Bảo vệ tài khoản và thông tin cá nhân của bạn.
              </p>
            </div>
            <div className="settings-section-body">
              {/* Password */}
              <div className="settings-toggle-row">
                <div>
                  <p className="settings-toggle-label">Mật khẩu</p>
                  <p className="settings-toggle-desc">Thay đổi mật khẩu đăng nhập thường xuyên để bảo mật.</p>
                </div>
                <button className="settings-btn-outline" onClick={handleChangePassword}>
                  Đổi mật khẩu
                </button>
              </div>

              {/* 2FA */}
              <div className="settings-toggle-row bordered">
                <div>
                  <p className="settings-toggle-label">Xác thực 2 yếu tố (2FA)</p>
                  <p className="settings-toggle-desc">Thêm một lớp bảo mật khi đăng nhập.</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={security.twoFactor}
                    onChange={() => setSecurity((prev) => ({ ...prev, twoFactor: !prev.twoFactor }))}
                    className="sr-only peer"
                  />
                  <div className="settings-toggle-track" />
                </label>
              </div>
            </div>
          </section>

          {/* Language Section */}
          <section className="settings-section">
            <div className="settings-section-header">
              <h3 className="settings-section-title">
                <span className="material-symbols-outlined">language</span>
                Ngôn ngữ
              </h3>
            </div>
            <div className="settings-section-body">
              <div className="settings-language-select">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="settings-select"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={handleClosePasswordModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            {passwordSuccess ? (
              /* Success Popup */
              <div className="modal-success-popup">
                <div className="modal-success-icon">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <h3 className="modal-success-title">Đổi mật khẩu thành công!</h3>
                <p className="modal-success-desc">
                  Mật khẩu của bạn đã được cập nhật an toàn. Vui lòng sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.
                </p>
                <button className="modal-success-btn" onClick={handleSuccessContinue}>
                  Tiếp tục
                </button>
              </div>
            ) : (
              /* Password Form */
              <>
                {/* Modal Header */}
                <div className="modal-header">
                  <h3 className="modal-title">
                    <span className="material-symbols-outlined">lock</span>
                    Đổi mật khẩu
                  </h3>
                  <button className="modal-close-btn" onClick={handleClosePasswordModal}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handlePasswordSubmit} className="modal-body">
                  {passwordError && (
                    <div className="modal-error">
                      <span className="material-symbols-outlined">error</span>
                      {passwordError}
                    </div>
                  )}

                  {/* Current Password */}
                  <div className="modal-field">
                    <label className="modal-label">Mật khẩu hiện tại</label>
                    <div className="modal-input-wrapper">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                        className="modal-input"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button
                        type="button"
                        className="modal-toggle-password"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        <span className="material-symbols-outlined">
                          {showCurrentPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="modal-field">
                    <label className="modal-label">Mật khẩu mới</label>
                    <div className="modal-input-wrapper">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                        className="modal-input"
                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                      />
                      <button
                        type="button"
                        className="modal-toggle-password"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <span className="material-symbols-outlined">
                          {showNewPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="modal-field">
                    <label className="modal-label">Xác nhận mật khẩu mới</label>
                    <div className="modal-input-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                        className="modal-input"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        className="modal-toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <span className="material-symbols-outlined">
                          {showConfirmPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="modal-actions">
                    <button type="button" className="modal-btn-cancel" onClick={handleClosePasswordModal}>
                      Hủy
                    </button>
                    <button type="submit" className="modal-btn-submit">
                      Xác nhận
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettingsPage;

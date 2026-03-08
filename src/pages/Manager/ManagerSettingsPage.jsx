/**
 * ManagerSettingsPage
 * Trang cài đặt riêng cho Manager: đổi mật khẩu, thông tin cá nhân, giao diện
 */
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import authService from '../../services/authService';
import { getUserAvatar } from '../../utils/defaultAvatar';
import '../../styles/ManagerSettingsPage.css';

// ─── Password Field with toggle ────────────────────────────────────────────
const PasswordInput = ({ label, name, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="ms-form-field">
      <label className="ms-form-label">{label}</label>
      <div className="ms-input-wrapper">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          className="ms-input"
          placeholder={placeholder}
          autoComplete="off"
        />
        <button
          type="button"
          className="ms-toggle-password"
          onClick={() => setShow((s) => !s)}
        >
          <span className="material-symbols-outlined">
            {show ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
const ManagerSettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const notification = useNotification();

  // ── Password form state ──
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm((prev) => ({ ...prev, [name]: value }));
    setPwError('');
    setPwSuccess(false);
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwError('');

    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmNewPassword) {
      setPwError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/.test(pwForm.newPassword)) {
      setPwError('Mật khẩu mới phải có chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&#).');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setPwError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setPwLoading(true);
    try {
      const response = await authService.changePasswordManager({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmNewPassword: pwForm.confirmNewPassword,
      });

      if (!response.success) {
        setPwError(response.message || 'Đổi mật khẩu thất bại.');
        return;
      }

      setPwSuccess(true);
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      notification.success('Đổi mật khẩu thành công!');
    } catch (err) {
      setPwError(err.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="ms-page">
      

      <div className="ms-grid">
        {/* ── Profile Info Card ── */}
        <section className="ms-card">
          <div className="ms-card-header">
            <span className="material-symbols-outlined ms-card-icon">manage_accounts</span>
            <h2 className="ms-card-title">Thông tin tài khoản</h2>
          </div>
          <div className="ms-profile-row">
            <img
              src={getUserAvatar(user?.image, user?.name)}
              alt={user?.name}
              className="ms-avatar"
            />
            <div className="ms-profile-info">
              <p className="ms-profile-name">{user?.name || 'Manager'}</p>
              <p className="ms-profile-email">{user?.email || ''}</p>
              {user?.phone && (
                <p className="ms-profile-phone">
                  <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'middle', marginRight: 4 }}>phone</span>
                  {user.phone}
                </p>
              )}
              <span className="ms-role-badge">
                <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>verified</span>
                Chủ sân
              </span>
            </div>
          </div>
        </section>

        {/* ── Appearance Card ── */}
        <section className="ms-card">
          <div className="ms-card-header">
            <span className="material-symbols-outlined ms-card-icon">palette</span>
            <h2 className="ms-card-title">Giao diện</h2>
          </div>
          <div className="ms-setting-row">
            <div>
              <p className="ms-setting-label">Chế độ tối</p>
              <p className="ms-setting-desc">Chuyển đổi giữa giao diện sáng và tối</p>
            </div>
            <button
              type="button"
              className={`ms-toggle-btn ${isDark ? 'active' : ''}`}
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              <span className="ms-toggle-knob" />
            </button>
          </div>
          <div className="ms-setting-row">
            <div>
              <p className="ms-setting-label">Chế độ hiện tại</p>
              <p className="ms-setting-desc">{isDark ? '🌙 Tối' : '☀️ Sáng'}</p>
            </div>
            <span className="material-symbols-outlined ms-theme-icon">
              {isDark ? 'dark_mode' : 'light_mode'}
            </span>
          </div>
        </section>

        {/* ── Change Password Card ── */}
        <section className="ms-card ms-card-full">
          <div className="ms-card-header">
            <span className="material-symbols-outlined ms-card-icon">lock</span>
            <h2 className="ms-card-title">Đổi mật khẩu</h2>
          </div>
          <p className="ms-card-desc">
            Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
          </p>

          {pwSuccess && (
            <div className="ms-success-banner">
              <span className="material-symbols-outlined">check_circle</span>
              Mật khẩu đã được cập nhật thành công!
            </div>
          )}
          {pwError && (
            <div className="ms-error-banner">
              <span className="material-symbols-outlined">error</span>
              {pwError}
            </div>
          )}

          <form onSubmit={handlePwSubmit} className="ms-pw-form">
            <PasswordInput
              label="Mật khẩu hiện tại"
              name="currentPassword"
              value={pwForm.currentPassword}
              onChange={handlePwChange}
              placeholder="Nhập mật khẩu hiện tại"
            />
            <div className="ms-pw-row">
              <PasswordInput
                label="Mật khẩu mới"
                name="newPassword"
                value={pwForm.newPassword}
                onChange={handlePwChange}
                placeholder="Ít nhất 8 ký tự"
              />
              <PasswordInput
                label="Xác nhận mật khẩu mới"
                name="confirmNewPassword"
                value={pwForm.confirmNewPassword}
                onChange={handlePwChange}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            <div className="ms-pw-actions">
              <button
                type="button"
                className="ms-btn-cancel"
                onClick={() => {
                  setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                  setPwError('');
                  setPwSuccess(false);
                }}
              >
                Hủy
              </button>
              <button type="submit" className="ms-btn-submit" disabled={pwLoading}>
                {pwLoading ? (
                  <><span className="ms-spinner" /> Đang xử lý...</>
                ) : (
                  <><span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>save</span> Cập nhật mật khẩu</>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ManagerSettingsPage;

/**
 * UserSidebar Component
 * Sidebar navigation cho User Dashboard
 */
import { useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { getUserAvatar } from '../../../utils/defaultAvatar';
import authService from '../../../services/authService';

const UserSidebar = ({ activeTab, onTabChange, userName, userImage }) => {
  const { logout, updateUser, user } = useAuth();
  const notification = useNotification();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const menuItems = [
    { key: 'profile', icon: 'person', label: 'Thông tin cá nhân' },
    { key: 'bookings', icon: 'calendar_month', label: 'Lịch sử đặt sân' },
    { key: 'settings', icon: 'settings', label: 'Cài đặt' },
  ];

  /**
   * Convert file to base64 string
   */
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /**
   * Handle avatar file selection and upload
   */
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      notification.error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notification.error('Kích thước ảnh tối đa là 5MB');
      return;
    }

    setUploading(true);
    try {
      // Convert to base64
      const base64 = await fileToBase64(file);

      // Call API to update profile with new image
      const response = await authService.updateProfile({
        name: user?.name || userName,
        image: base64,
      });

      if (response.success) {
        // Update user in AuthContext
        const updatedCustomer = response.data?.customer;
        updateUser({
          ...user,
          image: updatedCustomer?.image || base64,
        });
        notification.success('Cập nhật ảnh đại diện thành công!');
      } else {
        notification.error(response.message || 'Cập nhật ảnh thất bại');
      }
    } catch (error) {
      notification.error(error.message || 'Lỗi khi tải ảnh lên. Vui lòng thử lại.');
      console.error('Avatar upload error:', error);
    } finally {
      setUploading(false);
      // Reset file input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const avatarUrl = getUserAvatar(userImage, userName);

  return (
    <aside className="user-dashboard-sidebar">
      <div className="user-dashboard-sidebar-card">
        {/* User Brief */}
        <div className="user-dashboard-user-brief">
          <div className="user-dashboard-avatar-wrapper" onClick={() => !uploading && fileInputRef.current?.click()}>
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="user-dashboard-avatar"
            />
            {uploading ? (
              <div className="user-dashboard-avatar-edit uploading">
                <span className="material-symbols-outlined avatar-spin">progress_activity</span>
              </div>
            ) : (
              <button className="user-dashboard-avatar-edit" type="button">
                <span className="material-symbols-outlined">photo_camera</span>
              </button>
            )}
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </div>
          <h1 className="user-dashboard-user-name">{userName}</h1>
        </div>

        {/* Navigation */}
        <nav className="user-dashboard-nav">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`user-dashboard-nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => onTabChange(item.key)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <p>{item.label}</p>
            </button>
          ))}
          <div className="user-dashboard-nav-divider" />
          <button className="user-dashboard-nav-item logout" onClick={logout}>
            <span className="material-symbols-outlined">logout</span>
            <p>Đăng xuất</p>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default UserSidebar;

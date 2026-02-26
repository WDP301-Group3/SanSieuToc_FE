import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getBookingsByUserID,
  getUserMemberTier,
  BOOKING_ORDER_STATUS,
} from '../../data/mockData';
import '../../styles/UserProfilePage.css';

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || 'TP. Hồ Chí Minh, Việt Nam',
  });

  // Get real data from mockData
  const allBookings = useMemo(() => {
    if (!user?.id) return [];
    return getBookingsByUserID(user.id);
  }, [user]);

  const memberTier = useMemo(() => {
    if (!user?.id) return { name: 'Thành viên Đồng', color: '#cd7f32' };
    return getUserMemberTier(user.id);
  }, [user]);

  // Upcoming bookings = confirmed + pending only
  const upcomingBookings = useMemo(() => {
    return allBookings
      .filter((b) => b.status === BOOKING_ORDER_STATUS.CONFIRMED || b.status === BOOKING_ORDER_STATUS.PENDING)
      .slice(0, 4);
  }, [allBookings]);

  const menuItems = [
    { key: 'profile', icon: 'person', label: 'Thông tin cá nhân', to: '/profile' },
    { key: 'bookings', icon: 'calendar_month', label: 'Lịch sử đặt sân', to: '/booking-history' },
    
    { key: 'settings', icon: 'settings', label: 'Cài đặt', to: '/settings' },
  ];

  // Format helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case BOOKING_ORDER_STATUS.CONFIRMED:
        return { className: 'confirmed', label: 'Đã xác nhận' };
      case BOOKING_ORDER_STATUS.COMPLETED:
        return { className: 'completed', label: 'Đã hoàn thành' };
      case BOOKING_ORDER_STATUS.CANCELLED:
        return { className: 'cancelled', label: 'Đã hủy' };
      case BOOKING_ORDER_STATUS.PENDING:
        return { className: 'pending', label: 'Chờ xác nhận' };
      default:
        return { className: '', label: status };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: Call API to update user profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: user?.address || 'TP. Hồ Chí Minh, Việt Nam',
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-sidebar-card">
            {/* User Brief */}
            <div className="profile-user-brief">
              <div className="profile-avatar-wrapper">
                <img
                  src={user?.image || 'https://via.placeholder.com/100'}
                  alt="User Avatar"
                  className="profile-avatar"
                />
                <button className="profile-avatar-edit">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <h1 className="profile-user-name">{formData.name}</h1>
              <span
                className="profile-user-badge"
                style={{ backgroundColor: memberTier.color, color: '#fff' }}
              >
                {memberTier.name}
              </span>
            </div>

            {/* Navigation Menu */}
            <nav className="profile-nav">
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`profile-nav-item ${activeTab === item.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.key)}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <p>{item.label}</p>
                </Link>
              ))}

              <div className="profile-nav-divider" />

              <button className="profile-nav-item logout" onClick={logout}>
                <span className="material-symbols-outlined">logout</span>
                <p>Đăng xuất</p>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          {/* Personal Info Section */}
          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Thông tin cá nhân</h2>
              {!isEditing && (
                <button
                  className="profile-edit-link"
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh sửa
                </button>
              )}
            </div>

            <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
              <div className="profile-form-grid">
                <label className="profile-form-field">
                  <p className="profile-form-label">Họ và tên</p>
                  <input
                    name="name"
                    type="text"
                    className="profile-form-input"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </label>

                <label className="profile-form-field">
                  <p className="profile-form-label">Số điện thoại</p>
                  <input
                    name="phone"
                    type="tel"
                    className="profile-form-input"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </label>

                <label className="profile-form-field">
                  <p className="profile-form-label">Email</p>
                  <input
                    name="email"
                    type="email"
                    className="profile-form-input"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </label>

                <label className="profile-form-field">
                  <p className="profile-form-label">Địa chỉ</p>
                  <input
                    name="address"
                    type="text"
                    className="profile-form-input"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </label>
              </div>

              {isEditing && (
                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCancel}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    className="btn-save"
                    onClick={handleSave}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </form>
          </section>

          {/* Upcoming Bookings Section */}
          <section className="profile-bookings-section">
            <div className="profile-bookings-header">
              <h3 className="profile-bookings-title">Lịch đặt sân sắp tới</h3>
              <Link to="/booking-history" className="profile-view-all">
                Xem tất cả
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

            <div className="profile-bookings-list">
              {upcomingBookings.length === 0 ? (
                <div className="profile-bookings-empty">
                  <span className="material-symbols-outlined">event_busy</span>
                  <p>Chưa có lịch đặt sân nào</p>
                </div>
              ) : (
                upcomingBookings.map((booking) => {
                  const statusInfo = getStatusInfo(booking.status);
                  return (
                    <div
                      key={booking._id}
                      className="profile-booking-card"
                    >
                      <div
                        className="profile-booking-image"
                        style={{ backgroundImage: `url(${booking.fieldImage})` }}
                      />
                      <div className="profile-booking-info">
                        <div className="profile-booking-badges">
                          <span className={`profile-booking-status ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                          <span className="profile-booking-code">Mã: #{booking.bookingCode}</span>
                        </div>
                        <h4 className="profile-booking-name">{booking.fieldName}</h4>
                        <div className="profile-booking-meta">
                          <div className="profile-booking-meta-item">
                            <span className="material-symbols-outlined">calendar_today</span>
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className="profile-booking-meta-item">
                            <span className="material-symbols-outlined">schedule</span>
                            <span>{booking.startTime} - {booking.endTime}</span>
                          </div>
                          <div className="profile-booking-meta-item price">
                            <span className="material-symbols-outlined">payments</span>
                            <span>{booking.totalPrice.toLocaleString('vi-VN')}đ</span>
                          </div>
                        </div>
                      </div>
                      <div className="profile-booking-actions">
                        <button className="btn-detail" onClick={() => navigate(`/booking-history/${booking._id}`)}>Chi tiết</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;

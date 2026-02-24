import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/UserProfilePage.css';

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Nguyen Van A',
    phone: user?.phone || '0912 345 678',
    email: user?.email || 'nguyenvana@example.com',
    address: user?.address || 'TP. Hồ Chí Minh, Việt Nam',
  });

  const menuItems = [
    { key: 'profile', icon: 'person', label: 'Thông tin cá nhân', to: '/profile' },
    { key: 'bookings', icon: 'calendar_month', label: 'Lịch sử đặt sân', to: '/booking-history' },
    { key: 'payment', icon: 'credit_card', label: 'Phương thức thanh toán', to: '#' },
    { key: 'settings', icon: 'settings', label: 'Cài đặt', to: '/settings' },
  ];

  const upcomingBookings = [
    {
      id: 'BK-8821',
      name: 'Sân Bóng Đá Mini 7 Người - Khu A',
      date: '12/10/2023',
      time: '18:00 - 19:30',
      price: '300.000đ',
      status: 'confirmed',
      statusText: 'Đã xác nhận',
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400',
    },
    {
      id: 'BK-7742',
      name: 'Sân Cầu Lông Số 3',
      date: '05/10/2023',
      time: '09:00 - 11:00',
      price: '150.000đ',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
    },
  ];

  const stats = [
    { icon: 'sports_soccer', label: 'Tổng số trận', value: '24' },
    { icon: 'loyalty', label: 'Điểm tích lũy', value: '1,250' },
    { icon: 'savings', label: 'Tiết kiệm được', value: '500k' },
  ];

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
      name: user?.name || 'Nguyen Van A',
      phone: user?.phone || '0912 345 678',
      email: user?.email || 'nguyenvana@example.com',
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
              <span className="profile-user-badge">Thành viên Vàng</span>
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
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`profile-booking-card ${booking.status === 'completed' ? 'completed' : ''}`}
                >
                  <div
                    className={`profile-booking-image ${booking.status === 'completed' ? 'grayscale' : ''}`}
                    style={{ backgroundImage: `url(${booking.image})` }}
                  />
                  <div className="profile-booking-info">
                    <div className="profile-booking-badges">
                      <span className={`profile-booking-status ${booking.status}`}>
                        {booking.statusText}
                      </span>
                      <span className="profile-booking-code">Mã: #{booking.id}</span>
                    </div>
                    <h4 className="profile-booking-name">{booking.name}</h4>
                    <div className="profile-booking-meta">
                      <div className="profile-booking-meta-item">
                        <span className="material-symbols-outlined">calendar_today</span>
                        <span>{booking.date}</span>
                      </div>
                      <div className="profile-booking-meta-item">
                        <span className="material-symbols-outlined">schedule</span>
                        <span>{booking.time}</span>
                      </div>
                      {booking.price && (
                        <div className="profile-booking-meta-item price">
                          <span className="material-symbols-outlined">payments</span>
                          <span>{booking.price}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="profile-booking-actions">
                    {booking.status === 'confirmed' ? (
                      <button className="btn-detail" onClick={() => navigate(`/booking-history/${booking.id}`)}>Chi tiết</button>

                    ) : (
                      <button className="btn-rebook">Đặt lại</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Statistics Section */}
          <section className="profile-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="profile-stat-card">
                <div className="profile-stat-icon">
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <div>
                  <p className="profile-stat-label">{stat.label}</p>
                  <p className="profile-stat-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;

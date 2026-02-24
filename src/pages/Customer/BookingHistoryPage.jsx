import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/BookingHistoryPage.css';

const BookingHistoryPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  // Mock data — TODO: replace with API call
  const allBookings = [
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
      name: 'Sân Cầu Lông Số 3 - Nhà thi đấu Tân Bình',
      date: '05/10/2023',
      time: '09:00 - 11:00',
      price: '150.000đ',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
    },
    {
      id: 'BK-7120',
      name: 'Sân Bóng Đá Mini 7 Người - Khu B',
      date: '01/10/2023',
      time: '17:00 - 18:30',
      price: '300.000đ',
      status: 'cancelled',
      statusText: 'Đã hủy',
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400',
    },
    {
      id: 'BK-6905',
      name: 'Sân Tennis - Sân Số 1',
      date: '25/09/2023',
      time: '20:00 - 22:00',
      price: '450.000đ',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
    },
  ];

  const menuItems = [
    { key: 'profile', icon: 'person', label: 'Thông tin cá nhân', to: '/profile' },
    { key: 'bookings', icon: 'calendar_month', label: 'Lịch sử đặt sân', to: '/booking-history' },
    { key: 'payment', icon: 'credit_card', label: 'Phương thức thanh toán', to: '#' },
    { key: 'settings', icon: 'settings', label: 'Cài đặt', to: '/settings' },
  ];

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'upcoming', label: 'Sắp tới' },
    { key: 'completed', label: 'Đã hoàn thành' },
  ];

  const filteredBookings = allBookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return b.status === 'confirmed';
    if (activeTab === 'completed') return b.status === 'completed';
    return true;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="bh-page">
      <div className="bh-page-layout">
        {/* Sidebar */}
        <aside className="bh-sidebar">
          <div className="bh-sidebar-card">
            {/* User Brief */}
            <div className="bh-user-brief">
              <div className="bh-avatar-wrapper">
                <img
                  src={user?.image || 'https://via.placeholder.com/100'}
                  alt="User Avatar"
                  className="bh-avatar"
                />
                <button className="bh-avatar-edit">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <h1 className="bh-user-name">{user?.name || 'Nguyen Van A'}</h1>
              <span className="bh-user-badge">Thành viên Vàng</span>
            </div>

            {/* Navigation */}
            <nav className="bh-nav">
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`bh-nav-item ${item.key === 'bookings' ? 'active' : ''}`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <p>{item.label}</p>
                </Link>
              ))}
              <div className="bh-nav-divider" />
              <button className="bh-nav-item logout" onClick={logout}>
                <span className="material-symbols-outlined">logout</span>
                <p>Đăng xuất</p>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="bh-main">
          <section className="bh-content-card">
            {/* Header + Tabs */}
            <div className="bh-content-header">
              <h2 className="bh-content-title">Lịch sử đặt sân</h2>
              <div className="bh-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`bh-tab ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking List */}
            <div className="bh-booking-list">
              {filteredBookings.length === 0 ? (
                <div className="bh-empty">
                  <span className="material-symbols-outlined bh-empty-icon">event_busy</span>
                  <p>Không có đơn đặt sân nào</p>
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`bh-booking-card ${booking.status === 'cancelled' ? 'cancelled' : ''}`}
                  >
                    <div
                      className={`bh-booking-img ${booking.status === 'cancelled' ? 'grayscale' : ''}`}
                      style={{ backgroundImage: `url(${booking.image})` }}
                    />
                    <div className={`bh-booking-info ${booking.status === 'cancelled' ? 'dimmed' : ''}`}>
                      <div className="bh-booking-badges">
                        <span className={`bh-booking-status ${getStatusClass(booking.status)}`}>
                          {booking.statusText}
                        </span>
                        <span className="bh-booking-code">Mã đặt sân: #{booking.id}</span>
                      </div>
                      <h4 className="bh-booking-name">{booking.name}</h4>
                      <div className="bh-booking-meta">
                        <div className="bh-meta-item">
                          <span className="material-symbols-outlined">calendar_today</span>
                          <span>{booking.date}</span>
                        </div>
                        <div className="bh-meta-item">
                          <span className="material-symbols-outlined">schedule</span>
                          <span>{booking.time}</span>
                        </div>
                        <div className="bh-meta-item bh-meta-price">
                          <span className="material-symbols-outlined">payments</span>
                          <span>{booking.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bh-booking-actions">
                      {booking.status !== 'cancelled' && (
                        <Link to={`/booking-history/${booking.id}`} className="bh-btn-detail">
                          Chi tiết
                        </Link>
                      )}
                      {booking.status !== 'confirmed' && (
                        <button className="bh-btn-rebook">Đặt lại</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {filteredBookings.length > 0 && (
              <div className="bh-pagination">
                <button className="bh-page-btn">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="bh-page-btn active">1</button>
                <button className="bh-page-btn">2</button>
                <button className="bh-page-btn">3</button>
                <button className="bh-page-btn">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default BookingHistoryPage;

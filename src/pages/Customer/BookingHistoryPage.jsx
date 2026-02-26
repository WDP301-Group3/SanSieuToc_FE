import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getBookingsByUserID,
  getUserBookingStats,
  getUserMemberTier,
  BOOKING_ORDER_STATUS,
} from '../../data/mockData';
import '../../styles/BookingHistoryPage.css';

const ITEMS_PER_PAGE = 5;

const BookingHistoryPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Get bookings from mockData for logged-in user
  const allBookings = useMemo(() => {
    if (!user?.id) return [];
    return getBookingsByUserID(user.id);
  }, [user]);

  // Get user stats & tier
  const stats = useMemo(() => {
    if (!user?.id) return { total: 0, completed: 0, confirmed: 0, cancelled: 0, pending: 0, totalSpent: 0 };
    return getUserBookingStats(user.id);
  }, [user]);

  const memberTier = useMemo(() => {
    if (!user?.id) return { name: 'Thành viên Đồng', color: '#cd7f32' };
    return getUserMemberTier(user.id);
  }, [user]);

  const menuItems = [
    { key: 'profile', icon: 'person', label: 'Thông tin cá nhân', to: '/profile' },
    { key: 'bookings', icon: 'calendar_month', label: 'Lịch sử đặt sân', to: '/booking-history' },
    
    { key: 'settings', icon: 'settings', label: 'Cài đặt', to: '/settings' },
  ];

  const tabs = [
    { key: 'all', label: `Tất cả (${stats.total})` },
    { key: 'upcoming', label: `Sắp tới (${stats.confirmed + stats.pending})` },
    { key: 'completed', label: `Đã hoàn thành (${stats.completed})` },
    { key: 'cancelled', label: `Đã hủy (${stats.cancelled})` },
  ];

  // Filter bookings by tab
  const filteredBookings = useMemo(() => {
    let filtered = allBookings;
    if (activeTab === 'upcoming') {
      filtered = allBookings.filter((b) => b.status === BOOKING_ORDER_STATUS.CONFIRMED || b.status === BOOKING_ORDER_STATUS.PENDING);
    } else if (activeTab === 'completed') {
      filtered = allBookings.filter((b) => b.status === BOOKING_ORDER_STATUS.COMPLETED);
    } else if (activeTab === 'cancelled') {
      filtered = allBookings.filter((b) => b.status === BOOKING_ORDER_STATUS.CANCELLED);
    }
    return filtered;
  }, [allBookings, activeTab]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when tab changes
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  };

  // Map status to CSS class & Vietnamese label
  const getStatusInfo = (status) => {
    switch (status) {
      case BOOKING_ORDER_STATUS.CONFIRMED:
        return { className: 'status-confirmed', label: 'Đã xác nhận' };
      case BOOKING_ORDER_STATUS.COMPLETED:
        return { className: 'status-completed', label: 'Đã hoàn thành' };
      case BOOKING_ORDER_STATUS.CANCELLED:
        return { className: 'status-cancelled', label: 'Đã hủy' };
      case BOOKING_ORDER_STATUS.PENDING:
        return { className: 'status-pending', label: 'Chờ xác nhận' };
      default:
        return { className: '', label: status };
    }
  };

  // Format date from 'YYYY-MM-DD' to 'DD/MM/YYYY'
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
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
              <h1 className="bh-user-name">{user?.name || 'Người dùng'}</h1>
              <span
                className="bh-user-badge"
                style={{ backgroundColor: memberTier.color, color: '#fff' }}
              >
                {memberTier.name}
              </span>
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
          {/* Stats Summary */}
          <div className="bh-stats-row">
            <div className="bh-stat-card">
              <span className="material-symbols-outlined bh-stat-icon">confirmation_number</span>
              <div>
                <p className="bh-stat-value">{stats.total}</p>
                <p className="bh-stat-label">Tổng đơn</p>
              </div>
            </div>
            <div className="bh-stat-card">
              <span className="material-symbols-outlined bh-stat-icon completed">check_circle</span>
              <div>
                <p className="bh-stat-value">{stats.completed}</p>
                <p className="bh-stat-label">Hoàn thành</p>
              </div>
            </div>
            <div className="bh-stat-card">
              <span className="material-symbols-outlined bh-stat-icon cancelled">cancel</span>
              <div>
                <p className="bh-stat-value">{stats.cancelled}</p>
                <p className="bh-stat-label">Đã hủy</p>
              </div>
            </div>
            <div className="bh-stat-card">
              <span className="material-symbols-outlined bh-stat-icon spent">payments</span>
              <div>
                <p className="bh-stat-value">{stats.totalSpent.toLocaleString('vi-VN')}đ</p>
                <p className="bh-stat-label">Tổng chi tiêu</p>
              </div>
            </div>
          </div>

          <section className="bh-content-card">
            {/* Header + Tabs */}
            <div className="bh-content-header">
              <h2 className="bh-content-title">Lịch sử đặt sân</h2>
              <div className="bh-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`bh-tab ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => handleTabChange(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking List */}
            <div className="bh-booking-list">
              {paginatedBookings.length === 0 ? (
                <div className="bh-empty">
                  <span className="material-symbols-outlined bh-empty-icon">event_busy</span>
                  <p>Không có đơn đặt sân nào</p>
                </div>
              ) : (
                paginatedBookings.map((booking) => {
                  const statusInfo = getStatusInfo(booking.status);
                  const isCancelled = booking.status === BOOKING_ORDER_STATUS.CANCELLED;
                  return (
                    <div
                      key={booking._id}
                      className={`bh-booking-card ${isCancelled ? 'cancelled' : ''}`}
                    >
                      <div
                        className={`bh-booking-img ${isCancelled ? 'grayscale' : ''}`}
                        style={{ backgroundImage: `url(${booking.fieldImage})` }}
                      />
                      <div className={`bh-booking-info ${isCancelled ? 'dimmed' : ''}`}>
                        <div className="bh-booking-badges">
                          <span className={`bh-booking-status ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                          <span className="bh-booking-code">Mã đặt sân: #{booking.bookingCode}</span>
                        </div>
                        <h4
                          className="bh-booking-name"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/fields/${booking.fieldID}`)}
                        >
                          {booking.fieldName}
                        </h4>
                        <div className="bh-booking-meta">
                          <div className="bh-meta-item">
                            <span className="material-symbols-outlined">calendar_today</span>
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className="bh-meta-item">
                            <span className="material-symbols-outlined">schedule</span>
                            <span>{booking.startTime} - {booking.endTime}</span>
                          </div>
                          <div className="bh-meta-item bh-meta-price">
                            <span className="material-symbols-outlined">payments</span>
                            <span>{booking.totalPrice.toLocaleString('vi-VN')}đ</span>
                          </div>
                        </div>
                      </div>
                      <div className="bh-booking-actions">
                        {!isCancelled && (
                          <Link to={`/booking-history/${booking._id}`} className="bh-btn-detail">
                            Chi tiết
                          </Link>
                        )}
                        {booking.status === BOOKING_ORDER_STATUS.COMPLETED && (
                          <button
                            className="bh-btn-rebook"
                            onClick={() => navigate(`/fields/${booking.fieldID}`)}
                          >
                            Đặt lại
                          </button>
                        )}
                        {isCancelled && (
                          <button
                            className="bh-btn-rebook"
                            onClick={() => navigate(`/fields/${booking.fieldID}`)}
                          >
                            Đặt lại
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bh-pagination">
                <button
                  className="bh-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`bh-page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="bh-page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
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

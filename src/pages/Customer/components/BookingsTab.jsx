/**
 * BookingsTab Component
 * Tab hiển thị lịch sử đặt sân với filter và pagination
 */
import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BOOKING_ORDER_STATUS } from '../../../data/mockData';

const ITEMS_PER_PAGE = 5;

const BookingsTab = ({ allBookings, stats }) => {
  const navigate = useNavigate();
  
  const [bookingTab, setBookingTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Booking tabs config
  const bookingTabs = [
    { key: 'all', label: `Tất cả (${stats.total})` },
    { key: 'upcoming', label: `Sắp tới (${stats.confirmed + stats.pending})` },
    { key: 'completed', label: `Đã hoàn thành (${stats.completed})` },
    { key: 'cancelled', label: `Đã hủy (${stats.cancelled})` },
  ];

  // Filter bookings by tab
  const filteredBookings = useMemo(() => {
    let filtered = allBookings;
    if (bookingTab === 'upcoming') {
      filtered = allBookings.filter(
        (b) => b.status === BOOKING_ORDER_STATUS.CONFIRMED || b.status === BOOKING_ORDER_STATUS.PENDING
      );
    } else if (bookingTab === 'completed') {
      filtered = allBookings.filter((b) => b.status === BOOKING_ORDER_STATUS.COMPLETED);
    } else if (bookingTab === 'cancelled') {
      filtered = allBookings.filter((b) => b.status === BOOKING_ORDER_STATUS.CANCELLED);
    }
    return filtered;
  }, [allBookings, bookingTab]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleBookingTabChange = (tabKey) => {
    setBookingTab(tabKey);
    setCurrentPage(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

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

  return (
    <>
      {/* Stats Summary */}
      <div className="user-dashboard-stats-row">
        <div className="user-dashboard-stat-card">
          <span className="material-symbols-outlined user-dashboard-stat-icon">
            confirmation_number
          </span>
          <div>
            <p className="user-dashboard-stat-value">{stats.total}</p>
            <p className="user-dashboard-stat-label">Tổng đơn</p>
          </div>
        </div>
        <div className="user-dashboard-stat-card">
          <span className="material-symbols-outlined user-dashboard-stat-icon completed">
            check_circle
          </span>
          <div>
            <p className="user-dashboard-stat-value">{stats.completed}</p>
            <p className="user-dashboard-stat-label">Hoàn thành</p>
          </div>
        </div>
        <div className="user-dashboard-stat-card">
          <span className="material-symbols-outlined user-dashboard-stat-icon cancelled">
            cancel
          </span>
          <div>
            <p className="user-dashboard-stat-value">{stats.cancelled}</p>
            <p className="user-dashboard-stat-label">Đã hủy</p>
          </div>
        </div>
        <div className="user-dashboard-stat-card">
          <span className="material-symbols-outlined user-dashboard-stat-icon spent">
            payments
          </span>
          <div>
            <p className="user-dashboard-stat-value">
              {stats.totalSpent.toLocaleString('vi-VN')}đ
            </p>
            <p className="user-dashboard-stat-label">Tổng chi tiêu</p>
          </div>
        </div>
      </div>

      <section className="user-dashboard-content-card">
        {/* Header + Tabs */}
        <div className="user-dashboard-content-header">
          <h2 className="user-dashboard-content-title">Lịch sử đặt sân</h2>
          <div className="user-dashboard-tabs">
            {bookingTabs.map((tab) => (
              <button
                key={tab.key}
                className={`user-dashboard-tab ${bookingTab === tab.key ? 'active' : ''}`}
                onClick={() => handleBookingTabChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Booking List */}
        <div className="user-dashboard-booking-list">
          {paginatedBookings.length === 0 ? (
            <div className="user-dashboard-empty">
              <span className="material-symbols-outlined user-dashboard-empty-icon">
                event_busy
              </span>
              <p>Không có đơn đặt sân nào</p>
            </div>
          ) : (
            paginatedBookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              const isCancelled = booking.status === BOOKING_ORDER_STATUS.CANCELLED;
              return (
                <div
                  key={booking._id}
                  className={`user-dashboard-booking-card-full ${isCancelled ? 'cancelled' : ''}`}
                >
                  <div
                    className={`user-dashboard-booking-img ${isCancelled ? 'grayscale' : ''}`}
                    style={{ backgroundImage: `url(${booking.fieldImage})` }}
                  />
                  <div className={`user-dashboard-booking-info ${isCancelled ? 'dimmed' : ''}`}>
                    <div className="user-dashboard-booking-badges">
                      <span className={`user-dashboard-booking-status ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                      <span className="user-dashboard-booking-code">
                        Mã đặt sân: #{booking.bookingCode}
                      </span>
                    </div>
                    <h4
                      className="user-dashboard-booking-name"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/fields/${booking.fieldID}`)}
                    >
                      {booking.fieldName}
                    </h4>
                    <div className="user-dashboard-booking-meta">
                      <div className="user-dashboard-meta-item">
                        <span className="material-symbols-outlined">calendar_today</span>
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className="user-dashboard-meta-item">
                        <span className="material-symbols-outlined">schedule</span>
                        <span>
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                      <div className="user-dashboard-meta-item user-dashboard-meta-price">
                        <span className="material-symbols-outlined">payments</span>
                        <span>{booking.totalPrice.toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  </div>
                  <div className="user-dashboard-booking-actions">
                    {!isCancelled && (
                      <Link
                        to={`/booking-history/${booking._id}`}
                        className="user-dashboard-btn-detail"
                      >
                        Chi tiết
                      </Link>
                    )}
                    {(booking.status === BOOKING_ORDER_STATUS.COMPLETED || isCancelled) && (
                      <button
                        className="user-dashboard-btn-rebook"
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
          <div className="user-dashboard-pagination">
            <button
              className="user-dashboard-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`user-dashboard-page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="user-dashboard-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default BookingsTab;

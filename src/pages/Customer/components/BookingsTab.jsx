/**
 * BookingsTab Component
 * Tab hiển thị lịch sử đặt sân với filter và pagination
 * 
 * Data: Nhận booking từ API thật (BE getCustomerBookings)
 * BE response structure per booking:
 *   { id, totalPrice, depositAmount, status, statusPayment, createdAt,
 *     paymentInfo, canCancel, needPayment, qrCode, managerInfo,
 *     bookingDetails: [{ id, fieldName, fieldAddress, startTime, endTime, price, status }] }
 */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 5;

/** Booking status constants (khớp với BE) */
const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

/**
 * Lấy thông tin hiển thị cho status
 * Sử dụng từ ngữ phù hợp với trang đặt sân thể thao
 */
const getStatusInfo = (status) => {
  switch (status) {
    case BOOKING_STATUS.PENDING:
      return { className: 'status-pending', label: 'Chờ thanh toán', icon: 'hourglass_top' };
    case BOOKING_STATUS.CONFIRMED:
      return { className: 'status-confirmed', label: 'Đã đặt sân', icon: 'check_circle' };
    case BOOKING_STATUS.COMPLETED:
      return { className: 'status-completed', label: 'Đã hoàn thành', icon: 'task_alt' };
    case BOOKING_STATUS.CANCELLED:
      return { className: 'status-cancelled', label: 'Đã hủy', icon: 'cancel' };
    default:
      return { className: '', label: status, icon: 'info' };
  }
};

/**
 * Trích xuất thông tin hiển thị từ booking API response
 */
const extractBookingDisplay = (booking) => {
  const details = booking.bookingDetails || [];
  const firstDetail = details[0] || {};

  // Tên sân: lấy từ detail đầu tiên
  const fieldName = firstDetail.fieldName || 'Không rõ sân';
  const fieldAddress = firstDetail.fieldAddress || '';
  const fieldImage = firstDetail.fieldImage || null;
  const fieldId = firstDetail.fieldId || null;

  // Ngày & giờ: parse từ startTime/endTime ISO string
  let dateStr = '';
  let startTimeStr = '';
  let endTimeStr = '';

  if (firstDetail.startTime) {
    const start = new Date(firstDetail.startTime);
    dateStr = start.toISOString().split('T')[0]; // YYYY-MM-DD
    startTimeStr = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
  }

  if (details.length > 0) {
    const lastDetail = details[details.length - 1];
    if (lastDetail.endTime) {
      const end = new Date(lastDetail.endTime);
      endTimeStr = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
    }
  }

  return { fieldName, fieldAddress, fieldImage, fieldId, dateStr, startTimeStr, endTimeStr, slotCount: details.length };
};

/**
 * Format date YYYY-MM-DD → DD/MM/YYYY
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

/**
 * Format ISO date → DD/MM/YYYY
 */
const formatCreatedDate = (isoStr) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const BookingsTab = ({ allBookings, stats, loading, onRefresh }) => {
  const navigate = useNavigate();
  
  const [bookingTab, setBookingTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Booking tabs config — sử dụng từ ngữ phù hợp đặt sân thể thao
  const bookingTabs = [
    { key: 'all', label: `Tất cả (${stats.total})` },
    { key: 'pending', label: `Chờ thanh toán (${stats.pending})` },
    { key: 'confirmed', label: `Đã đặt sân (${stats.confirmed})` },
    { key: 'completed', label: `Hoàn thành (${stats.completed})` },
    { key: 'cancelled', label: `Đã hủy (${stats.cancelled})` },
  ];

  // Filter bookings by tab
  const filteredBookings = useMemo(() => {
    let filtered = allBookings;
    if (bookingTab === 'pending') {
      filtered = allBookings.filter((b) => b.status === BOOKING_STATUS.PENDING);
    } else if (bookingTab === 'confirmed') {
      filtered = allBookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED);
    } else if (bookingTab === 'completed') {
      filtered = allBookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED);
    } else if (bookingTab === 'cancelled') {
      filtered = allBookings.filter((b) => b.status === BOOKING_STATUS.CANCELLED);
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

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ width: 48, height: 48, margin: '0 auto 1rem', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)' }}>Đang tải lịch sử đặt sân...</p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Summary — Loại bỏ Tổng chi tiêu */}
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
          <span className="material-symbols-outlined user-dashboard-stat-icon pending">
            hourglass_top
          </span>
          <div>
            <p className="user-dashboard-stat-value">{stats.pending}</p>
            <p className="user-dashboard-stat-label">Chờ thanh toán</p>
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
              const isCancelled = booking.status === BOOKING_STATUS.CANCELLED;
              const display = extractBookingDisplay(booking);
              const bookingId = booking.id || booking._id;

              return (
                <div
                  key={bookingId}
                  className={`user-dashboard-booking-card-full ${isCancelled ? 'cancelled' : ''}`}
                >
                  {display.fieldImage && (
                    <div
                      className={`user-dashboard-booking-img ${isCancelled ? 'grayscale' : ''}`}
                      style={{ backgroundImage: `url(${display.fieldImage})` }}
                    />
                  )}
                  <div className={`user-dashboard-booking-info ${isCancelled ? 'dimmed' : ''}`}>
                    <div className="user-dashboard-booking-badges">
                      <span className={`user-dashboard-booking-status ${statusInfo.className}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px', verticalAlign: 'middle' }}>
                          {statusInfo.icon}
                        </span>
                        {statusInfo.label}
                      </span>
                      <span className="user-dashboard-booking-code">
                        Ngày đặt: {formatCreatedDate(booking.createdAt)}
                      </span>
                    </div>
                    <h4
                      className="user-dashboard-booking-name"
                      style={{ cursor: display.fieldId ? 'pointer' : 'default' }}
                      onClick={() => {
                        if (display.fieldId) {
                          navigate(`/fields/${display.fieldId}`);
                        }
                      }}
                    >
                      {display.fieldName}
                    </h4>
                    {display.fieldAddress && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 8px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>location_on</span>
                        {display.fieldAddress}
                      </p>
                    )}
                    <div className="user-dashboard-booking-meta">
                      {display.dateStr && (
                        <div className="user-dashboard-meta-item">
                          <span className="material-symbols-outlined">calendar_today</span>
                          <span>{formatDate(display.dateStr)}</span>
                        </div>
                      )}
                      {display.startTimeStr && (
                        <div className="user-dashboard-meta-item">
                          <span className="material-symbols-outlined">schedule</span>
                          <span>
                            {display.startTimeStr}{display.endTimeStr ? ` - ${display.endTimeStr}` : ''}
                            {display.slotCount > 1 ? ` (${display.slotCount} slot)` : ''}
                          </span>
                        </div>
                      )}
                      <div className="user-dashboard-meta-item user-dashboard-meta-price">
                        <span className="material-symbols-outlined">payments</span>
                        <span>{(booking.totalPrice || 0).toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                    {/* Payment info message */}
                    {booking.paymentInfo?.paymentMessage && (
                      <p style={{ fontSize: '0.8rem', color: booking.needPayment ? 'var(--warning-color, #e67e22)' : 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                        {booking.paymentInfo.paymentMessage}
                      </p>
                    )}
                  </div>
                  <div className="user-dashboard-booking-actions">
                    {!isCancelled && (
                      <button
                        className="user-dashboard-btn-detail"
                        onClick={() => navigate(`/booking-history/${bookingId}`)}
                      >
                        Chi tiết
                      </button>
                    )}
                    {(booking.status === BOOKING_STATUS.COMPLETED || isCancelled) && (
                      <button
                        className="user-dashboard-btn-rebook"
                        onClick={() => {
                          if (display.fieldId) {
                            navigate(`/fields/${display.fieldId}`);
                          } else {
                            navigate('/fields');
                          }
                        }}
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

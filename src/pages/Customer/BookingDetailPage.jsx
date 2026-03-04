import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MapModal from '../../components/Map/MapModal';
import {
  mockBookings,
  mockFields,
  BOOKING_ORDER_STATUS,
  BOOKING_STATUS_CONFIG,
  UTILITY_LABELS,
  FIELD_RULES_BY_CATEGORY,
} from '../../data/mockData';
import '../../styles/BookingDetailPage.css';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date string (YYYY-MM-DD) to DD/MM/YYYY
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

/**
 * Format date with day name
 */
const formatDateWithDay = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return `${days[date.getDay()]}, ${formatDate(dateStr)}`;
};

/**
 * Format ISO date to DD/MM/YYYY
 */
const formatOrderDate = (isoStr) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

/**
 * Calculate duration in minutes between two time strings
 */
const calcDuration = (start, end) => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
};

/**
 * Get utility labels in Vietnamese
 */
const getUtilityLabels = (utilities) => {
  if (!utilities || !Array.isArray(utilities)) return [];
  return utilities.map((u) => UTILITY_LABELS[u] || u);
};

/**
 * Get field rules by category
 */
const getFieldRules = (categoryName) => {
  return FIELD_RULES_BY_CATEGORY[categoryName] || FIELD_RULES_BY_CATEGORY.Football;
};

// ============================================================================
// COMPONENT
// ============================================================================

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Find booking and field from mockData
  // TODO: Replace with API call - GET /api/bookings/:id
  const booking = useMemo(() => mockBookings.find((b) => b._id === id), [id]);
  
  // TODO: Replace with API call - GET /api/fields/:id
  const field = useMemo(() => {
    if (!booking) return null;
    return mockFields.find((f) => f._id === booking.fieldID) || null;
  }, [booking]);

  // Not found
  if (!booking) {
    return (
      <div className="booking-history-page">
        <div className="booking-history-container">
          <div className="bh-not-found">
            <span className="material-symbols-outlined bh-not-found-icon">search_off</span>
            <h2>Không tìm thấy đơn đặt sân</h2>
            <p>Đơn đặt sân không tồn tại hoặc đã bị xóa.</p>
            <Link to="/booking-history" className="bh-btn-back">
              <span className="material-symbols-outlined">arrow_back</span>
              Quay lại lịch sử đặt sân
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Derived data
  const status = BOOKING_STATUS_CONFIG[booking.status] || BOOKING_STATUS_CONFIG.Pending;
  const duration = calcDuration(booking.startTime, booking.endTime);
  const fieldTypeName = field?.fieldType?.typeName || '';
  const categoryName = field?.fieldType?.category?.categoryName || 'Football';
  const fieldAddress = field?.address || '';
  const managerPhone = field?.manager?.phone || '';
  const amenities = getUtilityLabels(field?.utilities);
  const rules = getFieldRules(categoryName);

  // Price breakdown
  // TODO: Get price breakdown from API response
  const basePrice = field?.hourlyPrice || booking.totalPrice;
  const lightingFee = booking.startTime >= '18:00' ? 50000 : 0;
  const totalDisplay = booking.totalPrice;

  const isCancellable =
    booking.status === BOOKING_ORDER_STATUS.CONFIRMED ||
    booking.status === BOOKING_ORDER_STATUS.PENDING;

  // Handlers
  // TODO: Implement API calls
  const handleCancelBooking = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt sân này?')) {
      // TODO: Call API - PUT /api/bookings/:id/cancel
      console.log('Cancel booking:', booking._id);
    }
  };

  const handleDownloadInvoice = () => {
    // TODO: Call API - GET /api/bookings/:id/invoice
    console.log('Download invoice:', booking._id);
  };

  const handleOpenDirections = () => {
    setIsMapModalOpen(true);
  };

  return (
    <div className="booking-history-page">
      <div className="booking-history-container">
        {/* Breadcrumbs */}
        <nav className="bh-breadcrumbs">
          <Link to="/profile" className="bh-breadcrumb-link">Hồ sơ</Link>
          <span className="material-symbols-outlined bh-breadcrumb-sep">chevron_right</span>
          <Link to="/booking-history" className="bh-breadcrumb-link">Lịch sử đặt sân</Link>
          <span className="material-symbols-outlined bh-breadcrumb-sep">chevron_right</span>
          <span className="bh-breadcrumb-current">Chi tiết đơn đặt #{booking.bookingCode}</span>
        </nav>

        {/* Status Banner */}
        <div className={`bh-status-banner ${status.bannerClass}`}>
          <div className="bh-status-info">
            <div className="bh-status-icon-wrapper">
              <span className="material-symbols-outlined bh-status-icon">{status.icon}</span>
            </div>
            <div>
              <h1 className="bh-status-title">{status.label}</h1>
              <p className="bh-status-meta">
                Mã đặt sân: <span className="bh-code">#{booking.bookingCode}</span> • Ngày đặt: {formatOrderDate(booking.createdAt)}
              </p>
            </div>
          </div>
          <div className="bh-status-actions">
            <button className="bh-btn-download" onClick={handleDownloadInvoice}>
              <span className="material-symbols-outlined">download</span>
              Tải hóa đơn
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="bh-grid">
          {/* Left Column */}
          <div className="bh-left-col">
            {/* Field Info Card */}
            <div className="bh-field-card">
              <div
                className="bh-field-image"
                style={{ backgroundImage: `url(${booking.fieldImage})` }}
              />
              <div className="bh-field-info">
                <h2
                  className="bh-field-name clickable"
                  onClick={() => navigate(`/fields/${booking.fieldID}`)}
                >
                  {booking.fieldName}
                </h2>
                {fieldAddress && (
                  <div className="bh-field-address">
                    <span className="material-symbols-outlined">location_on</span>
                    <p>{fieldAddress}</p>
                  </div>
                )}
                <div className="bh-field-contact">
                  {managerPhone && (
                    <div className="bh-contact-phone">
                      <span className="material-symbols-outlined">phone</span>
                      <div>
                        <p className="bh-contact-label">Liên hệ quản lý</p>
                        <p className="bh-contact-value">{managerPhone}</p>
                      </div>
                    </div>
                  )}
                  <button className="bh-btn-directions" onClick={handleOpenDirections}>
                    <span className="material-symbols-outlined">directions</span>
                    Chỉ đường ngay
                  </button>
                </div>
              </div>
            </div>

            {/* Amenities & Rules */}
            <div className="bh-details-grid">
              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="bh-detail-card">
                  <h3 className="bh-detail-title">
                    <span className="material-symbols-outlined">inventory_2</span>
                    Tiện ích đi kèm
                  </h3>
                  <ul className="bh-amenities-list">
                    {amenities.map((item, index) => (
                      <li key={index} className="bh-amenity-item">
                        <span className="material-symbols-outlined bh-check-icon">check</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rules */}
              <div className="bh-detail-card">
                <h3 className="bh-detail-title">
                  <span className="material-symbols-outlined">rule</span>
                  Quy định sân
                </h3>
                <ul className="bh-rules-list">
                  {rules.map((rule, index) => (
                    <li key={index} className="bh-rule-item">
                      <span className="bh-rule-dot" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column — Booking Summary */}
          <div className="bh-right-col">
            <div className="bh-summary-card">
              <h3 className="bh-summary-title">Chi tiết lịch đặt</h3>

              <div className="bh-summary-details">
                <div className="bh-summary-row">
                  <span>Ngày chơi</span>
                  <span className="bh-summary-value">{formatDateWithDay(booking.date)}</span>
                </div>
                <div className="bh-summary-row">
                  <span>Khung giờ</span>
                  <span className="bh-summary-value">{booking.startTime} - {booking.endTime}</span>
                </div>
                <div className="bh-summary-row">
                  <span>Thời lượng</span>
                  <span className="bh-summary-value">{duration} phút</span>
                </div>
                {fieldTypeName && (
                  <div className="bh-summary-row">
                    <span>Loại sân</span>
                    <span className="bh-summary-value">{fieldTypeName}</span>
                  </div>
                )}
              </div>

              <div className="bh-price-section">
                <div className="bh-price-row">
                  <span>Giá thuê sân ({duration}p)</span>
                  <span>{(basePrice).toLocaleString('vi-VN')}đ</span>
                </div>
                {lightingFee > 0 && (
                  <div className="bh-price-row">
                    <span>Phụ phí đèn chiếu sáng</span>
                    <span>{lightingFee.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="bh-total-row">
                  <span>Tổng cộng</span>
                  <span className="bh-total-value">{totalDisplay.toLocaleString('vi-VN')}đ</span>
                </div>
                <p className="bh-payment-note">Đã thanh toán qua {booking.paymentMethod}</p>
              </div>

              {isCancellable && (
                <div className="bh-cancel-section">
                  <button className="bh-btn-cancel" onClick={handleCancelBooking}>
                    Hủy đặt sân
                  </button>
                  <p className="bh-cancel-note">
                    * Lưu ý: Hủy sân trước 24h để được hoàn tiền 100%. Sau 24h sẽ không được hoàn trả phí.
                  </p>
                </div>
              )}

              {booking.status === BOOKING_ORDER_STATUS.COMPLETED && (
                <div className="bh-cancel-section">
                  <button
                    className="bh-btn-rebook"
                    onClick={() => navigate(`/fields/${booking.fieldID}`)}
                  >
                    Đặt lại sân này
                  </button>
                </div>
              )}
            </div>

            {/* Support Card */}
            <div className="bh-support-card">
              <div className="bh-support-header">
                <span className="material-symbols-outlined">support_agent</span>
                <span className="bh-support-title">Cần hỗ trợ?</span>
              </div>
              <p className="bh-support-text">
                Nếu bạn gặp bất kỳ vấn đề gì về đơn đặt sân này, vui lòng liên hệ với chúng tôi.
              </p>
              <a href="tel:19001234" className="bh-support-phone">
                <span className="material-symbols-outlined">call</span>
                1900 1234
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Modal */}
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        address={fieldAddress}
        fieldName={booking.fieldName}
      />
    </div>
  );
};

export default BookingDetailPage;

import { Link, useParams } from 'react-router-dom';
import '../../styles/BookingDetailPage.css';

const BookingDetailPage = () => {
  const { id } = useParams();

  // Mock data — TODO: replace with API call using `id`
  const booking = {
    id: id || 'BK-8821',
    status: 'confirmed',
    statusText: 'Đã xác nhận đặt sân',
    orderDate: '10/10/2023',
    fieldName: 'Sân Bóng Đá Mini 7 Người - Khu A',
    address: '123 Đường Thể Thao, Phường 4, Quận Tân Bình, TP. Hồ Chí Minh',
    phone: '0987 654 321',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
    playDate: 'Thứ 7, 12/10/2023',
    timeSlot: '18:00 - 19:30',
    duration: '90 phút',
    fieldType: 'Cỏ nhân tạo (7 người)',
    price: 250000,
    lightingFee: 50000,
    total: 300000,
    paymentMethod: 'Ví MoMo',
    amenities: [
      'Nước suối miễn phí (2 chai)',
      'Áo pitch (2 bộ)',
      'Phòng tắm & thay đồ sạch sẽ',
      'Gửi xe máy miễn phí',
    ],
    rules: [
      'Có mặt trước 15 phút để làm thủ tục nhận sân.',
      'Sử dụng giày chuyên dụng cho cỏ nhân tạo.',
      'Không mang chất dễ cháy nổ vào khu vực sân.',
    ],
  };

  const handleCancelBooking = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt sân này?')) {
      // TODO: Call API to cancel booking
      console.log('Cancel booking:', booking.id);
    }
  };

  const handleDownloadInvoice = () => {
    // TODO: Call API to download invoice
    console.log('Download invoice:', booking.id);
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
          <span className="bh-breadcrumb-current">Chi tiết đơn đặt #{booking.id}</span>
        </nav>

        {/* Status Banner */}
        <div className="bh-status-banner">
          <div className="bh-status-info">
            <div className="bh-status-icon-wrapper">
              <span className="material-symbols-outlined bh-status-icon">check_circle</span>
            </div>
            <div>
              <h1 className="bh-status-title">{booking.statusText}</h1>
              <p className="bh-status-meta">
                Mã đặt sân: <span className="bh-code">#{booking.id}</span> • Ngày đặt: {booking.orderDate}
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
                style={{ backgroundImage: `url(${booking.image})` }}
              />
              <div className="bh-field-info">
                <h2 className="bh-field-name">{booking.fieldName}</h2>
                <div className="bh-field-address">
                  <span className="material-symbols-outlined">location_on</span>
                  <p>{booking.address}</p>
                </div>
                <div className="bh-field-contact">
                  <div className="bh-contact-phone">
                    <span className="material-symbols-outlined">phone</span>
                    <div>
                      <p className="bh-contact-label">Liên hệ quản lý</p>
                      <p className="bh-contact-value">{booking.phone}</p>
                    </div>
                  </div>
                  <button className="bh-btn-directions">
                    <span className="material-symbols-outlined">directions</span>
                    Chỉ đường ngay
                  </button>
                </div>
              </div>
            </div>

            {/* Amenities & Rules */}
            <div className="bh-details-grid">
              {/* Amenities */}
              <div className="bh-detail-card">
                <h3 className="bh-detail-title">
                  <span className="material-symbols-outlined">inventory_2</span>
                  Tiện ích đi kèm
                </h3>
                <ul className="bh-amenities-list">
                  {booking.amenities.map((item, index) => (
                    <li key={index} className="bh-amenity-item">
                      <span className="material-symbols-outlined bh-check-icon">check</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rules */}
              <div className="bh-detail-card">
                <h3 className="bh-detail-title">
                  <span className="material-symbols-outlined">rule</span>
                  Quy định sân
                </h3>
                <ul className="bh-rules-list">
                  {booking.rules.map((rule, index) => (
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
                  <span className="bh-summary-value">{booking.playDate}</span>
                </div>
                <div className="bh-summary-row">
                  <span>Khung giờ</span>
                  <span className="bh-summary-value">{booking.timeSlot}</span>
                </div>
                <div className="bh-summary-row">
                  <span>Thời lượng</span>
                  <span className="bh-summary-value">{booking.duration}</span>
                </div>
                <div className="bh-summary-row">
                  <span>Loại sân</span>
                  <span className="bh-summary-value">{booking.fieldType}</span>
                </div>
              </div>

              <div className="bh-price-section">
                <div className="bh-price-row">
                  <span>Giá thuê sân (90p)</span>
                  <span>{booking.price.toLocaleString()}đ</span>
                </div>
                <div className="bh-price-row">
                  <span>Phụ phí đèn chiếu sáng</span>
                  <span>{booking.lightingFee.toLocaleString()}đ</span>
                </div>
                <div className="bh-total-row">
                  <span>Tổng cộng</span>
                  <span className="bh-total-value">{booking.total.toLocaleString()}đ</span>
                </div>
                <p className="bh-payment-note">Đã thanh toán qua {booking.paymentMethod}</p>
              </div>

              <div className="bh-cancel-section">
                <button className="bh-btn-cancel" onClick={handleCancelBooking}>
                  Hủy đặt sân
                </button>
                <p className="bh-cancel-note">
                  * Lưu ý: Hủy sân trước 24h để được hoàn tiền 100%. Sau 24h sẽ không được hoàn trả phí.
                </p>
              </div>
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
    </div>
  );
};

export default BookingDetailPage;

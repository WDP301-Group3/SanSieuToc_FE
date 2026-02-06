import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../../styles/FieldDetailPage.css';

const FieldDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('2023-10-27');
  const [selectedTime, setSelectedTime] = useState('');

  // Mock data
  const field = {
    id: 1,
    name: 'Sân bóng đá Mini 7 người - Khu A',
    address: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    phone: '0987 654 321',
    rating: 4.8,
    reviewsCount: 128,
    verified: true,
    quickBook: true,
    price: 250000,
    lightingFee: 50000,
    images: [
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
      'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800',
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800',
      'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800'
    ],
    amenities: [
      { icon: 'wifi', name: 'Wifi miễn phí' },
      { icon: 'local_parking', name: 'Bãi giữ xe' },
      { icon: 'shower', name: 'Phòng tắm' },
      { icon: 'light_mode', name: 'Đèn chiếu sáng' },
      { icon: 'local_drink', name: 'Nước uống' },
      { icon: 'chair', name: 'Khán đài' }
    ],
    description: 'Sân bóng đá Mini 7 người Khu A nằm trong tổ hợp thể thao cao cấp Quận 7. Sân được trang bị mặt cỏ nhân tạo tiêu chuẩn FIFA mới nhất năm 2024, đảm bảo độ nảy bóng tốt và giảm thiểu chấn thương cho cầu thủ. Hệ thống đèn chiếu sáng LED hiện đại cho phép thi đấu ban đêm với chất lượng ánh sáng hoàn hảo.',
    description2: 'Ngoài ra, chúng tôi có khu vực canteen phục vụ nước giải khát và đồ ăn nhẹ, phòng thay đồ sạch sẽ và tủ khóa an toàn. Phù hợp cho các giải đấu phong trào, giao hữu công ty hoặc tập luyện đội nhóm.',
    fieldType: 'Cỏ nhân tạo (7 người)',
    duration: '90 phút',
    reviews: [
      {
        id: 1,
        author: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        date: '2023-10-15',
        content: 'Sân rất đẹp và sạch sẽ. Hệ thống đèn chiếu sáng tốt, mặt cỏ êm ái. Nhân viên thân thiện. Sẽ quay lại đặt sân!',
        helpful: 12
      },
      {
        id: 2,
        author: 'Trần Thị B',
        avatar: 'https://i.pravatar.cc/150?img=2',
        rating: 4,
        date: '2023-10-10',
        content: 'Sân tốt, giá hợp lý. Bãi đỗ xe rộng rãi. Chỉ có điều đôi khi hơi đông người vào cuối tuần.',
        helpful: 8
      }
    ]
  };

  const timeSlots = [
    { time: '08:00 - 09:00', available: true },
    { time: '09:00 - 10:00', available: true },
    { time: '10:00 - 11:00', available: false },
    { time: '11:00 - 12:00', available: true },
    { time: '13:00 - 14:00', available: true },
    { time: '14:00 - 15:00', available: true },
    { time: '15:00 - 16:00', available: false },
    { time: '16:00 - 17:00', available: true },
    { time: '17:00 - 18:00', available: true },
    { time: '18:00 - 19:00', available: true },
    { time: '19:00 - 20:00', available: false },
    { time: '20:00 - 21:00', available: true }
  ];

  const handleBooking = () => {
    if (!selectedTime) {
      alert('Vui lòng chọn khung giờ!');
      return;
    }
    // Navigate to booking confirmation
    navigate('/booking/confirm', { state: { field, date: selectedDate, time: selectedTime } });
  };

  return (
    <div className="field-detail-page">
      <div className="field-detail-container">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link to="/" className="breadcrumb-link">Trang chủ</Link>
          <span className="material-symbols-outlined breadcrumb-separator">chevron_right</span>
          <Link to="/fields" className="breadcrumb-link">Tìm kiếm</Link>
          <span className="material-symbols-outlined breadcrumb-separator">chevron_right</span>
          <span className="breadcrumb-current">{field.name}</span>
        </nav>

        {/* Page Layout */}
        <div className="detail-grid">
          {/* Left Column */}
          <div className="detail-content">
            {/* Header */}
            <div className="detail-header">
              <h1 className="field-title">{field.name}</h1>
              <div className="field-location-row">
                <span className="material-symbols-outlined">location_on</span>
                <p>{field.address}</p>
                <a href="#" className="map-link">Xem bản đồ</a>
              </div>
              <div className="field-badges-row">
                <div className="badge badge-rating">
                  <span className="material-symbols-outlined">star</span>
                  {field.rating} ({field.reviewsCount} đánh giá)
                </div>
                <div className="badge badge-verified">
                  <span className="material-symbols-outlined">verified</span>
                  Đã xác thực
                </div>
                <div className="badge badge-quick">
                  <span className="material-symbols-outlined">bolt</span>
                  Đặt nhanh
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="image-gallery">
              <div
                className="gallery-main"
                style={{ backgroundImage: `url(${field.images[0]})` }}
              />
              <div
                className="gallery-thumb"
                style={{ backgroundImage: `url(${field.images[1]})` }}
              />
              <div
                className="gallery-thumb"
                style={{ backgroundImage: `url(${field.images[2]})` }}
              />
              <div
                className="gallery-thumb"
                style={{ backgroundImage: `url(${field.images[3]})` }}
              />
              <div className="gallery-thumb gallery-more" style={{ backgroundImage: `url(${field.images[4]})` }}>
                <div className="gallery-overlay">
                  <span>+5 ảnh</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="detail-section">
              <h3 className="section-title">Tiện ích sân</h3>
              <div className="amenities-grid">
                {field.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="material-symbols-outlined">{amenity.icon}</span>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="detail-section">
              <h3 className="section-title">Thông tin chi tiết</h3>
              <div className="field-description">
                <p>{field.description}</p>
                <p>{field.description2}</p>
              </div>
            </div>

            {/* Reviews */}
            <div className="detail-section" id="reviews">
              <div className="reviews-header">
                <h3 className="section-title">Đánh giá & Bình luận</h3>
                <button className="btn-write-review">Viết đánh giá</button>
              </div>

              {/* Review Summary */}
              <div className="review-summary">
                <div className="summary-rating">
                  <span className="rating-number">{field.rating}</span>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className="material-symbols-outlined star-filled">
                        {star <= Math.floor(field.rating) ? 'star' : star === Math.ceil(field.rating) ? 'star_half' : 'star'}
                      </span>
                    ))}
                  </div>
                  <span className="rating-count">{field.reviewsCount} đánh giá</span>
                </div>

                <div className="rating-breakdown">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="rating-row">
                      <span className="rating-label">{star} sao</span>
                      <div className="rating-bar">
                        <div
                          className="rating-fill"
                          style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '10%' }}
                        />
                      </div>
                      <span className="rating-percent">{star === 5 ? 70 : star === 4 ? 20 : 10}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review List */}
              <div className="reviews-list">
                {field.reviews.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-avatar" style={{ backgroundImage: `url(${review.avatar})` }} />
                    <div className="review-content">
                      <div className="review-header">
                        <div>
                          <h4 className="review-author">{review.author}</h4>
                          <div className="review-meta">
                            <div className="review-stars">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span
                                  key={star}
                                  className={`material-symbols-outlined ${star <= review.rating ? 'star-filled' : 'star-empty'}`}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                            <span className="review-date">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="review-text">{review.content}</p>
                      <div className="review-actions">
                        <button className="btn-helpful">
                          <span className="material-symbols-outlined">thumb_up</span>
                          Hữu ích ({review.helpful})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="booking-sidebar">
            <div className="booking-card">
              <h3 className="booking-title">Chi tiết lịch đặt</h3>

              <div className="booking-form">
                <div className="form-group">
                  <label className="form-label">Ngày chơi</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Chọn khung giờ</label>
                  <div className="time-slots">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`time-slot ${!slot.available ? 'unavailable' : ''} ${selectedTime === slot.time ? 'selected' : ''}`}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        {slot.time}
                        {!slot.available && <span className="slot-badge">Đã đặt</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Loại sân</label>
                  <p className="form-value">{field.fieldType}</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Thời lượng</label>
                  <p className="form-value">{field.duration}</p>
                </div>

                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Giá thuê sân (90p)</span>
                    <span>{field.price.toLocaleString()}đ</span>
                  </div>
                  <div className="price-row">
                    <span>Phụ phí đèn chiếu sáng</span>
                    <span>{field.lightingFee.toLocaleString()}đ</span>
                  </div>
                  <div className="price-total">
                    <span>Tổng cộng</span>
                    <span className="total-amount">{(field.price + field.lightingFee).toLocaleString()}đ</span>
                  </div>
                </div>

                <button className="btn-book-now" onClick={handleBooking}>
                  Đặt sân ngay
                </button>

                <div className="booking-note">
                  <span className="material-symbols-outlined">info</span>
                  <p>Đặt sân trước 24h để được hoàn tiền 100% khi hủy</p>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="contact-card">
              <div className="contact-header">
                <span className="material-symbols-outlined">support_agent</span>
                <span className="contact-title">Cần hỗ trợ?</span>
              </div>
              <p className="contact-text">
                Liên hệ hotline hoặc chat với chúng tôi để được hỗ trợ nhanh nhất.
              </p>
              <div className="contact-actions">
                <a href={`tel:${field.phone}`} className="btn-contact">
                  <span className="material-symbols-outlined">phone</span>
                  {field.phone}
                </a>
                <button className="btn-contact">
                  <span className="material-symbols-outlined">chat</span>
                  Chat ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailPage;

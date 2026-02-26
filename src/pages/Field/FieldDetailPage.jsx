import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../../styles/FieldDetailPage.css';
import bookingService from '../../services/bookingService';
import fieldService from '../../services/fieldService';
import tokenManager from '../../utils/tokenManager';

const FieldDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State: Ngày được chọn (mặc định là hôm nay)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  // State: Các khung giờ được chọn (hỗ trợ chọn nhiều khung)
  const [selectedSlots, setSelectedSlots] = useState([]);
  
  // State: Danh sách khung giờ từ backend (đã tính availability)
  const [timeSlots, setTimeSlots] = useState([]);
  
  // State: Loading khi fetch data
  const [loading, setLoading] = useState(false);

  // Mock data (sẽ được thay thế bằng API call)
  const field = {
    id: 1,
    name: 'Sân bóng đá Mini 7 người - Khu A',
    address: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    phone: '0987 654 321',
    rating: 4.8,
    reviewsCount: 128,
    verified: true,
    quickBook: true,
    price: 250000, // Giá thuê sân (VNĐ)
    // Time slot configuration from backend
    startTime: '08:00', // Giờ mở cửa
    endTime: '21:00',   // Giờ đóng cửa
    slotDuration: 90,   // Thời lượng mỗi slot (phút)
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

  /**
   * Fetch time slots from backend for selected date
   * Backend handles:
   * - Generating slots based on field's startTime, endTime, slotDuration
   * - Checking availability against existing bookings
   * - Returning array of slots with availability status
   */
  useEffect(() => {
    const fetchTimeSlots = async () => {
      // Validate: Không fetch nếu chưa chọn ngày
      if (!selectedDate || !field.id) {
        return;
      }

      try {
        setLoading(true);
        
        // Gọi API để lấy danh sách slots (đã tính availability)
        const slots = await fieldService.getTimeSlots(field.id, selectedDate);
        setTimeSlots(slots);
        
        // Reset selected slots khi đổi ngày
        setSelectedSlots([]);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        // Nếu API fail, hiển thị mảng rỗng
        setTimeSlots([]);
        setSelectedSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, field.id]);

  /**
   * Validate date selection
   * Ngày phải từ hôm nay trở đi (không cho chọn quá khứ)
   */
  const handleDateChange = (e) => {
    const selectedDateValue = e.target.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
    
    const selected = new Date(selectedDateValue);
    
    // Validate: Không cho chọn ngày trong quá khứ
    if (selected < today) {
      alert('Không thể chọn ngày trong quá khứ. Vui lòng chọn từ hôm nay trở đi.');
      return;
    }
    
    setSelectedDate(selectedDateValue);
  };

  /**
   * Handle slot selection
   * Hỗ trợ chọn/bỏ chọn nhiều khung giờ
   */
  const handleSlotSelection = (slot) => {
    // Không cho chọn slot đã được đặt
    if (!slot.available) return;
    
    const slotIndex = selectedSlots.findIndex(s => s.time === slot.time);
    
    if (slotIndex > -1) {
      // Bỏ chọn slot
      setSelectedSlots(selectedSlots.filter(s => s.time !== slot.time));
    } else {
      // Chọn slot
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  /**
   * Calculate total price for selected slots
   * Chỉ tính tiền thuê sân (chưa có phụ phí)
   */
  const calculateTotalPrice = () => {
    return field.price * selectedSlots.length;
  };

  /**
   * Handle booking submission
   * Validate và submit booking data đến backend
   */
  const handleBooking = async () => {
    // Validate 1: Kiểm tra authentication
    if (!tokenManager.isAuthenticated()) {
      alert('Vui lòng đăng nhập để đặt sân');
      navigate('/login', { state: { from: `/field/${id}` } });
      return;
    }

    // Validate 2: Kiểm tra đã chọn ngày chưa
    if (!selectedDate) {
      alert('Vui lòng chọn ngày chơi');
      return;
    }

    // Validate 3: Kiểm tra đã chọn slot chưa
    if (selectedSlots.length === 0) {
      alert('Vui lòng chọn ít nhất một khung giờ');
      return;
    }

    // Validate 4: Kiểm tra ngày không phải quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(selectedDate);
    
    if (bookingDate < today) {
      alert('Không thể đặt sân cho ngày trong quá khứ');
      return;
    }

    try {
      setLoading(true);

      // Lấy thông tin user hiện tại
      const currentUser = tokenManager.getUser();
      if (!currentUser || !currentUser._id) {
        alert('Không thể xác định thông tin người dùng. Vui lòng đăng nhập lại.');
        navigate('/login');
        return;
      }

      // Chuẩn bị booking details từ các slot đã chọn
      const bookingDetails = selectedSlots.map(slot => {
        // Kết hợp ngày đã chọn với giờ của slot
        const [startHour, startMinute] = slot.startTime.split(':');
        const [endHour, endMinute] = slot.endTime.split(':');
        
        const startDateTime = new Date(selectedDate);
        startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
        
        const endDateTime = new Date(selectedDate);
        endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

        return {
          startTime: startDateTime.toISOString(), // Convert sang UTC
          endTime: endDateTime.toISOString(),     // Convert sang UTC
          priceSnapshot: field.price              // Lưu giá tại thời điểm đặt
        };
      });

      // Tính tổng tiền (chỉ tiền sân, chưa có phụ phí)
      const totalPrice = field.price * selectedSlots.length;
      
      // Tính tiền cọc (30% tổng tiền)
      const depositAmount = Math.round(totalPrice * 0.3);

      // Chuẩn bị data gửi lên backend
      const bookingData = {
        customerID: currentUser._id,
        fieldID: field.id,
        bookingDetails: bookingDetails,
        totalPrice: totalPrice,
        depositAmount: depositAmount,
        statusPayment: 'Pending' // Trạng thái thanh toán ban đầu
      };

      console.log('Submitting booking:', bookingData);

      // Gọi API tạo booking
      const response = await bookingService.createBooking(bookingData);

      if (response.success) {
        alert(`Đặt sân thành công! Mã booking: ${response.bookingID}`);
        
        // Redirect đến trang thanh toán hoặc lịch sử booking
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
        } else {
          navigate('/profile/bookings');
        }
      } else {
        alert(response.message || 'Đặt sân thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      
      // Xử lý các loại lỗi cụ thể
      if (error.response?.status === 401) {
        // Lỗi authentication
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else if (error.response?.status === 409) {
        // Lỗi conflict (slot đã được đặt)
        alert('Khung giờ đã được đặt. Vui lòng chọn khung giờ khác.');
        // Refresh lại danh sách slots
        const slots = await fieldService.getTimeSlots(field.id, selectedDate);
        setTimeSlots(slots);
        setSelectedSlots([]);
      } else {
        // Lỗi khác
        alert(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
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
                {/* Chọn ngày chơi */}
                <div className="form-group">
                  <label className="form-label">Ngày chơi</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]} // Chỉ cho chọn từ hôm nay trở đi
                    onChange={handleDateChange}
                    className="form-input"
                  />
                </div>

                {/* Chọn khung giờ */}
                <div className="form-group">
                  <label className="form-label">
                    Chọn khung giờ {selectedSlots.length > 0 && `(${selectedSlots.length} khung)`}
                  </label>
                  
                  {/* Hiển thị loading khi fetch slots */}
                  {loading && <p className="loading-text">Đang tải khung giờ...</p>}
                  
                  {/* Hiển thị thông báo khi chưa có slots */}
                  {!loading && timeSlots.length === 0 && (
                    <p className="empty-slots-text">Vui lòng chọn ngày để xem khung giờ có sẵn</p>
                  )}
                  
                  {/* Danh sách time slots */}
                  <div className="time-slots">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`time-slot ${!slot.available ? 'unavailable' : ''} ${selectedSlots.some(s => s.time === slot.time) ? 'selected' : ''}`}
                        disabled={!slot.available || loading}
                        onClick={() => handleSlotSelection(slot)}
                      >
                        {slot.time}
                        {!slot.available && <span className="slot-badge">Đã đặt</span>}
                      </button>
                    ))}
                  </div>
                  
                  {/* Hướng dẫn chọn slot */}
                  <p className="form-hint">
                    <span className="material-symbols-outlined">info</span>
                    Bước 1: Chọn ngày → Bước 2: Chọn khung giờ (có thể chọn nhiều khung liên tiếp)
                  </p>
                </div>

                {/* Loại sân */}
                <div className="form-group">
                  <label className="form-label">Loại sân</label>
                  <p className="form-value">{field.fieldType}</p>
                </div>

                {/* Thời lượng mỗi khung */}
                <div className="form-group">
                  <label className="form-label">Thời lượng</label>
                  <p className="form-value">{field.slotDuration} phút</p>
                </div>

                {/* Bảng giá */}
                <div className="price-breakdown">
                  {/* Giá thuê sân */}
                  <div className="price-row">
                    <span>Giá thuê sân ({field.slotDuration}p) × {selectedSlots.length || 1}</span>
                    <span>{(field.price * (selectedSlots.length || 1)).toLocaleString()}đ</span>
                  </div>
                  
                  {/* Hiển thị tiền cọc khi đã chọn slot */}
                  {selectedSlots.length > 0 && (
                    <div className="price-row deposit">
                      <span>Tiền cọc (30%)</span>
                      <span>{Math.round(calculateTotalPrice() * 0.3).toLocaleString()}đ</span>
                    </div>
                  )}
                  
                  {/* Tổng tiền */}
                  <div className="price-total">
                    <span>Tổng cộng</span>
                    <span className="total-amount">
                      {selectedSlots.length > 0 
                        ? calculateTotalPrice().toLocaleString() 
                        : field.price.toLocaleString()}đ
                    </span>
                  </div>
                </div>

                {/* Nút đặt sân */}
                <button 
                  className="btn-book-now" 
                  onClick={handleBooking}
                  disabled={loading || selectedSlots.length === 0}
                >
                  {loading ? 'Đang xử lý...' : selectedSlots.length > 0 ? 'Đặt sân ngay' : 'Chọn khung giờ'}
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

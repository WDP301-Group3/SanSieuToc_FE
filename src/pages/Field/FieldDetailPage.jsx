import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockFields, mockBookingDetails, getFeedbacksByFieldID, getFieldRating } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import MapModal from '../../components/Map/MapModal';
import '../../styles/FieldDetailPage.css';

/**
 * Map utility name from mockData to Material icon + Vietnamese label
 */
const utilityMap = {
  'Wifi': { icon: 'wifi', name: 'Wifi miễn phí' },
  'Parking': { icon: 'local_parking', name: 'Bãi giữ xe' },
  'Shower': { icon: 'shower', name: 'Phòng tắm' },
  'Changing Room': { icon: 'checkroom', name: 'Phòng thay đồ' },
  'Water': { icon: 'local_drink', name: 'Nước uống' },
  'First Aid': { icon: 'medical_services', name: 'Y tế' },
  'Equipment Rental': { icon: 'sports', name: 'Cho thuê dụng cụ' },
  'Coaching': { icon: 'school', name: 'Huấn luyện viên' },
  'Cafe': { icon: 'local_cafe', name: 'Quán cà phê' },
  'Air Conditioning': { icon: 'ac_unit', name: 'Điều hòa' },
  'Snack Bar': { icon: 'restaurant', name: 'Căn tin' },
  'Scoreboard': { icon: 'scoreboard', name: 'Bảng điểm' },
};

/**
 * Gộp các slots liền kề thành các khoảng thời gian
 * VD: [08:00-09:00, 09:00-10:00, 14:00-15:00] → [{start: 08:00, end: 10:00}, {start: 14:00, end: 15:00}]
 * 
 * @param {Array} slots - Danh sách slots đã chọn (sorted by startTime)
 * @returns {Array} - Danh sách các khoảng thời gian đã gộp
 */
const mergeConsecutiveSlots = (slots) => {
  if (!slots || slots.length === 0) return [];
  
  // Sort slots theo startTime
  const sortedSlots = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  const merged = [];
  let currentGroup = {
    startTime: sortedSlots[0].startTime,
    endTime: sortedSlots[0].endTime,
  };
  
  for (let i = 1; i < sortedSlots.length; i++) {
    const slot = sortedSlots[i];
    
    // Nếu slot hiện tại bắt đầu ngay sau khi slot trước kết thúc → gộp
    if (slot.startTime === currentGroup.endTime) {
      currentGroup.endTime = slot.endTime;
    } else {
      // Không liền kề → push group hiện tại và bắt đầu group mới
      merged.push({ ...currentGroup });
      currentGroup = {
        startTime: slot.startTime,
        endTime: slot.endTime,
      };
    }
  }
  
  // Push group cuối cùng
  merged.push(currentGroup);
  
  return merged;
};

/**
 * Check availability của 1 slot cho 1 ngày cụ thể
 * 
 * @param {string} fieldId - ID của sân
 * @param {string} dateStr - Ngày cần check (YYYY-MM-DD)
 * @param {string} startTime - Giờ bắt đầu (HH:mm)
 * @param {string} endTime - Giờ kết thúc (HH:mm)
 * @returns {boolean} - true nếu available
 */
const checkSlotAvailability = (fieldId, dateStr, startTime, endTime) => {
  // Lấy tất cả booking của sân này trong ngày
  const fieldBookings = mockBookingDetails.filter((b) => {
    if (b.fieldID !== fieldId || b.status !== 'Active') return false;
    const bookingDate = new Date(b.startTime).toISOString().split('T')[0];
    return bookingDate === dateStr;
  });
  
  // Check overlap
  const slotStart = new Date(`${dateStr}T${startTime}:00`);
  const slotEnd = new Date(`${dateStr}T${endTime}:00`);
  
  const isBooked = fieldBookings.some((b) => {
    const bStart = new Date(b.startTime);
    const bEnd = new Date(b.endTime);
    return slotStart < bEnd && slotEnd > bStart;
  });
  
  // Check nếu là quá khứ
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  if (dateStr === today && slotStart <= now) {
    return false;
  }
  
  return !isBooked;
};

/**
 * Generate time slots from field's opening/closing time and slot duration
 * Then check availability against mockBookingDetails
 */
const generateTimeSlots = (field, selectedDate) => {
  if (!field || !selectedDate) return [];

  const [openH, openM] = field.openingTime.split(':').map(Number);
  const [closeH, closeM] = field.closingTime.split(':').map(Number);
  const duration = field.slotDuration; // minutes

  const slots = [];
  let currentMinutes = openH * 60 + openM;
  const endMinutes = closeH * 60 + closeM;

  while (currentMinutes + duration <= endMinutes) {
    const startH = Math.floor(currentMinutes / 60);
    const startM = currentMinutes % 60;
    const endSlotMinutes = currentMinutes + duration;
    const endSlotH = Math.floor(endSlotMinutes / 60);
    const endSlotM = endSlotMinutes % 60;

    const startTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
    const endTime = `${String(endSlotH).padStart(2, '0')}:${String(endSlotM).padStart(2, '0')}`;
    const time = `${startTime} - ${endTime}`;

    const available = checkSlotAvailability(field._id, selectedDate, startTime, endTime);

    slots.push({
      time,
      startTime,
      endTime,
      available,
    });

    currentMinutes += duration;
  }

  return slots;
};

const FieldDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Find field from mockData
  const field = mockFields.find((f) => f._id === id);

  // State
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [recurringType, setRecurringType] = useState('once'); // 'once' | 'weekly'
  const [recurringMonths, setRecurringMonths] = useState(1); // 1 | 2 | 3 (số tháng lặp)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false); // State cho MapModal

  /**
   * Số tuần tương ứng với số tháng
   * 1 tháng = 4 tuần = 4 lần
   * 2 tháng = 8 tuần = 8 lần
   * 3 tháng = 12 tuần = 12 lần
   */
  const WEEKS_PER_MONTH = 4;

  /**
   * Tính danh sách các ngày sẽ đặt dựa trên loại lặp
   */
  const calculateRecurringDates = useMemo(() => {
    if (!selectedDate) return [];
    
    // Nếu đặt 1 lần → chỉ có ngày đã chọn
    if (recurringType === 'once') {
      return [selectedDate];
    }

    // Nếu lặp hàng tuần → tính số lần dựa trên số tháng
    const totalWeeks = recurringMonths * WEEKS_PER_MONTH;
    const dates = [];
    let current = new Date(selectedDate);

    for (let i = 0; i < totalWeeks; i++) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 7); // +7 ngày
    }

    return dates;
  }, [selectedDate, recurringType, recurringMonths]);

  /**
   * Lấy tên thứ trong tuần từ ngày
   */
  const getDayOfWeekName = (dateStr) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  /**
   * Check availability cho TẤT CẢ ngày lặp lại
   * Trả về { isAvailable, conflictDates }
   */
  const checkRecurringAvailability = useCallback(() => {
    if (!field || selectedSlots.length === 0) {
      return { isAvailable: true, conflictDates: [] };
    }

    const conflictDates = [];
    
    // Check từng ngày trong danh sách recurring
    for (const dateStr of calculateRecurringDates) {
      // Check từng slot riêng lẻ (không gộp)
      for (const slot of selectedSlots) {
        const available = checkSlotAvailability(
          field._id,
          dateStr,
          slot.startTime,
          slot.endTime
        );
        
        if (!available) {
          conflictDates.push({
            date: dateStr,
            slot: `${slot.startTime} - ${slot.endTime}`,
          });
          break; // Chỉ cần 1 slot conflict là đủ cho ngày này
        }
      }
    }
    
    return {
      isAvailable: conflictDates.length === 0,
      conflictDates,
    };
  }, [field, selectedSlots, calculateRecurringDates]);

  /**
   * Gộp các slots đã chọn thành các khoảng thời gian liên tục
   * CHỈ dùng để HIỂN THỊ UI (cho dễ đọc)
   * KHÔNG dùng để tạo BookingDetails (mỗi slot = 1 record riêng)
   */
  const mergedTimeRanges = useMemo(() => {
    return mergeConsecutiveSlots(selectedSlots);
  }, [selectedSlots]);

  // Generate time slots from field config + check availability against bookings
  const timeSlots = useMemo(() => {
    if (!field || !selectedDate) return [];
    return generateTimeSlots(field, selectedDate);
  }, [field, selectedDate]);

  // Feedbacks from mockData
  const feedbacks = useMemo(() => {
    return field ? getFeedbacksByFieldID(field._id) : [];
  }, [field]);
  const { averageRating, totalReviews } = field ? getFieldRating(field._id) : { averageRating: 0, totalReviews: 0 };

  // Rating breakdown (percentage for each star level)
  const ratingBreakdown = useMemo(() => {
    if (feedbacks.length === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbacks.forEach((fb) => {
      counts[fb.rating] = (counts[fb.rating] || 0) + 1;
    });
    const total = feedbacks.length;
    return {
      5: Math.round((counts[5] / total) * 100),
      4: Math.round((counts[4] / total) * 100),
      3: Math.round((counts[3] / total) * 100),
      2: Math.round((counts[2] / total) * 100),
      1: Math.round((counts[1] / total) * 100),
    };
  }, [feedbacks]);

  // If field not found, show 404
  if (!field) {
    return (
      <div className="field-detail-page">
        <div className="field-detail-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'var(--text-muted)' }}>search_off</span>
          <h2 style={{ margin: '1rem 0 0.5rem' }}>Không tìm thấy sân</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Sân bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link to="/fields" className="btn-book-now" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Quay lại danh sách sân
          </Link>
        </div>
      </div>
    );
  }

  // Derived data from field
  const amenities = (field.utilities || []).map((u) => utilityMap[u] || { icon: 'check_circle', name: u });
  const images = field.image?.length > 0
    ? field.image
    : ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800'];
  const managerPhone = field.manager?.phone || '0900 000 000';

  /**
   * Tạo Google Maps URL từ địa chỉ
   * Encode địa chỉ để tránh lỗi ký tự đặc biệt
   */
  const getGoogleMapsUrl = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  };

  /**
   * Mở Modal bản đồ
   */
  const handleOpenMap = (e) => {
    e.preventDefault();
    setIsMapModalOpen(true);
  };

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
    setSelectedSlots([]); // Reset slots when date changes
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
   * Tính tổng thời gian (phút) của các slots đã chọn
   * Dựa trên merged ranges để tính chính xác
   */
  const calculateTotalMinutes = () => {
    let totalMinutes = 0;
    for (const range of mergedTimeRanges) {
      const [startH, startM] = range.startTime.split(':').map(Number);
      const [endH, endM] = range.endTime.split(':').map(Number);
      totalMinutes += (endH * 60 + endM) - (startH * 60 + startM);
    }
    return totalMinutes;
  };

  /**
   * Tính tổng số BookingDetails sẽ được tạo
   * = số slots đã chọn × số ngày lặp lại
   * (Mỗi slot = 1 BookingDetail, KHÔNG gộp)
   */
  const calculateTotalBookingDetails = () => {
    return selectedSlots.length * calculateRecurringDates.length;
  };

  /**
   * Calculate total price for selected slots (including recurring dates)
   * Giá = (số slots × giá/slot) × số ngày lặp lại
   */
  const calculateTotalPrice = () => {
    const numOccurrences = calculateRecurringDates.length;
    return field.hourlyPrice * selectedSlots.length * numOccurrences;
  };

  /**
   * Build danh sách BookingDetails để gửi lên API
   * Mỗi ngày × mỗi slot = 1 BookingDetail (KHÔNG gộp slots liên tiếp)
   * Lý do: Dễ hủy từng slot riêng lẻ, không cần split record
   */
  const buildBookingDetails = () => {
    const details = [];
    
    for (const dateStr of calculateRecurringDates) {
      for (const slot of selectedSlots) {
        details.push({
          fieldID: field._id,
          startTime: new Date(`${dateStr}T${slot.startTime}:00`).toISOString(),
          endTime: new Date(`${dateStr}T${slot.endTime}:00`).toISOString(),
          priceSnapshot: field.hourlyPrice, // Giá 1 slot
          status: 'Active',
        });
      }
    }
    
    return details;
  };

  /**
   * Handle booking submission
   * Validate và chuẩn bị dữ liệu gửi API
   */
  const handleBooking = () => {
    // Validate: authentication
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để đặt sân');
      navigate('/login', { state: { from: `/field/${id}` } });
      return;
    }

    if (!selectedDate) {
      alert('Vui lòng chọn ngày chơi');
      return;
    }

    if (selectedSlots.length === 0) {
      alert('Vui lòng chọn ít nhất một khung giờ');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(selectedDate) < today) {
      alert('Không thể đặt sân cho ngày trong quá khứ');
      return;
    }

    // Validate recurring end date
    if (recurringType === 'weekly') {
      // recurringMonths đã đảm bảo tối đa 3 tháng (12 tuần), không cần validate thêm
    }

    // ⭐ Check availability cho TẤT CẢ ngày lặp lại
    const { isAvailable, conflictDates } = checkRecurringAvailability();
    if (!isAvailable) {
      const conflictMessages = conflictDates.slice(0, 3).map(c => 
        `• ${new Date(c.date).toLocaleDateString('vi-VN')} (${c.slot})`
      ).join('\n');
      const moreCount = conflictDates.length > 3 ? `\n... và ${conflictDates.length - 3} ngày khác` : '';
      
      alert(
        `Không thể đặt sân vì một số ngày đã có người đặt:\n\n${conflictMessages}${moreCount}\n\n` +
        `Vui lòng chọn khung giờ khác hoặc điều chỉnh lịch lặp lại.`
      );
      return;
    }

    const totalPrice = calculateTotalPrice();
    const depositAmount = Math.round(totalPrice * 0.3);
    const bookingDetails = buildBookingDetails();

    // Build booking summary message
    let bookingMessage = `Đặt sân thành công!\n\n` +
      `📍 Sân: ${field.fieldName}\n`;
    
    if (recurringType === 'weekly') {
      bookingMessage += `📅 Lịch: Lặp hàng tuần - ${recurringMonths} tháng\n` +
        `📆 Từ: ${new Date(selectedDate).toLocaleDateString('vi-VN')}\n` +
        `📆 Đến: ${new Date(calculateRecurringDates[calculateRecurringDates.length - 1]).toLocaleDateString('vi-VN')}\n` +
        `🔢 Số lần: ${calculateRecurringDates.length} lần\n`;
    } else {
      bookingMessage += `📅 Ngày: ${new Date(selectedDate).toLocaleDateString('vi-VN')}\n`;
    }
    
    // Hiển thị merged ranges
    const timeRangesStr = mergedTimeRanges.map(r => `${r.startTime} - ${r.endTime}`).join(', ');
    bookingMessage += `⏰ Khung giờ: ${timeRangesStr}\n` +
      `📝 Số bản ghi: ${bookingDetails.length} booking details\n` +
      `💰 Tổng tiền: ${totalPrice.toLocaleString('vi-VN')}đ\n` +
      `💳 Tiền cọc (30%): ${depositAmount.toLocaleString('vi-VN')}đ`;

    // Mock booking success
    alert(bookingMessage);

    // Log dữ liệu để gửi API
    console.log('=== BOOKING DATA ===');
    console.log('Booking:', {
      customerID: user?.id,
      totalPrice,
      depositAmount,
      status: 'Pending',
      statusPayment: 'Unpaid',
    });
    console.log('BookingDetails:', bookingDetails);
    console.log('Summary:', {
      fieldID: field._id,
      fieldName: field.fieldName,
      recurringType,
      recurringMonths,
      recurringDates: calculateRecurringDates,
      mergedTimeRanges,
      totalBookingDetails: bookingDetails.length,
    });
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
          <span className="breadcrumb-current">{field.fieldName}</span>
        </nav>

        {/* Page Layout */}
        <div className="detail-grid">
          {/* Left Column */}
          <div className="detail-content">
            {/* Header */}
            <div className="detail-header">
              <h1 className="field-title">{field.fieldName}</h1>
              <div className="field-location-row">
                <span className="material-symbols-outlined">location_on</span>
                <p>{field.address}</p>
                <a 
                  href="#" 
                  className="map-link"
                  onClick={handleOpenMap}
                  title="Mở Google Maps"
                >
                  <span className="material-symbols-outlined">map</span>
                  Xem bản đồ
                </a>
              </div>
              <div className="field-badges-row">
                <div className="badge badge-rating">
                  <span className="material-symbols-outlined">star</span>
                  {averageRating > 0 ? `${averageRating} (${totalReviews} đánh giá)` : 'Chưa có đánh giá'}
                </div>
                {field.status === 'Available' && (
                  <div className="badge badge-verified">
                    <span className="material-symbols-outlined">verified</span>
                    Đang hoạt động
                  </div>
                )}
                {field.status === 'Maintenance' && (
                  <div className="badge badge-quick" style={{ background: '#fef3c7', color: '#d97706' }}>
                    <span className="material-symbols-outlined">construction</span>
                    Đang bảo trì
                  </div>
                )}
                <div className="badge badge-quick">
                  <span className="material-symbols-outlined">bolt</span>
                  {field.fieldType?.typeName}
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="image-gallery">
              <div
                className="gallery-main"
                style={{ backgroundImage: `url(${images[0]})` }}
              />
              {images.slice(1, 4).map((img, idx) => (
                <div
                  key={idx}
                  className="gallery-thumb"
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
              {images.length > 4 ? (
                <div className="gallery-thumb gallery-more" style={{ backgroundImage: `url(${images[4]})` }}>
                  <div className="gallery-overlay">
                    <span>+{images.length - 4} ảnh</span>
                  </div>
                </div>
              ) : images.length <= 1 ? (
                <div className="gallery-thumb" style={{ background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>image</span>
                </div>
              ) : null}
            </div>

            {/* Amenities */}
            <div className="detail-section">
              <h3 className="section-title">Tiện ích sân</h3>
              <div className="amenities-grid">
                {amenities.map((amenity, index) => (
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
                <div className="field-info-grid">
                  <div className="field-info-item">
                    <span className="material-symbols-outlined">category</span>
                    <span><strong>Thể loại:</strong> {field.fieldType?.category?.categoryName}</span>
                  </div>
                  <div className="field-info-item">
                    <span className="material-symbols-outlined">sports</span>
                    <span><strong>Loại sân:</strong> {field.fieldType?.typeName}</span>
                  </div>
                  <div className="field-info-item">
                    <span className="material-symbols-outlined">schedule</span>
                    <span><strong>Giờ mở cửa:</strong> {field.openingTime} - {field.closingTime}</span>
                  </div>
                  <div className="field-info-item">
                    <span className="material-symbols-outlined">timer</span>
                    <span><strong>Thời lượng slot:</strong> {field.slotDuration} phút</span>
                  </div>
                  <div className="field-info-item">
                    <span className="material-symbols-outlined">location_on</span>
                    <span><strong>Quận/Huyện:</strong> {field.district}</span>
                  </div>
                  <div className="field-info-item">
                    <span className="material-symbols-outlined">person</span>
                    <span><strong>Quản lý:</strong> {field.manager?.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="detail-section" id="reviews">
              <div className="reviews-header">
                <h3 className="section-title">Đánh giá & Bình luận</h3>
                <button className="btn-write-review">Viết đánh giá</button>
              </div>

              {/* Review Summary */}
              {totalReviews > 0 ? (
                <div className="review-summary">
                  <div className="summary-rating">
                    <span className="rating-number">{averageRating}</span>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className="material-symbols-outlined star-filled">
                          {star <= Math.floor(averageRating) ? 'star' : star === Math.ceil(averageRating) && averageRating % 1 !== 0 ? 'star_half' : 'star'}
                        </span>
                      ))}
                    </div>
                    <span className="rating-count">{totalReviews} đánh giá</span>
                  </div>

                  <div className="rating-breakdown">
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} className="rating-row">
                        <span className="rating-label">{star} sao</span>
                        <div className="rating-bar">
                          <div
                            className="rating-fill"
                            style={{ width: `${ratingBreakdown[star]}%` }}
                          />
                        </div>
                        <span className="rating-percent">{ratingBreakdown[star]}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="review-summary" style={{ textAlign: 'center', padding: '2rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'var(--text-muted)' }}>rate_review</span>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
                </div>
              )}

              {/* Review List */}
              <div className="reviews-list">
                {feedbacks.length > 0 ? feedbacks.map(feedback => (
                  <div key={feedback._id} className="review-item">
                    <div className="review-avatar" style={{ backgroundImage: `url(${feedback.userImage})` }} />
                    <div className="review-content">
                      <div className="review-header">
                        <div>
                          <h4 className="review-author">{feedback.userName}</h4>
                          <div className="review-meta">
                            <div className="review-stars">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span
                                  key={star}
                                  className={`material-symbols-outlined ${star <= feedback.rating ? 'star-filled' : 'star-empty'}`}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                            <span className="review-date">
                              {new Date(feedback.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="review-text">{feedback.comment}</p>
                      <div className="review-actions">
                        <button className="btn-helpful">
                          <span className="material-symbols-outlined">thumb_up</span>
                          Hữu ích
                        </button>
                        <button className="btn-helpful">
                          <span className="material-symbols-outlined">flag</span>
                          Báo cáo
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                    Chưa có đánh giá nào cho sân này.
                  </p>
                )}
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

                {/* Chọn lịch lặp lại */}
                <div className="form-group">
                  <label className="form-label">Lặp lại</label>
                  <select
                    value={recurringType}
                    onChange={(e) => setRecurringType(e.target.value)}
                    className="form-input"
                  >
                    <option value="once">Đặt 1 lần</option>
                    <option value="weekly">Lặp hàng tuần</option>
                  </select>
                  
                  {/* Hiển thị thông tin thứ khi chọn lặp hàng tuần */}
                  {recurringType === 'weekly' && selectedDate && (
                    <p className="form-hint highlight">
                      <span className="material-symbols-outlined">event_repeat</span>
                      Lặp lại vào <strong>{getDayOfWeekName(selectedDate)}</strong> hàng tuần
                    </p>
                  )}
                </div>

                {/* Chọn số tháng lặp - chỉ hiện khi chọn weekly */}
                {recurringType === 'weekly' && (
                  <div className="form-group">
                    <label className="form-label">Thời gian lặp</label>
                    <select
                      value={recurringMonths}
                      onChange={(e) => setRecurringMonths(Number(e.target.value))}
                      className="form-input"
                    >
                      <option value={1}>1 tháng (4 lần)</option>
                      <option value={2}>2 tháng (8 lần)</option>
                      <option value={3}>3 tháng (12 lần)</option>
                    </select>
                    
                    {/* Preview danh sách ngày sẽ đặt */}
                    <div className="recurring-preview">
                      <p className="recurring-preview-title">
                        <span className="material-symbols-outlined">event_repeat</span>
                        Sẽ đặt {calculateRecurringDates.length} {getDayOfWeekName(selectedDate)}:
                      </p>
                      <ul className="recurring-dates-list">
                        {calculateRecurringDates.slice(0, 4).map((date, idx) => (
                          <li key={idx}>
                            {new Date(date).toLocaleDateString('vi-VN', {
                              weekday: 'short',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </li>
                        ))}
                        {calculateRecurringDates.length > 4 && (
                          <li className="more-dates">
                            ... và {calculateRecurringDates.length - 4} ngày khác
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Chọn khung giờ */}
                <div className="form-group">
                  <label className="form-label">
                    Chọn khung giờ {selectedSlots.length > 0 && `(${selectedSlots.length} khung)`}
                  </label>
                  
                  {/* Hiển thị thông báo khi chưa có slots */}
                  {timeSlots.length === 0 && (
                    <p className="empty-slots-text">Không có khung giờ khả dụng cho ngày này</p>
                  )}
                  
                  {/* Danh sách time slots */}
                  <div className="time-slots">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`time-slot ${!slot.available ? 'unavailable' : ''} ${selectedSlots.some(s => s.time === slot.time) ? 'selected' : ''}`}
                        disabled={!slot.available}
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
                  <p className="form-value">{field.fieldType?.typeName} ({field.fieldType?.category?.categoryName})</p>
                </div>

                {/* Thời lượng mỗi khung */}
                <div className="form-group">
                  <label className="form-label">Thời lượng</label>
                  <p className="form-value">{field.slotDuration} phút</p>
                </div>

                {/* Bảng giá */}
                <div className="price-breakdown">
                  {/* Hiển thị merged time ranges nếu đã chọn slots */}
                  {mergedTimeRanges.length > 0 && (
                    <div className="price-row time-ranges">
                      <span>Khung giờ đã chọn:</span>
                      <span className="time-ranges-value">
                        {mergedTimeRanges.map(r => `${r.startTime}-${r.endTime}`).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {/* Giá thuê sân */}
                  <div className="price-row">
                    <span>Giá thuê sân ({field.slotDuration}p) × {selectedSlots.length || 1}</span>
                    <span>{(field.hourlyPrice * (selectedSlots.length || 1)).toLocaleString('vi-VN')}đ</span>
                  </div>
                  
                  {/* Hiển thị số lần lặp lại nếu có */}
                  {recurringType === 'weekly' && calculateRecurringDates.length > 1 && (
                    <div className="price-row recurring">
                      <span>× {calculateRecurringDates.length} lần (hàng tuần)</span>
                      <span>{calculateTotalPrice().toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                  
                  {/* Số booking details sẽ tạo */}
                  {selectedSlots.length > 0 && (
                    <div className="price-row info">
                      <span>Số bản ghi booking</span>
                      <span>{calculateTotalBookingDetails()} records</span>
                    </div>
                  )}
                  
                  {/* Hiển thị tiền cọc khi đã chọn slot */}
                  {selectedSlots.length > 0 && (
                    <div className="price-row deposit">
                      <span>Tiền cọc (30%)</span>
                      <span>{Math.round(calculateTotalPrice() * 0.3).toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                  
                  {/* Tổng tiền */}
                  <div className="price-total">
                    <span>Tổng cộng</span>
                    <span className="total-amount">
                      {selectedSlots.length > 0 
                        ? calculateTotalPrice().toLocaleString('vi-VN') 
                        : field.hourlyPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* Nút đặt sân */}
                <button 
                  className="btn-book-now" 
                  onClick={handleBooking}
                  disabled={selectedSlots.length === 0 || field.status === 'Maintenance'}
                >
                  {field.status === 'Maintenance' ? 'Sân đang bảo trì' : selectedSlots.length > 0 ? 'Đặt sân ngay' : 'Chọn khung giờ'}
                </button>

                <div className="booking-note">
                  <span className="material-symbols-outlined">info</span>
                  <p>Đặt sân trước 24h để được hoàn tiền 100% khi hủy</p>
                </div>
              </div>
            </div>

            {/* Manager Info Card */}
            <div className="manager-info-card">
              <h4 className="manager-info-title">
                <span className="material-symbols-outlined">badge</span>
                Thông tin chủ sân
              </h4>
              <div className="manager-info-body">
                <img
                  src={field.manager?.image || 'https://via.placeholder.com/56'}
                  alt={field.manager?.name}
                  className="manager-info-avatar"
                />
                <div className="manager-info-details">
                  <p className="manager-info-name">{field.manager?.name || 'Chưa cập nhật'}</p>
                  <a href={`tel:${field.manager?.phone}`} className="manager-info-phone">
                    <span className="material-symbols-outlined">phone</span>
                    {field.manager?.phone || 'Chưa cập nhật'}
                  </a>
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
                <a href={`tel:${managerPhone}`} className="btn-contact">
                  <span className="material-symbols-outlined">phone</span>
                  {managerPhone}
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

      {/* Map Modal */}
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        address={field.address}
        fieldName={field.fieldName}
      />
    </div>
  );
};

export default FieldDetailPage;

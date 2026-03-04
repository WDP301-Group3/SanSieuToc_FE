/**
 * ProfileTab Component
 * Tab hiển thị và chỉnh sửa thông tin cá nhân
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BOOKING_ORDER_STATUS } from '../../../data/mockData';

const ProfileTab = ({ user, upcomingBookings, onTabChange }) => {
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || 'Hà Nội, Việt Nam',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: user?.address || 'Hà Nội, Việt Nam',
    });
    setIsEditing(false);
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
      {/* Personal Info Section */}
      <section className="user-dashboard-section">
        <div className="user-dashboard-section-header">
          <h2 className="user-dashboard-section-title">Thông tin cá nhân</h2>
          {!isEditing && (
            <button
              className="user-dashboard-edit-link"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </button>
          )}
        </div>

        <form className="user-dashboard-form" onSubmit={(e) => e.preventDefault()}>
          <div className="user-dashboard-form-grid">
            <label className="user-dashboard-form-field">
              <p className="user-dashboard-form-label">Họ và tên</p>
              <input
                name="name"
                type="text"
                className="user-dashboard-form-input"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </label>

            <label className="user-dashboard-form-field">
              <p className="user-dashboard-form-label">Số điện thoại</p>
              <input
                name="phone"
                type="tel"
                className="user-dashboard-form-input"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </label>

            <label className="user-dashboard-form-field">
              <p className="user-dashboard-form-label">Email</p>
              <input
                name="email"
                type="email"
                className="user-dashboard-form-input"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </label>

            <label className="user-dashboard-form-field">
              <p className="user-dashboard-form-label">Địa chỉ</p>
              <input
                name="address"
                type="text"
                className="user-dashboard-form-input"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </label>
          </div>

          {isEditing && (
            <div className="user-dashboard-form-actions">
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Hủy bỏ
              </button>
              <button type="button" className="btn-save" onClick={handleSave}>
                Lưu thay đổi
              </button>
            </div>
          )}
        </form>
      </section>

      {/* Upcoming Bookings Section */}
      <section className="user-dashboard-bookings-section">
        <div className="user-dashboard-bookings-header">
          <h3 className="user-dashboard-bookings-title">Lịch đặt sân sắp tới</h3>
          <button
            className="user-dashboard-view-all"
            onClick={() => onTabChange('bookings')}
          >
            Xem tất cả
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div className="user-dashboard-bookings-list">
          {upcomingBookings.length === 0 ? (
            <div className="user-dashboard-bookings-empty">
              <span className="material-symbols-outlined">event_busy</span>
              <p>Chưa có lịch đặt sân nào</p>
            </div>
          ) : (
            upcomingBookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              return (
                <div key={booking._id} className="user-dashboard-booking-card">
                  <div
                    className="user-dashboard-booking-image"
                    style={{ backgroundImage: `url(${booking.fieldImage})` }}
                  />
                  <div className="user-dashboard-booking-info">
                    <div className="user-dashboard-booking-badges">
                      <span className={`user-dashboard-booking-status ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                      <span className="user-dashboard-booking-code">
                        Mã: #{booking.bookingCode}
                      </span>
                    </div>
                    <h4 className="user-dashboard-booking-name">{booking.fieldName}</h4>
                    <div className="user-dashboard-booking-meta">
                      <div className="user-dashboard-booking-meta-item">
                        <span className="material-symbols-outlined">calendar_today</span>
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className="user-dashboard-booking-meta-item">
                        <span className="material-symbols-outlined">schedule</span>
                        <span>
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                      <div className="user-dashboard-booking-meta-item price">
                        <span className="material-symbols-outlined">payments</span>
                        <span>{booking.totalPrice.toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  </div>
                  <div className="user-dashboard-booking-actions">
                    <button
                      className="btn-detail"
                      onClick={() => navigate(`/booking-history/${booking._id}`)}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
};

export default ProfileTab;

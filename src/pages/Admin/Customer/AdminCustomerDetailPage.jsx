import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockUsers, mockBookings, USER_ROLES } from '../../../data/mockData';
import '../../../styles/AdminCustomerDetailPage.css';

/**
 * Format date string to dd/MM/yyyy
 */
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/**
 * Format currency
 */
const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN') + 'đ';
};

/**
 * Status display config for customer
 */
const STATUS_CONFIG = {
  active: { label: 'Hoạt động', className: 'customer-status-active' },
  inactive: { label: 'Không hoạt động', className: 'customer-status-inactive' },
  banned: { label: 'Đã bị khóa', className: 'customer-status-banned' },
};

/**
 * Booking status display config
 */
const BOOKING_STATUS_CONFIG = {
  Confirmed: { label: 'Đã xác nhận', className: 'booking-status-confirmed' },
  Completed: { label: 'Hoàn thành', className: 'booking-status-completed' },
  Cancelled: { label: 'Đã hủy', className: 'booking-status-cancelled' },
  Pending: { label: 'Chờ xử lý', className: 'booking-status-pending' },
};

/**
 * Simulate customer status based on user ID (same as AdminCustomersPage)
 */
const getCustomerStatus = (userId, isActive) => {
  const bannedIds = new Set(['u_review_09', 'u_review_15']);
  const inactiveIds = new Set(['u_review_05', 'u_review_12']);
  if (bannedIds.has(userId)) return 'banned';
  if (inactiveIds.has(userId) || !isActive) return 'inactive';
  return 'active';
};

/**
 * Determine customer rank based on total completed bookings
 */
const getCustomerRank = (completedCount) => {
  if (completedCount >= 10) return 'Gold';
  if (completedCount >= 5) return 'Silver';
  return 'Bronze';
};

const AdminCustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(null);
  const [showAllBookings, setShowAllBookings] = useState(false);

  // Find user
  const user = useMemo(() => mockUsers.find((u) => u._id === id), [id]);

  // Get bookings for this user
  const userBookings = useMemo(() => {
    if (!user) return [];
    return mockBookings
      .filter((b) => b.userID === user._id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [user]);

  // Compute stats
  const completedBookings = useMemo(
    () => userBookings.filter((b) => b.status === 'Completed').length,
    [userBookings]
  );

  // Customer status
  const customerStatus = user ? getCustomerStatus(user._id, user.isActive) : 'active';
  const statusConfig = STATUS_CONFIG[customerStatus];

  // Customer rank
  const rank = getCustomerRank(completedBookings);

  // Bookings to display (show first 5 or all)
  const displayedBookings = showAllBookings ? userBookings : userBookings.slice(0, 5);

  // Action handlers
  const handleToggleStatus = () => {
    setConfirmModal({ type: 'toggle' });
  };

  const handleDelete = () => {
    setConfirmModal({ type: 'delete' });
  };

  const handleResetPassword = () => {
    setConfirmModal({ type: 'reset' });
  };

  const handleConfirm = () => {
    setConfirmModal(null);
    alert('Thao tác đã được thực hiện (mock).');
  };

  // 404 if user not found or not a customer
  if (!user || user.role !== USER_ROLES.CUSTOMER) {
    return (
      <div className="customer-detail-not-found">
        <span className="material-symbols-outlined">person_off</span>
        <h2>Không tìm thấy khách hàng</h2>
        <p>Khách hàng với ID "{id}" không tồn tại trong hệ thống.</p>
        <Link to="/admin/customers" className="btn-back-list">
          <span className="material-symbols-outlined">arrow_back</span>
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-customer-detail-page">
      {/* Breadcrumbs & Header */}
      <div className="customer-detail-header">
        <nav className="customer-detail-breadcrumb">
          <Link to="/admin/customers" className="breadcrumb-link">Khách hàng</Link>
          <span className="material-symbols-outlined breadcrumb-separator">chevron_right</span>
          <span className="breadcrumb-current">Chi tiết khách hàng</span>
        </nav>
        <div className="customer-detail-title-row">
          <h2 className="customer-detail-title">Thông tin khách hàng</h2>
          <button
            className="btn-back"
            onClick={() => navigate('/admin/customers')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="customer-profile-card">
        <div className="profile-cover">
          <div className="profile-avatar-wrapper">
            <img
              src={user.image}
              alt={user.name}
              className="profile-avatar"
            />
          </div>
        </div>
        <div className="profile-info-section">
          <div className="profile-info-left">
            <h3 className="profile-name">{user.name}</h3>
            <div className="profile-contact-row">
              <div className="profile-contact-item">
                <span className="material-symbols-outlined">mail</span>
                <span>{user.email}</span>
              </div>
              <div className="profile-contact-item">
                <span className="material-symbols-outlined">phone</span>
                <span>{user.phone}</span>
              </div>
              <div className="profile-contact-item">
                <span className="material-symbols-outlined">location_on</span>
                <span>{user.address}</span>
              </div>
              <span className={`customer-status-badge ${statusConfig.className}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
          <div className="profile-stats-box">
            <div className="profile-stat">
              <p className="profile-stat-label">Tổng lượt đặt</p>
              <p className="profile-stat-value profile-stat-primary">{userBookings.length}</p>
            </div>
            <div className="profile-stat">
              <p className="profile-stat-label">Xếp hạng</p>
              <p className="profile-stat-value">{rank}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking History Table */}
      <div className="customer-booking-history">
        <div className="booking-history-header">
          <h3 className="booking-history-title">Lịch sử đặt sân</h3>
          {userBookings.length > 5 && (
            <button
              className="btn-show-all"
              onClick={() => setShowAllBookings(!showAllBookings)}
            >
              {showAllBookings ? 'Thu gọn' : 'Xem tất cả'}
            </button>
          )}
        </div>
        {userBookings.length === 0 ? (
          <div className="booking-history-empty">
            <span className="material-symbols-outlined">event_busy</span>
            <p>Khách hàng chưa có lịch sử đặt sân nào.</p>
          </div>
        ) : (
          <div className="booking-table-wrapper">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Tên sân</th>
                  <th>Khung giờ</th>
                  <th>Thành tiền</th>
                  <th className="text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {displayedBookings.map((booking) => {
                  const bStatus = BOOKING_STATUS_CONFIG[booking.status] || {
                    label: booking.status,
                    className: '',
                  };
                  return (
                    <tr key={booking._id}>
                      <td className="td-date">{formatDate(booking.date)}</td>
                      <td className="td-field">{booking.fieldName}</td>
                      <td className="td-time">{booking.startTime} - {booking.endTime}</td>
                      <td className="td-price">{formatCurrency(booking.totalPrice)}</td>
                      <td className="td-status text-right">
                        <span className={`booking-status-badge ${bStatus.className}`}>
                          {bStatus.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="customer-account-actions">
        <h3 className="account-actions-title">Quản lý tài khoản</h3>
        <p className="account-actions-desc">
          Các hành động quản trị viên có thể thực hiện đối với tài khoản khách hàng này.
        </p>
        <div className="account-actions-buttons">
          <button className="btn-action btn-toggle-status" onClick={handleToggleStatus}>
            <span className="material-symbols-outlined">sync</span>
            Thay đổi trạng thái
          </button>
          <button className="btn-action btn-delete-account" onClick={handleDelete}>
            <span className="material-symbols-outlined">lock</span>
            Khóa tài khoản
          </button>
          <button className="btn-action btn-reset-password" onClick={handleResetPassword}>
            <span className="material-symbols-outlined">lock_reset</span>
            Đặt lại mật khẩu
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="confirm-modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon">
              <span className="material-symbols-outlined">
                {confirmModal.type === 'delete' ? 'warning' : 'help'}
              </span>
            </div>
            <h3 className="confirm-modal-title">
              {confirmModal.type === 'toggle' && 'Thay đổi trạng thái?'}
              {confirmModal.type === 'delete' && 'Xóa tài khoản?'}
              {confirmModal.type === 'reset' && 'Đặt lại mật khẩu?'}
            </h3>
            <p className="confirm-modal-desc">
              {confirmModal.type === 'toggle' &&
                `Bạn có chắc muốn thay đổi trạng thái tài khoản của "${user.name}"?`}
              {confirmModal.type === 'delete' &&
                `Hành động này sẽ xóa vĩnh viễn tài khoản của "${user.name}". Không thể hoàn tác.`}
              {confirmModal.type === 'reset' &&
                `Mật khẩu của "${user.name}" sẽ được đặt lại về mặc định.`}
            </p>
            <div className="confirm-modal-actions">
              <button className="btn-modal-cancel" onClick={() => setConfirmModal(null)}>
                Hủy
              </button>
              <button
                className={`btn-modal-confirm ${confirmModal.type === 'delete' ? 'btn-danger' : ''}`}
                onClick={handleConfirm}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomerDetailPage;

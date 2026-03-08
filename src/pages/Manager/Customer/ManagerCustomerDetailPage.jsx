import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCustomerById, updateCustomerStatus } from '../../../services/managerService';
import { useNotification } from '../../../context/NotificationContext';
import '../../../styles/ManagerCustomerDetailPage.css';

/**
 * Format date string to dd/MM/yyyy
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/**
 * Format currency
 */
const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString('vi-VN') + 'đ';
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
 * Determine customer rank based on total completed bookings
 */
const getCustomerRank = (completedCount) => {
  if (completedCount >= 10) return 'Gold';
  if (completedCount >= 5) return 'Silver';
  return 'Bronze';
};

const ManagerCustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notification = useNotification();

  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const res = await getCustomerById(id);
      if (res.success && res.data) {
        const data = res.data;
        // BE may return customer + bookings wrapped together
        const cust = data.customer || data;
        const bks = data.bookings || data.bookingHistory || [];
        setCustomer(cust);
        setBookings(bks);
      } else {
        setError(res.error || 'Không tìm thấy khách hàng');
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="manager-customer-detail-page">
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '2.5rem' }}>sync</span>
          <p>Đang tải thông tin khách hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="customer-detail-not-found">
        <span className="material-symbols-outlined">person_off</span>
        <h2>Không tìm thấy khách hàng</h2>
        <p>{error || `Khách hàng với ID "${id}" không tồn tại trong hệ thống.`}</p>
        <Link to="/admin/customers" className="btn-back-list">
          <span className="material-symbols-outlined">arrow_back</span>
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Normalise status from BE (may be 'Active'/'Banned'/'Inactive')
  const rawStatus = (customer.status || customer.accountStatus || 'active').toLowerCase();
  const customerStatus = ['active', 'inactive', 'banned'].includes(rawStatus) ? rawStatus : 'active';
  const statusConfig = STATUS_CONFIG[customerStatus];

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
  );
  const completedCount = sortedBookings.filter((b) => b.status === 'Completed').length;
  const rank = getCustomerRank(completedCount);
  const displayedBookings = showAllBookings ? sortedBookings : sortedBookings.slice(0, 5);

  const handleToggleStatus = () => setConfirmModal({ type: 'toggle' });
  const handleBanAccount = () => setConfirmModal({ type: 'ban' });

  const handleConfirm = async () => {
    if (confirmModal?.type === 'toggle') {
      setActionLoading(true);
      const newStatus = customerStatus === 'active' ? 'inactive' : 'active';
      const res = await updateCustomerStatus(id, newStatus);
      setActionLoading(false);
      if (res.success) {
        setCustomer((prev) => ({ ...prev, status: newStatus }));
        notification.success('Đã thay đổi trạng thái tài khoản.');
      } else {
        notification.error(res.error || 'Thay đổi trạng thái thất bại.');
      }
    } else if (confirmModal?.type === 'ban') {
      setActionLoading(true);
      const newStatus = customerStatus === 'banned' ? 'active' : 'banned';
      const res = await updateCustomerStatus(id, newStatus);
      setActionLoading(false);
      if (res.success) {
        setCustomer((prev) => ({ ...prev, status: newStatus }));
        notification.success(newStatus === 'banned' ? 'Đã khóa tài khoản.' : 'Đã mở khóa tài khoản.');
      } else {
        notification.error(res.error || 'Cập nhật trạng thái thất bại.');
      }
    } else {
      notification.success('Thao tác đã được thực hiện.');
    }
    setConfirmModal(null);
  };

  return (
    <div className="manager-customer-detail-page">
      {/* Breadcrumbs & Header */}
      <div className="customer-detail-header">
        <nav className="customer-detail-breadcrumb">
          <Link to="/admin/customers" className="breadcrumb-link">Khách hàng</Link>
          <span className="material-symbols-outlined breadcrumb-separator">chevron_right</span>
          <span className="breadcrumb-current">Chi tiết khách hàng</span>
        </nav>
        <div className="customer-detail-title-row">
          <h2 className="customer-detail-title">Thông tin khách hàng</h2>
          <button className="btn-back" onClick={() => navigate('/admin/customers')}>
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
              src={customer.image || customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name || 'User')}&background=19e62b&color=fff`}
              alt={customer.name}
              className="profile-avatar"
            />
          </div>
        </div>
        <div className="profile-info-section">
          <div className="profile-info-left">
            <h3 className="profile-name">{customer.name || customer.fullName || 'N/A'}</h3>
            <div className="profile-contact-row">
              <div className="profile-contact-item">
                <span className="material-symbols-outlined">mail</span>
                <span>{customer.email || '—'}</span>
              </div>
              <div className="profile-contact-item">
                <span className="material-symbols-outlined">phone</span>
                <span>{customer.phone || '—'}</span>
              </div>
              {customer.address && (
                <div className="profile-contact-item">
                  <span className="material-symbols-outlined">location_on</span>
                  <span>{customer.address}</span>
                </div>
              )}
              <span className={`customer-status-badge ${statusConfig.className}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
          <div className="profile-stats-box">
            <div className="profile-stat">
              <p className="profile-stat-label">Tổng lượt đặt</p>
              <p className="profile-stat-value profile-stat-primary">{sortedBookings.length}</p>
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
          {sortedBookings.length > 5 && (
            <button className="btn-show-all" onClick={() => setShowAllBookings(!showAllBookings)}>
              {showAllBookings ? 'Thu gọn' : 'Xem tất cả'}
            </button>
          )}
        </div>
        {sortedBookings.length === 0 ? (
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
                  const fieldName =
                    booking.fieldName ||
                    booking.fieldID?.fieldName ||
                    booking.field?.fieldName ||
                    '—';
                  return (
                    <tr key={booking._id}>
                      <td className="td-date">{formatDate(booking.date || booking.bookingDate)}</td>
                      <td className="td-field">{fieldName}</td>
                      <td className="td-time">
                        {booking.startTime || '—'} - {booking.endTime || '—'}
                      </td>
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
          <button
            className="btn-action btn-toggle-status"
            onClick={handleToggleStatus}
            disabled={actionLoading}
          >
            <span className="material-symbols-outlined">sync</span>
            {customerStatus === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
          </button>
          <button
            className="btn-action btn-delete-account"
            onClick={handleBanAccount}
            disabled={actionLoading}
          >
            <span className="material-symbols-outlined">
              {customerStatus === 'banned' ? 'lock_open' : 'lock'}
            </span>
            {customerStatus === 'banned' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="confirm-modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon">
              <span className="material-symbols-outlined">
                {confirmModal.type === 'ban' ? 'warning' : 'help'}
              </span>
            </div>
            <h3 className="confirm-modal-title">
              {confirmModal.type === 'toggle' && 'Thay đổi trạng thái?'}
              {confirmModal.type === 'ban' &&
                (customerStatus === 'banned' ? 'Mở khóa tài khoản?' : 'Khóa tài khoản?')}
            </h3>
            <p className="confirm-modal-desc">
              {confirmModal.type === 'toggle' &&
                `Bạn có chắc muốn thay đổi trạng thái tài khoản của "${customer.name}"?`}
              {confirmModal.type === 'ban' && customerStatus !== 'banned' &&
                `Tài khoản của "${customer.name}" sẽ bị khóa và không thể đăng nhập.`}
              {confirmModal.type === 'ban' && customerStatus === 'banned' &&
                `Tài khoản của "${customer.name}" sẽ được mở khóa.`}
            </p>
            <div className="confirm-modal-actions">
              <button className="btn-modal-cancel" onClick={() => setConfirmModal(null)}>
                Hủy
              </button>
              <button
                className={`btn-modal-confirm ${confirmModal.type === 'ban' && customerStatus !== 'banned' ? 'btn-danger' : ''}`}
                onClick={handleConfirm}
                disabled={actionLoading}
              >
                {actionLoading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerCustomerDetailPage;

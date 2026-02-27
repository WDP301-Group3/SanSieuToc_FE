import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getBookingsByUserID,
  getUserBookingStats,
  getUserMemberTier,
  BOOKING_ORDER_STATUS,
} from '../../data/mockData';
import '../../styles/UserDashboardPage.css';

const ITEMS_PER_PAGE = 5;

const UserDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Determine active tab from URL path
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/booking-history')) return 'bookings';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/profile')) return 'profile';
    return searchParams.get('tab') || 'profile';
  };

  const activeTab = getTabFromPath();
  
  // State for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || 'Hà Nội, Việt Nam',
  });

  // State for booking history
  const [bookingTab, setBookingTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // State for settings
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
  });
  const [language, setLanguage] = useState('vi');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get data from mockData
  const allBookings = useMemo(() => {
    if (!user?.id) return [];
    return getBookingsByUserID(user.id);
  }, [user]);

  const stats = useMemo(() => {
    if (!user?.id) return { total: 0, completed: 0, confirmed: 0, cancelled: 0, pending: 0, totalSpent: 0 };
    return getUserBookingStats(user.id);
  }, [user]);

  const memberTier = useMemo(() => {
    if (!user?.id) return { name: 'Thành viên Đồng', color: '#cd7f32' };
    return getUserMemberTier(user.id);
  }, [user]);

  const upcomingBookings = useMemo(() => {
    return allBookings
      .filter((b) => b.status === BOOKING_ORDER_STATUS.CONFIRMED || b.status === BOOKING_ORDER_STATUS.PENDING)
      .slice(0, 4);
  }, [allBookings]);

  // Main navigation items
  const menuItems = [
    { key: 'profile', icon: 'person', label: 'Thông tin cá nhân' },
    { key: 'bookings', icon: 'calendar_month', label: 'Lịch sử đặt sân' },
    { key: 'settings', icon: 'settings', label: 'Cài đặt' },
  ];

  // Booking tabs
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
      filtered = allBookings.filter((b) => b.status === BOOKING_ORDER_STATUS.CONFIRMED || b.status === BOOKING_ORDER_STATUS.PENDING);
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

  // Handlers
  const handleTabChange = (tabKey) => {
    // Navigate to appropriate path
    if (tabKey === 'bookings') {
      navigate('/booking-history');
    } else if (tabKey === 'settings') {
      navigate('/settings');
    } else {
      navigate('/profile');
    }
  };

  const handleBookingTabChange = (tabKey) => {
    setBookingTab(tabKey);
    setCurrentPage(1);
  };

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

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };

  const handlePasswordFormChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setPasswordError('');
    setPasswordSuccess(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    console.log('Password changed:', passwordForm);
    setPasswordError('');
    setPasswordSuccess(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSuccessContinue = () => {
    setShowPasswordModal(false);
    setPasswordSuccess(false);
  };

  // Format helpers
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
    <div className="user-dashboard-page">
      <div className="user-dashboard-layout">
        {/* Sidebar */}
        <aside className="user-dashboard-sidebar">
          <div className="user-dashboard-sidebar-card">
            {/* User Brief */}
            <div className="user-dashboard-user-brief">
              <div className="user-dashboard-avatar-wrapper">
                <img
                  src={user?.image || 'https://via.placeholder.com/100'}
                  alt="User Avatar"
                  className="user-dashboard-avatar"
                />
                <button className="user-dashboard-avatar-edit">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <h1 className="user-dashboard-user-name">{formData.name}</h1>
              <span
                className="user-dashboard-user-badge"
                style={{ backgroundColor: memberTier.color, color: '#fff' }}
              >
                {memberTier.name}
              </span>
            </div>

            {/* Navigation */}
            <nav className="user-dashboard-nav">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  className={`user-dashboard-nav-item ${activeTab === item.key ? 'active' : ''}`}
                  onClick={() => handleTabChange(item.key)}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <p>{item.label}</p>
                </button>
              ))}
              <div className="user-dashboard-nav-divider" />
              <button className="user-dashboard-nav-item logout" onClick={logout}>
                <span className="material-symbols-outlined">logout</span>
                <p>Đăng xuất</p>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="user-dashboard-main">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
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
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={handleCancel}
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="button"
                        className="btn-save"
                        onClick={handleSave}
                      >
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
                    onClick={() => handleTabChange('bookings')}
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
                              <span className="user-dashboard-booking-code">Mã: #{booking.bookingCode}</span>
                            </div>
                            <h4 className="user-dashboard-booking-name">{booking.fieldName}</h4>
                            <div className="user-dashboard-booking-meta">
                              <div className="user-dashboard-booking-meta-item">
                                <span className="material-symbols-outlined">calendar_today</span>
                                <span>{formatDate(booking.date)}</span>
                              </div>
                              <div className="user-dashboard-booking-meta-item">
                                <span className="material-symbols-outlined">schedule</span>
                                <span>{booking.startTime} - {booking.endTime}</span>
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
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <>
              {/* Stats Summary */}
              <div className="user-dashboard-stats-row">
                <div className="user-dashboard-stat-card">
                  <span className="material-symbols-outlined user-dashboard-stat-icon">confirmation_number</span>
                  <div>
                    <p className="user-dashboard-stat-value">{stats.total}</p>
                    <p className="user-dashboard-stat-label">Tổng đơn</p>
                  </div>
                </div>
                <div className="user-dashboard-stat-card">
                  <span className="material-symbols-outlined user-dashboard-stat-icon completed">check_circle</span>
                  <div>
                    <p className="user-dashboard-stat-value">{stats.completed}</p>
                    <p className="user-dashboard-stat-label">Hoàn thành</p>
                  </div>
                </div>
                <div className="user-dashboard-stat-card">
                  <span className="material-symbols-outlined user-dashboard-stat-icon cancelled">cancel</span>
                  <div>
                    <p className="user-dashboard-stat-value">{stats.cancelled}</p>
                    <p className="user-dashboard-stat-label">Đã hủy</p>
                  </div>
                </div>
                <div className="user-dashboard-stat-card">
                  <span className="material-symbols-outlined user-dashboard-stat-icon spent">payments</span>
                  <div>
                    <p className="user-dashboard-stat-value">{stats.totalSpent.toLocaleString('vi-VN')}đ</p>
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
                      <span className="material-symbols-outlined user-dashboard-empty-icon">event_busy</span>
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
                              <span className="user-dashboard-booking-code">Mã đặt sân: #{booking.bookingCode}</span>
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
                                <span>{booking.startTime} - {booking.endTime}</span>
                              </div>
                              <div className="user-dashboard-meta-item user-dashboard-meta-price">
                                <span className="material-symbols-outlined">payments</span>
                                <span>{booking.totalPrice.toLocaleString('vi-VN')}đ</span>
                              </div>
                            </div>
                          </div>
                          <div className="user-dashboard-booking-actions">
                            {!isCancelled && (
                              <Link to={`/booking-history/${booking._id}`} className="user-dashboard-btn-detail">
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
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <>
              <h2 className="user-dashboard-page-title">Cài đặt</h2>

              {/* Notifications Section */}
              <section className="user-dashboard-settings-section">
                <div className="user-dashboard-settings-section-header">
                  <h3 className="user-dashboard-settings-section-title">
                    <span className="material-symbols-outlined">notifications</span>
                    Thông báo
                  </h3>
                  <p className="user-dashboard-settings-section-desc">
                    Quản lý cách bạn nhận thông tin về lịch đặt sân và ưu đãi.
                  </p>
                </div>
                <div className="user-dashboard-settings-section-body">
                  <div className="user-dashboard-settings-toggle-row">
                    <div>
                      <p className="user-dashboard-settings-toggle-label">Thông báo qua Email</p>
                      <p className="user-dashboard-settings-toggle-desc">Nhận xác nhận đặt sân và hóa đơn qua email.</p>
                    </div>
                    <label className="user-dashboard-settings-toggle">
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={() => handleNotificationChange('email')}
                        className="sr-only peer"
                      />
                      <div className="user-dashboard-settings-toggle-track" />
                    </label>
                  </div>

                  <div className="user-dashboard-settings-toggle-row bordered">
                    <div>
                      <p className="user-dashboard-settings-toggle-label">Thông báo qua SMS</p>
                      <p className="user-dashboard-settings-toggle-desc">Nhận mã nhắc nhở giờ đá qua tin nhắn điện thoại.</p>
                    </div>
                    <label className="user-dashboard-settings-toggle">
                      <input
                        type="checkbox"
                        checked={notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                        className="sr-only peer"
                      />
                      <div className="user-dashboard-settings-toggle-track" />
                    </label>
                  </div>

                  <div className="user-dashboard-settings-toggle-row bordered">
                    <div>
                      <p className="user-dashboard-settings-toggle-label">Thông báo trên Ứng dụng</p>
                      <p className="user-dashboard-settings-toggle-desc">Thông báo đẩy trực tiếp trên trình duyệt hoặc điện thoại.</p>
                    </div>
                    <label className="user-dashboard-settings-toggle">
                      <input
                        type="checkbox"
                        checked={notifications.push}
                        onChange={() => handleNotificationChange('push')}
                        className="sr-only peer"
                      />
                      <div className="user-dashboard-settings-toggle-track" />
                    </label>
                  </div>
                </div>
              </section>

              {/* Security Section */}
              <section className="user-dashboard-settings-section">
                <div className="user-dashboard-settings-section-header">
                  <h3 className="user-dashboard-settings-section-title">
                    <span className="material-symbols-outlined">security</span>
                    Bảo mật
                  </h3>
                  <p className="user-dashboard-settings-section-desc">
                    Bảo vệ tài khoản và thông tin cá nhân của bạn.
                  </p>
                </div>
                <div className="user-dashboard-settings-section-body">
                  <div className="user-dashboard-settings-toggle-row">
                    <div>
                      <p className="user-dashboard-settings-toggle-label">Mật khẩu</p>
                      <p className="user-dashboard-settings-toggle-desc">Thay đổi mật khẩu đăng nhập thường xuyên để bảo mật.</p>
                    </div>
                    <button className="user-dashboard-settings-btn-outline" onClick={handleChangePassword}>
                      Đổi mật khẩu
                    </button>
                  </div>

                  <div className="user-dashboard-settings-toggle-row bordered">
                    <div>
                      <p className="user-dashboard-settings-toggle-label">Xác thực 2 yếu tố (2FA)</p>
                      <p className="user-dashboard-settings-toggle-desc">Thêm một lớp bảo mật khi đăng nhập.</p>
                    </div>
                    <label className="user-dashboard-settings-toggle">
                      <input
                        type="checkbox"
                        checked={security.twoFactor}
                        onChange={() => setSecurity((prev) => ({ ...prev, twoFactor: !prev.twoFactor }))}
                        className="sr-only peer"
                      />
                      <div className="user-dashboard-settings-toggle-track" />
                    </label>
                  </div>
                </div>
              </section>

              {/* Language Section */}
              <section className="user-dashboard-settings-section">
                <div className="user-dashboard-settings-section-header">
                  <h3 className="user-dashboard-settings-section-title">
                    <span className="material-symbols-outlined">language</span>
                    Ngôn ngữ
                  </h3>
                </div>
                <div className="user-dashboard-settings-section-body">
                  <div className="user-dashboard-settings-language-select">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="user-dashboard-settings-select"
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={handleClosePasswordModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            {passwordSuccess ? (
              <div className="modal-success-popup">
                <div className="modal-success-icon">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <h3 className="modal-success-title">Đổi mật khẩu thành công!</h3>
                <p className="modal-success-desc">
                  Mật khẩu của bạn đã được cập nhật an toàn. Vui lòng sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.
                </p>
                <button className="modal-success-btn" onClick={handleSuccessContinue}>
                  Tiếp tục
                </button>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h3 className="modal-title">
                    <span className="material-symbols-outlined">lock</span>
                    Đổi mật khẩu
                  </h3>
                  <button className="modal-close-btn" onClick={handleClosePasswordModal}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="modal-body">
                  {passwordError && (
                    <div className="modal-error">
                      <span className="material-symbols-outlined">error</span>
                      {passwordError}
                    </div>
                  )}

                  <div className="modal-field">
                    <label className="modal-label">Mật khẩu hiện tại</label>
                    <div className="modal-input-wrapper">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                        className="modal-input"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button
                        type="button"
                        className="modal-toggle-password"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        <span className="material-symbols-outlined">
                          {showCurrentPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="modal-field">
                    <label className="modal-label">Mật khẩu mới</label>
                    <div className="modal-input-wrapper">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                        className="modal-input"
                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                      />
                      <button
                        type="button"
                        className="modal-toggle-password"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <span className="material-symbols-outlined">
                          {showNewPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="modal-field">
                    <label className="modal-label">Xác nhận mật khẩu mới</label>
                    <div className="modal-input-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                        className="modal-input"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        className="modal-toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <span className="material-symbols-outlined">
                          {showConfirmPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="modal-btn-cancel" onClick={handleClosePasswordModal}>
                      Hủy
                    </button>
                    <button type="submit" className="modal-btn-submit">
                      Xác nhận
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;

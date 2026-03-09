import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummary, getRecentBookings } from '../../services/managerService';
import '../../styles/ManagerDashboard.css';

// ============================================================================
// HELPERS
// ============================================================================

const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${time} - ${date}`;
};

const getStatusInfo = (status) => {
  switch (status) {
    case 'Confirmed': case 'confirmed': return { key: 'confirmed', label: 'Đã xác nhận' };
    case 'Pending': case 'pending': return { key: 'pending', label: 'Chờ xác nhận' };
    case 'Cancelled': case 'cancelled': return { key: 'cancelled', label: 'Đã hủy' };
    case 'Completed': case 'completed': return { key: 'completed', label: 'Hoàn thành' };
    default: return { key: 'pending', label: status || 'Chờ xác nhận' };
  }
};

const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
};

const SHORTCUTS = [
  { icon: 'stadium', title: 'Quản lý sân', desc: 'Cập nhật thông tin & trạng thái sân', link: '/admin/fields', image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80' },
  { icon: 'people_alt', title: 'Quản lý khách hàng', desc: 'Quản lý người dùng & lịch sử đặt', link: '/admin/customers', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80' },
  { icon: 'rate_review', title: 'Xem Feedback', desc: 'Xem và xử lý góp ý từ khách hàng', link: '/admin/feedback', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80' },
];

// ============================================================================
// COMPONENT
// ============================================================================

const ManagerDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const [summaryRes, bookingsRes] = await Promise.all([
        getDashboardSummary(),
        getRecentBookings(10),
      ]);
      if (summaryRes.success) setSummary(summaryRes.data);
      else setError(summaryRes.error);
      if (bookingsRes.success) setRecentBookings(bookingsRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = summary
    ? [
        {
          icon: 'stadium', iconBg: 'green', label: 'Tổng số sân',
          value: summary.totalFields ?? summary.fields ?? 0, trendText: '+5%', trendUp: true,
          note: `${summary.maintenanceFields ?? 0} sân đang bảo trì`, dotColor: 'green',
        },
        {
          icon: 'person', iconBg: 'blue', label: 'Tổng khách hàng',
          value: summary.totalCustomers ?? summary.customers ?? 0, trendText: '+3%', trendUp: true,
          note: `${summary.activeCustomers ?? 0} đang hoạt động`, dotColor: 'green',
        },
        {
          icon: 'reviews', iconBg: 'amber', label: 'Tổng feedback',
          value: summary.totalFeedbacks ?? summary.feedbacks ?? 0, trendText: '+12%', trendUp: true,
          note: `Đánh giá TB: ${summary.avgRating ?? 'N/A'} / 5`, dotColor: 'green',
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="manager-dashboard">
        <div className="dashboard-loading">
          <span className="material-symbols-outlined loading-spin">progress_activity</span>
          <p>Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-dashboard">
      {error && (
        <div className="dashboard-error">
          <span className="material-symbols-outlined">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="dashboard-stats">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-card-top">
                <div className={`stat-icon ${stat.iconBg}`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <span className={`stat-trend ${stat.trendUp ? 'up' : 'down'}`}>
                  <span className="material-symbols-outlined">
                    {stat.trendUp ? 'trending_up' : 'trending_down'}
                  </span>
                  {stat.trendText}
                </span>
              </div>
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value.toLocaleString('vi-VN')}</h3>
              <p className="stat-note">
                <span className={`stat-dot ${stat.dotColor}`} />
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Shortcuts */}
      <div className="dashboard-shortcuts">
        <h2 className="dashboard-section-title">
          <span className="material-symbols-outlined">bolt</span>
          Truy cập nhanh
        </h2>
        <div className="shortcuts-grid">
          {SHORTCUTS.map((sc, idx) => (
            <Link key={idx} to={sc.link} className="shortcut-card">
              <div className="shortcut-overlay" />
              <div className="shortcut-bg" style={{ backgroundImage: `url("${sc.image}")` }} />
              <div className="shortcut-content">
                <div className="shortcut-icon-wrapper">
                  <span className="material-symbols-outlined">{sc.icon}</span>
                </div>
                <p className="shortcut-title">{sc.title}</p>
                <p className="shortcut-desc">{sc.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="dashboard-table-card">
        <div className="table-header">
          <h3 className="table-title">Đặt sân gần đây</h3>
          <Link to="/admin/customers" className="table-view-all">Xem tất cả</Link>
        </div>
        <div className="table-wrapper">
          {recentBookings.length === 0 ? (
            <div className="dashboard-empty">
              <span className="material-symbols-outlined">calendar_today</span>
              <p>Chưa có đặt sân nào gần đây.</p>
            </div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Sân</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking, idx) => {
                  const customerName =
                    booking.customerName || booking.customer?.name ||
                    booking.customerID?.name || 'Khách hàng';
                  const fieldName =
                    booking.fieldName || booking.field?.fieldName ||
                    booking.fieldID?.fieldName || 'N/A';
                  const timeStr = formatDateTime(
                    booking.startTime || booking.bookingDate || booking.createdAt
                  );
                  const statusInfo = getStatusInfo(booking.status || booking.paymentStatus);
                  return (
                    <tr key={booking._id || idx}>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-initials">{getInitials(customerName)}</div>
                          <span className="customer-name">{customerName}</span>
                        </div>
                      </td>
                      <td className="field-cell">{fieldName}</td>
                      <td className="time-cell">{timeStr}</td>
                      <td>
                        <span className={`status-badge ${statusInfo.key}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardPage;

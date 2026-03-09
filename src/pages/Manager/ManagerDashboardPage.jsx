import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getDashboardSummary,
  getRecentBookings,
  getTopFields,
  getTopCustomers,
} from '../../services/managerService';
import '../../styles/ManagerDashboard.css';
import '../../styles/ManagerFieldsPage.css';

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

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const getStatusInfo = (status) => {
  switch (status) {
    case 'Confirmed': case 'confirmed': return { key: 'confirmed', label: 'Đã xác nhận' };
    case 'Pending':   case 'pending':   return { key: 'pending',   label: 'Chờ xác nhận' };
    case 'Cancelled': case 'cancelled': return { key: 'cancelled', label: 'Đã hủy' };
    case 'Completed': case 'completed': return { key: 'completed', label: 'Hoàn thành' };
    default: return { key: 'pending', label: status || 'Chờ xác nhận' };
  }
};

const getPaymentStatusInfo = (status) => {
  switch (status) {
    case 'Paid':   return { key: 'confirmed', label: 'Đã thanh toán' };
    case 'Unpaid': return { key: 'pending',   label: 'Chưa thanh toán' };
    default:       return { key: 'pending',   label: status || 'N/A' };
  }
};

const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
};

const SHORTCUTS = [
  { icon: 'stadium',     title: 'Quản lý sân',       desc: 'Cập nhật thông tin & trạng thái sân', link: '/admin/fields',    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80' },
  { icon: 'people_alt',  title: 'Quản lý khách hàng', desc: 'Quản lý người dùng & lịch sử đặt',   link: '/admin/customers', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80' },
  { icon: 'rate_review', title: 'Xem Feedback',        desc: 'Xem và xử lý góp ý từ khách hàng',   link: '/admin/feedback',  image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80' },
];

// ============================================================================
// COMPONENT
// ============================================================================

const ManagerDashboardPage = () => {
  const [summary, setSummary]             = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [topFields, setTopFields]         = useState([]);
  const [topCustomers, setTopCustomers]   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const [summaryRes, bookingsRes, topFieldsRes, topCustomersRes] = await Promise.all([
        getDashboardSummary(),
        getRecentBookings(10),
        getTopFields(5),
        getTopCustomers(5),
      ]);

      if (summaryRes.success)      setSummary(summaryRes.data);
      else                         setError(summaryRes.error);

      if (bookingsRes.success)     setRecentBookings(bookingsRes.data || []);
      if (topFieldsRes.success)    setTopFields(topFieldsRes.data || []);
      if (topCustomersRes.success) setTopCustomers(topCustomersRes.data || []);

      setLoading(false);
    };
    fetchData();
  }, []);

  // Build stat cards from summary data
  const revenueStats = summary?.revenueStats || {};
  const stats = summary
    ? [
        {
          icon: 'stadium', iconBg: 'green', label: 'Tổng số sân',
          value: summary.totalFields ?? 0,
          note: 'Sân đang hoạt động trong hệ thống',
          dotColor: 'green',
        },
        {
          icon: 'person', iconBg: 'blue', label: 'Tổng khách hàng',
          value: summary.totalCustomers ?? 0,
          note: 'Khách hàng đã đăng ký',
          dotColor: 'green',
        },
        {
          icon: 'calendar_month', iconBg: 'amber', label: 'Tổng đặt sân',
          value: summary.totalBookings ?? 0,
          note: 'Tổng số lượt đặt sân',
          dotColor: 'green',
        },
        {
          icon: 'reviews', iconBg: 'purple', label: 'Tổng feedback',
          value: summary.totalFeedbacks ?? 0,
          note: 'Đánh giá từ khách hàng',
          dotColor: 'green',
        },
        {
          icon: 'payments', iconBg: 'teal', label: 'Doanh thu (đã thu)',
          value: revenueStats.totalPaidRevenue ?? 0,
          isCurrency: true,
          note: `Tổng: ${formatCurrency(revenueStats.totalRevenue ?? 0)}`,
          dotColor: 'green',
        },
        {
          icon: 'savings', iconBg: 'orange', label: 'Đã đặt cọc',
          value: revenueStats.totalDeposit ?? 0,
          isCurrency: true,
          note: 'Tổng tiền cọc thu được',
          dotColor: 'green',
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
        <div className="dashboard-stats dashboard-stats-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="field-stat-card">
              <div className={`field-stat-icon ${stat.iconBg}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <div>
                <div className="field-stat-value">
                  {stat.isCurrency
                    ? formatCurrency(stat.value)
                    : stat.value.toLocaleString('vi-VN')}
                </div>
                <div className="field-stat-label">{stat.label}</div>
              </div>
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

      {/* Top Fields & Top Customers */}
      <div className="dashboard-top-grid">
        {/* Top Fields */}
        <div className="dashboard-table-card">
          <div className="table-header">
            <h3 className="table-title">
              <span className="material-symbols-outlined">emoji_events</span>
              Top sân doanh thu cao
            </h3>
            <Link to="/admin/fields" className="table-view-all">Xem tất cả</Link>
          </div>
          <div className="table-wrapper">
            {topFields.length === 0 ? (
              <div className="dashboard-empty">
                <span className="material-symbols-outlined">stadium</span>
                <p>Chưa có dữ liệu sân.</p>
              </div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên sân</th>
                    <th>Lượt đặt</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {topFields.map((field, idx) => (
                    <tr key={field._id || idx}>
                      <td className="rank-cell">
                        <span className={`rank-badge rank-${idx + 1}`}>{idx + 1}</span>
                      </td>
                      <td className="field-cell">{field.fieldName || 'N/A'}</td>
                      <td className="count-cell">{field.bookingCount ?? 0}</td>
                      <td className="price-cell">{formatCurrency(field.totalRevenue ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="dashboard-table-card">
          <div className="table-header">
            <h3 className="table-title">
              <span className="material-symbols-outlined">workspace_premium</span>
              Top khách hàng chi tiêu nhiều
            </h3>
            <Link to="/admin/customers" className="table-view-all">Xem tất cả</Link>
          </div>
          <div className="table-wrapper">
            {topCustomers.length === 0 ? (
              <div className="dashboard-empty">
                <span className="material-symbols-outlined">person</span>
                <p>Chưa có dữ liệu khách hàng.</p>
              </div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Khách hàng</th>
                    <th>Lượt đặt</th>
                    <th>Chi tiêu</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer, idx) => {
                    const name = customer.customerName || customer.name || 'Khách hàng';
                    return (
                      <tr key={customer._id || idx}>
                        <td className="rank-cell">
                          <span className={`rank-badge rank-${idx + 1}`}>{idx + 1}</span>
                        </td>
                        <td>
                          <div className="customer-cell">
                            <div className="customer-initials">{getInitials(name)}</div>
                            <div>
                              <span className="customer-name">{name}</span>
                              {customer.email && (
                                <p className="customer-email">{customer.email}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="count-cell">{customer.bookingCount ?? 0}</td>
                        <td className="price-cell">{formatCurrency(customer.totalSpent ?? 0)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="dashboard-table-card">
        <div className="table-header">
          <h3 className="table-title">Đặt sân gần đây</h3>
          <Link to="/admin/bookings" className="table-view-all">Xem tất cả</Link>
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
                  <th>Số lượt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thanh toán</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking, idx) => {
                  const customerName =
                    booking.customerName || booking.customer?.name ||
                    booking.customerID?.name || 'Khách hàng';
                  const timeStr     = formatDateTime(booking.createdAt);
                  const statusInfo  = getStatusInfo(booking.status);
                  const payInfo     = getPaymentStatusInfo(booking.statusPayment);
                  return (
                    <tr key={booking._id || idx}>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-initials">{getInitials(customerName)}</div>
                          <div>
                            <span className="customer-name">{customerName}</span>
                            {booking.email && (
                              <p className="customer-email">{booking.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="count-cell">{booking.bookingCount ?? 1}</td>
                      <td className="price-cell">{formatCurrency(booking.totalPrice ?? 0)}</td>
                      <td>
                        <span className={`status-badge ${statusInfo.key}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${payInfo.key}`}>
                          {payInfo.label}
                        </span>
                      </td>
                      <td className="time-cell">{timeStr}</td>
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
import { Link } from 'react-router-dom';
import { mockFields, mockUsers, mockBookingDetails } from '../../data/mockData';
import '../../styles/AdminDashboard.css';

const AdminDashboardPage = () => {
  // ============================================================================
  // DERIVE STATS FROM MOCK DATA
  // ============================================================================

  const totalFields = mockFields.length;
  const availableFields = mockFields.filter((f) => f.status === 'Available').length;
  const maintenanceFields = mockFields.filter((f) => f.status === 'Maintenance').length;

  const totalUsers = mockUsers.length;
  const customerCount = mockUsers.filter((u) => u.role === 'customer').length;

  const totalBookings = mockBookingDetails.length;
  const activeBookings = mockBookingDetails.filter((b) => b.status === 'Active').length;
  const cancelledBookings = mockBookingDetails.filter((b) => b.status === 'Cancelled').length;

  const totalRevenue = mockBookingDetails
    .filter((b) => b.status === 'Active')
    .reduce((sum, b) => sum + b.priceSnapshot, 0);

  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  const stats = [
    {
      icon: 'stadium',
      iconBg: 'green',
      label: 'Tổng số sân',
      value: totalFields,
      trend: `${availableFields} hoạt động`,
      trendUp: true,
      sparkline: 'M0 28 L10 24 L20 26 L30 18 L40 20 L50 10 L60 14 L70 4 L80 8',
      note: `${maintenanceFields} sân đang bảo trì`,
    },
    {
      icon: 'person',
      iconBg: 'blue',
      label: 'Tổng tài khoản',
      value: totalUsers,
      trend: `${customerCount} khách hàng`,
      trendUp: true,
      sparkline: 'M0 4 L10 8 L20 6 L30 14 L40 12 L50 22 L60 18 L70 28 L80 24',
      note: `${totalUsers - customerCount} quản trị viên`,
    },
    {
      icon: 'calendar_month',
      iconBg: 'amber',
      label: 'Tổng lượt đặt sân',
      value: totalBookings,
      trend: `${activeBookings} đang hoạt động`,
      trendUp: cancelledBookings === 0,
      sparkline: 'M0 30 L10 28 L20 20 L30 24 L40 16 L50 18 L60 8 L70 12 L80 2',
      note: `Doanh thu: ${formatPrice(totalRevenue)}`,
    },
  ];

  // ============================================================================
  // SHORTCUTS
  // ============================================================================

  const shortcuts = [
    {
      icon: 'stadium',
      title: 'Quản lý sân',
      desc: `${totalFields} sân · ${availableFields} đang hoạt động`,
      link: '/admin/fields',
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80',
    },
    {
      icon: 'people_alt',
      title: 'Quản lý khách hàng',
      desc: `${customerCount} khách hàng đã đăng ký`,
      link: '/admin/customers',
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80',
    },
    {
      icon: 'rate_review',
      title: 'Xem phản hồi',
      desc: 'Xem và trả lời góp ý từ khách hàng',
      link: '/admin/feedback',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
    },
  ];

  // ============================================================================
  // RECENT ACTIVITIES - derived from bookingDetails + fields + users
  // ============================================================================

  // Build field lookup map
  const fieldMap = {};
  mockFields.forEach((f) => { fieldMap[f._id] = f; });

  // Create recent activities from booking details (sorted newest first)
  const recentActivities = [...mockBookingDetails]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((booking) => {
      const field = fieldMap[booking.fieldID];
      // Pick a customer from mockUsers for display
      const customer = mockUsers.find((u) => u.role === 'customer') || mockUsers[0];
      const initials = customer.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      const startDate = new Date(booking.startTime);
      const startHour = startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const dateStr = startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

      return {
        initials,
        name: customer.name,
        field: field?.fieldName || 'N/A',
        time: `${startHour} - ${dateStr}`,
        price: formatPrice(booking.priceSnapshot),
        status: booking.status === 'Active' ? 'confirmed' : 'cancelled',
        statusLabel: booking.status === 'Active' ? 'Đã xác nhận' : 'Đã hủy',
      };
    });

  return (
    <div className="admin-dashboard">
      {/* Stats Cards */}
      <div className="dashboard-stats">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-card-top">
              <div className={`stat-icon ${stat.iconBg}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <div className="stat-trend-wrapper">
                <span className={`stat-trend ${stat.trendUp ? 'up' : 'down'}`}>
                  <span className="material-symbols-outlined">
                    {stat.trendUp ? 'trending_up' : 'trending_down'}
                  </span>
                  {stat.trend}
                </span>
                <div className="stat-sparkline">
                  <svg viewBox="0 0 80 32">
                    <path
                      d={stat.sparkline}
                      className={stat.trendUp ? 'sparkline-up' : 'sparkline-down'}
                    />
                  </svg>
                </div>
              </div>
            </div>
            <p className="stat-label">{stat.label}</p>
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-note">
              <span className={`stat-dot ${stat.trendUp ? 'green' : 'red'}`} />
              {stat.note}
            </p>
          </div>
        ))}
      </div>

      {/* Shortcuts */}
      <div className="dashboard-shortcuts">
        <h2 className="dashboard-section-title">
          <span className="material-symbols-outlined">bolt</span>
          Shortcuts
        </h2>
        <div className="shortcuts-grid">
          {shortcuts.map((sc, idx) => (
            <Link key={idx} to={sc.link} className="shortcut-card">
              <div className="shortcut-overlay" />
              <div
                className="shortcut-bg"
                style={{ backgroundImage: `url("${sc.image}")` }}
              />
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

      {/* Recent Activities Table */}
      <div className="dashboard-table-card">
        <div className="table-header">
          <h3 className="table-title">Hoạt động gần đây</h3>
          <button className="table-view-all">Xem tất cả</button>
        </div>
        <div className="table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Sân</th>
                <th>Thời gian</th>
                <th>Giá</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((act, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-initials">{act.initials}</div>
                      <span className="customer-name">{act.name}</span>
                    </div>
                  </td>
                  <td className="field-cell">{act.field}</td>
                  <td className="time-cell">{act.time}</td>
                  <td className="price-cell">{act.price}</td>
                  <td>
                    <span className={`status-badge ${act.status}`}>
                      {act.statusLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

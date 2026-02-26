import { Link } from 'react-router-dom';
import { mockFields, mockUsers, mockBookingDetails, mockFeedbacks } from '../../data/mockData';
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
  const adminCount = totalUsers - customerCount;

  const totalBookings = mockBookingDetails.length;
  const activeBookings = mockBookingDetails.filter((b) => b.status === 'Active').length;

  const totalRevenue = mockBookingDetails
    .filter((b) => b.status === 'Active')
    .reduce((sum, b) => sum + b.priceSnapshot, 0);

  const totalFeedbacks = mockFeedbacks?.length || 0;

  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  const stats = [
    {
      icon: 'stadium',
      iconBg: 'green',
      label: 'Tổng số sân',
      value: totalFields,
      trendText: '+5%',
      trendUp: true,
      note: `2 sân đang bảo trì`,
      dotColor: 'green',
    },
    {
      icon: 'person',
      iconBg: 'blue',
      label: 'Tổng số tài khoản',
      value: totalUsers,
      trendText: '-2%',
      trendUp: false,
      note: '1 tài khoản quản lý',
      dotColor: 'red',
    },
    {
      icon: 'reviews',
      iconBg: 'amber',
      label: 'Tổng feedback',
      value: totalFeedbacks,
      trendText: '+12%',
      trendUp: true,
      note: 'Phản hồi tích cực đạt 94%',
      dotColor: 'green',
    },
  ];

  // ============================================================================
  // SHORTCUTS
  // ============================================================================

  const shortcuts = [
    {
      icon: 'stadium',
      title: 'Manage Fields',
      desc: 'Cập nhật thông tin & trạng thái sân',
      link: '/admin/fields',
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80',
    },
    {
      icon: 'people_alt',
      title: 'Manage Customers',
      desc: 'Quản lý người dùng & lịch sử đặt',
      link: '/admin/customers',
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80',
    },
    {
      icon: 'rate_review',
      title: 'View Feedback',
      desc: 'Xem và trả lời góp ý từ khách hàng',
      link: '/admin/feedback',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
    },
  ];

  // ============================================================================
  // RECENT ACTIVITIES
  // ============================================================================

  const fieldMap = {};
  mockFields.forEach((f) => { fieldMap[f._id] = f; });

  const recentActivities = [...mockBookingDetails]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((booking) => {
      const field = fieldMap[booking.fieldID];
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
              <span className={`stat-trend ${stat.trendUp ? 'up' : 'down'}`}>
                <span className="material-symbols-outlined">
                  {stat.trendUp ? 'trending_up' : 'trending_down'}
                </span>
                {stat.trendText}
              </span>
            </div>
            <p className="stat-label">{stat.label}</p>
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-note">
              <span className={`stat-dot ${stat.dotColor}`} />
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

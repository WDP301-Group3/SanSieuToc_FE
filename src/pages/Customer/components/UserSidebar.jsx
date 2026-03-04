/**
 * UserSidebar Component
 * Sidebar navigation cho User Dashboard
 */
import { useAuth } from '../../../context/AuthContext';

const UserSidebar = ({ activeTab, onTabChange, memberTier, userName, userImage }) => {
  const { logout } = useAuth();

  const menuItems = [
    { key: 'profile', icon: 'person', label: 'Thông tin cá nhân' },
    { key: 'bookings', icon: 'calendar_month', label: 'Lịch sử đặt sân' },
    { key: 'settings', icon: 'settings', label: 'Cài đặt' },
  ];

  return (
    <aside className="user-dashboard-sidebar">
      <div className="user-dashboard-sidebar-card">
        {/* User Brief */}
        <div className="user-dashboard-user-brief">
          <div className="user-dashboard-avatar-wrapper">
            <img
              src={userImage || 'https://via.placeholder.com/100'}
              alt="User Avatar"
              className="user-dashboard-avatar"
            />
            <button className="user-dashboard-avatar-edit">
              <span className="material-symbols-outlined">edit</span>
            </button>
          </div>
          <h1 className="user-dashboard-user-name">{userName}</h1>
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
              onClick={() => onTabChange(item.key)}
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
  );
};

export default UserSidebar;

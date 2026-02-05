import { Outlet, Link, useLocation } from 'react-router-dom';
import '../../styles/AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: 'bar_chart',
      label: 'Thống kê website',
    },
    {
      path: '/admin/users',
      icon: 'group',
      label: 'Quản lý người dùng',
    },
    {
      path: '/admin/fields',
      icon: 'sports_soccer',
      label: 'Quản lý sân',
    },
    {
      path: '/admin/managers',
      icon: 'manage_accounts',
      label: 'Cấp quyền chủ sân',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      <div className="admin-layout-inner">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          {/* Logo */}
          <div className="admin-sidebar-logo">
            <svg
              className="admin-sidebar-logo-icon"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                fill="currentColor"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
            <h2 className="admin-sidebar-logo-text">Sân Siêu Tốc</h2>
          </div>

          {/* Navigation */}
          <div className="admin-sidebar-nav">
            <div className="admin-sidebar-menu">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-menu-item ${
                    isActive(item.path) ? 'active' : ''
                  }`}
                >
                  <span className="material-icons-outlined">{item.icon}</span>
                  <p className="admin-menu-item-text">{item.label}</p>
                </Link>
              ))}
            </div>

            {/* Bottom Menu */}
            <div className="admin-sidebar-bottom">
              <Link to="/admin/settings" className="admin-bottom-item">
                <span className="material-icons-outlined">settings</span>
                <p className="admin-menu-item-text">Settings</p>
              </Link>
              <button
                onClick={() => {
                  // TODO: Implement logout
                  console.log('Logout');
                }}
                className="admin-bottom-item"
              >
                <span className="material-icons-outlined">logout</span>
                <p className="admin-menu-item-text">Logout</p>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Top Navbar */}
          <header className="admin-header">
            <div className="admin-header-title-wrapper">
              <h2 className="admin-header-title">Dashboard Admin</h2>
            </div>
            <div className="admin-header-actions">
              <label className="admin-search-wrapper">
                <div className="admin-search-icon">
                  <span className="material-icons-outlined">search</span>
                </div>
                <input
                  className="admin-search-input"
                  placeholder="Search"
                  type="search"
                />
              </label>
              <button className="admin-notification-btn">
                <span className="material-icons-outlined">
                  notifications
                </span>
              </button>
              <div className="admin-avatar">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Admin Avatar"
                  className="admin-avatar-image"
                />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="admin-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

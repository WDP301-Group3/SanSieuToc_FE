import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers, getCustomerStats, updateCustomerStatus } from '../../../services/managerService';
import { useNotification } from '../../../context/NotificationContext';
import '../../../styles/ManagerCustomersPage.css';

/**
 * Format date string to dd/MM/yyyy
 */
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/**
 * Customer status options for filter dropdown
 */
const CUSTOMER_STATUSES = [
  { key: '', label: 'Tất cả trạng thái' },
  { key: 'active', label: 'Đang hoạt động' },
  { key: 'inactive', label: 'Không hoạt động' },
  { key: 'banned', label: 'Đã bị khóa' },
];

/**
 * Status display config
 */
const STATUS_CONFIG = {
  active: { label: 'Đang hoạt động', className: 'active' },
  inactive: { label: 'Không hoạt động', className: 'inactive' },
  banned: { label: 'Đã bị khóa', className: 'banned' },
};

const ManagerCustomersPage = () => {
  const notification = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(null);

  // API state
  const [rawCustomers, setRawCustomers] = useState([]);
  const [apiStats, setApiStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customersPerPage = 8;

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const [custRes, statsRes] = await Promise.all([
        getCustomers({ limit: 200 }),
        getCustomerStats(),
      ]);
      if (custRes.success) setRawCustomers(custRes.data || []);
      else setError(custRes.error);
      if (statsRes.success) setApiStats(statsRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Normalise API customers
  const allCustomers = useMemo(() => rawCustomers.map((user) => {
    // BE may return 'Active'/'Banned'/'Inactive' (capitalised) or lowercase
    const rawStatus = (user.status || user.accountStatus || 'active').toLowerCase();
    let status = 'active';
    if (rawStatus === 'banned') status = 'banned';
    else if (rawStatus === 'inactive') status = 'inactive';

    return {
      id: user._id,
      name: user.name || user.fullName || 'N/A',
      email: user.email,
      phone: user.phone || 'N/A',
      image: user.image || user.avatar,
      status,
      createdAt: user.createdAt,
    };
  }), [rawCustomers]);

  // Filter logic
  const filteredCustomers = useMemo(() => allCustomers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      customer.name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.phone.includes(term);
    const matchStatus = !statusFilter || customer.status === statusFilter;
    return matchSearch && matchStatus;
  }), [allCustomers, searchTerm, statusFilter]);

  // Stats from API or derived from data
  const stats = useMemo(() => {
    if (apiStats) {
      return {
        total: apiStats.total ?? apiStats.totalCustomers ?? allCustomers.length,
        active: apiStats.active ?? apiStats.activeCustomers ?? allCustomers.filter((c) => c.status === 'active').length,
        inactive: apiStats.inactive ?? apiStats.inactiveCustomers ?? allCustomers.filter((c) => c.status === 'inactive').length,
        banned: apiStats.banned ?? apiStats.bannedCustomers ?? allCustomers.filter((c) => c.status === 'banned').length,
      };
    }
    return {
      total: allCustomers.length,
      active: allCustomers.filter((c) => c.status === 'active').length,
      inactive: allCustomers.filter((c) => c.status === 'inactive').length,
      banned: allCustomers.filter((c) => c.status === 'banned').length,
    };
  }, [apiStats, allCustomers]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  const handleToggleStatus = (customer) => setConfirmModal({ type: 'toggle', customer });
  const handleBan = (customer) => setConfirmModal({ type: 'ban', customer });

  const handleConfirm = async () => {
    if (!confirmModal) return;
    const { type, customer } = confirmModal;
    let newStatus;
    if (type === 'ban') newStatus = 'banned';
    else if (customer.status === 'active') newStatus = 'inactive';
    else newStatus = 'active';

    const res = await updateCustomerStatus(customer.id, newStatus);
    if (res.success) {
      setRawCustomers((prev) =>
        prev.map((u) => u._id === customer.id ? { ...u, status: newStatus } : u)
      );
      notification.success('Trạng thái tài khoản đã được cập nhật.');
    } else {
      notification.error(res.error || 'Cập nhật thất bại.');
    }
    setConfirmModal(null);
  };

  return (
    <div className="manager-customers-page">
      {/* Top Bar */}
      <div className="customers-top-bar">
        <div>
          <h2 className="customers-page-title">Quản lý khách hàng</h2>
          <p className="customers-page-subtitle">Danh sách tài khoản người dùng trên hệ thống</p>
        </div>
      </div>

      {error && (
        <div className="customers-error-banner">
          <span className="material-symbols-outlined">error</span> {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="customers-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <span className="material-symbols-outlined">group</span>
          </div>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Tổng khách hàng</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Đang hoạt động</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon inactive">
            <span className="material-symbols-outlined">pause_circle</span>
          </div>
          <div>
            <div className="stat-value">{stats.inactive}</div>
            <div className="stat-label">Không hoạt động</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon banned">
            <span className="material-symbols-outlined">block</span>
          </div>
          <div>
            <div className="stat-value">{stats.banned}</div>
            <div className="stat-label">Đã bị khóa</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search + Filters */}
      <div className="customers-toolbar">
        <div className="customers-search">
          <span className="material-symbols-outlined customers-search-icon">search</span>
          <input
            type="text"
            className="customers-search-input"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="customers-filters">
          <select
            className="customers-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            {CUSTOMER_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="customers-table-card">
        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Tên khách hàng</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th className="customers-th-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => {
                const statusCfg = STATUS_CONFIG[customer.status];
                return (
                  <tr key={customer.id} className="customers-row">
                    <td>
                      <div className="customer-name-cell">
                        <div className="customer-avatar">
                          {customer.image ? (
                            <img src={customer.image} alt={customer.name} />
                          ) : (
                            <div className="customer-avatar-placeholder">
                              <span className="material-symbols-outlined">person</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="customer-name">{customer.name}</div>
                          <div className="customer-id">
                            ID: #{customer.id.slice(-8).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="customer-email">{customer.email}</td>
                    <td className="customer-phone">{customer.phone}</td>
                    <td className="customer-date">{formatDate(customer.createdAt)}</td>
                    <td>
                      <span className={`customer-status-badge ${statusCfg.className}`}>
                        <span className="status-dot" />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td>
                      <div className="customer-actions">
                        <Link
                          to={`/admin/customers/${customer.id}`}
                          className="customer-action-btn view"
                          title="Xem chi tiết"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </Link>
                        {customer.status !== 'banned' ? (
                          <>
                            <button
                              className="customer-action-btn toggle"
                              title={customer.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                              onClick={() => handleToggleStatus(customer)}
                            >
                              <span className="material-symbols-outlined">
                                {customer.status === 'active' ? 'toggle_on' : 'toggle_off'}
                              </span>
                            </button>
                            <button
                              className="customer-action-btn ban"
                              title="Khóa tài khoản"
                              onClick={() => handleBan(customer)}
                            >
                              <span className="material-symbols-outlined">block</span>
                            </button>
                          </>
                        ) : (
                          <button
                            className="customer-action-btn unban"
                            title="Mở khóa tài khoản"
                            onClick={() => handleToggleStatus(customer)}
                          >
                            <span className="material-symbols-outlined">lock_open</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedCustomers.length === 0 && (
                <tr>
                  <td colSpan="6" className="customers-empty">
                    Không tìm thấy khách hàng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="customers-pagination">
          <div className="customers-pagination-info">
            Hiển thị{' '}
            <span className="customers-pagination-bold">
              {filteredCustomers.length === 0
                ? 0
                : (currentPage - 1) * customersPerPage + 1}
              -{Math.min(currentPage * customersPerPage, filteredCustomers.length)}
            </span>{' '}
            của{' '}
            <span className="customers-pagination-bold">{filteredCustomers.length}</span>{' '}
            khách hàng
          </div>
          <div className="customers-pagination-buttons">
            <button
              className="customers-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`customers-page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="customers-page-btn"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {confirmModal.type === 'ban' ? (
              <>
                <div className="modal-icon danger">
                  <span className="material-symbols-outlined">block</span>
                </div>
                <h3 className="modal-title">Khóa tài khoản</h3>
                <p className="modal-description">
                  Bạn có chắc muốn khóa tài khoản của{' '}
                  <strong>{confirmModal.customer.name}</strong>? Người dùng sẽ không thể đăng
                  nhập và sử dụng dịch vụ.
                </p>
                <div className="modal-actions">
                  <button className="modal-btn cancel" onClick={() => setConfirmModal(null)}>
                    Hủy bỏ
                  </button>
                  <button className="modal-btn confirm-ban" onClick={handleConfirm}>
                    Khóa tài khoản
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-icon warning">
                  <span className="material-symbols-outlined">swap_horiz</span>
                </div>
                <h3 className="modal-title">Thay đổi trạng thái</h3>
                <p className="modal-description">
                  Bạn có chắc muốn{' '}
                  {confirmModal.customer.status === 'active'
                    ? 'vô hiệu hóa'
                    : confirmModal.customer.status === 'banned'
                    ? 'mở khóa'
                    : 'kích hoạt'}{' '}
                  tài khoản của <strong>{confirmModal.customer.name}</strong>?
                </p>
                <div className="modal-actions">
                  <button className="modal-btn cancel" onClick={() => setConfirmModal(null)}>
                    Hủy bỏ
                  </button>
                  <button className="modal-btn confirm-toggle" onClick={handleConfirm}>
                    Xác nhận
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerCustomersPage;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockFields, mockCategories, mockManagers } from '../../../data/mockData';
import '../../../styles/AdminFieldsPage.css';

/**
 * Format price in VND
 */
const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + 'đ';
};

/**
 * Map mockData status to display status
 */
const mapStatus = (status) => {
  switch (status) {
    case 'Available': return { key: 'active', label: 'Đang hoạt động' };
    case 'Maintenance': return { key: 'maintenance', label: 'Bảo trì' };
    default: return { key: 'closed', label: 'Ngưng hoạt động' };
  }
};

/**
 * Map field type to badge variant
 */
const getTypeBadgeVariant = (typeName) => {
  if (typeName.includes('5')) return 'blue';
  if (typeName.includes('7')) return 'purple';
  if (typeName.includes('11')) return 'orange';
  return 'teal';
};

/**
 * Map category name to Material icon
 */
const getCategoryIcon = (categoryName) => {
  switch (categoryName) {
    case 'Football': return 'sports_soccer';
    case 'Tennis': return 'sports_tennis';
    case 'Badminton': return 'sports_tennis'; // closest icon
    case 'Basketball': return 'sports_basketball';
    case 'Volleyball': return 'sports_volleyball';
    default: return 'sports';
  }
};

/**
 * Map category name to icon color class
 */
const getCategoryIconClass = (categoryName) => {
  switch (categoryName) {
    case 'Football': return 'icon-football';
    case 'Tennis': return 'icon-tennis';
    case 'Badminton': return 'icon-badminton';
    case 'Basketball': return 'icon-basketball';
    case 'Volleyball': return 'icon-volleyball';
    default: return 'icon-default';
  }
};

const AdminFieldsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [managerFilter, setManagerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fieldsPerPage = 6;

  // Transform mockFields data for admin table
  const allFields = mockFields.map((field) => {
    const status = mapStatus(field.status);
    return {
      id: field._id,
      name: field.fieldName,
      address: field.address,
      district: field.district,
      categoryId: field.fieldType?.category?._id || '',
      categoryName: field.fieldType?.category?.categoryName || '',
      typeName: field.fieldType?.typeName || '',
      price: field.hourlyPrice,
      priceFormatted: formatPrice(field.hourlyPrice),
      statusKey: status.key,
      statusLabel: status.label,
      image: field.image?.[0] || null,
      managerId: field.manager?._id || '',
      manager: field.manager?.name || '',
      openingTime: field.openingTime,
      closingTime: field.closingTime,
    };
  });

  // Filter logic
  const filteredFields = allFields.filter((field) => {
    const matchSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !categoryFilter || field.categoryId === categoryFilter;
    const matchManager = !managerFilter || field.managerId === managerFilter;
    const matchStatus = !statusFilter || field.statusKey === statusFilter;
    return matchSearch && matchCategory && matchManager && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredFields.length / fieldsPerPage);
  const paginatedFields = filteredFields.slice(
    (currentPage - 1) * fieldsPerPage,
    currentPage * fieldsPerPage
  );

  return (
    <div className="admin-fields-page">
      {/* Top Bar: Title + Create Button */}
      <div className="fields-top-bar">
        <div>
          <h2 className="fields-page-title">Danh sách sân</h2>
          <p className="fields-page-subtitle">Quản lý tất cả {allFields.length} sân trong hệ thống</p>
        </div>
        <Link to="/admin/fields/create" className="fields-btn-create">
          <span className="material-symbols-outlined">add</span>
          Tạo sân mới
        </Link>
      </div>

      {/* Toolbar: Search + Filters */}
      <div className="fields-toolbar">
        <div className="fields-search">
          <span className="material-symbols-outlined fields-search-icon">search</span>
          <input
            type="text"
            className="fields-search-input"
            placeholder="Tìm kiếm tên sân..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="fields-filters">
          <select
            className="fields-select"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Tất cả môn thể thao</option>
            {mockCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
            ))}
          </select>
          <select
            className="fields-select"
            value={managerFilter}
            onChange={(e) => { setManagerFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Tất cả chủ sân</option>
            {mockManagers.map((mgr) => (
              <option key={mgr._id} value={mgr._id}>{mgr.name}</option>
            ))}
          </select>
          <select
            className="fields-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="maintenance">Bảo trì</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="fields-table-card">
        <div className="fields-table-wrapper">
          <table className="fields-table">
            <thead>
              <tr>
                <th className="fields-th-icon"></th>
                <th>Tên sân</th>
                <th>Thể loại</th>
                <th>Giá / Giờ</th>
                <th>Trạng thái</th>
                <th className="fields-th-actions">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFields.map((field) => (
                <tr key={field.id} className="fields-row">
                  <td className="fields-td-icon">
                    <span className={`field-sport-icon ${getCategoryIconClass(field.categoryName)}`}>
                      <span className="material-symbols-outlined">{getCategoryIcon(field.categoryName)}</span>
                    </span>
                  </td>
                  <td>
                    <div className="field-name-cell">
                      <div className="field-thumb">
                        {field.image ? (
                          <img src={field.image} alt={field.name} className="field-thumb-img" />
                        ) : (
                          <div className="field-thumb-placeholder">
                            <span className="material-symbols-outlined">image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="field-name">{field.name}</div>
                        <div className="field-area">{field.address}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`type-badge ${getTypeBadgeVariant(field.typeName)}`}>
                      {field.typeName}
                    </span>
                  </td>
                  <td>
                    <div className="field-price">{field.priceFormatted}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${field.statusKey}`}>
                      <span className="status-dot" />
                      {field.statusLabel}
                    </span>
                  </td>
                  <td>
                    <div className="field-actions">
                      <Link to={`/admin/fields/${field.id}`} className="field-action-btn view" title="Xem chi tiết">
                        <span className="material-symbols-outlined">visibility</span>
                      </Link>
                      <Link to={`/admin/fields/${field.id}/edit`} className="field-action-btn edit" title="Chỉnh sửa">
                        <span className="material-symbols-outlined">edit</span>
                      </Link>
                      <button className="field-action-btn delete" title="Xóa">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedFields.length === 0 && (
                <tr>
                  <td colSpan="6" className="fields-empty">
                    Không tìm thấy sân nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="fields-pagination">
          <div className="fields-pagination-info">
            Hiển thị <span className="fields-pagination-bold">
              {filteredFields.length === 0 ? 0 : (currentPage - 1) * fieldsPerPage + 1}-{Math.min(currentPage * fieldsPerPage, filteredFields.length)}
            </span> trong <span className="fields-pagination-bold">{filteredFields.length}</span> sân
          </div>
          <div className="fields-pagination-buttons">
            <button
              className="fields-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`fields-page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="fields-page-btn"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFieldsPage;

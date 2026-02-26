import { useState, useMemo } from 'react';
import { mockFeedbacks, mockFields } from '../../../data/mockData';
import '../../../styles/AdminFeedbackPage.css';

/**
 * Format date string to dd/MM/yyyy
 */
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/**
 * Build a map of fieldID → fieldName for quick lookup
 */
const fieldNameMap = mockFields.reduce((map, field) => {
  map[field._id] = field.fieldName;
  return map;
}, {});

/**
 * Render star icons for a given rating
 */
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`material-symbols-outlined star-icon ${i <= rating ? 'star-filled' : 'star-empty'}`}
        style={i <= rating ? { fontVariationSettings: "'FILL' 1" } : {}}
      >
        star
      </span>
    );
  }
  return stars;
};

const AdminFeedbackPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const feedbacksPerPage = 8;

  // All feedbacks enriched with fieldName
  const allFeedbacks = useMemo(() => {
    return mockFeedbacks
      .map((fb) => ({
        ...fb,
        fieldName: fieldNameMap[fb.fieldID] || 'Không xác định',
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, []);

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    return allFeedbacks.filter((fb) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        fb.userName.toLowerCase().includes(term) ||
        fb.fieldName.toLowerCase().includes(term) ||
        fb.comment.toLowerCase().includes(term);

      let matchDate = true;
      if (dateFrom) {
        matchDate = matchDate && new Date(fb.createdAt) >= new Date(dateFrom);
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        matchDate = matchDate && new Date(fb.createdAt) <= to;
      }

      return matchSearch && matchDate;
    });
  }, [allFeedbacks, searchTerm, dateFrom, dateTo]);

  // Stats
  const stats = useMemo(() => {
    const total = allFeedbacks.length;
    const avgRating =
      total > 0
        ? Math.round((allFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / total) * 10) / 10
        : 0;
    const lowRating = allFeedbacks.filter((fb) => fb.rating <= 2).length;
    return { total, avgRating, lowRating };
  }, [allFeedbacks]);

  // Pagination
  const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * feedbacksPerPage,
    currentPage * feedbacksPerPage
  );

  const startItem = filteredFeedbacks.length === 0 ? 0 : (currentPage - 1) * feedbacksPerPage + 1;
  const endItem = Math.min(currentPage * feedbacksPerPage, filteredFeedbacks.length);

  // Reset page when filters change
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDateFromChange = (value) => {
    setDateFrom(value);
    setCurrentPage(1);
  };

  const handleDateToChange = (value) => {
    setDateTo(value);
    setCurrentPage(1);
  };

  // Delete action
  const handleDelete = (feedback) => {
    setConfirmDelete(feedback);
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(null);
    alert('Đã xóa feedback (mock).');
  };

  // Pagination helpers
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="admin-feedback-page">
      {/* Header */}
      <div className="feedback-top-bar">
        <div>
          <h2 className="feedback-page-title">Quản lý Feedback</h2> 
          <p className="feedback-page-subtitle">
            Xem và quản lý các ý kiến phản hồi từ người dùng hệ thống
          </p>
        </div>
        <button className="btn-export">
          <span className="material-symbols-outlined">file_download</span>
          Xuất báo cáo
        </button>
      </div>

      {/* Stats Summary */}
      <div className="feedback-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <span className="material-symbols-outlined">reviews</span>
          </div>
          <div>
            <div className="stat-value">{stats.total.toLocaleString('vi-VN')}</div>
            <div className="stat-label">Tổng feedback</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon star">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          </div>
          <div>
            <div className="stat-value">{stats.avgRating} / 5.0</div>
            <div className="stat-label">Đánh giá trung bình</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon urgent">
            <span className="material-symbols-outlined">report</span>
          </div>
          <div>
            <div className="stat-value">{stats.lowRating} tin</div>
            <div className="stat-label">Cần xử lý gấp</div>
          </div>
        </div>
      </div>

      {/* Filters / Search */}
      <div className="feedback-toolbar">
        <div className="feedback-search">
          <span className="material-symbols-outlined feedback-search-icon">search</span>
          <input
            type="text"
            className="feedback-search-input"
            placeholder="Tìm kiếm theo tên khách hàng hoặc sân..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="feedback-date-filters">
          <div className="feedback-date-field">
            <span className="material-symbols-outlined feedback-date-icon">calendar_month</span>
            <input
              type="date"
              className="feedback-date-input"
              value={dateFrom}
              onChange={(e) => handleDateFromChange(e.target.value)}
            />
          </div>
          <span className="feedback-date-separator">—</span>
          <div className="feedback-date-field">
            <span className="material-symbols-outlined feedback-date-icon">calendar_month</span>
            <input
              type="date"
              className="feedback-date-input"
              value={dateTo}
              onChange={(e) => handleDateToChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="feedback-table-card">
        <div className="feedback-table-wrapper">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Tên khách hàng</th>
                <th>Nội dung feedback</th>
                <th>Sân liên quan</th>
                <th>Đánh giá</th>
                <th>Ngày gửi</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="feedback-empty-row">
                    <span className="material-symbols-outlined">search_off</span>
                    Không tìm thấy phản hồi nào phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedFeedbacks.map((fb) => (
                  <tr key={fb._id}>
                    <td>
                      <div className="feedback-user-cell">
                        <img
                          src={fb.userImage}
                          alt={fb.userName}
                          className="feedback-user-avatar"
                        />
                        <div className="feedback-user-info">
                          <span className="feedback-user-name">{fb.userName}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="feedback-comment">{fb.comment}</p>
                    </td>
                    <td>
                      <span className="feedback-field-badge">
                        <span className="material-symbols-outlined">location_on</span>
                        {fb.fieldName}
                      </span>
                    </td>
                    <td>
                      <div className="feedback-stars">{renderStars(fb.rating)}</div>
                    </td>
                    <td className="feedback-date">{formatDate(fb.createdAt)}</td>
                    <td className="text-right">
                      <button
                        className="btn-delete-feedback"
                        title="Xóa feedback"
                        onClick={() => handleDelete(fb)}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredFeedbacks.length > 0 && (
          <div className="feedback-pagination">
            <p className="feedback-pagination-info">
              Hiển thị {startItem}-{endItem} trong số {filteredFeedbacks.length} phản hồi
            </p>
            <div className="feedback-pagination-controls">
              <button
                className="btn-page-arrow"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {getPageNumbers().map((page, idx) =>
                page === '...' ? (
                  <span key={`dots-${idx}`} className="page-dots">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    className={`btn-page-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="btn-page-arrow"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="confirm-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <h3 className="confirm-modal-title">Xóa feedback?</h3>
            <p className="confirm-modal-desc">
              Bạn có chắc muốn xóa feedback của &quot;{confirmDelete.userName}&quot;? Hành động này không thể hoàn tác.
            </p>
            <div className="confirm-modal-actions">
              <button className="btn-modal-cancel" onClick={() => setConfirmDelete(null)}>
                Hủy
              </button>
              <button className="btn-modal-confirm btn-danger" onClick={handleConfirmDelete}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackPage;

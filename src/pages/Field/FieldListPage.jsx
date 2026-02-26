import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchFields } from '../../services/fieldService';
import { ALL_DISTRICTS, PRICE_RANGE } from '../../data/mockData';
import '../../styles/FieldListPage.css';
/**
 * FieldListPage Component
 * Displays searchable and filterable list of sports fields
 * 
 * Features:
 * - 6 filter types (text search, category, field type, location, price range, date/time)
 * - Field type filter dynamically shown only for Football category
 * - 4 sort options (name, price asc/desc, newest)
 * - Pagination (9 items per page)
 * - Responsive design with mobile filters
 * - Loading, error, and empty states
 * 
 * Note: Utilities are displayed on cards but NOT filterable (simplified UX)
 * Note: Field type filter (Sân 5/7/11 người) only appears when Football is selected
 * 
 * @component
 */
const FieldListPage = () => {
  // Filter state matching fieldService API
  const [filters, setFilters] = useState({
    searchText: '',
    categoryName: '', // 'Football', 'Tennis', 'Badminton', 'Basketball', 'Volleyball'
    fieldTypeName: '', // Only used when categoryName === 'Football'
    district: '',
    priceMin: PRICE_RANGE.min,
    priceMax: PRICE_RANGE.max,
    date: '',
    startTime: '',
    endTime: '',
    status: 'Available', // Filter only available fields
    sortBy: 'newest', // 'name' | 'price-asc' | 'price-desc' | 'newest'
    page: 1,
    limit: 6
    
  });

  // UI state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Data state
  const [fields, setFields] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0, totalPages: 1 });
  const [facets, setFacets] = useState({ categories: [], districts: [], priceRange: PRICE_RANGE });
  
  // Loading & error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch fields from service based on current filters
   * Called on mount and when filters change
   */
  useEffect(() => {
    const fetchFields = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await searchFields(filters);
        
        if (result.success) {
          setFields(result.data.fields);
          setPagination(result.data.pagination);
          setFacets(result.data.facets);
        } else {
          setError(result.error || 'Không thể tải danh sách sân');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải dữ liệu');
        console.error('Error fetching fields:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [filters]);

  /**
   * Handle category filter change
   * @param {string} category - Category name to toggle
   */
  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      categoryName: prev.categoryName === category ? '' : category,
      fieldTypeName: '', // Reset field type when category changes
      page: 1 // Reset to page 1 when filter changes
    }));
  };

  /**
   * Handle field type filter change (only for Football)
   * @param {string} typeName - Field type name
   */
  const handleFieldTypeChange = (typeName) => {
    setFilters(prev => ({
      ...prev,
      fieldTypeName: prev.fieldTypeName === typeName ? '' : typeName,
      page: 1
    }));
  };

  /**
   * Handle sort change
   * @param {string} sortValue - Sort option value
   */
  const handleSortChange = (sortValue) => {
    setFilters(prev => ({ ...prev, sortBy: sortValue, page: 1 }));
  };

  /**
   * Handle page change
   * @param {number} newPage - Page number to navigate to
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Reset all filters to default values
   */
  const handleReset = () => {
    setFilters({
      searchText: '',
      categoryName: '',
      fieldTypeName: '',
      district: '',
      priceMin: PRICE_RANGE.min,
      priceMax: PRICE_RANGE.max,
      date: '',
      startTime: '',
      endTime: '',
      status: 'Available',
      sortBy: 'newest',
      page: 1,
      limit: 6
    });
  };

  // Generate 30-minute time slots
  const timeSlots = [];
  for (let h = 5; h <= 23; h++) {
    const hour = h.toString().padStart(2, '0');
    timeSlots.push(`${hour}:00`);
    if (h < 23) timeSlots.push(`${hour}:30`);
  }

  

  // Price range helpers
  const PRICE_MIN = 50000;
  const PRICE_MAX = 1000000;
  const PRICE_STEP = 50000;

  const handlePriceMinChange = (e) => {
    const raw = Number(e.target.value);
    const val = Math.max(PRICE_MIN, Math.min(raw, filters.priceMax - PRICE_STEP));
    setFilters(prev => ({ ...prev, priceMin: val, page: 1 }));
  };

  const handlePriceMaxChange = (e) => {
    const raw = Number(e.target.value);
    const val = Math.min(PRICE_MAX, Math.max(raw, filters.priceMin + PRICE_STEP));
    setFilters(prev => ({ ...prev, priceMax: val, page: 1 }));
  };

  const fillLeft = ((filters.priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const fillRight = ((PRICE_MAX - filters.priceMax) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className="field-list-page">
      {/* Page Title - full width, above sidebar+content */}
      <div className="field-list-page-header">
        <h1 className="page-title" >Danh sách sân thể thao</h1>
        <p className="page-subtitle">Tìm và đặt sân thể thao phù hợp với bạn</p>
      </div>

      <div className="field-list-container">
        {/* Sidebar Filters */}
        <aside className={`field-list-sidebar ${showMobileFilters ? 'show' : ''}`}>
          {/* Mobile Filter Toggle */}
          <div 
            className="mobile-filter-toggle"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <span className="toggle-label">
              <span className="material-symbols-outlined">filter_list</span>
              Bộ lọc
            </span>
            <span className="material-symbols-outlined">expand_more</span>
          </div>

          {/* Desktop Sidebar Content */}
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h3 className="sidebar-title">
                <span className="material-symbols-outlined">tune</span>
                Bộ lọc tìm kiếm
              </h3>
              <button onClick={handleReset} className="reset-button">Đặt lại</button>
            </div>

            {/* Sport Type Filter */}
            <div className="filter-group">
              <p className="filter-label">Môn thể thao</p>
              <div className="sport-chips">
                {facets.categories.map(({ name, count }) => (
                  <label key={name} className="chip-label">
                    <input
                      type="checkbox"
                      checked={filters.categoryName === name}
                      onChange={() => handleCategoryChange(name)}
                      className="chip-input"
                    />
                    <div className="chip">
                      {name} ({count})
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Field Type Filter - Only for Football */}
            {filters.categoryName === 'Football' && (
              <div className="filter-group">
                <p className="filter-label">Loại sân</p>
                <div className="sport-chips">
                  {['Sân 5 người', 'Sân 7 người', 'Sân 11 người'].map((typeName) => (
                    <label key={typeName} className="chip-label">
                      <input
                        type="checkbox"
                        checked={filters.fieldTypeName === typeName}
                        onChange={() => handleFieldTypeChange(typeName)}
                        className="chip-input"
                      />
                      <div className="chip">
                        {typeName}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Location Filter */}
            <div className="filter-group">
              <p className="filter-label">Khu vực</p>
              <div className="select-wrapper">
                <select
                  value={filters.district}
                  onChange={(e) => setFilters({...filters, district: e.target.value, page: 1})}
                  className="filter-select"
                >
                  <option value="">Tất cả Quận/Huyện</option>
                  {ALL_DISTRICTS.map(district => (
                    <option key={district} value={district}>
                      {district}
                      {facets.districts.find(d => d.name === district) && 
                        ` (${facets.districts.find(d => d.name === district).count})`
                      }
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined select-icon">expand_more</span>
              </div>
            </div>

            {/* Date & Time Filter */}
            <div className="filter-group">
              <p className="filter-label">Thời gian</p>
              <div className="time-inputs">
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({...filters, date: e.target.value, page: 1})}
                  className="time-input"
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="time-range">
                  <input
                    type="time"
                    value={filters.startTime}
                    onChange={(e) => setFilters({...filters, startTime: e.target.value, page: 1})}
                    className="time-input small"
                  />
                  <span className="time-separator">-</span>
                  <input
                    type="time"
                    value={filters.endTime}
                    onChange={(e) => setFilters({...filters, endTime: e.target.value, page: 1})}
                    className="time-input small"
                  />
                </div>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <div className="price-header">
                <p className="filter-label">Khoảng giá</p>
                <p className="price-display">
                  {(filters.priceMin / 1000).toLocaleString()}k - {(filters.priceMax / 1000).toLocaleString()}k
                </p>
              </div>

              {/* Dual-range slider */}
              <div className="price-range-slider">
                <div className="range-track" />
                <div
                  className="range-fill"
                  style={{ left: `${fillLeft}%`, right: `${fillRight}%` }}
                />

                <input
                  type="range"
                  className="range-input"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                  value={filters.priceMin}
                  onChange={handlePriceMinChange}
                />

                <input
                  type="range"
                  className="range-input"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                  value={filters.priceMax}
                  onChange={handlePriceMaxChange}
                />
              </div>

              <div className="price-labels">
                <span>50.000</span>
                <span>1.000.000</span>
              </div>

              {/* Numeric inputs (kept for precision) */}
              <div className="price-inputs">
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({...filters, priceMin: Number(e.target.value), page: 1})}
                  className="price-input"
                  step={PRICE_STEP}
                  min={PRICE_MIN}
                  max={filters.priceMax}
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({...filters, priceMax: Number(e.target.value), page: 1})}
                  className="price-input"
                  step={PRICE_STEP}
                  min={filters.priceMin}
                  max={PRICE_MAX}
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Amenities Filter - REMOVED (Simplified UX) */}
            {/* Utilities are displayed on field cards but not filterable */}
          </div>
        </aside>

        {/* Main Content */}
        <main className="field-list-main">
          {/* Search Bar (Mobile) */}
          <div className="mobile-search">
            <label className="search-input-wrapper">
              <span className="material-symbols-outlined search-icon">search</span>
              <input
                type="text"
                value={filters.searchText}
                onChange={(e) => setFilters({...filters, searchText: e.target.value, page: 1})}
                placeholder="Tìm kiếm theo tên sân, địa chỉ..."
                className="search-input"
              />
            </label>
          </div>

          {/* Results Header */}
          <div className="results-header">
            <div className="results-meta">
              <p className="results-count">
                {loading ? (
                  'Đang tải...'
                ) : (
                  <>Tìm thấy <strong>{pagination.total}</strong> sân</>
                )}
              </p>
              <div className="view-toggle">
                <button
                  className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button
                  className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <span className="material-symbols-outlined">view_list</span>
                </button>
              </div>
              <select 
                className="sort-select"
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="newest">Mới nhất</option>
                <option value="name">Tên A-Z</option>
                <option value="price-asc">Giá thấp nhất</option>
                <option value="price-desc">Giá cao nhất</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải danh sách sân...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="error-container">
              <span className="material-symbols-outlined error-icon">error</span>
              <h3>Có lỗi xảy ra</h3>
              <p>{error}</p>
              <button onClick={() => setFilters({...filters})} className="retry-button">
                Thử lại
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && fields.length === 0 && (
            <div className="empty-container">
              <span className="material-symbols-outlined empty-icon">search_off</span>
              <h3>Không tìm thấy sân phù hợp</h3>
              <p>Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
              <button onClick={handleReset} className="reset-filters-button">
                Đặt lại bộ lọc
              </button>
            </div>
          )}

          {/* Fields Grid */}
          {!loading && !error && fields.length > 0 && (
            <div className={`fields-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {fields.map(field => (
                <Link to={`/fields/${field._id}`} key={field._id} className={`field-card ${viewMode === 'list' ? 'field-card-list' : ''}`}>
                  <div 
                    className="field-image" 
                    style={{ 
                      backgroundImage: `url(${field.image && field.image[0] ? field.image[0] : 'https://via.placeholder.com/400x300?text=No+Image'})`
                    }}
                  >
                    <div className="field-badges">
                      {field.status === 'Available' && (
                        <span className="badge badge-verified">
                          <span className="material-symbols-outlined">verified</span>
                          Có sẵn
                        </span>
                      )}
                      {field.manager?.verified && (
                        <span className="badge badge-quick">
                          <span className="material-symbols-outlined">bolt</span>
                          Chủ sân xác thực
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="field-content">
                    <div className="field-header">
                      <h3 className="field-name">{field.fieldName}</h3>
                      <div className="field-rating">
                        <span className="material-symbols-outlined rating-star">star</span>
                        <span className="rating-value">
                          {field.averageRating ? field.averageRating.toFixed(1) : '5.0'}
                        </span>
                      </div>
                    </div>
                    <div className="field-location">
                      <span className="material-symbols-outlined">location_on</span>
                      <span>{field.address}</span>
                    </div>
                    <div className="field-type-info">
                      <span className="type-badge">
                        {field.fieldType?.category?.categoryName || 'Sports'}
                      </span>
                      <span className="type-detail">
                        {field.fieldType?.typeName || ''}
                      </span>
                    </div>
                    <div className="field-amenities">
                      {field.utilities?.slice(0, 4).map(utility => (
                        <span key={utility} className="amenity-tag">{utility}</span>
                      ))}
                      {field.utilities && field.utilities.length > 4 && (
                        <span className="amenity-tag more">+{field.utilities.length - 4}</span>
                      )}
                    </div>
                    <div className="field-footer">
                      <div className="field-price">
                        <span className="price-amount">{field.hourlyPrice.toLocaleString()}đ</span>
                        <span className="price-unit">/giờ</span>
                      </div>
                      <button className="book-button">
                        Đặt ngay
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && fields.length > 0 && (
            <div className="pagination">
              <button 
                className="pagination-button" 
                disabled={filters.page === 1}
                onClick={() => handlePageChange(filters.page - 1)}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (filters.page <= 3) {
                  pageNum = i + 1;
                } else if (filters.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = filters.page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`pagination-button ${filters.page === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {pagination.totalPages > 5 && filters.page < pagination.totalPages - 2 && (
                <>
                  <span className="pagination-dots">...</span>
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(pagination.totalPages)}
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}
              
              <button 
                className="pagination-button"
                disabled={filters.page === pagination.totalPages}
                onClick={() => handlePageChange(filters.page + 1)}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FieldListPage;

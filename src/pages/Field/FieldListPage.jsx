/**
 * @fileoverview FieldListPage - Trang danh sách sân thể thao
 * 
 * Trang này hiển thị danh sách sân với các tính năng:
 * - Tìm kiếm theo tên, địa chỉ
 * - Lọc theo category, field type, quận, giá, thời gian
 * - Sắp xếp theo tên, giá, mới nhất
 * - Phân trang
 * - Responsive (mobile filters)
 * 
 * @uses AppContext - Global state và search functions
 * @uses useFieldFilter - Hook quản lý filter state
 * 
 * @author San Sieu Toc Team
 * @date 2026-02-27
 */

import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Context & Hooks
import { useApp } from '../../context/AppContext';

// Styles
import '../../styles/FieldListPage.css';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Price range constants
 * @constant
 */
const PRICE_CONFIG = {
  MIN: 0,
  MAX: 2000000,
  STEP: 50000,
  DEFAULT_MAX: 1000000 // Giá mặc định khi chưa nhập
};

/**
 * Default filter values
 * @constant
 */
const DEFAULT_FILTERS = {
  searchText: '',
  categoryName: '',
  fieldTypeName: '',
  district: '',
  priceMax: PRICE_CONFIG.DEFAULT_MAX, // Chỉ cần priceMax, filter từ 0 đến giá này
  date: '',
  startTime: '',
  endTime: '',
  status: 'Available',
  sortBy: 'newest',
  page: 1,
  limit: 6
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * FieldListPage Component
 * 
 * Displays searchable and filterable list of sports fields
 * 
 * Features:
 * - Nhận search params từ HomePage (search query + date)
 * - 6 filter types (text search, category, field type, location, price range, date/time)
 * - Field type filter dynamically shown only for Football category
 * - 4 sort options (name, price asc/desc, newest)
 * - Pagination (6 items per page)
 * - Responsive design with mobile filters
 * - Loading, error, and empty states
 * 
 * @component
 */
const FieldListPage = () => {
  // ==========================================
  // CONTEXT & HOOKS
  // ==========================================
  
  /**
   * i18n - Internationalization hook
   */
  const { t } = useTranslation();
  
  /**
   * AppContext - Global state và API functions
   * 
   * TODO: API Integration Points
   * - searchFields: GET /api/fields?searchText=...&categoryName=...&district=...&priceMax=...&page=...&limit=...
   * - globalData: GET /api/config (categories, districts, fieldTypes, priceRange)
   * - getFieldTypesByCategory: GET /api/field-types?categoryId=...
   */
  const { 
    searchFields,           // Search function từ context
    globalData,             // { categories, districts, priceRange, fieldTypes }
    isLoading,              // Loading state checker
    getError,               // Error state getter
    clearError,             // Clear error function
    getFieldTypesByCategory // Get field types by category
  } = useApp();

  /**
   * URL Search Params - Nhận params từ HomePage
   */
  const [searchParams] = useSearchParams();

  // ==========================================
  // STATE DECLARATIONS
  // ==========================================

  /**
   * Filter state - Quản lý tất cả filter criteria
   */
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    searchText: searchParams.get('search') || '',
    date: searchParams.get('date') || ''
  });

  /**
   * Debounced search text - Không dùng cho auto-search nữa
   * Chỉ giữ lại để tránh lỗi nếu có component khác reference
   */
  // const debouncedSearchText = useDebounce(filters.searchText, 300);

  /**
   * Search text input - Giá trị tạm khi user đang nhập
   * Chỉ cập nhật filters.searchText khi user click "Tìm kiếm"
   */
  const [searchInputText, setSearchInputText] = useState(
    searchParams.get('search') || ''
  );

  /**
   * UI state
   */
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [navHidden, setNavHidden] = useState(false); // Track khi header ẩn để điều chỉnh sticky sidebar
  
  /**
   * Data state - Results từ search
   */
  const [fields, setFields] = useState([]);
  const [pagination, setPagination] = useState({ 
    page: 1, 
    limit: 6, 
    total: 0, 
    totalPages: 1 
  });
  const [facets, setFacets] = useState({ 
    categories: [], 
    districts: [], 
    priceRange: { min: 0, max: PRICE_CONFIG.MAX }
  });

  /**
   * Price input display - Giá trị hiển thị trên input (có thể khác filters khi đang nhập)
   */
  const [priceInputValue, setPriceInputValue] = useState(
    DEFAULT_FILTERS.priceMax.toLocaleString('vi-VN')
  );

  // ==========================================
  // COMPUTED VALUES
  // ==========================================

  /**
   * Loading state từ context
   */
  const loading = isLoading('searchFields');

  /**
   * Error state từ context
   */
  const error = getError('searchFields');

  /**
   * Field types cho Football category
   */
  const footballFieldTypes = getFieldTypesByCategory('Football');

  // ==========================================
  // API CALLS
  // ==========================================

  /**
   * fetchFields - Gọi API search fields
   * Sử dụng searchFields từ AppContext
   */
  const fetchFields = useCallback(async () => {
    clearError('searchFields');

    const result = await searchFields({
      ...filters
    });
    
    if (result.success) {
      setFields(result.data.fields);
      setPagination(result.data.pagination);
      if (result.data.facets) {
        setFacets(result.data.facets);
      }
    }
  }, [filters, searchFields, clearError]);

  // ==========================================
  // EFFECTS
  // ==========================================

  /**
   * Effect: Fetch fields khi filters thay đổi
   */
  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  /**
   * Effect: Observe header visibility để điều chỉnh sticky sidebar
   * Khi header ẩn (scroll down), sidebar sẽ di chuyển lên cao hơn
   */
  useEffect(() => {
    const checkNavbar = () => {
      const nav = document.querySelector('.header-nav');
      if (nav) {
        setNavHidden(nav.classList.contains('header-hidden'));
      }
    };

    // Initial check
    checkNavbar();

    // Observe class changes on header
    const nav = document.querySelector('.header-nav');
    if (nav) {
      const navObserver = new MutationObserver(checkNavbar);
      navObserver.observe(nav, { attributes: true, attributeFilter: ['class'] });
      
      return () => navObserver.disconnect();
    }
  }, []);

  /**
   * Effect: Update filters từ URL params (khi navigate từ HomePage)
   */
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const dateFromUrl = searchParams.get('date');
    
    if (searchFromUrl || dateFromUrl) {
      setFilters(prev => ({
        ...prev,
        searchText: searchFromUrl || prev.searchText,
        date: dateFromUrl || prev.date
      }));
      // Cũng cập nhật search input text
      if (searchFromUrl) {
        setSearchInputText(searchFromUrl);
      }
    }
  }, [searchParams]);

  // ==========================================
  // FILTER HANDLERS
  // ==========================================

  /**
   * handleFilterChange - Generic filter change handler
   * @param {string} key - Filter key
   * @param {*} value - Filter value
   */
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to page 1 when filter changes
    }));
  }, []);

  /**
   * handleCategoryChange - Toggle category filter
   * @param {string} category - Category name
   */
  const handleCategoryChange = useCallback((category) => {
    setFilters(prev => ({
      ...prev,
      categoryName: prev.categoryName === category ? '' : category,
      fieldTypeName: '', // Reset field type when category changes
      page: 1
    }));
  }, []);

  /**
   * handleFieldTypeChange - Toggle field type filter (only for Football)
   * @param {string} typeName - Field type name
   */
  const handleFieldTypeChange = useCallback((typeName) => {
    setFilters(prev => ({
      ...prev,
      fieldTypeName: prev.fieldTypeName === typeName ? '' : typeName,
      page: 1
    }));
  }, []);

  /**
   * handleSortChange - Change sort option
   * @param {string} sortValue - Sort value
   */
  const handleSortChange = useCallback((sortValue) => {
    setFilters(prev => ({ ...prev, sortBy: sortValue, page: 1 }));
  }, []);

  /**
   * handlePageChange - Navigate to different page
   * @param {number} newPage - Page number
   */
  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pagination.totalPages]);

  /**
   * handleReset - Reset all filters to default
   */
  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchInputText('');
    setPriceInputValue(DEFAULT_FILTERS.priceMax.toLocaleString('vi-VN'));
    clearError('searchFields');
  }, [clearError]);

  // ==========================================
  // PRICE HANDLERS
  // ==========================================

  /**
   * handlePriceInputChange - Handle khi user đang nhập giá (chưa apply filter)
   * Format số với dấu phẩy ngăn cách hàng nghìn
   * @param {Event} e - Input event
   */
  const handlePriceInputChange = useCallback((e) => {
    // Chỉ cho phép số
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    
    if (rawValue === '') {
      setPriceInputValue('');
      return;
    }
    
    // Format với dấu phẩy
    const numericValue = parseInt(rawValue, 10);
    setPriceInputValue(numericValue.toLocaleString('vi-VN'));
  }, []);

  /**
   * handlePriceInputBlur - Apply filter khi user blur khỏi input
   * @param {Event} e - Blur event
   */
  const handlePriceInputBlur = useCallback(() => {
    // Parse giá trị từ input (bỏ dấu phẩy)
    const rawValue = priceInputValue.replace(/[^\d]/g, '');
    let numericValue = parseInt(rawValue, 10) || PRICE_CONFIG.DEFAULT_MAX;
    
    // Giới hạn trong khoảng cho phép
    numericValue = Math.max(0, Math.min(numericValue, PRICE_CONFIG.MAX));
    
    // Cập nhật cả display và filter
    setPriceInputValue(numericValue.toLocaleString('vi-VN'));
    handleFilterChange('priceMax', numericValue);
  }, [priceInputValue, handleFilterChange]);

  /**
   * handlePriceKeyPress - Apply filter khi user nhấn Enter
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handlePriceKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handlePriceInputBlur();
    }
  }, [handlePriceInputBlur]);

  /**
   * clearSearch - Clear search text
   */
  const clearSearch = useCallback(() => {
    setSearchInputText('');
    handleFilterChange('searchText', '');
  }, [handleFilterChange]);

  /**
   * handleSearchSubmit - Submit search khi user click button hoặc Enter
   * Cập nhật filters.searchText từ searchInputText
   */
  const handleSearchSubmit = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      searchText: searchInputText.trim(),
      page: 1
    }));
  }, [searchInputText]);

  /**
   * handleSearchKeyPress - Handle Enter key trong search input
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleSearchKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  }, [handleSearchSubmit]);

  // ==========================================
  // RENDER HELPERS
  // ==========================================

  /**
   * renderLoading - Render loading state
   */
  const renderLoading = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{t('fieldList.loading')}</p>
    </div>
  );

  /**
   * renderError - Render error state
   */
  const renderError = () => (
    <div className="error-container">
      <span className="material-symbols-outlined error-icon">error</span>
      <h3>{t('fieldList.errorTitle')}</h3>
      <p>{error}</p>
      <button onClick={fetchFields} className="retry-button">
        {t('fieldList.retry')}
      </button>
    </div>
  );

  /**
   * renderEmpty - Render empty state
   */
  const renderEmpty = () => (
    <div className="empty-container">
      <span className="material-symbols-outlined empty-icon">search_off</span>
      <h3>{t('fieldList.emptyTitle')}</h3>
      <p>{t('fieldList.emptyDescription')}</p>
      <button onClick={handleReset} className="reset-filters-button">
        {t('fieldList.resetFilters')}
      </button>
    </div>
  );

  // ==========================================
  // MAIN RENDER
  // ==========================================

  return (
    <div className="field-list-page">
      {/* Page Title - full width, above sidebar+content */}
      <div className="field-list-page-header">
        <h1 className="page-title" >{t('fieldList.pageTitle')}</h1>
        <p className="page-subtitle">{t('fieldList.pageSubtitle')}</p>
      </div>

      <div className="field-list-container">
        {/* Sidebar Filters */}
        <aside className={`field-list-sidebar ${showMobileFilters ? 'show' : ''} ${navHidden ? 'nav-hidden' : ''}`}>
          {/* Mobile Filter Toggle */}
          <div 
            className="mobile-filter-toggle"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <span className="toggle-label">
              <span className="material-symbols-outlined">filter_list</span>
              {t('fieldList.filters')}
            </span>
            <span className="material-symbols-outlined">expand_more</span>
          </div>

          {/* Desktop Sidebar Content */}
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h3 className="sidebar-title">
                <span className="material-symbols-outlined">tune</span>
                {t('fieldList.filterSearch')}
              </h3>
              <button onClick={handleReset} className="reset-button">{t('fieldList.reset')}</button>
            </div>

            {/* Search Input trong Bộ lọc */}
            <div className="filter-group search-filter-group">
              <p className="filter-label">{t('fieldList.searchLabel')}</p>
              <div className="search-box">
                <div className="search-input-container">
                  <input
                    type="text"
                    value={searchInputText}
                    onChange={(e) => setSearchInputText(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    placeholder={t('fieldList.searchPlaceholder')}
                    className="search-input"
                  />
                  {searchInputText && (
                    <button 
                      className="clear-search-btn"
                      onClick={clearSearch}
                      aria-label="Xóa tìm kiếm"
                      type="button"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  )}
                </div>
                <button 
                  className="search-submit-btn"
                  onClick={handleSearchSubmit}
                  type="button"
                >
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>
            </div>

            {/* Sport Type Filter */}
            <div className="filter-group">
              <p className="filter-label">{t('fieldList.sportType')}</p>
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
            {filters.categoryName === 'Football' && footballFieldTypes.length > 0 && (
              <div className="filter-group">
                <p className="filter-label">{t('fieldList.fieldType')}</p>
                <div className="sport-chips">
                  {footballFieldTypes.map((fieldType) => (
                    <label key={fieldType._id || fieldType.typeName} className="chip-label">
                      <input
                        type="checkbox"
                        checked={filters.fieldTypeName === fieldType.typeName}
                        onChange={() => handleFieldTypeChange(fieldType.typeName)}
                        className="chip-input"
                      />
                      <div className="chip">
                        {fieldType.typeName}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Location Filter */}
            <div className="filter-group">
              <p className="filter-label">{t('fieldList.district')}</p>
              <div className="select-wrapper">
                <select
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('fieldList.allDistricts')}</option>
                  {globalData.districts.map(district => (
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
              <p className="filter-label">{t('fieldList.time')}</p>
              <div className="time-inputs">
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="time-input"
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="time-range">
                  <input
                    type="time"
                    value={filters.startTime}
                    onChange={(e) => handleFilterChange('startTime', e.target.value)}
                    className="time-input small"
                  />
                  <span className="time-separator">-</span>
                  <input
                    type="time"
                    value={filters.endTime}
                    onChange={(e) => handleFilterChange('endTime', e.target.value)}
                    className="time-input small"
                  />
                </div>
              </div>
            </div>

            {/* Price Filter - Đơn giản hóa: chỉ nhập giá tối đa */}
            <div className="filter-group">
              <p className="filter-label">{t('fieldList.maxPrice')}</p>
              <div className="price-filter-simple">
                <div className="price-input-wrapper">
                  <span className="price-currency">₫</span>
                  <input
                    type="text"
                    value={priceInputValue}
                    onChange={handlePriceInputChange}
                    onBlur={handlePriceInputBlur}
                    onKeyPress={handlePriceKeyPress}
                    className="price-input-field"
                    placeholder={t('fieldList.maxPrice')}
                  />
                </div>
                <p className="price-hint">
                  {t('fieldList.priceHint', { 
                    min: '0đ', 
                    max: `${filters.priceMax.toLocaleString('vi-VN')}đ` 
                  })}
                </p>
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
            <div className="search-box">
              <div className="search-input-container">
                <span className="material-symbols-outlined search-icon">search</span>
                <input
                  type="text"
                  value={searchInputText}
                  onChange={(e) => setSearchInputText(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder={t('fieldList.searchPlaceholder')}
                  className="search-input"
                />
                {searchInputText && (
                  <button 
                    className="clear-search-btn"
                    onClick={clearSearch}
                    aria-label={t('common.close')}
                    type="button"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
              </div>
              <button 
                className="search-submit-btn"
                onClick={handleSearchSubmit}
                type="button"
              >
                <span className="material-symbols-outlined">search</span>
                {t('common.search')}
              </button>
            </div>
          </div>

          {/* Results Header */}
          <div className="results-header">
            <div className="results-meta">
              <p className="results-count">
                {loading ? (
                  t('fieldList.resultsLoading')
                ) : filters.searchText ? (
                  <>
                    {t('fieldList.resultsFoundWithKeyword', { count: pagination.total })}{' '}
                    <strong className="search-keyword">"{filters.searchText}"</strong>
                  </>
                ) : (
                  t('fieldList.resultsFound', { count: pagination.total })
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
                <option value="newest">{t('fieldList.sortNewest')}</option>
                <option value="name">{t('fieldList.sortNameAZ')}</option>
                <option value="price-asc">{t('fieldList.sortPriceAsc')}</option>
                <option value="price-desc">{t('fieldList.sortPriceDesc')}</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && renderLoading()}

          {/* Error State */}
          {error && !loading && renderError()}

          {/* Empty State */}
          {!loading && !error && fields.length === 0 && renderEmpty()}

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
                    {/* Category Badge - góc trên trái */}
                    {/* <div className="field-category-badge">
                      <span className="category-icon material-symbols-outlined">
                        {field.fieldType?.category?.categoryName === 'Football' ? 'sports_soccer' :
                         field.fieldType?.category?.categoryName === 'Tennis' ? 'sports_tennis' :
                         field.fieldType?.category?.categoryName === 'Badminton' ? 'sports_tennis' :
                         field.fieldType?.category?.categoryName === 'Basketball' ? 'sports_basketball' :
                         field.fieldType?.category?.categoryName === 'Volleyball' ? 'sports_volleyball' : 'sports'}
                      </span>
                      <span>{field.fieldType?.category?.categoryName || 'Sports'}</span>
                    </div> */}
                    
                    {/* Status Badge - góc trên phải */}
                    {field.status === 'Available' && (
                      <div className="field-status-badge available">
                        <span className="status-dot"></span>
                        {t('fieldList.badgeAvailable')}
                      </div>
                    )}
                    {field.status === 'Maintenance' && (
                      <div className="field-status-badge maintenance">
                        <span className="status-dot"></span>
                        {t('fieldList.badgeMaintenance')}
                      </div>
                    )}
                  </div>
                  
                  <div className="field-content">
                    {/* Header: Name + Rating */}
                    <div className="field-header">
                      <h3 className="field-name" title={field.fieldName}>{field.fieldName}</h3>
                      <div className={`field-rating ${field.averageRating > 0 ? '' : 'no-rating'}`}>
                        <span className="material-symbols-outlined rating-star">star</span>
                        <span className="rating-value">
                          {field.averageRating > 0 ? field.averageRating.toFixed(1) : t('field.new')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Address */}
                    <div className="field-location">
                      <span className="material-symbols-outlined">location_on</span>
                      <span className="location-text" title={field.address}>{field.address}</span>
                    </div>
                    
                    {/* Field Type */}
                    <div className="field-type-row">
                      <span className="category-tag">
                        {field.fieldType?.category?.categoryName || 'Sports'}
                      </span>
                      {field.fieldType?.typeName && (
                        <span className="type-separator">•</span>
                      )}
                      {field.fieldType?.typeName && (
                        <span className="type-name">{field.fieldType.typeName}</span>
                      )}
                    </div>
                    
                    {/* Amenities - 1 dòng */}
                    <div className="field-amenities">
                      {field.utilities?.slice(0, 3).map(utility => (
                        <span key={utility} className="amenity-tag">{utility}</span>
                      ))}
                      {field.utilities && field.utilities.length > 3 && (
                        <span className="amenity-tag more">+{field.utilities.length - 3}</span>
                      )}
                    </div>
                    
                    {/* Footer: Price + Book Button */}
                    <div className="field-footer">
                      <div className="field-price">
                        <span className="price-amount">{field.hourlyPrice.toLocaleString()}đ</span>
                        <span className="price-unit">{t('fieldList.perHour')}</span>
                      </div>
                      <button className="book-button">
                        {t('field.bookNow')}
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

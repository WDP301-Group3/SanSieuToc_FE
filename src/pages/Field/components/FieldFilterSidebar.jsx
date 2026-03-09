/**
 * @fileoverview FieldFilterSidebar - Component sidebar bộ lọc sân
 */

import { useTranslation } from 'react-i18next';

const FieldFilterSidebar = ({
  filters,
  searchInputText,
  setSearchInputText,
  priceInputValue,
  showMobileFilters,
  setShowMobileFilters,
  navHidden,
  globalData,
  facets,
  selectedCategoryFieldTypes,
  handleFilterChange,
  handleCategoryChange,
  handleFieldTypeChange,
  handleReset,
  handlePriceInputChange,
  handlePriceInputBlur,
  handlePriceKeyPress,
  clearSearch,
  handleSearchSubmit,
  handleSearchKeyPress,
}) => {
  const { t } = useTranslation();

  return (
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

        {/* Search Input */}
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
            {globalData.categories.map((cat) => {
              const facet = facets.categories.find(fc => fc.name === cat.categoryName);
              const count = facet ? facet.count : 0;
              return (
                <label key={cat._id || cat.categoryName} className="chip-label">
                  <input
                    type="checkbox"
                    checked={filters.categoryName === cat.categoryName}
                    onChange={() => handleCategoryChange(cat.categoryName)}
                    className="chip-input"
                  />
                  <div className="chip">
                    {cat.categoryName} ({count})
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Field Type Filter */}
        {filters.categoryName && selectedCategoryFieldTypes.length > 0 && (
          <div className="filter-group">
            <p className="filter-label">{t('fieldList.fieldType')}</p>
            <div className="sport-chips">
              {selectedCategoryFieldTypes.map((fieldType) => (
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

        {/* Price Filter */}
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
      </div>
    </aside>
  );
};

export default FieldFilterSidebar;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/FieldListPage.css';

const FieldListPage = () => {
  const [filters, setFilters] = useState({
    sportType: 'Bóng đá',
    district: '',
    date: '2023-10-27',
    timeFrom: '17:00',
    timeTo: '19:00',
    priceMin: 200000,
    priceMax: 800000
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Mock data for fields
  const fields = [
    {
      id: 1,
      name: 'Sân Bóng Đá Mini 7 Người - Khu A',
      address: '123 Đường Thể Thao, Quận 7, TP.HCM',
      sportType: 'Bóng đá',
      price: 300000,
      rating: 4.8,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400',
      amenities: ['Wifi', 'Parking', 'Shower', 'Lighting'],
      verified: true,
      quickBook: true
    },
    {
      id: 2,
      name: 'Sân Cầu Lông Số 3',
      address: '456 Nguyễn Văn Linh, Quận Cầu Giấy, Hà Nội',
      sportType: 'Cầu lông',
      price: 150000,
      rating: 4.6,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
      amenities: ['Wifi', 'Parking', 'Water'],
      verified: true,
      quickBook: false
    },
    {
      id: 3,
      name: 'Sân Tennis Cao Cấp',
      address: '789 Lê Lợi, Quận Thanh Xuân, Hà Nội',
      sportType: 'Tennis',
      price: 500000,
      rating: 4.9,
      reviews: 245,
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
      amenities: ['Wifi', 'Parking', 'Shower', 'Lighting', 'Water'],
      verified: true,
      quickBook: true
    }
  ];

  const handleSportTypeChange = (sport) => {
    setFilters(prev => ({
      ...prev,
      sportType: sport
    }));
  };

  const handleReset = () => {
    setFilters({
      sportType: '',
      district: '',
      date: '',
      timeFrom: '',
      timeTo: '',
      priceMin: 0,
      priceMax: 1000000
    });
  };

  // Generate 30-minute time slots
  const timeSlots = [];
  for (let h = 5; h <= 23; h++) {
    const hour = h.toString().padStart(2, '0');
    timeSlots.push(`${hour}:00`);
    if (h < 23) timeSlots.push(`${hour}:30`);
  }

  const adjustTime = (field, direction) => {
    const currentIdx = timeSlots.indexOf(filters[field]);
    const newIdx = currentIdx + direction;
    if (newIdx >= 0 && newIdx < timeSlots.length) {
      setFilters(prev => ({ ...prev, [field]: timeSlots[newIdx] }));
    }
  };

  // Price range helpers
  const PRICE_MIN = 0;
  const PRICE_MAX = 1000000;
  const PRICE_STEP = 50000;

  const handlePriceMinChange = (e) => {
    const val = Math.min(Number(e.target.value), filters.priceMax - PRICE_STEP);
    setFilters(prev => ({ ...prev, priceMin: val }));
  };

  const handlePriceMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), filters.priceMin + PRICE_STEP);
    setFilters(prev => ({ ...prev, priceMax: val }));
  };

  const fillLeft = ((filters.priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const fillRight = ((PRICE_MAX - filters.priceMax) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className="field-list-page">
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
                {['Bóng đá', 'Cầu lông', 'Tennis', 'Bóng rổ','Pickleball'].map(sport => (
                  <label key={sport} className="chip-label">
                    <input
                      type="radio"
                      name="sportType"
                      checked={filters.sportType === sport}
                      onChange={() => handleSportTypeChange(sport)}
                      className="chip-input"
                    />
                    <div className="chip">{sport}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="filter-group">
              <p className="filter-label">Khu vực</p>
              <div className="select-wrapper">
                <select
                  value={filters.district}
                  onChange={(e) => setFilters({...filters, district: e.target.value})}
                  className="filter-select"
                >
                  <option value="">Tất cả Quận/Huyện</option>
                  <option value="dongda">Quận Đống Đa</option>
                  <option value="caugiay">Quận Cầu Giấy</option>
                  <option value="thanhxuan">Quận Thanh Xuân</option>
                  <option value="haibatrung">Quận Hai Bà Trưng</option>
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
                  onChange={(e) => setFilters({...filters, date: e.target.value})}
                  className="time-input"
                />
                <div className="time-range">
                  <div className="time-spinner">
                    <button
                      type="button"
                      className="time-arrow"
                      onClick={() => adjustTime('timeFrom', -1)}
                    >
                      <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    </button>
                    <select
                      value={filters.timeFrom}
                      onChange={(e) => setFilters({...filters, timeFrom: e.target.value})}
                      className="time-input small"
                    >
                      <option value="">Từ</option>
                      {timeSlots.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="time-arrow"
                      onClick={() => adjustTime('timeFrom', 1)}
                    >
                      <span className="material-symbols-outlined">keyboard_arrow_up</span>
                    </button>
                  </div>
                  <span className="time-separator">-</span>
                  <div className="time-spinner">
                    <button
                      type="button"
                      className="time-arrow"
                      onClick={() => adjustTime('timeTo', -1)}
                    >
                      <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    </button>
                    <select
                      value={filters.timeTo}
                      onChange={(e) => setFilters({...filters, timeTo: e.target.value})}
                      className="time-input small"
                    >
                      <option value="">Đến</option>
                      {timeSlots.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="time-arrow"
                      onClick={() => adjustTime('timeTo', 1)}
                    >
                      <span className="material-symbols-outlined">keyboard_arrow_up</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <div className="price-header">
                <p className="filter-label">Khoảng giá</p>
                <p className="price-display">{filters.priceMin / 1000}k - {filters.priceMax / 1000}k</p>
              </div>
              <div className="price-range-slider">
                <div className="range-track">
                  <div
                    className="range-fill"
                    style={{ left: `${fillLeft}%`, right: `${fillRight}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                  value={filters.priceMin}
                  onChange={handlePriceMinChange}
                  className="range-input range-input-min"
                />
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                  value={filters.priceMax}
                  onChange={handlePriceMaxChange}
                  className="range-input range-input-max"
                />
              </div>
              <div className="price-inputs">
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({...filters, priceMin: Math.round(Number(e.target.value) / PRICE_STEP) * PRICE_STEP})}
                  className="price-input"
                  step={PRICE_STEP}
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({...filters, priceMax: Math.round(Number(e.target.value) / PRICE_STEP) * PRICE_STEP})}
                  className="price-input"
                  step={PRICE_STEP}
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  placeholder="Max"
                />
              </div>
            </div>

            <button className="apply-filter-button">Áp dụng bộ lọc</button>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên sân..."
                className="search-input"
              />
            </label>
          </div>

          {/* Results Header */}
          <div className="results-header">
            <h1 className="results-title">Danh sách sân thể thao</h1>
            <div className="results-meta">
              <p className="results-count">Tìm thấy <strong>{fields.length}</strong> sân</p>
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
              <select className="sort-select">
                <option>Mới nhất</option>
                <option>Giá thấp nhất</option>
                <option>Giá cao nhất</option>
                <option>Đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          {/* Fields Grid */}
          <div className={`fields-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {fields.map(field => (
              <Link to={`/fields/${field.id}`} key={field.id} className={`field-card ${viewMode === 'list' ? 'field-card-list' : ''}`}>
                <div className="field-image" style={{ backgroundImage: `url(${field.image})` }}>
                  <div className="field-badges">
                    {field.verified && (
                      <span className="badge badge-verified">
                        <span className="material-symbols-outlined">verified</span>
                        Đã xác thực
                      </span>
                    )}
                    {field.quickBook && (
                      <span className="badge badge-quick">
                        <span className="material-symbols-outlined">bolt</span>
                        Đặt nhanh
                      </span>
                    )}
                  </div>
                </div>
                <div className="field-content">
                  <div className="field-header">
                    <h3 className="field-name">{field.name}</h3>
                    <div className="field-rating">
                      <span className="material-symbols-outlined rating-star">star</span>
                      <span className="rating-value">{field.rating}</span>
                      <span className="rating-count">({field.reviews})</span>
                    </div>
                  </div>
                  <div className="field-location">
                    <span className="material-symbols-outlined">location_on</span>
                    <span>{field.address}</span>
                  </div>
                  <div className="field-amenities">
                    {field.amenities.slice(0, 4).map(amenity => (
                      <span key={amenity} className="amenity-tag">{amenity}</span>
                    ))}
                    {field.amenities.length > 4 && (
                      <span className="amenity-tag more">+{field.amenities.length - 4}</span>
                    )}
                  </div>
                  <div className="field-footer">
                    <div className="field-price">
                      <span className="price-amount">{field.price.toLocaleString()}đ</span>
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

          {/* Pagination */}
          <div className="pagination">
            <button className="pagination-button" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="pagination-button active">1</button>
            <button className="pagination-button">2</button>
            <button className="pagination-button">3</button>
            <span className="pagination-dots">...</span>
            <button className="pagination-button">10</button>
            <button className="pagination-button">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FieldListPage;

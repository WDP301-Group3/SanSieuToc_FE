/**
 * @fileoverview HomePage - Trang chủ Sân Siêu Tốc
 * 
 * Trang chủ với các sections:
 * - Hero section với search bar
 * - Quick search với autocomplete preview
 * - Stats section
 * - Featured fields section
 * - How it works section
 * 
 * @uses AppContext - Global state và search functions
 * @uses useDebounce - Debounce search input
 * @uses useClickOutside - Close preview on outside click
 * 
 * @author San Sieu Toc Team
 * @date 2026-02-27
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Context & Hooks
import { useApp } from '../../context/AppContext';
import { useDebounce, useClickOutside } from '../../hooks/useAppHooks';

// Mock Data - TODO: Replace with API calls
import { mockCategories, mockFields, fieldRatings } from '../../data/mockData';

// Styles
import '../../styles/HomePage.css';

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * HomePage Component
 * 
 * Landing page với:
 * - Hero section với search bar và date picker
 * - Quick search với autocomplete (top 5 results)
 * - Navigate đến FieldListPage với search params
 * 
 * @component
 */
const HomePage = () => {
  // ==========================================
  // CONTEXT & HOOKS
  // ==========================================
  
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  /**
   * AppContext - Sử dụng quickSearch function
   */
  const { quickSearch, isLoading } = useApp();
  
  // ==========================================
  // STATE DECLARATIONS
  // ==========================================
  
  /**
   * Search form state
   */
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');
  
  /**
   * Preview dropdown state
   */
  const [previewResults, setPreviewResults] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  
  /**
   * Debounced search query - Tránh gọi API quá nhiều
   */
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  /**
   * Featured fields filter state
   */
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  /**
   * Loading state từ context
   */
  const loadingPreview = isLoading('quickSearch');
  
  /**
   * Ref cho dropdown portal - dùng cho click outside check
   */
  const dropdownPortalRef = useRef(null);

  /**
   * Click outside ref - Đóng preview khi click outside
   * Truyền thêm dropdownPortalRef để check cả Portal dropdown
   */
  const searchWrapperRef = useClickOutside(
    () => setShowPreview(false),
    [dropdownPortalRef]
  );

  /**
   * Ref cho search input container - dùng để tính vị trí dropdown portal
   */
  const searchContainerRef = useRef(null);
  
  /**
   * State lưu vị trí dropdown để render portal đúng vị trí
   */
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // ==========================================
  // COMPUTED VALUES
  // ==========================================

  /**
   * Danh sách categories để filter (thêm "Tất cả" ở đầu)
   */
  const categoryFilters = [
    { _id: 'all', categoryName: t('home.allCategories') },
    ...mockCategories.map(cat => ({
      ...cat,
      categoryName: t(`category.${cat.categoryName}`, cat.categoryName)
    }))
  ];

  /**
   * Featured fields - Lọc theo category và sắp xếp theo rating
   * Chỉ lấy sân có status "Available"
   */
  const featuredFields = (() => {
    // Lọc sân available
    let fields = mockFields.filter(field => field.status === 'Available');
    
    // Lọc theo category nếu không phải "all"
    if (selectedCategory !== 'all') {
      fields = fields.filter(field => 
        field.fieldType?.category?._id === selectedCategory
      );
    }
    
    // Thêm rating info và sắp xếp theo rating cao nhất
    fields = fields.map(field => ({
      ...field,
      rating: fieldRatings[field._id] || { averageRating: 0, totalReviews: 0 }
    })).sort((a, b) => {
      // Ưu tiên rating cao, nếu bằng thì ưu tiên nhiều reviews hơn
      if (b.rating.averageRating !== a.rating.averageRating) {
        return b.rating.averageRating - a.rating.averageRating;
      }
      return b.rating.totalReviews - a.rating.totalReviews;
    });
    
    // Chỉ lấy top 4 sân
    return fields.slice(0, 4);
  })();

  // ==========================================
  // EFFECTS
  // ==========================================
  
  /**
   * Effect: Fetch preview results khi debounced query thay đổi
   * Sử dụng quickSearch từ AppContext
   */
  useEffect(() => {
    const fetchPreview = async () => {
      // Chỉ search khi có query >= 2 ký tự
      if (!debouncedSearchQuery || debouncedSearchQuery.trim().length < 2) {
        setPreviewResults([]);
        setShowPreview(false);
        return;
      }
      
      // Gọi quickSearch từ AppContext
      const results = await quickSearch(debouncedSearchQuery.trim(), 5);
      
      setPreviewResults(results);
      setShowPreview(results.length > 0);
    };
    
    fetchPreview();
  }, [debouncedSearchQuery, quickSearch]);

  /**
   * Effect: Cập nhật vị trí dropdown khi showPreview thay đổi hoặc window resize
   * Portal cần biết vị trí chính xác của search container
   */
  useEffect(() => {
    const updatePosition = () => {
      if (searchContainerRef.current && showPreview) {
        const rect = searchContainerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8, // 8px margin
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    updatePosition();
    
    // Cập nhật vị trí khi scroll hoặc resize
    if (showPreview) {
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [showPreview]);

  // ==========================================
  // HANDLERS
  // ==========================================
  
  /**
   * handleSearch - Navigate đến FieldListPage với search params
   */
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    
    if (searchDate) {
      params.set('date', searchDate);
    }
    
    // Navigate to field list với search params
    navigate(`/fields?${params.toString()}`);
    setShowPreview(false);
  }, [searchQuery, searchDate, navigate]);
  
  /**
   * handleKeyPress - Handle Enter key press trong search inputs
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);
  
  /**
   * handlePreviewClick - Click vào preview result
   */
  const handlePreviewClick = useCallback(() => {
    setShowPreview(false);
  }, []);

  /**
   * handleSearchInputFocus - Show preview khi focus vào search input
   */
  const handleSearchInputFocus = useCallback(() => {
    if (previewResults.length > 0) {
      setShowPreview(true);
    }
  }, [previewResults.length]);

  // ==========================================
  // RENDER HELPERS
  // ==========================================

  /**
   * renderPreviewLoading - Render loading state trong preview
   */
  const renderPreviewLoading = () => (
    <div className="p-8 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-[#00E536] mb-3"></div>
      <p className="text-gray-600 dark:text-gray-300">{t('home.searching')}</p>
    </div>
  );

  /**
   * renderPreviewResults - Render preview results list
   */
  const renderPreviewResults = () => (
    <>
      <div className="px-4 py-3 bg-gray-50 dark:bg-green-900/30 border-b border-gray-200 dark:border-green-800">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('home.foundResults', { count: previewResults.length })}
        </span>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {previewResults.map((field) => (
          <Link
            key={field.id}
            to={`/fields/${field.id}`}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-green-900/30 transition-colors border-b border-gray-100 dark:border-green-800/50 last:border-0 group"
            onClick={handlePreviewClick}
          >
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-green-900">
              <img 
                src={field.imageUrl || '/default-field.jpg'} 
                alt={field.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = '/default-field.jpg';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate group-hover:text-[#00E536] transition-colors">
                {field.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 mb-1">
                <span className="material-icons-outlined text-xs">location_on</span>
                {field.address}
              </p>
              <p className="text-sm font-medium text-[#00E536]">
                {field.price ? `${field.price.toLocaleString()}đ/${t('field.pricePerHour', { price: '' }).replace('/', '')}` : t('home.contact')}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="material-icons-outlined text-gray-400 group-hover:text-[#00E536] transition-colors">
                arrow_forward
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="px-4 py-3 bg-gray-50 dark:bg-green-900/30 border-t border-gray-200 dark:border-green-800">
        <button 
          className="w-full text-center text-sm font-medium text-[#00E536] hover:text-green-600 transition-colors flex items-center justify-center gap-2"
          onClick={handleSearch}
        >
          {t('home.viewAllResults')}
          <span className="material-icons-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </>
  );

  // ==========================================
  // MAIN RENDER
  // ==========================================
  
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 to-green-100 dark:from-[#052e16] dark:to-[#14532d] overflow-hidden">
        {/* Background SVG */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 dark:opacity-5">
          <svg
            className="absolute w-full h-full text-[#00E536] fill-current"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path d="M0 100 C 20 0 50 0 100 100 Z" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-gray-900 dark:text-white mb-6">
            {t('home.heroTitle')}{' '}
            <span className="text-[#00E536] logo-text-shadow">{t('home.heroHighlight')}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
            {t('home.heroSubtitle')}
          </p>

          {/* Search Bar with Preview */}
          <div className="w-full max-w-4xl relative" ref={searchWrapperRef}>
            <div 
              ref={searchContainerRef}
              className="bg-white dark:bg-[#14532d] rounded-2xl shadow-xl p-3 flex flex-col md:flex-row gap-3 transform transition-all hover:scale-[1.01]"
            >
              {/* Search input - Tên sân, khu vực */}
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons-outlined text-gray-400 group-focus-within:text-[#00E536]">
                    sports_soccer
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-gray-50 dark:bg-green-900/30 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00E536] transition-shadow"
                  placeholder={t('home.searchPlaceholder')}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={handleSearchInputFocus}
                />
              </div>
              
              {/* Search button */}
              <button 
                onClick={handleSearch}
                className="w-full md:w-auto bg-[#00E536] hover:bg-green-500 text-white dark:text-green-900 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-neon transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="material-icons-outlined">search</span>
                {t('home.searchButton')}
              </button>
            </div>
            
            {/* Preview Dropdown - Sử dụng Portal để render bên ngoài DOM hierarchy */}
            {/* Portal giúp dropdown không bị ảnh hưởng bởi overflow:hidden của parent */}
            {showPreview && createPortal(
              <div 
                ref={dropdownPortalRef}
                className="bg-white dark:bg-[#14532d] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-green-800"
                style={{ 
                  position: 'absolute',
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`,
                  zIndex: 9999,
                }}
              >
                {loadingPreview ? renderPreviewLoading() : renderPreviewResults()}
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>

      {/* Featured Fields Section */}
      <section className="py-20 bg-gray-50 dark:bg-[#052e16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.featuredFields')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.featuredFieldsDesc')}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="category-filter-tabs">
            {categoryFilters.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`category-tab ${selectedCategory === category._id ? 'active' : ''}`}
              >
                {category.categoryName}
              </button>
            ))}
          </div>

          {/* Featured Fields Grid */}
          <div className="featured-fields-grid">
            {featuredFields.length > 0 ? (
              featuredFields.map((field) => (
                <Link key={field._id} to={`/fields/${field._id}`} className="featured-field-card group">
                  <div className="card-inner">
                    <div className="card-image">
                      <img
                        alt={field.fieldName}
                        src={field.image?.[0] || '/default-field.jpg'}
                        onError={(e) => { e.target.src = '/default-field.jpg'; }}
                      />
                      <div className="badge badge-category">
                        {t(`category.${field.fieldType?.category?.categoryName}`, field.fieldType?.category?.categoryName || 'Sân')}
                      </div>
                      {field.rating?.averageRating > 0 && (
                        <div className="badge badge-rating">
                          <span className="material-icons-outlined">star</span>
                          {field.rating.averageRating}
                        </div>
                      )}
                    </div>
                    <div className="card-content">
                      <h4 className="card-title">{field.fieldName}</h4>
                      <p className="card-address">
                        <span className="material-icons-outlined">location_on</span>
                        {field.district || field.address}
                      </p>
                      <div className="card-footer">
                        <span className="field-type-badge">
                          {field.fieldType?.typeName || t('home.standardField')}
                        </span>
                        <span className="field-price">
                          {(field.hourlyPrice / 1000).toFixed(0)}k/h
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="featured-fields-empty">
                <span className="material-icons-outlined">sports_soccer</span>
                <p>{t('home.noFieldsFound')}</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link to="/fields">
              <button className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-green-700 text-base font-medium rounded-xl text-gray-700 dark:text-white bg-white dark:bg-[#14532d] hover:bg-gray-50 dark:hover:bg-green-800 transition-colors">
                {t('home.viewMoreFields')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-[#14532d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.howItWorks')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.howItWorksDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'search',
                title: t('home.step1Title'),
                description: t('home.step1Desc'),
              },
              {
                icon: 'event_available',
                title: t('home.step2Title'),
                description: t('home.step2Desc'),
              },
              {
                icon: 'sports_soccer',
                title: t('home.step3Title'),
                description: t('home.step3Desc'),
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00E536]/10 text-[#00E536] mb-4">
                  <span className="material-icons-outlined text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-[#14532d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: t('home.stats.fields') },
              { number: '10,000+', label: t('home.stats.users') },
              { number: '50+', label: t('home.stats.cities') },
              { number: '4.8/5', label: t('home.stats.rating') },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#00E536] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
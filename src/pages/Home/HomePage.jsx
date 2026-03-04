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

// Assets
import logoImg from '../../assets/images/logo.png';

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
  const [searchDate] = useState('');
  
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
   * Background carousel state - 5 hình ảnh môn thể thao
   * Ảnh bóng đá (football) là ảnh đầu tiên
   */
  const backgroundImages = [
    '/assets/images/football.jpg',
    '/assets/images/badminton.jpg',
    '/assets/images/basketball.jpg',
    '/assets/images/tennis.jpg',
    '/assets/images/volleyball.jpg',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
   * Effect: Background carousel - Đổi ảnh mỗi 5 giây
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);
  
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
      <div className="relative overflow-hidden" style={{ height: '90vh', minHeight: '600px', maxHeight: '860px' }}>
        {/* Background Carousel - Render tất cả ảnh, dùng opacity để fade mượt */}
        {backgroundImages.map((img, index) => (
          <div
            key={img}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: index === currentImageIndex ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              zIndex: 1,
            }}
          />
        ))}
        
        {/* Gradient overlay nhẹ phía dưới để text dễ đọc */}
        <div className="absolute bottom-0 left-0 w-full h-2/3 z-[2]" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)' }} />

        {/* Hero Content - Chữ và search ở phía dưới */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-4" style={{ textShadow: '0 2px 12px rgba(0, 0, 0, 0.5)' }}>
              {t('home.heroTitle')}{' '}
              <span className="text-[#00E536] logo-text-shadow">{t('home.heroHighlight')}</span>
            </h1>
            <p className="text-lg md:text-xl text-white max-w-2xl mx-auto" style={{ textShadow: '0 1px 6px rgba(0, 0, 0, 0.4)' }}>
              {t('home.heroSubtitle')}
            </p>
          </div>

          {/* Search Bar with Preview */}
          <div className="w-full max-w-3xl relative" ref={searchWrapperRef}>
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

      {/* Our Story Section */}
      <section className="py-20 bg-white dark:bg-[#14532d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left - Text content */}
            <div>
              {/* Badge */}
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-[#00E536] bg-[#00E536]/10 mb-6 tracking-wide uppercase">
                {t('home.ourStoryBadge')}
              </span>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                {t('home.ourStoryTitle')}{' '}
                <span className="text-[#00E536]">{t('home.ourStoryHighlight')}</span>
              </h2>

              {/* Paragraphs */}
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
                {t('home.ourStoryP1')}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: t('home.ourStoryP2') }}
              />
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-10"
                dangerouslySetInnerHTML={{ __html: t('home.ourStoryP3') }}
              />

              {/* Stats */}
              <div className="flex items-center gap-8 pt-6 border-t border-gray-200 dark:border-green-700">
                {[
                  { value: t('home.ourStoryStat1Value'), label: t('home.ourStoryStat1Label') },
                  { value: t('home.ourStoryStat2Value'), label: t('home.ourStoryStat2Label') },
                  { value: t('home.ourStoryStat3Value'), label: t('home.ourStoryStat3Label') },
                ].map((stat, i) => (
                  <div key={i} className={`${i < 2 ? 'pr-8 border-r border-gray-200 dark:border-green-700' : ''}`}>
                    <div className="text-2xl font-black text-[#00E536]">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-gradient-to-br from-green-50 to-emerald-100 dark:from-[#052e16] dark:to-[#14532d] flex items-center justify-center">
                <img
                  src={logoImg}
                  alt="Sân Siêu Tốc"
                  className="w-2/3 h-2/3 object-contain drop-shadow-2xl"
                />
                {/* Decorative blobs */}
                <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-[#00E536]/10" />
                <div className="absolute bottom-8 left-8 w-14 h-14 rounded-full bg-[#00E536]/15" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-white dark:bg-[#052e16] rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3 border border-gray-100 dark:border-green-800">
                <div className="w-10 h-10 rounded-full bg-[#00E536]/10 flex items-center justify-center">
                  <span className="material-icons-outlined text-[#00E536]">emoji_events</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">#1 Sports Booking</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Vietnam 2024</div>
                </div>
              </div>
              {/* Decorative circle */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-4 border-[#00E536]/20 dark:border-[#00E536]/10" />
            </div>

          </div>
        </div>
      </section>

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
      <section className="relative py-24 overflow-hidden bg-white dark:bg-[#052e16]">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #00E536 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #00E536 0%, transparent 70%)', transform: 'translate(40%, 40%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-[#00E536] bg-[#00E536]/10 mb-4 tracking-wide uppercase">
              {t('home.howItWorks')}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              {t('home.howItWorksTitle')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
              {t('home.howItWorksDesc')}
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '01',
                icon: 'search',
                image: '/assets/images/football.jpg',
                title: t('home.step1Title'),
                description: t('home.step1Desc'),
                color: 'from-green-400 to-emerald-500',
              },
              {
                step: '02',
                icon: 'event_available',
                image: '/assets/images/badminton.jpg',
                title: t('home.step2Title'),
                description: t('home.step2Desc'),
                color: 'from-emerald-400 to-teal-500',
              },
              {
                step: '03',
                icon: 'sports_soccer',
                image: '/assets/images/tennis.jpg',
                title: t('home.step3Title'),
                description: t('home.step3Desc'),
                color: 'from-teal-400 to-green-500',
              },
            ].map((step, index) => (
              <div key={index} className="relative group flex flex-col items-center text-center">
                {/* Mũi tên kết nối giữa các bước (desktop) */}
                {index < 2 && (
                  <div className="hidden md:flex absolute top-14 -right-6 z-20 items-center justify-center">
                    <span className="material-icons-outlined text-[#00E536] text-3xl">arrow_forward</span>
                  </div>
                )}

                {/* Card */}
                <div className="relative w-full bg-white dark:bg-[#14532d] rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 overflow-hidden">
                  {/* Ảnh minh họa */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay trên ảnh */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-60`} />

                    {/* Số bước nổi bật */}
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <span className="text-white font-black text-sm">{step.step}</span>
                    </div>

                    {/* Icon ở giữa ảnh */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform duration-300">
                        <span className="material-icons-outlined text-white text-3xl">{step.icon}</span>
                      </div>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#00E536] transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
                  </div>

                  {/* Bottom accent bar */}
                  <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${step.color} transition-all duration-500`} />
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-14">
            <Link
              to="/fields"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #00E536, #00c42e)' }}
            >
              <span className="material-icons-outlined">rocket_launch</span>
              {t('home.bookNow')}
              <span className="material-icons-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

    </>
  );
};

export default HomePage;
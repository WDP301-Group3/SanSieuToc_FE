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

// Context & Hooks
import { useApp } from '../../context/AppContext';
import { useDebounce, useClickOutside } from '../../hooks/useAppHooks';

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
   * Preview dropdown state
   */
  const [previewResults, setPreviewResults] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  
  /**
   * Debounced search query - Tránh gọi API quá nhiều
   */
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
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
      <p className="text-gray-600 dark:text-gray-300">Đang tìm kiếm...</p>
    </div>
  );

  /**
   * renderPreviewResults - Render preview results list
   */
  const renderPreviewResults = () => (
    <>
      <div className="px-4 py-3 bg-gray-50 dark:bg-green-900/30 border-b border-gray-200 dark:border-green-800">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tìm thấy {previewResults.length} kết quả
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
                {field.price ? `${field.price.toLocaleString()}đ/giờ` : 'Liên hệ'}
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
          Xem tất cả kết quả
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
      <div className="hero-section">
        {/* Background Carousel - 5 hình ảnh môn thể thao */}
        <div 
          className="hero-background-carousel"
          style={{
            backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* SVG Pattern Overlay (tùy chọn) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 dark:opacity-5">
          <svg
            className="absolute w-full h-full text-[#00E536] fill-current"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path d="M0 100 C 20 0 50 0 100 100 Z" />
          </svg>
        </div>

        {/* Hero Content - Tiêu đề ở giữa, search ở dưới */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-6">
              Tìm sân chơi{' '}
              <span className="text-[#00E536] logo-text-shadow">Siêu Tốc</span>
            </h1>
            <p className="text-lg md:text-xl text-white mb-10 max-w-2xl">
              Đặt sân bóng đá, cầu lông, tennis ngay lập tức. Hệ thống tìm kiếm thông minh,
              đặt sân dễ dàng chỉ trong 30 giây.
            </p>
          </div>

          {/* Search Bar with Preview - Ở dưới */}
          <div className="w-full max-w-4xl relative pb-20" ref={searchWrapperRef}>
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
                  placeholder="Tìm tên sân, địa chỉ, khu vực..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={handleSearchInputFocus}
                />
              </div>
              
              {/* Date picker */}
              {/* <div className="w-full md:w-48 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons-outlined text-gray-400 group-focus-within:text-[#00E536]">
                    calendar_today
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-gray-50 dark:bg-green-900/30 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00E536] transition-shadow"
                  placeholder="Chọn ngày"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div> */}
              
              {/* Search button */}
              <button 
                onClick={handleSearch}
                className="w-full md:w-auto bg-[#00E536] hover:bg-green-500 text-white dark:text-green-900 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-neon transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="material-icons-outlined">search</span>
                Tìm sân
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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sân nổi bật
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Những sân được đánh giá cao nhất bởi cộng đồng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TODO: Replace with real data from API */}
            {[1, 2, 3, 4].map((item) => (
              <Link key={item} to={`/fields/${item}`} className="block group">
                <div className="bg-white dark:bg-[#14532d] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-transparent hover:border-green-200 dark:hover:border-green-700">
                  <div className="h-40 bg-gray-200 relative">
                    <img
                      alt="Sân bóng"
                      className="w-full h-full object-cover"
                      src={`https://via.placeholder.com/400x300?text=Field+${item}`}
                    />
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                      3km
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-[#00E536] transition-colors">
                      Sân Bóng {item}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      Cầu Giấy, Hà Nội
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-md">
                        Còn sân
                      </span>
                      <span className="font-bold text-[#00E536] text-sm">200k/h</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/fields">
              <button className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-green-700 text-base font-medium rounded-xl text-gray-700 dark:text-white bg-white dark:bg-[#14532d] hover:bg-gray-50 dark:hover:bg-green-800 transition-colors">
                Xem thêm sân khác
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
              Cách thức hoạt động
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Chỉ 3 bước đơn giản để đặt sân yêu thích của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'search',
                title: 'Tìm kiếm',
                description: 'Tìm sân phù hợp với vị trí và thời gian của bạn',
              },
              {
                icon: 'event_available',
                title: 'Đặt sân',
                description: 'Chọn khung giờ và xác nhận đặt sân trực tuyến',
              },
              {
                icon: 'sports_soccer',
                title: 'Chơi thôi!',
                description: 'Đến sân và tận hưởng trận đấu của bạn',
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
              { number: '500+', label: 'Sân thể thao' },
              { number: '10,000+', label: 'Người dùng' },
              { number: '50+', label: 'Thành phố' },
              { number: '4.8/5', label: 'Đánh giá' },
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

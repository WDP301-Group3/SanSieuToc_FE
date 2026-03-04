/**
 * @fileoverview AppContext - Global Application Context
 * 
 * Context này quản lý tập trung các operations dùng chung trong toàn ứng dụng:
 * - API Handler: Wrapper cho axios với loading/error states
 * - Search Functions: Tìm kiếm fields, categories, etc.
 * - CRUD Operations: Generic CRUD cho các entities
 * - Filter Functions: Xử lý filter logic
 * - Global State: Categories, FieldTypes, Districts (dùng chung nhiều nơi)
 * 
 * @author San Sieu Toc Team
 * @date 2026-02-27
 * @version 1.0.0
 */

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../services/axios';
import { API_CONFIG } from '../config/api.config';
import { sanitizeString } from '../utils/validation';

// Import mock data (sẽ được thay thế khi API ready)
import {
  mockFields,
  mockCategories,
  mockFieldTypes,
  fieldRatings,
  ALL_DISTRICTS,
  PRICE_RANGE
} from '../data/mockData';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default pagination settings
 * @constant
 */
const DEFAULT_PAGINATION = {
  page: 1,
  limit: 9,
  total: 0,
  totalPages: 0
};

/**
 * API request status
 * @constant
 */
const REQUEST_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const AppContext = createContext(null);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

/**
 * AppProvider - Provider component cho AppContext
 * 
 * Cung cấp các functions và states dùng chung cho toàn ứng dụng:
 * - apiRequest: Wrapper cho API calls
 * - searchFields: Tìm kiếm sân
 * - filterData: Filter generic
 * - CRUD operations
 * - Global data: categories, fieldTypes, districts
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const AppProvider = ({ children }) => {
  // ==========================================
  // GLOBAL STATES
  // ==========================================
  
  /**
   * Loading state cho API calls
   * @type {Object} - { [key]: boolean }
   */
  const [loadingStates, setLoadingStates] = useState({});
  
  /**
   * Error state cho API calls
   * @type {Object} - { [key]: string | null }
   */
  const [errorStates, setErrorStates] = useState({});
  
  /**
   * Global data cache
   * @type {Object}
   */
  const [globalData, setGlobalData] = useState({
    categories: mockCategories,      // Danh mục sân (Football, Tennis, etc.)
    fieldTypes: mockFieldTypes,      // Loại sân (Sân 5, 7, 11 người, etc.)
    districts: ALL_DISTRICTS,        // Danh sách quận
    priceRange: PRICE_RANGE,         // Khoảng giá
    fields: [],                      // Cached fields
    lastFetch: null                  // Timestamp lần fetch cuối
  });

  /**
   * Search/Filter state
   * @type {Object}
   */
  const [searchState, setSearchState] = useState({
    query: '',
    filters: {},
    results: [],
    pagination: DEFAULT_PAGINATION
  });

  // ==========================================
  // API HANDLER FUNCTIONS
  // ==========================================

  /**
   * setLoading - Set loading state cho một key cụ thể
   * 
   * @param {string} key - Unique key để identify request
   * @param {boolean} isLoading - Loading state
   */
  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [key]: isLoading }));
  }, []);

  /**
   * setError - Set error state cho một key cụ thể
   * 
   * @param {string} key - Unique key để identify request
   * @param {string|null} error - Error message hoặc null
   */
  const setError = useCallback((key, error) => {
    setErrorStates(prev => ({ ...prev, [key]: error }));
  }, []);

  /**
   * clearError - Clear error state cho một key
   * 
   * @param {string} key - Unique key để identify request
   */
  const clearError = useCallback((key) => {
    setErrorStates(prev => ({ ...prev, [key]: null }));
  }, []);

  /**
   * apiRequest - Generic API request wrapper với loading/error handling
   * 
   * Wrapper này tự động:
   * - Set loading state trước khi call
   * - Clear loading state sau khi hoàn thành
   * - Handle errors và set error state
   * - Return data hoặc throw error
   * 
   * @param {Object} options - Request options
   * @param {string} options.key - Unique key để track loading/error state
   * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE)
   * @param {string} options.url - API endpoint URL
   * @param {Object} [options.data] - Request body (for POST, PUT)
   * @param {Object} [options.params] - Query parameters (for GET)
   * @param {boolean} [options.showError=true] - Có hiển thị error message không
   * @returns {Promise<Object>} - Response data
   * 
   * @example
   * // GET request
   * const fields = await apiRequest({
   *   key: 'fetchFields',
   *   method: 'GET',
   *   url: '/fields',
   *   params: { category: 'Football' }
   * });
   * 
   * @example
   * // POST request
   * const newBooking = await apiRequest({
   *   key: 'createBooking',
   *   method: 'POST',
   *   url: '/bookings',
   *   data: { fieldId: '123', date: '2026-02-28' }
   * });
   */
  const apiRequest = useCallback(async ({
    key,
    method = 'GET',
    url,
    data = null,
    params = null,
    showError = true
  }) => {
    // Set loading state
    setLoading(key, true);
    clearError(key);

    try {
      // Build request config
      const config = {
        method,
        url,
        ...(data && { data }),
        ...(params && { params })
      };

      // Make API call
      const response = await axiosInstance(config);

      // Return response data
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      // Extract error message
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Đã có lỗi xảy ra';

      // Set error state
      if (showError) {
        setError(key, errorMessage);
      }

      // Return error object
      return {
        success: false,
        error: errorMessage,
        status: error.response?.status || 500
      };
    } finally {
      // Clear loading state
      setLoading(key, false);
    }
  }, [setLoading, setError, clearError]);

  // ==========================================
  // SEARCH FUNCTIONS
  // ==========================================

  /**
   * searchFields - Tìm kiếm sân thể thao
   * 
   * Hỗ trợ tìm kiếm theo:
   * - Text (tên sân, địa chỉ, mô tả)
   * - Category (Football, Tennis, etc.)
   * - Field Type (Sân 5, 7, 11 người - chỉ cho Football)
   * - District (Quận)
   * - Price range
   * - Date/Time availability
   * 
   * @param {Object} filters - Filter criteria
   * @param {string} [filters.searchText=''] - Text search query
   * @param {string} [filters.categoryId=''] - Category ID
   * @param {string} [filters.categoryName=''] - Category name
   * @param {string} [filters.fieldTypeId=''] - Field type ID
   * @param {string} [filters.district=''] - District name
   * @param {number} [filters.priceMin] - Minimum price
   * @param {number} [filters.priceMax] - Maximum price
   * @param {string} [filters.date=''] - Date (YYYY-MM-DD)
   * @param {string} [filters.startTime=''] - Start time (HH:mm)
   * @param {string} [filters.endTime=''] - End time (HH:mm)
   * @param {number} [filters.page=1] - Page number
   * @param {number} [filters.limit=9] - Items per page
   * @param {string} [filters.sortBy='name'] - Sort field
   * @returns {Promise<Object>} - { success, data: { fields, pagination } }
   * 
   * @example
   * const result = await searchFields({
   *   searchText: 'sân bóng',
   *   categoryName: 'Football',
   *   district: 'Quận 7',
   *   priceMax: 300000,
   *   page: 1
   * });
   */
  const searchFields = useCallback(async (filters = {}) => {
    const requestKey = 'searchFields';
    setLoading(requestKey, true);
    clearError(requestKey);

    try {
      // Sanitize search text
      const sanitizedFilters = {
        ...filters,
        searchText: filters.searchText ? sanitizeString(filters.searchText) : ''
      };

      // TODO: Replace with actual API call when backend is ready
      // const response = await apiRequest({
      //   key: requestKey,
      //   method: 'GET',
      //   url: API_CONFIG.ENDPOINTS.FIELD.LIST,
      //   params: sanitizedFilters
      // });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Filter mock data
      let fields = [...mockFields];

      // Apply text search
      if (sanitizedFilters.searchText) {
        const searchLower = sanitizedFilters.searchText.toLowerCase();
        fields = fields.filter(field => 
          field.fieldName?.toLowerCase().includes(searchLower) ||
          field.address?.toLowerCase().includes(searchLower) ||
          field.description?.toLowerCase().includes(searchLower)
        );
      }

      // Apply category filter
      if (sanitizedFilters.categoryName) {
        fields = fields.filter(field => 
          field.fieldType?.category?.categoryName === sanitizedFilters.categoryName
        );
      }

      if (sanitizedFilters.categoryId) {
        fields = fields.filter(field => 
          field.fieldType?.category?._id === sanitizedFilters.categoryId
        );
      }

      // Apply field type filter (chỉ cho Football)
      if (sanitizedFilters.fieldTypeId) {
        fields = fields.filter(field => 
          field.fieldType?._id === sanitizedFilters.fieldTypeId
        );
      }

      if (sanitizedFilters.fieldTypeName) {
        fields = fields.filter(field => 
          field.fieldType?.typeName === sanitizedFilters.fieldTypeName
        );
      }

      // Apply district filter
      if (sanitizedFilters.district) {
        fields = fields.filter(field => 
          field.address?.includes(sanitizedFilters.district) ||
          field.district === sanitizedFilters.district
        );
      }

      // Apply price filter
      if (sanitizedFilters.priceMin !== undefined) {
        fields = fields.filter(field => 
          field.hourlyPrice >= sanitizedFilters.priceMin
        );
      }

      if (sanitizedFilters.priceMax !== undefined) {
        fields = fields.filter(field => 
          field.hourlyPrice <= sanitizedFilters.priceMax
        );
      }

      // Apply status filter
      if (sanitizedFilters.status) {
        fields = fields.filter(field => field.status === sanitizedFilters.status);
      }

      // Sort fields
      const sortBy = sanitizedFilters.sortBy || 'name';
      fields = sortFieldsData(fields, sortBy);

      // Paginate
      const page = sanitizedFilters.page || 1;
      const limit = sanitizedFilters.limit || 9;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedFields = fields.slice(startIndex, endIndex);

      // Inject averageRating và totalReviews vào mỗi field từ fieldRatings
      // TODO: API sẽ trả về trực tiếp averageRating trong response
      const fieldsWithRatings = paginatedFields.map(field => ({
        ...field,
        averageRating: fieldRatings[field._id]?.averageRating || 0,
        totalReviews: fieldRatings[field._id]?.totalReviews || 0
      }));

      // Tạo facets từ toàn bộ fields (trước khi paginate) để hiển thị filter options
      // Categories facet - đếm số lượng sân theo từng category
      const categoryCount = {};
      mockFields.forEach(field => {
        const catName = field.fieldType?.category?.categoryName;
        if (catName) {
          categoryCount[catName] = (categoryCount[catName] || 0) + 1;
        }
      });
      const categoriesFacet = Object.entries(categoryCount).map(([name, count]) => ({
        name,
        count
      }));

      // Districts facet - đếm số lượng sân theo từng quận
      const districtCount = {};
      mockFields.forEach(field => {
        const district = field.district;
        if (district) {
          districtCount[district] = (districtCount[district] || 0) + 1;
        }
      });
      const districtsFacet = Object.entries(districtCount).map(([name, count]) => ({
        name,
        count
      }));

      const result = {
        success: true,
        data: {
          fields: fieldsWithRatings,
          pagination: {
            page,
            limit,
            total: fields.length,
            totalPages: Math.ceil(fields.length / limit)
          },
          facets: {
            categories: categoriesFacet,
            districts: districtsFacet,
            priceRange: {
              min: Math.min(...mockFields.map(f => f.hourlyPrice)),
              max: Math.max(...mockFields.map(f => f.hourlyPrice))
            }
          }
        }
      };

      // Update search state
      setSearchState({
        query: sanitizedFilters.searchText || '',
        filters: sanitizedFilters,
        results: paginatedFields,
        pagination: result.data.pagination
      });

      return result;
    } catch (error) {
      const errorMessage = error.message || 'Lỗi tìm kiếm sân';
      setError(requestKey, errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(requestKey, false);
    }
  }, [setLoading, setError, clearError]);

  /**
   * quickSearch - Tìm kiếm nhanh (autocomplete)
   * 
   * Dùng cho search bar ở Header, Home page
   * Trả về top 5 kết quả match với query
   * 
   * @param {string} query - Search query
   * @param {number} [limit=5] - Số kết quả tối đa
   * @returns {Promise<Array>} - Array of matching fields
   * 
   * @example
   * const suggestions = await quickSearch('sân bóng');
   * // Returns top 5 fields matching 'sân bóng'
   */
  const quickSearch = useCallback(async (query, limit = 5) => {
    const requestKey = 'quickSearch';
    
    if (!query || query.length < 2) {
      return [];
    }

    setLoading(requestKey, true);
    
    try {
      const sanitizedQuery = sanitizeString(query).toLowerCase();

      // TODO: Replace with API call
      // const response = await apiRequest({
      //   key: 'quickSearch',
      //   method: 'GET',
      //   url: '/fields/quick-search',
      //   params: { q: sanitizedQuery, limit }
      // });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      // Filter mock data for quick search
      const matches = mockFields
        .filter(field => 
          field.fieldName?.toLowerCase().includes(sanitizedQuery) ||
          field.address?.toLowerCase().includes(sanitizedQuery)
        )
        .slice(0, limit)
        .map(field => ({
          id: field._id,
          name: field.fieldName,
          address: field.address,
          category: field.fieldType?.category?.categoryName,
          price: field.hourlyPrice,
          imageUrl: field.image?.[0] || null
        }));

      return matches;
    } catch (error) {
      console.error('Quick search error:', error);
      return [];
    } finally {
      setLoading(requestKey, false);
    }
  }, [setLoading]);

  // ==========================================
  // FILTER FUNCTIONS
  // ==========================================

  /**
   * filterData - Generic filter function
   * 
   * Filter một array data theo các criteria
   * Hỗ trợ multiple filter conditions
   * 
   * @param {Array} data - Data array cần filter
   * @param {Object} filters - Filter criteria object
   * @returns {Array} - Filtered data
   * 
   * @example
   * const filtered = filterData(fields, {
   *   status: 'Available',
   *   'fieldType.category.categoryName': 'Football'
   * });
   */
  const filterData = useCallback((data, filters) => {
    if (!Array.isArray(data) || !filters || Object.keys(filters).length === 0) {
      return data;
    }

    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        // Skip empty/null filter values
        if (value === '' || value === null || value === undefined) {
          return true;
        }

        // Handle nested properties (e.g., 'fieldType.category.categoryName')
        const itemValue = getNestedValue(item, key);

        // Handle array values (e.g., utilities contains 'WiFi')
        if (Array.isArray(itemValue)) {
          return itemValue.includes(value);
        }

        // Handle range filters (priceMin, priceMax)
        if (key.endsWith('Min')) {
          const actualKey = key.replace('Min', '');
          const actualValue = getNestedValue(item, actualKey);
          return actualValue >= value;
        }

        if (key.endsWith('Max')) {
          const actualKey = key.replace('Max', '');
          const actualValue = getNestedValue(item, actualKey);
          return actualValue <= value;
        }

        // Default: exact match or includes (for strings)
        if (typeof itemValue === 'string' && typeof value === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }

        return itemValue === value;
      });
    });
  }, []);

  /**
   * getFieldTypesByCategory - Lấy field types theo category
   * 
   * Dùng để hiển thị filter field type chỉ khi chọn Football
   * 
   * @param {string} categoryName - Tên category (e.g., 'Football')
   * @returns {Array} - Array of field types
   * 
   * @example
   * const footballTypes = getFieldTypesByCategory('Football');
   * // Returns [{ typeName: 'Sân 5 người' }, { typeName: 'Sân 7 người' }, ...]
   */
  const getFieldTypesByCategory = useCallback((categoryName) => {
    if (!categoryName) return [];
    
    const category = globalData.categories.find(
      cat => cat.categoryName === categoryName
    );

    if (!category) return [];

    return globalData.fieldTypes.filter(
      type => type.categoryID === category._id
    );
  }, [globalData.categories, globalData.fieldTypes]);

  // ==========================================
  // CRUD OPERATIONS
  // ==========================================

  /**
   * fetchOne - Lấy một item theo ID
   * 
   * @param {string} entity - Entity type (field, booking, customer, etc.)
   * @param {string} id - Item ID
   * @returns {Promise<Object>} - Item data
   * 
   * @example
   * const field = await fetchOne('field', '507f1f77bcf86cd799439011');
   */
  const fetchOne = useCallback(async (entity, id) => {
    const endpoints = {
      field: API_CONFIG.ENDPOINTS.FIELD.DETAIL,
      booking: API_CONFIG.ENDPOINTS.BOOKING.DETAIL,
      customer: API_CONFIG.ENDPOINTS.CUSTOMER.PROFILE
    };

    const urlBuilder = endpoints[entity];
    if (!urlBuilder) {
      return { success: false, error: `Unknown entity: ${entity}` };
    }

    const url = typeof urlBuilder === 'function' ? urlBuilder(id) : urlBuilder;

    return apiRequest({
      key: `fetch_${entity}_${id}`,
      method: 'GET',
      url
    });
  }, [apiRequest]);

  /**
   * fetchList - Lấy danh sách items
   * 
   * @param {string} entity - Entity type (fields, bookings, customers, etc.)
   * @param {Object} [params] - Query parameters
   * @returns {Promise<Object>} - { success, data: { items, pagination } }
   * 
   * @example
   * const fields = await fetchList('fields', { page: 1, limit: 10 });
   */
  const fetchList = useCallback(async (entity, params = {}) => {
    const endpoints = {
      fields: API_CONFIG.ENDPOINTS.FIELD.LIST,
      bookings: API_CONFIG.ENDPOINTS.BOOKING.LIST
    };

    const url = endpoints[entity];
    if (!url) {
      return { success: false, error: `Unknown entity: ${entity}` };
    }

    return apiRequest({
      key: `fetchList_${entity}`,
      method: 'GET',
      url,
      params
    });
  }, [apiRequest]);

  /**
   * createOne - Tạo mới một item
   * 
   * @param {string} entity - Entity type
   * @param {Object} data - Item data
   * @returns {Promise<Object>} - Created item
   * 
   * @example
   * const newBooking = await createOne('booking', {
   *   fieldId: '123',
   *   date: '2026-02-28',
   *   slots: ['08:00', '09:00']
   * });
   */
  const createOne = useCallback(async (entity, data) => {
    const endpoints = {
      field: API_CONFIG.ENDPOINTS.FIELD.CREATE,
      booking: API_CONFIG.ENDPOINTS.BOOKING.CREATE,
      feedback: API_CONFIG.ENDPOINTS.FEEDBACK.CREATE
    };

    const url = endpoints[entity];
    if (!url) {
      return { success: false, error: `Unknown entity: ${entity}` };
    }

    return apiRequest({
      key: `create_${entity}`,
      method: 'POST',
      url,
      data
    });
  }, [apiRequest]);

  /**
   * updateOne - Cập nhật một item
   * 
   * @param {string} entity - Entity type
   * @param {string} id - Item ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} - Updated item
   * 
   * @example
   * const updated = await updateOne('field', '123', { hourlyPrice: 250000 });
   */
  const updateOne = useCallback(async (entity, id, data) => {
    const endpoints = {
      field: API_CONFIG.ENDPOINTS.FIELD.UPDATE,
      customer: () => API_CONFIG.ENDPOINTS.CUSTOMER.UPDATE_PROFILE
    };

    const urlBuilder = endpoints[entity];
    if (!urlBuilder) {
      return { success: false, error: `Unknown entity: ${entity}` };
    }

    const url = typeof urlBuilder === 'function' ? urlBuilder(id) : urlBuilder;

    return apiRequest({
      key: `update_${entity}_${id}`,
      method: 'PUT',
      url,
      data
    });
  }, [apiRequest]);

  /**
   * deleteOne - Xóa một item
   * 
   * @param {string} entity - Entity type
   * @param {string} id - Item ID
   * @returns {Promise<Object>} - Delete result
   * 
   * @example
   * const result = await deleteOne('field', '123');
   */
  const deleteOne = useCallback(async (entity, id) => {
    const endpoints = {
      field: API_CONFIG.ENDPOINTS.FIELD.DELETE,
      booking: API_CONFIG.ENDPOINTS.BOOKING.CANCEL
    };

    const urlBuilder = endpoints[entity];
    if (!urlBuilder) {
      return { success: false, error: `Unknown entity: ${entity}` };
    }

    const url = typeof urlBuilder === 'function' ? urlBuilder(id) : urlBuilder;

    return apiRequest({
      key: `delete_${entity}_${id}`,
      method: 'DELETE',
      url
    });
  }, [apiRequest]);

  // ==========================================
  // DATA FETCHING FUNCTIONS
  // ==========================================

  /**
   * fetchGlobalData - Fetch và cache global data (categories, field types, etc.)
   * 
   * Gọi function này khi app khởi động để cache data dùng chung
   * 
   * @param {boolean} [force=false] - Force refresh even if cached
   * @returns {Promise<Object>} - Global data
   */
  const fetchGlobalData = useCallback(async (force = false) => {
    // Check cache (5 minutes)
    const CACHE_DURATION = 5 * 60 * 1000;
    const now = Date.now();
    
    if (!force && globalData.lastFetch && (now - globalData.lastFetch) < CACHE_DURATION) {
      return { success: true, data: globalData };
    }

    // TODO: Replace with actual API calls
    // const [categoriesRes, fieldTypesRes] = await Promise.all([
    //   apiRequest({ key: 'fetchCategories', method: 'GET', url: '/categories' }),
    //   apiRequest({ key: 'fetchFieldTypes', method: 'GET', url: '/field-types' })
    // ]);

    // For now, use mock data
    setGlobalData(prev => ({
      ...prev,
      categories: mockCategories,
      fieldTypes: mockFieldTypes,
      districts: ALL_DISTRICTS,
      priceRange: PRICE_RANGE,
      lastFetch: now
    }));

    return { success: true, data: globalData };
  }, [globalData]);

  /**
   * refreshFields - Refresh fields data
   * 
   * @returns {Promise<Object>} - Fresh fields data
   */
  const refreshFields = useCallback(async () => {
    const result = await searchFields({});
    if (result.success) {
      setGlobalData(prev => ({
        ...prev,
        fields: result.data.fields
      }));
    }
    return result;
  }, [searchFields]);

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  /**
   * isLoading - Check loading state cho một key
   * 
   * @param {string} key - Request key
   * @returns {boolean} - Loading state
   */
  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  /**
   * getError - Get error message cho một key
   * 
   * @param {string} key - Request key
   * @returns {string|null} - Error message
   */
  const getError = useCallback((key) => {
    return errorStates[key] || null;
  }, [errorStates]);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const contextValue = useMemo(() => ({
    // States
    loadingStates,
    errorStates,
    globalData,
    searchState,

    // Loading/Error helpers
    isLoading,
    getError,
    clearError,

    // API Handler
    apiRequest,

    // Search Functions
    searchFields,
    quickSearch,

    // Filter Functions
    filterData,
    getFieldTypesByCategory,

    // CRUD Operations
    fetchOne,
    fetchList,
    createOne,
    updateOne,
    deleteOne,

    // Data Fetching
    fetchGlobalData,
    refreshFields,

    // Constants (for components)
    REQUEST_STATUS
  }), [
    loadingStates,
    errorStates,
    globalData,
    searchState,
    isLoading,
    getError,
    clearError,
    apiRequest,
    searchFields,
    quickSearch,
    filterData,
    getFieldTypesByCategory,
    fetchOne,
    fetchList,
    createOne,
    updateOne,
    deleteOne,
    fetchGlobalData,
    refreshFields
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * useApp - Custom hook để sử dụng AppContext
 * 
 * @returns {Object} - AppContext value
 * @throws {Error} - Nếu sử dụng ngoài AppProvider
 * 
 * @example
 * const { searchFields, isLoading, globalData } = useApp();
 * 
 * // Search fields
 * const handleSearch = async () => {
 *   const result = await searchFields({ categoryName: 'Football' });
 *   console.log(result.data.fields);
 * };
 * 
 * // Check loading state
 * if (isLoading('searchFields')) {
 *   return <LoadingSpinner />;
 * }
 */
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

// ============================================================================
// UTILITY FUNCTIONS (Private)
// ============================================================================

/**
 * getNestedValue - Lấy giá trị nested từ object
 * 
 * @param {Object} obj - Object source
 * @param {string} path - Dot notation path (e.g., 'fieldType.category.categoryName')
 * @returns {*} - Value at path
 * @private
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

/**
 * sortFieldsData - Sort fields array
 * 
 * @param {Array} fields - Fields array
 * @param {string} sortBy - Sort criteria
 * @returns {Array} - Sorted fields
 * @private
 */
const sortFieldsData = (fields, sortBy) => {
  const sortedFields = [...fields];

  switch (sortBy) {
    case 'name':
    case 'name_asc':
      return sortedFields.sort((a, b) => 
        (a.fieldName || '').localeCompare(b.fieldName || '', 'vi')
      );
    
    case 'name_desc':
      return sortedFields.sort((a, b) => 
        (b.fieldName || '').localeCompare(a.fieldName || '', 'vi')
      );
    
    case 'price_asc':
      return sortedFields.sort((a, b) => 
        (a.hourlyPrice || 0) - (b.hourlyPrice || 0)
      );
    
    case 'price_desc':
      return sortedFields.sort((a, b) => 
        (b.hourlyPrice || 0) - (a.hourlyPrice || 0)
      );
    
    case 'rating':
    case 'rating_desc':
      return sortedFields.sort((a, b) => 
        (b.averageRating || 0) - (a.averageRating || 0)
      );
    
    case 'newest':
      return sortedFields.sort((a, b) => 
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    
    default:
      return sortedFields;
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default AppContext;

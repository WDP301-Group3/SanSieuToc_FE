/**
 * @fileoverview Field Service - API Layer for Sports Field Operations
 *
 * Calls real backend endpoints:
 *   GET /api/field/list                                      → searchFields
 *   GET /api/field/categories                                → getCategoriesAndTypes
 *   GET /api/field/types                                     → getCategoriesAndTypes
 *   GET /api/field/types/category/:catId                     → getFieldTypesByCategory
 *   GET /api/field/:id                                       → getFieldById
 *   GET /api/customer/fields/:id/availability?date=YYYY-MM-DD → getFieldAvailability
 *
 * All functions return  { success: boolean, data?: any, error?: string }
 *
 * @author San Sieu Toc Team
 */

import axiosInstance from './axios';
import { API_CONFIG } from '../config/api.config';

const { ENDPOINTS } = API_CONFIG;

// ============================================================================
// PUBLIC FIELD FUNCTIONS
// ============================================================================

/**
 * Fetch all fields from BE, then apply client-side filter / sort / paginate.
 *
 * BE returns { success, data: { fields: [...] } }
 * Each field has populated fieldTypeID (with categoryID) and managerID.
 *
 * @param {Object} filters
 * @param {string}  [filters.searchText]
 * @param {string}  [filters.categoryName]
 * @param {string}  [filters.categoryId]
 * @param {string}  [filters.fieldTypeName]
 * @param {string}  [filters.fieldTypeId]
 * @param {string}  [filters.district]
 * @param {number}  [filters.priceMin]
 * @param {number}  [filters.priceMax]
 * @param {string}  [filters.status]        - 'all' (default), 'Available', 'Maintenance'
 * @param {string}  [filters.sortBy]        - 'name' | 'price-asc' | 'price-desc' | 'newest'
 * @param {number}  [filters.page]          - default 1
 * @param {number}  [filters.limit]         - default 9
 * @returns {Promise<{success:boolean, data?:Object, error?:string}>}
 */
export const searchFields = async (filters = {}) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.FIELDS.LIST);
    // BE: { success: true, data: { fields: [...] } }
    const allFields = response.data?.data?.fields || response.data?.fields || [];

    // Normalise each field so the rest of the UI keeps the same property shape
    const normalised = allFields.map(normaliseField);

    // ---- client-side filtering ----
    let result = normalised;

    // Text search — fuzzy / partial match across multiple fields
    if (filters.searchText) {
      const q = filters.searchText.toLowerCase().trim();
      // Build token list so "san tennis" matches fields containing both words
      const tokens = q.split(/\s+/).filter(Boolean);
      result = result.filter(f => {
        // All searchable strings for this field
        const haystack = [
          f.fieldName,
          f.address,
          f.description,
          f.fieldType?.category?.categoryName,
          f.fieldType?.typeName,
          f.district,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        // Every token must appear somewhere in the haystack
        return tokens.every(token => haystack.includes(token));
      });
    }

    // Category by name
    if (filters.categoryName) {
      result = result.filter(f =>
        f.fieldType?.category?.categoryName === filters.categoryName
      );
    }

    // Category by id
    if (filters.categoryId) {
      result = result.filter(f =>
        f.fieldType?.category?._id === filters.categoryId ||
        f.fieldType?.categoryID?._id === filters.categoryId ||
        f.fieldType?.categoryID === filters.categoryId
      );
    }

    // Field type by name
    if (filters.fieldTypeName) {
      result = result.filter(f => f.fieldType?.typeName === filters.fieldTypeName);
    }

    // Field type by id
    if (filters.fieldTypeId) {
      result = result.filter(f =>
        f.fieldType?._id === filters.fieldTypeId ||
        f.fieldTypeID?._id === filters.fieldTypeId ||
        f.fieldTypeID === filters.fieldTypeId
      );
    }

    // District / address
    if (filters.district) {
      result = result.filter(f =>
        f.address?.includes(filters.district) ||
        f.district === filters.district
      );
    }

    // Price range
    if (filters.priceMin !== undefined) {
      result = result.filter(f => f.hourlyPrice >= filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
      result = result.filter(f => f.hourlyPrice <= filters.priceMax);
    }

    // Status (default: show all statuses)
    const statusFilter = filters.status || 'all';
    if (statusFilter !== 'all') {
      result = result.filter(f => f.status === statusFilter);
    }

    // ---- facets (computed from ALL normalised fields, NOT filtered result) ----
    // This ensures all categories always appear in the sidebar even when one is selected
    const categoryCount = {};
    normalised.forEach(f => {
      const catName = f.fieldType?.category?.categoryName;
      if (catName) categoryCount[catName] = (categoryCount[catName] || 0) + 1;
    });

    const districtCount = {};
    normalised.forEach(f => {
      const d = f.district || extractDistrict(f.address);
      if (d) districtCount[d] = (districtCount[d] || 0) + 1;
    });

    // ---- sort ----
    result = sortFieldsArr(result, filters.sortBy || 'name');

    // ---- paginate ----
    const page = filters.page || 1;
    const limit = filters.limit || 9;
    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    const prices = normalised.map(f => f.hourlyPrice).filter(Boolean);

    return {
      success: true,
      data: {
        fields: paginated,
        pagination: { page, limit, total, totalPages },
        facets: {
          categories: Object.entries(categoryCount).map(([name, count]) => ({ name, count })),
          districts: Object.entries(districtCount).map(([name, count]) => ({ name, count })),
          priceRange: {
            min: prices.length ? Math.min(...prices) : 0,
            max: prices.length ? Math.max(...prices) : 1000000
          }
        }
      }
    };
  } catch (error) {
    console.error('searchFields error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Lỗi tìm kiếm sân'
    };
  }
};

/**
 * Get a single field by ID.
 * Uses the public GET /api/field/:id endpoint (status must be 'Available').
 *
 * @param {string} fieldId
 * @param {Object} [options]
 * @param {string} [options.date] - YYYY-MM-DD; also fetches availability if provided
 * @returns {Promise<{success:boolean, data?:Object, error?:string}>}
 */
export const getFieldById = async (fieldId, options = {}) => {
  try {
    if (!fieldId) {
      return { success: false, data: null, error: 'Field ID is required' };
    }

    const response = await axiosInstance.get(ENDPOINTS.FIELDS.DETAIL(fieldId));
    // BE getFieldDetail returns a flat object (not nested in data.data always)
    const raw = response.data?.data || response.data;
    const field = normaliseFieldDetail(raw);

    let availability = null;
    if (options.date) {
      const avRes = await getFieldAvailability(fieldId, options.date);
      availability = avRes.success ? avRes.data : null;
    }

    return { success: true, data: { field, availability } };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, data: null, error: 'Không tìm thấy sân' };
    }
    console.error('getFieldById error:', error);
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || error.message || 'Lỗi tải thông tin sân'
    };
  }
};

/**
 * Get field availability for a date.
 * GET /api/customer/fields/:fieldId/availability?date=YYYY-MM-DD
 *
 * @param {string} fieldId
 * @param {string} date - YYYY-MM-DD
 * @returns {Promise<{success:boolean, data?:Object, error?:string}>}
 */
export const getFieldAvailability = async (fieldId, date) => {
  try {
    if (!fieldId || !date) {
      return { success: false, data: null, error: 'Field ID and date are required' };
    }

    const response = await axiosInstance.get(
      ENDPOINTS.BOOKINGS.AVAILABILITY(fieldId),
      { params: { date } }
    );

    const raw = response.data?.data || response.data;
    return { success: true, data: raw };
  } catch (error) {
    console.error('getFieldAvailability error:', error);
    return {
      success: false,
      data: null,
      error: error.response?.data?.message || error.message || 'Lỗi tải lịch sân'
    };
  }
};

/**
 * Fetch categories and field types in parallel (for filter UI and AppContext global data).
 *
 * @returns {Promise<{success:boolean, data?:{categories:Array, fieldTypes:Array}, error?:string}>}
 */
export const getCategoriesAndTypes = async () => {
  try {
    const [catRes, typeRes] = await Promise.all([
      axiosInstance.get(ENDPOINTS.FIELDS.CATEGORIES),
      axiosInstance.get(ENDPOINTS.FIELDS.TYPES)
    ]);

    const categories = catRes.data?.data?.categories || catRes.data?.categories || [];
    const fieldTypes = typeRes.data?.data?.fieldTypes || typeRes.data?.fieldTypes || [];

    return { success: true, data: { categories, fieldTypes } };
  } catch (error) {
    console.error('getCategoriesAndTypes error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Lỗi tải danh mục'
    };
  }
};

/**
 * Fetch field types for a specific category.
 * GET /api/field/types/category/:categoryId
 *
 * @param {string} categoryId
 * @returns {Promise<{success:boolean, data?:{category:Object, fieldTypes:Array}, error?:string}>}
 */
export const getFieldTypesByCategory = async (categoryId) => {
  try {
    if (!categoryId) return { success: false, error: 'Category ID is required' };

    const response = await axiosInstance.get(ENDPOINTS.FIELDS.TYPES_BY_CATEGORY(categoryId));
    const data = response.data?.data || response.data;
    return { success: true, data };
  } catch (error) {
    console.error('getFieldTypesByCategory error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Lỗi tải loại sân'
    };
  }
};

/**
 * Quick search — top N fields matching a text query.
 * Fetches all fields and filters client-side.
 *
 * @param {string} query
 * @param {number} [limit=5]
 * @returns {Promise<Array>}
 */
export const quickSearch = async (query, limit = 5) => {
  if (!query || query.trim().length < 2) return [];
  try {
    const result = await searchFields({ searchText: query.trim(), status: 'all', page: 1, limit: 100 });
    if (!result.success) return [];
    return result.data.fields.slice(0, limit).map(f => ({
      id: f._id,
      name: f.fieldName,
      address: f.address,
      category: f.fieldType?.category?.categoryName || f.fieldType?.typeName,
      price: f.hourlyPrice,
      imageUrl: (f.images || f.image)?.[0] || null
    }));
  } catch {
    return [];
  }
};

// ============================================================================
// NORMALISATION HELPERS (private)
// ============================================================================

/**
 * Normalise a field record from GET /api/field/list.
 * BE populates fieldTypeID (with nested categoryID) and managerID.
 */
function normaliseField(f) {
  if (!f) return f;

  const ftRaw = f.fieldTypeID;
  const catRaw = ftRaw?.categoryID;

  const fieldType = ftRaw
    ? {
        _id: ftRaw._id,
        typeName: ftRaw.typeName,
        categoryID: catRaw?._id ?? catRaw,
        category: catRaw
          ? { _id: catRaw._id, categoryName: catRaw.categoryName }
          : undefined
      }
    : f.fieldType; // already normalised or from fallback

  const manager = f.managerID
    ? { _id: f.managerID._id, name: f.managerID.name, phone: f.managerID.phone, image: f.managerID.image }
    : f.manager;

  const district = f.district || extractDistrict(f.address);

  return {
    ...f,
    fieldType,
    manager,
    district,
    images: f.images || f.image || [],
    image: f.images || f.image || []
  };
}

/**
 * Normalise a field record from GET /api/field/:id (getFieldDetail).
 * BE returns { fieldType, category, manager, images } at top level.
 */
function normaliseFieldDetail(f) {
  if (!f) return f;
  return {
    ...f,
    // Nest category inside fieldType for UI consistency
    fieldType: f.fieldType
      ? { ...f.fieldType, category: f.category || f.fieldType?.category }
      : f.fieldType,
    images: f.images || f.image || [],
    image: f.images || f.image || []
  };
}

/**
 * Try to extract a district string from an address for filter facets.
 */
function extractDistrict(address) {
  if (!address) return null;
  const match = address.match(/(Quận\s+[\w\d]+|Q\.\s*[\w\d]+|Huyện\s+[\w\s]+|TP\.[\w\s]+)/i);
  return match ? match[0].trim() : null;
}

/**
 * Sort an array of fields.
 */
function sortFieldsArr(fields, sortBy) {
  const arr = [...fields];
  switch (sortBy) {
    case 'name':
      return arr.sort((a, b) => (a.fieldName || '').localeCompare(b.fieldName || '', 'vi'));
    case 'price-asc':
      return arr.sort((a, b) => (a.hourlyPrice || 0) - (b.hourlyPrice || 0));
    case 'price-desc':
      return arr.sort((a, b) => (b.hourlyPrice || 0) - (a.hourlyPrice || 0));
    case 'newest':
      return arr.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    default:
      return arr;
  }
}

// ============================================================================
// DEFAULT EXPORT (backward compat)
// ============================================================================

export default {
  searchFields,
  getFieldById,
  getFieldAvailability,
  getCategoriesAndTypes,
  getFieldTypesByCategory,
  quickSearch
};

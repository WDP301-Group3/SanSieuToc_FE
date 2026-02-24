/**
 * @fileoverview Field Service - API Layer for Sports Field Operations
 * 
 * This service handles all field-related API calls:
 * - Search and filter fields
 * - Get field details
 * - Check field availability
 * 
 * Features:
 * - Frontend validation before API calls (Defense in Depth)
 * - Input sanitization to prevent XSS/injection attacks
 * - Business rule validation
 * 
 * Currently using mock data for development
 * TODO: Replace with actual API calls when backend is ready
 * 
 * @author San Sieu Toc Team
 * @date 2026-02-24
 */

import {
  mockFields,
  mockBookingDetails,
  mockCategories,
  mockFieldTypes,
  ALL_UTILITIES,
  ALL_DISTRICTS,
  PRICE_RANGE,
  FIELD_STATUS,
  BOOKING_STATUS
} from '../data/mockData';

// Import validation utilities
import { validateSearchFilters } from '../utils/validation';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Items per page for pagination
 * @constant {number}
 */
const ITEMS_PER_PAGE = 9;

/**
 * API base URL (for future implementation)
 * @constant {string}
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Search and filter sports fields
 * 
 * Supports 6 main filter criteria:
 * - Text search (name, address, description)
 * - Category filter (Football, Tennis, Badminton, Basketball, Volleyball)
 * - Field type filter (only for Football: Sân 5, 7, 11 người)
 * - Location filter (district)
 * - Price range filter
 * - Date/time availability filter
 * 
 * Note: Utilities displayed on cards but NOT filterable (reduced complexity)
 * Note: Field type filter only shown when category === 'Football'
 * 
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.searchText=''] - Text search query
 * @param {string} [filters.categoryName=''] - Category name
 * @param {string} [filters.fieldTypeName=''] - Field type name (only for Football)
 * @param {string} [filters.district=''] - District name
 * @param {number} [filters.priceMin=0] - Minimum price
 * @param {number} [filters.priceMax=1000000] - Maximum price
 * @param {string} [filters.date=''] - Date in YYYY-MM-DD format
 * @param {string} [filters.startTime=''] - Start time in HH:mm format
 * @param {string} [filters.endTime=''] - End time in HH:mm format
 * @param {string} [filters.status='Available'] - Field status
 * @param {boolean} [filters.onlyAvailable=true] - Show only available fields
 * @param {string} [filters.sortBy='name'] - Sort criteria
 * @param {number} [filters.page=1] - Page number
 * @param {number} [filters.limit=9] - Items per page
 * @returns {Promise<{success: boolean, data: Object, error?: string}>}
 * 
 * @example
 * // Search for Football fields in Quận 7
 * const result = await searchFields({
 *   categoryName: 'Football',
 *   district: 'Quận 7',
 *   priceMax: 300000
 * });
 */
export const searchFields = async (filters = {}) => {
  try {
    // ===== VALIDATION LAYER (Defense in Depth) =====
    // Validate and sanitize input before processing
    const validation = validateSearchFilters(filters);
    
    if (!validation.valid) {
      console.warn('⚠️ Validation failed:', validation.errors);
      return {
        success: false,
        error: Object.values(validation.errors)[0], // Return first error
        validationErrors: validation.errors
      };
    }
    
    // Use sanitized filters
    const sanitizedFilters = validation.sanitized;
    
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/fields/search`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(sanitizedFilters)
    // });
    // const data = await response.json();
    // return data;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get all fields
    let fields = [...mockFields];

    // Apply filters (using sanitized data)
    fields = applyFilters(fields, filters);

    // Apply sorting
    fields = sortFields(fields, filters.sortBy || 'name');

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || ITEMS_PER_PAGE;
    const { items, totalPages, totalItems } = paginateFields(fields, page, limit);

    // Return API-like response
    return {
      success: true,
      data: {
        fields: items,
        pagination: {
          page,
          limit,
          total: totalItems,
          totalPages
        },
        facets: {
          categories: getCategoryCounts(mockFields),
          districts: getDistrictCounts(mockFields),
          priceRange: PRICE_RANGE
        }
      }
    };
  } catch (error) {
    console.error('Error searching fields:', error);
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to search fields'
    };
  }
};

/**
 * Get field details by ID
 * 
 * Returns complete field information including:
 * - Field details
 * - Manager information
 * - Field type and category
 * - Availability for selected date (if provided)
 * 
 * @param {string} fieldId - Field ID
 * @param {Object} [options={}] - Additional options
 * @param {string} [options.date] - Date to check availability (YYYY-MM-DD)
 * @returns {Promise<{success: boolean, data: Object, error?: string}>}
 * 
 * @example
 * // Get field with availability for a specific date
 * const result = await getFieldById('6984ade0031fcdd6b5e78715', {
 *   date: '2026-02-24'
 * });
 */
export const getFieldById = async (fieldId, options = {}) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/fields/${fieldId}`);
    // const data = await response.json();
    // return data;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Find field
    const field = mockFields.find(f => f._id === fieldId);

    if (!field) {
      return {
        success: false,
        data: null,
        error: 'Field not found'
      };
    }

    // Get availability if date provided
    let availability = null;
    if (options.date) {
      availability = await getFieldAvailability(fieldId, options.date);
    }

    return {
      success: true,
      data: {
        field,
        availability: availability?.data || null
      }
    };
  } catch (error) {
    console.error('Error getting field details:', error);
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to get field details'
    };
  }
};

/**
 * Get field availability for a specific date
 * 
 * Returns all time slots with availability status
 * Checks against bookingdetails to determine occupied slots
 * 
 * @param {string} fieldId - Field ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<{success: boolean, data: Object, error?: string}>}
 * 
 * @example
 * // Check availability for tomorrow
 * const result = await getFieldAvailability('6984ade0031fcdd6b5e78715', '2026-02-25');
 */
export const getFieldAvailability = async (fieldId, date) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/fields/${fieldId}/availability?date=${date}`);
    // const data = await response.json();
    // return data;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));

    // Find field
    const field = mockFields.find(f => f._id === fieldId);

    if (!field) {
      return {
        success: false,
        data: null,
        error: 'Field not found'
      };
    }

    // Generate time slots for the field
    const slots = generateTimeSlots(field, date);

    return {
      success: true,
      data: {
        fieldId,
        date,
        slots,
        field: {
          _id: field._id,
          fieldName: field.fieldName,
          hourlyPrice: field.hourlyPrice,
          slotDuration: field.slotDuration
        }
      }
    };
  } catch (error) {
    console.error('Error getting field availability:', error);
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to get field availability'
    };
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Apply all filters to fields array
 * 
 * @private
 * @param {Array} fields - Array of field objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered fields
 */
const applyFilters = (fields, filters) => {
  return fields.filter(field => {
    // 1. Text search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        field.fieldName.toLowerCase().includes(query) ||
        field.address.toLowerCase().includes(query) ||
        field.description.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // 2. Category filter
    if (filters.categoryName) {
      if (field.fieldType.category.categoryName !== filters.categoryName) {
        return false;
      }
    }

    // 3. Field type filter (only meaningful for Football)
    if (filters.fieldTypeName) {
      if (field.fieldType.typeName !== filters.fieldTypeName) {
        return false;
      }
    }

    // 4. District filter
    if (filters.district) {
      if (field.district !== filters.district) {
        return false;
      }
    }

    // 5. Price range filter
    const priceMin = filters.priceMin !== undefined ? filters.priceMin : 0;
    const priceMax = filters.priceMax !== undefined ? filters.priceMax : Infinity;
    
    if (field.hourlyPrice < priceMin || field.hourlyPrice > priceMax) {
      return false;
    }

    // 6. Status filter
    if (filters.status && filters.status !== 'all') {
      if (field.status !== filters.status) {
        return false;
      }
    }

    // 7. Utilities filter - REMOVED (Simplified UX)
    // Utilities are displayed on cards but not filterable
    // Rationale: Reduce filter complexity, most users care about category/price/location

    // 8. Availability filter (if date and time provided)
    if (filters.onlyAvailable && filters.date && filters.startTime && filters.endTime) {
      // Check if field has any conflicting bookings
      const isAvailable = checkFieldAvailability(
        field._id,
        filters.date,
        filters.startTime,
        filters.endTime
      );
      if (!isAvailable) return false;
    }

    // 9. Status must be Available if onlyAvailable is true (and no date filter)
    if (filters.onlyAvailable && !filters.date && field.status !== FIELD_STATUS.AVAILABLE) {
      return false;
    }

    return true;
  });
};

/**
 * Sort fields by specified criteria
 * 
 * @private
 * @param {Array} fields - Array of field objects
 * @param {string} sortBy - Sort criteria ('name', 'price-asc', 'price-desc', 'newest')
 * @returns {Array} Sorted fields
 */
const sortFields = (fields, sortBy) => {
  const sorted = [...fields];

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) =>
        a.fieldName.localeCompare(b.fieldName, 'vi')
      );

    case 'price-asc':
      return sorted.sort((a, b) => a.hourlyPrice - b.hourlyPrice);

    case 'price-desc':
      return sorted.sort((a, b) => b.hourlyPrice - a.hourlyPrice);

    case 'newest':
      return sorted.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

    default:
      return sorted;
  }
};

/**
 * Paginate fields array
 * 
 * @private
 * @param {Array} fields - Array of field objects
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {{items: Array, totalPages: number, totalItems: number}}
 */
const paginateFields = (fields, page, limit) => {
  const totalItems = fields.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    items: fields.slice(startIndex, endIndex),
    totalPages,
    totalItems
  };
};

/**
 * Check if field is available for specific date and time
 * 
 * Kiểm tra xem sân có bị đặt trong khoảng thời gian yêu cầu không
 * 
 * @private
 * @param {string} fieldId - Field ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} startTime - Start time in HH:mm format
 * @param {string} endTime - End time in HH:mm format
 * @returns {boolean} True if available, false if booked
 */
const checkFieldAvailability = (fieldId, date, startTime, endTime) => {
  // Convert requested time to Date objects for comparison
  const requestStart = new Date(`${date}T${startTime}:00.000Z`);
  const requestEnd = new Date(`${date}T${endTime}:00.000Z`);

  // Find all active bookings for this field
  const activeBookings = mockBookingDetails.filter(
    booking => 
      booking.fieldID === fieldId &&
      booking.status === BOOKING_STATUS.ACTIVE
  );

  // Check if any booking conflicts with requested time
  for (const booking of activeBookings) {
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);

    // Check for time overlap
    // Overlap occurs if: (requestStart < bookingEnd) AND (requestEnd > bookingStart)
    const hasOverlap = requestStart < bookingEnd && requestEnd > bookingStart;

    if (hasOverlap) {
      return false; // Not available
    }
  }

  return true; // Available
};

/**
 * Generate time slots for a field on a specific date
 * 
 * Tạo danh sách các khung giờ có thể đặt cho sân
 * dựa trên giờ mở cửa, đóng cửa và thời lượng mỗi slot
 * 
 * @private
 * @param {Object} field - Field object
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array<{startTime: string, endTime: string, available: boolean, price: number}>}
 */
const generateTimeSlots = (field, date) => {
  const slots = [];
  
  // Parse opening and closing times
  const [openHour, openMinute] = field.openingTime.split(':').map(Number);
  const [closeHour, closeMinute] = field.closingTime.split(':').map(Number);
  
  // Convert to minutes since midnight
  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;
  const slotDuration = field.slotDuration;

  // Generate slots
  for (let minutes = openMinutes; minutes + slotDuration <= closeMinutes; minutes += slotDuration) {
    const startHour = Math.floor(minutes / 60);
    const startMinute = minutes % 60;
    const endMinutes = minutes + slotDuration;
    const endHour = Math.floor(endMinutes / 60);
    const endMinute = endMinutes % 60;

    const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

    // Check availability
    const available = checkFieldAvailability(field._id, date, startTime, endTime);

    slots.push({
      startTime,
      endTime,
      available,
      price: field.hourlyPrice,
      duration: slotDuration
    });
  }

  return slots;
};

/**
 * Get category counts for faceted search
 * 
 * @private
 * @param {Array} fields - Array of all fields
 * @returns {Array<{name: string, count: number}>}
 */
const getCategoryCounts = (fields) => {
  const counts = {};
  
  fields.forEach(field => {
    const categoryName = field.fieldType.category.categoryName;
    counts[categoryName] = (counts[categoryName] || 0) + 1;
  });

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count
  }));
};

/**
 * Get district counts for faceted search
 * 
 * @private
 * @param {Array} fields - Array of all fields
 * @returns {Array<{name: string, count: number}>}
 */
const getDistrictCounts = (fields) => {
  const counts = {};
  
  fields.forEach(field => {
    const district = field.district;
    counts[district] = (counts[district] || 0) + 1;
  });

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count
  }));
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  searchFields,
  getFieldById,
  getFieldAvailability
};

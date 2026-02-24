/**
 * @fileoverview Mock Data for Sports Field Booking System
 * 
 * This file contains mock data extracted from the real database (MongoDB)
 * Used for frontend development and testing before API integration
 * 
 * Data Structure:
 * - Categories (5): Football, Tennis, Badminton, Basketball, Volleyball
 * - Field Types (10): Sân 5/7/11 người, Sân đơn/đôi, etc.
 * - Managers (3): Field owners
 * - Fields (10): Actual sports fields with full details
 * - Booking Details (11): Booked time slots for availability checking
 * 
 * @author San Sieu Toc Team
 * @date 2026-02-24
 */

// ============================================================================
// CATEGORIES (5 items)
// ============================================================================

/**
 * Sport categories available in the system
 * @type {Array<{_id: string, categoryName: string, createdAt: string, updatedAt: string}>}
 */
export const mockCategories = [
  {
    _id: '6984ade0031fcdd6b5e78704',
    categoryName: 'Football',
    createdAt: '2026-02-05T14:49:04.538Z',
    updatedAt: '2026-02-05T14:49:04.538Z'
  },
  {
    _id: '6984ade0031fcdd6b5e78705',
    categoryName: 'Tennis',
    createdAt: '2026-02-05T14:49:04.538Z',
    updatedAt: '2026-02-05T14:49:04.538Z'
  },
  {
    _id: '6984ade0031fcdd6b5e78706',
    categoryName: 'Badminton',
    createdAt: '2026-02-05T14:49:04.538Z',
    updatedAt: '2026-02-05T14:49:04.538Z'
  },
  {
    _id: '6984ade0031fcdd6b5e78707',
    categoryName: 'Basketball',
    createdAt: '2026-02-05T14:49:04.538Z',
    updatedAt: '2026-02-05T14:49:04.538Z'
  },
  {
    _id: '6984ade0031fcdd6b5e78708',
    categoryName: 'Volleyball',
    createdAt: '2026-02-05T14:49:04.539Z',
    updatedAt: '2026-02-05T14:49:04.539Z'
  }
];

// ============================================================================
// FIELD TYPES (7 items)
// ============================================================================

/**
 * Field types for each sport category
 * 
 * Business Rule: Only Football has multiple types
 * - Football: Sân 5 người, Sân 7 người, Sân 11 người
 * - Other sports: Sân Tiêu Chuẩn (Standard Court)
 * 
 * Rationale: Simplified UX - most sports have standardized court sizes
 * 
 * @type {Array<{_id: string, typeName: string, categoryID: string, createdAt: string, updatedAt: string}>}
 */
export const mockFieldTypes = [
  // Football (3 types - ONLY sport with multiple types)
  {
    _id: '6984ade0031fcdd6b5e7870a',
    typeName: 'Sân 5 người',
    categoryID: '6984ade0031fcdd6b5e78704',
    createdAt: '2026-02-05T14:49:04.584Z',
    updatedAt: '2026-02-05T14:49:04.584Z'
  },
  {
    _id: '6984ade0031fcdd6b5e7870b',
    typeName: 'Sân 7 người',
    categoryID: '6984ade0031fcdd6b5e78704',
    createdAt: '2026-02-05T14:49:04.584Z',
    updatedAt: '2026-02-05T14:49:04.584Z'
  },
  {
    _id: '6984ade0031fcdd6b5e7870c',
    typeName: 'Sân 11 người',
    categoryID: '6984ade0031fcdd6b5e78704',
    createdAt: '2026-02-05T14:49:04.584Z',
    updatedAt: '2026-02-05T14:49:04.584Z'
  },
  // Tennis - Standard Court Only
  {
    _id: '6984ade0031fcdd6b5e7870d',
    typeName: 'Sân Tiêu Chuẩn',
    categoryID: '6984ade0031fcdd6b5e78705',
    createdAt: '2026-02-05T14:49:04.584Z',
    updatedAt: '2026-02-05T14:49:04.584Z'
  },
  // Badminton - Standard Court Only
  {
    _id: '6984ade0031fcdd6b5e7870f',
    typeName: 'Sân Tiêu Chuẩn',
    categoryID: '6984ade0031fcdd6b5e78706',
    createdAt: '2026-02-05T14:49:04.584Z',
    updatedAt: '2026-02-05T14:49:04.584Z'
  },
  // Basketball - Standard Court Only
  {
    _id: '6984ade0031fcdd6b5e78711',
    typeName: 'Sân Tiêu Chuẩn',
    categoryID: '6984ade0031fcdd6b5e78707',
    createdAt: '2026-02-05T14:49:04.584Z',
    updatedAt: '2026-02-05T14:49:04.584Z'
  },
  // Volleyball - Standard Court Only
  {
    _id: '6984ade0031fcdd6b5e78713',
    typeName: 'Sân Tiêu Chuẩn',
    categoryID: '6984ade0031fcdd6b5e78708',
    createdAt: '2026-02-05T14:49:04.584Z',
    updatedAt: '2026-02-05T14:49:04.584Z'
  }
];

// ============================================================================
// MANAGERS (3 items)
// ============================================================================

/**
 * Field owners/managers
 * @type {Array<{_id: string, email: string, name: string, phone: string, image: string}>}
 */
export const mockManagers = [
  {
    _id: '6984ade0031fcdd6b5e786fa',
    email: 'manager1@sansieutoc.com',
    name: 'Nguyễn Văn Manager',
    phone: '0901234567',
    image: 'https://i.pravatar.cc/300?img=1',
    imageQR: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=manager1',
    createdAt: '2026-02-05T14:49:04.440Z',
    updatedAt: '2026-02-05T14:49:04.440Z'
  },
  {
    _id: '6984ade0031fcdd6b5e786fb',
    email: 'manager2@sansieutoc.com',
    name: 'Trần Thị Quản Lý',
    phone: '0902345678',
    image: 'https://i.pravatar.cc/300?img=2',
    imageQR: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=manager2',
    createdAt: '2026-02-05T14:49:04.443Z',
    updatedAt: '2026-02-05T14:49:04.443Z'
  },
  {
    _id: '6984ade0031fcdd6b5e786fc',
    email: 'manager3@sansieutoc.com',
    name: 'Lê Văn Giám Đốc',
    phone: '0903456789',
    image: 'https://i.pravatar.cc/300?img=3',
    imageQR: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=manager3',
    createdAt: '2026-02-05T14:49:04.443Z',
    updatedAt: '2026-02-05T14:49:04.443Z'
  }
];

// ============================================================================
// FIELDS (10 items) - WITH POPULATED RELATIONSHIPS
// ============================================================================

/**
 * Sports fields with complete information
 * Each field has populated relationships to fieldType, category, and manager
 * 
 * @type {Array<{
 *   _id: string,
 *   fieldName: string,
 *   address: string,
 *   description: string,
 *   hourlyPrice: number,
 *   slotDuration: number,
 *   openingTime: string,
 *   closingTime: string,
 *   status: string,
 *   utilities: string[],
 *   image: string[],
 *   fieldType: object,
 *   manager: object,
 *   district: string
 * }>}
 */
export const mockFields = [
  // ==================== FOOTBALL FIELDS ====================
  {
    _id: '6984ade0031fcdd6b5e78715',
    fieldName: 'Sân Bóng Đá A1',
    address: '123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
    description: 'Sân cỏ nhân tạo thế hệ mới, có mái che, đầy đủ tiện nghi',
    hourlyPrice: 200000,
    slotDuration: 60,
    openingTime: '06:00',
    closingTime: '23:00',
    status: 'Available',
    utilities: ['Wifi', 'Parking', 'Shower', 'Changing Room', 'Water'],
    image: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800'
    ],
    // Populated fieldType with category
    fieldType: {
      _id: '6984ade0031fcdd6b5e7870a',
      typeName: 'Sân 5 người',
      category: {
        _id: '6984ade0031fcdd6b5e78704',
        categoryName: 'Football'
      }
    },
    // Populated manager
    manager: {
      _id: '6984ade0031fcdd6b5e786fa',
      name: 'Nguyễn Văn Manager',
      phone: '0901234567',
      image: 'https://i.pravatar.cc/300?img=1'
    },
    // Computed field (extracted from address)
    district: 'Quận 7',
    createdAt: '2026-02-05T14:49:04.654Z',
    updatedAt: '2026-02-05T14:49:04.654Z'
  },
  {
    _id: '6984ade0031fcdd6b5e78716',
    fieldName: 'Sân Bóng Đá A2',
    address: '123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
    description: 'Sân cỏ tự nhiên, phù hợp cho các trận đấu lớn',
    hourlyPrice: 350000,
    slotDuration: 90,
    openingTime: '06:00',
    closingTime: '23:00',
    status: 'Available',
    utilities: ['Wifi', 'Parking', 'Shower', 'Changing Room', 'Water', 'First Aid'],
    image: ['https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800'],
    fieldType: {
      _id: '6984ade0031fcdd6b5e7870b',
      typeName: 'Sân 7 người',
      category: {
        _id: '6984ade0031fcdd6b5e78704',
        categoryName: 'Football'
      }
    },
    manager: {
      _id: '6984ade0031fcdd6b5e786fa',
      name: 'Nguyễn Văn Manager',
      phone: '0901234567',
      image: 'https://i.pravatar.cc/300?img=1'
    },
    district: 'Quận 7',
    createdAt: '2026-02-05T14:49:04.655Z',
    updatedAt: '2026-02-05T14:49:04.655Z'
  },
  {
    _id: '6984ade0031fcdd6b5e78717',
    fieldName: 'Sân Bóng Đá A3',
    address: '123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
    description: 'Sân mini có mái che toàn bộ, sạch sẽ',
    hourlyPrice: 180000,
    slotDuration: 60,
    openingTime: '06:00',
    closingTime: '22:00',
    status: 'Available',
    utilities: ['Parking', 'Shower', 'Water'],
    image: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800'],
    fieldType: {
      _id: '6984ade0031fcdd6b5e7870a',
      typeName: 'Sân 5 người',
      category: {
        _id: '6984ade0031fcdd6b5e78704',
        categoryName: 'Football'
      }
    },
    manager: {
      _id: '6984ade0031fcdd6b5e786fa',
      name: 'Nguyễn Văn Manager',
      phone: '0901234567',
      image: 'https://i.pravatar.cc/300?img=1'
    },
    district: 'Quận 7',
    createdAt: '2026-02-05T14:49:04.655Z',
    updatedAt: '2026-02-05T14:49:04.655Z'
  },
  {
    _id: '6984ade0031fcdd6b5e7871e',
    fieldName: 'Sân Bóng Đá A4 (Bảo trì)',
    address: '123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
    description: 'Sân đang trong quá trình bảo trì, sẽ mở lại sớm',
    hourlyPrice: 200000,
    slotDuration: 60,
    openingTime: '06:00',
    closingTime: '23:00',
    status: 'Maintenance',
    utilities: ['Wifi', 'Parking', 'Shower'],
    image: [],
    fieldType: {
      _id: '6984ade0031fcdd6b5e7870a',
      typeName: 'Sân 5 người',
      category: {
        _id: '6984ade0031fcdd6b5e78704',
        categoryName: 'Football'
      }
    },
    manager: {
      _id: '6984ade0031fcdd6b5e786fa',
      name: 'Nguyễn Văn Manager',
      phone: '0901234567',
      image: 'https://i.pravatar.cc/300?img=1'
    },
    district: 'Quận 7',
    createdAt: '2026-02-05T14:49:04.656Z',
    updatedAt: '2026-02-05T14:49:04.656Z'
  },

  // ==================== TENNIS FIELDS ====================
  {
    _id: '6984ade0031fcdd6b5e78718',
    fieldName: 'Sân Tennis Elite 1',
    address: '456 Đường Võ Văn Kiệt, Quận 1, TP.HCM',
    description: 'Sân tennis đơn chuyên nghiệp, mặt sân cứng',
    hourlyPrice: 150000,
    slotDuration: 60,
    openingTime: '05:00',
    closingTime: '22:00',
    status: 'Available',
    utilities: ['Wifi', 'Parking', 'Shower', 'Equipment Rental', 'Coaching'],
    image: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'],
    fieldType: {
      _id: '6984ade0031fcdd6b5e7870d',
      typeName: 'Sân Tiêu Chuẩn',
      category: {
        _id: '6984ade0031fcdd6b5e78705',
        categoryName: 'Tennis'
      }
    },
    manager: {
      _id: '6984ade0031fcdd6b5e786fb',
      name: 'Trần Thị Quản Lý',
      phone: '0902345678',
      image: 'https://i.pravatar.cc/300?img=2'
    },
    district: 'Quận 1',
    createdAt: '2026-02-05T14:49:04.655Z',
    updatedAt: '2026-02-05T14:49:04.655Z'
  },
  {
    _id: '6984ade0031fcdd6b5e78719',
    fieldName: 'Sân Tennis Elite 2',
    address: '456 Đường Võ Văn Kiệt, Quận 1, TP.HCM',
    description: 'Sân tennis đôi tiêu chuẩn quốc tế',
    hourlyPrice: 200000,
    slotDuration: 90,
    openingTime: '05:00',
    closingTime: '22:00',
    status: 'Available',
    utilities: ['Wifi', 'Parking', 'Shower', 'Equipment Rental', 'Coaching', 'Cafe'],
    image: ['https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'],
    fieldType: {
      _id: '6984ade0031fcdd6b5e7870d',
      typeName: 'Sân Tiêu Chuẩn',
      category: {
        _id: '6984ade0031fcdd6b5e78705',
        categoryName: 'Tennis'
      }
    },
    manager: {
      _id: '6984ade0031fcdd6b5e786fb',
      name: 'Trần Thị Quản Lý',
      phone: '0902345678',
      image: 'https://i.pravatar.cc/300?img=2'
    },
    district: 'Quận 1',
    createdAt: '2026-02-05T14:49:04.655Z',
    updatedAt: '2026-02-05T14:49:04.655Z'
  },

  // ==================== BADMINTON FIELDS ====================
  {
    _id: '6984ade0031fcdd6b5e7871a',
    fieldName: 'Sân Cầu Lông VIP 1',
    address: '789 Đường Phan Xích Long, Quận Phú Nhuận, TP.HCM',
    description: 'Sân cầu lông trong nhà, điều hòa mát mẻ',
    hourlyPrice: 80000,
    slotDuration: 60,
    openingTime: '06:00',
    closingTime: '23:00',
    status: 'Available',
    utilities: ['Air Conditioning', 'Parking', 'Shower', 'Equipment Rental', 'Water'],
    image: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'],
    fieldType: {
      _id: '6984ade0031fcdd6b5e7870f',
      typeName: 'Sân Tiêu Chuẩn',
      category: {
        _id: '6984ade0031fcdd6b5e78706',
        categoryName: 'Badminton'
      }
    },
    manager: {
      _id: '6984ade0031fcdd6b5e786fb',
      name: 'Trần Thị Quản Lý',
      phone: '0902345678',
      image: 'https://i.pravatar.cc/300?img=2'
    },
    district: 'Quận Phú Nhuận',
    createdAt: '2026-02-05T14:49:04.655Z',
    updatedAt: '2026-02-05T14:49:04.655Z'
  },
  {
    _id: '6984ade0031fcdd6b5e7871b',
    fieldName: 'Sân Cầu Lông VIP 2',
    address: '789 Đường Phan Xích Long, Quận Phú Nhuận, TP.HCM',
    description: 'Sân đôi rộng rãi, ánh sáng tốt',
    hourlyPrice: 100000,
    slotDuration: 60,
    openingTime: '06:00',
    closingTime: '23:00',
    status: 'Available',
    utilities: ['Air Conditioning', 'Parking', 'Shower', 'Equipment Rental', 'Water', 'Snack Bar'],
    image: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'],
    fieldType: {
      _id: '6984ade0031fcdd6b5e7870f',
      typeName: 'Sân Tiêu Chuẩn',
      category: {
        _id: '6984ade0031fcdd6b5e78706',
        categoryName: 'Badminton'
      }
    },
    manager: {
      _id: '6984ade0031fcdd6b5e786fb',
      name: 'Trần Thị Quản Lý',
      phone: '0902345678',
      image: 'https://i.pravatar.cc/300?img=2'
    },
    district: 'Quận Phú Nhuận',
    createdAt: '2026-02-05T14:49:04.655Z',
    updatedAt: '2026-02-05T14:49:04.655Z'
  },

  // ==================== BASKETBALL FIELD ====================
  {
    _id: '6984ade0031fcdd6b5e7871c',
    fieldName: 'Sân Bóng Rổ Champions',
    address: '321 Đường Đinh Tiên Hoàng, Quận Bình Thạnh, TP.HCM',
    description: 'Sân bóng rổ ngoài trời, tiêu chuẩn NBA',
    hourlyPrice: 250000,
    slotDuration: 90,
    openingTime: '06:00',
    closingTime: '22:00',
    status: 'Available',
    utilities: ['Parking', 'Shower', 'Water', 'Scoreboard'],
    image: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'],
    fieldType: {
      _id: '6984ade0031fcdd6b5e78711',
      typeName: 'Sân Tiêu Chuẩn',
      category: {
        _id: '6984ade0031fcdd6b5e78707',
        categoryName: 'Basketball'
      }
    },
    manager: {
      _id: '6984ade0031fcdd6b5e786fc',
      name: 'Lê Văn Giám Đốc',
      phone: '0903456789',
      image: 'https://i.pravatar.cc/300?img=3'
    },
    district: 'Quận Bình Thạnh',
    createdAt: '2026-02-05T14:49:04.655Z',
    updatedAt: '2026-02-05T14:49:04.655Z'
  },

  // ==================== VOLLEYBALL FIELD ====================
  {
    _id: '6984ade0031fcdd6b5e7871d',
    fieldName: 'Sân Bóng Chuyền Olympia',
    address: '654 Đường Lê Văn Việt, Quận 9, TP.HCM',
    description: 'Sân bóng chuyền bãi biển, cát trắng mịn',
    hourlyPrice: 120000,
    slotDuration: 60,
    openingTime: '06:00',
    closingTime: '21:00',
    status: 'Available',
    utilities: ['Parking', 'Shower', 'Changing Room', 'Water'],
    image: ['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800'],
    fieldType: {
      _id: '6984ade0031fcdd6b5e78713',
      typeName: 'Sân Tiêu Chuẩn',
      category: {
        _id: '6984ade0031fcdd6b5e78708',
        categoryName: 'Volleyball'
      }
    },
    manager: {
      _id: '6984ade0031fcdd6b5e786fc',
      name: 'Lê Văn Giám Đốc',
      phone: '0903456789',
      image: 'https://i.pravatar.cc/300?img=3'
    },
    district: 'Quận 9',
    createdAt: '2026-02-05T14:49:04.655Z',
    updatedAt: '2026-02-05T14:49:04.655Z'
  }
];

// ============================================================================
// BOOKING DETAILS (11 items) - For Availability Checking
// ============================================================================

/**
 * Booked time slots for availability checking
 * Used to determine if a field is available at a specific date/time
 * 
 * @type {Array<{
 *   _id: string,
 *   fieldID: string,
 *   bookingID: string,
 *   startTime: string,
 *   endTime: string,
 *   priceSnapshot: number,
 *   status: string
 * }>}
 */
export const mockBookingDetails = [
  {
    _id: '6984b01b6c0e60352a2a992f',
    fieldID: '6984ade0031fcdd6b5e78715', // Sân Bóng Đá A1
    bookingID: '6984b01b6c0e60352a2a992d',
    startTime: '2026-01-20T08:00:00.000Z',
    endTime: '2026-01-20T10:00:00.000Z',
    priceSnapshot: 200000,
    status: 'Active',
    createdAt: '2026-02-05T14:58:35.672Z',
    updatedAt: '2026-02-05T14:58:35.672Z'
  },
  {
    _id: '6984b01b6c0e60352a2a9933',
    fieldID: '6984ade0031fcdd6b5e78716', // Sân Bóng Đá A2
    bookingID: '6984b01b6c0e60352a2a9931',
    startTime: '2026-02-10T14:00:00.000Z',
    endTime: '2026-02-10T15:30:00.000Z',
    priceSnapshot: 350000,
    status: 'Active',
    createdAt: '2026-02-05T14:58:35.753Z',
    updatedAt: '2026-02-05T14:58:35.753Z'
  },
  {
    _id: '6984b01b6c0e60352a2a9937',
    fieldID: '6984ade0031fcdd6b5e78715', // Sân Bóng Đá A1
    bookingID: '6984b01b6c0e60352a2a9935',
    startTime: '2026-02-05T16:00:00.000Z',
    endTime: '2026-02-05T18:00:00.000Z',
    priceSnapshot: 200000,
    status: 'Active',
    createdAt: '2026-02-05T14:58:35.853Z',
    updatedAt: '2026-02-05T14:58:35.853Z'
  },
  {
    _id: '6984b01b6c0e60352a2a9939',
    fieldID: '6984ade0031fcdd6b5e78717', // Sân Bóng Đá A3
    bookingID: '6984b01b6c0e60352a2a9935',
    startTime: '2026-02-05T18:00:00.000Z',
    endTime: '2026-02-05T20:00:00.000Z',
    priceSnapshot: 180000,
    status: 'Active',
    createdAt: '2026-02-05T14:58:35.893Z',
    updatedAt: '2026-02-05T14:58:35.893Z'
  },
  {
    _id: '6984b01b6c0e60352a2a993d',
    fieldID: '6984ade0031fcdd6b5e78718', // Sân Tennis Elite 1
    bookingID: '6984b01b6c0e60352a2a993b',
    startTime: '2026-02-08T10:00:00.000Z',
    endTime: '2026-02-08T11:00:00.000Z',
    priceSnapshot: 150000,
    status: 'Cancelled', // This slot is available (cancelled)
    createdAt: '2026-02-05T14:58:35.978Z',
    updatedAt: '2026-02-05T14:58:35.978Z'
  },
  {
    _id: '6984b01c6c0e60352a2a9941',
    fieldID: '6984ade0031fcdd6b5e7871a', // Sân Cầu Lông VIP 1
    bookingID: '6984b01c6c0e60352a2a993f',
    startTime: '2026-02-12T19:00:00.000Z',
    endTime: '2026-02-12T22:00:00.000Z',
    priceSnapshot: 80000,
    status: 'Active',
    createdAt: '2026-02-05T14:58:36.062Z',
    updatedAt: '2026-02-05T14:58:36.062Z'
  },
  {
    _id: '6984b01c6c0e60352a2a9945',
    fieldID: '6984ade0031fcdd6b5e78719', // Sân Tennis Elite 2
    bookingID: '6984b01c6c0e60352a2a9943',
    startTime: '2026-02-15T08:00:00.000Z',
    endTime: '2026-02-15T10:30:00.000Z',
    priceSnapshot: 200000,
    status: 'Active',
    createdAt: '2026-02-05T14:58:36.140Z',
    updatedAt: '2026-02-05T14:58:36.140Z'
  },
  {
    _id: '6984b01c6c0e60352a2a9949',
    fieldID: '6984ade0031fcdd6b5e7871c', // Sân Bóng Rổ Champions
    bookingID: '6984b01c6c0e60352a2a9947',
    startTime: '2026-02-06T15:00:00.000Z',
    endTime: '2026-02-06T18:00:00.000Z',
    priceSnapshot: 250000,
    status: 'Active',
    createdAt: '2026-02-05T14:58:36.216Z',
    updatedAt: '2026-02-05T14:58:36.216Z'
  },
  {
    _id: '6984b01c6c0e60352a2a994d',
    fieldID: '6984ade0031fcdd6b5e7871d', // Sân Bóng Chuyền Olympia
    bookingID: '6984b01c6c0e60352a2a994b',
    startTime: '2026-02-18T17:00:00.000Z',
    endTime: '2026-02-18T20:00:00.000Z',
    priceSnapshot: 120000,
    status: 'Active',
    createdAt: '2026-02-05T14:58:36.293Z',
    updatedAt: '2026-02-05T14:58:36.293Z'
  },
  {
    _id: '6984b01c6c0e60352a2a9951',
    fieldID: '6984ade0031fcdd6b5e7871b', // Sân Cầu Lông VIP 2
    bookingID: '6984b01c6c0e60352a2a994f',
    startTime: '2026-02-07T20:00:00.000Z',
    endTime: '2026-02-07T23:00:00.000Z',
    priceSnapshot: 100000,
    status: 'Active',
    createdAt: '2026-02-05T14:58:36.371Z',
    updatedAt: '2026-02-05T14:58:36.371Z'
  },
  {
    _id: '6984b01c6c0e60352a2a9955',
    fieldID: '6984ade0031fcdd6b5e78715', // Sân Bóng Đá A1
    bookingID: '6984b01c6c0e60352a2a9953',
    startTime: '2026-01-18T14:00:00.000Z',
    endTime: '2026-01-18T15:00:00.000Z',
    priceSnapshot: 200000,
    status: 'Active',
    createdAt: '2026-02-05T14:58:36.455Z',
    updatedAt: '2026-02-05T14:58:36.455Z'
  }
];

// ============================================================================
// UTILITY CONSTANTS
// ============================================================================

/**
 * All available utilities across all fields
 * @type {string[]}
 */
export const ALL_UTILITIES = [
  'Wifi',
  'Parking',
  'Shower',
  'Changing Room',
  'Water',
  'First Aid',
  'Equipment Rental',
  'Coaching',
  'Cafe',
  'Air Conditioning',
  'Snack Bar',
  'Scoreboard'
];

/**
 * All districts where fields are located
 * @type {string[]}
 */
export const ALL_DISTRICTS = [
  'Quận 1',
  'Quận 7',
  'Quận 9',
  'Quận Bình Thạnh',
  'Quận Phú Nhuận'
];

/**
 * Price range constants (in VND)
 * @type {{min: number, max: number}}
 */
export const PRICE_RANGE = {
  min: 80000,
  max: 350000
};

/**
 * Field status constants
 * @type {string[]}
 */
export const FIELD_STATUS = {
  AVAILABLE: 'Available',
  MAINTENANCE: 'Maintenance'
};

/**
 * Booking detail status constants
 * @type {string[]}
 */
export const BOOKING_STATUS = {
  ACTIVE: 'Active',
  CANCELLED: 'Cancelled'
};

/**
 * Booking Service
 * Handles all booking-related API calls
 */

import axiosInstance from './axios';
import { API_CONFIG } from '../config/api.config';

const bookingService = {
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @param {string} bookingData.customerID - Customer ID
   * @param {string} bookingData.fieldID - Field ID
   * @param {Array} bookingData.bookingDetails - Array of booking details
   * @param {number} bookingData.totalPrice - Total price
   * @param {number} bookingData.depositAmount - Deposit amount
   * @param {string} bookingData.statusPayment - Payment status
   * @returns {Promise} API response
   */
  async createBooking(bookingData) {
    try {
      const response = await axiosInstance.post(
        API_CONFIG.ENDPOINTS.BOOKING.CREATE,
        bookingData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  /**
   * Get customer's booking list
   * @returns {Promise} API response with booking list
   */
  async getBookingList() {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.ENDPOINTS.BOOKING.LIST
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching booking list:', error);
      throw error;
    }
  },

  /**
   * Get booking details by ID
   * @param {string} bookingId - Booking ID
   * @returns {Promise} API response with booking details
   */
  async getBookingDetail(bookingId) {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.ENDPOINTS.BOOKING.DETAIL(bookingId)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching booking detail:', error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   * @param {string} bookingId - Booking ID
   * @returns {Promise} API response
   */
  async cancelBooking(bookingId) {
    try {
      const response = await axiosInstance.put(
        API_CONFIG.ENDPOINTS.BOOKING.CANCEL(bookingId)
      );
      return response.data;
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  },

  /**
   * Check slot availability
   * @param {Object} params - Query parameters
   * @param {string} params.fieldID - Field ID
   * @param {string} params.date - Date in YYYY-MM-DD format
   * @returns {Promise} API response with availability data
   */
  async checkAvailability(params) {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.ENDPOINTS.BOOKING.CHECK_AVAILABILITY,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  },

  /**
   * Get booking details by field ID
   * @param {string} fieldId - Field ID
   * @param {string} date - Date in YYYY-MM-DD format (optional)
   * @returns {Promise} API response with booking details
   */
  async getBookingDetailsByField(fieldId, date = null) {
    try {
      const url = API_CONFIG.ENDPOINTS.BOOKING_DETAIL.BY_FIELD(fieldId);
      const params = date ? { date } : {};
      const response = await axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details by field:', error);
      throw error;
    }
  },

  /**
   * Get booking details by date range
   * @param {Object} params - Query parameters
   * @param {string} params.fieldID - Field ID
   * @param {string} params.startDate - Start date in YYYY-MM-DD format
   * @param {string} params.endDate - End date in YYYY-MM-DD format
   * @returns {Promise} API response with booking details
   */
  async getBookingDetailsByDate(params) {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.ENDPOINTS.BOOKING_DETAIL.BY_DATE,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details by date:', error);
      throw error;
    }
  },
};

export default bookingService;

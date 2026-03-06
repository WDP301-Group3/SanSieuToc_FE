/**
 * Feedback Service
 * Handles all feedback-related API calls
 *
 * Endpoints (from api.config.js → FEEDBACK):
 *   GET /api/feedback/field/:fieldId      → getFeedbacksByField
 *   GET /api/feedback/stats/field/:fieldId → getFieldStats
 */

import axiosInstance from './axios';
import { API_CONFIG } from '../config/api.config';

const ENDPOINTS = API_CONFIG.ENDPOINTS;

const feedbackService = {
  /**
   * Get feedbacks for a specific field (paginated)
   * @param {string} fieldId
   * @param {Object} [options]
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @returns {Promise<{success:boolean, data?:Array, total?:number, error?:string}>}
   */
  async getFeedbacksByField(fieldId, options = {}) {
    try {
      if (!fieldId) return { success: false, data: [], error: 'Field ID is required' };
      const { page = 1, limit = 50 } = options;
      const response = await axiosInstance.get(ENDPOINTS.FEEDBACK.BY_FIELD(fieldId), {
        params: { page, limit },
      });
      const raw = response.data?.data || response.data;
      const feedbacks = raw?.feedbacks || raw || [];
      const total = raw?.total || feedbacks.length;
      return { success: true, data: feedbacks, total };
    } catch (error) {
      console.error('getFeedbacksByField error:', error);
      return { success: false, data: [], error: error.response?.data?.message || error.message };
    }
  },

  /**
   * Get rating stats for a field (averageRating, totalReviews)
   * @param {string} fieldId
   * @returns {Promise<{success:boolean, data?:Object, error?:string}>}
   */
  async getFieldStats(fieldId) {
    try {
      if (!fieldId) return { success: false, data: null, error: 'Field ID is required' };
      const response = await axiosInstance.get(ENDPOINTS.FEEDBACK.STATS(fieldId));
      const raw = response.data?.data || response.data;
      return {
        success: true,
        data: {
          averageRating: raw?.averageRating ?? 0,
          totalReviews: raw?.totalReviews ?? 0,
        },
      };
    } catch (error) {
      console.error('getFieldStats error:', error);
      return {
        success: false,
        data: { averageRating: 0, totalReviews: 0 },
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default feedbackService;

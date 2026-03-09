/**
 * @fileoverview Custom hook cho FieldListPage
 * 
 * Quản lý state, effects, và handlers cho trang danh sách sân
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { PRICE_CONFIG, DEFAULT_FILTERS } from './fieldListConstants';

const useFieldList = () => {
  const notification = useNotification();

  const {
    searchFields,
    globalData,
    isLoading,
    getError,
    clearError,
    getFieldTypesByCategory,
    fetchGlobalData,
  } = useApp();

  const [searchParams] = useSearchParams();

  // ==========================================
  // STATE DECLARATIONS
  // ==========================================

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    searchText: searchParams.get('search') || '',
    date: searchParams.get('date') || '',
  });

  const [searchInputText, setSearchInputText] = useState(
    searchParams.get('search') || ''
  );

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [navHidden, setNavHidden] = useState(false);

  const [fields, setFields] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });
  const [facets, setFacets] = useState({
    categories: [],
    districts: [],
    cities: [],
    priceRange: { min: 0, max: PRICE_CONFIG.MAX },
  });

  const [priceInputValue, setPriceInputValue] = useState(
    DEFAULT_FILTERS.priceMax.toLocaleString('vi-VN')
  );

  // ==========================================
  // COMPUTED VALUES
  // ==========================================

  const loading = isLoading('searchFields');
  const error = getError('searchFields');
  const selectedCategoryFieldTypes = getFieldTypesByCategory(filters.categoryName);

  // ==========================================
  // API CALLS
  // ==========================================

  const fetchFields = useCallback(async () => {
    clearError('searchFields');
    const result = await searchFields({ ...filters });

    if (result.success) {
      setFields(result.data.fields);
      setPagination(result.data.pagination);
      if (result.data.facets) {
        setFacets(result.data.facets);
      }
    }
  }, [filters, searchFields, clearError]);

  // ==========================================
  // EFFECTS
  // ==========================================

  useEffect(() => {
    if (globalData.categories.length === 0) {
      fetchGlobalData();
    }
  }, [fetchGlobalData, globalData.categories.length]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  useEffect(() => {
    const checkNavbar = () => {
      const nav = document.querySelector('.header-nav');
      if (nav) {
        setNavHidden(nav.classList.contains('header-hidden'));
      }
    };

    checkNavbar();
    const nav = document.querySelector('.header-nav');
    if (nav) {
      const navObserver = new MutationObserver(checkNavbar);
      navObserver.observe(nav, { attributes: true, attributeFilter: ['class'] });
      return () => navObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const dateFromUrl = searchParams.get('date');

    if (searchFromUrl || dateFromUrl) {
      setFilters(prev => ({
        ...prev,
        searchText: searchFromUrl || prev.searchText,
        date: dateFromUrl || prev.date,
      }));
      if (searchFromUrl) {
        setSearchInputText(searchFromUrl);
      }
    }
  }, [searchParams]);

  // ==========================================
  // FILTER HANDLERS
  // ==========================================

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setFilters(prev => ({
      ...prev,
      categoryName: prev.categoryName === category ? '' : category,
      fieldTypeName: '',
      page: 1,
    }));
  }, []);

  const handleFieldTypeChange = useCallback((typeName) => {
    setFilters(prev => ({
      ...prev,
      fieldTypeName: prev.fieldTypeName === typeName ? '' : typeName,
      page: 1,
    }));
  }, []);

  const handleCityChange = useCallback((city) => {
    setFilters(prev => ({
      ...prev,
      city,
      ward: '',  // reset ward khi đổi city
      page: 1,
    }));
  }, []);

  const handleWardChange = useCallback((ward) => {
    setFilters(prev => ({ ...prev, ward, page: 1 }));
  }, []);

  const handleSortChange = useCallback((sortValue) => {
    setFilters(prev => ({ ...prev, sortBy: sortValue, page: 1 }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pagination.totalPages]);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchInputText('');
    setPriceInputValue(DEFAULT_FILTERS.priceMax.toLocaleString('vi-VN'));
    clearError('searchFields');
  }, [clearError]);

  // ==========================================
  // PRICE HANDLERS
  // ==========================================

  const handlePriceInputChange = useCallback((e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    if (rawValue === '') {
      setPriceInputValue('');
      return;
    }
    const numericValue = parseInt(rawValue, 10);
    setPriceInputValue(numericValue.toLocaleString('vi-VN'));
  }, []);

  const handlePriceInputBlur = useCallback(() => {
    const rawValue = priceInputValue.replace(/[^\d]/g, '');
    let numericValue = parseInt(rawValue, 10) || PRICE_CONFIG.DEFAULT_MAX;
    numericValue = Math.max(0, Math.min(numericValue, PRICE_CONFIG.MAX));
    setPriceInputValue(numericValue.toLocaleString('vi-VN'));
    handleFilterChange('priceMax', numericValue);
  }, [priceInputValue, handleFilterChange]);

  const handlePriceKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handlePriceInputBlur();
    }
  }, [handlePriceInputBlur]);

  // ==========================================
  // SEARCH HANDLERS
  // ==========================================

  const clearSearch = useCallback(() => {
    setSearchInputText('');
    handleFilterChange('searchText', '');
  }, [handleFilterChange]);

  const handleSearchSubmit = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      searchText: searchInputText.trim(),
      page: 1,
    }));
  }, [searchInputText]);

  const handleSearchKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  }, [handleSearchSubmit]);

  return {
    // Data
    fields,
    pagination,
    facets,
    globalData,
    loading,
    error,
    notification,
    selectedCategoryFieldTypes,

    // Filters
    filters,
    searchInputText,
    setSearchInputText,
    priceInputValue,
    showMobileFilters,
    setShowMobileFilters,
    viewMode,
    setViewMode,
    navHidden,

    // Handlers
    handleFilterChange,
    handleCategoryChange,
    handleFieldTypeChange,
    handleCityChange,
    handleWardChange,
    handleSortChange,
    handlePageChange,
    handleReset,
    handlePriceInputChange,
    handlePriceInputBlur,
    handlePriceKeyPress,
    clearSearch,
    handleSearchSubmit,
    handleSearchKeyPress,
    fetchFields,
  };
};

export default useFieldList;

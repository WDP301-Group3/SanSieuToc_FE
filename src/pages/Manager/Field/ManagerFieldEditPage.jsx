import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { getManagerFieldById, getFieldCreateForm, updateField } from '../../../services/managerService';
import '../../../styles/ManagerFieldEditPage.css';

/**
 * Map utility key → Vietnamese label + icon
 */
const utilityLabelMap = {
  Wifi: { label: 'Wifi miễn phí', icon: 'wifi' },
  Parking: { label: 'Bãi giữ xe', icon: 'local_parking' },
  Shower: { label: 'Phòng tắm', icon: 'shower' },
  'Changing Room': { label: 'Phòng thay đồ', icon: 'checkroom' },
  Water: { label: 'Nước uống miễn phí', icon: 'local_drink' },
  'First Aid': { label: 'Y tế sơ cứu', icon: 'medical_services' },
  'Equipment Rental': { label: 'Cho thuê dụng cụ', icon: 'sports' },
  Coaching: { label: 'Huấn luyện viên', icon: 'school' },
  Cafe: { label: 'Quán cà phê', icon: 'local_cafe' },
  'Air Conditioning': { label: 'Điều hòa', icon: 'ac_unit' },
  'Snack Bar': { label: 'Canteen', icon: 'restaurant' },
  Scoreboard: { label: 'Bảng điểm', icon: 'scoreboard' },
};

const ALL_UTILITIES = Object.keys(utilityLabelMap);

const ManagerFieldEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notification = useNotification();

  /* ---------- Loading & error state ---------- */
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ---------- Form data from API ---------- */
  const [categories, setCategories] = useState([]);
  const [allFieldTypes, setAllFieldTypes] = useState([]);

  /* ---------- Form fields ---------- */
  const [fieldName, setFieldName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyPrice, setHourlyPrice] = useState(0);
  const [slotDuration, setSlotDuration] = useState(60);
  const [openingTime, setOpeningTime] = useState('06:00');
  const [closingTime, setClosingTime] = useState('23:00');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedFieldTypeId, setSelectedFieldTypeId] = useState('');
  const [status, setStatus] = useState(true); // true = Available
  const [utilities, setUtilities] = useState([]);
  const [images, setImages] = useState([]); // string URLs (existing) or File objects (new)
  const [fieldIdReal, setFieldIdReal] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setPageLoading(true);
      setPageError(null);

      const [fieldRes, formRes] = await Promise.all([
        getManagerFieldById(id),
        getFieldCreateForm(),
      ]);

      if (!fieldRes.success) {
        setPageError(fieldRes.error || 'Không tìm thấy sân');
        setPageLoading(false);
        return;
      }

      const f = fieldRes.data;
      setFieldIdReal(f._id);
      setFieldName(f.fieldName || '');
      setAddress(f.address || '');
      setDescription(f.description || '');
      setHourlyPrice(f.hourlyPrice || 0);
      setSlotDuration(f.slotDuration || 60);
      setOpeningTime(f.openingTime || '06:00');
      setClosingTime(f.closingTime || '23:00');
      setStatus((f.status || '').toLowerCase() !== 'maintenance');
      setUtilities(f.utilities || []);
      setImages(
        Array.isArray(f.image) ? f.image : f.image ? [f.image] : []
      );

      // Resolve category/fieldType IDs from populated object or plain ID
      const currentTypeId =
        (f.fieldTypeID?._id || f.fieldTypeID || f.fieldType?._id || '').toString();
      const currentCatId = (
        f.fieldTypeID?.categoryID?._id ||
        f.fieldTypeID?.categoryID ||
        f.fieldType?.category?._id ||
        ''
      ).toString();

      if (formRes.success && formRes.data) {
        const cats = formRes.data.categories || [];
        const types = formRes.data.fieldTypes || [];
        setCategories(cats);
        setAllFieldTypes(types);
        setSelectedCategoryId(currentCatId);
        setSelectedFieldTypeId(currentTypeId);
      }

      setPageLoading(false);
    };
    fetchAll();
  }, [id]);

  /* ---------- Derived ---------- */
  const availableFieldTypes = useMemo(() => {
    if (!selectedCategoryId) return allFieldTypes;
    return allFieldTypes.filter(
      (ft) =>
        ft.categoryID === selectedCategoryId ||
        ft.categoryID?._id === selectedCategoryId
    );
  }, [selectedCategoryId, allFieldTypes]);

  /* ---------- Handlers ---------- */

  const toggleUtility = (util) => {
    setUtilities((prev) =>
      prev.includes(util) ? prev.filter((u) => u !== util) : [...prev, util]
    );
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategoryId(catId);
    const typesForCat = allFieldTypes.filter(
      (ft) => ft.categoryID === catId || ft.categoryID?._id === catId
    );
    if (typesForCat.length > 0 && !typesForCat.find((ft) => ft._id === selectedFieldTypeId)) {
      setSelectedFieldTypeId(typesForCat[0]._id);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const formatPriceDisplay = (price) => Number(price).toLocaleString('vi-VN');

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setHourlyPrice(Number(raw) || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFieldTypeId) {
      notification.error('Vui lòng chọn loại sân!');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('fieldName', fieldName);
    formData.append('address', address);
    formData.append('description', description);
    formData.append('hourlyPrice', hourlyPrice);
    formData.append('slotDuration', slotDuration);
    formData.append('openingTime', openingTime);
    formData.append('closingTime', closingTime);
    formData.append('fieldTypeID', selectedFieldTypeId);
    formData.append('status', status ? 'Available' : 'Maintenance');
    utilities.forEach((u) => formData.append('utilities[]', u));

    // Existing image URLs (keep them)
    images.filter((img) => typeof img === 'string').forEach((url) => {
      formData.append('existingImages[]', url);
    });
    // New file uploads
    images.filter((img) => img instanceof File).forEach((file) => {
      formData.append('image', file);
    });

    const res = await updateField(fieldIdReal || id, formData);
    setSubmitting(false);

    if (res.success) {
      notification.success(`Cập nhật sân "${fieldName}" thành công!`);
      navigate(`/admin/fields/${fieldIdReal || id}`);
    } else {
      if (res.error?.includes('409') || res.error?.includes('booking')) {
        notification.error('Không thể thay đổi giờ hoạt động vì có lịch đặt đang hoạt động.');
      } else {
        notification.error(res.error || 'Cập nhật sân thất bại. Vui lòng thử lại.');
      }
    }
  };

  /* ---------- Loading / Error states ---------- */
  if (pageLoading) {
    return (
      <div className="edit-field-page">
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '2.5rem' }}>sync</span>
          <p>Đang tải thông tin sân...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="edit-field-page">
        <div className="edit-not-found">
          <span className="material-symbols-outlined">search_off</span>
          <h2>Không tìm thấy sân</h2>
          <p>{pageError}</p>
          <Link to="/admin/fields" className="edit-btn-back">
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại danh sách sân
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-field-page">
      {/* Header */}
      <div className="edit-page-header">
        <div className="edit-header-left">
          <button type="button" className="edit-back-btn" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="edit-page-title">Chỉnh sửa thông tin sân</h2>
            <p className="edit-page-subtitle">Cập nhật thông tin chi tiết cho {fieldName}</p>
          </div>
        </div>
        <div className="edit-header-right">
          <Link to={`/admin/fields/${fieldIdReal || id}`} className="edit-view-link">
            <span className="material-symbols-outlined">visibility</span>
            Xem trang sân
          </Link>
        </div>
      </div>

      {/* Form */}
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="edit-grid">
          {/* Left Column */}
          <div className="edit-col-left">
            {/* General Info Card */}
            <div className="edit-card">
              <h3 className="edit-card-title">
                <span className="material-symbols-outlined">info</span>
                Thông tin chung
              </h3>
              <div className="edit-form-grid">
                {/* Tên sân */}
                <div className="edit-form-group">
                  <label className="edit-label">Tên sân</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    placeholder="Nhập tên sân..."
                    required
                  />
                </div>

                {/* Địa chỉ */}
                <div className="edit-form-group">
                  <label className="edit-label">Địa chỉ</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ..."
                    required
                  />
                </div>

                {/* Môn thể thao */}
                <div className="edit-form-group">
                  <label className="edit-label">Môn thể thao</label>
                  <select
                    className="edit-select"
                    value={selectedCategoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="">-- Chọn môn --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>

                {/* Loại sân */}
                <div className="edit-form-group">
                  <label className="edit-label">Loại sân</label>
                  <select
                    className="edit-select"
                    value={selectedFieldTypeId}
                    onChange={(e) => setSelectedFieldTypeId(e.target.value)}
                  >
                    <option value="">-- Chọn loại sân --</option>
                    {availableFieldTypes.map((ft) => (
                      <option key={ft._id} value={ft._id}>{ft.typeName}</option>
                    ))}
                  </select>
                </div>

                {/* Giá thuê */}
                <div className="edit-form-group">
                  <label className="edit-label">Giá thuê (VND/giờ)</label>
                  <div className="edit-input-suffix">
                    <input
                      type="text"
                      className="edit-input"
                      value={formatPriceDisplay(hourlyPrice)}
                      onChange={handlePriceChange}
                      placeholder="0"
                    />
                    <span className="edit-suffix">đ</span>
                  </div>
                </div>

                {/* Thời lượng slot */}
                <div className="edit-form-group">
                  <label className="edit-label">Thời lượng mỗi slot</label>
                  <div className="edit-input-suffix">
                    <input
                      type="number"
                      className="edit-input"
                      value={slotDuration}
                      onChange={(e) => setSlotDuration(Number(e.target.value))}
                      min={30}
                      max={180}
                      step={15}
                    />
                    <span className="edit-suffix">phút</span>
                  </div>
                </div>

                {/* Giờ mở cửa */}
                <div className="edit-form-group">
                  <label className="edit-label">Giờ mở cửa</label>
                  <input
                    type="time"
                    className="edit-input"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                  />
                </div>

                {/* Giờ đóng cửa */}
                <div className="edit-form-group">
                  <label className="edit-label">Giờ đóng cửa</label>
                  <input
                    type="time"
                    className="edit-input"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                  />
                </div>

                {/* Mô tả */}
                <div className="edit-form-group full-width">
                  <label className="edit-label">Mô tả chi tiết</label>
                  <textarea
                    className="edit-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Nhập mô tả chi tiết về sân..."
                    rows={5}
                  />
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="edit-card">
              <h3 className="edit-card-title">
                <span className="material-symbols-outlined">imagesmode</span>
                Hình ảnh
              </h3>
              <div className="edit-images-grid">
                {images.map((img, index) => {
                  const src = img instanceof File ? URL.createObjectURL(img) : img;
                  return (
                    <div key={index} className="edit-image-item">
                      <img src={src} alt={`Ảnh ${index + 1}`} className="edit-image-preview" />
                      <div className="edit-image-overlay">
                        <button
                          type="button"
                          className="edit-image-action view"
                          onClick={() => window.open(src, '_blank')}
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <button
                          type="button"
                          className="edit-image-action delete"
                          onClick={() => removeImage(index)}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
                <label className="edit-image-upload">
                  <span className="material-symbols-outlined">add_photo_alternate</span>
                  <span>Thêm ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p className="edit-image-hint">Định dạng hỗ trợ: JPG, PNG. Tối đa 5MB mỗi ảnh.</p>
            </div>
          </div>

          {/* Right Column — Settings */}
          <div className="edit-col-right">
            <div className="edit-card edit-settings-card">
              <h3 className="edit-card-title">
                <span className="material-symbols-outlined">settings</span>
                Thiết lập
              </h3>

              {/* Status Toggle */}
              <div className="edit-setting-row">
                <div>
                  <label className="edit-setting-label">Trạng thái sân</label>
                  <p className="edit-setting-hint">Tắt để tạm ngưng đặt sân</p>
                </div>
                <label className="edit-toggle">
                  <input
                    type="checkbox"
                    checked={status}
                    onChange={() => setStatus(!status)}
                  />
                  <span className="edit-toggle-slider" />
                </label>
              </div>

              <div className="edit-setting-status">
                <span className={`edit-status-dot ${status ? 'active' : 'maintenance'}`} />
                <span className={`edit-status-text ${status ? 'active' : 'maintenance'}`}>
                  {status ? 'Đang hoạt động' : 'Bảo trì'}
                </span>
              </div>

              <hr className="edit-divider" />

              {/* Utilities */}
              <div className="edit-utilities-section">
                <label className="edit-setting-label">Tiện ích đi kèm</label>
                <div className="edit-utilities-list">
                  {ALL_UTILITIES.map((util) => {
                    const info = utilityLabelMap[util];
                    return (
                      <label key={util} className="edit-utility-item">
                        <input
                          type="checkbox"
                          checked={utilities.includes(util)}
                          onChange={() => toggleUtility(util)}
                          className="edit-utility-checkbox"
                        />
                        <span className="edit-utility-label">{info.label}</span>
                        <span className="material-symbols-outlined edit-utility-icon">{info.icon}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <hr className="edit-divider" />

              {/* Quick Summary */}
              <div className="edit-summary">
                <h4 className="edit-summary-title">Tóm tắt</h4>
                <div className="edit-summary-items">
                  <div className="edit-summary-item">
                    <span className="material-symbols-outlined">stadium</span>
                    <span>{fieldName || 'Chưa đặt tên'}</span>
                  </div>
                  <div className="edit-summary-item">
                    <span className="material-symbols-outlined">payments</span>
                    <span>{formatPriceDisplay(hourlyPrice)}đ / giờ</span>
                  </div>
                  <div className="edit-summary-item">
                    <span className="material-symbols-outlined">schedule</span>
                    <span>{openingTime} - {closingTime}</span>
                  </div>
                  <div className="edit-summary-item">
                    <span className="material-symbols-outlined">timer</span>
                    <span>{slotDuration} phút / slot</span>
                  </div>
                  <div className="edit-summary-item">
                    <span className="material-symbols-outlined">photo_library</span>
                    <span>{images.length} ảnh</span>
                  </div>
                  <div className="edit-summary-item">
                    <span className="material-symbols-outlined">build</span>
                    <span>{utilities.length} tiện ích</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="edit-actions">
          <button
            type="button"
            className="edit-btn-cancel"
            onClick={() => navigate(`/admin/fields/${fieldIdReal || id}`)}
            disabled={submitting}
          >
            Hủy bỏ
          </button>
          <button type="submit" className="edit-btn-save" disabled={submitting}>
            <span className="material-symbols-outlined">
              {submitting ? 'sync' : 'save'}
            </span>
            {submitting ? 'Đang lưu...' : 'Cập nhật'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManagerFieldEditPage;

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { getFieldCreateForm, createField } from '../../../services/managerService';
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

const ManagerFieldCreatePage = () => {
  const navigate = useNavigate();
  const notification = useNotification();

  /* ---------- Form state — all empty / default ---------- */
  const [fieldName, setFieldName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyPrice, setHourlyPrice] = useState(0);
  const [slotDuration, setSlotDuration] = useState(60);
  const [openingTime, setOpeningTime] = useState('06:00');
  const [closingTime, setClosingTime] = useState('23:00');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedFieldTypeId, setSelectedFieldTypeId] = useState('');
  const [utilities, setUtilities] = useState([]);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  /* ---------- API form data ---------- */
  const [categories, setCategories] = useState([]);
  const [allFieldTypes, setAllFieldTypes] = useState([]);
  const [formLoading, setFormLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      setFormLoading(true);
      const res = await getFieldCreateForm();
      if (res.success && res.data) {
        const cats = res.data.categories || [];
        const types = res.data.fieldTypes || [];
        setCategories(cats);
        setAllFieldTypes(types);
        if (cats.length > 0) setSelectedCategoryId(cats[0]._id);
      }
      setFormLoading(false);
    };
    fetchForm();
  }, []);

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
    setSelectedFieldTypeId(typesForCat.length > 0 ? typesForCat[0]._id : '');
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /** Handle file upload — store File objects for upload */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const formatPriceDisplay = (price) => Number(price).toLocaleString('vi-VN');

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setHourlyPrice(Number(raw) || 0);
  };

  /** Handle form submission — POST to API */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFieldTypeId) {
      notification.error('Vui lòng chọn loại sân!');
      return;
    }

    setSubmitting(true);

    // Build FormData to support file uploads
    const formData = new FormData();
    formData.append('fieldName', fieldName);
    formData.append('address', address);
    formData.append('description', description);
    formData.append('hourlyPrice', hourlyPrice);
    formData.append('slotDuration', slotDuration);
    formData.append('openingTime', openingTime);
    formData.append('closingTime', closingTime);
    formData.append('fieldTypeID', selectedFieldTypeId);
    utilities.forEach((u) => formData.append('utilities[]', u));
    images.forEach((img) => {
      if (img instanceof File) formData.append('image', img);
    });

    const res = await createField(formData);
    setSubmitting(false);

    if (res.success) {
      notification.success(`Tạo sân "${fieldName}" thành công!`);
      navigate('/admin/fields');
    } else {
      notification.error(res.error || 'Tạo sân thất bại. Vui lòng thử lại.');
    }
  };

  if (formLoading) {
    return (
      <div className="edit-field-page">
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '2.5rem' }}>sync</span>
          <p>Đang tải form...</p>
        </div>
      </div>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div className="edit-field-page">
      {/* Header */}
      <div className="edit-page-header">
        <div className="edit-header-left">
          <button type="button" className="edit-back-btn" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="edit-page-title">Thêm sân mới</h2>
            <p className="edit-page-subtitle">
              Nhập thông tin chi tiết để tạo sân mới trong hệ thống
            </p>
          </div>
        </div>
        <div className="edit-header-right">
          <Link to="/admin/fields" className="edit-view-link">
            <span className="material-symbols-outlined">list</span>
            Danh sách sân
          </Link>
        </div>
      </div>

      {/* Form */}
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="edit-grid">
          {/* ===== Left Column ===== */}
          <div className="edit-col-left">
            {/* General Info Card */}
            <div className="edit-card">
              <h3 className="edit-card-title">
                <span className="material-symbols-outlined">edit_note</span>
                Thông tin cơ bản
              </h3>
              <div className="edit-form-grid">
                {/* Tên sân */}
                <div className="edit-form-group full-width">
                  <label className="edit-label">Tên sân</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    placeholder="Ví dụ: Sân A - Khu vực 1"
                    required
                  />
                </div>

                {/* Địa chỉ */}
                <div className="edit-form-group full-width">
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
                    required
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
                    required
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
                      value={hourlyPrice ? formatPriceDisplay(hourlyPrice) : ''}
                      onChange={handlePriceChange}
                      placeholder="300,000"
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
                    placeholder="Nhập mô tả về sân, tiện ích đi kèm..."
                    rows={5}
                  />
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="edit-card">
              <h3 className="edit-card-title">
                <span className="material-symbols-outlined">image</span>
                Hình ảnh sân
              </h3>

              <label className="edit-dropzone">
                <span className="material-symbols-outlined edit-dropzone-icon">cloud_upload</span>
                <p className="edit-dropzone-text">
                  <span className="edit-dropzone-highlight">Bấm để tải lên</span> hoặc kéo thả
                </p>
                <p className="edit-dropzone-hint">PNG, JPG hoặc WEBP (Tối đa 10MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
              </label>

              {images.length > 0 && (
                <div className="edit-upload-list">
                  {images.map((img, index) => {
                    const previewUrl = img instanceof File ? URL.createObjectURL(img) : img;
                    const fileName = img instanceof File ? img.name : `ảnh-sân-${index + 1}.jpg`;
                    return (
                      <div key={index} className="edit-upload-item">
                        <div
                          className="edit-upload-thumb"
                          style={{ backgroundImage: `url(${previewUrl})` }}
                        />
                        <div className="edit-upload-info">
                          <p className="edit-upload-name">{fileName}</p>
                          <p className="edit-upload-size">
                            {img instanceof File
                              ? `${(img.size / 1024).toFixed(0)} KB`
                              : 'Đã tải lên'}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="edit-upload-remove"
                          onClick={() => removeImage(index)}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ===== Right Column — Settings ===== */}
          <div className="edit-col-right">
            <div className="edit-card edit-settings-card">
              <h3 className="edit-card-title">
                <span className="material-symbols-outlined">settings</span>
                Thiết lập
              </h3>

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
                    <span>{hourlyPrice ? `${formatPriceDisplay(hourlyPrice)}đ / giờ` : 'Chưa nhập giá'}</span>
                  </div>
                  <div className="edit-summary-item">
                    <span className="material-symbols-outlined">schedule</span>
                    <span>{openingTime} – {closingTime}</span>
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
            onClick={() => navigate('/admin/fields')}
            disabled={submitting}
          >
            Hủy bỏ
          </button>
          <button type="submit" className="edit-btn-save" disabled={submitting}>
            <span className="material-symbols-outlined">
              {submitting ? 'sync' : 'add_circle'}
            </span>
            {submitting ? 'Đang tạo...' : 'Thêm sân'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManagerFieldCreatePage;

import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  mockFields,
  mockCategories,
  mockFieldTypes,
  mockManagers,
  ALL_UTILITIES,
  ALL_DISTRICTS,
  FIELD_STATUS,
} from '../../../data/mockData';
import '../../../styles/AdminFieldEditPage.css';

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

const AdminFieldEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find field from mockData
  const field = mockFields.find((f) => f._id === id);

  // Form state — initialized from field data
  const [fieldName, setFieldName] = useState(field?.fieldName || '');
  const [address, setAddress] = useState(field?.address || '');
  const [district, setDistrict] = useState(field?.district || '');
  const [description, setDescription] = useState(field?.description || '');
  const [hourlyPrice, setHourlyPrice] = useState(field?.hourlyPrice || 0);
  const [slotDuration, setSlotDuration] = useState(field?.slotDuration || 60);
  const [openingTime, setOpeningTime] = useState(field?.openingTime || '06:00');
  const [closingTime, setClosingTime] = useState(field?.closingTime || '23:00');
  const [selectedCategoryId, setSelectedCategoryId] = useState(field?.fieldType?.category?._id || '');
  const [selectedFieldTypeId, setSelectedFieldTypeId] = useState(field?.fieldType?._id || '');
  const [selectedManagerId, setSelectedManagerId] = useState(field?.manager?._id || '');
  const [status, setStatus] = useState(field?.status === FIELD_STATUS.AVAILABLE);
  const [utilities, setUtilities] = useState(field?.utilities || []);
  const [images, setImages] = useState(field?.image || []);

  // Filter field types based on selected category
  const availableFieldTypes = useMemo(() => {
    if (!selectedCategoryId) return mockFieldTypes;
    return mockFieldTypes.filter((ft) => ft.categoryID === selectedCategoryId);
  }, [selectedCategoryId]);

  // 404 — field not found
  if (!field) {
    return (
      <div className="edit-field-page">
        <div className="edit-not-found">
          <span className="material-symbols-outlined">search_off</span>
          <h2>Không tìm thấy sân</h2>
          <p>Sân bạn muốn chỉnh sửa không tồn tại hoặc đã bị xóa.</p>
          <Link to="/admin/fields" className="edit-btn-back">
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại danh sách sân
          </Link>
        </div>
      </div>
    );
  }

  /**
   * Toggle a utility on/off
   */
  const toggleUtility = (util) => {
    setUtilities((prev) =>
      prev.includes(util) ? prev.filter((u) => u !== util) : [...prev, util]
    );
  };

  /**
   * Handle category change — reset fieldType if it no longer belongs to selected category
   */
  const handleCategoryChange = (catId) => {
    setSelectedCategoryId(catId);
    const typesForCat = mockFieldTypes.filter((ft) => ft.categoryID === catId);
    if (typesForCat.length > 0 && !typesForCat.find((ft) => ft._id === selectedFieldTypeId)) {
      setSelectedFieldTypeId(typesForCat[0]._id);
    }
  };

  /**
   * Remove an image from the list
   */
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Handle file upload (mock — just add placeholder URLs)
   */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newUrls]);
  };

  /**
   * Format price with thousand separators
   */
  const formatPriceDisplay = (price) => {
    return Number(price).toLocaleString('vi-VN');
  };

  /**
   * Handle price input — strip non-numeric chars
   */
  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setHourlyPrice(Number(raw) || 0);
  };

  /**
   * Handle form submission (mock)
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedManager = mockManagers.find((m) => m._id === selectedManagerId);
    const selectedFieldType = mockFieldTypes.find((ft) => ft._id === selectedFieldTypeId);
    const selectedCategory = mockCategories.find((c) => c._id === selectedCategoryId);

    const updatedField = {
      _id: field._id,
      fieldName,
      address,
      district,
      description,
      hourlyPrice,
      slotDuration,
      openingTime,
      closingTime,
      status: status ? FIELD_STATUS.AVAILABLE : FIELD_STATUS.MAINTENANCE,
      utilities,
      image: images,
      fieldType: selectedFieldType ? {
        _id: selectedFieldType._id,
        typeName: selectedFieldType.typeName,
        category: selectedCategory ? {
          _id: selectedCategory._id,
          categoryName: selectedCategory.categoryName,
        } : field.fieldType?.category,
      } : field.fieldType,
      manager: selectedManager ? {
        _id: selectedManager._id,
        name: selectedManager.name,
        phone: selectedManager.phone,
        image: selectedManager.image,
      } : field.manager,
    };

    console.log('Updated field data:', updatedField);
    alert(`Cập nhật sân "${fieldName}" thành công!`);
    navigate(`/admin/fields/${field._id}`);
  };

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
            <p className="edit-page-subtitle">Cập nhật thông tin chi tiết cho {field.fieldName}</p>
          </div>
        </div>
        <div className="edit-header-right">
          <Link to={`/admin/fields/${field._id}`} className="edit-view-link">
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

                {/* Quận/Huyện */}
                <div className="edit-form-group">
                  <label className="edit-label">Quận/Huyện</label>
                  <select
                    className="edit-select"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    <option value="">-- Chọn quận/huyện --</option>
                    {ALL_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
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
                    {mockCategories.map((cat) => (
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

                {/* Chủ sân */}
                <div className="edit-form-group">
                  <label className="edit-label">Chủ sân (Quản lý)</label>
                  <select
                    className="edit-select"
                    value={selectedManagerId}
                    onChange={(e) => setSelectedManagerId(e.target.value)}
                  >
                    <option value="">-- Chọn chủ sân --</option>
                    {mockManagers.map((mgr) => (
                      <option key={mgr._id} value={mgr._id}>{mgr.name} — {mgr.phone}</option>
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
                {images.map((img, index) => (
                  <div key={index} className="edit-image-item">
                    <img src={img} alt={`Ảnh ${index + 1}`} className="edit-image-preview" />
                    <div className="edit-image-overlay">
                      <button
                        type="button"
                        className="edit-image-action view"
                        onClick={() => window.open(img, '_blank')}
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
                ))}
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
                    const info = utilityLabelMap[util] || { label: util, icon: 'check_circle' };
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
            onClick={() => navigate(`/admin/fields/${field._id}`)}
          >
            Hủy bỏ
          </button>
          <button type="submit" className="edit-btn-save">
            <span className="material-symbols-outlined">save</span>
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminFieldEditPage;

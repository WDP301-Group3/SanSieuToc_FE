import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
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

const AdminFieldCreatePage = () => {
  const navigate = useNavigate();

  /* ---------- Form state — all empty / default ---------- */
  const [fieldName, setFieldName] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyPrice, setHourlyPrice] = useState(0);
  const [slotDuration, setSlotDuration] = useState(60);
  const [openingTime, setOpeningTime] = useState('06:00');
  const [closingTime, setClosingTime] = useState('23:00');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedFieldTypeId, setSelectedFieldTypeId] = useState('');
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [status, setStatus] = useState(true); // default: available
  const [utilities, setUtilities] = useState([]);
  const [images, setImages] = useState([]);

  /* ---------- Derived ---------- */
  const availableFieldTypes = useMemo(() => {
    if (!selectedCategoryId) return mockFieldTypes;
    return mockFieldTypes.filter((ft) => ft.categoryID === selectedCategoryId);
  }, [selectedCategoryId]);

  /* ---------- Handlers ---------- */

  /** Toggle a utility on/off */
  const toggleUtility = (util) => {
    setUtilities((prev) =>
      prev.includes(util) ? prev.filter((u) => u !== util) : [...prev, util]
    );
  };

  /** Handle category change — auto-reset fieldType */
  const handleCategoryChange = (catId) => {
    setSelectedCategoryId(catId);
    const typesForCat = mockFieldTypes.filter((ft) => ft.categoryID === catId);
    if (typesForCat.length > 0) {
      setSelectedFieldTypeId(typesForCat[0]._id);
    } else {
      setSelectedFieldTypeId('');
    }
  };

  /** Remove an image from the list */
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /** Handle file upload (mock — create object URLs) */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newUrls]);
  };

  /** Format price with thousand separators */
  const formatPriceDisplay = (price) => {
    return Number(price).toLocaleString('vi-VN');
  };

  /** Handle price input — strip non-numeric chars */
  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setHourlyPrice(Number(raw) || 0);
  };

  /** Handle form submission (mock) */
  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedManager = mockManagers.find((m) => m._id === selectedManagerId);
    const selectedFieldType = mockFieldTypes.find((ft) => ft._id === selectedFieldTypeId);
    const selectedCategory = mockCategories.find((c) => c._id === selectedCategoryId);

    const newField = {
      _id: `field_new_${Date.now()}`,
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
      fieldType: selectedFieldType
        ? {
            _id: selectedFieldType._id,
            typeName: selectedFieldType.typeName,
            category: selectedCategory
              ? { _id: selectedCategory._id, categoryName: selectedCategory.categoryName }
              : null,
          }
        : null,
      manager: selectedManager
        ? {
            _id: selectedManager._id,
            name: selectedManager.name,
            phone: selectedManager.phone,
            image: selectedManager.image,
          }
        : null,
    };

    console.log('New field data:', newField);
    alert(`Tạo sân "${fieldName}" thành công!`);
    navigate('/admin/fields');
  };

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
                {/* Quận/Huyện */}
                <div className="edit-form-group">
                  <label className="edit-label">Quận/Huyện</label>
                  <select
                    className="edit-select"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn quận/huyện --</option>
                    {ALL_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
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
                    required
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
                    required
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
                    required
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
                    placeholder="Nhập mô tả về sân, tiện ích đi kèm (nước uống, áo tập, ...)..."
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

              {/* Dropzone upload area */}
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

              {/* Preview uploaded images */}
              {images.length > 0 && (
                <div className="edit-upload-list">
                  {images.map((img, index) => (
                    <div key={index} className="edit-upload-item">
                      <div
                        className="edit-upload-thumb"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                      <div className="edit-upload-info">
                        <p className="edit-upload-name">ảnh-sân-{index + 1}.jpg</p>
                        <p className="edit-upload-size">Đã tải lên</p>
                      </div>
                      <button
                        type="button"
                        className="edit-upload-remove"
                        onClick={() => removeImage(index)}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
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

              {/* Status Toggle */}
              <div className="edit-setting-row">
                <div>
                  <label className="edit-setting-label">Trạng thái sân</label>
                  <p className="edit-setting-hint">Tắt để đặt sân ở chế độ bảo trì</p>
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
          >
            Hủy bỏ
          </button>
          <button type="submit" className="edit-btn-save">
            <span className="material-symbols-outlined">add_circle</span>
            Thêm sân
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminFieldCreatePage;

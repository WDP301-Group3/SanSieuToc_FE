import { useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { mockFields, FIELD_STATUS } from '../../../data/mockData';
import '../../../styles/ManagerFieldDetailPage.css';

// Utility key → { icon, label }
const utilityMap = {
  'Wifi': { icon: 'wifi', label: 'Free Wifi' },
  'Parking': { icon: 'local_parking', label: 'Bãi giữ xe' },
  'Shower': { icon: 'shower', label: 'Phòng tắm' },
  'Changing Room': { icon: 'checkroom', label: 'Phòng thay đồ' },
  'Water': { icon: 'local_drink', label: 'Nước uống miễn phí' },
  'First Aid': { icon: 'medical_services', label: 'Y tế sơ cứu' },
  'Equipment Rental': { icon: 'sports', label: 'Cho thuê dụng cụ' },
  'Coaching': { icon: 'school', label: 'Huấn luyện viên' },
  'Cafe': { icon: 'local_cafe', label: 'Quán cà phê' },
  'Air Conditioning': { icon: 'ac_unit', label: 'Điều hòa' },
  'Snack Bar': { icon: 'restaurant', label: 'Canteen' },
  'Scoreboard': { icon: 'scoreboard', label: 'Bảng điểm' },
};

const statusMap = {
  [FIELD_STATUS.AVAILABLE]: { label: 'Đang hoạt động', className: 'active' },
  [FIELD_STATUS.MAINTENANCE]: { label: 'Bảo trì', className: 'maintenance' },
};

const ManagerFieldDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const field = useMemo(() => mockFields.find((f) => f._id === id), [id]);

  if (!field) {
    return (
      <div className="afd-page">
        <div className="afd-not-found">
          <span className="material-symbols-outlined afd-not-found-icon">search_off</span>
          <h2>Không tìm thấy sân</h2>
          <p>Sân không tồn tại hoặc đã bị xóa.</p>
          <Link to="/admin/fields" className="afd-btn-back">
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại danh sách sân
          </Link>
        </div>
      </div>
    );
  }

  const status = statusMap[field.status] || { label: 'Ngưng hoạt động', className: 'closed' };
  const typeName = field.fieldType?.typeName || '';
  const categoryName = field.fieldType?.category?.categoryName || '';
  const managerName = field.manager?.name || '';
  const managerPhone = field.manager?.phone || '';
  const images = field.image || [];
  const amenities = (field.utilities || []).map((u) => utilityMap[u] || { icon: 'check_circle', label: u });

  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  // Build specs list dynamically
  const specs = [
    { icon: 'sports_soccer', title: 'Loại sân', value: typeName },
    { icon: 'category', title: 'Môn thể thao', value: categoryName },
    { icon: 'schedule', title: 'Thời gian mở cửa', value: `${field.openingTime} - ${field.closingTime}` },
    { icon: 'timer', title: 'Thời lượng slot', value: `${field.slotDuration} phút` },
  ];

  return (
    <div className="afd-page">
      {/* Breadcrumbs */}
      <nav className="afd-breadcrumbs">
        <Link to="/admin/fields" className="afd-breadcrumb-link">
          <span className="material-symbols-outlined">grid_view</span>
          Quản lý sân
        </Link>
        <span className="material-symbols-outlined afd-breadcrumb-sep">chevron_right</span>
        <span className="afd-breadcrumb-current">Chi tiết sân</span>
      </nav>

      {/* Header */}
      <div className="afd-header">
        <div className="afd-header-info">
          <h1 className="afd-title">{field.fieldName}</h1>
          <div className="afd-subtitle">
            <span className="afd-location">
              <span className="material-symbols-outlined">location_on</span>
              {field.address}
            </span>
            <span className={`afd-status-badge ${status.className}`}>
              <span className="afd-status-dot" />
              {status.label}
            </span>
          </div>
        </div>
        <div className="afd-header-actions">
          <button className="afd-btn-secondary" onClick={() => navigate('/admin/fields')}>
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại
          </button>
          <Link to={`/admin/fields/${id}/edit`} className="afd-btn-primary">
            <span className="material-symbols-outlined">edit</span>
            Chỉnh sửa
          </Link>
        </div>
      </div>

      {/* Gallery */}
      <div className="afd-gallery">
        <div className="afd-gallery-main">
          {images[0] ? (
            <img src={images[0]} alt={field.fieldName} className="afd-gallery-img" />
          ) : (
            <div className="afd-gallery-placeholder">
              <span className="material-symbols-outlined">image</span>
              <p>Chưa có hình ảnh</p>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="afd-gallery-side">
            {images.slice(1, 4).map((img, idx) => (
              <div key={idx} className="afd-gallery-thumb">
                <img src={img} alt={`${field.fieldName} ${idx + 2}`} className="afd-gallery-img" />
              </div>
            ))}
            {images.length > 4 && (
              <div className="afd-gallery-thumb afd-gallery-more">
                <img src={images[4]} alt="" className="afd-gallery-img" />
                <div className="afd-gallery-overlay">
                  <span>+{images.length - 4} ảnh</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="afd-content-grid">
        {/* Left Column */}
        <div className="afd-left-col">
          {/* Description */}
          <section className="afd-section">
            <h2 className="afd-section-title">Thông tin chi tiết</h2>
            <p className="afd-description">{field.description}</p>
          </section>

          <hr className="afd-divider" />

          {/* Specs */}
          <section className="afd-section">
            <h3 className="afd-section-title">Thông số kỹ thuật</h3>
            <div className="afd-specs-grid">
              {specs.map((spec, idx) => (
                <div key={idx} className="afd-spec-card">
                  <div className="afd-spec-icon">
                    <span className="material-symbols-outlined">{spec.icon}</span>
                  </div>
                  <div>
                    <h4 className="afd-spec-label">{spec.title}</h4>
                    <p className="afd-spec-value">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Manager Info */}
          {managerName && (
            <>
              <hr className="afd-divider" />
              <section className="afd-section">
                <h3 className="afd-section-title">Quản lý sân</h3>
                <div className="afd-manager-card">
                  <div className="afd-manager-avatar">
                    {field.manager?.image ? (
                      <img src={field.manager.image} alt={managerName} />
                    ) : (
                      <span className="material-symbols-outlined">person</span>
                    )}
                  </div>
                  <div>
                    <h4 className="afd-manager-name">{managerName}</h4>
                    <p className="afd-manager-phone">
                      <span className="material-symbols-outlined">phone</span>
                      {managerPhone}
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <>
              <hr className="afd-divider" />
              <section className="afd-section">
                <h3 className="afd-section-title">Tiện ích đi kèm</h3>
                <div className="afd-amenities">
                  {amenities.map((a, idx) => (
                    <span key={idx} className="afd-amenity-tag">
                      <span className="material-symbols-outlined">{a.icon}</span>
                      {a.label}
                    </span>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="afd-right-col">
          <div className="afd-price-card">
            {/* Price */}
            <div className="afd-price-header">
              <div>
                <p className="afd-price-label">Giá thuê</p>
                <div className="afd-price-amount">
                  <span className="afd-price-value">{formatPrice(field.hourlyPrice)}</span>
                  <span className="afd-price-unit">/ giờ</span>
                </div>
              </div>
              <div className="afd-price-icon">
                <span className="material-symbols-outlined">payments</span>
              </div>
            </div>

            {/* Price tiers */}
            <div className="afd-price-tiers">
              <div className="afd-price-tier">
                <span>Giờ vàng (17h - 21h)</span>
                <span className="afd-price-tier-value">{formatPrice(Math.round(field.hourlyPrice * 1.3))}/h</span>
              </div>
              <div className="afd-price-tier">
                <span>Cuối tuần</span>
                <span className="afd-price-tier-value">+50.000đ/h</span>
              </div>
            </div>

            {/* Rules */}
            <div className="afd-rules">
              <h4 className="afd-rules-title">Quy định đặt sân</h4>
              <ul className="afd-rules-list">
                <li>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Đặt cọc tối thiểu 30% giá trị giờ thuê.</span>
                </li>
                <li>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Hủy sân trước 24h hoàn 100% cọc.</span>
                </li>
                <li>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Có mặt trước 15 phút để nhận sân.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="afd-card-actions">
              <button className="afd-btn-primary full">Quản lý lịch đặt</button>
              <button className="afd-btn-secondary full">Cập nhật giá</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerFieldDetailPage;

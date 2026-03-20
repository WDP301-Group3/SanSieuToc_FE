/**
 * @fileoverview FieldImageGallery - Component hiển thị gallery ảnh sân
 */

const FieldImageGallery = ({ images }) => {
  return (
    <div className="image-gallery">
      <div
        className="gallery-main"
        style={{ backgroundImage: `url(${images[0]})` }}
      />
      {images.slice(1, 4).map((img, idx) => (
        <div
          key={idx}
          className="gallery-thumb"
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      {images.length > 4 ? (
        <div className="gallery-thumb gallery-more" style={{ backgroundImage: `url(${images[4]})` }}>
          <div className="gallery-overlay">
            <span>+{images.length - 4} ảnh</span>
          </div>
        </div>
      ) : images.length <= 1 ? (
        <div className="gallery-thumb" style={{ background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>image</span>
        </div>
      ) : null}
    </div>
  );
};

export default FieldImageGallery;

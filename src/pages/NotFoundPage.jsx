import { Link, useNavigate } from 'react-router-dom';
import '../styles/NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-icon">
          <span className="material-symbols-outlined">search_off</span>
        </div>
        <h1 className="notfound-title">404</h1>
        <p className="notfound-message">Trang không tồn tại</p>
        <p className="notfound-sub">Đường dẫn bạn truy cập không hợp lệ hoặc đã bị xóa.</p>
        <div className="notfound-actions">
          <button
            type="button"
            className="notfound-button-back"
            onClick={() => navigate(-1)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại
          </button>
          <Link to="/" className="notfound-button">
            <span className="material-symbols-outlined">home</span>
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-message">
          Trang không tồn tại
        </p>
        <Link to="/" className="notfound-button">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

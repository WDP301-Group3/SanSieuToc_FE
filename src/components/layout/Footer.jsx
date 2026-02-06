import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                alt="Sân Siêu Tốc Logo"
                className="h-16 w-16 object-contain"
                src={logo}
              />
              <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
                Sân Siêu Tốc
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Hệ thống đặt sân thể thao số 1 Việt Nam. Nhanh chóng, tiện lợi và uy tín.
            </p>
            <div className="flex space-x-4">
              <a
                className="text-gray-400 hover:text-[#00E536] transition-colors"
                href="#"
                aria-label="Facebook"
              >
                <i className="material-icons-outlined">facebook</i>
              </a>
              <a
                className="text-gray-400 hover:text-[#00E536] transition-colors"
                href="#"
                aria-label="Instagram"
              >
                <i className="material-icons-outlined">camera_alt</i>
              </a>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link className="footer-link" to="/about">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/careers">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/terms">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/privacy">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* For Field Owners */}
          <div className="footer-section">
            <h3 className="footer-section-title">Dành cho chủ sân</h3>
            <ul className="footer-section-list">
              <li>
                <Link className="footer-link" to="/register-field">
                  Đăng ký sân
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/management-software">
                  Phần mềm quản lý
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/pricing">
                  Bảng giá dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h3 className="footer-section-title">Liên hệ</h3>
            <ul className="footer-section-list">
              <li className="footer-contact-item">
                <span className="material-icons-outlined text-sm">email</span>
                support@sansieutoc.vn
              </li>
              <li className="footer-contact-item">
                <span className="material-icons-outlined text-sm">phone</span>
                1900 1234
              </li>
              <li className="footer-contact-item">
                <span className="material-icons-outlined text-sm">place</span>
                Hà Nội, Việt Nam
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2023 Sân Siêu Tốc. All rights reserved.
          </p>
          <div className="footer-powered">
            <span className="footer-powered-text">Powered by</span>
            <span className="footer-powered-brand">
              Tailwind CSS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

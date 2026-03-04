import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/TermsPage.css';

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState('general-terms');
  const [navHidden, setNavHidden] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    // Watch navbar hidden state
    const checkNavbar = () => {
      const nav = document.querySelector('.header-nav');
      if (nav) {
        setNavHidden(nav.classList.contains('header-hidden'));
      }
    };

    const navObserver = new MutationObserver(checkNavbar);
    const nav = document.querySelector('.header-nav');
    if (nav) {
      navObserver.observe(nav, { attributes: true, attributeFilter: ['class'] });
    }

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      navObserver.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const sidebarLinks = [
    { id: 'general-terms', icon: 'gavel', label: 'Điều khoản chung' },
    { id: 'booking-policy', icon: 'event_available', label: 'Quy định đặt sân' },
    { id: 'refund-policy', icon: 'payments', label: 'Thanh toán & Hoàn phí' },
    { id: 'privacy-policy', icon: 'verified_user', label: 'An toàn & Bảo mật' },
    { id: 'community-rules', icon: 'groups', label: 'Quy tắc cộng đồng' },
  ];

  return (
    <main className="terms-page">
      

      {/* Page Header */}
      <div className="terms-header">
        <h1 className="terms-title" style={{ color: '#1e8d38ff' }}>Điều khoản sử dụng</h1>
        <p className="terms-meta">
          <span className="material-symbols-outlined terms-meta-icon">calendar_today</span>
          Cập nhật lần cuối: 30 tháng 01, 2026
        </p>
      </div>

      <div className="terms-container">
        {/* Sidebar Navigation */}
        <aside className={`terms-sidebar ${navHidden ? 'nav-hidden' : ''}`}>
          <div className="terms-sidebar-sticky">
            <p className="terms-sidebar-label">MỤC LỤC</p>
            <nav className="terms-nav-list">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`terms-nav-link ${activeSection === link.id ? 'active' : ''}`}
                >
                  <span className="material-symbols-outlined terms-nav-icon">{link.icon}</span>
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <article className="terms-content">
          {/* Section 1: Điều khoản chung */}
          <section id="general-terms" className="terms-section">
            <h2 className="terms-section-title">
              <span className="material-icons-outlined terms-section-icon">info</span>
              1. Điều khoản chung
            </h2>
            <div className="terms-section-content">
              <p>
                Chào mừng bạn đến với Sân Siêu Tốc. Bằng việc truy cập và sử dụng dịch vụ của chúng
                tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu tại đây.
              </p>
              <ul>
                <li>Dịch vụ của chúng tôi chỉ dành cho cá nhân từ 15 tuổi trở lên.</li>
                <li>Người dùng có trách nhiệm bảo mật thông tin tài khoản cá nhân.</li>
                <li>
                  Sân Siêu Tốc có quyền thay đổi nội dung chính sách này bất kỳ lúc nào mà không cần
                  thông báo trước.
                </li>
              </ul>
            </div>
          </section>

          <hr className="terms-section-divider" />

          {/* Section 2: Booking Policy */}
          <section id="booking-policy" className="terms-section">
            <h2 className="terms-section-title">
              <span className="terms-section-icon-wrapper green">
                <span className="material-symbols-outlined">event_available</span>
              </span>
              2. Quy định đặt sân
            </h2>
            <div className="terms-section-body">
              <p>
                Để đảm bảo công bằng cho tất cả các vận động viên và chủ sân, quy trình đặt sân được
                quy định nghiêm ngặt như sau:
              </p>

              <h3 className="terms-subsection-title">
                Quy trình đặt sân
              </h3>
              <ul>
                <li>
                  Người dùng chọn sân, khung giờ và thực hiện thanh toán đặt cọc (nếu có).
                </li>
                <li>
                  Lịch đặt chỉ được xác nhận khi bạn nhận được thông báo "Thành công" qua ứng
                  dụng/email.
                </li>
                <li>Mỗi tài khoản không được đặt quá 3 sân trong cùng một khung giờ.</li>
              </ul>

              <h3 className="terms-subsection-title">
                Trách nhiệm của người chơi
              </h3>
              <p>
                Người chơi cần có mặt tại sân ít nhất 10 phút trước giờ bắt đầu. Trong trường hợp đến
                muộn quá 15 phút mà không thông báo, chủ sân có quyền cho thuê lại sân đó cho đối
                tượng khác.
              </p>
            </div>
          </section>

          {/* Section 3: Thanh toán & Hoàn phí */}
          <section id="refund-policy" className="terms-section">
            <h2 className="terms-section-title">
              <span className="terms-section-icon-wrapper orange">
                <span className="material-symbols-outlined">payments</span>
              </span>
              3. Thanh toán & Hoàn phí
            </h2>
            <div className="terms-section-body">
              <p>
                Sân Siêu Tốc hỗ trợ đa dạng phương thức thanh toán từ ví điện tử đến chuyển khoản
                ngân hàng nhằm tối ưu hóa sự tiện lợi.
              </p>

              <div className="terms-refund-cards">
                <div className="terms-refund-card">
                  <p className="terms-refund-time">Hủy trước 24h</p>
                  <p className="terms-refund-percent green">Hoàn 100% tiền cọc</p>
                </div>
                <div className="terms-refund-card">
                  <p className="terms-refund-time">Hủy từ 12h - 24h</p>
                  <p className="terms-refund-percent orange">Hoàn 50% tiền cọc</p>
                </div>
              </div>

              <p className="terms-note">
                <em>
                  Lưu ý: Các trường hợp bất khả kháng như thiên tai hoặc sự cố kỹ thuật từ phía chủ sân
                  sẽ được hệ thống xem xét hoàn trả toàn bộ chi phí trong vòng 24-48 giờ làm việc.
                </em>
              </p>
            </div>
          </section>

          {/* Section 4: An toàn & Bảo mật */}
          <section id="privacy-policy" className="terms-section">
            <h2 className="terms-section-title">
              <span className="terms-section-icon-wrapper purple">
                <span className="material-symbols-outlined">verified_user</span>
              </span>
              4. An toàn & Bảo mật
            </h2>
            <div className="terms-section-body">
              <p>
                Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn theo tiêu chuẩn an toàn cao nhất.
              </p>

              <h3 className="terms-subsection-title">
                Thông tin thu thập
              </h3>
              <p>
                Chúng tôi thu thập các thông tin bao gồm: Họ tên, số điện thoại, email và vị trí GPS
                (khi được phép) để gợi ý các sân gần nhất.
              </p>

              <h3 className="terms-subsection-title">
                Sử dụng thông tin
              </h3>
              <ul>
                <li>Xác nhận lịch đặt sân và thông báo các thay đổi.</li>
                <li>Cải thiện chất lượng dịch vụ và cá nhân hóa trải nghiệm.</li>
                <li>
                  Không cung cấp thông tin cho bên thứ ba ngoại trừ các đối tác vận hành sân bãi liên
                  quan.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Quy tắc cộng đồng */}
          <section id="community-rules" className="terms-section">
            <h2 className="terms-section-title">
              <span className="terms-section-icon-wrapper teal">
                <span className="material-symbols-outlined">groups</span>
              </span>
              5. Quy tắc cộng đồng
            </h2>
            <div className="terms-section-body">
              <p>
                Chúng tôi mong muốn xây dựng một cộng đồng thể thao văn minh, nơi tinh thần fair-play
                được đặt lên hàng đầu:
              </p>
              <ul className="terms-bullet-list">
                <li>Tôn trọng các vận động viên khác và nhân viên quản lý tại sân.</li>
                <li>Giữ gìn vệ sinh chung, không mang chất cấm hoặc vật dụng nguy hiểm vào khu vực thi đấu.</li>
                <li>Tuyệt đối không sử dụng phần mềm can thiệp (bots) để tranh giành lịch đặt sân.</li>
              </ul>
            </div>
          </section>

          {/* Contact Info */}
          <div className="terms-highlight">
            <p className="terms-highlight-content">
              <span className="material-icons-outlined" style={{ fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>info</span>
              Nếu bạn có bất kỳ câu hỏi nào về các chính sách này, vui lòng liên hệ với chúng tôi
              qua hotline{' '}
              <span className="terms-contact-link">1900 1234</span> hoặc email{' '}
              <span className="terms-contact-link">legal@sansieutoc.vn</span>.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default TermsPage;

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
              <span className="terms-section-icon-wrapper blue">
                <span className="material-symbols-outlined">gavel</span>
              </span>
              1. Điều khoản chung
            </h2>
            <div className="terms-section-body">
              <p>
                Chào mừng quý khách đến với Sân Siêu Tốc. Bằng cách sử dụng ứng dụng và dịch vụ
                của chúng tôi, bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản
                dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui
                lòng không sử dụng dịch vụ của chúng tôi.
              </p>
              <ul className="terms-bullet-list">
                <li>
                  Dịch vụ của chúng tôi được cung cấp cho người dùng từ 15 tuổi trở lên hoặc có sự giám sát của
                  người bảo hộ.
                </li>
                <li>
                  Tài khoản người dùng là duy nhất và không được chia sẻ cho bên thứ ba vì mục đích thương
                  mại trái phép.
                </li>
                <li>
                  Chúng tôi có quyền tạm ngưng cung cấp dịch vụ đối với các tài khoản vi phạm các quy định về
                  văn hóa thể thao.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Quy định đặt sân */}
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

              <div className="terms-info-box">
                <h4 className="terms-info-box-title">Quy trình chuẩn:</h4>
                <p>
                  Người dùng chọn loại sân (Bóng đá, Cầu lông, Tennis), chọn khung giờ trống và
                  thực hiện xác nhận. Hệ thống sẽ giữ chỗ trong vòng 10 phút để người dùng hoàn
                  tất thủ tục cọc phí.
                </p>
              </div>

              <ul className="terms-bullet-list">
                <li>Mỗi người dùng không được đặt quá 3 khung giờ cùng lúc tại một cơ sở thể thao.</li>
                <li>Thông tin đặt sân chỉ có hiệu lực khi trạng thái đơn hàng hiển thị &quot;Đã xác nhận&quot;.</li>
                <li>Việc đến muộn quá 15 phút mà không thông báo sẽ được coi là &quot;Vắng mặt&quot; (No-show).</li>
              </ul>
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
                Sự an toàn của thông tin khách hàng là ưu tiên hàng đầu của chúng tôi. Chúng tôi sử
                dụng các công nghệ mã hóa chuẩn quốc tế để bảo vệ dữ liệu của bạn.
              </p>
              <ul className="terms-bullet-list">
                <li>Dữ liệu cá nhân chỉ được sử dụng cho mục đích xác thực đặt sân và liên lạc khẩn cấp.</li>
                <li>Chúng tôi không lưu trữ thông tin thẻ tín dụng/thanh toán trực tiếp trên máy chủ của mình.</li>
                <li>Người dùng có quyền yêu cầu xóa bỏ vĩnh viễn dữ liệu tài khoản bất kỳ lúc nào.</li>
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

          {/* Support CTA */}
          <div className="terms-support-cta">
            <div className="terms-support-icon">
              <span className="material-symbols-outlined">support_agent</span>
            </div>
            <h3 className="terms-support-title">Bạn cần hỗ trợ thêm?</h3>
            <p className="terms-support-desc">
              Nếu bạn có bất kỳ thắc mắc về các điều khoản trên, hãy liên hệ trực tiếp
              qua các kênh dưới đây, chúng tôi luôn sẵn sàng hỗ trợ 24/7.
            </p>
            <div className="terms-support-actions">
              <a href="tel:19001234" className="terms-support-btn phone">
                <span className="material-symbols-outlined">call</span>
                1900 1234
              </a>
              <a href="mailto:support@sansieutoc.vn" className="terms-support-btn email">
                <span className="material-symbols-outlined">mail</span>
                support@sansieutoc.vn
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
};

export default TermsPage;

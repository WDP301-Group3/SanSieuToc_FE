import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState('general-terms');

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Intersection Observer for sidebar active state
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
    { id: 'refund-policy', icon: 'payments', label: 'Hủy lịch & Hoàn tiền' },
    { id: 'privacy-policy', icon: 'verified_user', label: 'Chính sách bảo mật' },
    { id: 'community-rules', icon: 'groups', label: 'Quy tắc cộng đồng' },
  ];

  return (
    <main className="terms-page">
      {/* Page Header */}
      <div className="terms-header">
        <h1 className="terms-title">
          Điều khoản sử dụng
        </h1>
        <p className="terms-meta">
          Cập nhật lần cuối: 30 tháng 01, 2026
        </p>
      </div>

      <div className="terms-container">
        {/* Sidebar Navigation */}
        <aside className="terms-sidebar">
          <div className="terms-sidebar-sticky">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`terms-nav-link ${activeSection === link.id ? 'active' : ''}`}
              >
                <span className="material-icons-outlined">{link.icon}</span>
                {link.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <article className="terms-content">
          {/* Section 1: General Terms */}
          <section id="general-terms" className="terms-section">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
              <span className="material-icons-outlined text-primary">info</span>
              1. Điều khoản chung
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Chào mừng bạn đến với Sân Siêu Tốc. Bằng việc truy cập và sử dụng dịch vụ của chúng
              tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu tại đây.
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-gray-600 dark:text-gray-300">
              <li>Dịch vụ của chúng tôi chỉ dành cho cá nhân từ 15 tuổi trở lên.</li>
              <li>Người dùng có trách nhiệm bảo mật thông tin tài khoản cá nhân.</li>
              <li>
                Sân Siêu Tốc có quyền thay đổi nội dung chính sách này bất kỳ lúc nào mà không cần
                thông báo trước.
              </li>
            </ul>
          </section>

          <hr className="my-8 border-gray-100 dark:border-green-900" />

          {/* Section 2: Booking Policy */}
          <section id="booking-policy" className="terms-section">
            <h2 className="terms-section-title">
              <span className="material-icons-outlined terms-section-icon">calendar_month</span>
              2. Quy định đặt sân
            </h2>
            <div className="terms-section-content">
              <p>
                Để đảm bảo trải nghiệm tốt nhất cho mọi người dùng, chúng tôi áp dụng các quy tắc
                đặt sân sau:
              </p>

              <h3>
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

              <h3>
                Trách nhiệm của người chơi
              </h3>
              <p>
                Người chơi cần có mặt tại sân ít nhất 10 phút trước giờ bắt đầu. Trong trường hợp đến
                muộn quá 15 phút mà không thông báo, chủ sân có quyền cho thuê lại sân đó cho đối
                tượng khác.
              </p>
            </div>
          </section>

          <hr className="terms-section-divider" />

          {/* Section 3: Refund Policy */}
          <section id="refund-policy" className="terms-section">
            <h2 className="terms-section-title">
              <span className="material-icons-outlined terms-section-icon">undo</span>
              3. Hủy lịch & Hoàn tiền
            </h2>
            <div className="terms-section-content">
              <p>
                Chính sách hủy lịch được thiết kế để bảo vệ quyền lợi của cả người chơi và chủ sân:
              </p>
              <ul>
                <li>
                  <strong>Hủy trước 24 giờ:</strong> Hoàn lại 100% tiền cọc vào ví Sân Siêu Tốc.
                </li>
                <li>
                  <strong>Hủy từ 12 - 24 giờ:</strong> Hoàn lại 50% tiền cọc.
                </li>
                <li>
                  <strong>Hủy dưới 12 giờ:</strong> Không được hoàn lại tiền cọc.
                </li>
                <li>
                  Trường hợp bất khả kháng (thiên tai, dịch bệnh): Hoàn trả toàn bộ phí theo quyết
                  định của ban quản lý.
                </li>
              </ul>
            </div>
          </section>

          <hr className="terms-section-divider" />

          {/* Section 4: Privacy Policy */}
          <section id="privacy-policy" className="terms-section">
            <h2 className="terms-section-title">
              <span className="material-icons-outlined terms-section-icon">security</span>
              4. Chính sách bảo mật
            </h2>
            <div className="terms-section-content">
              <p>
                Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn theo tiêu chuẩn an toàn cao nhất.
              </p>

              <h3>
                Thông tin thu thập
              </h3>
              <p>
                Chúng tôi thu thập các thông tin bao gồm: Họ tên, số điện thoại, email và vị trí GPS
                (khi được phép) để gợi ý các sân gần nhất.
              </p>

              <h3>
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

          <hr className="terms-section-divider" />

          {/* Section 5: Community Rules */}
          <section id="community-rules" className="terms-section">
            <h2 className="terms-section-title">
              <span className="material-icons-outlined terms-section-icon">sentiment_satisfied</span>
              5. Quy tắc cộng đồng
            </h2>
            <div className="terms-section-content">
              <p>
                Xây dựng cộng đồng thể thao văn minh, chuyên nghiệp:
              </p>
              <ul>
                <li>Không gây gổ, mất trật tự tại các cơ sở thể thao.</li>
                <li>Giữ gìn vệ sinh chung và bảo quản trang thiết bị của sân.</li>
                <li>
                  Nghiêm cấm các hành vi gian lận trong việc đặt lịch hoặc đánh giá dịch vụ.
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Info */}
          <div className="terms-highlight">
            <p className="terms-highlight-content">
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

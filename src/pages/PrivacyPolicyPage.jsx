import { useState, useEffect } from 'react';
import '../styles/PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

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
    { id: 'overview', icon: 'info', label: 'Tổng quan' },
    { id: 'data-collection', icon: 'storage', label: 'Thu thập dữ liệu' },
    { id: 'data-usage', icon: 'settings', label: 'Sử dụng dữ liệu' },
    { id: 'data-security', icon: 'security', label: 'Bảo mật dữ liệu' },
    { id: 'user-rights', icon: 'account_circle', label: 'Quyền của bạn' },
    { id: 'cookies', icon: 'cookie', label: 'Cookies & Tracking' },
  ];

  return (
    <main className="privacy-page">
      {/* Page Header */}
      <div className="privacy-header">
        <h1 className="privacy-title">
          Chính sách bảo mật
        </h1>
        <p className="privacy-meta">
          Có hiệu lực từ: 01 tháng 02, 2026 | Cập nhật: 04 tháng 02, 2026
        </p>
      </div>

      <div className="privacy-container">
        {/* Sidebar Navigation */}
        <aside className="privacy-sidebar">
          <div className="privacy-sidebar-sticky">
            <h3 className="privacy-sidebar-title">Nội dung</h3>
            <nav>
              <ul className="privacy-nav-list">
                {sidebarLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className={`privacy-nav-link ${activeSection === link.id ? 'active' : ''}`}
                    >
                      <span className="material-icons-outlined">{link.icon}</span>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="privacy-mobile-nav">
          <select
            value={activeSection}
            onChange={(e) => scrollToSection(e.target.value)}
            className="privacy-mobile-select"
          >
            {sidebarLinks.map((link) => (
              <option key={link.id} value={link.id}>
                {link.label}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <article className="privacy-content">
          {/* Section 1: Overview */}
          <section id="overview" className="privacy-section">
            <h2 className="privacy-section-title">
              <span className="material-icons-outlined privacy-section-icon">info</span>
              Tổng quan
            </h2>
            <div className="privacy-section-content">
              <p>
                Tại <strong>Sân Siêu Tốc</strong>, chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. 
                Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn 
                khi sử dụng dịch vụ đặt sân thể thao của chúng tôi.
              </p>
              <p>
                Bằng việc sử dụng nền tảng Sân Siêu Tốc, bạn đồng ý với các điều khoản trong chính sách này. 
                Nếu bạn không đồng ý, vui lòng ngừng sử dụng dịch vụ của chúng tôi.
              </p>

              <div className="privacy-info-box">
                <p className="privacy-info-title">
                  <span className="material-icons-outlined">verified_user</span>
                  Cam kết của chúng tôi
                </p>
                <p className="privacy-info-content">
                  Chúng tôi tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu cá nhân tại Việt Nam 
                  và các tiêu chuẩn quốc tế như GDPR. Dữ liệu của bạn sẽ KHÔNG BAO GIỜ được bán cho bên thứ ba.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Data Collection */}
          <section id="data-collection" className="privacy-section">
            <h2 className="privacy-section-title">
              <span className="material-icons-outlined privacy-section-icon">storage</span>
              Thu thập dữ liệu
            </h2>
            <div className="privacy-section-content">
              <p>Chúng tôi thu thập các loại thông tin sau:</p>

              <h3>1. Thông tin cá nhân</h3>
              <p>Khi bạn đăng ký tài khoản hoặc đặt sân, chúng tôi thu thập:</p>
              <ul>
                <li>Họ và tên</li>
                <li>Địa chỉ email</li>
                <li>Số điện thoại</li>
                <li>Địa chỉ (nếu cần giao hàng)</li>
                <li>Thông tin thanh toán (được mã hóa)</li>
              </ul>

              <h3>2. Thông tin tự động</h3>
              <p>Khi bạn sử dụng website/ứng dụng, chúng tôi tự động thu thập:</p>
              <ul>
                <li>Địa chỉ IP</li>
                <li>Loại trình duyệt và thiết bị</li>
                <li>Hệ điều hành</li>
                <li>Vị trí địa lý (với sự cho phép của bạn)</li>
                <li>Lịch sử tìm kiếm và đặt sân</li>
                <li>Cookies và dữ liệu phiên</li>
              </ul>

              <h3>3. Thông tin từ bên thứ ba</h3>
              <p>Nếu bạn đăng nhập bằng tài khoản mạng xã hội (Google, Facebook), chúng tôi nhận được:</p>
              <ul>
                <li>Tên công khai</li>
                <li>Email</li>
                <li>Ảnh đại diện</li>
              </ul>

              <div className="privacy-data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Loại dữ liệu</th>
                      <th>Mục đích</th>
                      <th>Thời gian lưu trữ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Thông tin tài khoản</td>
                      <td>Quản lý tài khoản, xác thực</td>
                      <td>Đến khi xóa tài khoản</td>
                    </tr>
                    <tr>
                      <td>Lịch sử đặt sân</td>
                      <td>Quản lý booking, hỗ trợ khách hàng</td>
                      <td>3 năm</td>
                    </tr>
                    <tr>
                      <td>Dữ liệu thanh toán</td>
                      <td>Xử lý giao dịch, hoàn tiền</td>
                      <td>7 năm (theo luật)</td>
                    </tr>
                    <tr>
                      <td>Analytics & Cookies</td>
                      <td>Cải thiện trải nghiệm người dùng</td>
                      <td>13 tháng</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 3: Data Usage */}
          <section id="data-usage" className="privacy-section">
            <h2 className="privacy-section-title">
              <span className="material-icons-outlined privacy-section-icon">settings</span>
              Sử dụng dữ liệu
            </h2>
            <div className="privacy-section-content">
              <p>Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:</p>

              <h3>Cung cấp dịch vụ</h3>
              <ul>
                <li>Xử lý đặt sân và thanh toán</li>
                <li>Gửi xác nhận booking qua email/SMS</li>
                <li>Thông báo thay đổi lịch hoặc hủy sân</li>
                <li>Hỗ trợ khách hàng qua chat/email/phone</li>
              </ul>

              <h3>Cải thiện trải nghiệm</h3>
              <ul>
                <li>Gợi ý sân phù hợp dựa trên vị trí và lịch sử</li>
                <li>Cá nhân hóa nội dung và quảng cáo</li>
                <li>Phân tích hành vi người dùng để tối ưu hóa giao diện</li>
                <li>Phát triển tính năng mới</li>
              </ul>

              <h3>Bảo mật và tuân thủ</h3>
              <ul>
                <li>Phát hiện và ngăn chặn gian lận</li>
                <li>Bảo vệ tài khoản khỏi truy cập trái phép</li>
                <li>Tuân thủ các yêu cầu pháp lý</li>
                <li>Giải quyết tranh chấp</li>
              </ul>

              <div className="privacy-warning-box">
                <p className="privacy-warning-title">
                  <span className="material-icons-outlined">warning</span>
                  Chia sẻ với bên thứ ba
                </p>
                <p className="privacy-warning-content">
                  Chúng tôi CHỈ chia sẻ dữ liệu với: (1) Chủ sân để xác nhận booking, 
                  (2) Đối tác thanh toán (VNPay, Momo) để xử lý giao dịch, 
                  (3) Nhà cung cấp dịch vụ cloud (AWS) để lưu trữ, 
                  (4) Cơ quan chức năng khi có yêu cầu hợp pháp.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Data Security */}
          <section id="data-security" className="privacy-section">
            <h2 className="privacy-section-title">
              <span className="material-icons-outlined privacy-section-icon">security</span>
              Bảo mật dữ liệu
            </h2>
            <div className="privacy-section-content">
              <p>
                Chúng tôi áp dụng các biện pháp bảo mật hàng đầu để bảo vệ dữ liệu của bạn:
              </p>

              <div className="privacy-security-box">
                <p className="privacy-security-title">
                  <span className="material-icons-outlined">lock</span>
                  Biện pháp kỹ thuật
                </p>
                <p className="privacy-security-content">
                  ✅ Mã hóa SSL/TLS 256-bit cho tất cả truyền tải dữ liệu<br />
                  ✅ Mã hóa AES-256 cho dữ liệu lưu trữ<br />
                  ✅ Xác thực hai yếu tố (2FA) cho tài khoản<br />
                  ✅ Firewall và hệ thống phát hiện xâm nhập (IDS)<br />
                  ✅ Sao lưu dữ liệu hàng ngày
                </p>
              </div>

              <h3>Kiểm soát truy cập</h3>
              <ul>
                <li>Chỉ nhân viên được ủy quyền mới có quyền truy cập dữ liệu</li>
                <li>Tất cả truy cập đều được ghi log và giám sát</li>
                <li>Đào tạo nhân viên về bảo mật thường xuyên</li>
              </ul>

              <h3>Phản ứng sự cố</h3>
              <p>
                Trong trường hợp xảy ra vi phạm dữ liệu, chúng tôi sẽ:
              </p>
              <ul>
                <li>Thông báo cho bạn trong vòng 72 giờ</li>
                <li>Giải thích phạm vi vi phạm và dữ liệu bị ảnh hưởng</li>
                <li>Cung cấp hướng dẫn bảo vệ tài khoản</li>
                <li>Báo cáo cho cơ quan có thẩm quyền nếu cần</li>
              </ul>
            </div>
          </section>

          {/* Section 5: User Rights */}
          <section id="user-rights" className="privacy-section">
            <h2 className="privacy-section-title">
              <span className="material-icons-outlined privacy-section-icon">account_circle</span>
              Quyền của bạn
            </h2>
            <div className="privacy-section-content">
              <p>Bạn có các quyền sau đối với dữ liệu cá nhân của mình:</p>

              <div className="privacy-rights-grid">
                <div className="privacy-rights-card">
                  <div className="privacy-rights-card-icon">
                    <span className="material-icons-outlined">visibility</span>
                  </div>
                  <h4 className="privacy-rights-card-title">Quyền truy cập</h4>
                  <p className="privacy-rights-card-desc">
                    Yêu cầu xem dữ liệu cá nhân mà chúng tôi đang lưu trữ về bạn.
                  </p>
                </div>

                <div className="privacy-rights-card">
                  <div className="privacy-rights-card-icon">
                    <span className="material-icons-outlined">edit</span>
                  </div>
                  <h4 className="privacy-rights-card-title">Quyền sửa đổi</h4>
                  <p className="privacy-rights-card-desc">
                    Cập nhật hoặc sửa thông tin cá nhân không chính xác.
                  </p>
                </div>

                <div className="privacy-rights-card">
                  <div className="privacy-rights-card-icon">
                    <span className="material-icons-outlined">delete</span>
                  </div>
                  <h4 className="privacy-rights-card-title">Quyền xóa</h4>
                  <p className="privacy-rights-card-desc">
                    Yêu cầu xóa dữ liệu cá nhân (trừ dữ liệu bắt buộc theo luật).
                  </p>
                </div>

                <div className="privacy-rights-card">
                  <div className="privacy-rights-card-icon">
                    <span className="material-icons-outlined">download</span>
                  </div>
                  <h4 className="privacy-rights-card-title">Quyền xuất dữ liệu</h4>
                  <p className="privacy-rights-card-desc">
                    Tải xuống dữ liệu của bạn dưới định dạng JSON/CSV.
                  </p>
                </div>

                <div className="privacy-rights-card">
                  <div className="privacy-rights-card-icon">
                    <span className="material-icons-outlined">block</span>
                  </div>
                  <h4 className="privacy-rights-card-title">Quyền phản đối</h4>
                  <p className="privacy-rights-card-desc">
                    Từ chối xử lý dữ liệu cho mục đích marketing hoặc profiling.
                  </p>
                </div>

                <div className="privacy-rights-card">
                  <div className="privacy-rights-card-icon">
                    <span className="material-icons-outlined">gavel</span>
                  </div>
                  <h4 className="privacy-rights-card-title">Quyền khiếu nại</h4>
                  <p className="privacy-rights-card-desc">
                    Gửi khiếu nại đến cơ quan bảo vệ dữ liệu nếu cần.
                  </p>
                </div>
              </div>

              <p>
                Để thực hiện các quyền trên, vui lòng liên hệ:{' '}
                <a href="mailto:privacy@sansieutoc.vn" className="privacy-contact-link">
                  privacy@sansieutoc.vn
                </a>
              </p>
            </div>
          </section>

          {/* Section 6: Cookies */}
          <section id="cookies" className="privacy-section">
            <h2 className="privacy-section-title">
              <span className="material-icons-outlined privacy-section-icon">cookie</span>
              Cookies & Tracking
            </h2>
            <div className="privacy-section-content">
              <p>
                Chúng tôi sử dụng cookies và các công nghệ tracking tương tự để cải thiện trải nghiệm của bạn.
              </p>

              <h3>Các loại cookies</h3>
              <ul>
                <li>
                  <strong>Cookies cần thiết:</strong> Giúp website hoạt động (đăng nhập, giỏ hàng). 
                  Không thể tắt.
                </li>
                <li>
                  <strong>Cookies chức năng:</strong> Ghi nhớ preferences (ngôn ngữ, theme). 
                  Có thể tắt.
                </li>
                <li>
                  <strong>Cookies phân tích:</strong> Google Analytics để hiểu cách bạn sử dụng site. 
                  Có thể tắt.
                </li>
                <li>
                  <strong>Cookies marketing:</strong> Hiển thị quảng cáo phù hợp. 
                  Có thể tắt.
                </li>
              </ul>

              <h3>Quản lý cookies</h3>
              <p>
                Bạn có thể quản lý cookies qua:
              </p>
              <ul>
                <li>Cài đặt trình duyệt (Chrome, Firefox, Safari)</li>
                <li>Banner "Cookie Settings" trên website</li>
                <li>Trang cài đặt tài khoản</li>
              </ul>

              <div className="privacy-info-box">
                <p className="privacy-info-title">
                  <span className="material-icons-outlined">info</span>
                  Lưu ý
                </p>
                <p className="privacy-info-content">
                  Tắt cookies có thể ảnh hưởng đến trải nghiệm sử dụng website 
                  (ví dụ: phải đăng nhập lại mỗi lần truy cập).
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <div className="privacy-contact-section">
            <div className="privacy-contact-icon">
              <span className="material-icons-outlined">support_agent</span>
            </div>
            <h3 className="privacy-contact-title">Có câu hỏi về quyền riêng tư?</h3>
            <p className="privacy-contact-desc">
              Đội ngũ bảo mật của chúng tôi luôn sẵn sàng hỗ trợ bạn.
            </p>
            <a href="mailto:privacy@sansieutoc.vn" className="privacy-contact-btn">
              <span className="material-icons-outlined">email</span>
              Liên hệ ngay
            </a>
          </div>

          {/* Footer */}
          <div className="privacy-footer">
            <p className="privacy-footer-text">
              Chính sách này có hiệu lực từ ngày 01/02/2026 và được cập nhật lần cuối vào 04/02/2026. 
              Chúng tôi có quyền thay đổi chính sách này bất kỳ lúc nào. 
              Thay đổi quan trọng sẽ được thông báo qua email.
            </p>
          </div>
        </article>
      </div>

      {/* Back to Top Button */}
      <button className="privacy-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <span className="material-icons-outlined">arrow_upward</span>
      </button>
    </main>
  );
};

export default PrivacyPolicyPage;

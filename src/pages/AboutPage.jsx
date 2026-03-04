/**
 * AboutPage - Trang giới thiệu về Sân Siêu Tốc
 */
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../styles/AboutPage.css';

const AboutPage = () => {
  const { t } = useTranslation();

  // Team members data
  const teamMembers = [
    {
      name: 'Nguyễn Văn A',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      description: 'Với hơn 10 năm kinh nghiệm trong lĩnh vực thể thao và công nghệ.',
    },
    {
      name: 'Trần Thị B',
      role: 'Co-Founder & CTO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
      description: 'Chuyên gia công nghệ với đam mê xây dựng sản phẩm số.',
    },
    {
      name: 'Lê Văn C',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      description: 'Đảm bảo vận hành mượt mà cho hệ thống toàn quốc.',
    },
    {
      name: 'Phạm Thị D',
      role: 'Customer Success Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      description: 'Luôn đặt trải nghiệm khách hàng lên hàng đầu.',
    },
  ];

  // Core values
  const coreValues = [
    {
      icon: 'speed',
      title: 'Nhanh chóng',
      description: 'Đặt sân chỉ trong 30 giây với hệ thống tối ưu.',
    },
    {
      icon: 'verified',
      title: 'Uy tín',
      description: 'Đảm bảo chất lượng sân và dịch vụ cam kết.',
    },
    {
      icon: 'support_agent',
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc.',
    },
    {
      icon: 'diversity_3',
      title: 'Cộng đồng',
      description: 'Kết nối hàng nghìn người yêu thể thao trên toàn quốc.',
    },
  ];

  // Milestones
  const milestones = [
    { year: '2020', event: 'Sân Siêu Tốc ra đời với 50 sân đối tác đầu tiên' },
    { year: '2021', event: 'Mở rộng ra 10 tỉnh thành, đạt 10.000 người dùng' },
    { year: '2022', event: 'Ra mắt ứng dụng mobile, 500+ sân đối tác' },
    { year: '2023', event: 'Đạt 50.000 người dùng, mở rộng ra 30 tỉnh thành' },
    { year: '2024', event: 'Tích hợp thanh toán online, 100.000+ người dùng' },
    { year: '2025', event: 'Trở thành nền tảng đặt sân #1 Việt Nam' },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">
            {t('about.heroTitle', 'Về Sân Siêu Tốc')}
          </h1>
          <p className="about-hero-subtitle">
            {t('about.heroSubtitle', 'Nền tảng đặt sân thể thao hàng đầu Việt Nam, kết nối hàng triệu người yêu thể thao với những sân chơi chất lượng nhất.')}
          </p>
        </div>
        <div className="about-hero-overlay" />
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-mission-grid">
            <div className="about-mission-content">
              <span className="about-section-label">{t('about.ourMission', 'Sứ mệnh của chúng tôi')}</span>
              <h2 className="about-section-title">
                {t('about.missionTitle', 'Mang thể thao đến gần hơn với mọi người')}
              </h2>
              <p className="about-text">
                {t('about.missionText1', 'Sân Siêu Tốc được thành lập với mục tiêu đơn giản hóa việc tìm kiếm và đặt sân thể thao. Chúng tôi tin rằng mọi người đều xứng đáng có cơ hội chơi thể thao một cách dễ dàng và thuận tiện.')}
              </p>
              <p className="about-text">
                {t('about.missionText2', 'Với công nghệ tiên tiến và mạng lưới đối tác rộng khắp, chúng tôi cam kết mang đến trải nghiệm đặt sân nhanh chóng, minh bạch và đáng tin cậy cho tất cả người dùng.')}
              </p>
            </div>
            <div className="about-mission-image">
              <img
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop"
                alt="Sports field"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="about-section about-section-alt">
        <div className="about-container">
          <div className="about-section-header">
            <span className="about-section-label">{t('about.coreValues', 'Giá trị cốt lõi')}</span>
            <h2 className="about-section-title">
              {t('about.whyChooseUs', 'Tại sao chọn Sân Siêu Tốc?')}
            </h2>
          </div>
          <div className="about-values-grid">
            {coreValues.map((value, index) => (
              <div key={index} className="about-value-card">
                <div className="about-value-icon">
                  <span className="material-symbols-outlined">{value.icon}</span>
                </div>
                <h3 className="about-value-title">{value.title}</h3>
                <p className="about-value-desc">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats-section">
        <div className="about-container">
          <div className="about-stats-grid">
            <div className="about-stat">
              <span className="about-stat-number">500+</span>
              <span className="about-stat-label">{t('home.stats.fields', 'Sân thể thao')}</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-number">100,000+</span>
              <span className="about-stat-label">{t('home.stats.users', 'Người dùng')}</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-number">50+</span>
              <span className="about-stat-label">{t('home.stats.cities', 'Tỉnh thành')}</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-number">4.8/5</span>
              <span className="about-stat-label">{t('home.stats.rating', 'Đánh giá')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-section-header">
            <span className="about-section-label">{t('about.ourJourney', 'Hành trình của chúng tôi')}</span>
            <h2 className="about-section-title">
              {t('about.milestones', 'Các cột mốc quan trọng')}
            </h2>
          </div>
          <div className="about-timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="about-timeline-item">
                <div className="about-timeline-year">{milestone.year}</div>
                <div className="about-timeline-dot" />
                <div className="about-timeline-content">
                  <p>{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section about-section-alt">
        <div className="about-container">
          <div className="about-section-header">
            <span className="about-section-label">{t('about.ourTeam', 'Đội ngũ của chúng tôi')}</span>
            <h2 className="about-section-title">
              {t('about.meetTheTeam', 'Gặp gỡ những người đứng sau Sân Siêu Tốc')}
            </h2>
          </div>
          <div className="about-team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="about-team-card">
                <div className="about-team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="about-team-info">
                  <h3 className="about-team-name">{member.name}</h3>
                  <p className="about-team-role">{member.role}</p>
                  <p className="about-team-desc">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="about-container">
          <div className="about-cta-content">
            <h2 className="about-cta-title">
              {t('about.ctaTitle', 'Sẵn sàng trải nghiệm?')}
            </h2>
            <p className="about-cta-text">
              {t('about.ctaText', 'Tham gia cùng hàng trăm nghìn người dùng đã tin tưởng Sân Siêu Tốc.')}
            </p>
            <div className="about-cta-buttons">
              <Link to="/fields" className="about-cta-btn primary">
                <span className="material-symbols-outlined">search</span>
                {t('home.searchButton', 'Tìm sân ngay')}
              </Link>
              <Link to="/register" className="about-cta-btn secondary">
                <span className="material-symbols-outlined">person_add</span>
                {t('auth.register', 'Đăng ký')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

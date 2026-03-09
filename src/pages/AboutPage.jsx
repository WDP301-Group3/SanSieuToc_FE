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
      name: 'Nguyễn Viết Sang',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      description: 'Với hơn 10 năm kinh nghiệm trong lĩnh vực thể thao và công nghệ.',
    },
    {
      name: 'Phan Duy Thành',
      role: 'Co-Founder & CTO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
      description: 'Chuyên gia công nghệ với đam mê xây dựng sản phẩm số.',
    },
    {
      name: 'Hoàng Tuấn Long',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      description: 'Đảm bảo vận hành mượt mà cho hệ thống toàn quốc.',
    },
    {
      name: 'Phạm Quốc Minh',
      role: 'Customer Success Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      description: 'Luôn đặt trải nghiệm khách hàng lên hàng đầu.',
    },
    {
      name: 'Phạm Đức Minh',
      role: 'Customer Success Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      description: 'Luôn đặt trải nghiệm khách hàng lên hàng đầu.',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                src="/assets/images/football.jpg"
                alt="Sports field"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="about-section about-section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left - Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&h=500&fit=crop"
                alt="Why Choose Us"
                className="w-full h-full object-cover"
                style={{ minHeight: '420px' }}
              />
              <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(0,229,54,0.08) 0%, transparent 60%)' }} />
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: '#00c42e' }}>
                {t('about.whyChooseUs')}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-base mb-10 leading-relaxed">
                {t('about.whyChooseDesc')}
              </p>

              {/* Feature list */}
              <div className="flex flex-col gap-7">
                {[
                  { icon: 'timer', title: t('about.feature1Title'), desc: t('about.feature1Desc') },
                  { icon: 'verified', title: t('about.feature2Title'), desc: t('about.feature2Desc') },
                  { icon: 'touch_app', title: t('about.feature3Title'), desc: t('about.feature3Desc') },
                  { icon: 'support_agent', title: t('about.feature4Title'), desc: t('about.feature4Desc') },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    {/* Icon tròn */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,229,54,0.12)' }}>
                      <span className="material-symbols-outlined text-xl" style={{ color: '#00c42e' }}>{item.icon}</span>
                    </div>
                    {/* Text */}
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

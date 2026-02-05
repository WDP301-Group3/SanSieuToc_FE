import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 to-green-100 dark:from-[#052e16] dark:to-[#14532d] overflow-hidden">
        {/* Background SVG */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 dark:opacity-5">
          <svg
            className="absolute w-full h-full text-[#00E536] fill-current"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path d="M0 100 C 20 0 50 0 100 100 Z" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-gray-900 dark:text-white mb-6">
            Tìm sân chơi{' '}
            <span className="text-[#00E536] logo-text-shadow">Siêu Tốc</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
            Đặt sân bóng đá, cầu lông, tennis ngay lập tức. Hệ thống tìm kiếm thông minh,
            đặt sân dễ dàng chỉ trong 30 giây.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-4xl bg-white dark:bg-[#14532d] rounded-2xl shadow-xl p-3 flex flex-col md:flex-row gap-3 transform transition-all hover:scale-[1.01]">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons-outlined text-gray-400 group-focus-within:text-[#00E536]">
                  sports_soccer
                </span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-gray-50 dark:bg-green-900/30 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00E536] transition-shadow"
                placeholder="Tìm tên sân, khu vực..."
                type="text"
              />
            </div>
            <div className="w-full md:w-48 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons-outlined text-gray-400 group-focus-within:text-[#00E536]">
                  calendar_today
                </span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-gray-50 dark:bg-green-900/30 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00E536] transition-shadow"
                placeholder="Chọn ngày"
                type="date"
              />
            </div>
            <Link to="/fields">
              <button className="w-full md:w-auto bg-[#00E536] hover:bg-green-500 text-white dark:text-green-900 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-neon transition-all duration-300 flex items-center justify-center gap-2">
                <span className="material-icons-outlined">search</span>
                Tìm sân
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-[#14532d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Sân thể thao' },
              { number: '10,000+', label: 'Người dùng' },
              { number: '50+', label: 'Thành phố' },
              { number: '4.8/5', label: 'Đánh giá' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#00E536] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Fields Section */}
      <section className="py-20 bg-gray-50 dark:bg-[#052e16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sân nổi bật
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Những sân được đánh giá cao nhất bởi cộng đồng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TODO: Replace with real data from API */}
            {[1, 2, 3, 4].map((item) => (
              <Link key={item} to={`/fields/${item}`} className="block group">
                <div className="bg-white dark:bg-[#14532d] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-transparent hover:border-green-200 dark:hover:border-green-700">
                  <div className="h-40 bg-gray-200 relative">
                    <img
                      alt="Sân bóng"
                      className="w-full h-full object-cover"
                      src={`https://via.placeholder.com/400x300?text=Field+${item}`}
                    />
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                      3km
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-[#00E536] transition-colors">
                      Sân Bóng {item}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      Cầu Giấy, Hà Nội
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-md">
                        Còn sân
                      </span>
                      <span className="font-bold text-[#00E536] text-sm">200k/h</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/fields">
              <button className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-green-700 text-base font-medium rounded-xl text-gray-700 dark:text-white bg-white dark:bg-[#14532d] hover:bg-gray-50 dark:hover:bg-green-800 transition-colors">
                Xem thêm sân khác
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-[#14532d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Cách thức hoạt động
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Chỉ 3 bước đơn giản để đặt sân yêu thích của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'search',
                title: 'Tìm kiếm',
                description: 'Tìm sân phù hợp với vị trí và thời gian của bạn',
              },
              {
                icon: 'event_available',
                title: 'Đặt sân',
                description: 'Chọn khung giờ và xác nhận đặt sân trực tuyến',
              },
              {
                icon: 'sports_soccer',
                title: 'Chơi thôi!',
                description: 'Đến sân và tận hưởng trận đấu của bạn',
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00E536]/10 text-[#00E536] mb-4">
                  <span className="material-icons-outlined text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

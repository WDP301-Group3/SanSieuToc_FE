/**
 * UserProfilePage - Trang Profile của User
 * 
 * Đã tách thành các components:
 * - UserSidebar: Sidebar navigation
 * - ProfileTab: Tab thông tin cá nhân
 * - BookingsTab: Tab lịch sử đặt sân
 * - SettingsTab: Tab cài đặt
 */
import { useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getBookingsByUserID,
  getUserBookingStats,
  getUserMemberTier,
  BOOKING_ORDER_STATUS,
} from '../../data/mockData';

// Components
import { UserSidebar, ProfileTab, BookingsTab, SettingsTab } from './components';

// Styles
import '../../styles/UserProfilePage.css';

const UserProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine active tab from URL path
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/booking-history')) return 'bookings';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/profile')) return 'profile';
    return searchParams.get('tab') || 'profile';
  };

  const activeTab = getTabFromPath();

  // Get data from mockData
  const allBookings = useMemo(() => {
    if (!user?.id) return [];
    return getBookingsByUserID(user.id);
  }, [user]);

  const stats = useMemo(() => {
    if (!user?.id)
      return { total: 0, completed: 0, confirmed: 0, cancelled: 0, pending: 0, totalSpent: 0 };
    return getUserBookingStats(user.id);
  }, [user]);

  const memberTier = useMemo(() => {
    if (!user?.id) return { name: 'Thành viên Đồng', color: '#cd7f32' };
    return getUserMemberTier(user.id);
  }, [user]);

  const upcomingBookings = useMemo(() => {
    return allBookings
      .filter(
        (b) =>
          b.status === BOOKING_ORDER_STATUS.CONFIRMED ||
          b.status === BOOKING_ORDER_STATUS.PENDING
      )
      .slice(0, 4);
  }, [allBookings]);

  // Tab change handler
  const handleTabChange = (tabKey) => {
    if (tabKey === 'bookings') {
      navigate('/booking-history');
    } else if (tabKey === 'settings') {
      navigate('/settings');
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className="user-dashboard-page">
      <div className="user-dashboard-layout">
        {/* Sidebar */}
        <UserSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          memberTier={memberTier}
          userName={user?.name || ''}
          userImage={user?.image}
        />

        {/* Main Content */}
        <main className="user-dashboard-main">
          {activeTab === 'profile' && (
            <ProfileTab
              user={user}
              upcomingBookings={upcomingBookings}
              onTabChange={handleTabChange}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsTab allBookings={allBookings} stats={stats} />
          )}

          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;

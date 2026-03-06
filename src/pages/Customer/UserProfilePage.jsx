/**
 * UserProfilePage - Trang Profile của User
 * 
 * Đã tách thành các components:
 * - UserSidebar: Sidebar navigation
 * - ProfileTab: Tab thông tin cá nhân
 * - BookingsTab: Tab lịch sử đặt sân
 * - SettingsTab: Tab cài đặt
 * 
 * Data: Lấy booking từ API thật (bookingService.getMyBookings)
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';

// Components
import { UserSidebar, ProfileTab, BookingsTab, SettingsTab } from './components';

// Styles
import '../../styles/UserProfilePage.css';

/** Booking status constants (khớp với BE) */
const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const UserProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // ========== API State ==========
  const [allBookings, setAllBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // ========== Fetch bookings from API ==========
  const fetchBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const response = await bookingService.getMyBookings();
      // BE controller trả { success: true, data: [...] }
      // bookingService unwrap axios → response = { success: true, data: [...] }
      let bookings = [];
      if (Array.isArray(response)) {
        bookings = response;
      } else if (response?.data && Array.isArray(response.data)) {
        bookings = response.data;
      }
      setAllBookings(bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setAllBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Determine active tab from URL path
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/booking-history')) return 'bookings';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/profile')) return 'profile';
    return searchParams.get('tab') || 'profile';
  };

  const activeTab = getTabFromPath();

  // Calculate stats from API data
  const stats = useMemo(() => {
    return {
      total: allBookings.length,
      completed: allBookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED).length,
      confirmed: allBookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED).length,
      cancelled: allBookings.filter((b) => b.status === BOOKING_STATUS.CANCELLED).length,
      pending: allBookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length,
    };
  }, [allBookings]);

  // Upcoming bookings (Confirmed + Pending)
  const upcomingBookings = useMemo(() => {
    return allBookings
      .filter(
        (b) =>
          b.status === BOOKING_STATUS.CONFIRMED ||
          b.status === BOOKING_STATUS.PENDING
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
            <BookingsTab
              allBookings={allBookings}
              stats={stats}
              loading={bookingsLoading}
              onRefresh={fetchBookings}
            />
          )}

          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;

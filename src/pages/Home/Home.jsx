import { useState } from 'react';
import { useSelector } from 'react-redux';
import QuickActions from '../../components/QuickActions/QuickActions';
import IncomingRequests from '../../components/IncomingRequests/IncomingRequests';
import { useNativeApp } from '../../context/NativeAppContext';
import PullToRefresh from '../../components/common/PullToRefresh';
import { useGetChatOverviewQuery } from '../../redux/api/chatApi';
import homeBg from '../../assets/images/home.png';

export default function Home() {
  const user = useSelector((state) => state.auth?.user);
  const [isOnline, setIsOnline] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);
  const { isNativeApp, statusBarHeight } = useNativeApp();

  // Load chat overview to participate in pull-to-refresh
  const { data: overviewData, refetch: refetchOverview, isFetching } = useGetChatOverviewQuery();
  const stats = overviewData?.stats;

  const handleRefresh = () => {
    refetchOverview();
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatName = (fullName) => {
    if (!fullName) return { prefix: 'Acharya', main: 'Pandit JI' };
    const parts = fullName.trim().split(' ');
    if (parts[0].toLowerCase() === 'acharya' || parts[0].toLowerCase() === 'pandit') {
      return { prefix: parts[0], main: parts.slice(1).join(' ') };
    }
    if (parts.length > 1) {
      return { prefix: parts.slice(0, parts.length - 1).join(' '), main: parts[parts.length - 1] };
    }
    return { prefix: '', main: fullName };
  };

  const greeting = getGreeting();
  const displayName = formatName(user?.name);

  // Redirection and authentication checks are now handled by ProtectedRoute wrapper
  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-gradient-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF] md:py-10 md:px-6">
      <div className="w-full max-w-[430px] md:max-w-6xl min-h-screen md:min-h-0 bg-gradient-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF] md:bg-white/45 md:backdrop-blur-xl shadow-[0px_10px_40px_rgba(0,0,0,0.12)] md:shadow-[0px_20px_50px_rgba(0,0,0,0.08)] md:rounded-[32px] flex flex-col relative overflow-hidden box-border">
        <PullToRefresh onRefresh={handleRefresh} isRefreshing={isFetching} className="md:p-6 lg:p-8">

          {/* Hero Section */}
          <div
            className="relative overflow-hidden flex flex-col items-center px-4 pt-7 pb-6 md:py-8 md:px-8 w-full h-[325px] md:h-auto box-border shadow-[0px_4px_20px_rgba(0,0,0,0.6)] rounded-b-[24px] md:rounded-[24px]"
            style={{
              backgroundColor: 'rgba(42, 11, 7, 0.8)',
              paddingTop: isNativeApp ? statusBarHeight + 28 : undefined,
              height: isNativeApp && window.innerWidth < 768 ? statusBarHeight + 325 : undefined,
            }}
          >
            {/* Background Image Overlay */}
            <div className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 top-0 right-0 translate-x-[45%] -translate-y-[35%]">
              <img
                src={homeBg}
                alt="Home Background"
                className="w-full h-full object-cover pointer-events-none z-0"
              />
            </div>
            <div
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(42, 11, 7, 0.8) 0%, rgba(42, 11, 7, 0.4) 60%, rgba(42, 11, 7, 0.9) 100%)'
              }}
            />


            {/* Top header container */}
            <div className="flex flex-row justify-between items-center w-full px-1 box-border relative z-10">
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-['Sofia_Sans'] font-semibold text-[13.5px] leading-tight text-[#ECECEC] opacity-85">
                  {greeting}
                </span>
                <h1 className="font-['Sofia_Sans'] font-bold text-[21px] leading-tight text-[#ECECEC] m-0">
                  {displayName.prefix} {displayName.main && <span className="text-[#E5A853] drop-shadow-[0px_0px_10px_rgba(229,168,83,0.3)]">{displayName.main}</span>}
                </h1>
              </div>

              <div className="flex flex-row items-center gap-2">
                {/* Online Status Pill */}
                <div 
                  onClick={() => setIsOnline(prev => !prev)}
                  className="flex flex-row justify-center items-center px-3.5 py-1.5 gap-2 h-8 bg-[rgba(236,236,236,0.15)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-[60px] box-border cursor-pointer select-none hover:bg-[rgba(236,236,236,0.25)] transition-all"
                >
                  <div className="relative w-[9px] h-[9px] flex items-center justify-center">
                    {isOnline ? (
                      <>
                        <div className="absolute w-3.5 h-3.5 bg-[#2DFC2D] rounded-full blur-[2px] opacity-85 z-0 animate-pulse-glow"></div>
                        <div className="w-2 h-2 bg-[#2DFC2D] rounded-full z-10"></div>
                      </>
                    ) : (
                      <>
                        <div className="absolute w-3.5 h-3.5 bg-[#EF4444] rounded-full blur-[2px] opacity-85 z-0"></div>
                        <div className="w-2 h-2 bg-[#EF4444] rounded-full z-10"></div>
                      </>
                    )}
                  </div>
                  <span className="font-['Sofia_Sans'] font-semibold text-[15px] text-white leading-none">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>

                {/* Bell Notification Button */}
                <button
                  onClick={() => {
                    setNotificationCount(0);
                    alert('Notifications cleared');
                  }}
                  className="relative flex justify-center items-center w-8 h-8 bg-[rgba(236,236,236,0.15)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-full text-[#ECECEC] cursor-pointer p-0 transition-all duration-200 hover:bg-[rgba(236,236,236,0.25)] hover:scale-105 active:scale-95"
                  aria-label="Notifications"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill="currentColor" />
                  </svg>
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#EF4444] border border-[#2A0B07] rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Stats Container Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full mt-5 box-border max-[360px]:gap-2 relative z-10">

              {/* Card 1: Today's Earnings */}
              <div className="flex flex-col items-start justify-between p-3 sm:p-[12px_14px] h-[104px] rounded-[20px] box-border relative overflow-hidden transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.25)] bg-[radial-gradient(circle_at_95%_10%,_rgba(229,168,83,0.45)_0%,_rgba(236,236,236,_0)_65%),_rgba(236,236,236,0.1)] hover:bg-[radial-gradient(circle_at_95%_10%,_rgba(229,168,83,0.55)_0%,_rgba(236,236,236,_0)_70%),_rgba(236,236,236,0.16)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] max-[360px]:p-2.5 max-[360px]:h-24">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-transparent pointer-events-none" />
                <span className="font-['Sofia_Sans'] font-semibold text-[11px] leading-none tracking-[0.8px] uppercase text-[rgba(255,255,255,0.6)]">
                  Today's Earnings
                </span>
                <span className="font-['Sofia_Sans'] font-bold text-[26px] leading-none text-white my-auto max-[360px]:text-[22px]">
                  ₹{stats?.today_earnings ?? 0}
                </span>
                <div className={`flex flex-row items-center gap-1 leading-none ${
                  stats?.earnings_direction === 'up' ? 'text-[#2DFC2D]' : stats?.earnings_direction === 'down' ? 'text-[#FF5B5B]' : 'text-[rgba(255,255,255,0.6)]'
                }`}>
                  {stats?.earnings_direction === 'up' && (
                    <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {stats?.earnings_direction === 'down' && (
                    <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 19V5M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span className="font-['Poppins'] font-medium text-[11px]">
                    {stats?.earnings_change_text ?? '0% vs yesterday'}
                  </span>
                </div>
              </div>

              {/* Card 2: Sessions Today */}
              <div className="flex flex-col items-start justify-between p-3 sm:p-[12px_14px] h-[104px] rounded-[20px] box-border relative overflow-hidden transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.25)] bg-[rgba(236,236,236,0.1)] hover:bg-[rgba(236,236,236,0.16)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] max-[360px]:p-2.5 max-[360px]:h-24">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-transparent pointer-events-none" />
                <span className="font-['Sofia_Sans'] font-semibold text-[11px] leading-none tracking-[0.8px] uppercase text-[rgba(255,255,255,0.6)]">
                  Sessions Today
                </span>
                <span className="font-['Sofia_Sans'] font-bold text-[26px] leading-none text-white my-auto max-[360px]:text-[22px]">
                  {stats?.sessions_today ?? 0}
                </span>
                <div className={`flex flex-row items-center gap-1 leading-none ${
                  stats?.sessions_direction === 'up' ? 'text-[#2DFC2D]' : stats?.sessions_direction === 'down' ? 'text-[#FF5B5B]' : 'text-[rgba(255,255,255,0.6)]'
                }`}>
                  {stats?.sessions_direction === 'up' && (
                    <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {stats?.sessions_direction === 'down' && (
                    <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 19V5M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span className="font-['Poppins'] font-medium text-[11px]">
                    {stats?.sessions_compare_text ?? 'same as avg'}
                  </span>
                </div>
              </div>

              {/* Card 3: Pending */}
              <div className="flex flex-col items-start justify-between p-3 sm:p-[12px_14px] h-[104px] rounded-[20px] box-border relative overflow-hidden transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.25)] bg-[rgba(236,236,236,0.1)] hover:bg-[rgba(236,236,236,0.16)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] max-[360px]:p-2.5 max-[360px]:h-24">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-transparent pointer-events-none" />
                <span className="font-['Sofia_Sans'] font-semibold text-[11px] leading-none tracking-[0.8px] uppercase text-[rgba(255,255,255,0.6)]">
                  Pending
                </span>
                <span className="font-['Sofia_Sans'] font-bold text-[26px] leading-none text-white my-auto max-[360px]:text-[22px]">
                  {stats?.pending_count ?? 0}
                </span>
                <div className="flex flex-row items-center gap-1 leading-none text-[rgba(255,255,255,0.6)]">
                  <span className="font-['Poppins'] font-medium text-[11px]">
                    {stats?.pending_compare_text ?? 'No pending requests'}
                  </span>
                </div>
              </div>

              {/* Card 4: Rating */}
              <div className="flex flex-col items-start justify-between p-3 sm:p-[12px_14px] h-[104px] rounded-[20px] box-border relative overflow-hidden transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.25)] bg-[rgba(236,236,236,0.1)] hover:bg-[rgba(236,236,236,0.16)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] max-[360px]:p-2.5 max-[360px]:h-24">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-transparent pointer-events-none" />
                <span className="font-['Sofia_Sans'] font-semibold text-[11px] leading-none tracking-[0.8px] uppercase text-[rgba(255,255,255,0.6)]">
                  Rating
                </span>
                <span className="font-['Sofia_Sans'] font-bold text-[26px] leading-none text-white my-auto max-[360px]:text-[22px]">
                  {stats?.rating ?? '0.0'}
                </span>
                <div className="flex flex-row items-center gap-1 leading-none text-[rgba(255,255,255,0.6)]">
                  <span className="font-['Poppins'] font-medium text-[11px]">
                    {stats?.reviews_count ?? 0} reviews
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Desktop Columns */}
          <div className="flex flex-col md:grid md:grid-cols-12 md:gap-6 w-full mt-4 md:mt-6">
            <div className="md:col-span-5 flex flex-col gap-4">
              <QuickActions />
            </div>
            <div className="md:col-span-7 flex flex-col gap-4">
              <IncomingRequests />
            </div>
          </div>

        </PullToRefresh>
      </div>
    </div>
  );
}

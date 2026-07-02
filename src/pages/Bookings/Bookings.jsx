import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNativeApp } from '../../context/NativeAppContext';

// Import modular subcomponents
import RequestCard from '../../components/RequestCard/RequestCard';
import TodaySessionsCard from './components/TodaySessionsCard';
import UpcomingSessionsCard from './components/UpcomingSessionsCard';
import AvailabilityCard from './components/AvailabilityCard';

import { 
  useGetChatOverviewQuery,
  useHandleChatRequestMutation
} from '../../redux/api/chatApi';
import { useGetTodaySessionsQuery, useGetMyLiveSessionsQuery } from '../../redux/api/liveApi';
import PullToRefresh from '../../components/common/PullToRefresh';

export default function Bookings() {
  const navigate = useNavigate();
  const { isNativeApp, statusBarHeight } = useNativeApp();

  // Load today's sessions and chat overview to participate in pull-to-refresh
  const { refetch: refetchSessions, isFetching: isFetchingSessions } = useGetTodaySessionsQuery();
  const { refetch: refetchLiveSessions, isFetching: isFetchingLiveSessions } = useGetMyLiveSessionsQuery();

  // Load chat overview (poll every 5 seconds for new requests)
  const { data: overviewData, refetch: refetchOverview, isFetching: isFetchingOverview } = useGetChatOverviewQuery(undefined, {
    pollingInterval: 5000
  });

  const isRefreshing = isFetchingOverview || isFetchingSessions || isFetchingLiveSessions;

  const handleRefresh = () => {
    refetchOverview();
    refetchSessions();
    refetchLiveSessions();
  };

  // Mutation to handle accept/reject chat request
  const [handleChatRequest, { isLoading: isHandling }] = useHandleChatRequestMutation();

  // Filter only pending requests
  const pendingRequests = overviewData?.requests?.filter(r => r.status === 'pending') || [];
  const activeRequest = pendingRequests[0];

  const handleAccept = async (requestId) => {
    try {
      const res = await handleChatRequest({ requestId, action: 'accept' }).unwrap();
      refetchOverview();
      
      // Video request → open the 1-on-1 video room with the host link.
      if (res.type === 'video' && res.host_meet_url) {
        navigate('/video-call', {
          state: {
            meetUrl: res.host_meet_url,
            requestId,
            endsAt: res.ends_at ?? null,
            minutes: res.minutes ?? null,
          },
        });
        return;
      }
      // Audio call → open the voice-only room with the host link.
      if (res.type === 'call' && res.host_meet_url) {
        navigate('/audio-call', {
          state: {
            meetUrl: res.host_meet_url,
            minutes: res.minutes,
            endsAt: res.ends_at,
            requestId: res.id,
          },
        });
        return;
      }
      // Chat request → jump into the conversation.
      if (res.conversation?.id) {
        navigate(`/messages/chat/${res.conversation.id}`);
      }
    } catch (err) {
      console.error('Failed to accept chat request:', err);
      alert(err.data?.message || err.data?.error || 'Failed to accept chat request. Please try again.');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await handleChatRequest({ requestId, action: 'reject' }).unwrap();
      refetchOverview();
    } catch (err) {
      console.error('Failed to reject chat request:', err);
      alert(err.data?.message || err.data?.error || 'Failed to reject chat request. Please try again.');
    }
  };

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 18 
      } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6">
      <div className="w-full max-w-[430px] md:max-w-6xl min-h-screen md:min-h-0 bg-[#FFF6E9] md:bg-white/45 md:backdrop-blur-xl shadow-[0px_10px_40px_rgba(0,0,0,0.12)] md:shadow-[0px_20px_50px_rgba(0,0,0,0.08)] md:rounded-[32px] flex flex-col relative overflow-hidden box-border min-h-[640px]">
        <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing} className="pb-10">
          
          {/* Premium Astrological Navigation Header */}
          <motion.div 
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="w-full h-[62px] bg-[#2A0B07] flex flex-row items-center justify-between pr-[15px] pl-[10px] box-border relative overflow-hidden rounded-b-[12px] shadow-[0px_2px_6px_0.2px_rgba(0,0,0,0.6)] backdrop-blur-[10px] z-20 flex-none"
            style={{
              paddingTop: isNativeApp ? statusBarHeight : undefined,
              height: isNativeApp ? 62 + statusBarHeight : undefined,
            }}
          >
            {/* Back arrow button */}
            <div className="flex flex-row items-center gap-[2.5px] h-[57px] z-10">
              <button
                onClick={() => navigate('/')}
                className="flex justify-center items-center w-[44px] h-[57px] rounded-[8px] bg-transparent border-0 cursor-pointer p-0 hover:bg-white/5 active:scale-95 transition-all duration-200"
                aria-label="Go Back"
              >
                <svg width="15" height="29" viewBox="0 0 15 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.17885 14.5L13.0176 23.0441L11.2501 24.7527L1.5276 15.3543C1.29327 15.1277 1.16162 14.8204 1.16162 14.5C1.16162 14.1796 1.29327 13.8723 1.5276 13.6457L11.2501 4.24731L13.0176 5.9559L4.17885 14.5Z" fill="#F3CA06"/>
                </svg>
              </button>

              {/* Title */}
              <div className="flex flex-col items-start p-0 gap-[2px] w-auto h-[24px]">
                <span className="w-[150px] h-[24px] font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center text-[#FFC227]">
                  My Bookings
                </span>
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-start flex-grow p-4 gap-6 z-10"
          >
            
            {/* 1. Request Card Subcomponent */}
            <motion.div variants={cardVariants} className="w-full flex justify-center">
              {activeRequest ? (
                <RequestCard 
                  request={activeRequest} 
                  onAccept={handleAccept} 
                  onReject={handleReject} 
                  isProcessing={isHandling} 
                />
              ) : (
                <div className="w-full max-w-[408px] p-6 bg-[#F6F1E9]/80 border border-[#CF9914]/40 rounded-[18px] text-center shadow-sm">
                  <span className="text-[28px] block mb-2">✨</span>
                  <h4 className="font-['Sofia_Sans'] font-bold text-[16px] text-[#2A0B07] mb-1">No pending requests</h4>
                  <p className="font-['Poppins'] font-light text-[12px] text-[#2F2F2F]/80">
                    You will be notified here as soon as a customer requests a live chat. Keep this tab open!
                  </p>
                </div>
              )}
            </motion.div>

            {/* 2. Today's Sessions List Card */}
            <motion.div variants={cardVariants} className="w-full flex justify-center">
              <TodaySessionsCard />
            </motion.div>

            {/* 3. Upcoming Scheduled Sessions Card */}
            <motion.div variants={cardVariants} className="w-full flex justify-center">
              <UpcomingSessionsCard />
            </motion.div>

            {/* 4. Availability Card */}
            <motion.div variants={cardVariants} className="w-full flex justify-center">
              <AvailabilityCard />
            </motion.div>

          </motion.div>

        </PullToRefresh>
      </div>
    </div>
  );
}

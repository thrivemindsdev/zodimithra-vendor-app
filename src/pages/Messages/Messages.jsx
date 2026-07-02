import { useNavigate } from 'react-router-dom';
import RequestCard from '../../components/RequestCard/RequestCard';
import TodayBookings from '../../components/TodayBookings/TodayBookings';
import { 
  useGetChatOverviewQuery,
  useGetConversationsQuery,
  useHandleChatRequestMutation
} from '../../redux/api/chatApi';
import { useNativeApp } from '../../context/NativeAppContext';
import PullToRefresh from '../../components/common/PullToRefresh';
import mesSearchImg from '../../assets/images/mes-search.png';

export default function Messages() {
  const navigate = useNavigate();
  const { isNativeApp, statusBarHeight } = useNativeApp();

  // Load chat overview (poll every 5 seconds for new requests)
  const { data: overviewData, refetch: refetchOverview, isFetching: isFetchingOverview } = useGetChatOverviewQuery(undefined, {
    pollingInterval: 5000
  });

  // Load conversation list (poll every 5 seconds)
  const { data: conversations, isLoading: isConversationsLoading, refetch: refetchConversations, isFetching: isFetchingConversations } = useGetConversationsQuery(undefined, {
    pollingInterval: 5000
  });

  const isRefreshing = isFetchingOverview || isFetchingConversations;

  const handleRefresh = () => {
    refetchOverview();
    refetchConversations();
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
      refetchConversations();
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
      refetchConversations();
    } catch (err) {
      console.error('Failed to reject chat request:', err);
      alert(err.data?.message || err.data?.error || 'Failed to reject chat request. Please try again.');
    }
  };

  const activeCount = conversations?.length || 0;

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-gradient-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF] md:py-10 md:px-6">
      <div className="w-full max-w-[430px] md:max-w-6xl min-h-screen md:min-h-0 bg-gradient-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF] md:bg-white/45 md:backdrop-blur-xl shadow-[0px_10px_40px_rgba(0,0,0,0.12)] md:shadow-[0px_20px_50px_rgba(0,0,0,0.08)] md:rounded-[32px] flex flex-col relative overflow-hidden box-border min-h-[500px]">
        <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
          
          {/* Premium Astrological Navigation Header (Nav) */}
          <div
            className="w-full h-[62px] bg-[#2A0B07] flex flex-row items-center justify-between pr-[15px] pl-[10px] box-border relative overflow-hidden rounded-b-[12px] shadow-[0px_2px_6px_0.2px_rgba(0,0,0,0.6)] backdrop-blur-[10px] z-20 flex-none"
            style={{
              paddingTop: isNativeApp ? statusBarHeight : undefined,
              height: isNativeApp ? 62 + statusBarHeight : undefined,
            }}
          >
            {/* Astrological Explore/Search Background PNG Watermark */}
            <div className="absolute right-[0px] top-[-5px] w-[100px] h-[75px] opacity-40 pointer-events-none z-0 select-none">
              <img
                src={mesSearchImg}
                alt="Astrological Search Watermark"
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>

            {/* Frame 437 - Left part */}
            <div className="flex flex-row items-center gap-[2.5px] h-[57px] z-10">
              {/* Frame 53 - Back arrow button */}
              <button
                onClick={() => navigate('/')}
                className="flex justify-center items-center w-[44px] h-[57px] rounded-[8px] bg-transparent border-0 cursor-pointer p-0 hover:bg-white/5 active:scale-95 transition-all duration-200"
                aria-label="Go Back"
              >
                {/* Vector - Yellow Back Chevron */}
                <svg width="15" height="29" viewBox="0 0 15 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.17885 14.5L13.0176 23.0441L11.2501 24.7527L1.5276 15.3543C1.29327 15.1277 1.16162 14.8204 1.16162 14.5C1.16162 14.1796 1.29327 13.8723 1.5276 13.6457L11.2501 4.24731L13.0176 5.9559L4.17885 14.5Z" fill="#F3CA06" />
                </svg>
              </button>

              {/* Title text */}
              <div className="flex flex-col items-start p-0 gap-[2px] w-auto h-[24px]">
                <span className="w-[85px] h-[24px] font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center text-[#FFC227]">
                  Messages
                </span>
              </div>
            </div>

            {/* Active Badge */}
            <div className="box-border flex flex-row justify-center items-center py-[5px] px-[10px] gap-[10px] w-auto h-[27px] bg-[#FDF3DC] border border-[#CF9914] rounded-[20px] z-10 flex-none">
              <span className="w-auto h-[17px] font-['Sofia_Sans'] font-semibold text-[14px] leading-none flex items-center justify-center text-center text-[#CF9914] px-1">
                {activeCount} Active
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col items-center justify-start flex-grow py-4 px-4 z-10">
            {/* Incoming Request Card */}
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

            {/* Symmetrical vertical spacer (21px) */}
            <div className="h-[21px] flex-none" />

            {/* Today’s Bookings Conversations List */}
            <TodayBookings bookings={conversations} isLoading={isConversationsLoading} />
          </div>

        </PullToRefresh>
      </div>
    </div>
  );
}

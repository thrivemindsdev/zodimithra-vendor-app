import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetChatOverviewQuery,
  useHandleChatRequestMutation 
} from '../../redux/api/chatApi';
import Loading from '../../pages/Loading/Loading';

export default function IncomingRequests() {
  const navigate = useNavigate();

  // Load live requests (poll every 5 seconds for incoming alerts)
  const { data: overviewData, isLoading } = useGetChatOverviewQuery(undefined, {
    pollingInterval: 5000
  });

  // Mutation to accept/reject request
  const [handleChatRequest, { isLoading: isHandling }] = useHandleChatRequestMutation();

  // Filter pending requests
  const pendingRequests = overviewData?.requests?.filter(r => r.status === 'pending') || [];

  const handleAction = async (requestId, action) => {
    try {
      const res = await handleChatRequest({ requestId, action }).unwrap();
      if (action !== 'accept') return;

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
      console.error(`Failed to ${action} request:`, err);
    }
  };

  const activeCount = pendingRequests.length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-[14px] pb-[14px] px-[21px] w-[calc(100%-32px)] md:w-full max-w-[411px] md:max-w-none mx-auto md:mx-0 mt-4 md:mt-0 h-[150px] bg-white shadow-[0px_4px_14px_rgba(0,0,0,0.08)] rounded-[18px]">
        <span className="text-xs font-['Poppins'] text-[#2F2F2F]/60 animate-pulse">Checking for requests...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start pt-[14px] pb-[14px] px-[21px] gap-4 max-[380px]:gap-3 w-[calc(100%-32px)] md:w-full max-w-[411px] md:max-w-none mx-auto md:mx-0 mt-4 md:mt-0 box-border bg-white shadow-[0px_4px_14px_rgba(0,0,0,0.08),_0px_2px_10px_0.2px_rgba(0,0,0,0.15)] rounded-[18px] z-10 relative transition-all duration-300 ease-in-out">
      {/* Top Header Row */}
      <div className="flex flex-row justify-between items-center w-full px-1 box-border">
        <h2 className="m-0 font-['Sofia_Sans'] font-semibold text-[20px] max-[380px]:text-[18px] max-[350px]:text-[16px] leading-6 flex items-center text-[#424040]">
          Incoming Requests
        </h2>
        {activeCount > 0 && (
          <div className="flex flex-row justify-center items-center px-2.5 py-1 max-[380px]:px-2 max-[380px]:py-0.5 bg-[#FDF3DC] border border-[#CF9914] rounded-[20px] shrink-0 transition-all duration-300">
            <span className="font-['Sofia_Sans'] font-semibold text-[13px] max-[380px]:text-[11px] leading-none text-[#CF9914]">
              {activeCount} waiting
            </span>
          </div>
        )}
      </div>

      {/* Requests List */}
      <div className="flex flex-col w-full gap-3.5 max-[380px]:gap-2.5 transition-all duration-300 relative overflow-hidden">
        {activeCount > 0 ? (
          pendingRequests.map((request, idx) => {
            const customerName = request.customer?.name || 'Customer';
            const customerAvatar = request.customer?.image 
              ? `https://zodimithra.howincloud.com/storage/${request.customer.image}` 
              : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120';
            
            return (
              <React.Fragment key={request.id}>
                {/* Request Row */}
                <div
                  className="flex flex-row items-center justify-between gap-3 max-[380px]:gap-2 w-full transition-all duration-300 ease-in-out opacity-100 scale-100 max-h-[80px]"
                >
                  {/* Left Side: Avatar + Details */}
                  <div className="flex flex-row items-center gap-3.5 max-[380px]:gap-2 min-w-0">
                    {/* Avatar Container */}
                    <div className="w-[56px] h-[56px] max-[380px]:w-[48px] max-[380px]:h-[48px] max-[340px]:w-[40px] max-[340px]:h-[40px] rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm bg-gradient-to-br from-[#F5EDE3] to-[#EAE0D3] flex items-center justify-center">
                      <img
                        src={customerAvatar}
                        alt={customerName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Text Details */}
                    <div className="flex flex-col items-start gap-[2px] min-w-0">
                      <span className="font-['Poppins'] font-semibold text-[14px] max-[380px]:text-[13px] leading-tight text-[#8E4A4A] truncate max-w-[150px] max-[380px]:max-w-[110px] max-[340px]:max-w-[90px]">
                        {customerName}
                      </span>
                      <span className="truncate font-['Poppins'] font-light text-[12px] max-[380px]:text-[11px] leading-normal text-[#2F2F2F] flex items-center gap-1.5 max-[380px]:gap-1 truncate max-w-[170px] max-[380px]:max-w-[130px] max-[340px]:max-w-[100px]">
                        <span className="text-[14px] max-[380px]:text-[12px] leading-none shrink-0">
                          {request.type === 'video' ? '📹' : request.type === 'call' ? '📞' : '💬'}
                        </span>
                        <span className="truncate">
                          {request.type === 'video' ? 'Video Call Request' : request.type === 'call' ? 'Audio Call Request' : 'Chat Request'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Accept / Reject Action Buttons */}
                  <div className="flex flex-row items-center gap-2.5 max-[380px]:gap-1.5 shrink-0">
                    {/* Accept Button */}
                    <button
                      onClick={() => handleAction(request.id, 'accept')}
                      disabled={isHandling}
                      className="w-[90px] max-[380px]:w-[74px] max-[340px]:w-[64px] h-[39px] max-[380px]:h-[34px] bg-[#1D8A57] hover:bg-[#167046] active:scale-95 text-white font-['Sofia_Sans'] font-semibold text-[16px] max-[380px]:text-[14px] max-[340px]:text-[13px] leading-[39px] max-[380px]:leading-[34px] text-center rounded-[12px] max-[380px]:rounded-[8px] transition-all duration-200 shadow-sm cursor-pointer border-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Accept request from ${customerName}`}
                    >
                      {isHandling ? '...' : 'Accept'}
                    </button>

                    {/* Reject Button (X) */}
                    <button
                      onClick={() => handleAction(request.id, 'reject')}
                      disabled={isHandling}
                      className="w-[44px] max-[380px]:w-[34px] max-[340px]:w-[30px] h-[44px] max-[380px]:h-[34px] max-[340px]:h-[30px] bg-[#F5EDE3] hover:bg-[#EBDCC7] active:scale-95 border border-[#CF9914] text-[#CF9914] font-['Sofia_Sans'] font-semibold text-[20px] max-[380px]:text-[16px] max-[340px]:text-[14px] leading-none rounded-[12px] max-[380px]:rounded-[8px] transition-all duration-200 cursor-pointer flex items-center justify-center box-border disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Reject request from ${customerName}`}
                    >
                      X
                    </button>
                  </div>
                </div>

                {/* Divider Line */}
                {idx < pendingRequests.length - 1 && (
                  <hr className="border-0 border-t-[0.6px] border-[#A7A7A7] opacity-40 w-full m-0 transition-opacity duration-300" />
                )}
              </React.Fragment>
            );
          })
        ) : (
          /* Empty caught-up state */
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center w-full bg-gradient-to-b from-[#FAFDFB] to-[#F1F9F5] border border-[#D5E6DE] rounded-[14px] transition-all duration-500 animate-fade-in gap-2.5">
            <div className="w-12 h-12 rounded-full bg-[#EBF4F0] flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-[#1D8A57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="font-['Sofia_Sans'] font-bold text-[16px] text-[#2F2F2F] m-0">All Caught Up!</h3>
              <p className="font-['Poppins'] font-light text-[12px] text-[#6A6A6A] m-0">No pending incoming requests.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

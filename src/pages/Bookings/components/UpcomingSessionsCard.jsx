import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyLiveSessionsQuery } from '../../../redux/api/liveApi';

const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '';
  
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${day} ${month}, ${h}:${m} ${ampm}`;
};

export default function UpcomingSessionsCard() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetMyLiveSessionsQuery(undefined, {
    pollingInterval: 15000, // Poll every 15 seconds to keep synced
  });

  const upcomingSessions = data?.upcoming || [];

  const handleGoLive = (session) => {
    navigate('/live', { 
      state: { 
        activeSession: session 
      } 
    });
  };

  return (
    <div
      className="w-full max-w-[408px] bg-white border-[2.66px] border-[#F9F8F4] rounded-[18px] flex flex-col justify-center items-center gap-[8.89px] box-border select-none shadow-xs"
      style={{
        padding: '20px 12px',
        alignSelf: 'stretch',
        flex: 'none',
        order: 1.5,
        grow: 0
      }}
    >
      {/* UPCOMING SESSIONS Heading */}
      <div className="flex flex-row items-center justify-between w-full px-2 box-border h-[24px]">
        <span
          className="font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center"
          style={{ color: '#5F5B5B' }}
        >
          Upcoming Broadcasts
        </span>
        <button
          onClick={() => navigate('/live')}
          className="bg-transparent border-0 font-['Sofia_Sans'] font-semibold text-[14px] leading-[17px] cursor-pointer hover:underline outline-none p-0"
          style={{ color: '#7B2D2D' }}
        >
          + Schedule
        </button>
      </div>

      {/* Sessions List container */}
      <div className="flex flex-col items-stretch w-full gap-[8.89px] px-2 box-border mt-1">
        {isLoading && (
          <div className="py-8 text-center font-['Poppins'] text-[13px] text-[#B5A9A7]">
            Loading scheduled sessions…
          </div>
        )}

        {!isLoading && isError && (
          <div className="py-8 text-center font-['Poppins'] text-[13px] text-[#C4392C]">
            Couldn't load scheduled sessions.
          </div>
        )}

        {!isLoading && !isError && upcomingSessions.length === 0 && (
          <div className="py-8 text-center font-['Poppins'] text-[13px] text-[#B5A9A7] flex flex-col items-center gap-2">
            <span>No upcoming broadcasts scheduled.</span>
            <button
              onClick={() => navigate('/live')}
              className="text-[12px] font-semibold text-[#8B6E4E] hover:underline bg-[#FAF6F0] border border-[#EADFCB] px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              Create Scheduled Class
            </button>
          </div>
        )}

        {!isLoading && !isError && upcomingSessions.map((s, idx) => (
          <React.Fragment key={s.id}>
            {idx > 0 && (
              <div className="w-full h-[1px]" style={{ borderTop: '0.6px solid rgba(167, 167, 167, 0.4)' }} />
            )}

            <div className="flex flex-row justify-between items-center w-full min-h-[60px] py-1.5 hover:bg-[#FFFBF4] rounded-xl transition-all duration-200 px-1 box-border">
              {/* Left + Middle Content */}
              <div className="flex flex-row items-center gap-[12px] flex-grow min-w-0 mr-2">
                {/* Time/Date Badge */}
                <div
                  className="flex flex-col justify-center items-center bg-[#F3EDEC] border border-[#D7C4C5] rounded-[10px] p-1 flex-shrink-0"
                  style={{ width: '85px', minHeight: '34px', boxSizing: 'border-box' }}
                >
                  <span className="font-['Sofia_Sans'] font-semibold text-[11px] leading-[13px] text-[#936C6D] text-center">
                    {formatDateTime(s.start_time)}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="flex flex-col items-start gap-[1.5px] min-w-0">
                  <span className="font-['Poppins'] font-semibold text-[14px] leading-[20px] text-[#56504F] truncate w-full">
                    {s.title}
                  </span>
                  <span className="font-['Poppins'] font-normal text-[11px] leading-[16px] text-[#B5A9A7] truncate w-full">
                    {s.description || 'Public astrological broadcast'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center flex-shrink-0">
                <button
                  onClick={() => handleGoLive(s)}
                  className="text-[12px] font-semibold text-white bg-[#7B2D2D] hover:bg-[#8D3838] border-0 px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer shadow-xs font-['Poppins']"
                >
                  Go Live
                </button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

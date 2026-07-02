import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTodaySessionsQuery } from '../../../redux/api/liveApi';

// Pill styles per display status.
const STATUS_STYLES = {
  Done: { bg: '#EAF4F0', border: '#BED9CE', text: '#5C957D' },
  Soon: { bg: '#F8F0E4', border: '#ebdcc8', text: '#BD9458' },
  Upcoming: { bg: '#EEF3FE', border: '#d3e0fc', text: '#708ED4' },
};

const formatTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m}${ampm}`;
};

export default function TodaySessionsCard() {
  const navigate = useNavigate();
  const { data: sessions = [], isLoading, isError } = useGetTodaySessionsQuery(undefined, {
    pollingInterval: 10000
  });

  const renderStatusPill = (status) => {
    const { bg, border, text } = STATUS_STYLES[status] || STATUS_STYLES.Upcoming;
    return (
      <div
        className="flex flex-row justify-center items-center py-[4.5px] px-[11px] gap-[8.89px] h-[26.67px] rounded-[12.67px] border"
        style={{ backgroundColor: bg, borderColor: border, borderStyle: 'solid', borderWidth: '0.88px' }}
      >
        <span className="font-['Poppins'] font-semibold text-[12px] leading-[18px] flex items-center" style={{ color: text }}>
          {status}
        </span>
      </div>
    );
  };

  return (
    <div
      className="w-full max-w-[408px] bg-white border-[2.66px] border-[#F9F8F4] rounded-[18px] flex flex-col justify-center items-center gap-[8.89px] box-border select-none"
      style={{
        padding: '20px 12px',
        alignSelf: 'stretch',
        flex: 'none',
        order: 0,
        grow: 0
      }}
    >
      {/* TODAY'S SESSIONS Heading */}
      <div className="flex flex-row items-center w-full px-2 box-border h-[24px]">
        <span
          className="font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center"
          style={{ color: '#5F5B5B' }}
        >
          Today's Sessions
        </span>
      </div>

      {/* Sessions List container */}
      <div className="flex flex-col items-stretch w-full gap-[8.89px] px-2 box-border">

        {isLoading && (
          <div className="py-8 text-center font-['Poppins'] text-[13px] text-[#B5A9A7]">
            Loading today's sessions…
          </div>
        )}

        {!isLoading && isError && (
          <div className="py-8 text-center font-['Poppins'] text-[13px] text-[#C4392C]">
            Couldn't load your sessions. Please try again.
          </div>
        )}

        {!isLoading && !isError && sessions.length === 0 && (
          <div className="py-8 text-center font-['Poppins'] text-[13px] text-[#B5A9A7]">
            No sessions booked for today.
          </div>
        )}

        {!isLoading && !isError && sessions.map((s, idx) => (
          <React.Fragment key={s.id}>
            {idx > 0 && (
              <div className="w-full h-[1px]" style={{ borderTop: '0.6px solid rgba(167, 167, 167, 0.4)' }} />
            )}

            <div className="flex flex-row justify-between items-center w-full h-[60px] py-1.5 hover:bg-[#FFFBF4] rounded-xl transition-all duration-200 px-1 box-border">
              {/* Left + Middle Content */}
              <div className="flex flex-row items-center gap-[13.33px]">
                {/* Time Badge */}
                <div
                  className="flex justify-center items-center bg-[#F3EDEC] border border-[#D7C4C5] rounded-[10px]"
                  style={{ width: '72.89px', height: '29.33px', boxSizing: 'border-box' }}
                >
                  <span className="font-['Sofia_Sans'] font-semibold text-[12px] leading-[14px] flex items-center text-[#936C6D]">
                    {formatTime(s.time) || s.type}
                  </span>
                </div>

                {/* Name & Session Detail */}
                <div className="flex flex-col items-start gap-[1.5px]">
                  <span className="font-['Poppins'] font-semibold text-[16px] leading-[24px] text-[#56504F]">
                    {s.client_name}
                  </span>
                  <span className="font-['Poppins'] font-normal text-[13px] leading-[20px] text-[#B5A9A7]">
                    {s.service} · {s.type}
                  </span>
                </div>
              </div>

              {/* Right Status */}
              <div className="flex items-center gap-2">
                {s.display_status === 'Done' && (
                  <button
                    onClick={() => navigate(`/astro-report?client=${encodeURIComponent(s.client_name)}&type=${encodeURIComponent(s.service)}`)}
                    className="text-[12px] font-semibold text-[#8B6E4E] hover:underline bg-[#FAF6F0] border border-[#EADFCB] px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Report
                  </button>
                )}
                {renderStatusPill(s.display_status)}
              </div>
            </div>
          </React.Fragment>
        ))}

      </div>

    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TodayBookings({ bookings, isLoading }) {
  const navigate = useNavigate();

  const handleRowClick = (conversationId) => {
    navigate(`/messages/chat/${conversationId}`);
  };

  return (
    <div
      className="box-border flex flex-col justify-start items-start pt-[14px] pb-[14px] px-0 gap-[10px] w-full max-w-[408px] min-[430px]:w-[408px] min-h-[312px] bg-white shadow-[0px_2px_10px_0.2px_rgba(0,0,0,0.15)] rounded-[18px] flex-none grow-0"
    >
      {/* Header */}
      <div
        className="flex flex-row justify-between items-center p-0 gap-[15px] w-full h-[27px] px-[21px] box-border flex-none order-0 align-self-stretch grow-0 mb-2"
      >
        <span
          className="w-auto h-[24px] font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center text-[#424040]"
        >
          Today’s Chat Sessions
        </span>
      </div>

      {/* Bookings rows list */}
      <div className="flex flex-col w-full p-0 flex-1 overflow-y-auto no-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 w-full text-center">
            <span className="text-sm font-['Poppins'] text-[#2F2F2F]/60 animate-pulse">Loading conversations...</span>
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 w-full text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFEEDE] flex items-center justify-center mb-3">
              <span className="text-xl">💬</span>
            </div>
            <span className="font-['Sofia_Sans'] font-bold text-[16px] text-[#424040]">No conversations yet</span>
            <p className="font-['Poppins'] font-light text-[12px] text-[#2F2F2F]/70 mt-1 max-w-[240px]">
              When customers start chats, they will appear here.
            </p>
          </div>
        ) : (
          bookings.map((booking, idx) => {
            const customerName = booking.other_user?.name || 'Customer';
            const customerAvatar = booking.other_user?.image_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120';
            const lastMessageText = booking.last_message?.text || 'No messages yet';
            const lastMessageTime = booking.last_message?.time || '';
            const unreadCount = booking.unread_count || 0;

            return (
              <div
                key={booking.id}
                onClick={() => handleRowClick(booking.id)}
                className={`flex flex-row justify-between items-center py-[10px] px-[21px] w-full h-[80px] box-border flex-none grow-0 cursor-pointer hover:bg-gray-50 transition-colors ${idx < bookings.length - 1 ? 'border-b border-b-[rgba(0,0,0,0.06)]' : ''
                  }`}
              >
                {/* Left section */}
                <div
                  className="flex flex-row items-center p-0 gap-[16px] w-auto h-[60px] flex-none order-0 grow-0 box-border min-w-0 flex-1 pr-2"
                >
                  {/* Avatar */}
                  <div
                    className="relative flex flex-col justify-end items-end w-12 h-12 rounded-full bg-cover bg-center bg-no-repeat flex-shrink-0 border border-[#CF9914]/20 box-border overflow-visible"
                    style={{
                      backgroundImage: `url('${customerAvatar}')`
                    }}
                  />

                  {/* Text content */}
                  <div
                    className="flex flex-col items-start p-0 gap-[2px] h-auto flex-1 min-w-0 box-border"
                  >
                    {/* Name */}
                    <span
                      className="w-full font-['Poppins'] font-semibold text-[14px] leading-tight text-[#2A0B07] truncate"
                    >
                      {customerName}
                    </span>

                    {/* Message */}
                    <span
                      className={`w-full font-['Poppins'] text-[12px] leading-normal max-w-[200px] break-words ${unreadCount > 0 ? 'text-[#8E4A4A] font-medium' : 'text-[#2F2F2F]/80 font-light'
                        }`}
                    >
                      {lastMessageText}
                    </span>
                  </div>
                </div>

                {/* Right section (Time & Badge) */}
                <div
                  className="flex flex-col items-end justify-center p-0 gap-[4px] w-auto h-auto flex-shrink-0 box-border"
                >
                  {/* Time */}
                  <span
                    className="font-['Poppins'] font-light text-[11px] leading-none text-[#2F2F2F]/70 text-right"
                  >
                    {lastMessageTime}
                  </span>

                  {/* Unread badge */}
                  {unreadCount > 0 ? (
                    <div
                      className="flex flex-col justify-center items-center p-0 w-[18px] h-[18px] bg-[#CF9914] rounded-full flex-none order-1 grow-0 box-border"
                    >
                      <span
                        className="font-['Poppins'] font-bold text-[10px] leading-none text-white flex items-center justify-center text-center"
                      >
                        {unreadCount}
                      </span>
                    </div>
                  ) : (
                    <div className="w-[18px] h-[18px] flex-none" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

export default function RequestCard({ request, onAccept, onReject, isProcessing }) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!request?.expires_at) return;

    const calculateTimeLeft = () => {
      let dateStr = request.expires_at;
      if (typeof dateStr === 'string' && !dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.includes('-')) {
        dateStr = dateStr.replace(' ', 'T') + 'Z';
      }
      const expiresAt = new Date(dateStr).getTime();
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setSecondsLeft(diff);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [request]);

  if (!request) return null;

  const customerName = request.customer?.name || 'Customer';
  const customerAvatar = request.customer?.image 
    ? `https://zodimithra.howincloud.com/storage/${request.customer.image}` 
    : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120';

  const isExpired = secondsLeft <= 0 || request.status === 'expired';

  return (
    <div 
      className="box-border flex flex-col justify-start items-center pt-[14px] pb-[14px] px-[21px] w-full max-w-[408px] min-[430px]:w-[408px] h-[155px] bg-[#F6F1E9] border border-[#CF9914] rounded-[18px] flex-none grow-0 transition-all duration-200 shadow-sm"
    >
      {/* Profile and details */}
      <div 
        className="flex flex-row items-center p-0 gap-[10px] w-full max-w-[366px] h-[60px] flex-none order-0 grow-0 box-border"
      >
        {/* Avatar Image container */}
        <div 
          className="flex flex-col justify-center items-center p-[8px_12px] gap-2 w-[62px] h-[60px] rounded-[30px] flex-none order-0 grow-0 bg-cover bg-center bg-no-repeat overflow-hidden border border-[#CF9914]/20 box-border"
          style={{
            backgroundImage: `url('${customerAvatar}')`
          }}
        />

        {/* Text details */}
        <div 
          className="flex flex-col items-start p-0 gap-1 w-[265px] max-[430px]:w-[calc(100%-74px)] h-[43px] flex-none order-1 grow-0 box-border"
        >
          <span 
            className="w-full h-[21px] font-['Poppins'] font-semibold text-[14px] leading-[21px] flex items-center text-[#8E4A4A] flex-none order-0 grow-0 truncate"
          >
            New Request - {customerName}
          </span>
          
          <span 
            className="w-full h-[18px] font-['Poppins'] font-light text-[12px] max-[430px]:text-[11px] leading-[18px] flex items-center text-[#2F2F2F] flex-none order-1 grow-0"
          >
            {isExpired ? (
              <span className="text-red-500 font-semibold">⚠️ Request expired</span>
            ) : (
              <span>💬 Chat Request • {secondsLeft}s remaining</span>
            )}
          </span>
        </div>
      </div>

      {/* Vertical Gap */}
      <div className="h-[17px] flex-none" />

      {/* Action Buttons Row */}
      <div 
        className="flex flex-row justify-between items-center gap-[8px] w-full max-w-[366px] p-0 box-border"
      >
        <button
          onClick={() => onAccept(request.id)}
          disabled={isProcessing || isExpired}
          className="flex flex-row justify-center items-center p-[10px] gap-[10px] flex-1 h-[44px] bg-[#1D8A57] hover:bg-[#156e44] active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 rounded-[12px] border-0 cursor-pointer box-border"
        >
          <span 
            className="w-full h-[24px] font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center justify-center text-white"
          >
            {isProcessing ? 'Accepting...' : 'Accept'}
          </span>
        </button>

        <button
          onClick={() => onReject(request.id)}
          disabled={isProcessing || isExpired}
          className="box-border flex flex-row justify-center items-center p-[10px] gap-[10px] flex-1 h-[44px] bg-[#F5EDE3] hover:bg-[#ebdcc8] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-[#CF9914] rounded-[12px] cursor-pointer"
        >
          <span 
            className="w-full h-[24px] font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center justify-center text-[#CF9914]"
          >
            Decline
          </span>
        </button>
      </div>
    </div>
  );
}

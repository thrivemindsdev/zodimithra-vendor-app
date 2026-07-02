import React, { useState } from 'react';

export default function RequestCard() {
  const [requestStatus, setRequestStatus] = useState(null); // 'accepted' | 'declined' | null

  // Handle Accept/Decline actions
  const handleAction = (status) => {
    setRequestStatus(status);
  };

  return (
    <>
      {requestStatus === null ? (
        /* Figma Card - Frame 429 */
        <div 
          className="box-border flex flex-col justify-start items-center pt-[14px] pb-[14px] px-[21px] w-full max-w-[408px] h-[149px] bg-[#F6F1E9] border border-[#CF9914] rounded-[18px] flex-none grow-0 shadow-sm transition-all duration-200"
        >
          {/* Frame 428 - Profile and text details */}
          <div 
            className="flex flex-row items-center p-0 gap-[6px] w-full max-w-[366px] h-[60px] flex-none order-0 grow-0 box-border"
          >
            {/* Frame 400 - Avatar Image container */}
            <div 
              className="flex flex-col justify-center items-center w-[62px] h-[60px] rounded-[30px] flex-none order-0 grow-0 bg-cover bg-center bg-no-repeat overflow-hidden border border-white/20 box-border"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120')`
              }}
            />

            {/* Frame 413 - Text details */}
            <div 
              className="flex flex-col items-start p-0 gap-1 w-[265px] max-[430px]:w-[calc(100%-74px)] h-[43px] flex-none order-1 grow-0 box-border"
            >
              {/* New Request- Arjun Kumar */}
              <span 
                className="w-full font-['Poppins'] font-semibold text-[14px] leading-[21px] flex items-center text-[#8E4A4A] flex-none order-0 grow-0 text-left"
              >
                New Request- Arjun Kumar
              </span>
              
              {/* 💬 Chat. Love and Relationship . $30/min */}
              <span 
                className="w-full font-['Poppins'] font-light text-[12px] max-[430px]:text-[11px] leading-[18px] flex items-center text-[#2F2F2F] flex-none order-1 grow-0 text-left"
              >
                💬 Chat. Love and Relationship . $30/min
              </span>
            </div>
          </div>

          {/* Symmetrical Vertical Gap */}
          <div className="h-[17px] flex-none" />

          {/* Action Buttons Row */}
          <div 
            className="flex flex-row justify-between items-center gap-[8px] w-full max-w-[366px] p-0 box-border"
          >
            {/* Accept Button - Frame 415 */}
            <button
              onClick={() => handleAction('accepted')}
              className="flex flex-row justify-center items-center p-[10px] gap-[10px] flex-1 h-[44px] bg-[#1D8A57] hover:bg-[#156e44] active:scale-[0.98] transition-all duration-200 rounded-[12px] border-0 cursor-pointer box-border"
            >
              <span 
                className="w-full h-[24px] font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center justify-center text-white"
              >
                Accept
              </span>
            </button>

            {/* Decline Button - Frame 416 */}
            <button
              onClick={() => handleAction('declined')}
              className="box-border flex flex-row justify-center items-center p-[10px] gap-[10px] flex-1 h-[44px] bg-[#F5EDE3] hover:bg-[#ebdcc8] active:scale-[0.98] transition-all duration-200 border border-[#CF9914] rounded-[12px] cursor-pointer"
            >
              <span 
                className="w-full h-[24px] font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center justify-center text-[#CF9914]"
              >
                Decline
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Dynamic Feedback State Container */
        <div className="flex flex-col items-center justify-center animate-fade-in text-center p-6 bg-[#F6F1E9] border border-[#CF9914] rounded-[18px] w-full max-w-[408px] h-[149px] box-border">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${requestStatus === 'accepted' ? 'bg-[#1D8A57]/10 text-[#1D8A57]' : 'bg-[#8E4A4A]/10 text-[#8E4A4A]'}`}>
            {requestStatus === 'accepted' ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
              </svg>
            )}
          </div>
          <h3 className="font-['Sofia_Sans'] font-bold text-[16px] text-[#424040]">
            {requestStatus === 'accepted' ? 'Session Accepted' : 'Request Declined'}
          </h3>
          <button
            onClick={() => setRequestStatus(null)}
            className="mt-1 px-4 py-1 font-['Poppins'] text-[11px] font-semibold text-[#8E4A4A] bg-transparent border-0 cursor-pointer underline hover:text-[#5c2a2a] transition-all duration-200"
          >
            Undo Action
          </button>
        </div>
      )}
    </>
  );
}

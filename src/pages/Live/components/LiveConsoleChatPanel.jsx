import React from 'react';

export default function LiveConsoleChatPanel({
  chatMessages,
  isMuted,
  onToggleMute,
  cameraActive,
  onToggleCamera,
  onEndLive
}) {
  return (
    <div className="w-full p-4 rounded-[24px] bg-white border border-[rgba(0,0,0,0.04)] shadow-[0px_10px_30px_rgba(0,0,0,0.04)] box-border flex flex-col gap-3">
      <span className="font-['Sofia_Sans'] font-bold text-[16px] text-[#2A0B07] flex items-center justify-between">
        <span>Live Consultation Chat</span>
        <span className="text-[12px] font-normal text-[#6A5442]/70">Simulated Feed</span>
      </span>

      {/* Chat Feed */}
      <div className="h-44 overflow-y-auto border border-[#FFEEDE] rounded-[16px] p-3 bg-[#FFFBF4] flex flex-col gap-2">
        {chatMessages.map((msg) => (
          <div key={msg.id} className="flex flex-col bg-white p-2 rounded-xl border border-black/5">
            <div className="flex items-center justify-between">
              <span className="font-['Poppins'] font-semibold text-xs text-[#2A0B07]">
                {msg.user}
              </span>
              <span className="text-[10px] text-black/30">Active</span>
            </div>
            <span className="font-['Poppins'] text-xs text-[#6A5442] mt-0.5">
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Live Action Controls */}
      <div className="flex items-center justify-between gap-2.5 mt-2">
        
        {/* Mute Toggle */}
        <button 
          onClick={onToggleMute}
          className={`flex-1 h-12 rounded-[16px] border-0 cursor-pointer flex flex-col justify-center items-center gap-0.5 text-white active:scale-95 transition-all ${isMuted ? 'bg-[#9E2A2B]' : 'bg-[#2A0B07]'}`}
        >
          <span className="text-lg">{isMuted ? '🔇' : '🎙️'}</span>
          <span className="font-['Poppins'] text-[10px] font-medium uppercase tracking-wide">
            {isMuted ? 'Unmute' : 'Mute Mic'}
          </span>
        </button>

        {/* Video Toggle */}
        <button 
          onClick={onToggleCamera}
          className={`flex-1 h-12 rounded-[16px] border-0 cursor-pointer flex flex-col justify-center items-center gap-0.5 text-white active:scale-95 transition-all ${!cameraActive ? 'bg-[#9E2A2B]' : 'bg-[#2A0B07]'}`}
        >
          <span className="text-lg">{cameraActive ? '📷' : '🚫📷'}</span>
          <span className="font-['Poppins'] text-[10px] font-medium uppercase tracking-wide">
            {cameraActive ? 'Cam Off' : 'Cam On'}
          </span>
        </button>

        {/* Stop Live Button */}
        <button 
          onClick={onEndLive}
          className="flex-1 h-12 bg-gradient-to-r from-[#E23A34] to-[#C4392C] rounded-[16px] border-0 cursor-pointer flex flex-col justify-center items-center gap-0.5 text-white active:scale-95 hover:brightness-110 shadow-md transition-all"
        >
          <span className="text-lg">🛑</span>
          <span className="font-['Poppins'] text-[10px] font-bold uppercase tracking-wider">
            End Session
          </span>
        </button>

      </div>

    </div>
  );
}

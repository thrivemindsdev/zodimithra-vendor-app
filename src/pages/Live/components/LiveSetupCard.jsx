import React from 'react';

export default function LiveSetupCard({ topic, setTopic, onStartLive, isStarting = false }) {
  return (
    <div 
      className="w-full max-w-[410px] min-h-[383px] flex flex-col justify-center items-center p-6 gap-[21px] rounded-[31px] box-border shadow-[0px_15px_40px_rgba(42,11,7,0.15)] select-none"
      style={{ 
        background: 'radial-gradient(100% 100% at 50% 0%, #571B1B 0%, #782C2C 50.94%, #963634 100%)'
      }}
    >
      {/* Go Live row container (Frame 449) */}
      <div className="flex flex-row items-center justify-center gap-[4px] h-[38px] w-full">
        {/* Ellipse 4 live dot with animation */}
        <div className="flex items-center justify-center w-[38px] h-[38px] flex-none">
          <div className="w-[18px] h-[18px] bg-[#FF0000] rounded-full animate-pulse shadow-[0_0_8px_#FF0000]" />
        </div>
        {/* GO LIVE TEXT */}
        <span className="font-['Sofia_Sans'] font-semibold text-[32px] leading-[38px] text-white tracking-wide">
          GO LIVE
        </span>
      </div>

      {/* Subtitle text */}
      <p className="w-full max-w-[315px] font-['Poppins'] font-normal text-[20px] leading-[30px] text-white text-center m-0">
        Start your live astrology session
      </p>

      {/* Stats Container (Frame 454) */}
      <div className="flex flex-row items-center justify-between w-full max-w-[335px] h-[60px] gap-2">
        
        {/* Stat Col 1: Followers (Frame 451) */}
        <div className="flex flex-col items-center flex-1 h-[60px] gap-[6px]">
          <span className="w-full font-['Poppins'] font-semibold text-[20px] leading-[30px] text-center uppercase text-white">
            1.2k
          </span>
          <span className="w-full font-['Poppins'] font-light text-[15px] md:text-[16px] leading-[24px] text-center text-white/90">
            Followers
          </span>
        </div>
        
        {/* Stat Col 2: Sessions done (Frame 452) */}
        <div className="flex flex-col items-center flex-1 h-[60px] gap-[6px]">
          <span className="w-full font-['Poppins'] font-semibold text-[20px] leading-[30px] text-center text-white">
            47
          </span>
          <span className="w-full font-['Poppins'] font-light text-[15px] md:text-[16px] leading-[24px] text-center text-white/90 whitespace-nowrap">
            Sessions done
          </span>
        </div>

        {/* Stat Col 3: Avg rating (Frame 453) */}
        <div className="flex flex-col items-center flex-1 h-[60px] gap-[6px]">
          <span className="w-full font-['Poppins'] font-semibold text-[20px] leading-[30px] text-center text-white flex items-center justify-center gap-1">
            4.8 <span className="text-[#FFC227]">★</span>
          </span>
          <span className="w-full font-['Poppins'] font-light text-[15px] md:text-[16px] leading-[24px] text-center text-white/90 whitespace-nowrap">
            Avg rating
          </span>
        </div>

      </div>

      {/* Input & Button section (Frame 456) */}
      <div className="flex flex-col items-center gap-[10px] w-full max-w-[350px] h-[109px]">
        
        {/* Session Topic Input (Frame 455) */}
        <div className="w-full box-border flex flex-row justify-center items-center h-[47px] bg-white/10 border border-white/20 rounded-[15px] relative overflow-hidden transition-all focus-within:border-white/40 focus-within:bg-white/15">
          <input 
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Session Topic (e.g. Daily Horoscope 2025)"
            className="w-full h-full bg-transparent border-0 outline-none px-4 font-['Poppins'] font-light text-[14px] leading-[21px] text-white text-center placeholder-white/50 focus:ring-0 focus:outline-none tracking-wide capitalize"
          />
        </div>

        {/* Component 7: Start Live Button */}
        <button
          onClick={onStartLive}
          disabled={isStarting}
          className="w-full h-[52px] border-0 rounded-[20px] flex items-center justify-center cursor-pointer select-none active:scale-[0.98] hover:brightness-110 hover:shadow-[0_6px_20px_rgba(226,58,52,0.4)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(224, 58, 51, 0.2) 0%, rgba(250, 59, 58, 0.2) 100%), radial-gradient(50% 50% at 50% 50%, #E23A34 0%, #C4392C 100%)'
          }}
        >
          <span className="font-['Poppins'] font-bold text-[14px] leading-[20px] text-[#ECECEC] text-center tracking-widest uppercase">
            {isStarting ? 'Preparing…' : 'Start Live Now'}
          </span>
        </button>

      </div>

    </div>
  );
}

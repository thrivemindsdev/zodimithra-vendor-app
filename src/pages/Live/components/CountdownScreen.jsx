import React from 'react';

export default function CountdownScreen({ countdown }) {
  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-center relative">
        {/* Celestial loading animations */}
        <div className="w-32 h-32 rounded-full border-2 border-[#CF9914]/20 border-t-[#CF9914] animate-spin absolute top-1/2 left-1/2 -mt-16 -ml-16" />
        {/* <div className="w-28 h-28 rounded-full bg-[#2A0B07] flex items-center justify-center shadow-2xl relative z-10">
          <span className="font-['Sofia_Sans'] font-bold text-[48px] text-[#FFC227] animate-ping absolute">
            {countdown}
          </span>
          <span className="font-['Sofia_Sans'] font-bold text-[48px] text-[#FFC227] relative z-20">
            {countdown}
          </span>
        </div> */}
        <h3 className="font-['Poppins'] text-[#2A0B07] font-semibold text-lg mt-8 tracking-wider">ALIGNING PLANETS...</h3>
        <p className="font-['Poppins'] text-[#6A5442] text-sm mt-1">Starting live broadcast in a moment</p>
      </div>
    </div>
  );
}

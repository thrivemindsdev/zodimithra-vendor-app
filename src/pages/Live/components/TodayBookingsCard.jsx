import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TodayBookingsCard() {
  const navigate = useNavigate();
  // Local state for interactive Interested counts
  const [interested1, setInterested1] = useState(284);
  const [hasInterested1, setHasInterested1] = useState(false);

  const [interested2, setInterested2] = useState(127);
  const [hasInterested2, setHasInterested2] = useState(false);

  const handleToggleInterest1 = () => {
    if (hasInterested1) {
      setInterested1((prev) => prev - 1);
      setHasInterested1(false);
    } else {
      setInterested1((prev) => prev + 1);
      setHasInterested1(true);
    }
  };

  const handleToggleInterest2 = () => {
    if (hasInterested2) {
      setInterested2((prev) => prev - 1);
      setHasInterested2(false);
    } else {
      setInterested2((prev) => prev + 1);
      setHasInterested2(true);
    }
  };

  const handleSeeAll = () => {
    navigate('/bookings');
  };

  return (
    <div 
      className="w-full max-w-[410px] bg-white rounded-[18px] shadow-[0px_2px_10px_0.2px_rgba(0,0,0,0.25)] flex flex-col items-center gap-[20px] box-border select-none"
      style={{
        padding: '15px 12px 20px',
        alignSelf: 'stretch',
        flex: 'none',
        order: 3,
        grow: 0
      }}
    >
      {/* Frame 412: Heading Row */}
      <div className="flex flex-row justify-between items-center w-full h-[27px] px-2 box-border">
        {/* Today’s Bookings text */}
        <span 
          className="font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center"
          style={{ color: '#424040' }}
        >
          Today’s Bookings
        </span>

        {/* See All link */}
        <button
          onClick={handleSeeAll}
          className="bg-transparent border-0 font-['Sofia_Sans'] font-semibold text-[14px] leading-[17px] cursor-pointer hover:underline outline-none p-0"
          style={{ color: '#7B2D2D' }}
        >
          See All
        </button>
      </div>

      {/* Bookings List container */}
      <div className="flex flex-col w-full gap-[15px] px-2 box-border">
        
        {/* Booking Item 1: Shani Transit (Frame 424) */}
        <div className="flex flex-row items-center justify-between w-full py-2 hover:bg-[#FFFBF4] rounded-xl transition-all duration-200 px-1 box-border">
          
          {/* Left Column + Middle Content (Frame 423) */}
          <div className="flex flex-row items-center gap-[20px] flex-grow">
            
            {/* Left badge & subtitle (Frame 472) */}
            <div className="flex flex-col items-center gap-[5px] w-[65px] flex-none">
              {/* Soon Badge */}
              <div 
                className="flex items-center justify-center bg-[#7B2D2D] border border-white rounded-[34px]"
                style={{ width: '63.92px', height: '33.46px', boxSizing: 'border-box' }}
              >
                <span className="font-['Sofia_Sans'] font-semibold text-[16px] text-white">
                  Soon
                </span>
              </div>
              <span className="font-['Poppins'] font-medium text-[10px] leading-[14px] text-black text-center flex flex-col items-center">
                <span>Tomorrow</span>
                <span>6:00 PM</span>
              </span>
            </div>

            {/* Middle text (Frame 413) */}
            <div className="flex flex-col items-start gap-[4px] max-w-[200px]">
              <span className="font-['Poppins'] font-semibold text-[14px] leading-[20px] text-[#2A0B07]">
                Shani Transit 2025 Effect
              </span>
              <span className="font-['Poppins'] font-light text-[12px] leading-[16px] text-[#2F2F2F] text-left">
                All Signs · Q&A Enabled · Gifts On
              </span>
            </div>

          </div>

          {/* Right Column: Interested (Frame 471) */}
          <button 
            onClick={handleToggleInterest1}
            className={`flex flex-col items-center bg-transparent border-0 p-0 cursor-pointer outline-none active:scale-95 transition-all w-[60px] flex-none`}
          >
            <span 
              className={`font-['Sofia_Sans'] font-semibold text-[32px] leading-[38px] transition-colors duration-200 ${hasInterested1 ? 'text-[#373CEA]' : 'text-[#7B2D2D]'}`}
            >
              {interested1}
            </span>
            <span className="font-['Poppins'] font-light text-[12px] leading-[18px] text-[#2A0B07] whitespace-nowrap">
              Interested
            </span>
          </button>

        </div>

        {/* Separator line */}
        <div className="w-full h-[1px] bg-[#E7DAC9]/40" />

        {/* Booking Item 2: Jupiter & Venus (Frame 425) */}
        <div className="flex flex-row items-center justify-between w-full py-2 hover:bg-[#FFFBF4] rounded-xl transition-all duration-200 px-1 box-border">
          
          {/* Left Column + Middle Content (Frame 423) */}
          <div className="flex flex-row items-center gap-[20px] flex-grow">
            
            {/* Left badge & subtitle (Frame 472) */}
            <div className="flex flex-col items-center gap-[5px] w-[65px] flex-none">
              {/* Fri Badge */}
              <div 
                className="flex items-center justify-center bg-[#2563EB] border border-white rounded-[34px]"
                style={{ width: '63.92px', height: '33.46px', boxSizing: 'border-box' }}
              >
                <span className="font-['Sofia_Sans'] font-semibold text-[16px] text-white">
                  Fri
                </span>
              </div>
              <span className="font-['Poppins'] font-medium text-[10px] leading-[14px] text-black text-center flex flex-col items-center">
                <span>Friday</span>
                <span>6:00 PM</span>
              </span>
            </div>

            {/* Middle text (Frame 413) */}
            <div className="flex flex-col items-start gap-[4px] max-w-[200px]">
              <span className="font-['Poppins'] font-semibold text-[14px] leading-[20px] text-[#2A0B07]">
                Jupiter & Venus Conjunction
              </span>
              <span className="font-['Poppins'] font-light text-[12px] leading-[16px] text-[#2F2F2F] text-left">
                Deep Dive · Record On
              </span>
            </div>

          </div>

          {/* Right Column: Interested (Frame 471) */}
          <button 
            onClick={handleToggleInterest2}
            className={`flex flex-col items-center bg-transparent border-0 p-0 cursor-pointer outline-none active:scale-95 transition-all w-[60px] flex-none`}
          >
            <span 
              className={`font-['Sofia_Sans'] font-semibold text-[32px] leading-[38px] transition-colors duration-200 ${hasInterested2 ? 'text-[#373CEA]' : 'text-[#7B2D2D]'}`}
            >
              {interested2}
            </span>
            <span className="font-['Poppins'] font-light text-[12px] leading-[18px] text-[#2A0B07] whitespace-nowrap">
              Interested
            </span>
          </button>

        </div>

      </div>

    </div>
  );
}

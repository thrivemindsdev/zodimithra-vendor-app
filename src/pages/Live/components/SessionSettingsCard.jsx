import React, { useState } from 'react';

export default function SessionSettingsCard() {
  // Local state for interactive 2x2 grid modes
  const [qaActive, setQaActive] = useState(false);
  const [giftsActive, setGiftsActive] = useState(true);
  const [recordActive, setRecordActive] = useState(false);
  const [chatActive, setChatActive] = useState(true);

  // Local state for interactive toggle switches
  const [allowComments, setAllowComments] = useState(true);
  const [showEarnings, setShowEarnings] = useState(false);

  // State for showing waiting badge
  const [waitingCount, setWaitingCount] = useState(3);

  return (
    <div 
      className="w-full max-w-[410px] bg-white rounded-[18px] shadow-[0px_2px_10px_0.2px_rgba(0,0,0,0.25)] flex flex-col items-center gap-[20px] box-border select-none"
      style={{
        padding: '15px 12px 20px',
        alignSelf: 'stretch',
        flex: 'none',
        order: 1,
        grow: 0
      }}
    >
      {/* Frame 412: Title & Waiting Badge */}
      <div className="flex flex-row items-center justify-between w-full h-[24px] px-2 box-border">
        {/* Session settings text */}
        <span 
          className="font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center"
          style={{ color: '#424040' }}
        >
          Session settings
        </span>

      </div>

      {/* Frame 457: 2x2 Grid Modes */}
      

      {/* Frame 458: Allow viewer Comments Toggle Row */}
      <div className="flex flex-row justify-between items-center w-full px-4 box-border h-[27px] mt-2">
        <span className="font-['Poppins'] font-semibold text-[14px] leading-[21px] text-[#000000] flex items-center">
          Allow viewer Comments
        </span>
        
        {/* Toggle switch ON */}
        <button 
          onClick={() => setAllowComments(!allowComments)}
          className="w-[50px] h-[27px] rounded-[13.5px] border-0 cursor-pointer flex items-center p-[1px_2px] transition-all duration-300 outline-none"
          style={{ 
            background: allowComments ? '#7B2D2D' : '#E7D9D9',
            justifyContent: allowComments ? 'flex-end' : 'flex-start'
          }}
        >
          <div 
            className="w-[24px] h-[24px] bg-white rounded-[12.5px] transition-all duration-300"
            style={{ 
              boxShadow: allowComments ? 'none' : '0px 0px 4px rgba(0, 0, 0, 0.25)'
            }} 
          />
        </button>
      </div>

      {/* Frame 459: Show Earning publicly Toggle Row */}
      <div className="flex flex-row justify-between items-center w-full px-4 box-border h-[27px]">
        <span className="font-['Poppins'] font-semibold text-[14px] leading-[21px] text-[#000000] flex items-center">
          Show Earning publicly
        </span>
        
        {/* Toggle switch OFF */}
        <button 
          onClick={() => setShowEarnings(!showEarnings)}
          className="w-[50px] h-[27px] rounded-[13.5px] border-0 cursor-pointer flex items-center p-[1px_2px] transition-all duration-300 outline-none"
          style={{ 
            background: showEarnings ? '#7B2D2D' : '#E7D9D9',
            justifyContent: showEarnings ? 'flex-end' : 'flex-start'
          }}
        >
          <div 
            className="w-[24px] h-[24px] bg-white rounded-[12.5px] transition-all duration-300"
            style={{ 
              boxShadow: showEarnings ? 'none' : '0px 0px 4px rgba(0, 0, 0, 0.25)'
            }} 
          />
        </button>
      </div>

    </div>
  );
}

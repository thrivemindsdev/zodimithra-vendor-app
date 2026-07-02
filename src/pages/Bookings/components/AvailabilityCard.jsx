import React, { useState } from 'react';

export default function AvailabilityCard() {
  // State for active/inactive days
  const [days, setDays] = useState([
    { id: 'Mon', label: 'Mon', active: true },
    { id: 'Tue', label: 'Tue', active: true },
    { id: 'Wed', label: 'Wed', active: true },
    { id: 'Thu', label: 'Thu', active: true },
    { id: 'Fri', label: 'Fri', active: true },
    { id: 'Sat', label: 'Sat', active: false },
    { id: 'Sun', label: 'Sun', active: false }
  ]);

  // State for time range editing
  const [isEditing, setIsEditing] = useState(false);
  const [startTime, setStartTime] = useState('9:00 AM');
  const [endTime, setEndTime] = useState('7:00 PM');

  // Toggle active state for a day
  const toggleDay = (id) => {
    setDays((prev) =>
      prev.map((day) =>
        day.id === id ? { ...day, active: !day.active } : day
      )
    );
  };

  return (
    <div 
      className="w-full max-w-[408px] bg-[#FEFEFE] border border-[#F0EDEC] rounded-[20.4px] flex flex-col justify-start items-start gap-[17.78px] box-border select-none shadow-sm"
      style={{
        padding: '18.66px 17.77px 20.44px 12.44px',
        alignSelf: 'stretch',
        flex: 'none',
        order: 1,
        grow: 0
      }}
    >
      {/* Frame 648: Title and Edit Link */}
      <div className="flex flex-row justify-between items-center w-full h-[23px] px-1 box-border">
        {/* Availability Heading */}
        <span 
          className="font-['Poppins'] font-medium text-[15px] leading-[22px] flex items-center text-capitalize"
          style={{ color: '#5E5959' }}
        >
          Availability
        </span>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-transparent border-0 font-['Sofia_Sans'] font-semibold text-[15px] leading-[18px] cursor-pointer hover:underline outline-none p-0"
          style={{ color: '#917170' }}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      {/* Frame 645: Days Row */}
      <div className="flex flex-row flex-wrap items-center gap-[10px] w-full px-1 box-border">
        {days.map((day) => {
          if (day.active) {
            // Active Day - Frame 647
            return (
              <button
                key={day.id}
                onClick={() => toggleDay(day.id)}
                className="box-border flex flex-row justify-center items-center h-[34.67px] w-[56px] bg-[#7D2B2D] border border-[#721819] rounded-[10.22px] cursor-pointer active:scale-95 transition-all duration-150 outline-none shadow-sm"
                style={{ padding: '6px 12px' }}
              >
                <span className="font-['Poppins'] font-normal text-[13.33px] leading-[20px] text-[#E4CDCD] flex items-center">
                  {day.label}
                </span>
              </button>
            );
          } else {
            // Inactive Day - Frame 646
            return (
              <button
                key={day.id}
                onClick={() => toggleDay(day.id)}
                className="box-border flex flex-col justify-center items-center h-[34.67px] w-[52.44px] bg-[#F4E8DE] border border-[#D3BAAE] rounded-[10.88px] cursor-pointer active:scale-95 transition-all duration-150 outline-none"
                style={{ padding: '8px 12px' }}
              >
                <span className="font-['Sofia_Sans'] font-semibold text-[12.44px] leading-[15px] text-[#AD9A90] flex items-center">
                  {day.label}
                </span>
              </button>
            );
          }
        })}
      </div>

      {/* Time Range block (interactive inline edit) */}
      <div className="w-full px-1 box-border">
        {isEditing ? (
          <div className="flex items-center gap-2 bg-[#F4E8DE]/30 p-2 rounded-xl border border-[#D3BAAE]/40 w-fit">
            <input 
              type="text" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)}
              className="w-[70px] bg-white border border-[#D3BAAE] rounded px-1.5 py-0.5 text-xs text-[#5E5959] font-['Poppins'] font-medium text-center outline-none focus:border-[#7D2B2D]"
            />
            <span className="text-xs text-[#B7ABA8]">—</span>
            <input 
              type="text" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)}
              className="w-[70px] bg-white border border-[#D3BAAE] rounded px-1.5 py-0.5 text-xs text-[#5E5959] font-['Poppins'] font-medium text-center outline-none focus:border-[#7D2B2D]"
            />
          </div>
        ) : (
          <span 
            className="font-['Poppins'] font-normal text-[14px] leading-[21px] flex items-center"
            style={{ color: '#B7ABA8' }}
          >
            {startTime} – {endTime}
          </span>
        )}
      </div>

    </div>
  );
}

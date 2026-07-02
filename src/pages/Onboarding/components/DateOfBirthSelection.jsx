import React from 'react';

export default function DateOfBirthSelection({
  dobDay,
  setDobDay,
  dobMonth,
  setDobMonth,
  dobYear,
  setDobYear
}) {
  return (
    <div className="flex flex-col text-left w-full max-w-[337px] mx-auto box-border">
      {/* Heading 2 with margin */}
      <div className="flex flex-col items-start pb-[10.49px]">
        <h1 className="font-['Inter'] font-semibold text-[24.47px] leading-[37px] text-[#5D4037] m-0 flex items-center">
          Date of Birth
        </h1>
      </div>

      {/* Subtitle / Description container */}
      <div className="flex flex-col items-start pb-[27.96px] opacity-70">
        <p className="font-['Poppins'] font-normal text-[12.23px] leading-[18px] text-[#5D4037] m-0 flex items-center">
          Let's understand you determining your birth sign and personality
        </p>
      </div>

      {/* Frame 3: Inputs */}
      <div className="flex flex-row items-start gap-[7px] w-full h-[76.06px] mt-2">
        {/* Day Input */}
        <div className="flex flex-col items-start pb-[20.97px] flex-1 min-w-0 h-[76.06px]">
          <input
            type="text"
            maxLength="2"
            value={dobDay}
            onChange={(e) => setDobDay(e.target.value.replace(/\D/g, ''))}
            placeholder="dd"
            className="w-full h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] text-center box-border outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] placeholder-[#9CA3AF]"
          />
        </div>

        {/* Month Input */}
        <div className="flex flex-col items-start pb-[20.97px] flex-1 min-w-0 h-[76.06px]">
          <input
            type="text"
            maxLength="2"
            value={dobMonth}
            onChange={(e) => setDobMonth(e.target.value.replace(/\D/g, ''))}
            placeholder="mm"
            className="w-full h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] text-center box-border outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] placeholder-[#9CA3AF]"
          />
        </div>

        {/* Year Input */}
        <div className="flex flex-col items-start pb-[20.97px] flex-[2] min-w-0 h-[76.06px]">
          <input
            type="text"
            maxLength="4"
            value={dobYear}
            onChange={(e) => setDobYear(e.target.value.replace(/\D/g, ''))}
            placeholder="yyyy"
            className="w-full h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] text-center box-border outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] placeholder-[#9CA3AF]"
          />
        </div>
      </div>
    </div>
  );
}

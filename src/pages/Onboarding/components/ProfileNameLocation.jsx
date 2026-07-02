import React from 'react';

export default function ProfileNameLocation({
  name,
  setName,
  tobHour,
  setTobHour,
  tobMin,
  setTobMin,
  tobSec,
  setTobSec,
  tobPeriod,
  setTobPeriod,
  location,
  setLocation,
  qualification,
  setQualification,
  specialization,
  setSpecialization,
  employedOutside,
  setEmployedOutside,
  experience,
  setExperience,
  whereLearned,
  setWhereLearned,
  specializationsList = [],
}) {
  return (
    <div className="flex flex-col text-left gap-[21px] w-full max-w-[337px] mx-auto box-border">
      {/* Subtitle / Personalize header */}
      <div className="font-['Poppins'] font-semibold text-[16px] leading-[20px] text-[#5D4037] w-full flex items-center">
        Let's personalize your cosmic journey with your name
      </div>

      {/* --- SECTION 1: Personal Details --- */}
      <div className="flex flex-col gap-[15px] w-full">
        <h2 className="font-['Poppins'] font-bold text-[20px] leading-[20px] text-[#5D4037] m-0 flex items-center">
          Personal Details
        </h2>

        <div className="flex flex-col gap-[10px] w-full">
          {/* Name input */}
          <div className="flex flex-col gap-[10px] w-full">
            <label className="font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#2A0B07]">
              Name
            </label>
            <div className="w-full h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] flex items-center px-[13.98px] box-border">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-transparent border-0 outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] placeholder-[#9CA3AF]"
              />
            </div>
          </div>


          {/* Time of Birth input */}
          <div className="flex flex-col gap-[10px] w-full">
            <label className="font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#2A0B07]">
              Time of birth
            </label>
            <div className="flex flex-row items-center gap-[7px] w-full h-[55px]">
              {/* Hour */}
              <input
                type="text"
                maxLength="2"
                value={tobHour}
                onChange={(e) => setTobHour(e.target.value.replace(/\D/g, ''))}
                placeholder="hh"
                className="w-[65px] h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] text-center box-border outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] placeholder-[#9CA3AF]"
              />
              {/* Minute */}
              <input
                type="text"
                maxLength="2"
                value={tobMin}
                onChange={(e) => setTobMin(e.target.value.replace(/\D/g, ''))}
                placeholder="mm"
                className="w-[65px] h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] text-center box-border outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] placeholder-[#9CA3AF]"
              />
              {/* Second */}
              <input
                type="text"
                maxLength="2"
                value={tobSec}
                onChange={(e) => setTobSec(e.target.value.replace(/\D/g, ''))}
                placeholder="ss"
                className="w-[65px] h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] text-center box-border outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] placeholder-[#9CA3AF]"
              />
              {/* Period dropdown selector */}
              <select
                value={tobPeriod}
                onChange={(e) => setTobPeriod(e.target.value)}
                className="w-[122px] h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] text-center box-border outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235D4037' strokeWidth='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '14px',
                  paddingRight: '20px'
                }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* Birth Location input */}
          <div className="flex flex-col gap-[10px] w-full">
            <label className="font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#2A0B07]">
              Birth Location
            </label>
            <div className="w-full h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] flex items-center px-[13.98px] box-border">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your birth location"
                className="w-full bg-transparent border-0 outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] placeholder-[#9CA3AF]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: Professional Details --- */}
      <div className="flex flex-col gap-[15px] w-full">
        <h2 className="font-['Poppins'] font-bold text-[20px] leading-[20px] text-[#5D4037] m-0 flex items-center">
          Professional Details
        </h2>

        <div className="flex flex-col gap-[10px] w-full">
          {/* Education Qualification */}
          <div className="flex flex-col gap-[10px] w-full">
            <label className="font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#2A0B07]">
              Education Qualification
            </label>
            <div className="w-full h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] flex items-center px-[13.98px] box-border">
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="Enter your Qualification"
                className="w-full bg-transparent border-0 outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] placeholder-[#9CA3AF]"
              />
            </div>
          </div>

          {/* field of study or specialization */}
          <div className="flex flex-col gap-[10px] w-full">
            <label className="font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#2A0B07]">
              field of study or specialization?
            </label>
            <div className="w-full h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] flex items-center px-[13.98px] box-border">
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full bg-transparent border-0 outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235D4037' strokeWidth='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0px center',
                  backgroundSize: '14px',
                  paddingRight: '20px'
                }}
              >
                <option value="">Select Specialization</option>
                {specializationsList?.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Employed outside of astrology */}
          <div className="flex flex-col gap-[10px] w-full">
            <label className="font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#2A0B07]">
              Are you currently employed in any profession outside of astrology?
            </label>
            <div className="w-full h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] flex items-center px-[13.98px] box-border">
              <input
                type="text"
                value={employedOutside}
                onChange={(e) => setEmployedOutside(e.target.value)}
                placeholder="please describe your role"
                className="w-full bg-transparent border-0 outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] placeholder-[#9CA3AF]"
              />
            </div>
          </div>

          {/* Practice Years */}
          <div className="flex flex-col gap-[10px] w-full">
            <label className="font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#2A0B07]">
              How many years have you been practicing astrology?
            </label>
            <div className="w-full h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] flex items-center px-[13.98px] box-border">
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Enter the Years"
                className="w-full bg-transparent border-0 outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] placeholder-[#9CA3AF]"
              />
            </div>
          </div>

          {/* Where did you learn astrology */}
          <div className="flex flex-col gap-[10px] w-full">
            <label className="font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#2A0B07]">
              Where did you learn astrology?
            </label>
            <div className="w-full h-[55.08px] bg-white/60 border border-[#5D4037]/20 rounded-[10.49px] flex items-center px-[13.98px] box-border">
              <input
                type="text"
                value={whereLearned}
                onChange={(e) => setWhereLearned(e.target.value)}
                placeholder="Enter institution or teacher"
                className="w-full bg-transparent border-0 outline-none font-['Poppins'] text-[13.98px] text-[#2A0B07] placeholder-[#9CA3AF]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

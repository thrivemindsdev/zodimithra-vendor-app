import React from 'react';

export default function LanguageSelection({ selectedLangs, onToggleLang, languagesList }) {
  return (
    <div className="flex flex-col text-left">
      {/* Heading 2 with margin */}
      <div className="flex flex-col items-start pb-[10.49px]">
        <h1 className="font-['Inter'] font-semibold text-[24.47px] leading-[37px] text-[#5D4037] m-0 flex items-center">
          Languages Known
        </h1>
      </div>

      {/* Subtitle / Description container */}
      <div className="flex flex-col items-start pb-[27.96px] opacity-70">
        <p className="font-['Poppins'] font-normal text-[12.23px] leading-[18px] text-[#5D4037] m-0 flex items-center">
          Let's personalize your cosmic journey
        </p>
      </div>

      <div className="flex flex-col gap-3.5 mt-2 w-full">
        {/* Featured English Card */}
        <div
          onClick={() => onToggleLang('en')}
          className={`w-full flex items-center p-3.5 rounded-[20px] border-2 cursor-pointer transition-all duration-200 text-left ${selectedLangs.includes('en')
              ? 'border-[#CF9914] bg-[#FFFBF4]'
              : 'border-[#EBE0D5] bg-[#FEFEFE] hover:border-[#D1D5DB]'
            }`}
        >
          <div className="w-[52px] h-[52px] bg-white rounded-xl font-extrabold flex items-center justify-center text-3xl font-serif text-[#3D1F0A] shadow-sm flex-none">
            A
          </div>
          <div className="ml-4 flex-grow">
            <p className="text-[17px] font-semibold tracking-wide mb-0.5 text-[#3D1F0A] font-serif m-0">English</p>
            <h2 className="text-[12px] text-[#6F6F6F] font-light m-0">Global - Universal</h2>
          </div>
          {selectedLangs.includes('en') && (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="8.15625" fill="#D49E6A" stroke="#D49E6A" strokeWidth="1.6875" />
              <path d="M13.9033 5.26367C14.199 4.93431 14.7014 4.89475 15.0449 5.17383C15.4077 5.46885 15.4554 6.00594 15.1504 6.36035L9.3623 13.085C8.82868 13.7049 7.88114 13.7405 7.30273 13.1621L3.5752 9.43555C3.24479 9.10515 3.2448 8.56869 3.5752 8.23828C3.9056 7.90793 4.44207 7.90789 4.77246 8.23828L8.17871 11.6455L13.9033 5.26367Z" fill="white" stroke="white" strokeWidth="0.5625" />
            </svg>

          )}
        </div>

        {/* Regional Languages Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {languagesList.slice(1).map((lang) => {
            const isSelected = selectedLangs.includes(lang.id);
            return (
              <div
                key={lang.id}
                onClick={() => onToggleLang(lang.id)}
                className={`flex flex-col items-center justify-center px-4 pb-3 rounded-[20px] border-2 cursor-pointer transition-all duration-200 ${isSelected
                    ? 'border-[#CF9914] bg-[#FFFBF4]'
                    : 'border-[#EBE0D5] bg-[#FEFEFE] hover:border-[#D1D5DB]'
                  }`}
              >
                <div className="text-[44px] font-semibold text-[#B0A095] font-serif leading-tight">
                  {lang.letter}
                </div>
                <p className="text-sm font-semibold text-[#3D1F0A] font-serif m-0 leading-none">{lang.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

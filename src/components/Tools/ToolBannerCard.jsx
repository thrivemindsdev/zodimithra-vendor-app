import React from 'react';

export default function ToolBannerCard({ title, subtitle, metadata, badge, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex flex-col items-start p-4 gap-[10px] bg-[#FEFAF0] border border-[#C2962A] rounded-[20px] relative text-left box-border"
        >
            {/* Frame 485 */}
            <div className="flex flex-row items-center w-full">
                {/* Rectangle 4 */}
                <div className="w-[56px] h-[56px] mr-[14px] bg-[#D9D9D9] rounded-[8px] flex-shrink-0" />

                {/* Frame 484 */}
                <div className="flex flex-col items-start p-0 gap-[4px] ">
                    {/* Frame 486 */}
                    <div className="flex flex-row items-center p-0 gap-[6px]">
                        {/* Title: Poppins 500, size 18px, line-height 16px */}
                        <h2 className="font-['Poppins'] font-medium text-[18px] text-[#2A0B07]">
                            {title}
                        </h2>

                        {/* Badge (Frame 411) */}
                        {badge && (
                            <div className="flex flex-row justify-center items-center px-[7.43px] py-[3.71px] w-[55.86px] h-[19.43px] bg-[#FDF3DC] border border-[#CF9914] rounded-[14.86px] box-border">
                                <span className="font-['Sofia_Sans'] font-semibold text-[10.4px] leading-[12px] flex items-center text-[#CF9914]">
                                    {badge}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Subtitle: Poppins 300, size 12px, line-height 16px */}
                    <p className="font-['Poppins'] font-light text-[12px] leading-[16px] flex items-center text-[#2A0B07]">
                        {subtitle}
                    </p>

                    {/* Metadata: Poppins 300, size 12px, line-height 16px */}
                    <span className="font-['Poppins'] font-light text-[12px] leading-[16px] flex items-center text-[rgba(42,11,7,0.6)]">
                        {metadata}
                    </span>
                </div>
                <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.06693 4L0.000260312 0.933333L0.933594 -1.74846e-07L4.93359 4L0.933593 8L0.000260044 7.06667L3.06693 4Z" fill="#1D1B20" />
                </svg>
            </div>
        </button>
    );
}

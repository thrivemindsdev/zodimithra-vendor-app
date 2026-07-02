
export default function ToolCard({ title, subtitle, metadata, badge, onClick }) {
    const isNormal = !badge || badge === 'normal';
    const isOutline = badge === 'outline';
    const isNew = badge === 'new' || badge === 'New';

    return (
        <button
            type="button"
            onClick={onClick}
            className="group w-full flex flex-col items-start p-3 gap-[10px] bg-[#FFFFFF] border border-[#DEDEDE] shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[20px] text-left relative box-border overflow-hidden"
        >
            <div className="flex flex-col justify-center items-start w-full">
                <div className="w-[57px] h-[56px] bg-[#D9D9D9] rounded-[8px] flex-shrink-0" />

                <div className="flex flex-col items-start w-full">
                    <div className="flex flex-row items-center mt-[14px] w-full">
                        <h3 className="w-full font-['Poppins'] font-medium text-[18px] flex items-center text-[#2A0B07] truncate">
                            {title}
                        </h3>
                    </div>

                    <p className="w-full font-['Poppins'] font-light text-[12px] flex items-center text-[#2A0B07] truncate">
                        {subtitle}
                    </p>
                </div>

                <div className="flex flex-row items-center justify-between w-full mt-[14px]">
                    {isNormal && (
                        <span className="font-['Poppins'] font-light text-[12px] flex items-center text-[rgba(42,11,7,0.6)] whitespace-nowrap">
                            {metadata}
                        </span>
                    )}

                    {isOutline && (
                        /* Frame 492 - Outline variant */
                        <div className="flex flex-row justify-center items-center p-0 gap-[10px] w-[61px] h-[18px] bg-[#EBF4F0] border border-[#1D8A62] rounded-[12px] box-border flex-shrink-0">
                            <span className="w-[45px] h-[16px] font-['Poppins'] font-semibold text-[10px] leading-[16px] flex items-center justify-center text-[#1D8A62]">
                                {metadata}
                            </span>
                        </div>
                    )}

                    {isNew && (
                        /* Frame 492 - New variant */
                        <div className="flex flex-row justify-center items-center p-0 gap-[10px] w-[47px] h-[18px] bg-[#EDEBF4] border border-[#2563EB] rounded-[12px] box-border flex-shrink-0">
                            <span className="w-[22px] h-[16px] font-['Poppins'] font-semibold text-[10px] leading-[16px] flex items-center justify-center text-[#2563EB]">
                                New
                            </span>
                        </div>
                    )}

                    <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                        <path d="M3.06693 4L0.000260312 0.933333L0.933594 -1.74846e-07L4.93359 4L0.933593 8L0.000260044 7.06667L3.06693 4Z" fill="#1D1B20" />
                    </svg>
                </div>
            </div>
        </button>
    );
}

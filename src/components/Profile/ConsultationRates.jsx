import React from 'react';

const RateInputCard = ({ symbol, type, value, onChange }) => (
    <div className="flex-grow p-3 rounded-[16px] bg-[#F5EDE3] border-[0.82px] border-[#DEDEDE] text-center flex flex-col items-center min-w-[80px]">
        <div className="text-xl">{symbol}</div>
        <div className="text-[14px] font-semibold font-['Sofia_Sans'] text-[#2A0B07]">{type}</div>
        <div className="flex items-center justify-center gap-1 w-full">
            <input
                type="number"
                value={value ? String(value).replace(/\.00$/, '') : ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent outline-none text-center text-[18px] font-bold text-[#7D271C] font-['Sofia_Sans'] focus:border-[#7D271C] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
        </div>
        <span className="text-[10px] font-light font-['Sofia_Sans'] text-[#2A0B07]">₹/min</span>
    </div>
);

export default function ConsultationRates({
    chatPrice = 0,
    setChatPrice = () => { },
    callPrice = 0,
    setCallPrice = () => { },
    videoPrice = 0,
    setVideoPrice = () => { }
}) {
    return (
        <section className="bg-[#F9F8F4] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
            <h2 className="text-[20px] font-['Sofia_Sans'] font-semibold text-[#424040] px-4 pt-4 pb-2.5">Consultation Rates</h2>
            <div className="px-5 pb-4 md:px-6 md:pb-5 space-y-2.5">
                <div className="flex gap-3">
                    <RateInputCard symbol="💬" type="Chat" value={chatPrice} onChange={setChatPrice} />
                    <RateInputCard symbol="📞" type="Call" value={callPrice} onChange={setCallPrice} />
                    <RateInputCard symbol="🎥" type="Video" value={videoPrice} onChange={setVideoPrice} />
                </div>
            </div>
        </section>
    );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNativeApp } from '../../context/NativeAppContext';

export default function ProfileHeader({ 
    name = 'Guest Astrologer', 
    phone = '', 
    rating = '0.00', 
    totalSessions = '0',
    imageUrl = '',
    onImageSelect
}) {
    const navigate = useNavigate();
    const { isNativeApp, statusBarHeight } = useNativeApp();

    return (
        <header>
            <div 
                className="bg-[#2A0B07] text-[#F3CA06] px-4 py-3 flex items-center gap-3"
                style={{
                    paddingTop: isNativeApp ? statusBarHeight + 12 : 12,
                }}
            >
                <button 
                    aria-label="Back" 
                    onClick={() => navigate(-1)}
                    className="p-1 rounded-full active:scale-95 transition-transform"
                >
                    <svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.01723 10.2527L11.856 18.7968L10.0885 20.5054L0.365983 11.107C0.131644 10.8804 0 10.5731 0 10.2527C0 9.9323 0.131644 9.62501 0.365983 9.39842L10.0885 0L11.856 1.70858L3.01723 10.2527Z" fill="#F3CA06" />
                    </svg>
                </button>
                <h2 className="font-['Sofia_Sans'] font-semibold text-[20px] text-[#FFC227]">Profile</h2>
            </div>

            <div className="bg-[#2A0B07] rounded-b-3xl p-5 -mt-2 text-center text-white">
                <div className="relative w-[87px] h-[87px] bg-[#e6e6e6] rounded-full mx-auto mb-[3px] flex items-center justify-center border-2 border-white/20">
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="#d9d9d9" />
                            <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4v1H4v-1z" fill="#d9d9d9" />
                        </svg>
                    )}
                    
                    <label className="absolute bottom-0 right-0 bg-[#F3CA06] hover:bg-[#FFC227] text-[#2A0B07] p-1.5 rounded-full cursor-pointer shadow-md flex items-center justify-center w-[28px] h-[28px] transition-colors border border-[#2A0B07]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                            <circle cx="12" cy="13" r="4"/>
                        </svg>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && onImageSelect) {
                                    onImageSelect(file);
                                }
                            }}
                        />
                    </label>
                </div>

                <h3 className="font-['Sofia_Sans'] font-semibold text-[20px] text-white">{name}</h3>
                <p className="text-light text-[15px] font-poppins text-[#ECECEC] mt-[3px]">{phone ? `+${phone}` : 'No phone'}</p>

                <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center text-[#F3CA06]">
                        ★
                        <span className="text-[10px] font-light font-poppins text-[#ECECEC] ml-[3px]">{rating || '0.00'} rating</span>
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="bg-[#EADFC5] border-[1px] border-[#CF9914] text-[#CF9914] px-[9px] py-[4.5px] rounded-[10.28px] text-[10.29px] font-poppins">🏅 Gold Expert</span>
                    <span className="bg-transparent border-[1px] border-[#1F893B] text-[#1F893B] px-[9px] py-[4.5px] rounded-[10.28px] text-[10.29px] font-poppins">✓ Verified</span>
                    <span className="bg-transparent border-[1px] border-[#2563EB] text-[#2563EB] px-[9px] py-[4.5px] rounded-[10.28px] text-[10.29px] font-poppins">{totalSessions || '0'}+ Sessions</span>
                </div>
            </div>
        </header>
    );
}

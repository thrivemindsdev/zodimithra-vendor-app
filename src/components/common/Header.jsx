import React from 'react';
import { useNativeApp } from '../../context/NativeAppContext';
import homeBg from '../../assets/images/home.png';

export default function Header({ title = 'Acharya Pandit JI', showOnlineStatus = true }) {
    const { isNativeApp, statusBarHeight } = useNativeApp();
    return (
        <div
            className="relative flex flex-col items-center px-4 pt-7 pb-6 w-full bg-[#2A0B07] bg-cover bg-right-center bg-no-repeat shadow-[0px_4px_20px_rgba(0,0,0,0.6)] rounded-b-[24px]"
            style={{
                backgroundImage: `linear-gradient(135deg, rgba(42, 11, 7, 0.8) 0%, rgba(42, 11, 7, 0.4) 60%, rgba(42, 11, 7, 0.9) 100%), url(${homeBg})`,
                paddingTop: isNativeApp ? statusBarHeight + 28 : 28,
            }}
        >
            {/* Top header container */}
            <div className="flex flex-row justify-between items-center w-full px-1 box-border">
                <div className="flex flex-col items-start gap-0.5">
                    <span className="font-['Sofia_Sans'] font-semibold text-[13.5px] leading-tight text-[#ECECEC] opacity-85">
                        Good Morning
                    </span>
                    <h1 className="font-['Sofia_Sans'] font-bold text-[21px] leading-tight text-[#ECECEC] m-0">
                        {title.split(' ')[0]} <span className="text-[#E5A853] drop-shadow-[0px_0px_10px_rgba(229,168,83,0.3)]">{title.split(' ').slice(1).join(' ')}</span>
                    </h1>
                </div>

                {showOnlineStatus && (
                    <div className="flex flex-row items-center gap-2">
                        {/* Online Status Pill */}
                        <div className="flex flex-row justify-center items-center px-3.5 py-1.5 gap-2 h-8 bg-[rgba(236,236,236,0.15)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-[60px] box-border">
                            <div className="relative w-[9px] h-[9px] flex items-center justify-center">
                                <div className="w-[7px] h-[7px] bg-[#52C77A] rounded-full shadow-[0px_0px_4px_rgba(82,199,122,0.6)]" />
                            </div>
                            <span className="font-['Sofia_Sans'] font-medium text-[10.5px] leading-tight text-[#ECECEC] opacity-90">
                                Online
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

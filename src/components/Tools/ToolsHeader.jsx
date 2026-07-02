import React, { useState, useEffect } from 'react';
import toolImg from '../../assets/tools/tool.png';
import { useGetPanchangAdvancedQuery } from '../../redux/api/toolsApi';
import { useNativeApp } from '../../context/NativeAppContext';

export default function ToolsHeader({
    onBack,
    overviewStats: propOverviewStats,
    searchValue = '',
    onSearchChange,
    onPanchangClick,
}) {
    const { isNativeApp, statusBarHeight } = useNativeApp();
    const [coords, setCoords] = useState('9.9312,76.2673');
    const [locationName, setLocationName] = useState('Kochi');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords(`${position.coords.latitude},${position.coords.longitude}`);
                    setLocationName('My Location');
                },
                (error) => {
                    console.log('Using default coordinates (Kochi)', error);
                }
            );
        }
    }, []);

    const getBrowserTimezone = () => {
        const offsetMin = new Date().getTimezoneOffset();
        const sign = offsetMin <= 0 ? '+' : '-';
        const abs = Math.abs(offsetMin);
        const hh = String(Math.floor(abs / 60)).padStart(2, '0');
        const mm = String(abs % 60).padStart(2, '0');
        return `${sign}${hh}:${mm}`;
    };

    const getISOStringWithTimezone = (date, timezoneOffset) => {
        const pad = (num) => String(num).padStart(2, '0');
        const YYYY = date.getFullYear();
        const MM = pad(date.getMonth() + 1);
        const DD = pad(date.getDate());
        const hh = pad(date.getHours());
        const mm = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}${timezoneOffset}`;
    };

    const timezone = getBrowserTimezone();
    const datetime = getISOStringWithTimezone(new Date(), timezone);

    const { data, isLoading } = useGetPanchangAdvancedQuery({
        datetime,
        coordinates: coords,
        ayanamsa: 1,
        la: 'en'
    }, {
        skip: !coords
    });

    const formatTimeOnly = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const rahuPeriod = data?.data?.inauspicious_period?.find(p => p.name === 'Rahu')?.period?.[0];
    const rahuRange = rahuPeriod
        ? `${formatTimeOnly(rahuPeriod.start)}–${formatTimeOnly(rahuPeriod.end)}`
        : '';

    const stats = (propOverviewStats && propOverviewStats.length > 0)
        ? propOverviewStats
        : [
            { label: data?.data?.tithi?.[0]?.name || '...', value: 'Tithi' },
            { label: data?.data?.nakshatra?.[0]?.name || '...', value: 'Nakshatra' },
            { label: data?.data?.yoga?.[0]?.name || '...', value: 'Yoga' },
            { label: rahuRange || '...', value: 'Rahu Kaal' }
        ];

    return (
        <div 
            className="relative overflow-hidden bg-[#2A0B07] p-4 sm:p-5 md:p-6 rounded-b-[16px] shadow-[0px_8px_24px_rgba(0,0,0,0.3)]"
            style={{
                paddingTop: isNativeApp ? statusBarHeight + 16 : undefined,
            }}
        >
            <img
                src={toolImg}
                alt="Astro Tool Overlay"
                className="absolute right-[-72px] top-[-35px] h-[290px] w-[290px] object-contain opacity-[0.35] pointer-events-none select-none mix-blend-screen"
            />

            {/* Header Content Top Row */}
            <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-[14.5px]">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center justify-center"
                        aria-label="Go Back"
                    >
                        <svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M3.01723 10.2527L11.856 18.7968L10.0885 20.5054L0.365983 11.107C0.131644 10.8804 0 10.5731 0 10.2527C0 9.9323 0.131644 9.62501 0.365983 9.39842L10.0885 0L11.856 1.70858L3.01723 10.2527Z" fill="#F3CA06" />
                        </svg>
                    </button>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[20px] font-semibold font-['Sofia_Sans'] text-[#FFC227]">
                                Astro Tools
                            </span>
                            <svg className="w-4 h-4 text-[#F3CA06] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                            </svg>
                        </div>
                        <h1 className="-mt-1 text-[14px] font-['Poppins'] text-[#EBB863]">
                            Sacred sounds for your soul
                        </h1>
                    </div>
                </div>
            </div>

            {/* Overview Stats Glassmorphic Card Container */}
            <div className="relative z-10 mt-3 rounded-[16px] border border-white/20 bg-transparent">
                <div className="flex flex-row justify-between items-center p-[8px] gap-[2px] w-full bg-[rgba(236,236,236,0.2)] rounded-[12px] backdrop-blur-[3px] mx-auto">
                    {stats.map((item, index) => (
                        <React.Fragment key={item.value}>
                            <div className="flex flex-col items-center p-0 gap-[5px] h-[38px] flex-1">
                                <span className="w-full text-[12px] font-semibold font-['Poppins'] leading-[18px] text-center text-[#ECECEC] truncate">
                                    {item.label}
                                </span>
                                <span className="w-full text-[12px] font-normal font-['Inter'] leading-[15px] text-center text-[#ECECEC] truncate">
                                    {item.value}
                                </span>
                            </div>
                            {index < stats.length - 1 && (
                                <div className="w-[1px] h-[36px] bg-[#ECECEC] self-center flex-shrink-0" />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Bottom Interactive & Loading Row */}
                <div className="flex items-center justify-between px-3.5 py-2.5 text-[11px] sm:text-[12px]">
                    <div className="flex items-center gap-2 text-[#ECECEC] text-[10px] font-['Poppins']">
                        <span className={`h-2 w-2 rounded-full ${isLoading ? 'bg-amber-400' : 'bg-[#3EC270]'} animate-pulse`} />
                        <span>{isLoading ? 'Today • Loading...' : `Today • ${locationName}`}</span>
                    </div>
                    <button
                        type="button"
                        onClick={onPanchangClick}
                        className="flex items-center gap-1 font-semibold text-[#EBB863] text-[12px] font-['Poppins']"
                    >
                        Full Panchang <span className="text-[13px] translate-y-[-4px]">→</span>
                    </button>
                </div>
            </div>

            {/* Search Input Bar (Frame 455) */}
            <div className="relative z-10 mt-4 flex flex-row items-center pt-[13px] pr-[51px] pb-[13px] pl-[13px] gap-[10px] w-full max-w-[410px] h-[47px] bg-[rgba(236,236,236,0.1)] border border-[rgba(236,236,236,0.2)] rounded-[15px] mx-auto box-border">
                <span className="text-[#ECECEC] flex-shrink-0 flex items-center justify-center">
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2938 12.5697 16.0025 10.8204 16 9C16 5.133 12.867 2 9 2C5.133 2 2 5.133 2 9C2 12.867 5.133 16 9 16C10.8204 16.0025 12.5697 15.2938 13.875 14.025L14.025 13.875Z" fill="#ECECEC" />
                    </svg>
                </span>
                <input
                    type="search"
                    placeholder="Search"
                    value={searchValue}
                    onChange={onSearchChange}
                    className="w-full bg-transparent border-none outline-none placeholder:font-light text-white text-[14px] placeholder:text-[#ECECEC]"
                />
            </div>
        </div>
    );
}

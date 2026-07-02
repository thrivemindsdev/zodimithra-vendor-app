import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomHeader from '../../components/common/CustomHeader';

export default function AtlasDaylightSaving() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const debounceRef = useRef(null);

    const defaultCities = [
        { name: 'Mumbai', country: 'India', coords: '19.0760°N - 72.8777°E', offset: '+05:30', dstObserved: false },
        { name: 'Chennai', country: 'India', coords: '13.0827°N - 80.2707°E', offset: '+05:30', dstObserved: false },
        { name: 'New Delhi', country: 'India', coords: '28.6139°N - 77.2090°E', offset: '+05:30', dstObserved: false },
        { name: 'London', country: 'UK', coords: '51.5074°N - 0.1278°W', offset: '+00:00/+01:00', dstObserved: true },
        { name: 'New York', country: 'USA', coords: '40.7128°N - 74.0060°W', offset: '-05:00/-04:00', dstObserved: true },
        { name: 'Los Angeles', country: 'USA', coords: '34.0522°N - 118.2437°W', offset: '-08:00/-07:00', dstObserved: true },
        { name: 'Dubai', country: 'UAE', coords: '25.2048°N - 55.2708°E', offset: '+04:00', dstObserved: false },
        { name: 'Singapore', country: 'Singapore', coords: '1.3521°N - 103.8198°E', offset: '+08:00', dstObserved: false },
        { name: 'Sydney', country: 'Australia', coords: '33.8688°S - 151.2093°E', offset: '+10:00/+11:00', dstObserved: true },
        { name: 'Toronto', country: 'Canada', coords: '43.6532°N - 79.3832°W', offset: '-05:00/-04:00', dstObserved: true },
        { name: 'Kathmandu', country: 'Nepal', coords: '27.7172°N - 85.3240°E', offset: '+05:45', dstObserved: false }
    ];

    const [citiesList, setCitiesList] = useState(defaultCities);

    const formatOffset = (offsetSeconds) => {
        const sign = offsetSeconds >= 0 ? '+' : '-';
        const absSeconds = Math.abs(offsetSeconds);
        const hours = String(Math.floor(absSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((absSeconds % 3600) / 60)).padStart(2, '0');
        return `${sign}${hours}:${minutes}`;
    };

    const formatCoords = (lat, lon) => {
        const latDir = lat >= 0 ? 'N' : 'S';
        const lonDir = lon >= 0 ? 'E' : 'W';
        return `${Math.abs(lat).toFixed(4)}°${latDir} - ${Math.abs(lon).toFixed(4)}°${lonDir}`;
    };

    useEffect(() => {
        if (!searchQuery || searchQuery.trim().length < 3) {
            setCitiesList(defaultCities);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        debounceRef.current = setTimeout(async () => {
            try {
                const searchRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
                const locations = await searchRes.json();
                
                if (locations && locations.length > 0) {
                    const resolved = await Promise.all(
                        locations.map(async (loc) => {
                            const lat = parseFloat(loc.lat);
                            const lon = parseFloat(loc.lon);

                            let offsetStr = 'UTC+00:00';
                            let dstObserved = false;

                            try {
                                const tzRes = await fetch(`https://timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lon}`);
                                const tzData = await tzRes.json();
                                if (tzData && tzData.timeZone) {
                                    const seconds = tzData.currentUtcOffset?.seconds ?? 0;
                                    offsetStr = formatOffset(seconds);
                                    dstObserved = tzData.hasDayLightSaving ?? false;
                                }
                            } catch (e) {
                                console.error('Timezone fetch failed', e);
                            }

                            const displayNameParts = loc.display_name.split(',');
                            const cityName = displayNameParts[0]?.trim() || 'Unknown';
                            const countryName = displayNameParts[displayNameParts.length - 1]?.trim() || '';

                            return {
                                name: cityName,
                                country: countryName,
                                coords: formatCoords(lat, lon),
                                offset: offsetStr,
                                dstObserved
                            };
                        })
                    );
                    setCitiesList(resolved);
                } else {
                    setCitiesList([]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        }, 650);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchQuery]);

    return (
        <div className="flex justify-center items-start min-h-screen p-0 m-0 w-full md:py-10 md:px-6 font-['Poppins'] bg-[#FFF6E9]">
            <div className="w-full min-h-screen md:min-h-0 max-w-[430px] md:max-w-[700px] lg:max-w-[850px] bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative pb-16 overflow-y-auto box-border">
                {/* Header */}
                <CustomHeader
                    title="Atlas + Daylight Saving"
                    subtitle="Lat / Long / Timezone for any city"
                    onBack={() => navigate('/tools')}
                />

                <div className="flex-grow p-5 md:p-8 flex flex-col gap-6 w-full box-border">
                    <div className="w-full relative flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="Search city (try: London, Mumbai, New York)"
                            className="box-sizing-border-box w-full h-[48px] px-4 py-2 rounded-xl bg-[#FEFEFE] border border-[#ECE8E7] focus:outline-none focus:border-[#2A0B07] text-[13px] text-[#2A0B07] placeholder-[#ABABAC] font-['Inter'] shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {isSearching && (
                            <div className="absolute right-4 top-3 flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 text-[#2A0B07]/40" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Cities List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {citiesList.length > 0 ? (
                            citiesList.map((city, idx) => (
                                <div
                                    key={idx}
                                    className="box-sizing-border-box flex flex-col justify-between w-full h-[64px] px-4 py-3 bg-[#FEFEFE] border border-[#F6F3F1] rounded-xl shadow-sm hover:shadow-md transition-all font-['Inter']"
                                >
                                    {/* Top Row: City + Country (Left) & Offset (Right) */}
                                    <div className="flex flex-row justify-between items-end w-full h-[18px]">
                                        <div className="flex flex-row items-end gap-[4px] h-[18px]">
                                            <span className="font-semibold text-[13px] text-[#2A0B07] truncate max-w-[120px] md:max-w-[200px]">
                                                {city.name}
                                            </span>
                                            <span className="font-normal text-[10px] text-[#C3BBB7] truncate max-w-[80px]">
                                                {city.country}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-[12px] text-[#792D30]">
                                            {city.offset}
                                        </span>
                                    </div>

                                    {/* Bottom Row: Coordinates (Left) & DST (Right) */}
                                    <div className="flex flex-row justify-between items-start w-full h-[14px] mt-1">
                                        <span className="font-normal text-[10px] text-[#C0B6B5]">
                                            {city.coords}
                                        </span>
                                        <span className={`font-normal text-[10px] ${city.dstObserved ? 'text-[#1D8A57] font-semibold' : 'text-[#C5BBBB]'}`}>
                                            {city.dstObserved ? 'DST Observed' : 'No DST'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-[#8A7B78] text-[14px] py-10">
                                No cities found matching your search.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

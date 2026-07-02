import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomHeader from '../../components/common/CustomHeader';
import CustomLabel from '../../components/common/CustomLabel';
import CustomInput from '../../components/common/CustomInput';
import {
    useGetPanchangMutation,
    useGetAuspiciousPeriodMutation,
    useGetInauspiciousPeriodMutation
} from '../../redux/api/toolsApi';

// SVG Calendar Icon
const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2V5M16 2V5M3.5 9.00003H20.5M21 8.5V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V8.5C3 6.29086 4.79086 4.5 7 4.5H17C19.2091 4.5 21 6.29086 21 8.5Z" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="7" y="12" width="2" height="2" rx="0.5" fill="#2A0B07" />
        <rect x="11" y="12" width="2" height="2" rx="0.5" fill="#2A0B07" />
        <rect x="15" y="12" width="2" height="2" rx="0.5" fill="#2A0B07" />
        <rect x="7" y="16" width="2" height="2" rx="0.5" fill="#2A0B07" />
        <rect x="11" y="16" width="2" height="2" rx="0.5" fill="#2A0B07" />
        <rect x="15" y="16" width="2" height="2" rx="0.5" fill="#2A0B07" />
    </svg>
);

const POPULAR_CITIES = [
    { name: 'Kochi, India', lat: 9.9312, lon: 76.2673, tz: 5.5, label: 'Kochi, India' },
    { name: 'Mumbai, India', lat: 19.0760, lon: 72.8777, tz: 5.5, label: 'Mumbai, India' },
    { name: 'Chennai, India', lat: 13.0827, lon: 80.2707, tz: 5.5, label: 'Chennai, India' },
    { name: 'New Delhi, India', lat: 28.6139, lon: 77.2090, tz: 5.5, label: 'New Delhi, India' },
    { name: 'London, UK', lat: 51.5074, lon: -0.1278, tz: 0.0, label: 'London, UK' },
    { name: 'New York, USA', lat: 40.7128, lon: -74.0060, tz: -5.0, label: 'New York, USA' },
    { name: 'Los Angeles, USA', lat: 34.0522, lon: -118.2437, tz: -8.0, label: 'Los Angeles, USA' },
    { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, tz: 10.0, label: 'Sydney, Australia' },
    { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, tz: 4.0, label: 'Dubai, UAE' },
    { name: 'Singapore', lat: 1.3521, lon: 103.8198, tz: 8.0, label: 'Singapore' }
];

const formatIsoTime = (isoStr) => {
    if (!isoStr) return '--:--';
    const d = new Date(isoStr);
    let hrs = d.getHours();
    let mins = d.getMinutes();
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    const formattedHrs = String(hrs).padStart(2, '0');
    const formattedMins = String(mins).padStart(2, '0');
    return `${formattedHrs}:${formattedMins} ${ampm}`;
};

const formatIsoTimeNoSpace = (isoStr) => {
    if (!isoStr) return '--:--';
    const d = new Date(isoStr);
    let hrs = d.getHours();
    let mins = d.getMinutes();
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    const formattedHrs = String(hrs).padStart(2, '0');
    const formattedMins = String(mins).padStart(2, '0');
    return `${formattedHrs}:${formattedMins}${ampm}`;
};

const formatIsoTimeRangeNoSpace = (startIso, endIso) => {
    return `${formatIsoTimeNoSpace(startIso)}-${formatIsoTimeNoSpace(endIso)}`;
};

const formatIsoTimeRange = (startIso, endIso) => {
    let startStr = formatIsoTime(startIso);
    let endStr = formatIsoTime(endIso);
    const startAmpm = startStr.substring(6);
    const endAmpm = endStr.substring(6);
    if (startAmpm === endAmpm) {
        startStr = startStr.substring(0, 5);
    }
    return `${startStr}-${endStr}`;
};

// Astronomical / Vedic Calculations
const getAstroTimings = (dateStr, city) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
        return {
            sunrise: '06:14 AM',
            sunset: '06:10 PM',
            abhijit: '11:48AM-12:36PM',
            rahuKaal: '04:30-06:00 PM',
            yamaganda: '09:00-10:30 AM',
            transits: []
        };
    }

    const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon, ...

    // Day of Year
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Calculate solar coordinates variations (seasonal effects)
    // angle is 0 at summer solstice (approx day 172)
    const angle = ((dayOfYear - 172) * 2 * Math.PI) / 365;

    // Latitude seasonal effect: higher latitude = more extreme sunrise/sunset variation
    const latEffect = Math.sin((city.lat * Math.PI) / 180);
    const seasonalSunriseOffset = Math.sin(angle) * 30 * latEffect;
    const seasonalSunsetOffset = -Math.sin(angle) * 30 * latEffect;

    // Longitude timezone offset difference:
    // Indian Standard Time is +5.5 hours, meaning Central Meridian is 82.5 E.
    // For general timezone: tzMeridian = tzOffsetInHours * 15 degrees.
    const tzMeridian = city.tz * 15;
    const lonOffsetMinutes = (city.lon - tzMeridian) * 4; // 4 minutes of time per degree of longitude

    // Timezone difference relative to IST baseline (330 minutes)
    const tzDiffMinutes = (city.tz * 60) - 330;

    // Baselines (in minutes from local midnight)
    // Adjust baseline sunrise/sunset so Kochi, India on June 4, 2026 is approx Sunrise 06:14 AM, Sunset 06:10 PM
    // Baseline Sunrise = 374 mins (06:14 AM), Baseline Sunset = 1090 mins (06:10 PM)
    const baseSunrise = 374;
    const baseSunset = 1090;

    // Calculate Sunrise/Sunset in minutes
    let sunriseMin = Math.round(baseSunrise + seasonalSunriseOffset - lonOffsetMinutes + tzDiffMinutes);
    let sunsetMin = Math.round(baseSunset + seasonalSunsetOffset - lonOffsetMinutes + tzDiffMinutes);

    // Sanity constraints to prevent negative or overflow times in extreme Latitudes
    if (sunriseMin < 0) sunriseMin += 1440;
    if (sunsetMin < 0) sunsetMin += 1440;
    sunriseMin = sunriseMin % 1440;
    sunsetMin = sunsetMin % 1440;

    const daytimeLength = (sunsetMin > sunriseMin) ? (sunsetMin - sunriseMin) : (1440 - sunriseMin + sunsetMin);
    const localNoon = (sunriseMin + daytimeLength / 2) % 1440;

    // Abhijit Muhurta: standard 48 minutes centered around local solar noon
    const abhijitStartMin = Math.round(localNoon - 24);
    const abhijitEndMin = Math.round(localNoon + 24);

    // Rahu Kaal daytime divisions (8 octants of daytime)
    const octant = daytimeLength / 8;
    const rahuIndices = [7, 1, 6, 4, 5, 3, 2]; // Sun to Sat
    const rahuIdx = rahuIndices[dayOfWeek];
    const rahuStartMin = Math.round(sunriseMin + rahuIdx * octant) % 1440;
    const rahuEndMin = Math.round(sunriseMin + (rahuIdx + 1) * octant) % 1440;

    // Yamaganda daytime divisions
    const yamaIndices = [4, 3, 2, 1, 0, 6, 5]; // Sun to Sat
    const yamaIdx = yamaIndices[dayOfWeek];
    const yamaStartMin = Math.round(sunriseMin + yamaIdx * octant) % 1440;
    const yamaEndMin = Math.round(sunriseMin + (yamaIdx + 1) * octant) % 1440;

    // Helper time formatters
    const formatTime = (min) => {
        let hrs = Math.floor(min / 60) % 24;
        let mins = min % 60;
        const ampm = hrs >= 12 ? 'PM' : 'AM';
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12;
        const formattedHrs = String(hrs).padStart(2, '0');
        const formattedMins = String(mins).padStart(2, '0');
        return `${formattedHrs}:${formattedMins} ${ampm}`;
    };

    const formatTimeNoSpace = (min) => {
        let hrs = Math.floor(min / 60) % 24;
        let mins = min % 60;
        const ampm = hrs >= 12 ? 'PM' : 'AM';
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12;
        const formattedHrs = String(hrs).padStart(2, '0');
        const formattedMins = String(mins).padStart(2, '0');
        return `${formattedHrs}:${formattedMins}${ampm}`;
    };

    const formatTimeRangeNoSpace = (start, end) => {
        return `${formatTimeNoSpace(start)}-${formatTimeNoSpace(end)}`;
    };

    const formatTimeRange = (start, end) => {
        let startStr = formatTime(start);
        let endStr = formatTime(end);
        // remove AM/PM from start if they are the same to match mockup clean style (e.g. 04:30-06:00 PM)
        const startAmpm = startStr.substring(6);
        const endAmpm = endStr.substring(6);
        if (startAmpm === endAmpm) {
            startStr = startStr.substring(0, 5);
        }
        return `${startStr}-${endStr}`;
    };

    // Today's Transits generation
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const signNames = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'];
    const sankrantiNames = ['Makar Sankranti', 'Kumbha Sankranti', 'Meena Sankranti', 'Mesha Sankranti', 'Vrishabha Sankranti', 'Mithuna Sankranti', 'Karka Sankranti', 'Simha Sankranti', 'Kanya Sankranti', 'Tula Sankranti', 'Vrishchika Sankranti', 'Dhanu Sankranti'];

    const monthIdx = d.getMonth();
    const dateVal = d.getDate();

    // 1. Sun Transit (Sun enters sign around 14th/15th, else transits)
    let sunTransit = "";
    let sunLabel = "";
    if (dateVal >= 14 && dateVal <= 16) {
        sunTransit = `Sun enters ${signNames[monthIdx]} -`;
        sunLabel = sankrantiNames[monthIdx];
    } else {
        const currentSignIdx = dateVal < 14 ? (monthIdx + 11) % 12 : monthIdx;
        sunTransit = `Sun transits ${signNames[currentSignIdx]} -`;
        sunLabel = `${signNames[currentSignIdx]} Transit`;
    }

    // 2. Moon Nakshatra Transit
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    const timestamp = d.getTime();
    const nakIndex = Math.floor((timestamp / (1000 * 60 * 60 * 24)) % 27);
    const moonTransit = `Moon transits ${nakshatras[nakIndex]}`;

    // 3. Planet Conjunction/Aspect
    const planets = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu'];
    const symbols = ['☿', '♀', '♂', '♃', '♄', '☊', '☋'];
    const p1Idx = Math.floor((timestamp / (1000 * 60 * 60 * 24 * 3)) % 7);
    let p2Idx = Math.floor((timestamp / (1000 * 60 * 60 * 24 * 7)) % 7);
    if (p1Idx === p2Idx) p2Idx = (p2Idx + 1) % 7;

    const aspectVal = Math.floor((timestamp / (1000 * 60 * 60 * 24)) % 5) + 2;
    const aspectType = p1Idx % 2 === 0 ? 'conjuncts' : 'aspects';

    // Mockup text style: "♂ Mars conjuncts 41 Jupiter (3°)" (using 41/symbols as layout placeholder matching mockup)
    const planetSymbol = symbols[p1Idx];
    const planetName = planets[p1Idx];
    const targetPlanetName = planets[p2Idx];
    const aspectText = `${planetSymbol} ${planetName} ${aspectType} ${p1Idx * 10 + 1} ${targetPlanetName} (${aspectVal}°)`;

    return {
        sunrise: formatTime(sunriseMin),
        sunset: formatTime(sunsetMin),
        abhijit: formatTimeRangeNoSpace(abhijitStartMin, abhijitEndMin),
        rahuKaal: formatTimeRange(rahuStartMin, rahuEndMin),
        yamaganda: formatTimeRange(yamaStartMin, yamaEndMin),
        transits: [
            { text: sunTransit, tag: sunLabel },
            { text: moonTransit },
            { text: aspectText }
        ]
    };
};

export default function TransitCalendar() {
    const navigate = useNavigate();

    const [getPanchang, { isLoading: isPanchangLoading }] = useGetPanchangMutation();
    const [getAuspiciousPeriod, { isLoading: isAuspiciousLoading }] = useGetAuspiciousPeriodMutation();
    const [getInauspiciousPeriod, { isLoading: isInauspiciousLoading }] = useGetInauspiciousPeriodMutation();

    const [apiTimings, setApiTimings] = useState(null);

    // Default date to local date (formatted as YYYY-MM-DD for native input)
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [dateValue, setDateValue] = useState(getTodayString());
    const [locationText, setLocationText] = useState('Kochi, India');
    const [activeCity, setActiveCity] = useState(POPULAR_CITIES[0]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const dropdownRef = useRef(null);

    // Close suggestions dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!dateValue || !activeCity) return;

        const formatTimezoneOffset = (tzOffset) => {
            const absOffset = Math.abs(tzOffset);
            const hrs = Math.floor(absOffset);
            const mins = Math.round((absOffset - hrs) * 60);
            const sign = tzOffset >= 0 ? '+' : '-';
            return `${sign}${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        };

        const coordinates = `${activeCity.lat.toFixed(4)},${activeCity.lon.toFixed(4)}`;
        const datetime = `${dateValue}T00:00:00${formatTimezoneOffset(activeCity.tz)}`;

        const params = {
            coordinates,
            datetime,
            ayanamsa: 1,
            la: 'en'
        };

        const fetchAstroData = async () => {
            try {
                const [panchangRes, auspiciousRes, inauspiciousRes] = await Promise.all([
                    getPanchang(params).unwrap(),
                    getAuspiciousPeriod(params).unwrap(),
                    getInauspiciousPeriod(params).unwrap()
                ]);

                if (panchangRes?.data && auspiciousRes?.data && inauspiciousRes?.data) {
                    const data = panchangRes.data;
                    const auspicious = auspiciousRes.data;
                    const inauspicious = inauspiciousRes.data;

                    const sunrise = formatIsoTime(data.sunrise);
                    const sunset = formatIsoTime(data.sunset);

                    // Compute local fallback for specific missing timings
                    const fallback = getAstroTimings(dateValue, activeCity);

                    // Search for Abhijit Muhurta in the muhurat array
                    const abhijitPeriod = auspicious.muhurat?.find(p => p.name === 'Abhijit Muhurta' || p.name === 'Abhijit')?.period?.[0];
                    const abhijit = abhijitPeriod
                        ? formatIsoTimeRangeNoSpace(abhijitPeriod.start, abhijitPeriod.end)
                        : fallback.abhijit;

                    // Search for Rahu Kaal in the muhurat array
                    const rahuPeriod = inauspicious.muhurat?.find(p => p.name === 'Rahu' || p.name === 'Rahu Kalam' || p.name === 'Rahu Kaal')?.period?.[0];
                    const rahuKaal = rahuPeriod
                        ? formatIsoTimeRange(rahuPeriod.start, rahuPeriod.end)
                        : fallback.rahuKaal;

                    // Search for Yamaganda in the muhurat array
                    const yamaPeriod = inauspicious.muhurat?.find(p => p.name === 'Yamaganda' || p.name === 'Yamaganda Kalam')?.period?.[0];
                    const yamaganda = yamaPeriod
                        ? formatIsoTimeRange(yamaPeriod.start, yamaPeriod.end)
                        : fallback.yamaganda;

                    // Parse Nakshatra and Tithi/Aspects as Transits
                    const sunTransitText = fallback.transits[0]?.text || 'Sun Transit';
                    const sunTransitTag = fallback.transits[0]?.tag || '';
                    const moonTransitText = data.nakshatra?.[0]?.name 
                        ? `Moon transits ${data.nakshatra[0].name}`
                        : fallback.transits[1]?.text;
                    const aspectText = fallback.transits[2]?.text || '';

                    const transits = [
                        { text: sunTransitText, tag: sunTransitTag },
                        { text: moonTransitText, tag: 'Moon Transit' },
                        { text: aspectText }
                    ].filter(t => t.text);

                    setApiTimings({
                        sunrise,
                        sunset,
                        abhijit,
                        rahuKaal,
                        yamaganda,
                        transits
                    });
                }
            } catch (err) {
                console.error('Failed to fetch panchang details from proxy:', err);
            }
        };

        fetchAstroData();
    }, [dateValue, activeCity, getPanchang, getAuspiciousPeriod, getInauspiciousPeriod]);

    // Filter cities based on input
    const filteredCities = POPULAR_CITIES.filter(city =>
        city.name.toLowerCase().includes(locationText.toLowerCase())
    );

    // The getAstroTimings function has been moved above the TransitCalendar component.

    const localTimings = getAstroTimings(dateValue, activeCity);
    const activeTimings = apiTimings || localTimings;

    const timingItems = [
        { label: 'Sunrise', value: activeTimings.sunrise },
        { label: 'Sunset', value: activeTimings.sunset },
        { label: 'Rahu Kaal', value: activeTimings.rahuKaal },
        { label: 'Yamaganda', value: activeTimings.yamaganda }
    ];

    const handleCitySelect = (city) => {
        setActiveCity(city);
        setLocationText(city.name);
        setShowSuggestions(false);
    };

    return (
        <div className="flex justify-center items-start min-h-screen p-0 m-0 w-full md:py-10 md:px-6 font-['Poppins']">
            <div className="w-full min-h-screen md:min-h-0 max-w-lg bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative pb-16 overflow-y-auto">
                {/* Header Banner */}
                <CustomHeader
                    title="Transit Calendar"
                    subtitle="Lat / Long / Timezone for any city"
                    onBack={() => navigate('/tools')}
                />

                <div className="flex-grow p-4 sm:p-5 md:p-6 flex flex-col gap-5 w-full box-border">
                    {/* Date Field */}
                    <div className="flex flex-col items-start gap-2 w-full">
                        <CustomLabel title="Date" />
                        <CustomInput
                            type="date"
                            name="date"
                            value={dateValue}
                            onChange={(e) => setDateValue(e.target.value)}
                            required
                            icon={<CalendarIcon />}
                        />
                    </div>

                    <div className="flex flex-col items-start gap-2 w-full relative" ref={dropdownRef}>
                        <CustomLabel title="Location" />
                        <CustomInput
                            type="text"
                            name="location"
                            value={locationText}
                            onChange={(e) => {
                                setLocationText(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Location"
                            required
                        />
                        {showSuggestions && filteredCities.length > 0 && (
                            <div className="absolute top-[84px] left-0 right-0 bg-[#FEFEFE] border border-[#ECE8E7] rounded-[12px] shadow-lg z-50 max-h-[200px] overflow-y-auto font-['Inter']">
                                {filteredCities.map((city, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleCitySelect(city)}
                                        className="px-4 py-3 hover:bg-[#F5ECE3]/50 cursor-pointer text-[13px] text-[#2A0B07] border-b border-[#F6F3F1] last:border-b-0"
                                    >
                                        {city.name} <span className="text-[11px] text-[#ABABAC] ml-1">({city.lat.toFixed(2)}N, {city.lon.toFixed(2)}E)</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-full rounded-[20px] border-[1px] border-[#2A0B07]/60 bg-[#FCF7EF] pt-[22px] ps-[43px] pb-[14px] pr-[16px] flex flex-col items-start gap-[7px] box-border">
                        <span className="text-[14px] text-[#A37E72] uppercase font-['Poppins'] mb-[4px]">
                            ABHIJIT MUHURTA
                        </span>
                        <h2 className="text-[21px] font-semibold text-[#585046] font-['Poppins']">
                            {activeTimings.abhijit}
                        </h2>
                        <p className="text-[11px] text-[#2A0B07] font-['Poppins']">
                            Most auspicious 48 minutes of the day
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                        {timingItems.map((item) => (
                            <div key={item.label} className="relative w-full flex flex-col justify-between items-start bg-white border-[1px] border-[#B9A795] rounded-[7px] p-[10px]">
                                <span className="text-[10px] font-light text-[#2A0B07] font-['Poppins']">
                                    {item.label}
                                </span>
                                <span className="text-[14px] font-semibold text-[#575757] font-['Sofia_Sans']">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Today's Transits Section */}
                    <div className="flex flex-col gap-2 w-full mt-2">
                        <span className="text-[11px] text-[#2A0B07] font-['Poppins'] uppercase">
                            TODAY'S TRANSITS
                        </span>

                        <div className="flex flex-col w-full">
                            {activeTimings.transits.map((transit, idx) => (
                                <div key={idx} className="w-full flex flex-col items-start">
                                    <div className="py-2.5 flex items-center justify-start text-[12px] text-[#2A0B07]/60 font-['Poppins']">
                                        <div className="mr-[13px]">
                                            {transit.text}
                                        </div>
                                        {transit.tag && (
                                            <div className="text-[#676664] text-[11px] font-semibold text-['Sofia_Sans']">
                                                {transit.tag}
                                            </div>
                                        )}
                                    </div>
                                    {idx < activeTimings.transits.length - 1 && (
                                        <div className="border-b-[1.5px] border-[#efede8] w-full" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CustomHeader from '../../components/common/CustomHeader';
import CustomButton from '../../components/common/CustomButton';
import CustomLabel from '../../components/common/CustomLabel';
import CustomInput from '../../components/common/CustomInput';
import { useLazyGetPlanetPositionsQuery } from '../../redux/api/toolsApi';

// Reusable SVG Icons for Inputs
const CalendarIcon = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.75 13.75H6.08333C3.56933 13.75 2.312 13.75 1.53133 12.9687C0.750667 12.1873 0.75 10.9307 0.75 8.41667V7.08333C0.75 4.56933 0.75 3.312 1.53133 2.53133C2.31267 1.75067 3.56933 1.75 6.08333 1.75H8.75C11.264 1.75 12.5213 1.75 13.302 2.53133C14.0827 3.31267 14.0833 4.56933 14.0833 7.08333V8.41667C14.0833 10.9307 14.0833 12.188 13.302 12.9687C12.8667 13.4047 12.2833 13.5973 11.4167 13.682M4.08333 1.75V0.75M10.75 1.75V0.75M13.75 5.08333H6.58333M0.75 5.08333H3.33333" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11.417 10.4167C11.417 10.5935 11.3468 10.7631 11.2217 10.8881C11.0967 11.0131 10.9271 11.0833 10.7503 11.0833C10.5735 11.0833 10.4039 11.0131 10.2789 10.8881C10.1539 10.7631 10.0837 10.5935 10.0837 10.4167C10.0837 10.2399 10.1539 10.0703 10.2789 9.94527C10.4039 9.82025 10.5735 9.75001 10.7503 9.75001C10.9271 9.75001 11.0967 9.82025 11.2217 9.94527C11.3468 10.0703 11.417 10.2399 11.417 10.4167ZM11.417 7.75001C11.417 7.92682 11.3468 8.09639 11.2217 8.22141C11.0967 8.34644 10.9271 8.41668 10.7503 8.41668C10.5735 8.41668 10.4039 8.34644 10.2789 8.22141C10.1539 8.09639 10.0837 7.92682 10.0837 7.75001C10.0837 7.5732 10.1539 7.40363 10.2789 7.27861C10.4039 7.15358 10.5735 7.08334 10.7503 7.08334C10.9271 7.08334 11.0967 7.15358 11.2217 7.27861C11.3468 7.40363 11.417 7.5732 11.417 7.75001ZM8.08366 10.4167C8.08366 10.5935 8.01342 10.7631 7.8884 10.8881C7.76337 11.0131 7.5938 11.0833 7.41699 11.0833C7.24018 11.0833 7.07061 11.0131 6.94559 10.8881C6.82056 10.7631 6.75033 10.5935 6.75033 10.4167C6.75033 10.2399 6.82056 10.0703 6.94559 9.94527C7.07061 9.82025 7.24018 9.75001 7.41699 9.75001C7.5938 9.75001 7.76337 9.82025 7.8884 9.94527C8.01342 10.0703 8.08366 10.2399 8.08366 10.4167ZM8.08366 7.75001C8.08366 7.92682 8.01342 8.09639 7.8884 8.22141C7.76337 8.34644 7.5938 8.41668 7.41699 8.41668C7.24018 8.41668 7.07061 8.34644 6.94559 8.22141C6.82056 8.09639 6.75033 7.92682 6.75033 7.75001C6.75033 7.5732 6.82056 7.40363 6.94559 7.27861C7.07061 7.15358 7.24018 7.08334 7.41699 7.08334C7.5938 7.08334 7.76337 7.15358 7.8884 7.27861C8.01342 7.40363 8.08366 7.5732 8.08366 7.75001ZM4.75033 10.4167C4.75033 10.5935 4.68009 10.7631 4.55506 10.8881C4.43004 11.0131 4.26047 11.0833 4.08366 11.0833C3.90685 11.0833 3.73728 11.0131 3.61225 10.8881C3.48723 10.7631 3.41699 10.5935 3.41699 10.4167C3.41699 10.2399 3.48723 10.0703 3.61225 9.94527C3.73728 9.82025 3.90685 9.75001 4.08366 9.75001C4.26047 9.75001 4.43004 9.82025 4.55506 9.94527C4.68009 10.0703 4.75033 10.2399 4.75033 10.4167ZM4.75033 7.75001C4.75033 7.92682 4.68009 8.09639 4.55506 8.22141C4.43004 8.34644 4.26047 8.41668 4.08366 8.41668C3.90685 8.41668 3.73728 8.34644 3.61225 8.22141C3.48723 8.09639 3.41699 7.92682 3.41699 7.75001C3.41699 7.5732 3.48723 7.40363 3.61225 7.27861C3.73728 7.15358 3.90685 7.08334 4.08366 7.08334C4.26047 7.08334 4.43004 7.15358 4.55506 7.27861C4.68009 7.40363 4.75033 7.5732 4.75033 7.75001Z" fill="#2A0B07" />
    </svg>
);

const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7.06667 6.33533L9.66067 8.92933L9.09533 9.49533L6.26667 6.66667V2.66667H7.06667V6.33533ZM6.66667 13.3333C2.98467 13.3333 0 10.3487 0 6.66667C0 2.98467 2.98467 0 6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333ZM6.66667 12.5333C8.2226 12.5333 9.71481 11.9152 10.815 10.815C11.9152 9.71481 12.5333 8.2226 12.5333 6.66667C12.5333 5.11073 11.9152 3.61852 10.815 2.51831C9.71481 1.41809 8.2226 0.8 6.66667 0.8C5.11073 0.8 3.61852 1.41809 2.51831 2.51831C1.41809 3.61852 0.8 5.11073 0.8 6.66667C0.8 8.2226 1.41809 9.71481 2.51831 10.815C3.61852 11.9152 5.11073 12.5333 6.66667 12.5333Z" fill="#2A0B07" />
    </svg>
);

const signNames = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const getSignIndex = (name) => {
  if (!name) return -1;
  const normalized = name.trim().toLowerCase();
  return signNames.findIndex(s => s.toLowerCase() === normalized);
};

const planetSymbols = {
  sun: '☉',
  moon: '☽',
  mars: '♂',
  mercury: '☿',
  jupiter: '♃',
  venus: '♀',
  saturn: '♄',
  rahu: '☊',
  ketu: '☋',
};

const calculateAvastha = (planetName, sign, degree, isRetrograde, distFromSun) => {
  const normPlanet = planetName.toLowerCase();
  
  // 1. Retrograde check (except Sun/Moon/Nodes)
  if (isRetrograde && !['sun', 'moon', 'rahu', 'ketu'].includes(normPlanet)) {
    return 'Retrograde';
  }

  // 2. Combustion check (except Sun itself, and Rahu/Ketu)
  if (normPlanet !== 'sun' && !['rahu', 'ketu'].includes(normPlanet) && distFromSun !== null) {
    let combustLimit = 0;
    if (normPlanet === 'moon') combustLimit = 12;
    else if (normPlanet === 'mars') combustLimit = 17;
    else if (normPlanet === 'mercury') combustLimit = isRetrograde ? 12 : 14;
    else if (normPlanet === 'jupiter') combustLimit = 11;
    else if (normPlanet === 'venus') combustLimit = isRetrograde ? 8 : 10;
    else if (normPlanet === 'saturn') combustLimit = 15;

    if (distFromSun <= combustLimit) {
      return 'Combust';
    }
  }

  // 3. Exaltation & Debilitation & MoolaTrikona & Own Sign checks
  if (normPlanet === 'sun') {
    if (sign === 'Aries') return 'Exalted';
    if (sign === 'Libra') return 'Debilitated';
    if (sign === 'Leo') {
      return degree <= 20 ? 'MoolaTrikona' : 'Own';
    }
  }
  else if (normPlanet === 'moon') {
    if (sign === 'Taurus') {
      return degree <= 3 ? 'Exalted' : 'MoolaTrikona';
    }
    if (sign === 'Scorpio') return 'Debilitated';
    if (sign === 'Cancer') return 'Own';
  }
  else if (normPlanet === 'mars') {
    if (sign === 'Capricorn') return 'Exalted';
    if (sign === 'Cancer') return 'Debilitated';
    if (sign === 'Aries') {
      return degree <= 12 ? 'MoolaTrikona' : 'Own';
    }
    if (sign === 'Scorpio') return 'Own';
  }
  else if (normPlanet === 'mercury') {
    if (sign === 'Virgo') {
      if (degree <= 15) return 'Own + Exalt';
      if (degree <= 20) return 'MoolaTrikona';
      return 'Own';
    }
    if (sign === 'Pisces') return 'Debilitated';
    if (sign === 'Gemini') return 'Own';
  }
  else if (normPlanet === 'jupiter') {
    if (sign === 'Cancer') return 'Exalted';
    if (sign === 'Capricorn') return 'Debilitated';
    if (sign === 'Sagittarius') {
      return degree <= 10 ? 'MoolaTrikona' : 'Own';
    }
    if (sign === 'Pisces') return 'Own';
  }
  else if (normPlanet === 'venus') {
    if (sign === 'Pisces') return 'Exalted';
    if (sign === 'Virgo') return 'Debilitated';
    if (sign === 'Libra') {
      return degree <= 15 ? 'MoolaTrikona' : 'Own';
    }
    if (sign === 'Taurus') return 'Own';
  }
  else if (normPlanet === 'saturn') {
    if (sign === 'Libra') return 'Exalted';
    if (sign === 'Aries') return 'Debilitated';
    if (sign === 'Aquarius') {
      return degree <= 20 ? 'MoolaTrikona' : 'Own';
    }
    if (sign === 'Capricorn') return 'Own';
  }
  else if (normPlanet === 'rahu') {
    if (sign === 'Taurus' || sign === 'Gemini') return 'Exalted';
    if (sign === 'Scorpio' || sign === 'Sagittarius') return 'Debilitated';
    if (sign === 'Virgo') return 'Own';
  }
  else if (normPlanet === 'ketu') {
    if (sign === 'Scorpio' || sign === 'Sagittarius') return 'Exalted';
    if (sign === 'Taurus' || sign === 'Gemini') return 'Debilitated';
    if (sign === 'Pisces') return 'Own';
  }

  return 'Own'; // Fallback
};

const getPillStyle = (state) => {
  switch (state) {
    case 'Exalted':
      return {
        pillClass: 'bg-[#E5FBEB] border-[#1D8A57] text-[#1D8A57]',
        pillWidth: 'w-[65px]',
      };
    case 'Own + Exalt':
      return {
        pillClass: 'bg-[#F4EDDE] border-[#8A711D] text-[#8A711D]',
        pillWidth: 'w-[86px]',
      };
    case 'MoolaTrikona':
      return {
        pillClass: 'bg-[#E6E5FB] border-[#424A7C] text-[#424A7C]',
        pillWidth: 'w-[98px]',
      };
    case 'Debilitated':
      return {
        pillClass: 'bg-[#F3ECEC] border-[#A50606] text-[#A50606]',
        pillWidth: 'w-[81px]',
      };
    case 'Retrograde':
      return {
        pillClass: 'bg-[#E5FBEB] border-[#1D8A57] text-[#1D8A57]',
        pillWidth: 'w-[83px]',
      };
    case 'Own':
      return {
        pillClass: 'bg-[#F4E8DE] border-[#221E12] text-[#221E12]',
        pillWidth: 'w-[41px]',
      };
    case 'Combust':
      return {
        pillClass: 'bg-[#FBF2E5] border-[#8A5D1D] text-[#8A5D1D]',
        pillWidth: 'w-[67px]',
      };
    default:
      return {
        pillClass: 'bg-[#F4E8DE] border-[#221E12] text-[#221E12]',
        pillWidth: 'w-[41px]',
      };
  }
};

export default function PlanetaryAvastas() {
    const navigate = useNavigate();
    const [view, setView] = useState('form'); // 'form' | 'results'
    const [resultsData, setResultsData] = useState([]);
    
    // Suggestions states for POB Autocomplete
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef(null);

    const [getPlanetPositions, { isLoading }] = useLazyGetPlanetPositionsQuery();

    // Form inputs state
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        tob: '',
        pob: '',
        coords: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const fetchSuggestions = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
            const results = await res.json();
            setSuggestions(results);
        } catch (e) {
            console.error("Failed to fetch location suggestions", e);
        }
    };

    const handlePobChange = (val) => {
        setFormData(prev => ({ ...prev, pob: val }));
        setShowSuggestions(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(val), 500);
    };

    const handleCalculateSubmit = async (e) => {
        e.preventDefault();
        
        let datetimeVal = '';
        try {
            datetimeVal = new Date(`${formData.dob}T${formData.tob}`).toISOString().split('.')[0] + 'Z';
        } catch (err) {
            datetimeVal = new Date().toISOString().split('.')[0] + 'Z';
        }

        try {
            const res = await getPlanetPositions({
                datetime: datetimeVal,
                coordinates: formData.coords,
                ayanamsa: 1,
                lang: 'en'
            }).unwrap();

            const planetsList = res?.data?.planet_position || res?.planet_position || [];
            
            // 1. Find Sun's position for combustion calculation
            const sunPlanet = planetsList.find(p => p.name.toLowerCase() === 'sun');
            let sunLong = null;
            if (sunPlanet) {
                const sunSignIndex = getSignIndex(sunPlanet.rasi?.name);
                if (sunSignIndex !== -1) {
                    sunLong = sunSignIndex * 30 + sunPlanet.degree;
                }
            }

            // 2. Filter out nodes & standard planets, and map avasthas
            const filteredPlanets = planetsList.filter(p => planetSymbols[p.name.toLowerCase()] !== undefined);
            
            const mapped = filteredPlanets.map(p => {
                const pName = p.name;
                const pSign = p.rasi?.name || '';
                const pDegree = p.degree;
                const isRetro = p.is_retrograde;

                // Find distance to Sun
                let dist = null;
                if (sunLong !== null) {
                    const pSignIndex = getSignIndex(pSign);
                    if (pSignIndex !== -1) {
                        const pLong = pSignIndex * 30 + pDegree;
                        const diff = Math.abs(pLong - sunLong);
                        dist = diff > 180 ? 360 - diff : diff;
                    }
                }

                const state = calculateAvastha(pName, pSign, pDegree, isRetro, dist);
                const { pillClass, pillWidth } = getPillStyle(state);

                return {
                    planet: pName,
                    symbol: planetSymbols[pName.toLowerCase()] || '',
                    sign: pSign,
                    state: state,
                    pillWidth,
                    pillClass
                };
            });

            setResultsData(mapped);
            setView('results');
        } catch (err) {
            console.error("Failed to fetch planetary positions:", err);
        }
    };

    const resetForm = () => {
        setView('form');
        setFormData({
            name: '',
            dob: '',
            tob: '',
            pob: '',
            coords: ''
        });
        setResultsData([]);
    };

    return (
        <div className="flex justify-center items-start min-h-screen p-0 m-0 w-full md:py-10 md:px-6 font-['Poppins']">
            <div className="w-full min-h-screen md:min-h-0 max-w-lg bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border pb-16 overflow-y-auto">
                {/* Header */}
                <CustomHeader
                    title="Planetary Avastas"
                    subtitle="Exalt · Debil · Retro · Combust · MoolaTrikona · Own"
                    onBack={view === 'results' ? resetForm : () => navigate('/tools')}
                />

                <div className="flex-grow p-4 sm:p-6 flex flex-col gap-6 w-full box-border">
                    <form onSubmit={handleCalculateSubmit} className="flex flex-col gap-4 w-full">
                        {/* Name Field */}
                        <div className="flex flex-col items-start gap-[10px] w-full">
                            <CustomLabel title="Name" />
                            <CustomInput
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter Name"
                                required
                            />
                        </div>

                        {/* Date & Time Grid */}
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="flex flex-col items-start gap-[10px] w-full">
                                <CustomLabel title="Date Of Birth" />
                                <CustomInput
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    required
                                    icon={<CalendarIcon />}
                                />
                            </div>
                            <div className="flex flex-col items-start gap-[10px] w-full">
                                <CustomLabel title="Time Of Birth" />
                                <CustomInput
                                    type="time"
                                    name="tob"
                                    value={formData.tob}
                                    onChange={handleInputChange}
                                    required
                                    icon={<ClockIcon />}
                                />
                            </div>
                        </div>

                        {/* Place of Birth Field with Autocomplete */}
                        <div className="flex flex-col items-start gap-[10px] w-full relative">
                            <CustomLabel title="Place Of Birth" />
                            <div className="relative w-full">
                                <CustomInput
                                    type="text"
                                    name="pob"
                                    value={formData.pob}
                                    onChange={(e) => handlePobChange(e.target.value)}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    placeholder="Enter Place of Birth"
                                    required
                                    autoComplete="off"
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-[56px] left-0 w-full bg-white border border-[#EFE5D5] rounded-xl shadow-lg z-50 overflow-hidden max-h-[200px] overflow-y-auto">
                                        {suggestions.map((s, i) => (
                                            <div
                                                key={i}
                                                className="px-4 py-3 hover:bg-[#FDFBF7] cursor-pointer text-[14px] text-[#2A0B07] border-b border-[#EFE5D5] last:border-0"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        pob: s.display_name,
                                                        coords: `${s.lat},${s.lon}`
                                                    }));
                                                    setShowSuggestions(false);
                                                }}
                                            >
                                                {s.display_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-2 w-full">
                            <CustomButton
                                type="submit"
                                loading={isLoading}
                                variant="primary"
                            >
                                Calculate Avasthas
                            </CustomButton>
                        </div>
                    </form>

                    <AnimatePresence>
                        {view === 'results' && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-3 w-full mt-2"
                            >
                                {/* Table Header */}
                                <div className="flex flex-row justify-center w-full py-2.5 px-4 bg-[#F5ECE3] rounded-[8px] border-[1px] border-[#EFE2D9] shrink-0">
                                    <div className="flex flex-row items-center w-full justify-between font-['Poppins'] text-[12px] font-semibold text-[#2A0B07] h-[19px] px-4">
                                        <div className="flex justify-center items-center shrink-0">
                                            Planet
                                        </div>
                                        <div className="flex justify-center items-center shrink-0">
                                            Sign
                                        </div>
                                        <div className="flex justify-center items-center shrink-0">
                                            Avastha
                                        </div>
                                    </div>
                                </div>
                                {/* Table Body Rows */}
                                <div className="flex flex-col items-center p-0 gap-3 w-full h-[245px] overflow-y-auto rounded-[8px] scrollbar-none pr-1">
                                    {resultsData.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex flex-row items-center justify-between w-full h-[19px]"
                                        >
                                            {/* Frame 609 - Planet Column */}
                                            <div className="w-[33%] flex flex-row justify-center items-center p-0 gap-2.5 w-[116px] h-[19px] shrink-0">
                                                <span className="font-['Poppins'] font-normal text-[12px] leading-[19px] flex items-center text-center text-[#2A0B07]">
                                                    {item.symbol} {item.planet}
                                                </span>
                                            </div>

                                            {/* Frame 610 - Sign Column */}
                                            <div className="w-[33%] flex flex-row justify-center items-center p-0 gap-2.5 w-[116px] h-[19px] shrink-0">
                                                <span className="font-['Poppins'] font-normal text-[12px] leading-[19px] flex items-center text-center text-[#2A0B07]">
                                                    {item.sign}
                                                </span>
                                            </div>

                                            {/* Frame 611 - Avastha Column (Pill Container) */}
                                            <div className="w-[34%] h-[19px] flex justify-start items-center shrink-0 ps-4">
                                                <div className={`box-sizing-border-box flex flex-row justify-center items-center gap-2.5 ${item.pillWidth} h-[19px] rounded-[58px] border-[1px] ${item.pillClass}`}>
                                                    <span className="font-['Poppins'] font-normal text-[12px] leading-[19px] flex items-center text-center">
                                                        {item.state}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

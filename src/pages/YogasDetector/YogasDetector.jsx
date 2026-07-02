import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CustomHeader from '../../components/common/CustomHeader';
import { useLazyGetYogaDetailsQuery } from '../../redux/api/toolsApi';

// Calendar SVG icon
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2V5M16 2V5M3 9H21M21 8.5V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V8.5M21 8.5V7C21 4.79086 19.2091 3 17 3H7C4.79086 3 3 4.79086 3 7V8.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 13H8.01M12 13H12.01M16 13H16.01M8 17H8.01M12 17H12.01" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Time SVG icon
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#2A0B07" strokeWidth="1.5"/>
    <path d="M12 7V12.5L16 15" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function YogasDetector() {
  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // States
  const [name, setName] = useState('Akhila M Menon');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('Kochi, India');
  const [coords, setCoords] = useState('9.9312,76.2673'); // Default Kochi coords
  const [showResults, setShowResults] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [detectedYogas, setDetectedYogas] = useState([]);

  // Autocomplete suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Lazy query
  const [getYogaDetails, { isLoading: loading }] = useLazyGetYogaDetailsQuery();

  // Load current location & pre-populate date/time on mount
  useEffect(() => {
    // Current date/time pre-population
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setDob(`${year}-${month}-${day}`);

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    setTob(`${hours}:${minutes}`);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoords(`${latitude},${longitude}`);
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data.display_name) {
              const parts = data.display_name.split(',');
              const city = parts[0] || '';
              const country = parts[parts.length - 1] || '';
              setPob(city && country ? `${city.trim()}, ${country.trim()}` : data.display_name);
            }
          } catch (e) {
            console.error(e);
          }
        },
        (error) => {
          console.log("Geolocation permission not granted or failed. Defaulting to Kochi, India.");
        }
      );
    }
  }, []);

  // Dropdown click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setSuggestions(data.map((item) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon
      })));
    } catch (err) {
      console.error('Failed to fetch Nominatim suggestions', err);
    }
  };

  const handlePobChange = (val) => {
    setPob(val);
    setCoords('');
    setShowSuggestions(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 500);
  };

  const getBrowserTimezone = () => {
    const offsetMin = new Date().getTimezoneOffset(); // e.g. -330 for IST
    const sign = offsetMin <= 0 ? '+' : '-';
    const abs = Math.abs(offsetMin);
    const hh = String(Math.floor(abs / 60)).padStart(2, '0');
    const mm = String(abs % 60).padStart(2, '0');
    return `${sign}${hh}:${mm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dob || !tob || !pob) {
      setErrorMsg('Please enter date, time and place of birth');
      return;
    }

    setErrorMsg('');
    setShowResults(false);

    let finalCoords = coords;
    if (!finalCoords) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pob)}&limit=1`);
        const data = await res.json();
        if (data && data[0]) {
          finalCoords = `${data[0].lat},${data[0].lon}`;
          setCoords(finalCoords);
        } else {
          setErrorMsg('Could not resolve location coordinates. Please try another place name.');
          return;
        }
      } catch (err) {
        setErrorMsg('Failed to resolve location coordinates. Please check your connection.');
        return;
      }
    }

    const timezoneOffset = getBrowserTimezone();
    const datetime = `${dob}T${tob}:00${timezoneOffset}`;

    try {
      const result = await getYogaDetails({
        datetime,
        coordinates: finalCoords,
        ayanamsa: 1,
        la: 'en'
      }).unwrap();

      if (result && result.status === 'ok' && result.data && result.data.yoga_details) {
        const detected = [];
        result.data.yoga_details.forEach(category => {
          if (category.yoga_list) {
            category.yoga_list.forEach(yoga => {
              if (yoga.has_yoga) {
                let type = 'auspicious';
                let pillText = 'Auspicious';

                if (category.name.toLowerCase().includes('inauspicious')) {
                  type = 'caution';
                  pillText = 'Caution';
                } else {
                  const nameLower = yoga.name.toLowerCase();
                  if (
                    nameLower.includes('hamsa') ||
                    nameLower.includes('bhadra') ||
                    nameLower.includes('ruchaka') ||
                    nameLower.includes('malavya') ||
                    nameLower.includes('sasa') ||
                    nameLower.includes('shasha')
                  ) {
                    type = 'mahapurusha';
                    pillText = 'Mahapurusha';
                  }
                }

                detected.push({
                  name: yoga.name,
                  pillText,
                  type,
                  desc: yoga.description
                });
              }
            });
          }
        });
        setDetectedYogas(detected);
        setShowResults(true);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setErrorMsg('Invalid response from server. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch yogas details. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div 
        className="w-full max-w-[430px] md:max-w-[700px] lg:max-w-[850px] min-h-screen md:min-h-0 bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10"
      >
        {/* Custom Header matching screenshot styling */}
        <CustomHeader
          title="Yogas Detector"
          subtitle="Beneficial & cautionary combinations"
          onBack={() => navigate('/tools')}
        />

        {/* Content Container (Frame 592 layout) */}
        <div className="flex flex-col items-center justify-start w-full max-w-[430px] mx-auto px-4 gap-[10px] box-border mt-6">
          
          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full gap-[10px]">
            
            {/* Name Input Block (Frame 525) */}
            <div className="flex flex-col items-start w-full gap-[10px] px-[15px] box-border">
              <label className="font-['Poppins'] font-medium text-[14px] leading-[21px] text-left text-[#2A0B07] capitalize shrink-0">
                Name
              </label>
              <div className="box-border flex flex-row items-center p-[13px] gap-[30px] w-full h-[47px] bg-[#F5ECE3] border border-[rgba(236,236,236,0.2)] rounded-[15px] shrink-0">
                <input
                  type="text"
                  placeholder="Akhila M Menon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-transparent border-none outline-none font-['Poppins'] font-light text-[14px] leading-[21px] text-[#2A0B07] placeholder:text-[#2A0B07]/60"
                />
              </div>
            </div>

            {/* Date & Time Row Block (Frame 526) */}
            <div className="flex flex-row justify-center items-start w-full gap-[15px] px-[15px] box-border">
              
              {/* Date Of Birth (Frame 508) */}
              <div className="flex flex-col items-start gap-[10px] w-full">
                <label className="font-['Poppins'] font-medium text-[14px] leading-[21px] text-left text-[#2A0B07] capitalize shrink-0">
                  Date of birth
                </label>
                <div className="relative w-full h-[47px] flex items-center">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full h-full bg-[#F5ECE3] border border-[rgba(236,236,236,0.2)] rounded-[15px] pl-[13px] pr-[35px] py-[13px] font-['Poppins'] font-light text-[14px] text-[#2A0B07] outline-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:bottom-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer placeholder:text-[#2A0B07]/60"
                    placeholder="DD-MM-YYYY"
                  />
                  <div className="absolute right-[16px] pointer-events-none flex items-center justify-center">
                    <CalendarIcon />
                  </div>
                </div>
              </div>

              {/* Time Of Birth (Frame 523) */}
              <div className="flex flex-col items-start gap-[10px] w-full">
                <label className="font-['Poppins'] font-medium text-[14px] leading-[21px] text-left text-[#2A0B07] capitalize shrink-0">
                  Time of birth
                </label>
                <div className="relative w-full h-[47px] flex items-center">
                  <input
                    type="time"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    required
                    className="w-full h-full bg-[#F5ECE3] border border-[rgba(236,236,236,0.2)] rounded-[15px] pl-[13px] pr-[35px] py-[13px] font-['Poppins'] font-light text-[14px] text-[#2A0B07] outline-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:bottom-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer placeholder:text-[#2A0B07]/60"
                    placeholder="06:25 pm"
                  />
                  <div className="absolute right-[16px] pointer-events-none flex items-center justify-center">
                    <ClockIcon />
                  </div>
                </div>
              </div>

            </div>

            {/* Place Of Birth Block (Frame 508) */}
            <div className="flex flex-col items-start w-full gap-[10px] px-[15px] relative box-border" ref={dropdownRef}>
              <label className="font-['Poppins'] font-medium text-[14px] leading-[21px] text-left text-[#2A0B07] capitalize shrink-0">
                Place of birth
              </label>
              <div className="box-border flex flex-row items-center p-[13px] gap-[30px] w-full h-[47px] bg-[#F5ECE3] border border-[rgba(236,236,236,0.2)] rounded-[15px] shrink-0">
                <input
                  type="text"
                  placeholder="Kochi, India"
                  value={pob}
                  onChange={(e) => handlePobChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  required
                  className="w-full bg-transparent border-none outline-none font-['Poppins'] font-light text-[14px] leading-[21px] text-[#2A0B07] placeholder:text-[#2A0B07]/60"
                />
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-[15px] right-[15px] top-[80px] bg-[#FEFEFE] border border-[#ECE8E7] rounded-xl shadow-lg z-50 max-h-[200px] overflow-y-auto"
                  >
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setPob(item.display_name);
                          setCoords(`${item.lat},${item.lon}`);
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-2 hover:bg-[#F5ECE3]/50 cursor-pointer text-[12px] text-[#2A0B07] font-['Inter'] border-b border-[#F6F3F1] last:border-none"
                      >
                        {item.display_name}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="w-full px-[15px] text-center text-[#B81B1B] text-[12px] mt-2 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Submit Button Block (Component 7) */}
            <div className="w-full px-[15px] mt-4 box-border">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-[#2A0B07] hover:bg-[#2A0B07]/90 active:scale-[0.98] transition-all rounded-[20px] flex justify-center items-center p-[16px_15px] gap-[12px] border-none cursor-pointer disabled:opacity-50"
              >
                <span className="font-['Poppins'] font-bold text-[14px] leading-[20px] text-center text-[#ECECEC] select-none">
                  {loading ? 'Detecting Yogas...' : 'Detect Yogas'}
                </span>
              </button>
            </div>

          </form>

          {/* Simulated loading state */}
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-3 py-6"
              >
                <div className="w-8 h-8 border-4 border-[#2A0B07]/20 border-t-[#2A0B07] rounded-full animate-spin" />
                <span className="font-['Poppins'] font-medium text-[13px] text-[#2A0B07] animate-pulse">
                  Analyzing Planetary Conjunctions...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results section rendered below the form */}
          <AnimatePresence>
            {showResults && !loading && (
              <motion.div 
                ref={resultsRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-[12px] mt-6 pb-6 px-[15px] box-border"
              >
                {detectedYogas.length > 0 ? (
                  detectedYogas.map((yoga, index) => {
                    // Determine pill style values
                    let pillBg = '#F8EFE2';
                    let pillBorder = '#8A4C1D';
                    let pillText = '#8A4C1D';

                    if (yoga.type === 'auspicious') {
                      pillBg = '#EAF7E8';
                      pillBorder = '#2B601C';
                      pillText = '#2B601C';
                    } else if (yoga.type === 'caution') {
                      pillBg = '#FDF1F0';
                      pillBorder = '#8C2016';
                      pillText = '#8C2016';
                    }

                    return (
                      <div 
                        key={index}
                        className="flex flex-row items-center p-[12px_16px] w-full max-w-[410px] min-h-[84px] bg-[#ECECEC] border border-[#B9A795] rounded-[12px] box-border transition-all duration-200 hover:shadow-xs hover:border-[#8A4C1D]/40"
                      >
                        {/* Frame 570 */}
                        <div className="flex flex-col justify-center items-start p-0 gap-[6px] w-full">
                          
                          {/* Frame 626 */}
                          <div className="flex flex-row items-center p-0 gap-[11px] h-[27px]">
                            {/* Yoga Name */}
                            <span className="font-['Poppins'] font-medium text-[14px] leading-[20px] text-[#2A0B07]">
                              {yoga.name}
                            </span>
                            
                            {/* Pill (Frame 504) */}
                            <div 
                              className="box-border flex flex-row justify-center items-center px-[8.5px] py-[4.3px] h-[27px] rounded-[37px] shrink-0"
                              style={{
                                backgroundColor: pillBg,
                                border: `1px solid ${pillBorder}`
                              }}
                            >
                              <span 
                                className="font-['Poppins'] font-normal text-[10.28px] leading-[15px]"
                                style={{ color: pillText }}
                              >
                                {yoga.pillText}
                              </span>
                            </div>
                          </div>

                          {/* Subtext Description */}
                          <span className="font-['Poppins'] font-light text-[12px] leading-[20px] text-[#2A0B07]/80 text-left">
                            {yoga.desc}
                          </span>

                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-[#2A0B07]/60 text-[13px] py-10">
                    No major planetary yogas detected in this chart.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

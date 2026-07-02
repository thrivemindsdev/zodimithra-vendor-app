import React, { useState, useRef, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CustomHeader from '../../components/common/CustomHeader';
import { useGetJaiminiKarakasMutation, useGetJaiminiCharaDashaMutation } from '../../redux/api/toolsApi';

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

// Helper to format decimal degrees to DD°MM'
const formatDegree = (degDec) => {
  const degrees = Math.floor(degDec);
  const minutes = Math.round((degDec - degrees) * 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${degrees}°${formattedMinutes}'`;
};

export default function JaiminiAstrology() {
  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // States matching design form inputs
  const [name, setName] = useState('Akhila M Menon');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('Kochi, India');
  const [coords, setCoords] = useState('9.9312,76.2673'); // Default Kochi coords
  const [showResults, setShowResults] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [karakas, setKarakas] = useState([]);
  const [dashas, setDashas] = useState([]);

  // Location suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mutations
  const [getJaiminiKarakas, { isLoading: karakasLoading }] = useGetJaiminiKarakasMutation();
  const [getJaiminiCharaDasha, { isLoading: dashaLoading }] = useGetJaiminiCharaDashaMutation();

  const loading = karakasLoading || dashaLoading;

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

  const handleCalculate = async (e) => {
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
    const [latStr, lonStr] = finalCoords.split(',');

    const payload = {
      datetime,
      latitude: parseFloat(latStr),
      longitude: parseFloat(lonStr)
    };

    try {
      const [karakasRes, dashaRes] = await Promise.all([
        getJaiminiKarakas(payload).unwrap(),
        getJaiminiCharaDasha(payload).unwrap()
      ]);

      if (karakasRes?.success && karakasRes?.data?.karakas) {
        const labelMapping = {
          'Atmakaraka': 'Atmakaraka (AK)',
          'Amatyakaraka': 'Amatyakaraka (AmK)',
          'Bhratrikaraka': 'Bhratrukaraka (BK)',
          'Matrikaraka': 'Matrukaraka (MK)',
          'Putrakaraka': 'Putrakaraka (PK)',
          'Gnatikaraka': 'Gnatikaraka (GK)',
          'Darakaraka': 'Darakaraka (DK)'
        };
        const mappedKarakas = karakasRes.data.karakas.map(item => ({
          karaka: labelMapping[item.karaka] || item.karaka,
          planet: item.planet,
          degree: formatDegree(item.degree)
        }));
        setKarakas(mappedKarakas);
      } else {
        setErrorMsg('Invalid Jaimini Karakas response from server.');
        return;
      }

      if (dashaRes?.success && dashaRes?.data?.mahaDashas) {
        const mappedDashas = dashaRes.data.mahaDashas.map(dasha => ({
          sign: dasha.sign,
          duration: dasha.durationYears,
          startYear: new Date(dasha.startDate).getFullYear(),
          endYear: new Date(dasha.endDate).getFullYear(),
          isCurrent: dasha.isCurrentPeriod
        }));

        const currentIndex = mappedDashas.findIndex(d => d.isCurrent);
        const startIndex = currentIndex !== -1 ? Math.max(0, currentIndex) : 0;
        const slicedDashas = mappedDashas.slice(startIndex, startIndex + 7);

        if (slicedDashas.length < 7 && mappedDashas.length > 7) {
          const shortfall = 7 - slicedDashas.length;
          const backfill = mappedDashas.slice(Math.max(0, startIndex - shortfall), startIndex);
          setDashas([...backfill, ...slicedDashas]);
        } else {
          setDashas(slicedDashas);
        }
      } else {
        setErrorMsg('Invalid Chara Dasha response from server.');
        return;
      }

      setShowResults(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch Jaimini calculations. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div 
        className="w-full max-w-[430px] md:max-w-[700px] lg:max-w-[850px] min-h-screen md:min-h-0 bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10"
      >
        {/* Custom Header */}
        <CustomHeader
          title="Jaimini Astrology"
          subtitle="Chara karakas & Chara Dasha"
          onBack={() => navigate('/tools')}
        />

        {/* Content Container */}
        <div className="flex flex-col items-center justify-start w-full max-w-[430px] mx-auto px-4 gap-[10px] box-border mt-6">
          
          <form onSubmit={handleCalculate} className="flex flex-col items-center w-full gap-[10px]">
            
            {/* Name Input */}
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

            {/* Date & Time Row */}
            <div className="flex flex-row justify-center items-start w-full gap-[15px] px-[15px] box-border">
              
              {/* Date Of Birth */}
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

              {/* Time Of Birth */}
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

            {/* Place Of Birth */}
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

            {/* Submit Button */}
            <div className="w-full px-[15px] mt-4 box-border">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-[#2A0B07] hover:bg-[#2E0F0A] active:scale-[0.98] transition-all rounded-[20px] flex justify-center items-center p-[16px_15px] gap-[12px] border-none cursor-pointer shadow-md hover:shadow-lg disabled:opacity-80 disabled:cursor-not-allowed"
              >
                <span className="font-['Poppins'] font-bold text-[14px] leading-[20px] text-center text-[#ECECEC] select-none">
                  {loading ? 'Calculating Jaimini...' : 'Calculate Jaimini'}
                </span>
              </button>
            </div>

          </form>

          {/* Loader */}
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-3 py-10"
              >
                <div className="w-8 h-8 border-4 border-[#2A0B07]/20 border-t-[#2A0B07] rounded-full animate-spin" />
                <span className="font-['Poppins'] font-medium text-[13px] text-[#2A0B07] animate-pulse">
                  Analyzing planetary longitudes & Karakas...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Output Results */}
          <AnimatePresence>
            {showResults && !loading && (
              <motion.div 
                ref={resultsRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full flex flex-col items-center gap-6 mt-6 pb-6 px-[15px] box-border overflow-hidden"
              >
                {/* Chara Karakas Section (Frame 632) */}
                <div 
                  className="flex flex-col items-start p-0 gap-[9px] w-full max-w-[404px] shrink-0 select-none"
                  style={{ order: 1 }}
                >
                  {/* Title */}
                  <h3 className="w-full h-[14px] font-['Poppins'] font-medium text-[12px] leading-[18px] flex items-center text-[#A5898A] align-self-stretch m-0 shrink-0">
                    CHARA KARAKAS
                  </h3>

                  {/* Frame 631 */}
                  <div className="flex flex-col items-start p-0 gap-[6px] w-full align-self-stretch shrink-0">
                    
                    {/* Frame 628 (Header Row) */}
                    <div className="box-border flex flex-row items-center w-full h-[29px] bg-[#F4ECE3] border border-[#F6F1EB] rounded-none shrink-0 relative">
                      <span className="w-[45%] pl-[7px] font-['Poppins'] font-medium text-[12px] leading-[18px] flex items-center text-[#8A7E73]">
                        Karaka
                      </span>
                      <span className="w-[28%] font-['Poppins'] font-medium text-[12px] leading-[18px] flex items-center text-[#8D7F73]">
                        Planet
                      </span>
                      <span className="w-[27%] font-['Poppins'] font-medium text-[12px] leading-[18px] flex items-center text-[#897B70]">
                        Degree
                      </span>
                    </div>

                    {/* Frame 629 (Rows Container) */}
                    <div className="flex flex-col w-full gap-[12px] py-2 shrink-0">
                      {karakas.map((item, index) => {
                        // Custom colors from design specs
                        const karakaColors = [
                          '#706D6C', // Atmakaraka (AK)
                          '#6D6B6A', // Amatyakaraka (Am)
                          '#727271', // Bhratrukaraka (B)
                          '#6F6D6C', // Matrukaraka (MK)
                          '#757371', // Putrakaraka (PK)
                          '#747271', // Gnatikaraka (GK)
                          '#72706F'  // Darakaraka (DK)
                        ];

                        const planetColors = [
                          '#676463', // Saturn
                          '#6E6E6D', // Mars
                          '#737371', // Mercury
                          '#747371', // Jupiter
                          '#6A6665', // Sun
                          '#6B6968', // Venus
                          '#676765'  // Moon
                        ];

                        const degreeColors = [
                          '#6D6B6B', // 2703'
                          '#727171', // 25°C18°C
                          '#706F6E', // 1830'
                          '#777674', // 1141
                          '#726F6D', // 956'
                          '#706F70', // 4°52'
                          '#6E6D6D'  // 2°07'
                        ];

                        const karakaColor = karakaColors[index] || '#706D6C';
                        const planetColor = planetColors[index] || '#676463';
                        const degreeColor = degreeColors[index] || '#6D6B6B';

                        return (
                          <div 
                            key={index}
                            className="flex flex-row items-center w-full h-[18px]"
                          >
                            {/* Karaka Name */}
                            <span 
                              className="w-[45%] pl-[7px] font-['Poppins'] font-normal text-[11px] leading-[16px] flex items-center truncate"
                              style={{ color: karakaColor }}
                            >
                              {item.karaka}
                            </span>
                            
                            {/* Planet Name */}
                            <span 
                              className="w-[28%] font-['Poppins'] font-normal text-[12px] leading-[18px] flex items-center truncate"
                              style={{ color: planetColor }}
                            >
                              {item.planet}
                            </span>
                            
                            {/* Degree */}
                            <span 
                              className="w-[27%] font-['Poppins'] font-normal text-[12px] leading-[18px] flex items-center truncate"
                              style={{ color: degreeColor }}
                            >
                              {item.degree}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* Chara Dasha Section (Frame 635) */}
                <div 
                  className="flex flex-col items-start p-0 gap-[10px] w-full max-w-[400px] shrink-0 select-none"
                  style={{ order: 2 }}
                >
                  {/* Title */}
                  <h3 className="w-full h-[16px] font-['Poppins'] font-medium text-[11px] leading-[16px] flex items-center text-[#A48988] align-self-stretch m-0 shrink-0">
                    CHARA DASHA (RUNNING)
                  </h3>

                  {/* Frame 633 */}
                  <div className="flex flex-col items-start p-0 gap-[9px] w-full align-self-stretch shrink-0">
                    {dashas.map((dasha, index) => {
                      const rowColors = ['#737270', '#6D6C6B', '#6C6B6B', '#706D6D', '#72706F', '#747270', '#757372'];
                      const rowFontSizes = ['12px', '12px', '11px', '12px', '12px', '11px', '12px'];
                      
                      const colorVal = rowColors[index] || '#6D6C6B';
                      const fontSizeVal = rowFontSizes[index] || '12px';

                      return (
                        <Fragment key={index}>
                          {dasha.isCurrent ? (
                            /* Frame 634 */
                            <div className="flex flex-row justify-between items-center w-full h-[23px] shrink-0">
                              <span 
                                className="font-['Poppins'] font-medium text-[12px] leading-[18px] flex items-center truncate"
                                style={{ color: colorVal }}
                              >
                                {dasha.sign} · {dasha.duration} yrs · {dasha.startYear} – {dasha.endYear}
                              </span>
                              
                              {/* Current Badge Button */}
                              <div className="relative w-[58px] h-[23px] shrink-0">
                                <div className="absolute right-0 bottom-[1px] w-[56px] h-[20px] bg-[#E8F3EE] border border-[#7AA390]/25 rounded-full" />
                                <span className="absolute right-[5px] bottom-[3px] w-[43px] h-[17px] font-['Poppins'] font-medium text-[11px] leading-[16px] flex items-center text-[#7AA390]">
                                  Current
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center w-full h-[18px] shrink-0">
                              <span 
                                className="font-['Poppins'] font-medium leading-[18px] flex items-center truncate"
                                style={{ color: colorVal, fontSize: fontSizeVal }}
                              >
                                {dasha.sign} · {dasha.duration} yrs · {dasha.startYear} – {dasha.endYear}
                              </span>
                            </div>
                          )}
                          
                          {index < dashas.length - 1 && (
                            /* Divider Line */
                            <div className="w-full h-0 border-t border-[rgba(42,11,7,0.3)] shrink-0" />
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

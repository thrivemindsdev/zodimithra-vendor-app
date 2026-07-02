import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CustomHeader from '../../components/common/CustomHeader';
import { useLazyGetPlanetPositionsQuery } from '../../redux/api/toolsApi';

// Calendar SVG icon (solar:calendar-broken)
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2V5M16 2V5M3 9H21M21 8.5V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V8.5M21 8.5V7C21 4.79086 19.2091 3 17 3H7C4.79086 3 3 4.79086 3 7V8.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 13H8.01M12 13H12.01M16 13H16.01M8 17H8.01M12 17H12.01" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Time SVG icon (weui:time-outlined)
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#2A0B07" strokeWidth="1.5"/>
    <path d="M12 7V12.5L16 15" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Share SVG icon
const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V13.5M15 7L12 4L9 7M5 12V17C5 17.5304 5.21071 18.0391 5.58579 18.4142C5.96086 18.7893 6.46957 19 7 19H17C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17V12" stroke="#B81B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const rasiDetails = {
  'Mesha': { english: 'Aries', lord: 'Mars' },
  'Vrishabha': { english: 'Taurus', lord: 'Venus' },
  'Mithuna': { english: 'Gemini', lord: 'Mercury' },
  'Karka': { english: 'Cancer', lord: 'Moon' },
  'Simha': { english: 'Leo', lord: 'Sun' },
  'Kanya': { english: 'Virgo', lord: 'Mercury' },
  'Tula': { english: 'Libra', lord: 'Venus' },
  'Vrishchika': { english: 'Scorpio', lord: 'Mars' },
  'Dhanu': { english: 'Sagittarius', lord: 'Jupiter' },
  'Makara': { english: 'Capricorn', lord: 'Saturn' },
  'Kumbha': { english: 'Aquarius', lord: 'Saturn' },
  'Meena': { english: 'Pisces', lord: 'Jupiter' }
};

export default function Prashna() {
  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Helper date/time functions
  const getTodayLocalDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getLocalTimeStr = () => {
    const d = new Date();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // States
  const [name, setName] = useState('Akhila M Menon');
  const [dob, setDob] = useState(getTodayLocalDateStr());
  const [tob, setTob] = useState(getLocalTimeStr());
  const [pob, setPob] = useState('Kochi, India');
  const [coords, setCoords] = useState('9.9312,76.2673'); // Default Kochi coords
  const [question, setQuestion] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Location Autocomplete suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Api trigger
  const [getPlanetPositions, { isLoading: loading }] = useLazyGetPlanetPositionsQuery();

  const [prediction, setPrediction] = useState({
    risingSign: 'Virgo rising',
    castTime: '',
    verdict: 'Caution — consult a remedy before proceeding.',
    planets: [],
    prashnaChartCells: []
  });

  // Fetch browser location on mount
  useEffect(() => {
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
          console.log("Geolocation permission not granted or failed, using default Kochi coords.");
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
    const offsetMin = new Date().getTimezoneOffset();
    const sign = offsetMin <= 0 ? '+' : '-';
    const abs = Math.abs(offsetMin);
    const hh = String(Math.floor(abs / 60)).padStart(2, '0');
    const mm = String(abs % 60).padStart(2, '0');
    return `${sign}${hh}:${mm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!coords) {
      setErrorMsg('Please select a place from the dropdown suggestions list.');
      return;
    }

    try {
      const timezone = getBrowserTimezone();
      const datetime = `${dob}T${tob}:00${timezone}`;

      const res = await getPlanetPositions({
        datetime,
        coordinates: coords,
        ayanamsa: 1,
        la: 'en'
      }).unwrap();

      if (res?.data?.planet_position) {
        const planetsList = res.data.planet_position;
        const ascendantPlanet = planetsList.find(p => p.name === 'Ascendant');
        const ascPos = ascendantPlanet ? ascendantPlanet.position : 1;
        const ascRasiName = ascendantPlanet ? ascendantPlanet.rasi.name : 'Mesha';

        // Calculate Prashna Verdict dynamically
        const rasiInfo = rasiDetails[ascRasiName] || { english: ascRasiName, lord: 'Mars' };
        const lordName = rasiInfo.lord;
        const lordPlanet = planetsList.find(p => p.name === lordName);
        const lordHouse = lordPlanet ? (((lordPlanet.position - ascPos + 12) % 12) + 1) : 1;
        const isRetro = lordPlanet ? lordPlanet.is_retrograde : false;

        let verdict = '';
        if (lordHouse === 6 || lordHouse === 8 || lordHouse === 12) {
          verdict = `Caution — Lagna Lord (${lordName}) is placed in the challenging ${lordHouse}th house of your Horary chart, indicating potential delays or obstacles. Seek remedy guidance.`;
        } else if (isRetro) {
          verdict = `Caution — Lagna Lord (${lordName}) is currently retrograde in the ${lordHouse}th house, implying re-evaluation of your question is required. Proceed with care.`;
        } else {
          verdict = `Favourable — Lagna Lord (${lordName}) is strong and well-placed in the ${lordHouse}th house, indicating a positive outcome and success for your question.`;
        }

        // Format castTime
        const now = new Date(`${dob}T${tob}`);
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        let hrs = now.getHours();
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        const ampm = hrs >= 12 ? 'pm' : 'am';
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12;
        const castTimeFormatted = `${day}/${month}/${year}, ${hrs}:${mins}:${secs} ${ampm}`;

        // Map shortnames for Grid cells
        const shortNamesMap = {
          'Ascendant': 'Asc',
          'Sun': 'Sun',
          'Moon': 'Moon',
          'Mars': 'Mars',
          'Mercury': 'Mercury',
          'Jupiter': 'Jupiter',
          'Venus': 'Venus',
          'Saturn': 'Saturn',
          'Rahu': 'Rahu',
          'Ketu': 'Ketu'
        };

        const templateGrid = [
          { signNum: '12', isCenter: false },
          { signNum: '1', isCenter: false },
          { signNum: '2', isCenter: false },
          { signNum: '11', isCenter: false },
          { isCenter: true, content: 'Prashna Chart' },
          { signNum: '3', isCenter: false },
          { signNum: '10', isCenter: false },
          { signNum: '9', isCenter: false },
          { signNum: '5-8', isCenter: false } // represents Cancer(4) to Scorpio(8)
        ];

        const calculatedGrid = templateGrid.map(cell => {
          if (cell.isCenter) return cell;

          let matchedPlanets = [];
          if (cell.signNum === '5-8') {
            matchedPlanets = planetsList.filter(p => p.position >= 4 && p.position <= 8);
          } else {
            const pos = parseInt(cell.signNum);
            matchedPlanets = planetsList.filter(p => p.position === pos);
          }

          const contentStr = matchedPlanets.map(p => shortNamesMap[p.name] || p.name).join('\n');
          return {
            ...cell,
            content: contentStr
          };
        });

        // Map Planet Placements List
        const targetPlacements = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
        const mappedPlanets = planetsList
          .filter(p => targetPlacements.includes(p.name))
          .map(p => {
            const houseNum = ((p.position - ascPos + 12) % 12) + 1;
            const displayNames = {
              'Sun': 'Sun (Surya)',
              'Moon': 'Moon (Chandra)',
              'Mars': 'Mars (Mangal)',
              'Mercury': 'Mercury (Budh)',
              'Jupiter': 'Jupiter (Guru)',
              'Venus': 'Venus (Shukra)',
              'Saturn': 'Saturn (Shani)',
              'Rahu': 'Rahu',
              'Ketu': 'Ketu'
            };

            return {
              name: displayNames[p.name] || p.name,
              rashi: p.rasi.name,
              house: `H${houseNum}`
            };
          });

        setPrediction({
          risingSign: `${rasiInfo.english} rising`,
          castTime: castTimeFormatted,
          verdict,
          planets: mappedPlanets,
          prashnaChartCells: calculatedGrid
        });

        setShowResults(true);

        // Smooth scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setErrorMsg('Invalid response from the server.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.data?.message || 'Failed to fetch Prashna planet positions. Please try again.');
    }
  };

  const handleShare = () => {
    const shareText = `🌟 Zodimithra Prashna prediction for ${name} 🌟\n• Query: "${question}"\n• Lagna: ${prediction.risingSign}\n• Cast at: ${prediction.castTime}\n• Verdict: ${prediction.verdict}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${name}'s Prashna Chart`,
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Prashna details copied to clipboard!');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div 
        className="w-full max-w-[430px] md:max-w-[700px] lg:max-w-[850px] min-h-screen md:min-h-0 bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10"
      >
        <CustomHeader
          title="Prashna"
          subtitle="Horary chart from question moment"
          onBack={() => navigate('/tools')}
        />

        <div className="flex flex-col items-center justify-start w-full max-w-[430px] mx-auto px-4 gap-[10px] box-border mt-6">
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-[13px] font-medium p-3 rounded-xl border border-red-200 w-full mb-2">
              {errorMsg}
            </div>
          )}

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
            <div className="flex flex-col items-start w-full gap-[10px] px-[15px] box-border relative" ref={dropdownRef}>
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
                  autoComplete="off"
                  className="w-full bg-transparent border-none outline-none font-['Poppins'] font-light text-[14px] leading-[21px] text-[#2A0B07] placeholder:text-[#2A0B07]/60"
                />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-[78px] left-[15px] right-[15px] bg-white border border-[#EFE5D5] rounded-xl shadow-lg z-50 overflow-hidden max-h-[200px] overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 hover:bg-[#FDFBF7] cursor-pointer text-[14px] text-[#2A0B07] border-b border-[#EFE5D5] last:border-0"
                      onClick={() => {
                        setPob(s.display_name);
                        setCoords(`${s.lat},${s.lon}`);
                        setShowSuggestions(false);
                      }}
                    >
                      {s.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Question Textarea Block (Frame 524 / 508 / 455) */}
            <div className="flex flex-col items-start w-full gap-[10px] px-[15px] box-border">
              <label className="font-['Poppins'] font-medium text-[14px] leading-[21px] text-left text-[#2A0B07] capitalize shrink-0">
                Question
              </label>
              <div className="box-border flex flex-row items-start p-[13px] gap-[30px] w-full h-[135px] bg-[#F5ECE3] border border-[rgba(194,178,178,0.8)] rounded-[15px] shrink-0">
                <textarea
                  placeholder="Type the Client’s Question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  className="w-full h-full bg-transparent border-none outline-none font-['Poppins'] font-light text-[14px] leading-[21px] text-[#2A0B07] placeholder:text-[#2A0B07]/60 resize-none"
                />
              </div>
            </div>

            {/* Submit Button Block (Component 7) */}
            <div className="w-full px-[15px] mt-2 box-border">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-[#2A0B07] hover:bg-[#2A0B07]/90 active:scale-[0.98] transition-all rounded-[20px] flex justify-center items-center p-[16px_15px] gap-[12px] border-none cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="font-['Poppins'] font-bold text-[14px] leading-[20px] text-center text-[#ECECEC] select-none">
                      Casting Prashna Chart...
                    </span>
                  </>
                ) : (
                  <span className="font-['Poppins'] font-bold text-[14px] leading-[20px] text-center text-[#ECECEC] select-none">
                    Cast Prashna Chart
                  </span>
                )}
              </button>
            </div>

          </form>

          {/* Results section */}
          <AnimatePresence>
            {showResults && !loading && (
              <motion.div 
                ref={resultsRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col gap-6 mt-4 pb-6 px-[15px]"
              >
                {/* Result header banner */}
                <div className="flex flex-row justify-between items-center w-full h-[47px] box-border px-2.5">
                  <h3 className="font-['Sofia_Sans'] font-bold text-[20px] leading-[20px] text-[#2A0B07] text-left m-0 truncate pr-2">
                    Prashna Chart - {name}
                  </h3>
                  
                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="flex flex-row justify-center items-center p-[4.29px_8.57px] gap-[8.57px] shrink-0 w-[77px] h-[27px] bg-[#F4E0E0] border border-[#B81B1B] rounded-[37px] cursor-pointer hover:bg-[#B81B1B]/5 transition-colors"
                  >
                    <ShareIcon />
                    <span className="font-['Poppins'] font-normal text-[10.3px] leading-[15px] text-[#B81B1B]">
                      Share
                    </span>
                  </button>
                </div>

                {/* D1 South Indian Grid Chart */}
                <div className="w-full max-w-[362px] aspect-square grid grid-cols-3 grid-rows-3 border border-[#FDF2DC] rounded-[20px] overflow-hidden bg-[#FAF6F0] mx-auto box-border shadow-sm">
                  {prediction.prashnaChartCells?.map((cell, cIdx) => {
                    if (cell.isCenter) {
                      return (
                        <div 
                          key={cIdx} 
                          className="bg-[#FDF2DC] border border-[rgba(211,198,172,0.8)] flex items-center justify-center flex-col text-center"
                        >
                          <span className="font-['Poppins'] font-normal text-[12px] leading-[18px] text-[#2A0B07]">{cell.content}</span>
                        </div>
                      );
                    }
                    
                    return (
                      <div 
                        key={cIdx} 
                        className="bg-[#F5ECE3] border border-[rgba(211,198,172,0.8)] flex flex-col items-start justify-between p-0 relative w-full h-full"
                      >
                        {/* signNum */}
                        <div className="flex flex-col justify-center items-center p-2.5 w-[33px] h-[38px] mt-[-2px] ml-0">
                          <span className="font-['Poppins'] font-normal text-[12px] leading-[18px] text-[#B7B7B7] text-left">
                            {cell.signNum}
                          </span>
                        </div>
                        
                        {/* Center content */}
                        <div className="flex flex-row justify-center items-center p-2.5 gap-2.5 w-full flex-grow mt-[-14px]">
                          <span className="font-['Poppins'] font-normal text-[12px] leading-[18px] text-[#2A0B07] text-center whitespace-pre-line">
                            {cell.content}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Planet Placements List */}
                <div className="flex flex-col items-start gap-[10px] w-full max-w-[382px] mx-auto box-border mt-3">
                  {prediction.planets?.map((planet, pIdx) => (
                    <div 
                      key={pIdx} 
                      className="box-border flex flex-row justify-between items-center p-[5px] w-full border-b border-black/40 pb-2"
                    >
                      {/* Left Side: Rectangle and Name */}
                      <div className="flex flex-row items-center gap-[11px]">
                        <div className="w-[26px] h-[26px] bg-[#D9D9D9] flex-shrink-0" />
                        <span className="font-['Poppins'] font-medium text-[14px] leading-[20px] text-[#2A0B07]">
                          {planet.name}
                        </span>
                      </div>

                      {/* Right Side: Rashi and House badge */}
                      <div className="flex flex-row justify-end items-center gap-[10px]">
                        <span className="font-['Poppins'] font-normal text-[10.3px] leading-[15px] text-[#8A8A8A] capitalize">
                          {planet.rashi}
                        </span>
                        
                        {/* House pill badge */}
                        <div className="box-border flex flex-row justify-center items-center py-[4.3px] px-[8.6px] bg-[#FFF2F0] border border-[#2A0B07] rounded-[37px] h-[27px] min-w-[44px]">
                          <span className="font-['Poppins'] font-normal text-[10.3px] leading-[15px] text-[#2A0B07]">
                            {planet.house}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Frame 561 */}
                <div 
                  className="box-border flex flex-col items-start pt-[12px] pr-[14px] pb-[14px] pl-[18px] gap-[10.65px] w-full max-w-[404px] min-h-[116px] bg-[#F5ECE3] border border-[rgba(11,11,11,0.2)] rounded-[9.469px] mx-auto shrink-0 select-none"
                >
                  {/* Frame 590 */}
                  <div className="flex flex-col items-start p-0 gap-[6px] w-full">
                    
                    {/* Frame 608 */}
                    <div className="flex flex-col items-start p-0 gap-[2px] w-full">
                      <span className="font-['Sofia_Sans'] font-semibold text-[14.2041px] leading-[19px] text-[#2A0B07] text-left">
                        Prashna Lagna
                      </span>
                      <span className="font-['Poppins'] font-extrabold text-[20px] leading-[19px] text-[#2A0B07] text-left">
                        {prediction.risingSign}
                      </span>
                    </div>

                    {/* Frame 607 */}
                    <div className="flex flex-col items-start p-0 gap-[2px] w-full">
                      <span className="font-['Poppins'] font-light text-[10px] leading-[19px] text-[#2A0B07] text-left">
                        Cast at {prediction.castTime}
                      </span>
                      <span className="font-['Poppins'] font-normal text-[11.8367px] leading-[19px] text-[#2A0B07] text-left">
                        <span className="font-semibold">Verdict:</span> {prediction.verdict}
                      </span>
                    </div>

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

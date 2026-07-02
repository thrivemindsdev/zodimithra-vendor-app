import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import CustomHeader from '../../components/common/CustomHeader';
import CustomLabel from '../../components/common/CustomLabel';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { useLazyGetPlanetPositionsQuery, useLazyGetDashaPeriodsQuery } from '../../redux/api/toolsApi';

// Calendar SVG icon
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 14.5H3.5C2.39543 14.5 1.5 13.6046 1.5 12.5V4.5C1.5 3.39543 2.39543 2.5 3.5 2.5H12.5C13.6046 2.5 14.5 3.39543 14.5 4.5V12.5C14.5 13.6046 13.6046 14.5 12.5 14.5Z" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 1.5V3.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 1.5V3.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.5 5.5H14.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Clock SVG icon
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.06667 6.33533L9.66067 8.92933L9.09533 9.49533L6.26667 6.66667V2.66667H7.06667V6.33533ZM6.66667 13.3333C2.98467 13.3333 0 10.3487 0 6.66667C0 2.98467 2.98467 0 6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333ZM6.66667 12.5333C8.2226 12.5333 9.71481 11.9152 10.815 10.815C11.9152 9.71481 12.5333 8.2226 12.5333 6.66667C12.5333 5.11073 11.9152 3.61852 10.815 2.51831C9.71481 1.41809 8.2226 0.8 6.66667 0.8C5.11073 0.8 3.61852 1.41809 2.51831 2.51831C1.41809 3.61852 0.8 5.11073 0.8 6.66667C0.8 8.2226 1.41809 9.71481 2.51831 10.815C3.61852 11.9152 5.11073 12.5333 6.66667 12.5333Z" fill="#2A0B07" />
  </svg>
);

// Chevron Down SVG icon
const ChevronDownIcon = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1.5L6 6.5L11 1.5" stroke="#2A0B07" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Planet Symbols Map
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

// Planet Shortnames for Grid cells
const shortNamesMap = {
  'Ascendant': 'Asc',
  'Sun': 'Sun',
  'Moon': 'Moon',
  'Mars': 'Mars',
  'Mercury': 'Mer',
  'Jupiter': 'Jup',
  'Venus': 'Ven',
  'Saturn': 'Sat',
  'Rahu': 'Rahu',
  'Ketu': 'Ketu'
};

// Rashi details translation
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

// Northern style chart configurations (Center positions of houses)
const northHousesConfig = [
  { house: 1, signX: 181, signY: 55, planetsX: 181, planetsY: 90 },
  { house: 2, signX: 90, signY: 30, planetsX: 90, planetsY: 55 },
  { house: 3, signX: 30, signY: 90, planetsX: 60, planetsY: 90 },
  { house: 4, signX: 55, signY: 181, planetsX: 95, planetsY: 181 },
  { house: 5, signX: 30, signY: 271, planetsX: 60, planetsY: 271 },
  { house: 6, signX: 90, signY: 332, planetsX: 90, planetsY: 307 },
  { house: 7, signX: 181, signY: 307, planetsX: 181, planetsY: 272 },
  { house: 8, signX: 271, signY: 332, planetsX: 271, planetsY: 307 },
  { house: 9, signX: 332, signY: 271, planetsX: 302, planetsY: 271 },
  { house: 10, signX: 307, signY: 181, planetsX: 267, planetsY: 181 },
  { house: 11, signX: 332, signY: 90, planetsX: 302, planetsY: 90 },
  { house: 12, signX: 271, signY: 30, planetsX: 271, planetsY: 55 },
];

const generateDescription = (planets, activeDasha) => {
  const jup = planets.find(p => p.planetKey === 'jupiter');
  const moon = planets.find(p => p.planetKey === 'moon');
  const sun = planets.find(p => p.planetKey === 'sun');
  
  let parts = [];
  if (jup) {
    const house = jup.house.replace('H', '');
    if (house === '5' || house === '9' || house === '1') {
      parts.push(`Strong Jupiter in ${house}th house indicates wisdom and spiritual inclination.`);
    } else {
      parts.push(`Jupiter in ${house}th house influences your learning and path.`);
    }
  }
  if (moon) {
    const house = moon.house.replace('H', '');
    if (house === '10' || house === '11' || house === '1') {
      parts.push(`Moon in ${house}th house gives emotional resilience and prominence.`);
    } else {
      parts.push(`Moon in ${house}th house influences your feelings and mindset.`);
    }
  }
  if (sun) {
    const house = sun.house.replace('H', '');
    parts.push(`Sun in ${house}th house represents your vitality and life focus.`);
  }
  
  let dashaStr = '';
  if (activeDasha) {
    dashaStr = ` Current Mahadasha: ${activeDasha.label} (${activeDasha.range}).`;
  }
  
  return `${parts.join(' ')}${dashaStr}`;
};

export default function KundliGenerator() {
  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const dropdownRef = useRef(null);

  // States
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('');
  const [coords, setCoords] = useState('');
  const [chartType, setChartType] = useState('Southern');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Location Autocomplete suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  // RTK Query lazy hooks
  const [getPlanetPositions] = useLazyGetPlanetPositionsQuery();
  const [getDashaPeriods] = useLazyGetDashaPeriodsQuery();

  // Suggestion list click outside listener
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
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
      const results = await res.json();
      setSuggestions(results);
    } catch (e) {
      console.error("Failed to fetch location suggestions", e);
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
    if (!coords) {
      setErrorMsg('Please select a birth place from the suggestions list.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const timezone = getBrowserTimezone();
      const datetime = `${dob}T${tob}:00${timezone}`;

      // Execute APIs in parallel
      const [planetsRes, dashaRes] = await Promise.all([
        getPlanetPositions({
          datetime,
          coordinates: coords,
          ayanamsa: 1,
          la: 'en'
        }).unwrap(),
        getDashaPeriods({
          datetime,
          coordinates: coords,
          ayanamsa: 1,
          la: 'en'
        }).unwrap()
      ]);

      const planetsList = planetsRes?.data?.planet_position || planetsRes?.planet_position || [];
      if (planetsList.length === 0) {
        throw new Error('Failed to retrieve planet positions from server.');
      }

      const ascendantPlanet = planetsList.find(p => p.name === 'Ascendant');
      const ascPos = ascendantPlanet ? ascendantPlanet.position : 1;
      const ascRasiName = ascendantPlanet ? ascendantPlanet.rasi?.name : 'Meena';

      // Setup Southern Style Chart Cells
      const templateGrid = [
        { signNum: '12', isCenter: false },
        { signNum: '1', isCenter: false },
        { signNum: '2', isCenter: false },
        { signNum: '11', isCenter: false },
        { isCenter: true, content: 'D1 Chart' },
        { signNum: '3', isCenter: false },
        { signNum: '10', isCenter: false },
        { signNum: '9', isCenter: false },
        { signNum: '4-8', isCenter: false }
      ];

      const calculatedGrid = templateGrid.map(cell => {
        if (cell.isCenter) return cell;

        let matchedPlanets = [];
        if (cell.signNum === '4-8') {
          matchedPlanets = planetsList.filter(p => p.position >= 4 && p.position <= 8);
        } else {
          const pos = parseInt(cell.signNum);
          matchedPlanets = planetsList.filter(p => p.position === pos);
        }

        const contentStr = matchedPlanets.map(p => {
          if (p.name === 'Ascendant') {
            const rasiAbbr = rasiDetails[p.rasi?.name]?.english.substring(0, 4) || p.rasi?.name || 'Meen';
            return `Asc\n${rasiAbbr}`;
          }
          return shortNamesMap[p.name] || p.name;
        }).join('\n');

        return {
          ...cell,
          content: contentStr
        };
      });

      // Format Planet Placements List
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
            planetKey: p.name.toLowerCase(),
            rashi: p.rasi?.name || '',
            house: `H${houseNum}`
          };
        });

      // Find active Mahadasha
      let activeDasha = null;
      if (dashaRes?.data?.dasha_periods) {
        const birthDate = new Date(datetime);
        const now = new Date();
        const dashaList = dashaRes.data.dasha_periods.map(period => {
          let startDate = new Date(period.start);
          let startStr = period.start;

          if (startDate < birthDate) {
            startDate = birthDate;
            startStr = datetime;
          }

          const formatYr = (dStr) => dStr ? new Date(dStr).getFullYear() : '';
          const rangeStr = `${formatYr(startStr)} – ${formatYr(period.end)}`;
          const active = now >= startDate && now <= new Date(period.end);

          return {
            planet: period.name,
            label: `${period.name} Mahadasha`,
            range: rangeStr,
            isActive: active
          };
        });
        activeDasha = dashaList.find(d => d.isActive) || dashaList[0];
      }

      // Metadata properties
      const lagnaRasi = rasiDetails[ascRasiName]?.english || ascRasiName || 'Pisces';
      const moonRasi = rasiDetails[planetsList.find(p => p.name === 'Moon')?.rasi?.name]?.english || 'Sagittarius';
      const sunRasi = rasiDetails[planetsList.find(p => p.name === 'Sun')?.rasi?.name]?.english || 'Pisces';

      const desc = generateDescription(mappedPlanets, activeDasha);

      setResultData({
        lagna: lagnaRasi,
        moonSign: moonRasi,
        sunSign: sunRasi,
        planets: mappedPlanets,
        rawPlanets: planetsList,
        chartCells: calculatedGrid,
        description: desc,
        ascPos
      });

      setShowResults(true);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);

    } catch (err) {
      console.error(err);
      setErrorMsg(err?.data?.message || 'Failed to generate birth chart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (!resultData) return;
    const shareText = `🌟 Zodimithra Kundli Chart for ${name} 🌟\n• Lagna: ${resultData.lagna}\n• Moon Sign: ${resultData.moonSign}\n• Sun Sign: ${resultData.sunSign}\n• Description: ${resultData.description}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${name}'s Birth Chart`,
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Kundli details copied to clipboard!');
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else {
      navigate('/tools');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div 
        className="w-full max-w-[430px] md:max-w-[700px] lg:max-w-[850px] min-h-screen md:min-h-0 bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10"
      >
        {/* Custom Header using general project assets */}
        <CustomHeader
          title="Kundli Generator"
          subtitle="Vedic birth chart, Navamsa & planet positions"
          onBack={handleBack}
        />

        <div className="px-5 md:px-8 flex flex-col gap-6 w-full box-border mt-4">
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 text-[13px] font-medium p-3 rounded-xl border border-red-200 w-full mb-3">
                {errorMsg}
              </div>
            )}
            
            {/* Name */}
            <div className="flex flex-col items-start gap-2.5 w-full">
              <CustomLabel title="Name" />
              <CustomInput
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Akhila M Menon"
                required
              />
            </div>

            {/* Date Of Birth & Time Of Birth */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Date Of Birth */}
              <div className="flex flex-col items-start gap-2.5 w-full">
                <CustomLabel title="Date Of Birth" />
                <CustomInput
                  type="date"
                  name="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  icon={<CalendarIcon />}
                />
              </div>

              {/* Time Of Birth */}
              <div className="flex flex-col items-start gap-2.5 w-full">
                <CustomLabel title="Time Of Birth" />
                <CustomInput
                  type="time"
                  name="tob"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  required
                  icon={<ClockIcon />}
                />
              </div>
            </div>

            {/* Place Of Birth */}
            <div className="flex flex-col items-start gap-2.5 w-full relative" ref={dropdownRef}>
              <CustomLabel title="Place Of Birth" />
              <div className="relative w-full">
                <CustomInput
                  type="text"
                  name="pob"
                  value={pob}
                  onChange={(e) => handlePobChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Kochi, India"
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
            </div>

            {/* Chart Type */}
            <div className="flex flex-col items-start gap-2.5 w-full">
              <CustomLabel title="Chart Type" />
              <div className="relative w-full flex items-center">
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="w-full h-[52px] bg-[#F5ECE3] rounded-[15px] outline-none text-[#2A0B07] text-[14px] border-none px-4 appearance-none cursor-pointer font-['Poppins'] font-medium"
                >
                  <option value="Southern">Southern</option>
                  <option value="Northern">Northern</option>
                </select>
                <div className="absolute right-4 pointer-events-none flex items-center justify-center">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-2 w-full flex justify-center">
              <CustomButton
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full"
              >
                Generate Kundli Chart
              </CustomButton>
            </div>
          </form>

          {/* Animated Result Section */}
          <AnimatePresence>
            {showResults && resultData && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-center gap-[15px] w-full border-t border-[#2A0B07]/5 pt-6 box-border overflow-hidden"
              >
                
                {/* Header Row: Title & Share Button */}
                <div className="flex flex-row justify-between items-center w-full h-[47px] box-border px-2.5">
                  <h3 className="font-['Sofia_Sans'] font-bold text-[20px] leading-[20px] text-[#2A0B07] text-left m-0 truncate pr-2">
                    Birth Chart - {name}
                  </h3>
                  
                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="flex flex-row justify-center items-center p-[4.29px_8.57px] gap-[8.57px] shrink-0 w-[77px] h-[27px] bg-[#F4E0E0] border border-[#B81B1B] rounded-[37px] cursor-pointer hover:bg-[#B81B1B]/5 transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V13.5M15 7L12 4L9 7M5 12V17C5 17.5304 5.21071 18.0391 5.58579 18.4142C5.96086 18.7893 6.46957 19 7 19H17C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17V12" stroke="#B81B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <span className="font-['Poppins'] font-normal text-[10.3px] leading-[15px] text-[#B81B1B]">
                      Share
                    </span>
                  </button>
                </div>

                {chartType === 'Southern' ? (
                  /* D1 South Indian Grid Chart (Width 362px square responsive) */
                  <div className="w-full max-w-[362px] aspect-square grid grid-cols-3 grid-rows-3 border border-[#FDF2DC] rounded-[20px] overflow-hidden bg-[#FAF6F0] mx-auto box-border shadow-sm">
                    {resultData.chartCells.map((cell, cIdx) => {
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
                          {/* top-left number */}
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
                ) : (
                  /* D1 North Indian Diamond Style SVG Chart */
                  <div className="w-full max-w-[362px] aspect-square mx-auto box-border">
                    <svg width="100%" height="100%" viewBox="0 0 362 362" className="border border-[#FDF2DC] rounded-[20px] bg-[#FAF6F0] shadow-sm overflow-hidden">
                      <rect x="0" y="0" width="362" height="362" fill="none" stroke="#B9A795" strokeWidth="1.5" />
                      <line x1="0" y1="0" x2="362" y2="362" stroke="#B9A795" strokeWidth="1.5" />
                      <line x1="362" y1="0" x2="0" y2="362" stroke="#B9A795" strokeWidth="1.5" />
                      <polygon points="181,0 362,181 181,362 0,181" fill="none" stroke="#B9A795" strokeWidth="1.5" />
                      {northHousesConfig.map(config => {
                        const signNum = ((resultData.ascPos - 2 + config.house + 12) % 12) + 1;
                        const matchedPlanets = (resultData.rawPlanets || []).filter(p => p.position === signNum);
                        const housePlanets = matchedPlanets.map(p => {
                          if (p.name === 'Ascendant') return 'Asc';
                          return shortNamesMap[p.name] || p.name;
                        });
                        const yStart = config.planetsY - ((housePlanets.length - 1) * 6);
                        return (
                          <g key={config.house}>
                            {/* Sign Number */}
                            <text
                              x={config.signX}
                              y={config.signY}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="font-['Poppins'] text-[10px] fill-[#B7B7B7] font-semibold"
                            >
                              {signNum}
                            </text>
                            {/* Planets list */}
                            {housePlanets.length > 0 && (
                              <text
                                x={config.planetsX}
                                y={yStart}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="font-['Poppins'] text-[11px] fill-[#2A0B07] font-medium"
                              >
                                {housePlanets.map((p, idx) => (
                                  <tspan key={idx} x={config.planetsX} dy={idx === 0 ? 0 : 12}>
                                    {p}
                                  </tspan>
                                ))}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                )}

                {/* Planet Placements List (Frame 562) */}
                <div className="flex flex-col items-start gap-[10px] w-full max-w-[382px] mx-auto box-border mt-3">
                  {resultData.planets.map((planet, pIdx) => (
                    <div 
                      key={pIdx} 
                      className="box-border flex flex-row justify-between items-center p-[5px] w-full border-b border-black/40 pb-2"
                    >
                      {/* Left Side: Symbol and Name */}
                      <div className="flex flex-row items-center gap-[11px]">
                        <div className="w-[26px] h-[26px] bg-[#F5ECE3] rounded-md flex items-center justify-center text-[14px] font-bold text-[#2A0B07] flex-shrink-0">
                          {planetSymbols[planet.planetKey] || '✦'}
                        </div>
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

                {/* Report Description Box (Frame 560 & 561) with left accent border */}
                <div className="box-border flex flex-col items-start pl-[6px] gap-[11.8px] w-full max-w-[407.18px] bg-[#2A0B07] shadow-[0px_2px_6px_rgba(0,0,0,0.25)] rounded-[9.5px] mt-4 overflow-hidden mx-auto">
                  <div className="box-border flex flex-col items-start p-[7px_12px_12px_18px] gap-[10.6px] w-full bg-[#F8F4F3] rounded-r-[9.5px]">
                    <span className="font-['Sofia_Sans'] font-semibold text-[14.2px] leading-[19px] text-[#2A0B07] text-left w-full">
                      Lagna: {resultData.lagna} · Moon Sign: {resultData.moonSign} · Sun Sign: {resultData.sunSign}
                    </span>
                    <p className="font-['Poppins'] font-normal text-[11.8px] leading-[19px] text-[#2A0B07] m-0 text-left">
                      {resultData.description}
                    </p>
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

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import CustomHeader from '../../components/common/CustomHeader';
import CustomLabel from '../../components/common/CustomLabel';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { useLazyGetDashaPeriodsQuery } from '../../redux/api/toolsApi';

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

// Triangle arrow icon component
const TriangleIcon = ({ isOpen, color = "#585754" }) => (
  <svg 
    className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
    width="7" 
    height="8" 
    viewBox="0 0 7 8" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ transformOrigin: 'center' }}
  >
    <path d="M0.5 0.5L6.5 4L0.5 7.5V0.5Z" fill={color} />
  </svg>
);

// Planet order in Vimshottari
const PLANETS_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

// Years for each planet
const PLANET_YEARS = {
  'Ketu': 7,
  'Venus': 20,
  'Sun': 6,
  'Moon': 10,
  'Mars': 7,
  'Rahu': 18,
  'Jupiter': 16,
  'Saturn': 19,
  'Mercury': 17
};

// Formats a date to DD/MM/YYYY
const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

// Formats a date to YYYY
const formatYear = (dateInput) => {
  if (!dateInput) return '';
  return new Date(dateInput).getFullYear();
};

// Get the cyclic order starting from a specific planet
const getCyclicOrder = (startPlanetName) => {
  const normalized = startPlanetName.charAt(0).toUpperCase() + startPlanetName.slice(1).toLowerCase();
  const index = PLANETS_ORDER.indexOf(normalized);
  if (index === -1) return PLANETS_ORDER;
  return [...PLANETS_ORDER.slice(index), ...PLANETS_ORDER.slice(0, index)];
};

// Calculate Antardashas (level 2)
const calculateAntardashas = (mahadashaName, startStr, endStr) => {
  const startMs = new Date(startStr).getTime();
  const endMs = new Date(endStr).getTime();
  const totalMs = endMs - startMs;
  
  const order = getCyclicOrder(mahadashaName);
  let currentMs = startMs;
  
  return order.map((subPlanet) => {
    const fraction = PLANET_YEARS[subPlanet] / 120;
    const durationMs = totalMs * fraction;
    const itemStart = currentMs;
    const itemEnd = currentMs + durationMs;
    currentMs += durationMs;
    
    return {
      name: subPlanet,
      label: `${mahadashaName}-${subPlanet} Antar`,
      start: new Date(itemStart).toISOString(),
      end: new Date(itemEnd).toISOString()
    };
  });
};

// Calculate Pratyantardashas (level 3)
const calculatePratyantardashas = (mahadashaName, antardashaName, startStr, endStr) => {
  const startMs = new Date(startStr).getTime();
  const endMs = new Date(endStr).getTime();
  const totalMs = endMs - startMs;
  
  const order = getCyclicOrder(antardashaName);
  let currentMs = startMs;
  
  return order.map((subSubPlanet) => {
    const fraction = PLANET_YEARS[subSubPlanet] / 120;
    const durationMs = totalMs * fraction;
    const itemStart = currentMs;
    const itemEnd = currentMs + durationMs;
    currentMs += durationMs;
    
    const durationDays = durationMs / (1000 * 60 * 60 * 24);
    
    return {
      name: subSubPlanet,
      label: `${mahadashaName}-${antardashaName}-${subSubPlanet} Pratyantar`,
      start: new Date(itemStart).toISOString(),
      end: new Date(itemEnd).toISOString(),
      durationDays: durationDays
    };
  });
};

export default function DasaDetails() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const resultsRef = useRef(null);

  // API query
  const [getDashaPeriods, { isLoading }] = useLazyGetDashaPeriodsQuery();

  // Input states
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('');
  const [coords, setCoords] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [calculatedDashas, setCalculatedDashas] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Tree expanded states
  const [expandedMahadashas, setExpandedMahadashas] = useState({});
  const [expandedAntardashas, setExpandedAntardashas] = useState({});

  // Location suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
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
    setErrorMsg('');

    let finalCoords = coords;
    if (!finalCoords && pob) {
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

    if (!finalCoords) {
      setErrorMsg('Please enter a valid birth place.');
      return;
    }

    try {
      const timezone = getBrowserTimezone();
      const datetime = `${dob}T${tob}:00${timezone}`;
      
      const res = await getDashaPeriods({
        datetime,
        coordinates: finalCoords,
        ayanamsa: 1,
        la: 'en'
      }).unwrap();

      if (res?.data?.dasha_periods) {
        const birthDate = new Date(datetime);
        const mapped = res.data.dasha_periods.map((period, index) => {
          let startDate = new Date(period.start);
          let startStr = period.start;

          if (startDate < birthDate) {
            startDate = birthDate;
            startStr = datetime;
          }

          // Precompute level 2 Antardashas
          const antardashas = calculateAntardashas(period.name, startStr, period.end);

          return {
            name: period.name,
            label: `${period.name} Mahadasha`,
            start: startStr,
            end: period.end,
            years: PLANET_YEARS[period.name] || 0,
            antardashas: antardashas
          };
        });

        setCalculatedDashas(mapped);
        setShowResults(true);

        // Pre-expand the first Mahadasha and its first Antardasha to give a great initial view matching the screenshot reference
        setExpandedMahadashas({ 0: true });
        setExpandedAntardashas({ "0-0": true });

        // Scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setErrorMsg('Invalid response from the server.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.data?.message || 'Failed to calculate Dasha. Please check birth details.');
    }
  };

  const toggleMahadasha = (index) => {
    setExpandedMahadashas(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleAntardasha = (mIdx, aIdx) => {
    const key = `${mIdx}-${aIdx}`;
    setExpandedAntardashas(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div 
        className="w-full max-w-[430px] md:max-w-[700px] lg:max-w-[850px] min-h-screen md:min-h-0 bg-[#FDFBF7] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10"
      >
        <CustomHeader
          title="Dasa · Antar · Pratyantar"
          subtitle="Drill 3 levels of Vimshottari"
          onBack={() => navigate('/tools')}
        />

        <div className="px-5 md:px-8 flex flex-col gap-6 w-full box-border mt-5">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-[13px] font-medium p-3 rounded-xl border border-red-200 w-full">
              {errorMsg}
            </div>
          )}

          {!showResults ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
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

              {/* DOB & TOB */}
              <div className="grid grid-cols-2 gap-4 w-full">
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

              <div className="mt-4 w-full">
                <CustomButton
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  className="w-full h-[52px]"
                >
                  Build Dasha Tree
                </CustomButton>
              </div>
            </form>
          ) : (
            <div ref={resultsRef} className="w-full flex flex-col gap-6">
              
              {/* Back to Form / Profile Header */}
              <div className="flex justify-between items-center w-full pb-2 border-b border-[#EFE9E5]">
                <div className="flex flex-col">
                  <h3 className="font-['Sofia_Sans'] font-bold text-[20px] text-[#2A0B07]">
                    Vimshottari Dasha Tree
                  </h3>
                  <span className="text-[12px] text-[#8A8A8A] font-light">
                    {name} · {formatDate(dob)} {tob} · {pob.split(',')[0]}
                  </span>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="px-3.5 py-1.5 bg-[#FAF6F2] hover:bg-[#F2EAE2] text-[#585754] text-[12px] font-semibold rounded-lg border border-[#EFE9E5] transition-colors"
                >
                  Change Details
                </button>
              </div>

              {/* The Tree Stack */}
              <div className="flex flex-col gap-3.5 w-full select-none">
                {calculatedDashas.map((mahadasha, mIdx) => {
                  const isMExpanded = !!expandedMahadashas[mIdx];
                  
                  return (
                    <div key={mIdx} className="flex flex-col w-full">
                      
                      {/* Level 1: Mahadasha Item */}
                      <div
                        onClick={() => toggleMahadasha(mIdx)}
                        className={`flex flex-row items-center gap-2 cursor-pointer w-full box-border transition-all duration-150 ${
                          isMExpanded 
                            ? 'bg-[#FAF6F2] border border-[#EFE9E5] rounded-[10px] py-[12px] px-[19px] min-h-[47px]' 
                            : 'bg-[#FEFEFE] border border-[#F5F5F3] rounded-[9px] py-[11px] px-[18px] min-h-[47px]'
                        }`}
                      >
                        <TriangleIcon isOpen={isMExpanded} color={isMExpanded ? '#585754' : '#717171'} />
                        
                        <div className="flex flex-row items-baseline gap-1.5 flex-1 min-w-0">
                          <span className={`font-['Inter'] font-bold text-[18px] leading-tight ${isMExpanded ? 'text-[#585754]' : 'text-[#717171]'}`}>
                            {mahadasha.name}
                          </span>
                          <span className={`font-['Inter'] font-normal text-[15px] leading-tight ${isMExpanded ? 'text-[#75736F]' : 'text-[#8A8A8A]'}`}>
                            Mahadasha · {mahadasha.years} yrs · {formatYear(mahadasha.start)} – {formatYear(mahadasha.end)}
                          </span>
                        </div>
                      </div>

                      {/* Level 2: Antardashas (Rendered when expanded) */}
                      {isMExpanded && (
                        <div className="relative pl-[23px] ml-[23px] flex flex-col gap-2 mt-2">
                          
                          {/* Tree Vertical Connector Line for Level 2 */}
                          <div className="absolute left-0 top-0 bottom-6 w-[1.5px] bg-[#EFE9E5]" />

                          {mahadasha.antardashas.map((antar, aIdx) => {
                            const aKey = `${mIdx}-${aIdx}`;
                            const isAExpanded = !!expandedAntardashas[aKey];
                            
                            return (
                              <div key={aIdx} className="flex flex-col w-full">
                                
                                {/* Level 2 Item */}
                                <div
                                  onClick={() => toggleAntardasha(mIdx, aIdx)}
                                  className={`flex flex-row items-center gap-1.5 cursor-pointer w-full box-border rounded-[7px] py-[10px] px-[12px] min-h-[41px] border transition-colors ${
                                    isAExpanded 
                                      ? 'bg-[#FCFAF4] border-[#EFEAD5]' 
                                      : 'bg-[#FEFEFE] border-[#F6F5F3] hover:bg-[#FCFAF8]'
                                  }`}
                                >
                                  <TriangleIcon isOpen={isAExpanded} color="#575757" />
                                  
                                  <div className="flex flex-row items-baseline gap-1.5 flex-1 min-w-0">
                                    <span className="font-['Inter'] font-semibold text-[15px] text-[#575757]">
                                      {antar.name}
                                    </span>
                                    <span className="font-['Inter'] font-normal text-[14px] text-[#6C6C6C] truncate">
                                      Antar · {formatDate(antar.start)} → {formatDate(antar.end)}
                                    </span>
                                  </div>
                                </div>

                                {/* Level 3: Pratyantardashas (Rendered when expanded) */}
                                {isAExpanded && (
                                  <div className="relative pl-[20px] ml-[15px] flex flex-col gap-1.5 mt-1.5">
                                    
                                    {/* Tree Vertical Connector Line for Level 3 */}
                                    <div className="absolute left-0 top-0 bottom-5 w-[1.5px] bg-[#EFEAD5]" />

                                    {calculatePratyantardashas(mahadasha.name, antar.name, antar.start, antar.end).map((prat, pIdx) => {
                                      return (
                                        <div
                                          key={pIdx}
                                          className="flex flex-row items-center gap-2 w-full box-border rounded-[7px] py-[8px] px-[12px] min-h-[39px] bg-[#FCFAF4] border border-[#F4F1EC]"
                                        >
                                          {/* Custom bullet dot representation */}
                                          <div className="w-1.5 h-1.5 rounded-full bg-[#8C8A85] flex-shrink-0" />
                                          
                                          <div className="flex flex-row items-baseline gap-1 flex-1 min-w-0">
                                            <span className="font-['Inter'] font-normal text-[13.5px] text-[#8C8A85] truncate">
                                              {prat.name}
                                            </span>
                                            <span className="font-['Inter'] font-normal text-[13.5px] text-[#8C8A85]">
                                              Pratyantar · {prat.durationDays.toFixed(1)} days ({formatDate(prat.start)} - {formatDate(prat.end)})
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                              </div>
                            );
                          })}

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

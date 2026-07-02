import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomHeader from '../../components/common/CustomHeader';
import CustomLabel from '../../components/common/CustomLabel';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { useLazyGetPlanetPositionsQuery } from '../../redux/api/toolsApi';

// SVGs
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 14.5H3.5C2.39543 14.5 1.5 13.6046 1.5 12.5V4.5C1.5 3.39543 2.39543 2.5 3.5 2.5H12.5C13.6046 2.5 14.5 3.39543 14.5 4.5V12.5C14.5 13.6046 13.6046 14.5 12.5 14.5Z" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 1.5V3.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 1.5V3.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.5 5.5H14.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.06667 6.33533L9.66067 8.92933L9.09533 9.49533L6.26667 6.66667V2.66667H7.06667V6.33533ZM6.66667 13.3333C2.98467 13.3333 0 10.3487 0 6.66667C0 2.98467 2.98467 0 6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333ZM6.66667 12.5333C8.2226 12.5333 9.71481 11.9152 10.815 10.815C11.9152 9.71481 12.5333 8.2226 12.5333 6.66667C12.5333 5.11073 11.9152 3.61852 10.815 2.51831C9.71481 1.41809 8.2226 0.8 6.66667 0.8C5.11073 0.8 3.61852 1.41809 2.51831 2.51831C1.41809 3.61852 0.8 5.11073 0.8 6.66667C0.8 8.2226 1.41809 9.71481 2.51831 10.815C3.61852 11.9152 5.11073 12.5333 6.66667 12.5333Z" fill="#2A0B07" />
  </svg>
);

const AlertIcon = ({ severity }) => {
  const colors = {
    high: '#EF4444', // red
    medium: '#F59E0B', // yellow/amber
    low: '#10B981', // green
    info: '#3B82F6', // blue
  };
  const color = colors[severity] || colors.info;

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <path d="M12 8V13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill={color} />
    </svg>
  );
};

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

export default function TransitAlerts() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const resultsRef = useRef(null);

  // API query
  const [getPlanetPositions, { isLoading }] = useLazyGetPlanetPositionsQuery();

  // Form states
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('');
  const [coords, setCoords] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Results state
  const [showResults, setShowResults] = useState(false);
  const [moonSign, setMoonSign] = useState('');
  const [tableData, setTableData] = useState([]);
  const [alerts, setAlerts] = useState([]);



  // Location Autocomplete states
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
      console.error('Failed to fetch location suggestions', e);
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

    let finalCoords = coords;
    if (!finalCoords && pob) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pob)}&limit=1`);
        const data = await res.json();
        if (data && data[0]) {
          finalCoords = `${data[0].lat},${data[0].lon}`;
          setCoords(finalCoords);
        } else {
          setErrorMsg('Could not resolve location coordinates. Please try another place.');
          return;
        }
      } catch (err) {
        setErrorMsg('Failed to resolve coordinates. Please check your internet connection.');
        return;
      }
    }

    if (!finalCoords) {
      setErrorMsg('Please enter a valid birth place.');
      return;
    }

    try {
      const timezone = getBrowserTimezone();
      
      // 1. Fetch Natal Positions
      const natalDatetime = `${dob}T${tob}:00${timezone}`;
      const natalRes = await getPlanetPositions({
        datetime: natalDatetime,
        coordinates: finalCoords,
        ayanamsa: 1,
        la: 'en'
      }).unwrap();

      // 2. Fetch Transit Positions (Current Date & Time)
      const currentDatetime = new Date().toISOString().split('.')[0] + 'Z';
      const transitRes = await getPlanetPositions({
        datetime: currentDatetime,
        coordinates: finalCoords,
        ayanamsa: 1,
        la: 'en'
      }).unwrap();

      const natalList = natalRes?.data?.planet_position || natalRes?.planet_position || [];
      const transitList = transitRes?.data?.planet_position || transitRes?.planet_position || [];

      if (natalList.length === 0 || transitList.length === 0) {
        setErrorMsg('Invalid response from the astrology server.');
        return;
      }

      // 3. Find Natal Moon Sign
      const natalMoon = natalList.find(p => p.name.toLowerCase() === 'moon');
      const moonSignName = natalMoon?.rasi?.name || 'Aries';
      const moonSignIdx = getSignIndex(moonSignName);
      setMoonSign(moonSignName);

      // 4. Build Table Comparison Data
      const comparisonTable = [];
      const generatedAlerts = [];

      natalList.forEach(nPlanet => {
        const pName = nPlanet.name;
        const pSymbol = planetSymbols[pName.toLowerCase()];
        
        // Skip extra celestial coordinates if any
        if (!pSymbol) return;

        const tPlanet = transitList.find(tp => tp.name.toLowerCase() === pName.toLowerCase());
        
        const nSign = nPlanet.rasi?.name || '';
        const tSign = tPlanet?.rasi?.name || '';
        
        const nDegree = nPlanet.degree;
        const tDegree = tPlanet?.degree || 0;

        const nSignIdx = getSignIndex(nSign);
        const tSignIdx = getSignIndex(tSign);

        // House calculation relative to Natal Moon
        const houseNum = (tSignIdx - moonSignIdx + 12) % 12 + 1;
        
        const isRetro = tPlanet?.is_retrograde || false;

        comparisonTable.push({
          name: pName,
          symbol: pSymbol,
          natalSign: nSign,
          natalDegree: nDegree.toFixed(1),
          transitSign: tSign,
          transitDegree: tDegree.toFixed(1),
          house: houseNum,
          isRetro: isRetro
        });

        // 5. Astrological Alert Generation Rules
        const pNorm = pName.toLowerCase();

        // Saturn Alerts
        if (pNorm === 'saturn') {
          if ([12, 1, 2].includes(houseNum)) {
            generatedAlerts.push({
              planet: 'Saturn',
              title: `Sade Sati Active (${houseNum === 12 ? '1st Phase' : houseNum === 1 ? 'Peak Phase' : 'Final Phase'})`,
              description: `Saturn is transiting your ${houseNum === 12 ? '12th (expenses & contemplation)' : houseNum === 1 ? '1st (health & self)' : '2nd (finance & family)'} house relative to your Natal Moon. Plan long-term, reduce impulsive expenditures, and practice meditation.`,
              severity: 'medium',
              badge: 'Major Transit'
            });
          } else if (houseNum === 8) {
            generatedAlerts.push({
              planet: 'Saturn',
              title: 'Ashtama Shani Transit Active',
              description: 'Saturn is transiting your 8th house relative to your Natal Moon. Focus heavily on wellness, avoid speculative markets, and double-check business compliance.',
              severity: 'high',
              badge: 'Major Transit'
            });
          } else if (houseNum === 4) {
            generatedAlerts.push({
              planet: 'Saturn',
              title: 'Ardha Ashtama Shani Active',
              description: 'Saturn is transiting your 4th house. Domestically, show patience. Check property documentation and focus on building home comfort.',
              severity: 'medium',
              badge: 'Major Transit'
            });
          }
        }

        // Jupiter Gochara
        if (pNorm === 'jupiter') {
          if ([2, 5, 7, 9, 11].includes(houseNum)) {
            const supportFocus = {
              2: 'financial expansions and family support',
              5: 'creative intellect, romance, and children luck',
              7: 'successful partnerships, alliances, and marriage prospects',
              9: 'higher education, foreign travels, and spiritual blessings',
              11: 'multiple income gains, networking, and wish-fulfillment'
            }[houseNum];

            generatedAlerts.push({
              planet: 'Jupiter',
              title: `Auspicious Jupiter Transit (${houseNum}th House)`,
              description: `Jupiter is transiting your highly favorable ${houseNum}th house from Natal Moon. Excellent time for ${supportFocus}. Capitalize on this expansion window!`,
              severity: 'low',
              badge: 'Auspicious'
            });
          } else if ([6, 8, 12].includes(houseNum)) {
            generatedAlerts.push({
              planet: 'Jupiter',
              title: `Introspective Jupiter Transit (${houseNum}th House)`,
              description: `Jupiter is transiting your ${houseNum}th house. Maintain low risk profiles, manage health, and practice charity and spiritual service.`,
              severity: 'medium',
              badge: 'Minor Alert'
            });
          }
        }

        // Mars Returns & Conjunctions
        if (pNorm === 'mars' && nSign === tSign) {
          generatedAlerts.push({
            planet: 'Mars',
            title: 'Mars Return Active',
            description: `Transit Mars matches your Natal Mars sign (${tSign}). Anticipate a major boost in physical stamina and initiative. Direct this energy productively to avoid irritability.`,
            severity: 'medium',
            badge: 'Conjunction'
          });
        }

        // Sun / Solar Return
        if (pNorm === 'sun' && nSign === tSign) {
          generatedAlerts.push({
            planet: 'Sun',
            title: 'Solar Return (Vitality Month)',
            description: `The transiting Sun is in your birth sign (${tSign}). Your birth month brings strong vitality, leadership focus, and personal rebirth.`,
            severity: 'low',
            badge: 'Solar Return'
          });
        }

        // Mercury Retrograde
        if (pNorm === 'mercury' && isRetro) {
          generatedAlerts.push({
            planet: 'Mercury',
            title: 'Mercury Retrograde Active',
            description: `Transit Mercury is Retrograde in ${tSign}. Expect minor document delays or communication mix-ups. Review travel details and avoid signing major contracts today.`,
            severity: 'medium',
            badge: 'Retrograde'
          });
        }
      });

      // Fallback alert if no major transits trigger
      if (generatedAlerts.length === 0) {
        generatedAlerts.push({
          planet: 'General',
          title: 'Stable Sky Transit',
          description: 'No major disruptive transits are affecting your chart today. A good period for steady routine, planning, and consistent work.',
          severity: 'info',
          badge: 'General'
        });
      }

      setTableData(comparisonTable);
      setAlerts(generatedAlerts);
      setShowResults(true);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);

    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch positions. Check if birth data is correct.');
    }
  };



  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div className="w-full max-w-[430px] md:max-w-[850px] min-h-screen md:min-h-0 bg-[#FDFBF7] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10">
        
        <CustomHeader
          title="Transit Alerts"
          subtitle="Generate alerts based on planetary transits"
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
                  Generate Transit Alerts
                </CustomButton>
              </div>
            </form>
          ) : (
            <div ref={resultsRef} className="w-full flex flex-col gap-6">
              
              {/* Back to Form / Profile Header */}
              <div className="flex justify-between items-center w-full pb-2 border-b border-[#EFE9E5]">
                <div className="flex flex-col">
                  <h3 className="font-['Sofia_Sans'] font-bold text-[20px] text-[#2A0B07]">
                    Transit Comparison Feed
                  </h3>
                  <span className="text-[12px] text-[#8A8A8A] font-light">
                    {name} · Moon Sign: <strong className="text-[#8B6E4E]">{moonSign}</strong> · {pob.split(',')[0]}
                  </span>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="px-3.5 py-1.5 bg-[#FAF6F2] hover:bg-[#F2EAE2] text-[#585754] text-[12px] font-semibold rounded-lg border border-[#EFE9E5] transition-colors cursor-pointer"
                >
                  Change Profile
                </button>
              </div>

              {/* Transit Alerts Feed cards */}
              <div className="flex flex-col gap-4">
                <h4 className="font-['Sofia_Sans'] font-bold text-[16px] uppercase tracking-wide text-[#8B6E4E]">
                  Active Transit Alerts
                </h4>
                
                <div className="flex flex-col gap-3">
                  {alerts.map((alert, idx) => {
                    const borderColors = {
                      high: 'border-l-4 border-red-500',
                      medium: 'border-l-4 border-amber-500',
                      low: 'border-l-4 border-emerald-500',
                      info: 'border-l-4 border-blue-500',
                    };
                    const bgColors = {
                      high: 'bg-red-50/40',
                      medium: 'bg-amber-50/40',
                      low: 'bg-emerald-50/40',
                      info: 'bg-blue-50/40',
                    };
                    const badgeColors = {
                      high: 'bg-red-100 text-red-700',
                      medium: 'bg-amber-100 text-amber-700',
                      low: 'bg-emerald-100 text-emerald-700',
                      info: 'bg-blue-100 text-blue-700',
                    };

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col sm:flex-row gap-3.5 p-4 rounded-xl border border-[#EFE5D5] transition-all hover:shadow-sm ${borderColors[alert.severity]} ${bgColors[alert.severity]}`}
                      >
                        <div className="pt-0.5">
                          <AlertIcon severity={alert.severity} />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-['Poppins'] font-bold text-[15px] text-[#2A0B07]">
                              {alert.title}
                            </span>
                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColors[alert.severity]}`}>
                              {alert.badge}
                            </span>
                          </div>
                          <p className="text-[13px] leading-[1.6] text-[#5A4B42]">
                            {alert.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transit Map Table Summary */}
              <div className="flex flex-col gap-3">
                <h4 className="font-['Sofia_Sans'] font-bold text-[16px] uppercase tracking-wide text-[#8B6E4E]">
                  Planetary Transit Position Summary
                </h4>
                
                <div className="w-full overflow-x-auto border border-[#EFE5D5] rounded-xl bg-white shadow-sm">
                  <table className="min-w-full border-collapse text-left text-[13px] text-[#2A0B07]">
                    <thead className="bg-[#FAF6F2] border-b border-[#EFE5D5]">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-[#8B6E4E]">Planet</th>
                        <th className="px-4 py-3 font-semibold text-[#8B6E4E]">Natal Sign</th>
                        <th className="px-4 py-3 font-semibold text-[#8B6E4E]">Transit Sign</th>
                        <th className="px-4 py-3 font-semibold text-[#8B6E4E] text-center">Transit House</th>
                        <th className="px-4 py-3 font-semibold text-[#8B6E4E] text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5ECE3]">
                      {tableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#FCFAF8] transition-colors">
                          <td className="px-4 py-3 font-bold flex items-center gap-1.5">
                            <span className="text-[#8B6E4E] text-[15px]">{row.symbol}</span>
                            {row.name}
                          </td>
                          <td className="px-4 py-3 font-medium text-[#7A6B62]">
                            {row.natalSign} ({row.natalDegree}°)
                          </td>
                          <td className="px-4 py-3 font-medium text-[#2A0B07]">
                            {row.transitSign} ({row.transitDegree}°)
                          </td>
                          <td className="px-4 py-3 font-bold text-center text-[#8B6E4E]">
                            {row.house}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {row.isRetro ? (
                              <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">Rx</span>
                            ) : (
                              <span className="text-[#8A8A8A] text-[11px] font-medium">Direct</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>



            </div>
          )}
        </div>
      </div>
    </div>
  );
}

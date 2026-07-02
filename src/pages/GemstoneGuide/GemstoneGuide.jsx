import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import CustomHeader from '../../components/common/CustomHeader';
import CustomLabel from '../../components/common/CustomLabel';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { useGetGemstoneRecommendationsMutation } from '../../redux/api/toolsApi';

// Calendar SVG icon
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 14.5H3.5C2.39543 14.5 1.5 13.6046 1.5 12.5V4.5C1.5 3.39543 2.39543 2.5 3.5 2.5H12.5C13.6046 2.5 14.5 3.39543 14.5 4.5V12.5C14.5 13.6046 13.6046 14.5 12.5 14.5Z" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 1.5V3.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 1.5V3.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 5.5H14.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Clock SVG icon
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.06667 6.33533L9.66067 8.92933L9.09533 9.49533L6.26667 6.66667V2.66667H7.06667V6.33533ZM6.66667 13.3333C2.98467 13.3333 0 10.3487 0 6.66667C0 2.98467 2.98467 0 6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333ZM6.66667 12.5333C8.2226 12.5333 9.71481 11.9152 10.815 10.815C11.9152 9.71481 12.5333 8.2226 12.5333 6.66667C12.5333 5.11073 11.9152 3.61852 10.815 2.51831C9.71481 1.41809 8.2226 0.8 6.66667 0.8C5.11073 0.8 3.61852 1.41809 2.51831 2.51831C1.41809 3.61852 0.8 5.11073 0.8 6.66667C0.8 8.2226 1.41809 9.71481 2.51831 10.815C3.61852 11.9152 5.11073 12.5333 6.66667 12.5333Z" fill="#2A0B07" />
  </svg>
);

const planets = [
  { id: 'all', label: 'All' },
  { id: 'sun', label: 'Sun' },
  { id: 'moon', label: 'Moon' },
  { id: 'jupiter', label: 'Jupiter' },
  { id: 'mars', label: 'Mars' },
  { id: 'mercury', label: 'Mercury' },
  { id: 'venus', label: 'Venus' },
  { id: 'saturn', label: 'Saturn' },
  { id: 'rahu', label: 'Rahu' },
  { id: 'ketu', label: 'Ketu' }
];

const PLANET_METADATA = {
  'sun': { symbol: '☉', name: 'Sun (Surya)' },
  'moon': { symbol: '☽', name: 'Moon (Chandra)' },
  'mars': { symbol: '♂', name: 'Mars (Mangal)' },
  'mercury': { symbol: '☿', name: 'Mercury (Budh)' },
  'jupiter': { symbol: '♃', name: 'Jupiter (Guru)' },
  'venus': { symbol: '♀', name: 'Venus (Shukra)' },
  'saturn': { symbol: '♄', name: 'Saturn (Shani)' },
  'rahu': { symbol: '☊', name: 'Rahu' },
  'ketu': { symbol: '☋', name: 'Ketu' }
};

export default function GemstoneGuide() {
  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const dropdownRef = useRef(null);

  // Api Hook
  const [getGemstoneRecommendations, { isLoading }] = useGetGemstoneRecommendationsMutation();

  // States
  const [name, setName] = useState('Akhila M Menon');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('Kochi, India');
  const [coords, setCoords] = useState('9.9312,76.2673'); // Kochi default coords
  const [showResults, setShowResults] = useState(false);
  const [calculatedGemstones, setCalculatedGemstones] = useState([]);
  const [primaryGem, setPrimaryGem] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activePlanet, setActivePlanet] = useState('all');

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

    if (!coords) {
      setErrorMsg('Please select a birth place from the dropdown suggestions list.');
      return;
    }

    try {
      const timezone = getBrowserTimezone();
      const datetime = `${dob}T${tob}:00${timezone}`;
      const [latStr, lonStr] = coords.split(',');

      const res = await getGemstoneRecommendations({
        datetime,
        latitude: parseFloat(latStr),
        longitude: parseFloat(lonStr)
      }).unwrap();

      if (res?.data?.recommendations) {
        const mapped = res.data.recommendations.map((item) => {
          const planetKey = item.planet.toLowerCase();
          const meta = PLANET_METADATA[planetKey] || { symbol: '✦', name: item.planet };

          return {
            name: item.gemstone,
            planet: planetKey,
            planetLabel: meta.name,
            symbol: meta.symbol,
            description: `Alternative: ${item.alternativeGemstone}. Caution: ${item.caution || 'None'}. Mantra: "${item.mantraForEnergizing}"`,
            badges: [item.metal, item.dayToWear, item.weight, item.finger]
          };
        });

        setCalculatedGemstones(mapped);
        if (res.data.primaryGemstone) {
          setPrimaryGem(res.data.primaryGemstone);
        } else {
          setPrimaryGem(null);
        }
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
      setErrorMsg(err?.data?.message || 'Failed to fetch recommendations. Please check birth details and try again.');
    }
  };

  const filteredGemstones = activePlanet === 'all'
    ? calculatedGemstones
    : calculatedGemstones.filter(gem => gem.planet === activePlanet);

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div
        className="w-full max-w-[430px] md:max-w-[700px] lg:max-w-[850px] min-h-screen md:min-h-0 bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10"
      >
        {/* Custom Header using general project assets */}
        <CustomHeader
          title="Gemstone Guide"
          subtitle="Personalized Gemstone Recommendations"
          onBack={() => navigate('/tools')}
        />

        <div className="px-5 md:px-8 flex flex-col gap-6 w-full box-border mt-4">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-[13px] font-medium p-3 rounded-xl border border-red-200 w-full">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {/* Name input */}
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

            {/* Submit Button */}
            <div className="mt-2 w-full flex justify-center">
              <CustomButton
                type="submit"
                variant="primary"
                loading={isLoading}
                className="w-full"
              >
                Get Recommendations
              </CustomButton>
            </div>
          </form>

          {/* Animated Result Section */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6 w-full box-border mt-4"
              >
                <div className="w-full border-t border-[#2A0B07]/10">
                  <h2 className="text-[20px] font-[Sofia_Sans] font-semibold text-[#2A0B07] mb-4 text-center">
                    {name}'s Gemstone Guide
                  </h2>
                </div>

                {/* Banner: Primary Recommendation */}
                {primaryGem && (
                  <div className="flex flex-row items-center p-3.5 gap-[15px] w-full max-w-[410px] bg-[#FDF2DC] border-[0.6px] border-[#8C764B]/80 rounded-[5px] box-border mx-auto">
                    <div
                      className="w-[33px] h-[33px] bg-[#CF9914]/10 flex-shrink-0 rounded-[4px] flex items-center justify-center text-[20px]"
                      style={{ fontFamily: 'sans-serif' }}
                    >
                      {PLANET_METADATA[primaryGem.planet.toLowerCase()]?.symbol || '✦'}
                    </div>

                    <div className="flex flex-col items-start min-w-0">
                      <span className="font-['Poppins'] font-medium text-[14px] leading-tight text-[#CF9914] flex items-center gap-1.5">
                        Primary Recommendation: {primaryGem.gemstone}
                      </span>
                      <span className="font-['Poppins'] font-normal text-[10.3px] text-[#8A8A8A] mt-1">
                        Strengthens {primaryGem.planet} · Wear on {primaryGem.dayToWear} ({primaryGem.finger})
                      </span>
                    </div>
                  </div>
                )}

                {/* Filter Pills Container */}
                <div className="flex flex-row items-center gap-[10px] w-full overflow-x-auto scrollbar-none pb-2 snap-x snap-mandatory mt-2">
                  {planets.map(planet => {
                    const isSelected = activePlanet === planet.id;
                    return (
                      <button
                        key={planet.id}
                        onClick={() => setActivePlanet(planet.id)}
                        className={`flex flex-row justify-center items-center h-[27px] px-[8.6px] py-[4.3px] gap-[8.57px] rounded-[37px] font-['Poppins'] font-semibold text-[10.3px] transition-all duration-200 cursor-pointer shrink-0 snap-start
                          ${isSelected
                            ? 'bg-[#792D30] border border-white text-white shadow-[0_2px_6px_rgba(121,45,48,0.2)]'
                            : 'bg-transparent border border-[#2A0B07] text-[#2A0B07] hover:bg-[#2A0B07]/5'}`}
                      >
                        {planet.label}
                      </button>
                    );
                  })}
                </div>

                {/* Cards List Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  {filteredGemstones.map((gem, idx) => (
                    <div
                      key={idx}
                      className="w-full flex flex-col p-6 rounded-[18px] border border-[#2A0B07]/10 bg-[#FAF6F0] shadow-[0px_4px_12px_rgba(42,11,7,0.01)] hover:shadow-[0px_6px_20px_rgba(42,11,7,0.04)] transition-all duration-300 gap-4"
                    >
                      {/* Header Row */}
                      <div className="flex flex-col items-start w-full">
                        <h3 className="text-[17px] sm:text-[18px] font-bold text-[#2A0B07] leading-tight m-0">
                          {gem.name}
                        </h3>
                        <span className="text-[13px] font-light text-[#2A0B07]/80 mt-1.5 flex items-center gap-1.5 font-['Poppins']">
                          <span className="text-[15px] font-normal leading-none select-none" style={{ fontFamily: 'sans-serif' }}>{gem.symbol}</span>
                          <span>{gem.planetLabel}</span>
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#2A0B07] font-normal m-0 pr-2">
                        {gem.description}
                      </p>

                      {/* Badges Container */}
                      <div className="flex flex-wrap gap-2.5 mt-1.5">
                        {gem.badges.map((badge, bIdx) => (
                          <div
                            key={bIdx}
                            className="flex flex-row justify-center items-center py-[5px] px-[12px] sm:px-[14px] bg-[#FDF2DC] rounded-full text-[#613E16] font-semibold text-[11px] sm:text-[12px] shadow-[0px_1px_2px_rgba(0,0,0,0.01)]"
                          >
                            {badge}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {filteredGemstones.length === 0 && (
                    <div className="col-span-full py-10 text-center text-[#2A0B07]/50 font-medium">
                      No recommended gemstones found for this filter.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

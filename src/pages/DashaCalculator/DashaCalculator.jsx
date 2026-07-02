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

const PLANET_METADATA = {
  'sun': { symbol: '☀️', name: 'Sun (Surya)' },
  'moon': { symbol: '🌙', name: 'Moon (Chandra)' },
  'mars': { symbol: '♂', name: 'Mars (Mangal)' },
  'mercury': { symbol: '☿', name: 'Mercury (Budha)' },
  'jupiter': { symbol: '♃', name: 'Jupiter (Guru)' },
  'venus': { symbol: '♀', name: 'Venus (Shukra)' },
  'saturn': { symbol: '♄', name: 'Saturn (Shani)' },
  'rahu': { symbol: '☊', name: 'Rahu' },
  'ketu': { symbol: '☋', name: 'Ketu' }
};

const INSIGHTS = {
  sun: 'Sun Dasha brings career growth, leadership opportunities, recognition, and vitality. Focus on authority, confidence, and self-expression.',
  moon: 'Moon Dasha brings emotional growth, family focus, mental transformation, and heightened intuition. Travel and change are likely.',
  mars: 'Mars Dasha brings high energy, courage, ambition, and determination. Focus on physical activities, projects, but watch out for impulsiveness.',
  mercury: 'Mercury Dasha focuses on intellect, communication, business success, learning, and networking. Travel and trade opportunities may increase.',
  jupiter: 'Jupiter Dasha brings wisdom, expansion, prosperity, and spiritual growth. An excellent period for learning, mentorship, and family happiness.',
  venus: 'Venus Dasha brings luxury, creative success, romance, marriage, and artistic pursuits. Focus on relationship harmony and physical comforts.',
  saturn: 'Saturn Dasha demands discipline, hard work, patience, and structural reorganization. Brings stability and long-term gains through perseverance.',
  rahu: 'Rahu Dasha brings ambitious desires, material expansion, sudden changes, and unconventional pursuits. Watch out for illusion and stress.',
  ketu: 'Ketu Dasha leads to spiritual detachment, introspection, philosophical insights, and search for deeper truth. Good for spiritual retreats.'
};

export default function DashaCalculator() {
  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const dropdownRef = useRef(null);

  // Api Hook
  const [getDashaPeriods, { isLoading }] = useLazyGetDashaPeriodsQuery();

  // States
  const [name, setName] = useState('Akhila M Menon');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('Kochi, India');
  const [coords, setCoords] = useState('9.9312,76.2673'); // Kochi default coords
  const [showResults, setShowResults] = useState(false);
  const [calculatedDashas, setCalculatedDashas] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

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

  const formatYear = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.getFullYear();
  };

  const getDurationYears = (startStr, endStr) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = Math.round(diffDays / 365.25);
    return `${diffYears} years`;
  };

  const isPeriodActive = (startStr, endStr) => {
    const now = new Date();
    const start = new Date(startStr);
    const end = new Date(endStr);
    return now >= start && now <= end;
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
      
      const res = await getDashaPeriods({
        datetime,
        coordinates: coords,
        ayanamsa: 1,
        la: 'en'
      }).unwrap();

      if (res?.data?.dasha_periods) {
        const birthDate = new Date(datetime);

        const mapped = res.data.dasha_periods.map((period) => {
          const planetKey = period.name.toLowerCase();
          const meta = PLANET_METADATA[planetKey] || { symbol: '✦', name: period.name };
          
          let startDate = new Date(period.start);
          let startStr = period.start;
          let isAdjustedForBirth = false;

          if (startDate < birthDate) {
            startDate = birthDate;
            startStr = datetime;
            isAdjustedForBirth = true;
          }

          const rangeStr = `${formatYear(startStr)} – ${formatYear(period.end)}`;
          
          let durationStr = '';
          if (isAdjustedForBirth && res.data.dasha_balance?.description) {
            durationStr = res.data.dasha_balance.description;
          } else {
            durationStr = getDurationYears(startStr, period.end);
          }

          const active = isPeriodActive(startStr, period.end);
          
          let statusStr = 'Next';
          if (active) statusStr = 'Active';
          else if (new Date(period.end) < new Date()) statusStr = 'Past';

          return {
            planet: meta.name,
            planetKey,
            label: `${meta.name} Mahadasha`,
            symbol: meta.symbol,
            range: rangeStr,
            duration: durationStr,
            status: statusStr,
            isActive: active,
            start: startStr,
            end: period.end
          };
        });

        setCalculatedDashas(mapped);
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
      setErrorMsg(err?.data?.message || 'Failed to calculate Dasha. Please check birth details and try again.');
    }
  };

  const handleShare = () => {
    const active = calculatedDashas.find(d => d.isActive);
    const shareText = `🌟 Vimshottari Dasha Profile for ${name} 🌟\n• Currently in: ${active ? active.label : ''} (${active ? active.range : ''})`;
    
    if (navigator.share) {
      navigator.share({
        title: `${name}'s Dasha Profile`,
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Dasha details copied to clipboard!');
    }
  };

  const activeDasha = calculatedDashas.find(d => d.isActive);
  const activeInsight = activeDasha ? INSIGHTS[activeDasha.planetKey] : '';

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div 
        className="w-full max-w-[430px] md:max-w-[700px] lg:max-w-[850px] min-h-screen md:min-h-0 bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10"
      >
        {/* Custom Header using general project assets */}
        <CustomHeader
          title="Dasha Calculator"
          subtitle="Vimshottari Mahadasha Periods"
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
                Calculate Dasha
              </CustomButton>
            </div>
          </form>

          {/* Animated Result Section */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-center gap-[15px] w-full border-t border-[#2A0B07]/5 pt-6 box-border overflow-hidden"
              >
                
                {/* Header Row: Title & Share Button */}
                <div className="flex flex-row justify-between items-center w-full h-[47px] box-border px-1.5">
                  <h3 className="font-['Sofia_Sans'] font-bold text-[20px] leading-[20px] text-[#2A0B07] text-left m-0 truncate pr-2">
                    {name ? `${name}'s Dasha Timeline` : "Akhila's Dasha Timeline"}
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

                {/* Banner: Currently In */}
                {activeDasha && (
                  <div className="flex flex-row items-center p-3.5 gap-[15px] w-full max-w-[410px] bg-[#FDF2DC] border-[0.6px] border-[#8C764B]/80 rounded-[5px] box-border mx-auto">
                    <div 
                      className="w-[33px] h-[33px] bg-[#CF9914]/10 flex-shrink-0 rounded-[4px] flex items-center justify-center text-[20px]"
                      style={{ fontFamily: 'sans-serif' }}
                    >
                      {activeDasha.symbol}
                    </div>
                    
                    <div className="flex flex-col items-start min-w-0">
                      <span className="font-['Poppins'] font-medium text-[14px] leading-tight text-[#EBB863] flex items-center gap-1.5">
                        Currently in: {activeDasha.label}
                      </span>
                      <span className="font-['Poppins'] font-normal text-[10.3px] text-[#8A8A8A] mt-1">
                        {activeDasha.range} · {activeDasha.duration}
                      </span>
                    </div>
                  </div>
                )}

                {/* Vimshottari Mahadashas timeline stack */}
                <div className="flex flex-col gap-3.5 w-full mt-2 max-w-[410px] mx-auto">
                  {calculatedDashas.map((dasha, idx) => {
                    if (dasha.isActive) {
                      return (
                        <div 
                          key={idx}
                          className="w-full flex flex-row items-center justify-between p-[10px_12px] bg-[#F9F8F6] border-2 border-[#807060] rounded-[12px] box-border gap-3 h-[84px]"
                        >
                          {/* Left side: custom radio and text details */}
                          <div className="flex flex-row items-center gap-4 min-w-0 flex-grow">
                            {/* Custom active radio indicator */}
                            <div className="w-[15px] h-[15px] bg-white border border-[#8B443B] rounded-full flex items-center justify-center flex-shrink-0">
                              <div className="w-[12px] h-[12px] bg-[#561B1C] rounded-full" />
                            </div>

                            {/* Text details and progress bar */}
                            <div className="flex flex-col items-start min-w-0 flex-grow pr-4">
                              <span className="font-['Poppins'] font-medium text-[14px] leading-[20px] text-[#2A0B07] flex items-center gap-1.5 truncate">
                                <span className="text-[15px] select-none leading-none" style={{ fontFamily: 'sans-serif' }}>{dasha.symbol}</span>
                                <span>{dasha.planet}</span>
                              </span>
                              <span className="font-['Poppins'] font-normal text-[10.3px] leading-[15px] text-[#8A8A8A] mt-0.5">
                                {dasha.range} · {dasha.duration}
                              </span>
                              {/* Horizontal Progress Bar */}
                              <div className="w-full max-w-[327px] h-[3px] bg-white rounded-[46px] mt-2 overflow-hidden">
                                <div className="w-[45%] h-full bg-[#F3CA06] rounded-full" />
                              </div>
                            </div>
                          </div>

                          {/* Right side: Active Green Badge */}
                          <div className="box-border flex flex-row justify-center items-center py-[4.3px] px-[8.6px] bg-[#E2F8E2] border border-[#1D8A57] rounded-[37px] h-[27px] w-[54px] flex-shrink-0">
                            <span className="font-['Poppins'] font-normal text-[10.3px] leading-[15px] text-[#1D8A57]">
                              Active
                            </span>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div 
                          key={idx}
                          className="w-full flex flex-row items-center justify-between p-[10px_12px] bg-[#F5ECE3] border border-[#B9A795] rounded-[12px] box-border gap-3 h-[84px]"
                        >
                          {/* Left side: custom empty radio and text details */}
                          <div className="flex flex-row items-center gap-[19px] min-w-0">
                            {/* Custom inactive radio indicator */}
                            <div className="w-[12px] h-[12px] bg-white border border-[#8B443B] rounded-full flex-shrink-0" />

                            {/* Text details */}
                            <div className="flex flex-col items-start min-w-0">
                              <span className="font-['Poppins'] font-medium text-[14px] leading-[20px] text-[#2A0B07] flex items-center gap-1.5">
                                <span className="text-[15px] select-none leading-none" style={{ fontFamily: 'sans-serif' }}>{dasha.symbol}</span>
                                <span>{dasha.planet}</span>
                              </span>
                              <span className="font-['Poppins'] font-normal text-[10.3px] leading-[15px] text-[#8A8A8A] mt-0.5">
                                {dasha.range} · {dasha.duration}
                              </span>
                            </div>
                          </div>

                          {/* Right side: Next / Past Label */}
                          <span className={`font-['Poppins'] font-semibold text-[10.3px] leading-[15px] mr-2 flex-shrink-0 ${
                            dasha.status === 'Past' ? 'text-[#8A8A8A]' : 'text-[#1D8A57]'
                          }`}>
                            {dasha.status}
                          </span>
                        </div>
                      );
                    }
                  })}
                </div>

                {/* Dasha Insight box with left accent border */}
                {activeDasha && activeInsight && (
                  <div className="box-border flex flex-col items-start pl-[6px] gap-[11.8px] w-full max-w-[410px] bg-[#2A0B07] shadow-[0px_2px_6px_rgba(0,0,0,0.25)] rounded-[9.5px] mt-4 overflow-hidden mx-auto min-h-[90px]">
                    <div className="box-border flex flex-col items-start p-[10px_12px_12px_18px] gap-[6px] w-full bg-[#F8F4F3] rounded-r-[9.5px] h-full justify-center">
                      <span className="font-['Sofia_Sans'] font-semibold text-[14.2px] leading-[19px] text-[#2A0B07] text-left w-full">
                        {activeDasha.planet} Dasha Insight
                      </span>
                      <p className="font-['Poppins'] font-normal text-[11.8px] leading-[19px] text-[#2A0B07] m-0 text-left">
                        {activeInsight}
                      </p>
                    </div>
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

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import CustomHeader from '../../components/common/CustomHeader';
import CustomLabel from '../../components/common/CustomLabel';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import {
  useGetMantraRemediesMutation,
  useGetCharityRemediesMutation,
  useGetFastingRemediesMutation
} from '../../redux/api/toolsApi';

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

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'sun', label: 'Sun' },
  { id: 'moon', label: 'Moon' },
  { id: 'mars', label: 'Mars' },
  { id: 'jupiter', label: 'Jupiter' },
  { id: 'mercury', label: 'Mercury' },
  { id: 'venus', label: 'Venus' },
  { id: 'saturn', label: 'Saturn' },
  { id: 'rahu', label: 'Rahu' },
  { id: 'ketu', label: 'Ketu' }
];

const remediesData = [
  {
    id: 'sun',
    planetName: 'Sun (Surya)',
    title: 'Sun (Surya) Remedies',
    subtitle: 'For weak Sun, low confidence, govt issues',
    body: 'Offer water to the rising Sun daily. Wear Ruby on Sunday. Donate wheat and jaggery on Sundays.',
    mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namaha',
    mantraInstruction: '108 times at sunrise',
    personalized: false
  },
  {
    id: 'moon',
    planetName: 'Moon (Chandra)',
    title: 'Moon (Chandra) Remedies',
    subtitle: 'For mental peace, emotional stability',
    body: 'Wear Pearl in silver on Monday. Offer milk to Shiva lingam. Keep silver items at home. Avoid anger on Mondays.',
    mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namaha',
    mantraInstruction: '108 times on Monday',
    personalized: false
  },
  {
    id: 'mars',
    planetName: 'Mars (Mangal)',
    title: 'Mars (Mangal) Remedies',
    subtitle: 'For low energy, anger issues, debt, marriage delays',
    body: 'Chant Hanuman Chalisa daily. Fast on Tuesdays. Wear Red Coral after consultation. Donate red lentils (Masoor dal) on Tuesdays.',
    mantra: 'Om Kram Kreem Kroum Sah Bhaumaya Namaha',
    mantraInstruction: '108 times on Tuesday',
    personalized: false
  },
  {
    id: 'mercury',
    planetName: 'Mercury (Budh)',
    title: 'Mercury (Budh) Remedies',
    subtitle: 'For communication, business, intelligence, education',
    body: 'Feed green grass to cows on Wednesdays. Wear Emerald on little finger. Donate green clothes or moong dal.',
    mantra: 'Om Bram Breem Broum Sah Budhaya Namaha',
    mantraInstruction: '108 times on Wednesday',
    personalized: false
  },
  {
    id: 'jupiter',
    planetName: 'Jupiter (Guru)',
    title: 'Jupiter (Guru) Remedies',
    subtitle: 'For wisdom, marriage, wealth, good fortune',
    body: 'Apply yellow sandalwood paste on forehead. Fast on Thursdays. Respect elders and teachers. Donate yellow items like chana dal and bananas.',
    mantra: 'Om Gram Greem Groum Sah Gurave Namaha',
    mantraInstruction: '108 times on Thursday morning',
    personalized: false
  },
  {
    id: 'venus',
    planetName: 'Venus (Shukra)',
    title: 'Venus (Shukra) Remedies',
    subtitle: 'For luxury, relationship issues, creativity',
    body: 'Donate white items like sugar, rice, or milk on Fridays. Wear clean, white clothes. Respect women and maintain hygiene.',
    mantra: 'Om Dram Dreem Droum Sah Shukraya Namaha',
    mantraInstruction: '108 times on Friday sunrise',
    personalized: false
  },
  {
    id: 'saturn',
    planetName: 'Saturn (Shani)',
    title: 'Saturn (Shani) Remedies',
    subtitle: 'For sade sati, career delays, discipline',
    body: 'Light sesame oil lamp on Saturday. Donate black sesame, iron, or mustard oil. Wear Blue Sapphire after testing.',
    mantra: 'Om Praam Preem Praum Sah Shanaishcharaya Namaha',
    mantraInstruction: '23 times on Saturday',
    personalized: false
  },
  {
    id: 'rahu',
    planetName: 'Rahu',
    title: 'Rahu Remedies',
    subtitle: 'For confusion, addiction, foreign travels',
    body: 'Worship Durga Mata. Donate multi-colored cloth on Saturdays. Avoid meat and alcohol during Rahu periods.',
    mantra: 'Om Bhram Bhrim Bhraum Sah Rahave Namaha',
    mantraInstruction: '18 times daily',
    personalized: false
  },
  {
    id: 'ketu',
    planetName: 'Ketu',
    title: 'Ketu Remedies',
    subtitle: 'For spiritual growth, health issues, detachment',
    body: 'Feed stray dogs daily. Worship Lord Ganesha. Donate sesame seeds or blankets to the needy.',
    mantra: 'Om Stram Streem Stroum Sah Ketave Namaha',
    mantraInstruction: '108 times daily at night',
    personalized: false
  }
];

export default function RemedyGuide() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // Input states
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('');
  const [coords, setCoords] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Results state
  const [remediesList, setRemediesList] = useState(remediesData);
  const [hasCalculated, setHasCalculated] = useState(false);

  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  const resultsRef = useRef(null);

  // Mutations
  const [getMantraRemedies, { isLoading: isMantraLoading }] = useGetMantraRemediesMutation();
  const [getCharityRemedies, { isLoading: isCharityLoading }] = useGetCharityRemediesMutation();
  const [getFastingRemedies, { isLoading: isFastingLoading }] = useGetFastingRemediesMutation();

  const isCalculating = isMantraLoading || isCharityLoading || isFastingLoading;

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
      setErrorMsg('Please select a birth place from the dropdown suggestions list.');
      return;
    }

    try {
      const timezone = getBrowserTimezone();
      const datetime = `${dob}T${tob}:00${timezone}`;
      const [latStr, lonStr] = coords.split(',');

      const payload = {
        datetime,
        latitude: parseFloat(latStr),
        longitude: parseFloat(lonStr)
      };

      const [resMantra, resCharity, resFasting] = await Promise.all([
        getMantraRemedies(payload).unwrap(),
        getCharityRemedies(payload).unwrap(),
        getFastingRemedies(payload).unwrap()
      ]);

      if (resMantra?.success && resCharity?.success && resFasting?.success) {
        // Map planetary responses
        const mergedList = remediesData.map((fallbackItem) => {
          const key = fallbackItem.id; // e.g. 'moon'

          const mantraRec = resMantra.data.recommendations?.find(
            (r) => r.planet.toLowerCase() === key
          );
          const charityRec = resCharity.data.recommendations?.find(
            (r) => r.planet.toLowerCase() === key
          );
          const fastingRec = resFasting.data.recommendations?.find(
            (r) => r.planet.toLowerCase() === key
          );

          // If there are ANY dynamic recommendations for this planet
          if (mantraRec || charityRec || fastingRec) {
            const bodyParts = [];
            if (charityRec) {
              const itemsStr = charityRec.items?.join(', ') || '';
              bodyParts.push(
                `Charity: Donate ${itemsStr} to ${charityRec.donateToWhom || 'the needy'} on ${charityRec.bestDay || 'designated day'}s during ${charityRec.bestTime || 'best time'} (${charityRec.frequency || 'weekly'}).`
              );
            }
            if (fastingRec) {
              bodyParts.push(
                `Fasting: Fast on ${fastingRec.day} (${fastingRec.fastingType}). Break fast with ${fastingRec.breakFastWith} (Benefits: ${fastingRec.benefits}; Duration: ${fastingRec.duration}).`
              );
            }

            const mergedBody = bodyParts.join(' ');

            return {
              id: key,
              planetName: fallbackItem.planetName,
              title: `${fallbackItem.planetName} Remedies`,
              subtitle: `Deity: ${mantraRec?.deity || fastingRec?.deity || 'Vedic Deities'} · Fasting: ${fastingRec?.day || 'N/A'}`,
              body: mergedBody || fallbackItem.body,
              mantra: mantraRec?.beejMantra || mantraRec?.mantra || fallbackItem.mantra,
              mantraInstruction: mantraRec
                ? `Chant ${mantraRec.japaCount || 108} times; Best time: ${mantraRec.bestTime}; Direction: ${mantraRec.direction}`
                : fallbackItem.mantraInstruction,
              personalized: true
            };
          }

          // Otherwise fallback to static remedy but mark as not personalized
          return {
            ...fallbackItem,
            personalized: false
          };
        });

        setRemediesList(mergedList);
        setHasCalculated(true);

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setErrorMsg('Failed to fetch complete remedies data.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.data?.message || 'Failed to calculate personalized remedies. Please check your birth details and try again.');
    }
  };

  const filteredRemedies = activeTab === 'all'
    ? remediesList
    : remediesList.filter(item => item.id === activeTab);

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div
        className="w-full max-w-[430px] md:max-w-[700px] lg:max-w-[850px] min-h-screen md:min-h-0 bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10"
      >
        {/* Custom Header matching Remedy Library Header */}
        <CustomHeader
          title="Remedy Library"
          subtitle="Mantras, Rituals & Remedies by Planet"
          onBack={() => navigate('/tools')}
        />

        <div className="px-5 md:px-8 flex flex-col gap-6 w-full box-border mt-4">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-[13px] font-medium p-3 rounded-xl border border-red-200 w-full">
              {errorMsg}
            </div>
          )}

          {/* Birth Input Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full bg-[#FAF7F0] p-4 md:p-6 rounded-2xl border border-[#ECE5DB]">
            <p className="text-[13px] text-[#2A0B07]/70 font-medium m-0">
              Enter birth details to generate personalized Vedic remedies (Mantra, Charity, and Fasting) calculated dynamically.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Name input */}
              <div className="flex flex-col items-start gap-2.5 w-full">
                <CustomLabel title="Name" />
                <CustomInput
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  required
                />
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
                    placeholder="Search birth city"
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

            <div className="mt-2 w-full">
              <CustomButton
                type="submit"
                disabled={isCalculating}
                className="w-full h-[48px] bg-[#792D30] text-white hover:bg-[#622326] transition-all rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2"
              >
                {isCalculating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </>
                ) : (
                  <span>Calculate Personalized Remedies</span>
                )}
              </CustomButton>
            </div>
          </form>

          {/* Horizontal scrollable Filter Pills */}
          <div ref={resultsRef} className="flex flex-row items-center gap-[10px] w-full overflow-x-auto scrollbar-none pb-2 snap-x snap-mandatory mt-2">
            {filterTabs.map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-row justify-center items-center h-[27px] min-w-[54px] px-[12px] py-[4.3px] rounded-[37px] font-['Poppins'] font-semibold text-[11px] transition-all duration-200 cursor-pointer shrink-0 snap-start
                    ${isSelected
                      ? 'bg-[#792D30] border border-white text-white shadow-[0_2px_6px_rgba(121,45,48,0.2)]'
                      : 'bg-transparent border border-[#2A0B07] text-[#2A0B07] hover:bg-[#2A0B07]/5'}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Personalized Banner */}
          {hasCalculated && (
            <div className="bg-[#FAF3EC] border border-[#792D30]/20 rounded-xl p-3 text-[#792D30] text-[13px] font-semibold flex items-center gap-2">
              <span>✨</span>
              <span>Personalized remedies calculated successfully based on birth chart placements.</span>
            </div>
          )}

          {/* Remedy Cards Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {filteredRemedies.map((remedy, idx) => (
              <div
                key={idx}
                className={`w-full flex flex-col pt-[12px] pr-[14px] pb-[14px] pl-[18px] gap-[10.65px] rounded-[12px] border bg-[#F5ECE3] shadow-[0px_4px_12px_rgba(42,11,7,0.01)] hover:shadow-[0px_6px_20px_rgba(42,11,7,0.04)] transition-all duration-300
                  ${remedy.personalized
                    ? 'border-[#792D30]/40 ring-2 ring-[#792D30]/5 bg-[#FAF4ED]'
                    : 'border-[rgba(11,11,11,0.2)]'
                  }`}
              >
                {/* Header Row (Frame 590) */}
                <div className="flex flex-row justify-between items-start w-full">
                  <div className="flex flex-col items-start p-0">
                    <h3 className="text-[14.2px] font-semibold text-[#2A0B07] leading-[19px] m-0 font-['Sofia_Sans'] flex items-center">
                      {remedy.title}
                    </h3>
                    <span className="text-[10px] font-light text-[#2A0B07]/75 leading-[19px] m-0 font-['Poppins'] flex items-center">
                      {remedy.subtitle}
                    </span>
                  </div>
                  {remedy.personalized ? (
                    <span className="bg-[#792D30]/10 text-[#792D30] text-[9.5px] font-semibold px-2 py-0.5 rounded-full font-['Poppins'] border border-[#792D30]/20 flex items-center gap-0.5">
                      ✨ Personalized
                    </span>
                  ) : hasCalculated && (
                    <span className="bg-amber-100/60 text-amber-800 text-[9px] font-medium px-2 py-0.5 rounded-full font-['Poppins'] border border-amber-200 flex items-center">
                      General Ref
                    </span>
                  )}
                </div>

                {/* Body Text */}
                <p className="text-[11.8px] leading-[19px] text-[#2A0B07] font-normal m-0 font-['Poppins'] flex items-center">
                  {remedy.body}
                </p>

                {/* Mantra Block (Frame 603 / Frame 601) */}
                <div className="w-full flex flex-col items-end p-0 pl-[3px] bg-[#7B2D2D] rounded-[12px] mt-auto">
                  <div className="w-full min-h-[47px] flex items-center px-[9px] py-2 gap-[7px] bg-[#EFE2D9] rounded-[12px]">
                    <p className="text-[11.8px] leading-[19px] text-[#4F1819] font-medium italic m-0 font-['Poppins'] flex items-center">
                      Mantra: &ldquo;{remedy.mantra}&rdquo; &mdash; {remedy.mantraInstruction}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {filteredRemedies.length === 0 && (
              <div className="col-span-full py-10 text-center text-black/50 font-medium">
                No remedies found for this filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

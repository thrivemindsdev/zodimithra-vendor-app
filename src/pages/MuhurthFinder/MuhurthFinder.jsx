import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomHeader from '../../components/common/CustomHeader';
import CustomButton from '../../components/common/CustomButton';
import CustomHeading from '../../components/common/CustomHeading';
import CustomLabel from '../../components/common/CustomLabel';
import CustomInput from '../../components/common/CustomInput';
import { useGenerateShubhDinMutation } from '../../redux/api/toolsApi';

// Custom icons
const CalendarIcon = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.75 13.75H6.08333C3.56933 13.75 2.312 13.75 1.53133 12.9687C0.750667 12.1873 0.75 10.9307 0.75 8.41667V7.08333C0.75 4.56933 0.75 3.312 1.53133 2.53133C2.31267 1.75067 3.56933 1.75 6.08333 1.75H8.75C11.264 1.75 12.5213 1.75 13.302 2.53133C14.0827 3.31267 14.0833 4.56933 14.0833 7.08333V8.41667C14.0833 10.9307 14.0833 12.188 13.302 12.9687C12.8667 13.4047 12.2833 13.5973 11.4167 13.682M4.08333 1.75V0.75M10.75 1.75V0.75M13.75 5.08333H6.58333M0.75 5.08333H3.33333" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11.417 10.4167C11.417 10.5935 11.3468 10.7631 11.2217 10.8881C11.0967 11.0131 10.9271 11.0833 10.7503 11.0833C10.5735 11.0833 10.4039 11.0131 10.2789 10.8881C10.1539 10.7631 10.0837 10.5935 10.0837 10.4167C10.0837 10.2399 10.1539 10.0703 10.2789 9.94527C10.4039 9.82025 10.5735 9.75001 10.7503 9.75001C10.9271 9.75001 11.0967 9.82025 11.2217 9.94527C11.3468 10.0703 11.417 10.2399 11.417 10.4167ZM11.417 7.75001C11.417 7.92682 11.3468 8.09639 11.2217 8.22141C11.0967 8.34644 10.9271 8.41668 10.7503 8.41668C10.5735 8.41668 10.4039 8.34644 10.2789 8.22141C10.1539 8.09639 10.0837 7.92682 10.0837 7.75001C10.0837 7.5732 10.1539 7.40363 10.2789 7.27861C10.4039 7.15358 10.5735 7.08334 10.7503 7.08334C10.9271 7.08334 11.0967 7.15358 11.2217 7.27861C11.3468 7.40363 11.417 7.5732 11.417 7.75001ZM8.08366 10.4167C8.08366 10.5935 8.01342 10.7631 7.8884 10.8881C7.76337 11.0131 7.5938 11.0833 7.41699 11.0833C7.24018 11.0833 7.07061 11.0131 6.94559 10.8881C6.82056 10.7631 6.75033 10.5935 6.75033 10.4167C6.75033 10.2399 6.82056 10.0703 6.94559 9.94527C7.07061 9.82025 7.24018 9.75001 7.41699 9.75001C7.5938 9.75001 7.76337 9.82025 7.8884 9.94527C8.01342 10.0703 8.08366 10.2399 8.08366 10.4167ZM8.08366 7.75001C8.08366 7.92682 8.01342 8.09639 7.8884 8.22141C7.76337 8.34644 7.5938 8.41668 7.41699 8.41668C7.24018 8.41668 7.07061 8.34644 6.94559 8.22141C6.82056 8.09639 6.75033 7.92682 6.75033 7.75001C6.75033 7.5732 6.82056 7.40363 6.94559 7.27861C7.07061 7.15358 7.24018 7.08334 7.41699 7.08334C7.5938 7.08334 7.76337 7.15358 7.8884 7.27861C8.01342 7.40363 8.08366 7.5732 8.08366 7.75001ZM4.75033 10.4167C4.75033 10.5935 4.68009 10.7631 4.55506 10.8881C4.43004 11.0131 4.26047 11.0833 4.08366 11.0833C3.90685 11.0833 3.73728 11.0131 3.61225 10.8881C3.48723 10.7631 3.41699 10.5935 3.41699 10.4167C3.41699 10.2399 3.48723 10.0703 3.61225 9.94527C3.73728 9.82025 3.90685 9.75001 4.08366 9.75001C4.26047 9.75001 4.43004 9.82025 4.55506 9.94527C4.68009 10.0703 4.75033 10.2399 4.75033 10.4167ZM4.75033 7.75001C4.75033 7.92682 4.68009 8.09639 4.55506 8.22141C4.43004 8.34644 4.26047 8.41668 4.08366 8.41668C3.90685 8.41668 3.73728 8.34644 3.61225 8.22141C3.48723 8.09639 3.41699 7.92682 3.41699 7.75001C3.41699 7.5732 3.48723 7.40363 3.61225 7.27861C3.73728 7.15358 3.90685 7.08334 4.08366 7.08334C4.26047 7.08334 4.43004 7.15358 4.55506 7.27861C4.68009 7.40363 4.75033 7.5732 4.75033 7.75001Z" fill="#2A0B07" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-200">
        <path d="M1 1.5L6 6.5L11 1.5" stroke="#2A0B07" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ShareIcon = () => (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2V10.5M11 4L8 1L5 4M1 9V14C1 14.5304 1.21071 15.0391 1.58579 15.4142C1.96086 15.7893 2.46957 16 3 16H13C13.5304 16 14.0391 15.7893 14.4142 15.4142C14.7893 15.0391 15 14.5304 15 14V9" stroke="#B81B1B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
);

export default function MuhurthFinder() {
    const [view, setView] = useState('form'); // 'form' | 'results'
    const [generateShubhDin, { isLoading }] = useGenerateShubhDinMutation();
    const [errorMsg, setErrorMsg] = useState('');

    // Form inputs state
    const [formData, setFormData] = useState({
        eventType: 'marriage',
        location: 'Kochi, India',
        fromDate: '2026-06-07',
        toDate: '2026-06-27'
    });

    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef(null);

    const [results, setResults] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const fetchSuggestions = async (query) => {
        if (!query || query.length < 3) {
            setLocationSuggestions([]);
            return;
        }
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
            const results = await res.json();
            setLocationSuggestions(results);
        } catch (e) {
            console.error("Failed to fetch location suggestions", e);
        }
    };

    const handleLocationChange = (val) => {
        setFormData(prev => ({ ...prev, location: val }));
        setShowSuggestions(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(val), 500);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        
        // Map eventType to backend occasion label
        const occasionMap = {
            'marriage': 'Vivah (Wedding)',
            'house': 'Griha Pravesh',
            'business': 'New Venture Start',
            'vehicle': 'Vehicle Purchase',
            'naming': 'Namkaran'
        };
        const occasion = occasionMap[formData.eventType] || 'Vivah (Wedding)';

        try {
            const res = await generateShubhDin({
                occasion,
                location: formData.location,
                lang: 'en'
            }).unwrap();

            const apiDates = res.dates || [];

            const mappedResults = apiDates.map(entry => {
                const dateObj = new Date(entry.date);
                const monthStr = dateObj.toLocaleString('default', { month: 'short' });
                const day = dateObj.getDate();
                const formattedDate = `${monthStr} ${day}`;

                let startTime = '07:05 AM';
                if (entry.muhurat) {
                    const parts = entry.muhurat.split(/–|-/);
                    if (parts.length > 0) {
                        startTime = parts[0].trim();
                    }
                }

                let ratingLabel = 'Good';
                let ratingClass = 'border-[#B88B1B] text-[#B88B1B] bg-[#FAF6E8]';
                if (entry.stars >= 4) {
                    ratingLabel = 'Excellent';
                    ratingClass = 'border-[#008000] text-[#008000] bg-[#F0FFEB]';
                } else if (entry.stars <= 2) {
                    ratingLabel = 'Average';
                    ratingClass = 'border-[#8A8A00] text-[#8A8A00] bg-[#FFFFE6]';
                }

                return {
                    date: formattedDate,
                    time: startTime,
                    type: occasion,
                    details1: `${entry.nakshatra} Nakshatra · ${entry.tithi}`,
                    details2: `Auspicious: ${entry.muhurat}`,
                    rating: ratingLabel,
                    ratingClass,
                    rawDateStr: entry.date
                };
            });

            // Filter results by fromDate and toDate if they are valid
            let finalResults = mappedResults;
            if (formData.fromDate && formData.toDate) {
                const from = new Date(formData.fromDate);
                const to = new Date(formData.toDate);
                
                finalResults = mappedResults.filter(item => {
                    const itemDate = new Date(item.rawDateStr);
                    return itemDate >= from && itemDate <= to;
                });

                if (finalResults.length === 0 && mappedResults.length > 0) {
                    finalResults = mappedResults;
                    setErrorMsg('No auspicious times found in your selected date range. Showing all available auspicious times:');
                }
            }

            setResults(finalResults);
            setView('results');
        } catch (err) {
            console.error("Muhurth finder error:", err);
            setErrorMsg(err?.data?.message || 'Failed to find auspicious times. Please try again.');
        }
    };

    const resetForm = () => {
        setView('form');
        setErrorMsg('');
        setFormData({
            eventType: 'marriage',
            location: 'Kochi, India',
            fromDate: '2026-06-07',
            toDate: '2026-06-27'
        });
        setResults([]);
    };

    const handleShare = () => {
        const occasionMap = {
            'marriage': 'Vivah Muhurta',
            'house': 'Griha Pravesh Muhurta',
            'business': 'Vyapaar Muhurta',
            'vehicle': 'Vahan Purchase Muhurta',
            'naming': 'Namkaran Muhurta'
        };
        const eventTypeName = occasionMap[formData.eventType] || 'Auspicious Muhurta';
        
        const shareText = `🌟 Auspicious Muhurthas for ${eventTypeName} 🌟\nLocation: ${formData.location}\nDates:\n${results.map(r => `• ${r.date} ${r.time} (${r.details1})`).join('\n')}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Auspicious Muhurtha Finder Results',
                text: shareText,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Muhurtha details copied to clipboard!');
        }
    };

    return (
        <div className="w-full flex flex-col min-h-screen bg-[#F9F8F4] text-[#2A0B07] font-['Poppins']">
            {/* Header Component */}
            <CustomHeader
                title="Muhurth Finder"
                subtitle="Auspicious Timings for Events"
                onBack={view === 'results' ? resetForm : undefined}
            />

            <div className="flex-grow p-4 sm:p-6 flex flex-col gap-6 max-w-lg mx-auto w-full box-border pb-28">
                {view === 'form' ? (
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-[10px] w-full">
                        {errorMsg && (
                            <div className="bg-red-50 text-red-600 text-[13px] font-medium p-3 rounded-xl border border-red-200 w-full mb-3">
                                {errorMsg}
                            </div>
                        )}

                        {/* Event Type selector */}
                        <div className="flex flex-col items-start gap-[10px] w-full">
                            <CustomLabel title="Event Type" />
                            <div className="relative w-full flex items-center">
                                <select
                                    name="eventType"
                                    value={formData.eventType}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-[52px] bg-[#F5ECE3] rounded-[15px] outline-none text-[#2A0B07] text-[14px] border-none px-4 appearance-none cursor-pointer pr-10 font-['Poppins']"
                                >
                                    <option value="marriage">Marriage / Vivaha</option>
                                    <option value="house">Griha Pravesh / House Warming</option>
                                    <option value="business">Naya Vyapaar / Business Launch</option>
                                    <option value="vehicle">Vahan Kharidi / Vehicle Purchase</option>
                                    <option value="naming">Namkaran / Naming Ceremony</option>
                                </select>
                                <div className="absolute right-4 pointer-events-none flex items-center justify-center">
                                    <ChevronDownIcon />
                                </div>
                            </div>
                        </div>

                        {/* Location Field */}
                        <div className="flex flex-col items-start gap-[10px] w-full relative">
                            <CustomLabel title="Location" />
                            <div className="relative w-full">
                                <CustomInput
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={(e) => handleLocationChange(e.target.value)}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    placeholder="Location"
                                    required
                                    autoComplete="off"
                                />
                                {showSuggestions && locationSuggestions.length > 0 && (
                                    <div className="absolute top-[56px] left-0 w-full bg-white border border-[#EFE5D5] rounded-xl shadow-lg z-50 overflow-hidden max-h-[200px] overflow-y-auto">
                                        {locationSuggestions.map((s, i) => (
                                            <div
                                                key={i}
                                                className="px-4 py-3 hover:bg-[#FDFBF7] cursor-pointer text-[14px] text-[#2A0B07] border-b border-[#EFE5D5] last:border-0"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        location: s.display_name
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

                        {/* Date Inputs in 2-column Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col items-start gap-[10px] w-full">
                                <CustomLabel title="From Date" />
                                <CustomInput
                                    type="date"
                                    name="fromDate"
                                    value={formData.fromDate}
                                    onChange={handleInputChange}
                                    required
                                    icon={<CalendarIcon />}
                                />
                            </div>
                            <div className="flex flex-col items-start gap-[10px] w-full">
                                <CustomLabel title="To Date" />
                                <CustomInput
                                    type="date"
                                    name="toDate"
                                    value={formData.toDate}
                                    onChange={handleInputChange}
                                    required
                                    icon={<CalendarIcon />}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <CustomButton
                                type="submit"
                                loading={isLoading}
                                variant="primary"
                            >
                                Find Auspicious Times
                            </CustomButton>
                        </div>
                    </form>
                ) : (
                    <AnimatePresence>
                        {view === 'results' && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-[10px] w-full mt-4"
                            >
                                {errorMsg && (
                                    <div className="bg-amber-50 text-amber-700 text-[13px] font-medium p-3 rounded-xl border border-amber-200 w-full mb-2">
                                        {errorMsg}
                                    </div>
                                )}

                                {/* Header Row */}
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-[20px] font-bold text-[#2A0B07] font-['Sofia_Sans']">
                                        Best muhurthas found
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleShare}
                                        className="h-[30px] w-auto py-1 px-4 text-[13px] gap-1.5 rounded-full border-[1px] border-[#B81B1B] text-[#B81B1B] flex items-center justify-center bg-[#F4E0E0] cursor-pointer hover:bg-[#B81B1B]/5 transition-colors font-medium"
                                    >
                                        <ShareIcon />
                                        <span>Share</span>
                                    </button>
                                </div>

                                {/* Cards List */}
                                <div className="flex flex-col gap-4 w-full">
                                    {results.map((muhurth, idx) => (
                                        <div
                                            key={idx}
                                            className="w-full flex items-center justify-between ps-3 pe-[9px] py-3 rounded-[12px] border-[1px] border-[#B9A795] bg-[#F5ECE3]"
                                        >
                                            {/* Left Column: Date badge */}
                                            <div className="w-[97px] h-[54px] mr-[5px] bg-[#2A0B07] rounded-[12px] flex flex-col items-center justify-center text-[#ECECEC] flex-shrink-0">
                                                <span className="text-[12px] font-semibold font-['Poppins']">
                                                    {muhurth.date}
                                                </span>
                                                <span className="text-[10px] font-semibold font-['Poppins'] -mt-1 opacity-85">
                                                    {muhurth.time}
                                                </span>
                                            </div>

                                            {/* Center Column: Text description */}
                                            <div className="flex-grow flex flex-col justify-center min-w-0 pr-2">
                                                <h3 className="text-[14px] font-medium text-[#2A0B07]/80 font-['Poppins'] capitalize">
                                                    {muhurth.type}
                                                </h3>
                                                <p className="text-[12px] text-[#2A0B07]/80 font-['Poppins'] font-light truncate">
                                                    {muhurth.details1}
                                                </p>
                                                {muhurth.details2 && (
                                                    <p className="text-[11px] text-[#2A0B07]/70 truncate mt-0.5">
                                                        {muhurth.details2}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Right Column: Rating Badge */}
                                            <div className="flex-shrink-0 flex items-center justify-center">
                                                <span className={`text-[11px] font-semibold flex items-center justify-center h-[27px] w-[64px] rounded-full border-[1px] ${muhurth.ratingClass}`}>
                                                    {muhurth.rating}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}



import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CustomHeader from '../../components/common/CustomHeader';
import CustomButton from '../../components/common/CustomButton';
import CustomHeading from '../../components/common/CustomHeading';
import CustomLabel from '../../components/common/CustomLabel';
import CustomInput from '../../components/common/CustomInput';
import { useGetVedikaKundliMatchMutation } from '../../redux/api/toolsApi';

// Reusable SVG Icons for Inputs
const CalendarIcon = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.75 13.75H6.08333C3.56933 13.75 2.312 13.75 1.53133 12.9687C0.750667 12.1873 0.75 10.9307 0.75 8.41667V7.08333C0.75 4.56933 0.75 3.312 1.53133 2.53133C2.31267 1.75067 3.56933 1.75 6.08333 1.75H8.75C11.264 1.75 12.5213 1.75 13.302 2.53133C14.0827 3.31267 14.0833 4.56933 14.0833 7.08333V8.41667C14.0833 10.9307 14.0833 12.188 13.302 12.9687C12.8667 13.4047 12.2833 13.5973 11.4167 13.682M4.08333 1.75V0.75M10.75 1.75V0.75M13.75 5.08333H6.58333M0.75 5.08333H3.33333" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11.417 10.4167C11.417 10.5935 11.3468 10.7631 11.2217 10.8881C11.0967 11.0131 10.9271 11.0833 10.7503 11.0833C10.5735 11.0833 10.4039 11.0131 10.2789 10.8881C10.1539 10.7631 10.0837 10.5935 10.0837 10.4167C10.0837 10.2399 10.1539 10.0703 10.2789 9.94527C10.4039 9.82025 10.5735 9.75001 10.7503 9.75001C10.9271 9.75001 11.0967 9.82025 11.2217 9.94527C11.3468 10.0703 11.417 10.2399 11.417 10.4167ZM11.417 7.75001C11.417 7.92682 11.3468 8.09639 11.2217 8.22141C11.0967 8.34644 10.9271 8.41668 10.7503 8.41668C10.5735 8.41668 10.4039 8.34644 10.2789 8.22141C10.1539 8.09639 10.0837 7.92682 10.0837 7.75001C10.0837 7.5732 10.1539 7.40363 10.2789 7.27861C10.4039 7.15358 10.5735 7.08334 10.7503 7.08334C10.9271 7.08334 11.0967 7.15358 11.2217 7.27861C11.3468 7.40363 11.417 7.5732 11.417 7.75001ZM8.08366 10.4167C8.08366 10.5935 8.01342 10.7631 7.8884 10.8881C7.76337 11.0131 7.5938 11.0833 7.41699 11.0833C7.24018 11.0833 7.07061 11.0131 6.94559 10.8881C6.82056 10.7631 6.75033 10.5935 6.75033 10.4167C6.75033 10.2399 6.82056 10.0703 6.94559 9.94527C7.07061 9.82025 7.24018 9.75001 7.41699 9.75001C7.5938 9.75001 7.76337 9.82025 7.8884 9.94527C8.01342 10.0703 8.08366 10.2399 8.08366 10.4167ZM8.08366 7.75001C8.08366 7.92682 8.01342 8.09639 7.8884 8.22141C7.76337 8.34644 7.5938 8.41668 7.41699 8.41668C7.24018 8.41668 7.07061 8.34644 6.94559 8.22141C6.82056 8.09639 6.75033 7.92682 6.75033 7.75001C6.75033 7.5732 6.82056 7.40363 6.94559 7.27861C7.07061 7.15358 7.24018 7.08334 7.41699 7.08334C7.5938 7.08334 7.76337 7.15358 7.8884 7.27861C8.01342 7.40363 8.08366 7.5732 8.08366 7.75001ZM4.75033 10.4167C4.75033 10.5935 4.68009 10.7631 4.55506 10.8881C4.43004 11.0131 4.26047 11.0833 4.08366 11.0833C3.90685 11.0833 3.73728 11.0131 3.61225 10.8881C3.48723 10.7631 3.41699 10.5935 3.41699 10.4167C3.41699 10.2399 3.48723 10.0703 3.61225 9.94527C3.73728 9.82025 3.90685 9.75001 4.08366 9.75001C4.26047 9.75001 4.43004 9.82025 4.55506 9.94527C4.68009 10.0703 4.75033 10.2399 4.75033 10.4167ZM4.75033 7.75001C4.75033 7.92682 4.68009 8.09639 4.55506 8.22141C4.43004 8.34644 4.26047 8.41668 4.08366 8.41668C3.90685 8.41668 3.73728 8.34644 3.61225 8.22141C3.48723 8.09639 3.41699 7.92682 3.41699 7.75001C3.41699 7.5732 3.48723 7.40363 3.61225 7.27861C3.73728 7.15358 3.90685 7.08334 4.08366 7.08334C4.26047 7.08334 4.43004 7.15358 4.55506 7.27861C4.68009 7.40363 4.75033 7.5732 4.75033 7.75001Z" fill="#2A0B07" />
    </svg>
);

const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7.06667 6.33533L9.66067 8.92933L9.09533 9.49533L6.26667 6.66667V2.66667H7.06667V6.33533ZM6.66667 13.3333C2.98467 13.3333 0 10.3487 0 6.66667C0 2.98467 2.98467 0 6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333ZM6.66667 12.5333C8.2226 12.5333 9.71481 11.9152 10.815 10.815C11.9152 9.71481 12.5333 8.2226 12.5333 6.66667C12.5333 5.11073 11.9152 3.61852 10.815 2.51831C9.71481 1.41809 8.2226 0.8 6.66667 0.8C5.11073 0.8 3.61852 1.41809 2.51831 2.51831C1.41809 3.61852 0.8 5.11073 0.8 6.66667C0.8 8.2226 1.41809 9.71481 2.51831 10.815C3.61852 11.9152 5.11073 12.5333 6.66667 12.5333Z" fill="#2A0B07" />
    </svg>
);

const ShareIcon = () => (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2V10.5M11 4L8 1L5 4M1 9V14C1 14.5304 1.21071 15.0391 1.58579 15.4142C1.96086 15.7893 2.46957 16 3 16H13C13.5304 16 14.0391 15.7893 14.4142 15.4142C14.7893 15.0391 15 14.5304 15 14V9" stroke="#B81B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function KundliMatching() {
    const navigate = useNavigate();
    const [view, setView] = useState('form'); // 'form' | 'results'
    const [getVedikaKundliMatch, { isLoading }] = useGetVedikaKundliMatchMutation();
    const [resultData, setResultData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [errors, setErrors] = useState({});

    // Location suggestion states
    const [boySuggestions, setBoySuggestions] = useState([]);
    const [girlSuggestions, setGirlSuggestions] = useState([]);
    const [showBoySuggestions, setShowBoySuggestions] = useState(false);
    const [showGirlSuggestions, setShowGirlSuggestions] = useState(false);

    const boyDebounceRef = useRef(null);
    const girlDebounceRef = useRef(null);

    // Form inputs state
    const [formData, setFormData] = useState({
        boyName: '',
        boyDob: '',
        boyTob: '',
        boyPob: '',
        boyCoords: '',
        girlName: '',
        girlDob: '',
        girlTob: '',
        girlPob: '',
        girlCoords: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const fetchBoySuggestions = async (query) => {
        if (!query || query.length < 3) {
            setBoySuggestions([]);
            return;
        }
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
            const results = await res.json();
            setBoySuggestions(results);
        } catch (e) {
            console.error("Failed to fetch boy location suggestions", e);
        }
    };

    const fetchGirlSuggestions = async (query) => {
        if (!query || query.length < 3) {
            setGirlSuggestions([]);
            return;
        }
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
            const results = await res.json();
            setGirlSuggestions(results);
        } catch (e) {
            console.error("Failed to fetch girl location suggestions", e);
        }
    };

    const handleBoyPobChange = (val) => {
        setFormData(prev => ({ ...prev, boyPob: val, boyCoords: '' }));
        setShowBoySuggestions(true);
        if (boyDebounceRef.current) clearTimeout(boyDebounceRef.current);
        boyDebounceRef.current = setTimeout(() => fetchBoySuggestions(val), 500);
    };

    const handleGirlPobChange = (val) => {
        setFormData(prev => ({ ...prev, girlPob: val, girlCoords: '' }));
        setShowGirlSuggestions(true);
        if (girlDebounceRef.current) clearTimeout(girlDebounceRef.current);
        girlDebounceRef.current = setTimeout(() => fetchGirlSuggestions(val), 500);
    };

    const getBrowserTimezone = () => {
        const offsetMin = new Date().getTimezoneOffset(); // e.g. -330 for IST
        const sign = offsetMin <= 0 ? '+' : '-';
        const abs = Math.abs(offsetMin);
        const hh = String(Math.floor(abs / 60)).padStart(2, '0');
        const mm = String(abs % 60).padStart(2, '0');
        return `${sign}${hh}:${mm}`;
    };

    const handleMatchSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        
        const newErrors = {};
        if (!formData.boyCoords) {
            newErrors.boyPob = 'Please select a birthplace from the suggestions list.';
        }
        if (!formData.girlCoords) {
            newErrors.girlPob = 'Please select a birthplace from the suggestions list.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        try {
            const [lat1, lon1] = formData.boyCoords.split(',').map(Number);
            const [lat2, lon2] = formData.girlCoords.split(',').map(Number);
            const timezone = getBrowserTimezone();

            const res = await getVedikaKundliMatch({
                male: {
                    datetime: `${formData.boyDob}T${formData.boyTob}:00`,
                    latitude: lat1,
                    longitude: lon1,
                    timezone,
                    gender: 'male',
                },
                female: {
                    datetime: `${formData.girlDob}T${formData.girlTob}:00`,
                    latitude: lat2,
                    longitude: lon2,
                    timezone,
                    gender: 'female',
                },
            }).unwrap();

            setResultData(res);
            setView('results');
        } catch (err) {
            console.error("Match error:", err);
            setErrorMsg(err?.data?.message || 'Failed to generate compatibility report. Please try again.');
        }
    };

    const resetForm = () => {
        setView('form');
        setErrorMsg('');
        setErrors({});
        setResultData(null);
        setFormData({
            boyName: '',
            boyDob: '',
            boyTob: '',
            boyPob: '',
            boyCoords: '',
            girlName: '',
            girlDob: '',
            girlTob: '',
            girlPob: '',
            girlCoords: ''
        });
    };

    const handleShare = () => {
        const score = resultData?.data?.total_points ?? 0;
        const maxScore = resultData?.data?.maximum_points ?? 36;
        const rec = resultData?.data?.recommendation ?? '';
        const shareText = `🌟 Zodimithra Kundli Matching Result 🌟\n• Boy: ${formData.boyName}\n• Girl: ${formData.girlName}\n• Guna Milan Score: ${score}/${maxScore} (${rec})`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Kundli Matching Compatibility',
                text: shareText,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Match details copied to clipboard!');
        }
    };

    function getGunaStatus(points, maxPoints) {
        if (points === maxPoints) {
            return {
                status: 'Matched',
                pillClass: 'bg-[#FFF2F0] border-[#2A0B07] text-[#2A0B07]'
            };
        } else if (points === 0) {
            return {
                status: 'Not Matched',
                pillClass: 'bg-[#FFF2F0] border-[#B54D48] text-[#B54D48]'
            };
        } else {
            const ratio = points / maxPoints;
            if (ratio >= 0.5) {
                return {
                    status: 'Good',
                    pillClass: 'bg-[#F0FFEB] border-[#008000] text-[#008000]'
                };
            } else {
                return {
                    status: 'Medium',
                    pillClass: 'bg-[#F4EEDE] border-[#B88B1B] text-[#B88B1B]'
                };
            }
        }
    }

    const dynamicGunas = (resultData?.data?.guna_kootas ?? []).map(koot => {
        const { status, pillClass } = getGunaStatus(koot.points, koot.maximum_points);
        return {
            name: koot.name,
            max: koot.maximum_points,
            score: koot.points,
            status,
            pillClass
        };
    });

    const activeSegments = resultData?.data
        ? Math.round(((resultData.data.total_points ?? 0) / (resultData.data.maximum_points ?? 36)) * 5)
        : 0;

    return (
        <div className="w-full flex flex-col min-h-screen bg-[#F9F8F4] text-[#2A0B07] font-['Poppins']">
            {/* Header */}
            <CustomHeader
                title="Kundli Matching"
                subtitle="Vedic birth chart, Navamsa & planet positions"
                onBack={view === 'results' ? resetForm : undefined}
            />

            <div className="flex-grow p-4 sm:p-6 flex flex-col gap-6 max-w-lg mx-auto w-full box-border pb-16">
                {view === 'form' ? (
                    <form onSubmit={handleMatchSubmit} className="flex flex-col gap-[10px] w-full">
                        {errorMsg && (
                            <div className="bg-red-50 text-red-600 text-[13px] font-medium p-3 rounded-xl border border-red-200 w-full mb-3">
                                {errorMsg}
                            </div>
                        )}
                        
                        {/* Boy's Details Section */}
                        <div className="flex flex-col gap-[10px]">
                            <CustomHeading title="Boy's Details" />
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col items-start gap-[10px] w-full">
                                    <CustomLabel title="Name" />
                                    <CustomInput
                                        type="text"
                                        name="boyName"
                                        value={formData.boyName}
                                        onChange={handleInputChange}
                                        placeholder="Boy's Name"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col items-start gap-[10px] w-full">
                                        <CustomLabel title="Date of Birth" />
                                        <CustomInput
                                            type="date"
                                            name="boyDob"
                                            value={formData.boyDob}
                                            onChange={handleInputChange}
                                            required
                                            icon={<CalendarIcon />}
                                        />
                                    </div>
                                    <div className="flex flex-col items-start gap-[10px] w-full">
                                        <CustomLabel title="Time of Birth" />
                                        <CustomInput
                                            type="time"
                                            name="boyTob"
                                            value={formData.boyTob}
                                            onChange={handleInputChange}
                                            required
                                            icon={<ClockIcon />}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col items-start gap-[10px] w-full relative">
                                    <CustomLabel title="Place of Birth" />
                                    <div className="relative w-full">
                                        <CustomInput
                                            type="text"
                                            name="boyPob"
                                            value={formData.boyPob}
                                            onChange={(e) => handleBoyPobChange(e.target.value)}
                                            onFocus={() => setShowBoySuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowBoySuggestions(false), 200)}
                                            placeholder="Place of Birth"
                                            required
                                            autoComplete="off"
                                        />
                                        {showBoySuggestions && boySuggestions.length > 0 && (
                                            <div className="absolute top-[56px] left-0 w-full bg-white border border-[#EFE5D5] rounded-xl shadow-lg z-50 overflow-hidden max-h-[200px] overflow-y-auto">
                                                {boySuggestions.map((s, i) => (
                                                    <div
                                                        key={i}
                                                        className="px-4 py-3 hover:bg-[#FDFBF7] cursor-pointer text-[14px] text-[#2A0B07] border-b border-[#EFE5D5] last:border-0"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                boyPob: s.display_name,
                                                                boyCoords: `${s.lat},${s.lon}`
                                                            }));
                                                            setShowBoySuggestions(false);
                                                        }}
                                                    >
                                                        {s.display_name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.boyPob && (
                                        <span className="text-[12px] text-red-500 font-medium mt-1">
                                            {errors.boyPob}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Girl's Details Section */}
                        <div className="flex flex-col gap-[10px] mt-4">
                            <CustomHeading title="Girl's Details" />
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col items-start gap-[10px] w-full">
                                    <CustomLabel title="Name" />
                                    <CustomInput
                                        type="text"
                                        name="girlName"
                                        value={formData.girlName}
                                        onChange={handleInputChange}
                                        placeholder="Girl's Name"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col items-start gap-[10px] w-full">
                                        <CustomLabel title="Date of Birth" />
                                        <CustomInput
                                            type="date"
                                            name="girlDob"
                                            value={formData.girlDob}
                                            onChange={handleInputChange}
                                            required
                                            icon={<CalendarIcon />}
                                        />
                                    </div>
                                    <div className="flex flex-col items-start gap-[10px] w-full">
                                        <CustomLabel title="Time of Birth" />
                                        <CustomInput
                                            type="time"
                                            name="girlTob"
                                            value={formData.girlTob}
                                            onChange={handleInputChange}
                                            required
                                            icon={<ClockIcon />}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col items-start gap-[10px] w-full relative">
                                    <CustomLabel title="Place of Birth" />
                                    <div className="relative w-full">
                                        <CustomInput
                                            type="text"
                                            name="girlPob"
                                            value={formData.girlPob}
                                            onChange={(e) => handleGirlPobChange(e.target.value)}
                                            onFocus={() => setShowGirlSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowGirlSuggestions(false), 200)}
                                            placeholder="Place of Birth"
                                            required
                                            autoComplete="off"
                                        />
                                        {showGirlSuggestions && girlSuggestions.length > 0 && (
                                            <div className="absolute top-[56px] left-0 w-full bg-white border border-[#EFE5D5] rounded-xl shadow-lg z-50 overflow-hidden max-h-[200px] overflow-y-auto">
                                                {girlSuggestions.map((s, i) => (
                                                    <div
                                                        key={i}
                                                        className="px-4 py-3 hover:bg-[#FDFBF7] cursor-pointer text-[14px] text-[#2A0B07] border-b border-[#EFE5D5] last:border-0"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                girlPob: s.display_name,
                                                                girlCoords: `${s.lat},${s.lon}`
                                                            }));
                                                            setShowGirlSuggestions(false);
                                                        }}
                                                    >
                                                        {s.display_name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.girlPob && (
                                        <span className="text-[12px] text-red-500 font-medium mt-1">
                                            {errors.girlPob}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <CustomButton
                                type="submit"
                                loading={isLoading}
                                variant="primary"
                            >
                                Generate Kundli Chart
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
                                {/* Header Row */}
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-[24px] font-bold text-[#2A0B07] font-['Sofia_Sans']">
                                        Guna milan score
                                    </span>
                                    <CustomButton
                                        variant="outline"
                                        onClick={handleShare}
                                        icon={<ShareIcon />}
                                        className="!h-[27px] !w-auto py-1 px-4 !text-[13px] gap-1.5 !rounded-full !border-[#B54D48] !text-[#B54D48] hover:!bg-[#B54D48]/5 transition-colors font-medium"
                                    >
                                        Share
                                    </CustomButton>
                                </div>

                                {/* Guna Milan Score Card */}
                                <div className="relative pt-[10px] pb-5 rounded-[24px] border-[1px] border-[#CF9914] bg-[#FDF2DC] flex flex-col items-center justify-center overflow-hidden shadow-[0px_4px_16px_rgba(229,181,79,0.08)] w-full">
                                    <span className="text-[48px] font-bold text-[#2A0B07] font-['Poppins'] leading-none">
                                        {resultData?.data?.total_points ?? 0}
                                    </span>

                                    <span className="text-[14px] font-medium text-[#B78919] font-['Poppins']">
                                        out of {resultData?.data?.maximum_points ?? 36} Gunas
                                    </span>

                                    <span className="text-[14px] text-[#2A0B07] font-['Poppins'] mt-4 font-semibold capitalize">
                                        {resultData?.data?.recommendation || 'Compatible Match'} ✦
                                    </span>

                                    <div className="flex items-center gap-1.5 w-[120px] mt-2">
                                        {[1, 2, 3, 4, 5].map((seg) => (
                                            <div
                                                key={seg}
                                                className={`h-[6px] flex-1 rounded-full transition-all duration-500 ${seg <= activeSegments ? 'bg-[#2A0B07]' : 'bg-[#BAC7D5]'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <span className="text-[10px] font-light text-[#2A0B07]/60 font-['Poppins'] mt-4">
                                        {resultData?.data?.total_points ?? 0}/{resultData?.data?.maximum_points ?? 36} compatibility
                                    </span>
                                </div>

                                {/* Breakdown List */}
                                <div className="flex flex-col w-full">
                                    {dynamicGunas.map((guna) => (
                                        <div
                                            key={guna.name}
                                            className="flex items-center justify-between py-4 border-b-[0.6px] border-[#000000]/40"
                                        >
                                            <span className="text-[14px] font-medium text-[#2A0B07] font-['Poppins']">
                                                {guna.name}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-[#8A8A8A] font-['Poppins']">
                                                    {guna.score}/{guna.max}
                                                </span>
                                                <span className={`text-[10px] flex items-center justify-center h-[27px] w-[77px] rounded-[37px] border-[1px] font-['Poppins'] ${guna.pillClass}`}>
                                                    {guna.status}
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

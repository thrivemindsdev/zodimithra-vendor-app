import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNativeApp } from '../../context/NativeAppContext';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/authSlice';
import { 
  useGetLanguagesQuery, 
  useGetSpecializationsQuery, 
  useCompleteRegistrationMutation 
} from '../../redux/api/authApi';

// Import modular subcomponents
import LanguageSelection from './components/LanguageSelection';
import ProfileNameLocation from './components/ProfileNameLocation';
import DateOfBirthSelection from './components/DateOfBirthSelection';

export default function Onboarding() {
  const navigate = useNavigate();
  const { isNativeApp, statusBarHeight } = useNativeApp();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // API hooks
  const { data: dbLanguages } = useGetLanguagesQuery();
  const { data: dbSpecializations } = useGetSpecializationsQuery();
  const [completeRegistration, { isLoading: isSubmitting }] = useCompleteRegistrationMutation();

  // Form states
  const [selectedLangs, setSelectedLangs] = useState(['en']);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [qualification, setQualification] = useState('');

  // New detailed profile states
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [tobHour, setTobHour] = useState('');
  const [tobMin, setTobMin] = useState('');
  const [tobSec, setTobSec] = useState('');
  const [tobPeriod, setTobPeriod] = useState('AM');
  const [specialization, setSpecialization] = useState('');
  const [employedOutside, setEmployedOutside] = useState('');
  const [whereLearned, setWhereLearned] = useState('');

  // Languages data (Step 1)
  const languagesList = [
    { id: 'en', name: 'English', nativeName: 'Global - Universal', letter: 'A' },
    { id: 'hi', name: 'हिन्दी', nativeName: 'Hindi', letter: 'अ' },
    { id: 'bn', name: 'বাংলা', nativeName: 'Bengali', letter: 'অ' },
    { id: 'te', name: 'తెలుగు', nativeName: 'Telugu', letter: 'അ' },
    { id: 'ml', name: 'മലയാളം', nativeName: 'Malayalam', letter: 'അ' },
    { id: 'ta', name: 'தமிழ்', nativeName: 'Tamil', letter: 'അ' },
    { id: 'gu', name: 'ગુજરાતી', nativeName: 'Gujarati', letter: 'അ' },
  ];

  // Toggle language selection
  const handleToggleLang = (id) => {
    setSelectedLangs((prev) => 
      prev.includes(id) ? [] : [id]
    );
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      // Final submission
      try {
        // Map specialization ID
        const specialization_ids = specialization ? [parseInt(specialization)] : [];

        // Map language IDs
        const language_ids = selectedLangs.map(code => {
          const langName = code === 'en' ? 'English' : code === 'ta' ? 'Tamil' : 'Sanskrit';
          const dbLang = dbLanguages?.find(l => l.name.toLowerCase() === langName.toLowerCase());
          return dbLang ? dbLang.id : null;
        }).filter(id => id !== null);

        if (language_ids.length === 0 && dbLanguages?.length > 0) {
          language_ids.push(dbLanguages[0].id);
        }

        // Formatted DOB
        const formattedDob = dobYear && dobMonth && dobDay 
          ? `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`
          : null;

        // Formatted TOB
        const formattedTob = tobHour && tobMin 
          ? `${tobHour.padStart(2, '0')}:${tobMin.padStart(2, '0')}:${tobSec ? tobSec.padStart(2, '0') : '00'} ${tobPeriod}`
          : null;

        const payload = {
          name,
          current_location: location,
          bio: `Learned at: ${whereLearned || 'Self'}. Qualification: ${qualification || 'N/A'}. Employed outside: ${employedOutside || 'No'}.`,
          experience: experience || '0',
          gender: 'other', // Default
          role: 'astrologer',
          onboarding_completed: true,
          specialization_ids,
          language_ids,
          chat_price: 20, // default pricing
          call_price: 30,
          video_price: 45,
          date_of_birth: formattedDob,
          birth_time: formattedTob,
          birth_place: location
        };

        const response = await completeRegistration(payload).unwrap();
        const userData = response.data || response;

        // Save completion locally
        localStorage.setItem('onboardingCompleted', 'true');
        sessionStorage.setItem('sessionLoaded', 'true');
        
        // Update Redux state
        dispatch(setUser(userData));

        navigate('/');
      } catch (err) {
        console.error('Onboarding failed:', err);
        alert(err?.data?.message || 'Onboarding failed. Please review your details and try again.');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate('/');
    }
  };

  // Check if current step is active / completed (Always true for design mode)
  const isActive = (() => {
    return true;
  })();

  // Framer Motion variants
  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.15 } }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div 
        className="w-full max-w-[430px] min-h-screen md:min-h-0 bg-[#FFF6E9] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative overflow-hidden box-border min-h-[640px] pb-6"
        style={{ paddingTop: isNativeApp ? statusBarHeight : undefined }}
      >
        
        {/* 1. Header Row (Back Button & Step Indicator Dots) */}
        <div className="w-full px-5 py-4 flex flex-row items-center justify-between box-border z-20 mt-4">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex justify-center items-center w-[44px] h-[44px] bg-white border border-[#F0EDEC] rounded-[16px] shadow-sm cursor-pointer hover:bg-white/90 active:scale-95 transition-all duration-200"
            aria-label="Back"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 13L1 7L7 1" stroke="#917170" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Steps Horizontal Dots (Progress bar) */}
          <div className="flex flex-row items-center gap-[6px]">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const active = step === i + 1;
              return active ? (
                // Long rounded golden rectangle
                <div 
                  key={i} 
                  className="h-[6px] bg-[#CF9914] rounded-full transition-all duration-300"
                  style={{ width: '36px' }}
                />
              ) : (
                // Small dot
                <div 
                  key={i} 
                  className="w-[6px] h-[6px] rounded-full bg-[#E5D7C6] transition-all duration-300"
                />
              );
            })}
          </div>
        </div>

        {/* 2. Onboarding Main Card Stack */}
        <div className="flex-grow flex flex-col justify-start px-5 mt-2 overflow-y-auto box-border pb-20">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`w-full bg-white/70 border border-[#5D4037]/10 backdrop-blur-[8.74px] rounded-[20.97px] p-6 box-border flex flex-col ${step === 1 ? 'gap-[180px]' : step === 3 ? 'gap-[490px]' : 'gap-6'} relative shadow-sm`}
            >
              
              {/* --- STEP 1: Languages Selection --- */}
              {step === 1 && (
                <LanguageSelection 
                  selectedLangs={selectedLangs}
                  onToggleLang={handleToggleLang}
                  languagesList={languagesList}
                />
              )}

              {/* --- STEP 2: Name and Location --- */}
              {step === 2 && (
                <ProfileNameLocation 
                  name={name}
                  setName={setName}
                  tobHour={tobHour}
                  setTobHour={setTobHour}
                  tobMin={tobMin}
                  setTobMin={setTobMin}
                  tobSec={tobSec}
                  setTobSec={setTobSec}
                  tobPeriod={tobPeriod}
                  setTobPeriod={setTobPeriod}
                  location={location}
                  setLocation={setLocation}
                  qualification={qualification}
                  setQualification={setQualification}
                  specialization={specialization}
                  setSpecialization={setSpecialization}
                  employedOutside={employedOutside}
                  setEmployedOutside={setEmployedOutside}
                  experience={experience}
                  setExperience={setExperience}
                  whereLearned={whereLearned}
                  setWhereLearned={setWhereLearned}
                  specializationsList={dbSpecializations}
                />
              )}

              {/* --- STEP 3: Date of Birth Selection --- */}
              {step === 3 && (
                <DateOfBirthSelection 
                  dobDay={dobDay}
                  setDobDay={setDobDay}
                  dobMonth={dobMonth}
                  setDobMonth={setDobMonth}
                  dobYear={dobYear}
                  setDobYear={setDobYear}
                />
              )}

              {/* Bottom Navigation Button (Buttons full) */}
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="w-full h-[48.96px] border-0 rounded-[13.98px] cursor-pointer flex items-center justify-center select-none active:scale-[0.98] transition-all duration-200 mt-2 font-['Montserrat'] font-semibold text-[13.98px] leading-[21px]"
                style={
                  isActive ? {
                    background: 'linear-gradient(272.18deg, #D4AF37 21.48%, #F1D279 78.52%)',
                    boxShadow: '0px 4px 16px rgba(212, 175, 55, 0.3)',
                    color: '#3E2723',
                    opacity: isSubmitting ? 0.7 : 1
                  } : { 
                    background: 'rgba(93, 64, 55, 0.2)', 
                    color: '#5D4037',
                    opacity: 0.5
                  }
                }
              >
                {step === totalSteps ? (isSubmitting ? 'Completing...' : 'Complete Cosmic Path') : 'Next'}
              </button>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useSendOtpMutation, useVerifyOtpMutation } from '../../redux/api/authApi';
import { setToken, setUser } from '../../redux/authSlice';
import CustomInput from '../../components/common/CustomInput';

export default function Otp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authStep, setAuthStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(30);

  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const isLoading = isSending || isVerifying;
  
  // Derive canResend from timer
  const canResend = timer === 0;
  
  // Refs for each input box
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Countdown timer for resending OTP
  useEffect(() => {
    if (authStep !== 'otp' || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, authStep]);

  // Handle focusing the first input on OTP step transition
  useEffect(() => {
    if (authStep === 'otp' && inputRefs[0].current) {
      setTimeout(() => {
        inputRefs[0].current.focus();
      }, 100);
    }
  }, [authStep]);

  // Handle input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setErrorMessage('');

    // Auto-focus next input if value is filled
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle backspace key press
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Focus previous input if current is empty
        inputRefs[index - 1].current.focus();
      }
    }
  };

  // Handle pasting code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{4}$/.test(pastedData)) return; // Only accept 4-digit numeric paste

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    setErrorMessage('');
    
    // Focus the last input box
    inputRefs[3].current.focus();
  };

  // Check if OTP is complete
  const isOtpComplete = otp.every((val) => val !== '');

  // Submit action (handles both phone sending and OTP verification)
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    setErrorMessage('');

    if (authStep === 'phone') {
      if (!phone || phone.length < 8) {
        setErrorMessage('Please enter a valid phone number');
        return;
      }

      try {
        const response = await sendOtp({ phone }).unwrap();
        // Transition to OTP verification step
        setAuthStep('otp');
        setTimer(30);
        setOtp(['', '', '', '']);
        // Backend returns the OTP in development environment for convenience
        if (response.otp) {
          console.log(`[Dev OTP Helper] Code is: ${response.otp}`);
        }
      } catch (err) {
        setErrorMessage(err?.data?.message || 'Failed to send OTP. Please try again.');
      }
    } else {
      if (!isOtpComplete) return;

      try {
        const response = await verifyOtp({ phone, otp: otp.join('') }).unwrap();
        const token = response.token;
        const userData = response.data || response;
        const onboardingCompleted = userData.onboarding_completed;

        // Save auth state to Redux (which syncs to localStorage)
        dispatch(setToken(token));
        dispatch(setUser(userData));

        if(response.data.role === 'asramam') {
          navigate('/ashrama-live');
        } else if (onboardingCompleted) {
          localStorage.setItem('onboardingCompleted', 'true');
          navigate('/');
        } else {
          localStorage.removeItem('onboardingCompleted');
          navigate('/onboarding');
        }
      } catch (err) {
        setErrorMessage(err?.data?.message || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '']);
        if (inputRefs[0].current) {
          inputRefs[0].current.focus();
        }
      }
    }
  };

  const handleResend = async () => {
    if (!canResend || isLoading) return;
    setErrorMessage('');
    try {
      const response = await sendOtp({ phone }).unwrap();
      setOtp(['', '', '', '']);
      setTimer(30);
      if (inputRefs[0].current) {
        inputRefs[0].current.focus();
      }
      if (response.otp) {
        console.log(`[Dev OTP Helper] Resent Code is: ${response.otp}`);
      }
    } catch (err) {
      setErrorMessage(err?.data?.message || 'Failed to resend OTP.');
    }
  };

  const handleBack = () => {
    if (authStep === 'otp') {
      // Allow user to go back and edit phone number
      setAuthStep('phone');
      setErrorMessage('');
    } else {
      // Navigate back in history, or to loading if no history
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/loading');
      }
    }
  };

  return (
    <div className="flex justify-center items-stretch md:items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div className="w-full max-w-[430px] min-h-screen md:min-h-[850px] bg-[#FFF6E9] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative overflow-hidden box-border">

        {/* Header Row (Back Button & Step Indicator Dots) */}
        <div className="w-full px-5 pt-6 pb-4 flex flex-row items-center justify-between gap-3 box-border z-20">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex shrink-0 justify-center items-center w-11 h-11 bg-white border border-[#F0EDEC] rounded-[16px] shadow-sm cursor-pointer hover:bg-white/90 active:scale-95 transition-all duration-200"
            aria-label="Back"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 13L1 7L7 1" stroke="#917170" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Steps Horizontal Dots (Progress bar) */}
          <div className="flex flex-row items-center gap-[6px] min-w-0">
            {/* 6 golden bars representing previous steps and 1 dot */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-6 sm:w-[36px] h-[6px] rounded-full bg-[#CF9914]"
              />
            ))}
            <div className="w-[6px] h-[6px] rounded-full bg-[#E5D7C6]" />
          </div>
        </div>

        {/* Card Overlay container */}
        <div
          className="mx-4 sm:mx-5 mb-6 bg-white/70 border-[0.87px] border-[#5D4037]/10 backdrop-blur-[8.74px] rounded-[20.97px] p-5 sm:p-7 flex flex-col justify-between items-start box-border shadow-[0px_4px_30px_rgba(93,64,55,0.05)]"
        >
          {/* Frame 1: Title, Subtitle and Inputs */}
          <div className="flex flex-col items-center p-0 w-full">

            {/* Heading 2:margin */}
            <div className="flex flex-col items-start pb-[10.49px] w-full">
              {/* Heading 2 */}
              <div className="flex flex-col items-start p-0 w-full self-stretch">
                <h2 className="w-full font-['Inter'] not-italic font-semibold text-[22px] sm:text-[24.47px] leading-tight flex items-center text-[#5D4037] m-0">
                  {authStep === 'phone' ? 'Enter Mobile' : 'Enter OTP'}
                </h2>
              </div>
            </div>

            {/* Subtitle Container */}
            <div className="flex flex-col items-start pb-7 w-full">
              <div className="flex flex-col items-start p-0 w-full self-stretch opacity-70">
                <p className="w-full font-['Poppins'] font-normal text-[12.23px] leading-[18px] flex items-center text-[#5D4037] m-0 break-words">
                  {authStep === 'phone'
                    ? 'Enter your phone number to receive your OTP code'
                    : `Enter OTP sent to your Mobile Number: ${phone}`}
                </p>
              </div>
            </div>

            {/* Inputs Container */}
            {authStep === 'phone' ? (
              <div className="w-full">
                <CustomInput
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="e.g. +919876543210"
                  required
                />
              </div>
            ) : (
              /* OTP inputs container */
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-row justify-center items-stretch p-0 w-full max-w-[280px] gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={inputRefs[index]}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="box-border flex-1 min-w-0 aspect-square max-w-[55px] bg-white/60 border-[0.87px] border-[#5D4037]/20 rounded-[10.49px] text-center font-['Poppins'] font-semibold text-[18px] text-[#5D4037] focus:outline-none focus:border-[#5D4037]/60 focus:bg-white/80 focus:shadow-[0px_0px_8px_rgba(93,64,55,0.15)] transition-all duration-200"
                      style={{
                        caretColor: '#5D4037'
                      }}
                    />
                  ))}
                </div>

                {/* Resend Timer / Link */}
                <div className="mt-6 flex justify-center w-full">
                  {canResend ? (
                    <button
                      onClick={handleResend}
                      disabled={isLoading}
                      className="font-['Poppins'] text-[12px] text-[#CF9914] font-medium hover:underline focus:outline-none cursor-pointer disabled:opacity-50"
                    >
                      Resend OTP Code
                    </button>
                  ) : (
                    <span className="font-['Poppins'] text-[12px] text-[#5D4037]/50 font-normal">
                      Resend code in <span className="font-semibold text-[#CF9914]">{timer}s</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-red-500 font-['Poppins'] text-[11px] text-center"
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>

          </div>

          {/* Button Section Container */}
          <div className="flex flex-row justify-center items-start mt-8 w-full">
            <button
              disabled={(authStep === 'phone' ? !phone : !isOtpComplete) || isLoading}
              onClick={handleSubmit}
              className="w-full h-[48.96px] flex flex-col justify-center items-center p-[13.98px] rounded-[13.98px] transition-all duration-300 select-none active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
              style={
                (authStep === 'phone' ? phone.length >= 8 : isOtpComplete)
                  ? {
                      background: 'linear-gradient(272.18deg, #D4AF37 21.48%, #F1D279 78.52%)',
                      boxShadow: '0px 4px 16px rgba(212, 175, 55, 0.3)',
                      opacity: 1,
                    }
                  : {
                      background: 'rgba(93, 64, 55, 0.2)',
                      opacity: 0.5,
                    }
              }
            >
              {isLoading ? (
                // Simple clean spinner
                <div className="w-[18px] h-[18px] border-2 border-[#5D4037]/30 border-t-[#5D4037] rounded-full animate-spin"></div>
              ) : (
                <span
                  className="font-['Montserrat'] font-semibold text-[13.98px] leading-[21px] flex items-center text-center justify-center transition-all duration-200"
                  style={{
                    color: (authStep === 'phone' ? phone.length >= 8 : isOtpComplete) ? '#3E2723' : '#5D4037'
                  }}
                >
                  {authStep === 'phone' ? 'Next' : 'Verify'}
                </span>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import spinImage from '../../assets/images/Pasted image.png'; // Ensure this path is correct based on your project structure  

export default function Loading() {
  const navigate = useNavigate();

  // Commented out redirection so you can design the loading page stably at /loading without auto-redirects.
  // To re-enable auto-loading/redirection, simply uncomment the useEffect block below:
  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      const completed = localStorage.getItem('onboardingCompleted');
      if (completed === 'true') {
        navigate('/', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);
  */

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[100vh] w-full px-6 relative overflow-hidden select-none">
      {/* Premium ambient glows in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-br from-[#F5D893]/15 to-[#FFE5C0]/5 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-gradient-to-tr from-[#DEEBFF]/30 to-[#F5D893]/10 blur-3xl pointer-events-none z-0" />

      {/* Main content container */}
      <div className="relative flex flex-col items-center justify-center z-10">
        {/* Halo background behind the spinning wheel */}
        <motion.div 
          className="absolute w-[180px] h-[180px] rounded-full bg-gradient-to-r from-[#D4AF37]/8 via-[#FFE0B2]/4 to-transparent blur-md"
          animate={{ 
            scale: [0.95, 1.1, 0.95],
            opacity: [0.4, 0.8, 0.4] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* Slow Celestial Spinning Wheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex items-center justify-center"
        >
          <motion.img
            src={spinImage}
            alt="Celestial Spinner"
            className="w-[120px] h-[120px] object-contain drop-shadow-[0px_4px_12px_rgba(212,175,55,0.15)]"
          />
        </motion.div>

        
      </div>
    </div>
  );
}

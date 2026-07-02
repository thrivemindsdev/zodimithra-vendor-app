import React from 'react';
import { motion } from 'framer-motion';

export default function RecentTransactions({ transactions }) {
  const defaultTransactions = [
    {
      id: 'rahul-kapoor-chat',
      title: 'Rahul Kapoor - Chat',
      subtext: 'Today . 23 min',
      value: '+₹690',
      isPositive: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
      isAstrologyLogo: false
    },
    {
      id: 'anjaly-varma-voice',
      title: 'Anjaly Varma -Voice Call',
      subtext: 'Today . 45 min',
      value: '+₹1,350',
      isPositive: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
      isAstrologyLogo: false
    },
    {
      id: 'platform-fee',
      title: 'Platform Fee',
      subtext: 'Yesterday . Monthly',
      value: '-₹499',
      isPositive: false,
      avatar: null,
      isAstrologyLogo: true
    },
    {
      id: 'live-session-shani',
      title: 'Live Session - Shani Transit',
      subtext: '3 days ago- 1h 45m',
      value: '+₹6,840',
      isPositive: true,
      avatar: null,
      isAstrologyLogo: true
    }
  ];

  const activeTransactions = (transactions && transactions.length > 0) ? transactions : defaultTransactions;

  // Framer Motion variants for stagger fade rows
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 15 
      } 
    }
  };

  // Custom Astrological Birth Chart/Mandala Wheel SVG Logo in Gold & Black
  const AstrologyMandalaLogo = () => (
    <div className="w-[62px] h-[60px] bg-black rounded-[30px] flex items-center justify-center border border-[#E5A853]/30 shrink-0">
      <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="#E5A853" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="32" stroke="#E5A853" strokeWidth="1.8" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="18" stroke="#E5A853" strokeWidth="1.8" />
        <line x1="50" y1="5" x2="50" y2="95" stroke="#E5A853" strokeWidth="1.8" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="#E5A853" strokeWidth="1.8" />
        <line x1="18.18" y1="18.18" x2="81.82" y2="81.82" stroke="#E5A853" strokeWidth="1.2" />
        <line x1="18.18" y1="81.82" x2="81.82" y2="18.18" stroke="#E5A853" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="5" fill="#E5A853" />
      </svg>
    </div>
  );

  return (
    /* Recent transactions container - with aligned 14px vertical & 21px side padding */
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="box-border flex flex-col items-center pt-[14px] pb-[14px] px-[21px] gap-[20px] w-full max-w-[408px] min-[430px]:w-[408px] h-[371px] bg-white shadow-[0px_2px_10px_0.2px_rgba(0,0,0,0.25)] rounded-[18px] flex-none order-2 grow-0"
    >
      {/* Frame 412 - Header */}
      <div 
        className="flex flex-row items-center p-0 gap-[15px] w-full h-[24px] box-border flex-none order-0 align-self-stretch grow-0"
      >
        <span 
          className="w-[176px] h-[24px] font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center text-[#424040] flex-none order-0 grow-0"
        >
          Recent transactions
        </span>
      </div>

      {/* Frame 447 - Transactions list - aligned to max-width 366px */}
      <div 
        className="flex flex-col items-center p-0 w-full max-w-[366px] h-[320px] flex-none order-1 grow-0"
      >
        {activeTransactions.map((tx, idx) => (
          <React.Fragment key={tx.id}>
            {/* Transaction Row - Frame 427, 428, 429, 430 */}
            <motion.div 
              variants={rowVariants}
              className="flex flex-row justify-between items-center py-[10px] w-full h-[80px] box-border flex-none grow-0"
            >
              {/* Frame 423 - Left section */}
              <div 
                className="flex flex-row items-center p-0 gap-[26px] w-auto h-[60px] flex-none order-0 grow-0 box-border"
              >
                {/* Frame 400 / 414 - Avatar image */}
                {tx.isAstrologyLogo ? (
                  <AstrologyMandalaLogo />
                ) : (
                  <div 
                    className="flex flex-col justify-end items-end p-[3px_4px] gap-[24px] w-[62px] h-[60px] rounded-[30px] bg-cover bg-center bg-no-repeat flex-none order-0 grow-0 box-border overflow-hidden shrink-0"
                    style={{
                      backgroundImage: `url('${tx.avatar}')`
                    }}
                  />
                )}

                {/* Frame 413 - Text details */}
                <div 
                  className="flex flex-col items-start p-0 gap-1 w-auto h-[43px] flex-none order-1 grow-0 box-border"
                >
                  {/* Title / Service */}
                  <span 
                    className="w-auto h-[21px] font-['Poppins'] font-semibold text-[14px] leading-[21px] flex items-center text-[#2A0B07] self-stretch flex-none order-0 grow-0"
                  >
                    {tx.title}
                  </span>

                  {/* Date and time elapsed */}
                  <span 
                    className="w-auto h-[18px] font-['Poppins'] font-light text-[12px] leading-[18px] flex items-center text-[#2F2F2F] flex-none order-1 grow-0"
                  >
                    {tx.subtext}
                  </span>
                </div>
              </div>

              {/* Value transaction amount */}
              <span 
                className={`w-auto h-[20px] font-['Sofia_Sans'] font-bold text-[14px] leading-[20px] flex items-center justify-end ${
                  tx.isPositive ? 'text-[#1D8A57]' : 'text-[#FF0000]'
                } flex-none order-1 grow-0`}
              >
                {tx.value}
              </span>
            </motion.div>

            {/* Divider line aligned perfectly */}
            {idx < activeTransactions.length - 1 && (
              <div 
                className="w-full max-w-[366px] h-[0px] border-t-[0.6px] border-[rgba(0,0,0,0.15)] flex-none grow-0"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
}

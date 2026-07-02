import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EarningsChart({ chartData }) {
  const [selectedTab, setSelectedTab] = useState('week'); // 'week' | 'month' | 'year'

  // Chart data matching the exact bar heights and highlighted days from Figma
  const defaultChartData = {
    week: [
      { label: 'Mon', height: 55.47, highlighted: false },
      { label: 'Tue', height: 83.41, highlighted: false },
      { label: 'Wed', height: 55.47, highlighted: false },
      { label: 'Thu', height: 111.35, highlighted: false },
      { label: 'Fri', height: 83.41, highlighted: false },
      { label: 'Sat', height: 133.62, highlighted: true }, // Highlighted Saturday (bg: #7B2D2D)
      { label: 'Sun', height: 55.47, highlighted: false }
    ],
    month: [
      { label: 'W1', height: 75.25, highlighted: false },
      { label: 'W2', height: 95.80, highlighted: false },
      { label: 'W3', height: 133.62, highlighted: true }, // Highlighted Week 3
      { label: 'W4', height: 60.10, highlighted: false }
    ],
    year: [
      { label: 'Q1', height: 60.10, highlighted: false },
      { label: 'Q2', height: 85.50, highlighted: false },
      { label: 'Q3', height: 133.62, highlighted: true }, // Highlighted Q3
      { label: 'Q4', height: 105.30, highlighted: false }
    ]
  };

  const activeData = (chartData && chartData[selectedTab] && chartData[selectedTab].length > 0)
    ? chartData[selectedTab]
    : defaultChartData[selectedTab];

  // Framer Motion variants for stagger-rise columns entry
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  };

  const barVariants = {
    hidden: { height: 0 },
    show: (height) => ({
      height: `${height}px`,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 14
      }
    })
  };

  return (
    /* Requests Container Card */
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="box-border flex flex-col justify-end items-center pt-[7px] pb-[5px] px-[6px] gap-[20px] w-full max-w-[408px] min-[430px]:w-[408px] h-[235px] bg-[#FFFFFF] shadow-[0px_2px_10px_0.2px_rgba(0,0,0,0.25)] rounded-[18px] flex-none order-0 align-self-stretch grow-0 overflow-hidden box-border"
    >
      {/* Time / Tabs Selector Row */}
      <div 
        className="box-border flex flex-row items-center justify-between p-0 px-[8px] w-full max-w-[394px] h-[49px] bg-[#F2EAEA] rounded-[12px] flex-none order-0 grow-0 relative"
      >
        {/* Week Tab */}
        <button
          onClick={() => setSelectedTab('week')}
          className="flex flex-row justify-center items-center p-0 w-[108px] h-[34px] border-0 rounded-[8px] cursor-pointer bg-transparent relative z-10 transition-all duration-200"
        >
          {selectedTab === 'week' && (
            <motion.div 
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-[8px] -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            />
          )}
          <span 
            className={`w-[40px] h-[21px] font-['Poppins'] font-semibold text-[14px] leading-[21px] flex items-center justify-center transition-colors duration-200 ${
              selectedTab === 'week' ? 'text-[#424040]' : 'text-[#424040]/70'
            }`}
          >
            Week
          </span>
        </button>

        {/* Month Tab */}
        <button
          onClick={() => setSelectedTab('month')}
          className="flex flex-row justify-center items-center p-0 w-[108px] h-[34px] border-0 rounded-[8px] cursor-pointer bg-transparent relative z-10 transition-all duration-200"
        >
          {selectedTab === 'month' && (
            <motion.div 
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-[8px] -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            />
          )}
          <span 
            className={`w-[46px] h-[21px] font-['Poppins'] font-semibold text-[14px] leading-[21px] flex items-center justify-center transition-colors duration-200 ${
              selectedTab === 'month' ? 'text-[#424040]' : 'text-[#424040]/70'
            }`}
          >
            Month
          </span>
        </button>

        {/* Year Tab */}
        <button
          onClick={() => setSelectedTab('year')}
          className="flex flex-row justify-center items-center p-0 w-[108px] h-[34px] border-0 rounded-[8px] cursor-pointer bg-transparent relative z-10 transition-all duration-200"
        >
          {selectedTab === 'year' && (
            <motion.div 
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-[8px] -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            />
          )}
          <span 
            className={`w-[33px] h-[21px] font-['Poppins'] font-semibold text-[14px] leading-[21px] flex items-center justify-center transition-colors duration-200 ${
              selectedTab === 'year' ? 'text-[#424040]' : 'text-[#424040]/70'
            }`}
          >
            Year
          </span>
        </button>
      </div>

      {/* Frame 420 & 421 - Chart Wrapper */}
      <div 
        className="flex flex-col items-center p-0 gap-[15px] w-full max-w-[368.91px] h-[153.86px] flex-none order-1 grow-0"
      >
        <div 
          className="flex flex-row items-end justify-center p-0 gap-[5px] w-full h-[153.86px] flex-none order-0 grow-0"
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedTab}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="flex flex-row items-end justify-center p-0 gap-[5px] w-full h-[153.86px]"
            >
              {activeData.map((item) => (
                <div 
                  key={item.label}
                  className="flex flex-col items-center justify-end h-full flex-1 max-w-[48.59px]"
                >
                  {/* Animated Bar Graphic */}
                  <motion.div 
                    custom={item.height}
                    variants={barVariants}
                    className={`w-full rounded-[6.47852px] transition-all duration-300 hover:scale-105 ${
                      item.highlighted 
                        ? 'bg-[#7B2D2D]' 
                        : 'bg-[#F2EAEA]'
                    }`}
                  />
                  
                  {/* Label underneath */}
                  <span 
                    className="w-full h-[20.25px] mt-[4px] font-['Inter'] font-semibold text-[10px] leading-[12px] flex items-center justify-center text-center text-[#2A0B07]"
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

export default function ServiceEarnings({ services }) {
  const defaultServices = [
    {
      id: 'chat-consultation',
      label: 'Chat Consultation',
      value: '₹18,240',
      color: 'bg-[#6B1C10]',
      textColor: 'text-[#6B1C10]',
      widthPercent: '66.5%', // 242px of 364px
    },
    {
      id: 'video-calls',
      label: 'Video Calls',
      value: '₹12,600',
      color: 'bg-[#C89B3C]',
      textColor: 'text-[#C89B3C]',
      widthPercent: '54.1%', // 197px of 364px
    },
    {
      id: 'e-pooja',
      label: 'E-Pooja',
      value: '₹8,400',
      color: 'bg-[#2563EB]',
      textColor: 'text-[#2563EB]',
      widthPercent: '36.5%', // 133px of 364px
    },
    {
      id: 'live-sessions',
      label: 'Live Sessions',
      value: '₹3,100',
      color: 'bg-[#1D8A57]',
      textColor: 'text-[#1D8A57]',
      widthPercent: '24.7%', // 90px of 364px
    }
  ];

  const activeServices = (services && services.length > 0) ? services : defaultServices;

  // Framer Motion variants for staggered rows entry
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
    hidden: { opacity: 0, x: -10 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 110, 
        damping: 15 
      } 
    }
  };

  return (
    /* By Service container - with aligned 14px vertical & 21px side padding */
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="box-border flex flex-col items-center pt-[14px] pb-[14px] px-[21px] gap-[20px] w-full max-w-[408px] min-[430px]:w-[408px] h-[325px] bg-white shadow-[0px_2px_10px_0.2px_rgba(0,0,0,0.25)] rounded-[18px] flex-none order-1 grow-0"
    >
      {/* Frame 412 - Header */}
      <div 
        className="flex flex-row items-center p-0 gap-[15px] w-full h-[24px] box-border flex-none order-0 align-self-stretch grow-0"
      >
        <span 
          className="w-[91px] h-[24px] font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center text-[#424040] flex-none order-0 grow-0"
        >
          By Service
        </span>
      </div>

      {/* Frame 446 - Services list - max-width aligned to 366px */}
      <div 
        className="flex flex-col items-start p-0 w-full max-w-[366px] h-[264px] flex-none order-1 align-self-stretch grow-0"
      >
        {activeServices.map((service) => (
          /* Background row block with slide in animation */
          <motion.div 
            key={service.id}
            variants={rowVariants}
            className="flex flex-col items-start p-[16px_0px] gap-[4px] w-full h-[66px] bg-white rounded-[12px] flex-none grow-0 box-border"
          >
            {/* Top row container */}
            <div 
              className="flex flex-row justify-between items-center p-0 pb-[4px] w-full h-[24px] flex-none order-0 align-self-stretch grow-0 box-border"
            >
              {/* Service label */}
              <span 
                className="w-auto h-[16px] font-['Poppins'] font-bold text-[12px] leading-[16px] flex items-center text-[#757575] flex-none order-0 grow-0"
              >
                {service.label}
              </span>

              {/* Service value */}
              <span 
                className={`w-[50px] h-[20px] font-['Sofia_Sans'] font-semibold text-[14px] leading-[20px] flex items-center justify-end ${service.textColor} flex-none order-0 grow-0`}
              >
                {service.value}
              </span>
            </div>

            {/* Bottom row progress bar container */}
            <div 
              className="flex flex-col justify-center items-start p-0 w-full h-[6px] bg-[#F3EDE8] rounded-[9999px] flex-none order-1 align-self-stretch grow-0 overflow-hidden"
            >
              {/* Active fill expand on render */}
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: service.widthPercent }}
                transition={{ 
                  duration: 0.9, 
                  ease: [0.25, 1, 0.5, 1], // Premium cubic-bezier easeOut
                  delay: 0.35 
                }}
                className={`h-[6px] ${service.color} rounded-[9999px] flex-none order-0 grow-1`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

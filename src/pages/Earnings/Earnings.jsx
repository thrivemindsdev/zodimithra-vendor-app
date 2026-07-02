import React from 'react';
import { useNavigate } from 'react-router-dom';
import EarningsChart from '../../components/EarningsChart/EarningsChart';
import ServiceEarnings from '../../components/ServiceEarnings/ServiceEarnings';
import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
import { useNativeApp } from '../../context/NativeAppContext';
import { useGetEarningsQuery } from '../../redux/api/chatApi';

export default function Earnings() {
  const navigate = useNavigate();
  const { isNativeApp, statusBarHeight } = useNativeApp();
  const { data: earningsData } = useGetEarningsQuery();
  const stats = earningsData?.stats;

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-gradient-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF] md:py-10 md:px-6">
      <div className="w-full max-w-[430px] md:max-w-6xl min-h-screen md:min-h-0 bg-gradient-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF] md:bg-white/45 md:backdrop-blur-xl shadow-[0px_10px_40px_rgba(0,0,0,0.12)] md:shadow-[0px_20px_50px_rgba(0,0,0,0.08)] md:rounded-[32px] flex flex-col relative overflow-y-auto overflow-x-hidden box-border min-h-[500px]">

        {/* Premium Astrological Earnings Hero Header (Frame 441) */}
        <div 
          className="w-full h-[273px] bg-[#2A0B07] flex flex-col justify-between pt-0 pb-[12px] px-[10px] box-border relative overflow-hidden rounded-b-[12px] shadow-[0px_2px_6px_0.2px_rgba(0,0,0,0.6)] z-20 flex-none animate-fade-in"
          style={{
            paddingTop: isNativeApp ? statusBarHeight : undefined,
            height: isNativeApp ? 273 + statusBarHeight : undefined,
          }}
        >

          {/* 1. Nav Bar (Height: 62px) */}
          <div className="w-full h-[62px] flex flex-row items-center justify-between pr-[15px] pl-0 box-border z-10 relative flex-none">
            {/* Frame 437 - Left part */}
            <div className="flex flex-row items-center gap-[2.5px] h-[57px]">
              {/* Frame 53 - Back arrow button */}
              <button
                onClick={() => navigate('/')}
                className="flex justify-center items-center w-[44px] h-[57px] rounded-[8px] bg-transparent border-0 cursor-pointer p-0 hover:bg-white/5 active:scale-95 transition-all duration-200"
                aria-label="Go Back"
              >
                {/* Yellow Back Chevron */}
                <svg width="15" height="29" viewBox="0 0 15 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.17885 14.5L13.0176 23.0441L11.2501 24.7527L1.5276 15.3543C1.29327 15.1277 1.16162 14.8204 1.16162 14.5C1.16162 14.1796 1.29327 13.8723 1.5276 13.6457L11.2501 4.24731L13.0176 5.9559L4.17885 14.5Z" fill="#F3CA06" />
                </svg>

              </button>

              {/* Frame 400 - Title text */}
              <div className="flex flex-col items-start p-0 gap-[2px] w-auto h-[24px]">
                <span className="w-[75px] h-[24px] font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center text-[#FFC227]">
                  Earnings
                </span>
              </div>
            </div>
          </div>

          {/* 2. Hero Section (Height: 211px) */}
          <div className="w-full flex flex-col justify-start items-center gap-[14px] px-[6px] pb-1 box-border z-10 relative grow">

            {/* Total Revenue Header Row */}
            <div className="w-full flex flex-row items-center justify-start max-w-[396px]">
              <span className="w-auto h-[24px] font-['Sofia_Sans'] font-semibold text-[20px] leading-[23px] flex items-center text-[#ECECEC]">
                Total Revenue
              </span>
            </div>

            {/* Frame 399 - Stats Cards Row */}
            <div className="flex flex-row justify-between items-center gap-[10px] w-full max-w-[396px] h-[72px] box-border">

              {/* Frame 395 - Today */}
              <div className="flex flex-col justify-center items-center p-[10px_0px] gap-[2px] flex-1 max-w-[127px] h-[72px] bg-white/20 backdrop-blur-md rounded-[20px] box-border border border-white/5 shadow-sm transition-transform duration-200 hover:scale-103">
                <span className="font-['Sofia_Sans'] font-bold text-[22px] max-[380px]:text-[19px] leading-none text-white flex items-center">
                  ₹{stats?.today ?? '2,340'}
                </span>
                <span className="font-['Sofia_Sans'] font-semibold text-[11px] leading-none text-white/60 tracking-wider flex items-center uppercase mt-1">
                  Today
                </span>
              </div>

              {/* Frame 396 - This week */}
              <div className="flex flex-col justify-center items-center p-[10px_0px] gap-[2px] flex-1 max-w-[127px] h-[72px] bg-white/20 backdrop-blur-md rounded-[20px] box-border border border-white/5 shadow-sm transition-transform duration-200 hover:scale-103">
                <span className="font-['Sofia_Sans'] font-bold text-[22px] max-[380px]:text-[19px] leading-none text-white flex items-center">
                  ₹{stats?.week ?? '14,820'}
                </span>
                <span className="font-['Sofia_Sans'] font-semibold text-[11px] leading-none text-white/60 tracking-wider flex items-center uppercase mt-1">
                  This week
                </span>
              </div>

              {/* Frame 397 - This month */}
              <div className="flex flex-col justify-center items-center p-[10px_0px] gap-[2px] flex-1 max-w-[127px] h-[72px] bg-white/20 backdrop-blur-md rounded-[20px] box-border border border-white/5 shadow-sm transition-transform duration-200 hover:scale-103">
                <span className="font-['Sofia_Sans'] font-bold text-[22px] max-[380px]:text-[19px] leading-none text-white flex items-center">
                  ₹{stats?.month ?? '42,340'}
                </span>
                <span className="font-['Sofia_Sans'] font-semibold text-[11px] leading-none text-white/60 tracking-wider flex items-center uppercase mt-1">
                  this month
                </span>
              </div>

            </div>

            {/* Component 7 - Withdraw Button */}
            <button
              onClick={() => console.log('Withdraw Earnings clicked')}
              className="flex flex-row justify-center items-center py-[16px] px-0 gap-[12px] w-full max-w-[396px] h-[52px] bg-gradient-to-r from-[#FFC242] to-[#E59C02] hover:opacity-95 active:scale-[0.98] border-0 rounded-[20px] cursor-pointer shadow-md transition-all duration-200 box-border"
            >
              <span className="w-auto h-[20px] font-['Poppins'] font-bold text-[14px] leading-[20px] flex items-center text-center text-[#ECECEC]">
                Withdraw Earnings
              </span>
            </button>

          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col items-center justify-start flex-grow py-4 px-4 z-10 gap-[15px]">

          {/* Earnings Chart Card */}
          <EarningsChart chartData={earningsData?.chart_data} />

          {/* By Service breakdown card */}
          <ServiceEarnings services={earningsData?.service_earnings} />

          {/* Recent Transactions list card */}
          <RecentTransactions transactions={earningsData?.recent_transactions} />

        </div>

      </div>
    </div>
  );
}

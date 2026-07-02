import React from 'react';
import CustomHeader from '../../components/common/CustomHeader';

export default function PlanetaryPositions() {
    // Static dummy data matching the mockup exactly
    const planetsData = [
        {
            planet: 'Sun',
            rashi: 'Aries (Mesh Rashi)',
            badge: 'Direct',
            badgeType: 'direct',
            details: 'Degree: 3°14\' · House: 1st · Aspects: Saturn (10th), Jupiter (7th)'
        },
        {
            planet: 'Moon',
            rashi: 'Libra (Tula Rashi)',
            badge: 'Direct',
            badgeType: 'direct',
            details: 'Degree: 18°22\' · Nakshatra: Swati · Tithi: Chaturdashi'
        },
        {
            planet: 'Mars',
            rashi: 'Gemini (Mithun Rashi)',
            badge: 'Direct',
            badgeType: 'direct',
            details: 'Degree: 12°45\' · House: 3rd · Combust: No'
        },
        {
            planet: 'Mercury',
            rashi: 'Aries (Mesh Rashi)',
            badge: 'Retrograde',
            badgeType: 'retro',
            details: 'Degree: 29°10\' · House: 1st · Combust · Retrograde until May 14'
        },
        {
            planet: 'Jupiter',
            rashi: 'Taurus (Vrishabha)',
            badge: 'Direct',
            badgeType: 'direct',
            details: 'Degree: 24°58\' · House: 2nd · Moving to Cancer Jun 2025'
        },
        {
            planet: 'Venus',
            rashi: 'Pisces (Meena Rashi)',
            badge: 'Direct',
            badgeType: 'direct',
            details: 'Degree: 7°30\' · Exalted in Pisces · Very auspicious'
        },
        {
            planet: 'Saturn',
            rashi: 'Aquarius (Kumbh)',
            badge: 'Direct',
            badgeType: 'direct',
            details: 'Degree: 11°33\' · House: 11th · Major transit March 2025'
        },
        {
            planet: 'Rahu / Ketu',
            rashi: 'Pisces / Virgo',
            badge: 'Always Retro',
            badgeType: 'always-retro',
            details: 'Rahu: 12th house · Ketu: 6th house · Axis shift Oct 2025'
        }
    ];

    return (
        <div className="w-full flex flex-col min-h-screen bg-[#F9F8F4] text-[#2A0B07] font-['Poppins']">
            {/* Header */}
            <CustomHeader
                title="Planetary Positions"
                subtitle="Today’s transit data, aspects & retrograde status"
            />

            <div className="flex-grow p-4 sm:p-6 flex flex-col gap-[10px] max-w-lg mx-auto w-full box-border pb-28">

                {/* Date Selection Banner Card (Static) */}
                <div className="w-full max-w-[410px] mx-auto h-[30px] rounded-[5px] border-[0.6px] border-[#8C764B] bg-[#FDF2DC] flex items-center justify-between px-3 py-[5px]">
                    <span className="font-['Poppins'] font-medium text-[14px] leading-[20px] text-[#EBB863] flex items-center text-center">
                        Thursday, 8 May 2026
                    </span>
                    <span className="font-['Poppins'] font-normal text-[10.2857px] leading-[15px] text-[#8A8A8A] flex items-center">
                        IST (UTC +5.30)
                    </span>
                </div>

                {/* Planets Cards List */}
                <div className="flex flex-col gap-[10px] w-full">
                    {planetsData.map((planetItem) => (

                        <div
                            key={planetItem.planet}
                            className="relative w-full bg-[#F5ECE3] border-[1px] border-[#B9A795] rounded-[12px] flex flex-row items-center justify-between px-3 py-[5px] flex-none order-1 flex-grow-0"
                        >
                            <div className={`absolute top-1/2 right-[12px] -translate-y-1/2 box-border flex flex-row justify-center items-center px-[12.5px] py-[6px] rounded-[37px] border-[1px] ${planetItem.badgeType === 'direct'
                                ? 'bg-[#E2F8E2] border-[#1D8A57]'
                                : 'bg-[#F8E5E2] border-[#2A0B07]'
                                }`}>
                                <span className={`font-['Poppins'] text-[10.2857px] flex items-center ${planetItem.badgeType === 'direct'
                                    ? 'text-[#1D8A57]'
                                    : 'text-[#2A0B07]'
                                    }`}>
                                    {planetItem.badge}
                                </span>
                            </div>
                            <div className="flex flex-col w-full gap-[10px]">
                                <div className="flex flex-row items-center gap-[11px] self-stretch flex-none order-0 flex-grow-0">
                                    {/* Rectangle 5 */}
                                    <div className="w-[26px] h-[26px] bg-[#D9D9D9] flex-none order-0 flex-grow-0" />

                                    {/* Frame 569 */}
                                    <div className="flex flex-col justify-center items-start flex-none order-1 flex-grow-0">
                                        <span className="font-['Poppins'] font-medium text-[14px] leading-[20px] text-[#2A0B07] flex items-center text-center flex-none order-0 flex-grow-0">
                                            {planetItem.planet}
                                        </span>
                                        <span className="font-['Poppins'] font-light text-[12px] leading-[20px] text-[#2A0B07]/80 flex items-center text-center flex-none order-1 flex-grow-0">
                                            {planetItem.rashi}
                                        </span>
                                    </div>
                                </div>

                                {/* Right column: Frame 530 */}

                                <span className="font-['Poppins'] font-light text-[10px] leading-[20px] text-[#2A0B07]/60 flex items-center text-center flex-none order-1 flex-grow-0">
                                    {planetItem.details}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

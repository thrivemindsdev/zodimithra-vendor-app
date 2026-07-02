import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomHeader from '../../components/common/CustomHeader';

// Import Rashi PNG assets
import ariesImg from '../../assets/rashi/aries.png';
import taurusImg from '../../assets/rashi/taurus.png';
import geminiImg from '../../assets/rashi/gemini.png';
import cancerImg from '../../assets/rashi/cancer.png';
import leoImg from '../../assets/rashi/leo.png';
import virgoImg from '../../assets/rashi/virgo.png';
import libraImg from '../../assets/rashi/libra.png';
import piscesImg from '../../assets/rashi/pisces.png';
import scorpioImg from '../../assets/rashi/scorpio.png';
import sagittariusImg from '../../assets/rashi/sagittarius.png';
import aquariusImg from '../../assets/rashi/aquarius.png';
import capricornImg from '../../assets/rashi/capricorn.png';

// Rashis guide dataset mapped matching mockup aesthetics and visual ordering in Figma
const rashis = [
  {
    id: 'aries',
    name: 'Aries',
    sanskritName: 'Mesha',
    lord: 'Mars',
    element: 'Fire',
    nature: 'Movable (Chara)',
    gemstone: 'Coral',
    icon: ariesImg,
    badgeClass: 'bg-[#FDDCDC] text-[#7C4242] border-[#FDDCDC]',
    description: 'Energetic, courageous, enthusiastic, confident. Born leaders. Can be impulsive. Career: Defense, engineering, sports, politics.'
  },
  {
    id: 'taurus',
    name: 'Taurus',
    sanskritName: 'Vrishabha',
    lord: 'Venus',
    element: 'Earth',
    nature: 'Fixed (Sthira)',
    gemstone: 'Diamond',
    icon: taurusImg,
    badgeClass: 'bg-[#DCFDE2] text-[#427C5F] border-[#DCFDE2]',
    description: 'Reliable, patient, practical, devoted. Grounded and stable. Can be stubborn. Career: Finance, agriculture, art, luxury goods.'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    sanskritName: 'Mithuna',
    lord: 'Mercury',
    element: 'Air',
    nature: 'Dual (Dvisvabhava)',
    gemstone: 'Emerald',
    icon: geminiImg,
    badgeClass: 'bg-[#E1DCFD] text-[#424A7C] border-[#E1DCFD]',
    description: 'Curious, adaptable, communicative, witty. Quick thinkers. Can be indecisive. Career: Media, writing, teaching, IT, sales.'
  },
  {
    id: 'cancer',
    name: 'Cancer',
    sanskritName: 'Karka',
    lord: 'Moon',
    element: 'Water',
    nature: 'Movable (Chara)',
    gemstone: 'Pearl',
    icon: cancerImg,
    badgeClass: 'bg-[#FDF2DC] text-[#7C6942] border-[#FDF2DC]',
    description: 'Intuitive, protective, compassionate, loyal. Family-oriented. Can be moody. Career: Healthcare, hospitality, teaching, real estate.'
  },
  {
    id: 'leo',
    name: 'Leo',
    sanskritName: 'Simha',
    lord: 'Sun',
    element: 'Fire',
    nature: 'Fixed (Sthira)',
    gemstone: 'Ruby',
    icon: leoImg,
    badgeClass: 'bg-[#FDDCDC] text-[#7C4242] border-[#FDDCDC]',
    description: 'Generous, warmhearted, creative, patronizing. Natural leaders. Can be proud. Career: Management, performing arts, public relations.'
  },
  {
    id: 'virgo',
    name: 'Virgo',
    sanskritName: 'Kanya',
    lord: 'Mercury',
    element: 'Earth',
    nature: 'Dual (Dvisvabhava)',
    gemstone: 'Emerald',
    icon: virgoImg,
    badgeClass: 'bg-[#DCFDE2] text-[#427C5F] border-[#DCFDE2]',
    description: 'Analytical, meticulous, helpful, reliable. Highly practical. Can be overly critical. Career: Research, accountancy, health services.'
  },
  {
    id: 'libra',
    name: 'Libra',
    sanskritName: 'Tula',
    lord: 'Venus',
    element: 'Air',
    nature: 'Movable (Chara)',
    gemstone: 'Diamond',
    icon: libraImg,
    badgeClass: 'bg-[#E1DCFD] text-[#424A7C] border-[#E1DCFD]',
    description: 'Diplomatic, artistic, social, cooperative. Seeks harmony. Can be indecisive. Career: Law, diplomacy, fashion, public relations.'
  },
  {
    id: 'pisces',
    name: 'Pisces',
    sanskritName: 'Meena',
    lord: 'Jupiter',
    element: 'Water',
    nature: 'Dual (Dvisvabhava)',
    gemstone: 'Yellow Sapphire',
    icon: piscesImg,
    badgeClass: 'bg-[#FDF2DC] text-[#7C6942] border-[#FDF2DC]',
    description: 'Compassionate, artistic, intuitive, wise. Deeply spiritual. Can be overly trusting. Career: Creative arts, psychology, marine biology.'
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    sanskritName: 'Vrishchika',
    lord: 'Mars',
    element: 'Earth', // Earth element in design specs
    nature: 'Fixed (Sthira)',
    gemstone: 'Coral',
    icon: scorpioImg,
    badgeClass: 'bg-[#DCFDE2] text-[#427C5F] border-[#DCFDE2]',
    description: 'Passionate, resourceful, brave, intuitive. Deeply transformative. Can be secretive. Career: Investigation, research, surgery, psychology.'
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    sanskritName: 'Dhanu',
    lord: 'Jupiter',
    element: 'Fire',
    nature: 'Dual (Dvisvabhava)',
    gemstone: 'Yellow Sapphire',
    icon: sagittariusImg,
    badgeClass: 'bg-[#FDDCDC] text-[#7C4242] border-[#FDDCDC]',
    description: 'Optimistic, freedom-loving, intellectual, honest. Philosophers. Can be impatient. Career: Teaching, travel, law, publishing.'
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    sanskritName: 'Kumbha',
    lord: 'Saturn',
    element: 'Air',
    nature: 'Fixed (Sthira)',
    gemstone: 'Blue Sapphire',
    icon: aquariusImg,
    badgeClass: 'bg-[#E1DCFD] text-[#424A7C] border-[#E1DCFD]',
    description: 'Progressive, original, independent, humanitarian. Innovators. Can be temperamental. Career: Science, technology, social work, design.'
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    sanskritName: 'Makara',
    lord: 'Saturn',
    element: 'Earth',
    nature: 'Movable (Chara)',
    gemstone: 'Blue Sapphire',
    icon: capricornImg,
    badgeClass: 'bg-[#DCFDE2] text-[#427C5F] border-[#DCFDE2]',
    description: 'Disciplined, responsible, patient, ambitious. Highly structured. Can be pessimistic. Career: Business administration, law, government.'
  }
];

export default function RashiGuide() {
  const navigate = useNavigate();
  const [selectedRashi, setSelectedRashi] = useState(rashis[2]); // Gemini default selected

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div 
        className="w-full max-w-[430px] md:max-w-[700px] lg:max-w-[850px] min-h-screen md:min-h-0 bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10"
      >
        {/* Custom Header matching the reference header subtitle */}
        <CustomHeader
          title="Rashi Guide"
          subtitle="All 12 Zodiac Signs"
          onBack={() => navigate('/tools')}
        />

        <div className="px-5 md:px-8 flex flex-col gap-6 w-full box-border mt-6">
          
          {/* Grid Layout: 2 columns matching Frame 594 auto layout */}
          <div className="grid grid-cols-2 gap-x-[15px] gap-y-[10px] w-full max-w-[398.82px] mx-auto box-border">
            {rashis.map((rashi) => {
              const isSelected = selectedRashi.id === rashi.id;
              return (
                <div 
                  key={rashi.id}
                  onClick={() => setSelectedRashi(rashi)}
                  className={`box-border flex flex-row items-center justify-center p-0 h-[133.14px] bg-[#F8F4F3] border rounded-[8.69502px] cursor-pointer transition-all duration-200 select-none hover:shadow-sm
                    ${isSelected 
                      ? 'border-[#792D30] shadow-[0_2px_8px_rgba(121,45,48,0.15)] ring-1 ring-[#792D30]/30' 
                      : 'border-[rgba(11,11,11,0.2)] hover:border-[#2A0B07]/40'}`}
                >
                  {/* Left Side: Illustration container loaded with high-quality PNG asset (new zodi signs) */}
                  <div className="w-[120px] h-[120px] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    <img src={rashi.icon} alt={rashi.name} className="w-full h-full object-contain" />
                  </div>

                  {/* Right Side: details stack Frame 590 / 593 */}
                  <div className="flex flex-col items-start gap-[1.84px] w-[58px] h-[64.46px] flex-shrink-0 justify-center pr-1.5 box-border min-w-0">
                    <span className="font-['Sofia_Sans'] font-bold text-[13.0425px] leading-[17px] text-[#2A0B07] text-left truncate w-full">
                      {rashi.name}
                    </span>
                    <span className="font-['Poppins'] font-light text-[9.18224px] leading-[17px] text-[#2A0B07] text-left truncate w-full">
                      Lord: {rashi.lord}
                    </span>
                    {/* Element Pill Badge Frame 585 */}
                    <div className={`box-border flex flex-row justify-center items-center py-[3.93525px] px-[7.87049px] gap-[7.87px] w-[38.57px] h-[24.79px] border rounded-[33.9743px] text-[9.44459px] leading-[14px] font-semibold mt-1 shrink-0 ${rashi.badgeClass}`}>
                      {rashi.element}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rashi Detail Description block at the bottom (Figma Frame 561 styling) */}
          <div className="box-border flex flex-col items-start p-[7.10204px_11.8367px_11.8367px_17.7551px] gap-[10.65px] w-full max-w-[404px] min-h-[151px] bg-[#F8F4F3] border border-[rgba(11,11,11,0.2)] rounded-[9.46939px] mt-2 mx-auto">
            {/* Top Row: Icon + Title/Subtitle (Frame 595) */}
            <div className="flex flex-row items-start gap-[10px] w-[216px] h-[38px] flex-shrink-0">
              {/* Icon (zodi signs) */}
              <div className="w-[38px] h-[38px] flex-shrink-0 relative overflow-hidden bg-white/40 rounded-[6px] p-0.5">
                <img src={selectedRashi.icon} alt={selectedRashi.name} className="w-full h-full object-contain" />
              </div>
              
              {/* Title and Subtitle Stack (Frame 590) */}
              <div className="flex flex-col items-start gap-0 w-[168px] h-[38px] justify-center flex-shrink-0 min-w-0">
                <span className="font-['Sofia_Sans'] font-bold text-[14.2041px] leading-[19px] text-[#2A0B07] truncate w-full">
                  {selectedRashi.name}
                </span>
                <span className="font-['Poppins'] font-semibold text-[10px] leading-[19px] text-[#2A0B07] truncate w-full">
                  Lord: {selectedRashi.lord} · Element: {selectedRashi.element} · {selectedRashi.nature.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Middle: Description paragraph */}
            <p className="w-full max-w-[372px] font-['Poppins'] font-normal text-[11.8367px] leading-[19px] text-[#2A0B07] m-0 text-left overflow-y-auto scrollbar-none">
              {selectedRashi.description}
            </p>
            
            {/* Bottom: Badges row (Frame 589) */}
            <div className="flex flex-row items-start gap-[11px] w-[201px] h-[27px] flex-shrink-0">
              {/* Gemstone Badge (Frame 585) */}
              <div className="box-border flex flex-row justify-center items-center py-[4.28571px] px-[8.57143px] gap-[8.57px] min-w-[66px] h-[27px] bg-[#FDF2DC] border border-[#FDF2DC] rounded-[37px] shrink-0">
                <span className="font-['Poppins'] font-bold text-[10.2857px] leading-[15px] text-[#7C6942]">
                  {selectedRashi.gemstone}
                </span>
              </div>
              
              {/* Element Badge (Frame 586) */}
              <div className="box-border flex flex-row justify-center items-center py-[4.28571px] px-[8.57143px] gap-[8.57px] min-w-[50px] h-[27px] bg-[#FDF2DC] border border-[#FDF2DC] rounded-[37px] shrink-0">
                <span className="font-['Poppins'] font-bold text-[10.2857px] leading-[15px] text-[#7C6942]">
                  {selectedRashi.element}
                </span>
              </div>
              
              {/* Nature Badge (Frame 587) */}
              <div className="box-border flex flex-row justify-center items-center py-[4.28571px] px-[8.57143px] gap-[8.57px] min-w-[56px] h-[27px] bg-[#FDF2DC] border border-[#FDF2DC] rounded-[37px] shrink-0">
                <span className="font-['Poppins'] font-bold text-[10.2857px] leading-[15px] text-[#7C6942]">
                  {selectedRashi.nature.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

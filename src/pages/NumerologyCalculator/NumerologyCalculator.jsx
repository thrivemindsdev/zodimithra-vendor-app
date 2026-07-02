import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import general project components
import CustomHeader from '../../components/common/CustomHeader';
import CustomButton from '../../components/common/CustomButton';
import CustomLabel from '../../components/common/CustomLabel';
import CustomInput from '../../components/common/CustomInput';

import { useCalculateNumerologyMutation } from '../../redux/api/toolsApi';

// Standard SVG Calendar Icon for Date Input
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 14.5H3.5C2.39543 14.5 1.5 13.6046 1.5 12.5V4.5C1.5 3.39543 2.39543 2.5 3.5 2.5H12.5C13.6046 2.5 14.5 3.39543 14.5 4.5V12.5C14.5 13.6046 13.6046 14.5 12.5 14.5Z" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 1.5V3.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 1.5V3.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.5 5.5H14.5" stroke="#2A0B07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function NumerologyCalculator() {
  const navigate = useNavigate();
  const resultsRef = useRef(null);

  // States
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedCard, setSelectedCard] = useState('lifePath'); // 'lifePath' | 'birthday' | 'personality'

  const [calculateNumerology, { isLoading }] = useCalculateNumerologyMutation();

  // Calculated numbers & API data
  const [results, setResults] = useState({
    lifePath: 0,
    lifePathTitle: '',
    lifePathDescription: '',
    birthday: 0,
    birthdayDescription: '',
    personality: 0,
    personalityTitle: '',
    personalityDescription: '',
  });

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!name || !dob) return;

    try {
      const res = await calculateNumerology({
        name,
        dob,
        time: '00:00', // Default required value
      }).unwrap();

      if (res && res.status && res.data) {
        setResults({
          lifePath: res.data.life_path.number,
          lifePathTitle: res.data.life_path.title,
          lifePathDescription: res.data.life_path.description,
          birthday: res.data.birthday.number,
          birthdayDescription: res.data.birthday.description,
          personality: res.data.personality.number,
          personalityTitle: res.data.personality.title,
          personalityDescription: res.data.personality.description,
        });
        setSelectedCard('lifePath'); // Default to lifePath
        setShowResults(true);

        // Smooth scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } catch (error) {
      console.error('Numerology calculation failed:', error);
    }
  };

  const handleShare = () => {
    const shareText = `🌟 Zodimithra Numerology Profile for ${name} 🌟\n• Life Path: ${results.lifePath}\n• Birthday Number: ${results.birthday}\n• Personality: ${results.personality}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${name}'s Numerology Profile`,
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Numerology profile copied to clipboard!');
    }
  };

  // Get description for selected card
  const getSelectedDetails = () => {
    if (selectedCard === 'lifePath') {
      return {
        title: results.lifePathTitle ? `Life Path ${results.lifePath} — ${results.lifePathTitle}` : `Life Path ${results.lifePath}`,
        description: results.lifePathDescription,
      };
    }
    if (selectedCard === 'birthday') {
      return {
        title: `Birthday Number ${results.birthday}`,
        description: results.birthdayDescription,
      };
    }
    if (selectedCard === 'personality') {
      return {
        title: results.personalityTitle ? `Personality Number ${results.personality} — ${results.personalityTitle}` : `Personality Number ${results.personality}`,
        description: results.personalityDescription,
      };
    }
    return { title: '', description: '' };
  };

  const details = getSelectedDetails();


  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div 
        className="w-full max-w-[430px] md:max-w-[700px] lg:max-w-[850px] min-h-screen md:min-h-0 bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10"
      >
        {/* Custom Header using general project assets */}
        <CustomHeader
          title="Numerology Calculator"
          subtitle="Numerology Calculator"
          onBack={() => navigate('/tools')}
        />

        <div className="px-5 md:px-8 flex flex-col gap-6 w-full box-border">
          {/* Numerology Form Card */}
          <form onSubmit={handleCalculate} className="flex flex-col gap-4 w-full mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
              {/* Name Input */}
              <div className="flex flex-col items-start gap-2.5 w-full">
                <CustomLabel title="Name" />
                <CustomInput
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Akhila M Menon"
                  required
                />
              </div>

              {/* Date of Birth Input */}
              <div className="flex flex-col items-start gap-2.5 w-full">
                <CustomLabel title="Date of Birth" />
                <CustomInput
                  type="date"
                  name="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  icon={<CalendarIcon />}
                />
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-2 w-full flex justify-center">
              <CustomButton
                type="submit"
                variant="primary"
                loading={isLoading}
                className="w-full md:w-auto md:min-w-[200px]"
              >
                Calculate Numbers
              </CustomButton>
            </div>
          </form>

          {/* Results Block */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-center gap-[15px] w-full border-t border-[#2A0B07]/5 pt-6 box-border overflow-hidden"
              >
                {/* Result Title & Share Section */}
                <div className="flex flex-row justify-between items-center w-full h-[47px] box-border">
                  <h3 className="font-['Sofia_Sans'] font-bold text-[18px] sm:text-[20px] leading-[20px] text-[#2A0B07] text-left m-0 truncate pr-2">
                    {name ? `${name}'s Numerology Profile` : "Numerology Profile"}
                  </h3>
                  
                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="flex flex-row justify-center items-center p-[4.29px_8.57px] gap-[8.57px] shrink-0 w-[77px] h-[27px] bg-[#F4E0E0] border border-[#B81B1B] rounded-[37px] cursor-pointer hover:bg-[#B81B1B]/5 transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V13.5M15 7L12 4L9 7M5 12V17C5 17.5304 5.21071 18.0391 5.58579 18.4142C5.96086 18.7893 6.46957 19 7 19H17C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17V12" stroke="#B81B1B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>  

                    <span className="font-['Poppins'] font-normal text-[10.29px] leading-[15px] text-[#B81B1B]">
                      Share
                    </span>
                  </button>
                </div>

                {/* 3-card grid container of result cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 justify-center items-center w-full border border-[#FDF2DC] rounded-[18px] p-3 sm:p-4 md:p-5 bg-[#F9F8F4] box-border mt-1">
                  
                  {/* Card 1: Life Path */}
                  <div 
                    onClick={() => setSelectedCard('lifePath')}
                    className={`box-border flex flex-col justify-center items-center w-full h-[100px] sm:h-[120px] border rounded-[18px] py-2 sm:py-3.5 px-1.5 sm:px-2 text-center transition-all duration-200 ${
                      selectedCard === 'lifePath' 
                        ? 'bg-[#FDF2DC] border-[#C8912E] shadow-md scale-[1.03]' 
                        : 'bg-[#FFFDF9] border-[#EDE3D8] hover:border-[#D49E6A] cursor-pointer hover:shadow-sm'
                    }`}
                  >
                    <span className="font-['Poppins'] font-semibold text-[28px] sm:text-[36px] leading-[28px] sm:leading-[36px] text-[#2A0B07]">
                      {results.lifePath}
                    </span>
                    <div className="flex flex-col items-center gap-0.5 mt-1 sm:mt-2">
                      <span className="font-['Poppins'] font-semibold text-[10px] sm:text-[12px] leading-none text-[#2A0B07] whitespace-nowrap">
                        Life Path
                      </span>
                      <span className="font-['Poppins'] font-light text-[9px] sm:text-[10px] leading-none text-black/70 mt-0.5 sm:mt-1 whitespace-nowrap">
                        {results.lifePathTitle || 'Leader'}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Birthday */}
                  <div 
                    onClick={() => setSelectedCard('birthday')}
                    className={`box-border flex flex-col justify-center items-center w-full h-[100px] sm:h-[120px] border rounded-[18px] py-2 sm:py-3.5 px-1.5 sm:px-2 text-center transition-all duration-200 ${
                      selectedCard === 'birthday' 
                        ? 'bg-[#FDF2DC] border-[#C8912E] shadow-md scale-[1.03]' 
                        : 'bg-[#FFFDF9] border-[#EDE3D8] hover:border-[#D49E6A] cursor-pointer hover:shadow-sm'
                    }`}
                  >
                    <span className="font-['Poppins'] font-semibold text-[28px] sm:text-[36px] leading-[28px] sm:leading-[36px] text-[#2A0B07]">
                      {results.birthday}
                    </span>
                    <div className="flex flex-col items-center gap-0.5 mt-1 sm:mt-2">
                      <span className="font-['Poppins'] font-semibold text-[10px] sm:text-[12px] leading-none text-[#2A0B07] whitespace-nowrap">
                        Birthday
                      </span>
                      <span className="font-['Poppins'] font-light text-[9px] sm:text-[10px] leading-none text-black/70 mt-0.5 sm:mt-1 whitespace-nowrap">
                        Day {results.birthday}
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Personality */}
                  <div 
                    onClick={() => setSelectedCard('personality')}
                    className={`box-border flex flex-col justify-center items-center w-full h-[100px] sm:h-[120px] border rounded-[18px] py-2 sm:py-3.5 px-1.5 sm:px-2 text-center transition-all duration-200 ${
                      selectedCard === 'personality' 
                        ? 'bg-[#FDF2DC] border-[#C8912E] shadow-md scale-[1.03]' 
                        : 'bg-[#FFFDF9] border-[#EDE3D8] hover:border-[#D49E6A] cursor-pointer hover:shadow-sm'
                    }`}
                  >
                    <span className="font-['Poppins'] font-semibold text-[28px] sm:text-[36px] leading-[28px] sm:leading-[36px] text-[#2A0B07]">
                      {results.personality}
                    </span>
                    <div className="flex flex-col items-center gap-0.5 mt-1 sm:mt-2">
                      <span className="font-['Poppins'] font-semibold text-[10px] sm:text-[12px] leading-none text-[#2A0B07] whitespace-nowrap">
                        Personality
                      </span>
                      <span className="font-['Poppins'] font-light text-[9px] sm:text-[10px] leading-none text-black/70 mt-0.5 sm:mt-1 whitespace-nowrap">
                        {results.personalityTitle || 'Achiever'}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Description details block with dark brown accent border on left */}
                <div className="box-border flex flex-row items-stretch p-0 w-full bg-[#2A0B07] shadow-[0px_2px_6px_rgba(0,0,0,0.25)] rounded-[9.47px] mt-4 overflow-hidden border-l-[6px] border-[#2A0B07]">
                  <div className="box-border flex flex-col items-start p-4 sm:p-5 gap-[10px] w-full bg-[#F8F4F3] rounded-r-[9.47px]">
                    <span className="font-['Sofia_Sans'] font-semibold text-[14px] sm:text-[16px] leading-[19px] sm:leading-[22px] text-[#2A0B07] text-left">
                      {details.title}
                    </span>
                    <p className="font-['Poppins'] font-normal text-[12px] sm:text-[13.5px] leading-[19px] sm:leading-[22px] text-[#2A0B07] m-0 text-left">
                      {details.description}
                    </p>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

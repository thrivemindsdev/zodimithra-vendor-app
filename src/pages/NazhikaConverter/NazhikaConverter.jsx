import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomHeader from '../../components/common/CustomHeader';
import swapIcon from '../../assets/images/aa.png';
import { useConvertNazhikaMutation } from '../../redux/api/toolsApi';

export default function NazhikaConverter() {
  const navigate = useNavigate();
  
  // State variables stored as strings to enable clean typing (including decimal points)
  const [nazhika, setNazhika] = useState('');
  const [vinazhika, setVinazhika] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const [convertNazhika, { isLoading }] = useConvertNazhikaMutation();

  // Converter Handlers
  const handleNazhikaChange = async (valStr) => {
    // Allow typing numbers and decimals
    if (valStr === '' || /^[0-9]*\.?[0-9]*$/.test(valStr)) {
      setNazhika(valStr);
      try {
        const res = await convertNazhika({
          type: 'vedic_to_standard',
          nazhika: valStr === '' ? 0 : parseFloat(valStr),
          vinazhika: vinazhika === '' ? 0 : parseFloat(vinazhika),
        }).unwrap();
        if (res && res.status && res.data) {
          setHours(String(res.data.hours));
          setMinutes(String(res.data.minutes));
        }
      } catch (err) {
        console.error('Nazhika conversion failed:', err);
      }
    }
  };

  const handleVinazhikaChange = async (valStr) => {
    if (valStr === '' || /^[0-9]*\.?[0-9]*$/.test(valStr)) {
      setVinazhika(valStr);
      try {
        const res = await convertNazhika({
          type: 'vedic_to_standard',
          nazhika: nazhika === '' ? 0 : parseFloat(nazhika),
          vinazhika: valStr === '' ? 0 : parseFloat(valStr),
        }).unwrap();
        if (res && res.status && res.data) {
          setHours(String(res.data.hours));
          setMinutes(String(res.data.minutes));
        }
      } catch (err) {
        console.error('Vinazhika conversion failed:', err);
      }
    }
  };

  const handleHoursChange = async (valStr) => {
    if (valStr === '' || /^[0-9]*\.?[0-9]*$/.test(valStr)) {
      setHours(valStr);
      try {
        const res = await convertNazhika({
          type: 'standard_to_vedic',
          hours: valStr === '' ? 0 : parseFloat(valStr),
          minutes: minutes === '' ? 0 : parseFloat(minutes),
        }).unwrap();
        if (res && res.status && res.data) {
          setNazhika(String(res.data.nazhika));
          setVinazhika(String(res.data.vinazhika));
        }
      } catch (err) {
        console.error('Hours conversion failed:', err);
      }
    }
  };

  const handleMinutesChange = async (valStr) => {
    if (valStr === '' || /^[0-9]*\.?[0-9]*$/.test(valStr)) {
      setMinutes(valStr);
      try {
        const res = await convertNazhika({
          type: 'standard_to_vedic',
          hours: hours === '' ? 0 : parseFloat(hours),
          minutes: valStr === '' ? 0 : parseFloat(valStr),
        }).unwrap();
        if (res && res.status && res.data) {
          setNazhika(String(res.data.nazhika));
          setVinazhika(String(res.data.vinazhika));
        }
      } catch (err) {
        console.error('Minutes conversion failed:', err);
      }
    }
  };

  // Swap function to switch values between Vedic and Standard blocks
  const handleSwapInputs = async () => {
    // Set Vedic fields to standard input values
    const newNazhika = hours;
    const newVinazhika = minutes;
    setNazhika(newNazhika);
    setVinazhika(newVinazhika);

    try {
      const res = await convertNazhika({
        type: 'vedic_to_standard',
        nazhika: newNazhika === '' ? 0 : parseFloat(newNazhika),
        vinazhika: newVinazhika === '' ? 0 : parseFloat(newVinazhika),
      }).unwrap();
      if (res && res.status && res.data) {
        setHours(String(res.data.hours));
        setMinutes(String(res.data.minutes));
      }
    } catch (err) {
      console.error('Swap conversion failed:', err);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6 font-['Poppins']">
      <div 
        className="w-full max-w-[430px] md:max-w-[700px] lg:max-w-[850px] min-h-screen md:min-h-0 bg-[#F9F8F4] md:rounded-[22px] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative box-border overflow-y-auto pb-10"
      >
        {/* Custom Header matching visual style */}
        <CustomHeader
          title="Nazhika Converter"
          subtitle={
            <span className="inline-flex items-center gap-1">
              Vedic time <img src={swapIcon} alt="↔" className="h-[11px] w-[11px]" /> Hours/Minutes
            </span>
          }
          onBack={() => navigate('/tools')}
        />

        {/* Content Container (Frame 592 auto layout) */}
        <div className="flex flex-col items-center justify-start px-4 gap-[10px] w-full max-w-[430px] mx-auto box-border mt-6">
          
          {/* Formula pill banner (Frame 590) */}
          <div className="box-border flex flex-col justify-center items-center p-0 h-[19px] bg-[#F5ECE3] border border-[#EFE2D9] rounded-[8px] shrink-0 select-none">
            <span className="font-['Sofia_Sans'] font-semibold text-[12px] leading-[19px] text-[#2A0B07] text-center">
              1 Nazhika = 24 minutes · 1 Vinazhika = 24 seconds · 60 Nazhika = 1 day
            </span>
          </div>

          {/* Row 1: Vedic Inputs (Frame 524) */}
          <div className="flex flex-row justify-center items-start px-[15px] gap-[15px] h-[78px] shrink-0 box-border">
            
            {/* Nazhika Column (Frame 508) */}
            <div className="flex flex-col items-start p-0 gap-[10px]  shrink-0">
              <label className="w-[57px] h-[21px] font-['Poppins'] font-medium text-[14px] leading-[21px] text-center text-[#2A0B07] capitalize shrink-0">
                Nazhika
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={nazhika}
                onChange={(e) => handleNazhikaChange(e.target.value)}
                placeholder="0"
                className="box-border w-[180px] h-[47px] bg-[#F5ECE3] border border-[rgba(236,236,236,0.2)] rounded-[15px] p-[13px_51px_13px_13px] font-['Poppins'] font-light text-[14px] leading-[21px] text-[#2A0B07] focus:outline-none focus:border-[#792D30]/40 shrink-0"
              />
            </div>

            {/* Vinazika Column (Frame 523) */}
            <div className="flex flex-col items-start p-0 gap-[10px]  shrink-0">
              <label className="w-[60px] h-[21px] font-['Poppins'] font-medium text-[14px] leading-[21px] text-center text-[#2A0B07] capitalize shrink-0">
                Vinazika
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={vinazhika}
                onChange={(e) => handleVinazhikaChange(e.target.value)}
                placeholder="0"
                className="box-border w-[180px] h-[47px] bg-[#F5ECE3] border border-[rgba(236,236,236,0.2)] rounded-[15px] p-[13px_51px_13px_13px] font-['Poppins'] font-light text-[14px] leading-[21px] text-[#2A0B07] focus:outline-none focus:border-[#792D30]/40 shrink-0"
              />
            </div>
          </div>

          {/* Bidirectional swap icon (⇅) */}
          <div className="flex justify-center items-center py-[2px] h-[19px] shrink-0">
            <button
              onClick={handleSwapInputs}
              className="font-['Poppins'] font-normal text-[11.8367px] leading-[19px] text-[#000000] bg-transparent border-none cursor-pointer select-none shrink-0"
              type="button"
              title="Swap values"
            >
              ⇅
            </button>
          </div>

          {/* Row 2: Standard Inputs (Frame 591) */}
          <div className="flex flex-row justify-center items-start px-[15px] gap-[15px] w-full max-w-[430px] h-[78px] shrink-0 box-border">
            
            {/* Hours Column (Frame 508) */}
            <div className="flex flex-col items-start p-0 gap-[10px]  shrink-0">
              <label className="w-[41px] h-[21px] font-['Poppins'] font-medium text-[14px] leading-[21px] text-center text-[#2A0B07] capitalize shrink-0">
                Hours
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={hours}
                onChange={(e) => handleHoursChange(e.target.value)}
                placeholder="0"
                className="box-border w-[180px] h-[47px] bg-[#F5ECE3] border border-[rgba(236,236,236,0.2)] rounded-[15px] p-[13px_51px_13px_13px] font-['Poppins'] font-light text-[14px] leading-[21px] text-[#2A0B07] focus:outline-none focus:border-[#792D30]/40 shrink-0"
              />
            </div>

            {/* Minutes Column (Frame 523) */}
            <div className="flex flex-col items-start p-0 gap-[10px]  shrink-0">
              <label className="w-[56px] h-[21px] font-['Poppins'] font-medium text-[14px] leading-[21px] text-center text-[#2A0B07] capitalize shrink-0">
                Minutes
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={minutes}
                onChange={(e) => handleMinutesChange(e.target.value)}
                placeholder="0"
                className="box-border w-[180px] h-[47px] bg-[#F5ECE3] border border-[rgba(236,236,236,0.2)] rounded-[15px] p-[13px_51px_13px_13px] font-['Poppins'] font-light text-[14px] leading-[21px] text-[#2A0B07] focus:outline-none focus:border-[#792D30]/40 shrink-0"
              />
            </div>
          </div>

          {/* Bottom Result Box (Frame 529) */}
          <div className="box-border flex flex-row justify-center items-center p-[5px_12px] gap-[35px] w-[380px] h-[52px] bg-[#F8E6D4] border border-[#DF9B57] rounded-[12px] flex-none order-4 grow-0 mx-auto mt-2">
            <div className="flex flex-row justify-center items-center p-0 gap-[5px] w-[234px] h-[20px] flex-none order-0 grow-0">
              <div className="flex flex-col items-start p-0 w-[234px] h-[20px] flex-none order-0 grow-0">
                <span className="w-[239px] h-[20px] font-['Poppins'] font-medium text-[14px] leading-[20px] flex items-center text-[rgba(42,11,7,0.8)] flex-none order-0 grow-0">
                  {nazhika || '0'} Nazhika {vinazhika || '0'} Vinazhika = {hours || '0'}h {parseFloat(minutes || '0').toFixed(1)}m
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

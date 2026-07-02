import React, { useState } from 'react';
import { useCreateLiveSessionMutation } from '../../../redux/api/liveApi';

export default function ScheduleSessionCard() {
  // Controlled form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [scheduled, setScheduled] = useState(false);

  const [createLiveSession, { isLoading }] = useCreateLiveSessionMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!title.trim() || !date || !time) {
      alert('Please fill in the Session Title, Date, and Time.');
      return;
    }

    // Combine the date + time inputs into a naive local datetime; the backend
    // interprets it in the app timezone (Asia/Kolkata).
    const start_time = `${date}T${time}:00`;

    if (new Date(start_time).getTime() <= Date.now()) {
      alert('Please pick a date and time in the future.');
      return;
    }

    setScheduled(true);
    try {
      await createLiveSession({
        mode: 'scheduled',
        title: title.trim(),
        description: description.trim() || undefined,
        start_time,
      }).unwrap();

      alert(`✨ Session "${title.trim()}" scheduled successfully!`);
      setTitle('');
      setDate('');
      setTime('');
      setDescription('');
    } catch (err) {
      console.error('Failed to schedule session', err);
      alert(err?.data?.message || 'Could not schedule the session. Please try again.');
    } finally {
      setScheduled(false);
    }
  };

  return (
    <div 
      className="w-full max-w-[410px] bg-white rounded-[18px] shadow-[0px_2px_10px_0.2px_rgba(0,0,0,0.25)] flex flex-col items-center gap-[20px] box-border select-none relative overflow-hidden transition-all duration-300"
      style={{
        padding: '15px 12px 20px',
        alignSelf: 'stretch',
        flex: 'none',
        order: 2,
        grow: 0
      }}
    >
      {/* Success State Overlay */}
      {scheduled && (
        <div className="absolute inset-0 bg-white/95 z-30 flex flex-col items-center justify-center gap-3 animate-fade-in">
          <div className="w-14 h-14 bg-[#EEF3FD] border border-[#373CEA]/30 rounded-full flex items-center justify-center text-2xl animate-bounce">
            📅
          </div>
          <span className="font-['Sofia_Sans'] font-semibold text-lg text-[#373CEA]">
            Scheduling Session...
          </span>
          <span className="font-['Poppins'] text-xs text-[#6F6F6F]">
            Updating your astrological calendar
          </span>
        </div>
      )}

      {/* Frame 412: Heading Row */}
      <div className="flex flex-row justify-between items-center w-full h-[27px] px-2 box-border">
        {/* schedule future session text */}
        <span 
          className="font-['Sofia_Sans'] font-semibold text-[20px] leading-[24px] flex items-center text-capitalize"
          style={{ color: '#424040' }}
        >
          Schedule future session
        </span>

        {/* Badge container (Frame 412) with New text */}
        <div
          className="flex flex-row justify-center items-center py-[5px] px-[10px] gap-[10px] w-[60px] h-[27px] bg-[#EEF3FD] border border-[rgba(55,60,234,0.2)] rounded-[20px]"
        >
          <span className="font-['Sofia_Sans'] font-semibold text-[14px] leading-[17px] flex items-center text-[#373CEA]">
            New
          </span>
        </div>
      </div>

      {/* Frame 470: Form Fields Container */}
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col items-start gap-[15px] w-full px-2 box-border"
      >
        {/* Session Title Field (Frame 464 / Frame 469) */}
        <div className="flex flex-col items-start gap-[4px] w-full">
          <label className="font-['Poppins'] font-medium text-[14px] leading-[21px] text-[#968671] text-capitalize">
            Session title
          </label>
          <div className="w-full h-[47px] bg-[#F5EDE3] rounded-[12px] flex items-center px-4 box-border">
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. shani transit special 2026"
              className="w-full bg-transparent border-0 outline-none font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#2A0B07] placeholder-[#6F6F6F] focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        {/* Date & Time Row (Frame 468 / Frame 469) */}
        <div className="flex flex-row justify-between items-center w-full gap-[15px]">
          
          {/* Date Col (Frame 465) */}
          <div className="flex flex-col items-start gap-[4px] flex-1">
            <label className="font-['Poppins'] font-medium text-[14px] leading-[21px] text-[#968671] text-capitalize">
              Date
            </label>
            <div className="w-full h-[47px] bg-[#F5EDE3] rounded-[12px] flex items-center px-4 box-border">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent border-0 outline-none font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#2A0B07] placeholder-[#6F6F6F] focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Time Col (Frame 466) */}
          <div className="flex flex-col items-start gap-[4px] flex-1">
            <label className="font-['Poppins'] font-medium text-[14px] leading-[21px] text-[#968671] text-capitalize">
              Time
            </label>
            <div className="w-full h-[47px] bg-[#F5EDE3] rounded-[12px] flex items-center px-4 box-border">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-transparent border-0 outline-none font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#2A0B07] placeholder-[#6F6F6F] focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Description Field (Frame 467 / Frame 469) */}
        <div className="flex flex-col items-start gap-[4px] w-full">
          <label className="font-['Poppins'] font-medium text-[14px] leading-[21px] text-[#968671] text-capitalize">
            Description
          </label>
          <div className="w-full h-[84px] bg-[#F5EDE3] rounded-[12px] flex items-start p-[10px_14px] box-border">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="describe what you’ll cover..."
              rows={3}
              className="w-full h-full bg-transparent border-0 outline-none font-['Poppins'] font-normal text-[14px] leading-[21px] text-[#2A0B07] placeholder-[#6F6F6F] focus:ring-0 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Schedule submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[47px] mt-1 bg-[#792d30] rounded-[12px] border-0 cursor-pointer flex items-center justify-center text-white active:scale-[0.98] hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="font-['Poppins'] font-semibold text-[14px] leading-[21px]">
            {isLoading ? 'Scheduling…' : 'Schedule Session'}
          </span>
        </button>
      </form>
    </div>
  );
}

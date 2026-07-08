import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Import modular subcomponents
import CountdownScreen from './components/CountdownScreen';
import LiveSetupCard from './components/LiveSetupCard';
import SessionSettingsCard from './components/SessionSettingsCard';
import LiveBroadcastViewport from './components/LiveBroadcastViewport';
import ScheduleSessionCard from './components/ScheduleSessionCard';
import TodayBookingsCard from './components/TodayBookingsCard';
import {
  useCreateLiveSessionMutation,
  useEndLiveSessionMutation,
} from '../../redux/api/liveApi';

export default function Live() {
  const location = useLocation();

  // State variables
  const [topic, setTopic] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isLive, setIsLive] = useState(false);
  const [duration, setDuration] = useState(0);

  // The live session created on the backend (carries id + host broadcast url).
  const [activeSession, setActiveSession] = useState(null);

  // Listen for scheduled sessions launched from other tabs (like Bookings)
  useEffect(() => {
    if (location.state?.activeSession) {
      const session = location.state.activeSession;
      setActiveSession(session);
      setTopic(session.title || '');
      setIsLive(true);
      setDuration(0);
      
      // Clear navigation state to prevent re-entering live mode on reload
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const [createLiveSession, { isLoading: isCreating }] = useCreateLiveSessionMutation();
  const [endLiveSession, { isLoading: isEnding }] = useEndLiveSessionMutation();

  // Countdown → go-live transition (runs once the session is created).
  useEffect(() => {
    let countdownInterval;
    if (isStarting) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            setIsStarting(false);
            setIsLive(true);
            setDuration(0);
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [isStarting]);

  // Live session duration timer.
  useEffect(() => {
    let timer;
    if (isLive) {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLive]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartLive = async () => {
    const title = topic.trim();
    if (!title) {
      alert('Please enter a session topic before going live.');
      return;
    }

    try {
      const session = await createLiveSession({ mode: 'live', title }).unwrap();
      if (!session?.host_url) {
        alert('Live room was created but no broadcast link was returned. Please try again.');
        return;
      }
      setActiveSession(session);
      setCountdown(3);
      setIsStarting(true);
    } catch (err) {
      console.error('Failed to start live session', err);
      alert(err?.data?.message || 'Could not start the live session. Please try again.');
    }
  };

  const handleEndLive = async () => {
    if (!confirm('Are you sure you want to end this live session?')) return;

    try {
      if (activeSession?.id) {
        await endLiveSession(activeSession.id).unwrap();
      }
    } catch (err) {
      console.error('Failed to end live session', err);
    } finally {
      setIsLive(false);
      setIsStarting(false);
      setTopic('');
      setActiveSession(null);
      setDuration(0);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-[#FFF6E9] md:py-10 md:px-6">
      <div className="w-full max-w-[430px] md:max-w-6xl min-h-screen md:min-h-0 bg-[#FFF6E9] md:bg-white/45 md:backdrop-blur-xl shadow-[0px_10px_40px_rgba(0,0,0,0.12)] md:shadow-[0px_20px_50px_rgba(0,0,0,0.08)] md:rounded-[32px] flex flex-col relative overflow-y-auto overflow-x-hidden box-border min-h-[640px]">

        {/* Outer content container */}
        <div className="flex-grow flex flex-col items-center p-4 md:p-6 z-10 w-full box-border pb-24">

          {/* STATE 1: Planet alignment countdown spinner */}
          {isStarting && (
            <CountdownScreen countdown={countdown} />
          )}

          {/* STATE 2: Set-up controls */}
          {!isStarting && !isLive && (
            <div className="w-full flex flex-col items-center gap-6 lg:flex-row lg:flex-wrap lg:justify-center lg:items-center">

              {/* GO LIVE Setup Card */}
              <LiveSetupCard
                topic={topic}
                setTopic={setTopic}
                onStartLive={handleStartLive}
                isStarting={isCreating}
              />

              {/* Advanced settings and device controller */}
              <SessionSettingsCard />

              {/* Schedule Future Session Card */}
              <ScheduleSessionCard />

              {/* Today's Bookings Card */}
              <TodayBookingsCard />

            </div>
          )}

          {/* STATE 3: Active celestial live broadcast */}
          {isLive && !isStarting && (
            <div className="w-full max-w-[410px] flex flex-col gap-4 box-border">

              {/* Real broadcast viewport (host publishes via embedded Meet room) */}
              <LiveBroadcastViewport
                duration={duration}
                topic={topic}
                formatTime={formatTime}
                hostUrl={activeSession?.host_url}
              />

              {/* End-session control. Mic / camera / chat live inside the embed. */}
              <button
                onClick={handleEndLive}
                disabled={isEnding}
                className="w-full h-[52px] bg-gradient-to-r from-[#E23A34] to-[#C4392C] rounded-[16px] border-0 cursor-pointer flex items-center justify-center gap-2 text-white active:scale-[0.98] hover:brightness-110 shadow-md transition-all disabled:opacity-60"
              >
                <span className="text-lg">🛑</span>
                <span className="font-['Poppins'] text-[14px] font-bold uppercase tracking-wider">
                  {isEnding ? 'Ending…' : 'End Session'}
                </span>
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

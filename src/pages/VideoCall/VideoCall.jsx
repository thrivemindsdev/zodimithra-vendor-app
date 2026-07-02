import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEndVideoSessionMutation } from '../../redux/api/chatApi';
import { useNativeApp } from '../../context/NativeAppContext';

/**
 * Astrologer side of a 1-on-1 video consultation. Embeds the host's personalised
 * LiveKit (Meet) join link passed via navigation state when a video request is
 * accepted from the Incoming Requests card.
 *
 * The call is a prepaid fixed-length block: `endsAt` is the shared hard deadline.
 * Three phases — live, ending (last 60s warning banner), ended (modal then a
 * graceful exit). When the deadline hits we force-end the room (disconnecting
 * both sides); `meet:close` covers the case where the customer ends it first.
 */

const WARN_SECONDS = 60;
const AUTO_LEAVE_SECONDS = 6;

export default function VideoCall() {
  const location = useLocation();
  const navigate = useNavigate();
  const meetUrl = location.state?.meetUrl ?? null;
  const requestId = location.state?.requestId ?? null;
  const endsAt = location.state?.endsAt ?? null;
  const { isNativeApp, statusBarHeight } = useNativeApp();
  const user = useSelector((state) => state.auth?.user);
  const userName = user?.name || 'Astrologer';

  const [loading, setLoading] = useState(true);
  const [remaining, setRemaining] = useState(null); // seconds left
  const [phase, setPhase] = useState('live'); // 'live' | 'ended'
  const [endReason, setEndReason] = useState('time'); // 'time' | 'disconnected'
  const [autoLeaveIn, setAutoLeaveIn] = useState(AUTO_LEAVE_SECONDS);

  const finishedRef = useRef(false);
  const apiEndedRef = useRef(false);

  const [endVideoSession] = useEndVideoSessionMutation();

  const iframeSrc = useMemo(() => {
    if (!meetUrl) return null;
    const sep = meetUrl.includes('?') ? '&' : '?';
    return `${meetUrl}${sep}name=${encodeURIComponent(userName)}`;
  }, [meetUrl, userName]);

  const leaveNow = useCallback(() => navigate('/'), [navigate]);

  const forceEndRoom = useCallback(async () => {
    if (apiEndedRef.current) return;
    apiEndedRef.current = true;
    try {
      if (requestId) await endVideoSession(requestId).unwrap();
    } catch {
      /* the other side / sweep will also close it */
    }
  }, [requestId, endVideoSession]);

  const finishSession = useCallback((reason) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setEndReason(reason);
    setPhase('ended');
    if (reason === 'time') forceEndRoom();
  }, [forceEndRoom]);

  // Countdown driven by the shared `endsAt` deadline.
  useEffect(() => {
    if (!endsAt) return;
    const deadline = new Date(endsAt).getTime();
    if (Number.isNaN(deadline)) return;

    const tick = () => {
      const secs = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemaining(secs);
      if (secs <= 0) finishSession('time');
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endsAt, finishSession]);

  // Once ended, count down the grace period then leave automatically.
  // (`autoLeaveIn` already starts at AUTO_LEAVE_SECONDS and we enter the ended
  // phase only once, so no reset is needed here.)
  useEffect(() => {
    if (phase !== 'ended') return;
    const interval = setInterval(() => {
      setAutoLeaveIn((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          leaveNow();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, leaveNow]);

  // Listen for the meet app's postMessage events (close / disconnect). Also
  // fires when the customer's countdown force-ends the room.
  useEffect(() => {
    if (!iframeSrc) return;

    let expectedOrigin = null;
    try {
      expectedOrigin = new URL(iframeSrc).origin;
    } catch {
      expectedOrigin = null;
    }

    const onMessage = (event) => {
      if (expectedOrigin && event.origin !== expectedOrigin) return;
      const type = event.data?.type;
      if (type === 'meet:close' || type === 'room.disconnected') {
        finishSession('disconnected');
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [iframeSrc, finishSession]);

  const fmt = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const showWarning = phase === 'live' && remaining !== null && remaining <= WARN_SECONDS && remaining > 0;

  return (
    <div className="relative bg-zinc-900 h-screen w-screen" style={{ paddingTop: statusBarHeight }}>
      {/* Back / header bar + countdown */}
      <div className="fixed top-0 z-50 px-3 pb-3 flex items-center justify-between w-full bg-black/40 backdrop-blur-sm" style={{ paddingTop: statusBarHeight + 12 }}>
        <button
          onClick={leaveNow}
          className="flex items-center gap-1 text-white text-sm font-medium"
        >
          ‹ Video Consultation
        </button>
        {remaining !== null && phase === 'live' && (
          <span
            className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
              remaining <= WARN_SECONDS ? 'bg-red-500/90 text-white animate-pulse' : 'bg-white/15 text-white'
            }`}
          >
            ⏱ {fmt(remaining)}
          </span>
        )}
      </div>

      {/* "Ending soon" warning banner (last minute) */}
      {showWarning && (
        <div className="fixed left-0 right-0 z-50 px-3" style={{ top: statusBarHeight + 56 }}>
          <div className="mx-auto max-w-md flex items-center gap-2 bg-amber-500 text-black rounded-xl px-3 py-2 shadow-lg">
            <span className="text-base leading-none">⚠️</span>
            <span className="text-[13px] font-semibold">
              This consultation ends in {fmt(remaining)}.
            </span>
          </div>
        </div>
      )}

      <div className="w-full h-full pt-14">
        {!iframeSrc ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
            <p className="text-red-400 text-center text-sm">
              No video room link was provided.
            </p>
            <button
              onClick={leaveNow}
              className="text-white bg-[#7B2D2D] px-6 py-2 rounded-full text-sm"
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-40">
                <span className="text-white text-sm animate-pulse">Starting video call…</span>
              </div>
            )}
            <iframe
              title="Video consultation"
              src={iframeSrc}
              allow="camera; microphone; display-capture; autoplay; fullscreen"
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
            />
          </>
        )}
      </div>

      {/* "Session ended" modal — shown before the graceful exit */}
      {phase === 'ended' && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#7B2D2D]/10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7B2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                <line x1="23" y1="1" x2="1" y2="23" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-[#2F2F2F]">Consultation ended</h3>
              <p className="text-sm text-[#6A6A6A] leading-relaxed">
                {endReason === 'time'
                  ? "The customer's purchased time is over. The call has ended for both of you."
                  : 'The video call has ended.'}
              </p>
            </div>
            <button
              onClick={leaveNow}
              className="w-full py-3.5 rounded-2xl bg-[#7B2D2D] text-white font-bold text-[15px]"
            >
              Done
            </button>
            <p className="text-xs text-[#A7A7A7]">Returning automatically in {autoLeaveIn}s</p>
          </div>
        </div>
      )}
    </div>
  );
}

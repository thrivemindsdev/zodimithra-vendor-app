import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNativeApp } from '../../context/NativeAppContext';


/**
 * Astrologer side of a 1-on-1 audio consultation. The room was created with
 * audioOnly:true so the meet platform renders VoiceCallView automatically —
 * mic + leave only, no camera button, no camera permission prompt.
 */
export default function AudioCall() {
    const location = useLocation();
    const navigate = useNavigate();
    const meetUrl = location.state?.meetUrl ?? null;
    const endsAt = location.state?.endsAt ?? null;
    const requestId = location.state?.requestId ?? null;
    const { isNativeApp, statusBarHeight } = useNativeApp();
    const user = useSelector((state) => state.auth?.user);
    const userName = user?.name || 'Astrologer';

    const [loading, setLoading] = useState(true);
    const [remaining, setRemaining] = useState(null);
    const endedRef = useRef(false);
    const warnedRef = useRef(false);

    const iframeSrc = useMemo(() => {
        if (!meetUrl) return null;
        const sep = meetUrl.includes('?') ? '&' : '?';
        return `${meetUrl}${sep}name=${encodeURIComponent(userName)}`;
    }, [meetUrl, userName]);

    const endAndLeave = useCallback(async () => {
        if (endedRef.current) return;
        endedRef.current = true;
        try {
            if (requestId) {
                const token = localStorage.getItem('token');
                const BASE_URL = 'https://zodimithra.howincloud.com/api';
                await fetch(`${BASE_URL}/astrologer/chat-request/${requestId}/end-video`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });
            }
        } catch {
            /* best-effort */
        }
        navigate('/');
    }, [requestId, navigate]);

    // Countdown driven by the shared endsAt deadline
    useEffect(() => {
        if (!endsAt) return;
        const deadline = new Date(endsAt).getTime();
        if (Number.isNaN(deadline)) return;

        const tick = () => {
            const secs = Math.max(0, Math.round((deadline - Date.now()) / 1000));
            setRemaining(secs);
            if (secs <= 60 && secs > 0 && !warnedRef.current) {
                warnedRef.current = true;
            }
            if (secs <= 0) {
                endAndLeave();
            }
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [endsAt, endAndLeave]);

    // Listen for meet platform postMessage events
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
                navigate('/');
            }
        };

        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [iframeSrc, navigate]);

    const fmt = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    };

    return (
        <div className="relative bg-zinc-900 h-screen w-screen" style={{ paddingTop: statusBarHeight }}>
            {/* Header bar */}
            <div className="fixed top-0 z-50 px-3 pb-3 flex items-center justify-between w-full bg-black/40 backdrop-blur-sm" style={{ paddingTop: statusBarHeight + 12 }}>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1 text-white text-sm font-medium"
                >
                    ‹ Audio Consultation
                </button>
                {remaining !== null && (
                    <span
                        className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
                            remaining <= 60 ? 'bg-red-500/80 text-white' : 'bg-white/15 text-white'
                        }`}
                    >
                        {fmt(remaining)}
                    </span>
                )}
            </div>

            <div className="w-full h-full pt-14">
                {!iframeSrc ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                        <p className="text-red-400 text-center text-sm">
                            No call room link was provided.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="text-white bg-[#7B2D2D] px-6 py-2 rounded-full text-sm"
                        >
                            Go Back
                        </button>
                    </div>
                ) : (
                    <>
                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-40">
                                <span className="text-white text-sm animate-pulse">Starting audio call…</span>
                            </div>
                        )}
                        <iframe
                            title="Audio consultation"
                            src={iframeSrc}
                            allow="microphone; autoplay; fullscreen"
                            className="w-full h-full border-0"
                            onLoad={() => setLoading(false)}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

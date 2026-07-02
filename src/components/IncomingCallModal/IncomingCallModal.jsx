import React, { useEffect, useRef, useCallback } from 'react';

export default function IncomingCallModal({ request, onAccept, onReject, isHandling }) {
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = new Audio('/phonering.mp3');
        audio.loop = true;
        audio.volume = 0.8;
        audioRef.current = audio;
        audio.play().catch(() => {
            // Autoplay may be blocked on first visit — visual modal still shows.
        });
        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);

    const stopRingtone = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, []);

    const handleAccept = () => {
        stopRingtone();
        onAccept(request.id);
    };

    const handleReject = () => {
        stopRingtone();
        onReject(request.id);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="relative bg-white border border-[#CF9914]/30 rounded-[2rem] p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-6 shadow-2xl">

                {/* Pulsing ring animation */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-[#1D8A57] opacity-20 animate-ping" />
                    <div className="absolute inset-2 rounded-full border-4 border-[#1D8A57] opacity-30 animate-ping [animation-delay:300ms]" />
                    <div className="w-20 h-20 rounded-full bg-[#1D8A57]/10 border-2 border-[#1D8A57] flex items-center justify-center">
                        {/* Phone icon */}
                        <svg className="w-8 h-8 text-[#1D8A57]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                        </svg>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-[#766c66] text-sm font-['Poppins']">Incoming Audio Call</p>
                    <h2 className="text-[#312c2a] text-2xl font-bold font-['Sofia_Sans'] mt-1">
                        {request.caller_name || 'Customer'}
                    </h2>
                    {request.minutes && (
                        <p className="text-[#CF9914] text-sm mt-1 font-['Poppins']">
                            {request.minutes} min session
                        </p>
                    )}
                </div>

                {/* Accept / Reject buttons */}
                <div className="flex gap-8 justify-center">
                    {/* Reject */}
                    <button
                        onClick={handleReject}
                        disabled={isHandling}
                        aria-label="Reject call"
                        className="w-16 h-16 rounded-full bg-[#E53E3E] flex items-center justify-center shadow-lg disabled:opacity-50 transition-transform active:scale-95"
                    >
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.384 16.617c-.355-.355-4.107-2.538-4.589-2.69a.82.82 0 0 0-.81.197l-1.5 1.5a14.244 14.244 0 0 1-5.11-5.11l1.5-1.5a.82.82 0 0 0 .197-.81C9.92 7.723 7.738 3.97 7.382 3.617A1.16 1.16 0 0 0 6.564 3C4.8 3 2 6.24 2 7.473c0 .38 0 .756.12 1.127C3.275 12.104 11.9 20.727 15.4 21.88c.37.12.747.12 1.127.12C17.76 22 21 19.2 21 17.436a1.16 1.16 0 0 0-.616-.82z" />
                            <line x1="2" y1="2" x2="22" y2="22" stroke="white" strokeWidth="2" />
                        </svg>
                    </button>

                    {/* Accept */}
                    <button
                        onClick={handleAccept}
                        disabled={isHandling}
                        aria-label="Accept call"
                        className="w-16 h-16 rounded-full bg-[#1D8A57] flex items-center justify-center shadow-lg disabled:opacity-50 animate-bounce transition-transform active:scale-95"
                    >
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

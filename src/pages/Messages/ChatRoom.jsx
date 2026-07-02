import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    useGetConversationsQuery,
    useGetChatSessionQuery,
    useUpdateChatSessionMutation
} from '../../redux/api/chatApi';
import ChatMessageList from './components/ChatMessageList';
import { useNativeApp } from '../../context/NativeAppContext';

export default function ChatRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
    const conversationId = Number(id);
    const { isNativeApp, statusBarHeight } = useNativeApp();

    // Get conversation details for display name/avatar
    const { data: conversations } = useGetConversationsQuery();
    const chatDetails = conversations?.find(c => c.id === conversationId);
    const customerName = chatDetails?.other_user?.name || 'Customer';
    const customerAvatar = chatDetails?.other_user?.image_url;

    // Get active chat session details
    const { data: sessionData, error: sessionError } = useGetChatSessionQuery(conversationId, {
        skip: !conversationId
    });
    const [updateChatSession] = useUpdateChatSessionMutation();

    const activeSession = sessionData?.chat_session;
    const initialRemainingSeconds = sessionData?.remaining_seconds;

    const [timeLeft, setTimeLeft] = useState(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isTimerLoading, setIsTimerLoading] = useState(true);

    // 3-second loading for timer on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTimerLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    // When session data loads, set initial timeLeft and status
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (sessionData && activeSession?.status === 'active') {
            setTimeLeft(initialRemainingSeconds);
            setIsSessionActive(true);
        } else if (sessionError || (sessionData && activeSession?.status !== 'active')) {
            setIsSessionActive(false);
            setTimeLeft(0);
        }
    }, [sessionData, sessionError, activeSession, initialRemainingSeconds]);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Local 1-second countdown timer for smooth UI
    useEffect(() => {
        if (!isSessionActive || timeLeft === null || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsSessionActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isSessionActive, timeLeft]);

    // 2-second polling to update chat session on backend
    useEffect(() => {
        if (!isSessionActive || !activeSession?.id) return;

        const interval = setInterval(async () => {
            try {
                const res = await updateChatSession(activeSession.id).unwrap();
                if (res.status === 'ended') {
                    setIsSessionActive(false);
                    setTimeLeft(0);
                } else if (res.remaining_seconds !== undefined) {
                    setTimeLeft(res.remaining_seconds);
                }
            } catch (err) {
                console.error('Failed to update chat session:', err);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isSessionActive, activeSession?.id, updateChatSession]);

    // Format remaining time into MM:SS
    const formatTime = (seconds) => {
        if (seconds === null) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col bg-gradient-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF] h-[100vh] w-full overflow-hidden select-none relative">
            {/* Premium Header */}
            <header 
                className="flex-none bg-[#2A0B07] text-[#FFC227] px-5 pb-4 flex flex-row items-center justify-between shadow-md z-30"
                style={{ paddingTop: isNativeApp ? statusBarHeight + 16 : 16 }}
            >
                {/* Left Side: Back & Customer Profile */}
                <div className="flex flex-row items-center gap-3">
                    <button 
                        onClick={() => navigate('/messages')}
                        className="bg-transparent border-0 text-[#FFC227] hover:text-[#fff] transition-all cursor-pointer p-1 active:scale-95"
                    >
                        {/* Back Arrow SVG */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    {/* Customer Avatar */}
                    <div className="w-11 h-11 bg-white/20 rounded-full border border-[#FFC227]/30 flex items-center justify-center overflow-hidden">
                        {customerAvatar ? (
                            <img src={customerAvatar} alt={customerName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[18px] font-bold text-[#FFC227]">{customerName.charAt(0)}</span>
                        )}
                    </div>

                    {/* Customer Name & Subtitle */}
                    <div className="flex flex-col">
                        <span className="font-['Sofia_Sans'] font-bold text-[18px] leading-tight text-[#FFC227]">{customerName}</span>
                        <span className="font-['Poppins'] font-light text-[11px] text-white/75">Astrology Session</span>
                    </div>
                </div>

                {/* Right Side: Timer / Session Badge */}
                <div className="flex items-center gap-2">
                    {isTimerLoading ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFC227]/20 text-[#FFC227] border border-[#FFC227]/30 font-['Poppins'] font-semibold text-xs tracking-wider animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-[#FFC227]" />
                            <span>Loading...</span>
                        </div>
                    ) : isSessionActive ? (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-['Poppins'] font-semibold text-xs tracking-wider border shadow-sm transition-all duration-300 ${
                            timeLeft <= 60 
                                ? 'bg-red-600/20 text-red-500 border-red-500/30 animate-pulse' 
                                : 'bg-green-600/20 text-green-400 border-green-500/30'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${timeLeft <= 60 ? 'bg-red-500 animate-ping' : 'bg-green-400'}`} />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 font-['Poppins'] font-semibold text-xs">
                            <span className="w-2 h-2 rounded-full bg-gray-400" />
                            <span>Session Ended</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Banners Area */}
            {!isTimerLoading && isSessionActive && timeLeft <= 60 && timeLeft > 0 && (
                <div className="flex-none bg-red-600/90 text-white font-['Poppins'] text-center py-2 px-4 text-xs font-semibold tracking-wide animate-pulse z-20 shadow-inner">
                    ⚠️ Customer's wallet balance is running low! This session will end in {timeLeft} seconds.
                </div>
            )}
            {!isTimerLoading && !isSessionActive && (
                <div className="flex-none bg-[#CF9914]/90 text-white font-['Poppins'] text-center py-2 px-4 text-xs font-semibold tracking-wide z-20 shadow-inner">
                    🔒 This chat session has ended. You can view historical messages but cannot send new replies.
                </div>
            )}

            {/* Message Area */}
            <main className="flex-grow overflow-hidden relative z-10">
                <ChatMessageList 
                    conversationId={conversationId} 
                    isSessionActive={isTimerLoading ? false : isSessionActive} 
                    isTimerLoading={isTimerLoading}
                />
            </main>
        </div>
    );
}

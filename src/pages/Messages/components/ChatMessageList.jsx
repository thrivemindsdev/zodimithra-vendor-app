import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
    useGetMessagesQuery, 
    useSendMessageMutation, 
    useMarkMessagesReadMutation 
} from '../../../redux/api/chatApi';
import { useChatSocket } from '../../../hooks/useChatSocket';
import Loading from '../../Loading/Loading';

export default function ChatMessageList({ conversationId, isSessionActive, isTimerLoading }) {
    const [messageText, setMessageText] = useState('');
    const { data: messages, isLoading } = useGetMessagesQuery(conversationId, {
        pollingInterval: 12000
    });
    const [sendMessage] = useSendMessageMutation();
    const [markAsRead] = useMarkMessagesReadMutation();
    const currentUser = useSelector((state) => state.auth.user);
    const scrollRef = useRef(null);

    // Subscribe to real-time updates via WebSockets
    useChatSocket(conversationId);

    // Auto-scroll to bottom on messages load/update
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Mark messages as read on mount/update
    useEffect(() => {
        if (conversationId) {
            markAsRead(conversationId);
        }
    }, [conversationId, messages?.length, markAsRead]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!isSessionActive || !messageText.trim()) return;

        const text = messageText;
        setMessageText('');
        try {
            await sendMessage({ conversationId, message: text }).unwrap();
        } catch (err) {
            console.error('Failed to send message:', err);
            setMessageText(text); // Restore text on failure
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <Loading />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full relative">
            {/* Scrollable Messages Section */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-5 py-6 gap-4 flex flex-col pb-36 no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
            >
                {messages?.map((msg) => {
                    const isSender = msg.sender_id === currentUser?.id;
                    const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                        <div key={msg.id} className="flex flex-col">
                            <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`p-[14px] px-[18px] rounded-[18px] max-w-[80%] shadow-sm ${isSender
                                        ? 'bg-[#2A0B07] text-white rounded-br-[4px] ml-auto'
                                        : 'bg-[#FDF3DC] text-[#2A0B07] border border-[#CF9914]/20 rounded-bl-[4px]'
                                        }`}
                                >
                                    <p className="text-[14px] leading-[1.5] font-['Poppins'] font-normal break-words">{msg.message}</p>
                                </div>
                            </div>
                            <div className={`mt-[4px] px-1 ${isSender ? 'text-right' : 'text-left'}`}>
                                <span className="text-[10px] text-[#2F2F2F]/60 font-light tracking-wide">{time}</span>
                            </div>
                        </div>
                    );
                })}
                {(!messages || messages.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <p className="text-sm font-['Poppins'] font-light italic text-[#2F2F2F]">No messages yet. Say hello!</p>
                    </div>
                )}
            </div>

            {/* Input form fixed at bottom of the scroll container */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#FFF3E0] via-[#FFF3E0] to-transparent pt-6 pb-6 px-4 z-20">
                <form
                    onSubmit={handleSend}
                    className="bg-white border border-[#CF9914]/40 rounded-full flex items-center pl-4 pr-1.5 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                >
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder={
                            isTimerLoading 
                                ? "Loading session..." 
                                : isSessionActive 
                                    ? "Type your reply here..." 
                                    : "This chat session has ended."
                        }
                        disabled={isTimerLoading || !isSessionActive}
                        className="flex-1 min-w-0 bg-transparent border-none outline-none text-[14px] font-['Poppins'] text-[#2F2F2F] placeholder-[#2F2F2F]/40 px-2 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={isTimerLoading || !isSessionActive || !messageText.trim()}
                        className="w-9 h-9 bg-[#2A0B07] hover:bg-[#4d1711] rounded-full flex items-center justify-center text-[#FFC227] ml-1.5 shrink-0 disabled:opacity-40 disabled:bg-gray-300 disabled:text-gray-500 transition-all active:scale-95 shadow-sm cursor-pointer disabled:cursor-not-allowed"
                    >
                        {/* Send icon SVG */}
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-x-[1px] -translate-y-[1px]">
                            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="currentColor" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}

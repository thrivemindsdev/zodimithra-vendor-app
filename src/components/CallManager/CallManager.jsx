import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useOneSignal } from '../../hooks/useOneSignal';
import { useIncomingCallListener } from '../../hooks/useIncomingCallListener';
import { useHandleChatRequestMutation } from '../../redux/api/chatApi';
import IncomingCallModal from '../IncomingCallModal/IncomingCallModal';

/**
 * Mounted globally in App.jsx. Handles all incoming call logic regardless of
 * which page the vendor is currently on.
 */
export default function CallManager() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth?.user);
    const [incomingCall, setIncomingCall] = useState(null);
    const [handleChatRequest, { isLoading: isHandling }] = useHandleChatRequestMutation();

    // Register vendor with OneSignal via RN postMessage on login
    useOneSignal();

    const handleIncomingCall = useCallback((payload) => {
        setIncomingCall(payload);
    }, []);

    // Subscribe to vendor's Reverb private channel for instant in-app notification
    useIncomingCallListener(handleIncomingCall);

    // Auto-dismiss modal when the request expires
    useEffect(() => {
        if (!incomingCall?.expires_at) return;
        const msLeft = new Date(incomingCall.expires_at).getTime() - Date.now();
        if (msLeft <= 0) {
            setIncomingCall(null);
            return;
        }
        const timer = setTimeout(() => setIncomingCall(null), msLeft);
        return () => clearTimeout(timer);
    }, [incomingCall?.expires_at]);

    const handleAccept = useCallback(async (requestId) => {
        try {
            const res = await handleChatRequest({ requestId, action: 'accept' }).unwrap();
            setIncomingCall(null);
            if (res.type === 'call' && res.host_meet_url) {
                navigate('/audio-call', {
                    state: {
                        meetUrl: res.host_meet_url,
                        minutes: res.minutes,
                        endsAt: res.ends_at,
                        requestId,
                    },
                });
            }
        } catch (err) {
            console.error('Failed to accept call:', err);
            setIncomingCall(null);
        }
    }, [handleChatRequest, navigate]);

    const handleReject = useCallback(async (requestId) => {
        try {
            await handleChatRequest({ requestId, action: 'reject' }).unwrap();
        } catch (err) {
            console.error('Failed to reject call:', err);
        } finally {
            setIncomingCall(null);
        }
    }, [handleChatRequest]);

    // Only render if the user is logged in and there is an active call
    if (!user?.id || !incomingCall) return null;

    return (
        <IncomingCallModal
            request={incomingCall}
            onAccept={handleAccept}
            onReject={handleReject}
            isHandling={isHandling}
        />
    );
}

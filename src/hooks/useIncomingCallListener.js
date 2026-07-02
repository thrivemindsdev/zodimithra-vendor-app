import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getEcho } from '../config/echo';

/**
 * Subscribes to the vendor's own private Reverb channel and fires
 * onIncomingCall(payload) when a 'call' type request arrives.
 *
 * channels.php already authorizes App.Models.User.{id} for any authenticated
 * user — no backend changes needed.
 */
export function useIncomingCallListener(onIncomingCall) {
    const user = useSelector((state) => state.auth?.user);

    const stableCallback = useCallback(onIncomingCall, []);

    useEffect(() => {
        if (!user?.id) return;

        const echo = getEcho();
        const channelName = `App.Models.User.${user.id}`;

        const channel = echo.private(channelName);
        channel.listen('.IncomingCallRequest', (payload) => {
            if (payload.type === 'call' && payload.status === 'pending') {
                stableCallback(payload);
            }
        });

        return () => {
            channel.stopListening('.IncomingCallRequest');
        };
    }, [user?.id, stableCallback]);
}

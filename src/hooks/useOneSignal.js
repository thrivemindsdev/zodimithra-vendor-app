import { useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * Fires a postMessage to the React Native WebView when the vendor logs in.
 * The RN app receives the user.id, links it to the OneSignal subscription,
 * and calls POST /astrologer/device/register with the actual player_id.
 */
export function useOneSignal() {
    const user = useSelector((state) => state.auth?.user);

    useEffect(() => {
        if (!user?.id) return;
        if (!window.ReactNativeWebView) return;

        window.ReactNativeWebView.postMessage(
            JSON.stringify({
                type: 'onesignal_login',
                data: {
                    playerId: user.id,
                    status: 'subscribed',
                },
            })
        );
    }, [user?.id]);
}

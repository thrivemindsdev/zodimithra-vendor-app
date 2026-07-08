import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { store } from '../redux/store';

window.Pusher = Pusher;

const isLocal = false;
const apiUrl = 'https://backend.zodimithra.com/api';

const getHostName = (url) => {
    try {
        return new URL(url).hostname;
    } catch {
        return 'localhost';
    }
};


function createEcho() {
    const config = {
        broadcaster: 'reverb',
        key: 'cglzdl6g3q34q1h4tnch',
        wsHost: isLocal ? getHostName(apiUrl) : 'zodireverb.howincloud.com',
        wsPort: isLocal ? 8080 : 443,
        wssPort: isLocal ? 8080 : 443,
        forceTLS: !isLocal,
        enabledTransports: ['ws', 'wss'],
        authorizer: (channel) => ({
            authorize: (socketId, callback) => {
                const token = store.getState().auth?.token;
                fetch(`${apiUrl}/broadcasting/auth`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: token ? `Bearer ${token}` : '',
                    },
                    body: JSON.stringify({
                        socket_id: socketId,
                        channel_name: channel.name,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => callback(false, data))
                    .catch((err) => callback(true, err));
            },
        }),
    };

    console.log('[Echo] Initializing vendor echo with config:', config);
    return new Echo(config);
}

let echoInstance = null;

export function getEcho() {
    if (!echoInstance) {
        echoInstance = createEcho();
        window.Echo = echoInstance;
    }
    return echoInstance;
}

export function resetEcho() {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
}

export function disconnectEcho() {
    resetEcho();
}

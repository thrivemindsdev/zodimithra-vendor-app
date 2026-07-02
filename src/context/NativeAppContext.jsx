import { createContext, useContext, useEffect, useRef, useState } from 'react';

export const SHOW_PAYMENTS_ON_IOS = false; // Toggle this to true to show payments on iOS after review

const defaultDeviceInfo = {
    isNativeApp: false,
    platform: null,
    platformVersion: null,
    statusBarHeight: 0,
    screenWidth: null,
    screenHeight: null,
    appVersion: null,
    deviceName: null,
    showPayments: true,
};

const NativeAppContext = createContext(defaultDeviceInfo);

const RNWebView = window.ReactNativeWebView;

function requestDeviceInfo() {
    RNWebView?.postMessage(JSON.stringify({ type: 'get_device_data' }));
}

const POLL_INTERVAL_MS = 1000;
const MAX_ATTEMPTS = 10;

export function NativeAppProvider({ children }) {
    const [deviceInfo, setDeviceInfo] = useState(defaultDeviceInfo);
    const receivedRef = useRef(false);

    useEffect(() => {
        const handler = (event) => {
            try {
                const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                if (data?.type === 'DEVICE_INFO') {
                    receivedRef.current = true;
                    setDeviceInfo({
                        isNativeApp: true,
                        platform: data.payload?.platform ?? null,
                        platformVersion: data.payload?.platformVersion ?? null,
                        statusBarHeight: data.payload?.statusBarHeight ?? 0,
                        screenWidth: data.payload?.screenWidth ?? null,
                        screenHeight: data.payload?.screenHeight ?? null,
                        appVersion: data.payload?.appVersion ?? null,
                        deviceName: data.payload?.deviceName ?? null,
                        showPayments: true, // will be computed in context value
                    });
                }
            } catch {
                // ignore malformed messages
            }
        };

        window.addEventListener('message', handler);
        document.addEventListener('message', handler);

        // Poll until device info is received or max attempts reached
        let attempts = 0;
        requestDeviceInfo();
        const interval = setInterval(() => {
            if (receivedRef.current || ++attempts >= MAX_ATTEMPTS) {
                clearInterval(interval);
                return;
            }
            requestDeviceInfo();
        }, POLL_INTERVAL_MS);

        return () => {
            clearInterval(interval);
            window.removeEventListener('message', handler);
            document.removeEventListener('message', handler);
        };
    }, []);

    const showPayments = !(deviceInfo.platform === 'ios' && !SHOW_PAYMENTS_ON_IOS);

    return (
        <NativeAppContext.Provider value={{ ...deviceInfo, showPayments }}>
            {children}
        </NativeAppContext.Provider>
    );
}

export const useNativeApp = () => useContext(NativeAppContext);

import { useRef, useState, useEffect } from "react";
import SessionButton from "./components/SessionButton";

interface LiveBroadcastProps {
  hostUrl: string;
  stopLiveSession: () => void;
  isEnding: boolean;
}

export default function LiveBroadcastAshrama({
  hostUrl,
  stopLiveSession,
  isEnding,
}: LiveBroadcastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!hostUrl) return null;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      // Maximize / Enter Fullscreen
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      // Minimize / Exit Fullscreen
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  // Sync state if user exits via ESC key or browser controls
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      <div className="bg-white p-4 rounded-2xl">
        {/* Container referenced for full-screen view */}
        <div
          ref={containerRef}
          className="relative w-full aspect-4/3 lg:h-[75vh] rounded-2xl bg-[#120403] overflow-hidden"
        >
          <iframe
            src={hostUrl}
            title="Live broadcast"
            allow="camera; microphone; fullscreen; display-capture; autoplay;"
            allowFullScreen
            className="w-full h-full border-0"
          />

          {/* Maximize / Minimize Button Overlay */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-10 right-4 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg text-sm transition-colors cursor-pointer"
            type="button"
          >
            {isFullscreen ? "Exit Fullscreen (Minimize)" : "Fullscreen (Maximize)"}
          </button>
        </div>

        <div className="mt-4">
          <SessionButton
            title="End Session"
            handleClick={stopLiveSession}
            disabled={isEnding}
          />
        </div>
      </div>
    </div>
  );
}
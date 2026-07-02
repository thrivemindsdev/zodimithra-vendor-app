import React from 'react';

export default function LiveBroadcastViewport({
  duration,
  viewerCount,
  cameraActive,
  topic,
  isMuted,
  waves,
  chatMessages,
  formatTime,
  hostUrl
}) {
  // Real broadcast: embed the Meet host room. The astrologer publishes their
  // camera/mic through the platform's own controls; viewers see this stream.
  if (hostUrl) {
    return (
      <div className="w-full aspect-[4/3] rounded-[24px] bg-[#120403] relative overflow-hidden border-2 border-[#FFC227]/40 shadow-2xl">
        <iframe
          src={hostUrl}
          title="Live broadcast"
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="absolute inset-0 w-full h-full border-0"
        />
        {/* LIVE + duration badge overlay */}
        <div className="absolute top-3 left-3 z-10 bg-[#2A0B07]/80 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 border border-white/10 pointer-events-none">
          <div className="w-1.5 h-1.5 bg-[#FF0000] rounded-full animate-ping" />
          <span className="font-['Sofia_Sans'] font-semibold text-[13px] text-white tracking-wide">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[4/3] rounded-[24px] bg-[#120403] relative overflow-hidden flex flex-col justify-between p-4 box-border border-2 border-[#FFC227]/40 shadow-2xl">

      {/* Star / Astrological Constellation Animated Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(42,11,7,0.4)_0%,#0e0302_100%)] pointer-events-none z-0" />
      
      {/* Rotating constellation graphic */}
      <div className="absolute -top-1/4 -right-1/4 w-72 h-72 rounded-full border border-dashed border-[#FFC227]/10 animate-[spin_60s_linear_infinite] pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-1/4 w-72 h-72 rounded-full border border-dashed border-[#FFC227]/10 animate-[spin_45s_linear_infinite_reverse] pointer-events-none" />

      {/* Top Bar: Info Badge (Viewer Count & Time) */}
      <div className="w-full flex items-center justify-between z-10">
        {/* Left: Duration Badge */}
        <div className="bg-[#2A0B07]/80 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 border border-white/10">
          <div className="w-1.5 h-1.5 bg-[#FF0000] rounded-full animate-ping" />
          <span className="font-['Sofia_Sans'] font-semibold text-[13px] text-white tracking-wide">
            {formatTime(duration)}
          </span>
        </div>

        {/* Right: Viewers badge */}
        <div className="bg-black/45 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 border border-[#FFC227]/20">
          <span className="text-xs">👤</span>
          <span className="font-['Sofia_Sans'] font-semibold text-[13px] text-[#FFC227]">
            {viewerCount} Live
          </span>
        </div>
      </div>

      {/* Center: Avatar with active glowing aura */}
      <div className="w-full flex flex-col items-center justify-center my-auto z-10 gap-2">
        <div className="relative">
          {/* Ring Visualizers */}
          <div className="absolute inset-0 rounded-full border border-[#FFD976]/30 scale-125 animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-[#FFC227]/20 scale-150 animate-ping opacity-60 duration-1000" />
          
          {/* circular image container */}
          <div className="w-20 h-20 rounded-full border-2 border-[#FFC227] overflow-hidden bg-[#2A0B07] flex items-center justify-center shadow-lg relative">
            {cameraActive ? (
              <span className="text-4xl">🕉️</span>
            ) : (
              <span className="text-3xl text-white/40">🚫🎥</span>
            )}
          </div>
        </div>

        {/* Topic Tag */}
        {topic && (
          <div className="bg-[#FFC227]/20 border border-[#FFC227]/40 rounded-lg px-4 py-1 mt-2 backdrop-blur-sm max-w-[260px] text-center">
            <span className="font-['Sofia_Sans'] font-medium text-xs text-[#FFC227] tracking-wider uppercase">
              Topic: {topic}
            </span>
          </div>
        )}

        {/* Mic Audio Waveform visualizer */}
        {!isMuted && (
          <div className="flex items-end justify-center gap-0.5 h-6 mt-1">
            {waves.map((h, i) => (
              <div 
                key={i} 
                className="w-[2px] bg-gradient-to-t from-[#FFC227] to-[#E23A34] rounded-full transition-all duration-150" 
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom: Overlayed Comments */}
      <div className="w-full h-24 overflow-hidden z-10 relative flex flex-col justify-end pointer-events-none">
        {/* Scrolling Chat Container */}
        <div className="flex flex-col gap-1.5 justify-end w-full">
          {chatMessages.slice(-3).map((msg) => (
            <div key={msg.id} className="bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-start gap-1.5 max-w-[90%] border-l-2 border-l-[#FFC227]">
              <span className="font-['Poppins'] font-bold text-[11px]" style={{ color: msg.color }}>
                {msg.user}:
              </span>
              <span className="font-['Poppins'] text-[11px] text-white/90 leading-tight">
                {msg.text}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';

export default function PullToRefresh({ onRefresh, isRefreshing, children, className = '' }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [pullState, setPullState] = useState('pending'); // 'pending' | 'pulling' | 'ready' | 'refreshing'
  const startY = useRef(0);
  const containerRef = useRef(null);
  const THRESHOLD = 70; // px pull distance required to trigger refresh

  const handleTouchStart = (e) => {
    if (containerRef.current && containerRef.current.scrollTop === 0 && pullState === 'pending') {
      startY.current = e.touches[0].pageY;
      setPullState('pulling');
    }
  };

  const handleTouchMove = (e) => {
    if (pullState === 'pending' || pullState === 'refreshing') return;
    
    const currentY = e.touches[0].pageY;
    const diff = currentY - startY.current;

    if (diff > 0 && containerRef.current && containerRef.current.scrollTop === 0) {
      // Apply exponential resistance so the pull feels elastic and premium
      const distance = Math.min(90, Math.pow(diff, 0.82));
      setPullDistance(distance);
      setPullState(distance >= THRESHOLD ? 'ready' : 'pulling');
      
      // Prevent browser default pull-to-refresh and scroll bounce
      if (e.cancelable) e.preventDefault();
    } else {
      setPullDistance(0);
      setPullState('pending');
    }
  };

  const handleTouchEnd = () => {
    if (pullState === 'ready') {
      setPullState('refreshing');
      setPullDistance(THRESHOLD);
      onRefresh();
    } else if (pullState === 'pulling') {
      setPullState('pending');
      setPullDistance(0);
    }
  };

  // Reset pull distance and state when query loading finishes
  useEffect(() => {
    if (!isRefreshing && pullState === 'refreshing') {
      // Smooth reset transition
      const timer = setTimeout(() => {
        setPullState('pending');
        setPullDistance(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isRefreshing, pullState]);

  // Determine indicator scale and opacity for smooth fade-in
  const hasPullingActivity = pullDistance > 0 || pullState === 'refreshing';
  const indicatorOpacity = hasPullingActivity ? 1 : 0;
  const indicatorScale = hasPullingActivity ? 1 : 0.6;

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-full overflow-y-auto select-none no-scrollbar ${className}`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Pull Indicator Area - Floating Overlay Style */}
      <div 
        className="absolute left-0 right-0 flex items-center justify-center pointer-events-none z-50 transition-all duration-200 ease-out"
        style={{
          top: '12px',
          transform: `translateY(${pullState === 'refreshing' ? 24 : Math.max(-50, pullDistance - 50)}px)`,
          opacity: indicatorOpacity,
          scale: `${indicatorScale}`,
        }}
      >
        <div className="bg-white border border-[#CF9914]/40 shadow-lg p-2.5 rounded-full flex items-center justify-center w-11 h-11 box-border">
          <svg 
            className={`w-5 h-5 text-[#7B2D2D] transition-transform duration-75 ${
              pullState === 'refreshing' ? 'animate-spin' : ''
            }`}
            style={{
              transform: pullState === 'refreshing' ? undefined : `rotate(${pullDistance * 4.5}deg)`
            }}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {pullState === 'refreshing' ? (
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            ) : (
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L4.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="currentColor"/>
            )}
          </svg>
        </div>
      </div>

      {/* Main Content Area - Stays Fixed (Floating Overlay Style) */}
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}

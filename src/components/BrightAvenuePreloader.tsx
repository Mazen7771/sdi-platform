import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onFinish?: () => void;
}

export const BrightAvenuePreloader: React.FC<PreloaderProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if session has already seen the preloader
    const hasSeen = sessionStorage.getItem('sdi_ba_preloader_seen');
    if (hasSeen) {
      setIsVisible(false);
      if (onFinish) onFinish();
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('sdi_ba_preloader_seen', 'true');
      if (onFinish) onFinish();
    }, 1400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className="p-loading" aria-hidden="true">
      <div className="p-loading__inner">
        {/* 3D Perspective Rotating Cube */}
        <div className="p-loading__logo-cube">
          <div className="p-loading__cube-box">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17" strokeLinecap="round" />
                <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.25" />
              </svg>
            </div>
          </div>
        </div>

        {/* Marquee Ticker Track */}
        <div className="p-loading__txt-wrapper">
          <div className="p-loading__txt-track text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-emerald-100/90 font-medium">
            <span>
              SUDANESE DOCTORS IN IRELAND • FORWARD WITH HOPE & EXCELLENCE • CLINICAL BRIDGE DUBLIN •&nbsp;
            </span>
            <span>
              SUDANESE DOCTORS IN IRELAND • FORWARD WITH HOPE & EXCELLENCE • CLINICAL BRIDGE DUBLIN •&nbsp;
            </span>
            <span>
              SUDANESE DOCTORS IN IRELAND • FORWARD WITH HOPE & EXCELLENCE • CLINICAL BRIDGE DUBLIN •&nbsp;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

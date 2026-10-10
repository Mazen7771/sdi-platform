import React, { useEffect, useState } from 'react';

export const MouseTracker: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointer devices (desktop/mouse)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button')
      ) {
        setIsHoveringInteractive(true);
      } else {
        setIsHoveringInteractive(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Smooth lag physics with requestAnimationFrame
  useEffect(() => {
    let animId: number;
    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    const loop = () => {
      setTrailingPos((prev) => ({
        x: lerp(prev.x, pos.x, 0.18),
        y: lerp(prev.y, pos.y, 0.18),
      }));
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [pos]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Halo */}
      <div
        className="mouse-follower-halo"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isHoveringInteractive ? '54px' : '36px',
          height: isHoveringInteractive ? '54px' : '36px',
          borderColor: isHoveringInteractive ? 'rgba(62, 173, 135, 0.9)' : 'rgba(62, 173, 135, 0.45)',
          backgroundColor: isHoveringInteractive ? 'rgba(62, 173, 135, 0.12)' : 'transparent',
        }}
      />
      {/* Precision Core Dot */}
      <div
        className="mouse-follower-dot"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />
    </>
  );
};

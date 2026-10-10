import React, { useEffect, useState } from 'react';

interface KineticScrollState {
  scrollY: number;
  velocity: number;
  direction: 'up' | 'down' | 'none';
  progress: number;
}

export function useKineticScroll(): KineticScrollState {
  const [scrollState, setScrollState] = useState<KineticScrollState>({
    scrollY: 0,
    velocity: 0,
    direction: 'none',
    progress: 0,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let animId: number;

    const handleScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const dt = Math.max(1, now - lastTime);
      const dy = currentScrollY - lastScrollY;

      const rawVelocity = (dy / dt) * 16.66; // Normalized to 60fps frame
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, currentScrollY / maxScroll));

      setScrollState({
        scrollY: currentScrollY,
        velocity: rawVelocity,
        direction: dy > 0 ? 'down' : dy < 0 ? 'up' : 'none',
        progress,
      });

      lastScrollY = currentScrollY;
      lastTime = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollState;
}

/**
 * Interactive 3D Tilt Card wrapper on mouse move (Presentation Feel)
 */
export const KineticTiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  depth?: number;
}> = ({ children, className = '', onClick, depth = 12 }) => {
  const [transform, setTransform] = useState('');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width - 0.5) * 2; // -1 to 1
    const yPct = (y / rect.height - 0.5) * 2; // -1 to 1

    const rotX = -yPct * depth;
    const rotY = xPct * depth;

    setTransform(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out relative overflow-hidden ${className}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      {/* Dynamic Specular Glare */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
          opacity: glare.opacity,
        }}
      />
      {children}
    </div>
  );
};

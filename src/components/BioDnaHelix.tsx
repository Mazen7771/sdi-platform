import React, { useRef, useEffect, useState } from 'react';

interface BioDnaHelixProps {
  lang: 'en' | 'ar';
}

export const BioDnaHelix: React.FC<BioDnaHelixProps> = ({ lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse tracker coords relative to container (-1 to 1) via ref to prevent re-renders
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const [mouseTelemetry, setMouseTelemetry] = useState<{ xPx: number; yPx: number; angle: number; velocity: number }>({
    xPx: 0,
    yPx: 0,
    angle: 0,
    velocity: 0,
  });

  // Track cursor within container - throttled telemetry
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;

    const normalizedX = ((xPx / rect.width) * 2 - 1);
    const normalizedY = ((yPx / rect.height) * 2 - 1);

    mousePosRef.current = { x: normalizedX, y: normalizedY, active: true };
    setMouseTelemetry({
      xPx: Math.round(xPx),
      yPx: Math.round(yPx),
      angle: Math.round(Math.atan2(normalizedY, normalizedX) * (180 / Math.PI)),
      velocity: Math.round(Math.hypot(normalizedX, normalizedY) * 100),
    });
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: 0, y: 0, active: false };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;
    let pulseTime = 0;
    let isVisible = true;

    // Smooth target coordinates for natural mouse tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      if (!canvas || !isVisible) return;
      const width = canvas.parentElement?.clientWidth || canvas.width;
      const height = canvas.parentElement?.clientHeight || canvas.height;

      ctx.clearRect(0, 0, width, height);

      const mPos = mousePosRef.current;
      // Interpolate current rotation with mouse position
      targetX = mPos.active ? mPos.x : Math.sin(pulseTime * 0.02) * 0.2;
      targetY = mPos.active ? mPos.y : Math.cos(pulseTime * 0.02) * 0.15;

      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      rotation += 0.022 + currentX * 0.015;
      pulseTime += 1;

      const centerX = width / 2;
      const centerY = height / 2;
      const totalPairs = 24;
      const helixRadius = Math.min(width, height) * 0.28;
      const helixHeight = height * 0.78;
      const pairSpacing = helixHeight / totalPairs;

      // Draw subtle background medical grid / radial bio-aura
      const gradient = ctx.createRadialGradient(
        centerX + currentX * 30,
        centerY + currentY * 20,
        10,
        centerX,
        centerY,
        width * 0.5
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.06)');
      gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.03)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw DNA base pairs and double-helix strands
      for (let i = 0; i < totalPairs; i++) {
        const y = centerY - helixHeight / 2 + i * pairSpacing;
        const angle = rotation + (i * 0.32) + (currentX * 0.8);
        const pitchTilt = currentY * 25;

        // 3D projection for Strand A
        const x1 = centerX + Math.cos(angle) * (helixRadius * (1 + currentY * 0.2));
        const z1 = Math.sin(angle);
        const y1 = y + Math.sin(angle) * pitchTilt;

        // 3D projection for Strand B (phase shifted by PI)
        const x2 = centerX + Math.cos(angle + Math.PI) * (helixRadius * (1 + currentY * 0.2));
        const z2 = Math.sin(angle + Math.PI);
        const y2 = y + Math.sin(angle + Math.PI) * pitchTilt;

        // Depth perspective factors
        const scale1 = 0.65 + (z1 + 1) * 0.25;
        const scale2 = 0.65 + (z2 + 1) * 0.25;
        const alphaConnector = 0.15 + ((z1 + 1) / 2) * 0.35;

        // Draw connecting hydrogen base-pair bond
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(51, 65, 85, ${alphaConnector})`;
        ctx.lineWidth = 1.2 * ((scale1 + scale2) / 2);
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Base pair nucleotide bead midway
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        ctx.beginPath();
        ctx.arc(midX, midY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
        ctx.fill();

        // Strand 1 Nucleotide Sphere (Adenine / Thymine in Emerald & Slate)
        ctx.beginPath();
        ctx.arc(x1, y1, 4.8 * scale1, 0, Math.PI * 2);
        ctx.fillStyle = z1 > 0 ? '#0f172a' : '#64748b'; // slate-900 front, slate-500 back
        ctx.shadowColor = 'rgba(15, 23, 42, 0.25)';
        ctx.shadowBlur = z1 > 0 ? 6 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner glowing core
        if (z1 > 0) {
          ctx.beginPath();
          ctx.arc(x1 - 1, y1 - 1, 1.8 * scale1, 0, Math.PI * 2);
          ctx.fillStyle = '#10b981'; // emerald pulse
          ctx.fill();
        }

        // Strand 2 Nucleotide Sphere (Cytosine / Guanine in Emerald / Royal Slate)
        ctx.beginPath();
        ctx.arc(x2, y2, 4.8 * scale2, 0, Math.PI * 2);
        ctx.fillStyle = z2 > 0 ? '#1e293b' : '#94a3b8';
        ctx.shadowColor = 'rgba(16, 185, 129, 0.3)';
        ctx.shadowBlur = z2 > 0 ? 6 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (z2 > 0) {
          ctx.beginPath();
          ctx.arc(x2 - 1, y2 - 1, 1.8 * scale2, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8'; // sky blue core
          ctx.fill();
        }
      }

      // Draw interactive floating particle beacons responding to mouse
      if (mPos.active) {
        const mouseCanvasX = (mPos.x + 1) * 0.5 * width;
        const mouseCanvasY = (mPos.y + 1) * 0.5 * height;

        // Reticle ring around pointer
        ctx.beginPath();
        ctx.arc(mouseCanvasX, mouseCanvasY, 14, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouseCanvasX, mouseCanvasY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-2xl overflow-hidden aspect-[16/10] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 shadow-2xl group select-none cursor-crosshair"
    >
      {/* 3D Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Top Telemetry Header HUD */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
        <div className="optical-glass-pill px-3 py-1 rounded-full flex items-center gap-2 text-[10px] font-mono text-slate-100 font-semibold shadow-xs bg-slate-900/80 border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{lang === 'ar' ? 'المصفوفة البيولوجية ثلاثية الأبعاد // نشطة' : 'BIOLOGICAL DNA HELIX // ACTIVE 3D'}</span>
        </div>
        <div className="optical-glass-pill px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-300 font-semibold shadow-xs bg-slate-900/80 border border-slate-700">
          GENOME #SDI-IE-2026
        </div>
      </div>

      {/* Real-time Dynamic Mouse Tracker HUD Display */}
      <div className="absolute top-12 left-3 pointer-events-none z-10 hidden sm:flex flex-col gap-1 p-2 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-300 shadow-lg">
        <div className="flex items-center gap-2 font-bold text-emerald-400">
          <span className="material-symbols-outlined text-[13px]">track_changes</span>
          <span>BIO-TELEMETRY TRACKER</span>
        </div>
        <div className="flex items-center gap-3 text-[9px] text-slate-400">
          <span>X: <span className="text-white font-bold">{mouseTelemetry.xPx}px</span></span>
          <span>Y: <span className="text-white font-bold">{mouseTelemetry.yPx}px</span></span>
          <span>AZ: <span className="text-emerald-400 font-bold">{mouseTelemetry.angle}°</span></span>
          <span>V: <span className="text-cyan-400 font-bold">{mouseTelemetry.velocity}%</span></span>
        </div>
      </div>

      {/* Floating Interactive Guide */}
      <div className="absolute top-12 right-3 pointer-events-none z-10">
        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-xs">
          <span className="material-symbols-outlined text-[11px]">pan_tool_alt</span>
          <span>{lang === 'ar' ? 'حرك المؤشر للتفاعل ثلاثي الأبعاد' : 'Move cursor to rotate 3D helix'}</span>
        </span>
      </div>

      {/* Floating Biological Vitals HUD Bar at bottom */}
      <div className="absolute bottom-3 inset-x-3 optical-glass rounded-xl p-3 shadow-xl flex items-center justify-between text-xs bg-slate-900/90 border border-slate-700/80 text-white backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <span className="material-symbols-outlined text-[20px] animate-pulse">biotech</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold font-mono text-xs">
                {lang === 'ar' ? 'التسلسل الجيني السريري' : 'Molecular Dynamics'}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                SYNCHRONIZED
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {lang === 'ar' ? 'نموذج محاكاة البروتينات والأحماض النووية' : 'HSE Medical Faculty Simulation'}
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-[9px] uppercase font-mono text-slate-400 block font-semibold">
            {lang === 'ar' ? 'الحالة الحيوية' : 'Genomic Integrity'}
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono text-xs justify-end">
            <span className="material-symbols-outlined text-[14px]">verified</span> 99.98% PURE
          </span>
        </div>

        <div className="text-right font-mono">
          <span className="text-[9px] uppercase text-slate-400 block font-semibold">
            {lang === 'ar' ? 'دوران الحلزون' : 'Phase Velocity'}
          </span>
          <span className="text-cyan-400 font-bold text-xs">3.4 nm / Pitch</span>
        </div>
      </div>
    </div>
  );
};

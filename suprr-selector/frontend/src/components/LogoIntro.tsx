import React, { useEffect, useRef, useState } from 'react';

interface LogoIntroProps {
  onComplete: () => void;
}

export const LogoIntro: React.FC<LogoIntroProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 556;
    const H = 600;

    // Load the exact transparent white crest extracted from user's Image 2
    const img = new Image();
    img.src = '/rr-crest-white-transparent.png';

    // Offscreen mask canvas for dynamic painting
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = W;
    maskCanvas.height = H;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    // Realistic stroke trajectories following the exact anatomy of the Rajasthan Royals crest
    const strokePaths: Array<Array<{ x: number; y: number }>> = [
      // 1. Crown Top Finial (Diamond & cross)
      [
        { x: 280, y: 55 },
        { x: 280, y: 95 },
      ],
      // 2. Crown Scalloped Ermine Dome Left
      [
        { x: 280, y: 95 },
        { x: 232, y: 104 },
        { x: 195, y: 155 },
        { x: 235, y: 168 },
        { x: 280, y: 168 },
      ],
      // 3. Crown Scalloped Ermine Dome Right
      [
        { x: 280, y: 95 },
        { x: 328, y: 104 },
        { x: 365, y: 155 },
        { x: 325, y: 168 },
        { x: 280, y: 168 },
      ],
      // 4. Crown Coronet & Headband Pearls
      [
        { x: 188, y: 176 },
        { x: 218, y: 138 },
        { x: 248, y: 166 },
        { x: 280, y: 132 },
        { x: 312, y: 166 },
        { x: 342, y: 138 },
        { x: 372, y: 176 },
        { x: 188, y: 176 },
        { x: 372, y: 176 },
      ],
      // 5. Central Royal Scepter / Pillar
      [
        { x: 280, y: 178 },
        { x: 280, y: 418 },
      ],
      // 6. Left Stylized 'R' Monogram Loop & Sweep
      [
        { x: 280, y: 215 },
        { x: 232, y: 215 },
        { x: 194, y: 236 },
        { x: 182, y: 272 },
        { x: 214, y: 295 },
        { x: 280, y: 295 },
        { x: 242, y: 336 },
        { x: 202, y: 372 },
        { x: 172, y: 396 },
        { x: 164, y: 418 },
      ],
      // 7. Right Stylized 'R' Monogram Loop & Sweep (Mirrored)
      [
        { x: 280, y: 215 },
        { x: 328, y: 215 },
        { x: 366, y: 236 },
        { x: 378, y: 272 },
        { x: 346, y: 295 },
        { x: 280, y: 295 },
        { x: 318, y: 336 },
        { x: 358, y: 372 },
        { x: 388, y: 396 },
        { x: 396, y: 418 },
      ],
      // 8. "RAJASTHAN" Classical Typography Sweep
      [
        { x: 140, y: 450 },
        { x: 420, y: 450 },
      ],
      // 9. "ROYALS" Bold Imperial Typography Sweep
      [
        { x: 120, y: 510 },
        { x: 450, y: 510 },
      ],
    ];

    // Compute cumulative segment lengths
    let totalDist = 0;
    const pathLengths = strokePaths.map((pts) => {
      let len = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const dx = pts[i + 1].x - pts[i].x;
        const dy = pts[i + 1].y - pts[i].y;
        len += Math.sqrt(dx * dx + dy * dy);
      }
      totalDist += len;
      return len;
    });

    let animationFrameId: number;
    let startTime: number | null = null;
    const DRAW_DURATION = 2100; // 2.1s drawing time

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / DRAW_DURATION);
      const targetDist = progress * totalDist;

      // Clear main canvas and offscreen mask
      ctx.clearRect(0, 0, W, H);
      maskCtx.clearRect(0, 0, W, H);

      maskCtx.lineCap = 'round';
      maskCtx.lineJoin = 'round';
      maskCtx.strokeStyle = '#ffffff';

      let currentDist = 0;
      let penTip: { x: number; y: number } | null = null;

      for (let pIdx = 0; pIdx < strokePaths.length; pIdx++) {
        const pts = strokePaths[pIdx];
        const pLen = pathLengths[pIdx];

        // Wide brush width to ensure full unmasking of the exact artwork
        const brushWidth = pIdx >= 7 ? 68 : pIdx >= 5 ? 44 : 50;
        maskCtx.lineWidth = brushWidth;

        if (currentDist + pLen <= targetDist) {
          // Fully unmasked segment
          maskCtx.beginPath();
          maskCtx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            maskCtx.lineTo(pts[i].x, pts[i].y);
          }
          maskCtx.stroke();
          currentDist += pLen;
          penTip = pts[pts.length - 1];
        } else if (currentDist < targetDist) {
          // In-progress segment
          const remaining = targetDist - currentDist;
          maskCtx.beginPath();
          maskCtx.moveTo(pts[0].x, pts[0].y);

          let segDist = 0;
          for (let i = 0; i < pts.length - 1; i++) {
            const dx = pts[i + 1].x - pts[i].x;
            const dy = pts[i + 1].y - pts[i].y;
            const subLen = Math.sqrt(dx * dx + dy * dy);

            if (segDist + subLen <= remaining) {
              maskCtx.lineTo(pts[i + 1].x, pts[i + 1].y);
              segDist += subLen;
              penTip = pts[i + 1];
            } else {
              const frac = (remaining - segDist) / subLen;
              const curX = pts[i].x + dx * frac;
              const curY = pts[i].y + dy * frac;
              maskCtx.lineTo(curX, curY);
              penTip = { x: curX, y: curY };
              break;
            }
          }
          maskCtx.stroke();
          break;
        }
      }

      // If drawing has finished, fully uncover the entire crest
      if (progress >= 1.0) {
        maskCtx.fillStyle = '#ffffff';
        maskCtx.fillRect(0, 0, W, H);
      }

      // Mask the exact transparent white crest from Image 2
      maskCtx.globalCompositeOperation = 'source-in';
      maskCtx.drawImage(img, 0, 0, W, H);
      maskCtx.globalCompositeOperation = 'source-over';

      // Blit masked authentic image onto main canvas
      ctx.drawImage(maskCanvas, 0, 0);

      // Render glowing artist pen sparkle at the active drawing tip
      if (penTip && progress < 1.0) {
        ctx.save();
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(penTip.x, penTip.y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = '#fff5a0';
        ctx.shadowBlur = 24;
        ctx.fillStyle = '#fffbe0';
        ctx.beginPath();
        ctx.arc(penTip.x, penTip.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (progress < 1.0 || elapsed < 3500) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    img.onload = () => {
      animationFrameId = requestAnimationFrame(render);
    };

    // Transition timers
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3700);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#e50693' }}
    >
      {/* Exact Canvas Drawing Viewport */}
      <div className="relative flex flex-col items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          width={556}
          height={600}
          className="w-64 h-[280px] sm:w-72 sm:h-[315px] md:w-80 md:h-[350px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
        />

        {/* Brand Tagline */}
        <div className="mt-6 text-center animate-fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/35 backdrop-blur-sm shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-white font-mono">
              SupeRR Selector • Season 2
            </span>
          </div>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 px-5 py-2 rounded-full bg-black/25 hover:bg-black/40 text-xs font-semibold text-white border border-white/30 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 shadow cursor-pointer flex items-center space-x-1.5"
      >
        <span>Skip</span>
        <span>➔</span>
      </button>
    </div>
  );
};

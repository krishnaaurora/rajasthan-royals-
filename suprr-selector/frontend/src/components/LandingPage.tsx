import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Target, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  FileText,
  Sliders,
  Activity,
  Layers
} from 'lucide-react';

interface LandingPageProps {
  metadata: any;
  topBatters: any[];
  topBowlers: any[];
  onEnterCommandCentre: () => void;
  onNavigate: (view: string) => void;
  onReplayIntro: () => void;
  onSelectPlayer: (player: any, type: 'batter' | 'bowler') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  metadata: _metadata,
  topBatters,
  topBowlers,
  onEnterCommandCentre,
  onNavigate,
  onReplayIntro,
  onSelectPlayer,
}) => {
  const [ballArrived, setBallArrived] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const [arenaScrollY, setArenaScrollY] = useState(0);

  useEffect(() => {
    // Trigger ball arrival halo at 1.4s
    const timer = setTimeout(() => {
      setBallArrived(true);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // Parallax Scroll Tracking for Hero & Arena Sections & Navbar Transparency
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setScrollY(currentY);
          setIsScrolled(currentY > 40);

          if (arenaRef.current) {
            const rect = arenaRef.current.getBoundingClientRect();
            const winH = window.innerHeight;
            // Progress from 0 (at bottom) to 1 (centered) to 2 (scrolled past)
            const progress = (winH - rect.top) / (winH + rect.height);
            setArenaScrollY(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const top1Batter = topBatters[0];
  const top1Bowler = topBowlers[0];

  // Hero Parallax Transitions as user scrolls down
  const heroTranslateY = Math.min(160, scrollY * 0.28);
  const heroScale = Math.max(0.94, 1 - scrollY * 0.00015);
  const heroOpacity = Math.max(0.05, 1 - scrollY / 550);
  const scrollPromptOpacity = Math.max(0, 1 - scrollY / 120);

  // Multi-plane parallax offsets for Arena Section
  const normOffset = Math.max(-0.5, Math.min(0.5, arenaScrollY - 0.5));
  const arenaStageTranslateY = normOffset * -24;
  const bgSilhouetteY = normOffset * 48;

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#1E293B] selection:bg-[#FF2E93] selection:text-white font-sans overflow-x-hidden">
      {/* =========================================================================
          1. TOP NAVIGATION BAR (Exact Match to Image 1)
         ========================================================================= */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 py-3 px-4 sm:px-6 lg:px-8 ${
          isScrolled
            ? 'bg-[#FFF9F2]/95 backdrop-blur-md border-b border-[#F0E4D5] shadow-sm'
            : 'bg-[#FFF9F2]/80 backdrop-blur-sm border-b border-[#F0E4D5]/40'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Left: Authentic Pink RR Crest + SuperRR Pressure Intelligence Lab */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 select-none">
            <img
              src="/rr-crest-pink.png"
              alt="Rajasthan Royals Crest"
              className="h-7 sm:h-8 w-auto object-contain rounded-md shadow-sm"
            />
            <span className="font-bold text-sm sm:text-base text-[#0F172A] tracking-tight">
              SuperRR Pressure Intelligence Lab
            </span>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. CINEMATIC ANIMATED HERO SECTION (Exact Reference Illustration Layout)
         ========================================================================= */}
      <section className="relative min-h-[620px] lg:min-h-[700px] flex flex-col items-center justify-center pt-8 pb-12 px-3 sm:px-6 lg:px-8 overflow-visible select-none">

        {/* Master Illustrated Scene Container (Exact 1024 x 440 Aspect Ratio with Parallax Scroll) */}
        <div 
          className="relative w-full max-w-5xl lg:max-w-6xl aspect-[1024/440] flex items-center justify-center overflow-visible transition-transform duration-100 ease-out will-change-transform"
          style={{
            transform: `translateY(${heroTranslateY}px) scale(${heroScale})`,
            opacity: heroOpacity,
          }}
        >

          {/* SVG Layer: Golden Radial Rays + Central Pink Crest Outline + Ball Trajectory */}
          <svg
            viewBox="0 0 1024 440"
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          >
            {/* Defs: Radial gradients & filters */}
            <defs>
              <filter id="softPinkGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. Golden Radial Rays bursting outwards from center (512, 237) (Timeline: 0.5s) */}
            <g stroke="#F8B4D9" strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
              {Array.from({ length: 32 }).map((_, i) => {
                const angle = (i * 360) / 32;
                // Avoid lines overlapping central crest
                if (angle > 72 && angle < 108) return null;
                const rad = (angle * Math.PI) / 180;
                const r1 = 205 + (i % 2) * 18;
                const r2 = 365 + (i % 3) * 32;
                const x1 = 512 + r1 * Math.cos(rad);
                const y1 = 237 + (r1 * 0.72) * Math.sin(rad);
                const x2 = 512 + r2 * Math.cos(rad);
                const y2 = 237 + (r2 * 0.72) * Math.sin(rad);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className="anim-radial-ray"
                    style={{ animationDelay: `${(0.48 + i * 0.02).toFixed(2)}s` }}
                  />
                );
              })}
            </g>

            {/* Decorative Golden Dots at Ray Terminals (Timeline: 0.8s) */}
            <g fill="#EAB308" opacity="0.8">
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 360) / 16 + 10;
                if (angle > 68 && angle < 112) return null;
                const rad = (angle * Math.PI) / 180;
                const r = 380 + (i % 2) * 20;
                const cx = 512 + r * Math.cos(rad);
                const cy = 237 + (r * 0.72) * Math.sin(rad);
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="1.8"
                    className="anim-dot-terminal"
                    style={{ animationDelay: `${(0.82 + i * 0.03).toFixed(2)}s` }}
                  />
                );
              })}
            </g>

            {/* 2. Central Pink Crest Signature Outline (Timeline: 0.3s Draw + Scale) */}
            <path
              d="M 512,45 C 570,45 680,175 714,215 C 725,228 725,246 714,259 C 680,299 570,429 512,429 C 454,429 344,299 310,259 C 299,246 299,228 310,215 C 344,175 454,45 512,45 Z"
              fill="#FFFFFF"
              fillOpacity="1"
              stroke="#FF2E93"
              strokeWidth="3.5"
              className="anim-crest-outline"
            />


          </svg>

          {/* Soft Pink Glow behind Central Crest */}
          <div
            className="absolute rounded-full pointer-events-none blur-2xl z-0 anim-crest-glow"
            style={{
              left: '28%',
              top: '8%',
              width: '44%',
              height: '84%',
              background: 'radial-gradient(ellipse at center, rgba(255,46,147,0.22) 0%, rgba(234,179,8,0.18) 45%, transparent 75%)',
            }}
          />

          {/* =====================================================================
              CENTRAL CREST CONTENT (Typography, Crest Logo, CTA Button)
             ===================================================================== */}
          <div
            className="absolute z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 anim-crest-content"
            style={{
              left: '28%',
              top: '8%',
              width: '44%',
              height: '84%',
            }}
          >
            {/* Official Rajasthan Royals Crest at Top of Badge */}
            <div className="flex justify-center mb-1.5 anim-crest-logo">
              <img
                src="/rr-crest-pink.png"
                alt="Rajasthan Royals Crest"
                className="h-12 sm:h-16 md:h-18 w-auto object-contain rounded-xl shadow-md shadow-pink-500/20"
              />
            </div>

            {/* Main Hook Headline — Two-Stage Upward Reveal (Timeline: 0.6s & 0.75s) */}
            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-tight space-y-0.5">
              <span className="block anim-headline-line-1">
                Who <span className="text-[#FF2E93]">Rises</span> When the
              </span>
              <span className="block anim-headline-line-2">
                <span className="text-[#FF2E93]">Game Is</span> on the Line?
              </span>
            </h1>

            {/* Subtitle (Timeline: 0.8s Reveal) */}
            <p className="text-[10px] sm:text-xs md:text-sm text-[#475569] max-w-xs sm:max-w-sm mx-auto leading-relaxed font-medium mt-2 anim-hero-subtitle">
              AI-Powered Cricket Intelligence to Identify Reliable Performers Under Pressure
            </p>

            {/* CTA Buttons (Timeline: 1.1s Entrance) */}
            <div className="pt-3 sm:pt-4 flex items-center justify-center anim-hero-cta">
              <button
                onClick={onEnterCommandCentre}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#FF2E93] to-[#E50693] hover:from-[#ff409f] hover:to-[#f0149c] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-pink-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2 group cursor-pointer"
              >
                <span>Enter Lab</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1 font-bold">→</span>
              </button>
            </div>
          </div>

          {/* =====================================================================
              ANIMATED CRICKET DOODLES & ANALYTICS VISUALIZATIONS (Fully Dynamic)
             ===================================================================== */}

          {/* LEFT WING: */}
          {/* 1. Floodlight Tower */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '1.5%', top: '5.7%', width: '9.8%', animationDelay: '0.85s' }}
          >
            <img src="/doodle-floodlight.png?v=2" alt="Stadium Floodlight" className="w-full h-auto object-contain" />
          </div>

          {/* 2. Batter with bat */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '12.2%', top: '5.7%', width: '14.6%', animationDelay: '0.9s' }}
          >
            <img src="/doodle-batter.png?v=2" alt="Cricket Batter" className="w-full h-auto object-contain anim-batter-subtle" />
          </div>

          {/* 3. Analytics Bar Chart Card */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none bg-white/90 backdrop-blur-sm border border-[#FF2E93]/25 rounded-xl p-1.5 sm:p-2 shadow-sm shadow-pink-500/10 flex items-end space-x-1 sm:space-x-1.5 h-10 sm:h-12 w-10 sm:w-14 justify-center"
            style={{ left: '6.0%', top: '26.0%', animationDelay: '1.2s' }}
          >
            <div className="w-1.5 sm:w-2 bg-[#FF2E93]/70 rounded-t h-[40%] anim-bar-rise-1" />
            <div className="w-1.5 sm:w-2 bg-[#FF2E93]/85 rounded-t h-[70%] anim-bar-rise-2" />
            <div className="w-1.5 sm:w-2 bg-[#FF2E93] rounded-t h-[100%] anim-bar-rise-3" />
          </div>

          {/* 4. Cricket Ball */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '15.1%', top: '35.2%', width: '5.9%', animationDelay: '1.0s' }}
          >
            <img src="/doodle-ball.png?v=2" alt="Cricket Ball" className="w-full h-auto object-contain anim-ball-float" />
          </div>

          {/* 5. Cricket Wickets / Stumps */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '21.3%', top: '40.9%', width: '5.6%', animationDelay: '1.05s' }}
          >
            <img src="/doodle-stumps.png?v=2" alt="Cricket Stumps" className="w-full h-auto object-contain" />
          </div>

          {/* 6. Analytics Line Chart Card */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none bg-white/90 backdrop-blur-sm border border-[#FF2E93]/25 rounded-xl p-1.5 sm:p-2 shadow-sm shadow-pink-500/10 flex items-center justify-center h-10 sm:h-12 w-14 sm:w-18"
            style={{ left: '4.0%', top: '38.0%', animationDelay: '1.25s' }}
          >
            <svg viewBox="0 0 50 25" className="w-full h-full">
              <path d="M 5,20 L 18,12 L 32,15 L 45,5" fill="none" stroke="#FF2E93" strokeWidth="2" strokeLinecap="round" className="anim-line-progress" />
              <circle cx="5" cy="20" r="2" fill="#FF2E93" className="anim-dot-line-1" />
              <circle cx="18" cy="12" r="2" fill="#FF2E93" className="anim-dot-line-2" />
              <circle cx="32" cy="15" r="2" fill="#FF2E93" className="anim-dot-line-3" />
              <circle cx="45" cy="5" r="2" fill="#FF2E93" className="anim-dot-line-4" />
            </svg>
          </div>

          {/* 7. Bowler celebrating / delivering */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '2.4%', top: '50.0%', width: '15.6%', animationDelay: '0.95s' }}
          >
            <img src="/doodle-bowler.png?v=2" alt="Cricket Bowler" className="w-full h-auto object-contain anim-bowler-subtle" />
          </div>

          {/* 8. Cricket Helmet */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '19.5%', top: '63.6%', width: '7.8%', animationDelay: '1.1s' }}
          >
            <img src="/doodle-helmet.png?v=2" alt="Cricket Helmet" className="w-full h-auto object-contain anim-helmet-tilt" />
          </div>

          {/* 9. Sawai Mansingh Stadium (z-20 cleanly overlaps bowler waist) */}
          <div
            className="absolute z-20 anim-illustr-in pointer-events-none select-none"
            style={{ left: '1.0%', bottom: '0%', width: '29.3%', animationDelay: '0.9s' }}
          >
            <img src="/doodle-stadium.png?v=2" alt="Sawai Mansingh Stadium" className="w-full h-auto object-contain" />
          </div>

          {/* RIGHT WING: */}
          {/* 10. Leaping Catcher / Wicketkeeper */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '75.2%', top: '4.5%', width: '15.1%', animationDelay: '0.9s' }}
          >
            <img src="/doodle-catcher.png?v=2" alt="Cricket Catcher" className="w-full h-auto object-contain anim-catcher-float" />
          </div>

          {/* 11. Flying Cricket Ball */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '72.8%', top: '6.8%', width: '4.4%', animationDelay: '1.0s' }}
          >
            <img src="/doodle-flying-ball.png?v=2" alt="Flying Cricket Ball" className="w-full h-auto object-contain anim-ball-float" />
          </div>

          {/* 12. Golden Trophy */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '69.1%', top: '21.6%', width: '8.0%', animationDelay: '1.05s' }}
          >
            <img src="/doodle-trophy.png?v=2" alt="Championship Trophy" className="w-full h-auto object-contain anim-trophy-float" />
          </div>

          {/* 13. Scouting Clipboard */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '86.9%', top: '34.1%', width: '7.3%', animationDelay: '1.1s' }}
          >
            <img src="/doodle-clipboard.png?v=2" alt="Scouting Clipboard" className="w-full h-auto object-contain" />
          </div>

          {/* 14. Team Squad Icon */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '77.1%', top: '38.6%', width: '6.3%', animationDelay: '1.15s' }}
          >
            <img src="/doodle-team.png?v=2" alt="Team Squad" className="w-full h-auto object-contain" />
          </div>

          {/* 15. Analytics Mini Bar Card */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none bg-white/90 backdrop-blur-sm border border-[#FF2E93]/25 rounded-xl p-1.5 sm:p-2 shadow-sm shadow-pink-500/10 flex items-end space-x-1 sm:space-x-1.5 h-9 sm:h-11 w-9 sm:w-12 justify-center"
            style={{ left: '81.5%', top: '48.0%', animationDelay: '1.3s' }}
          >
            <div className="w-1.5 bg-[#FF2E93]/70 rounded-t h-[45%] anim-bar-rise-1" />
            <div className="w-1.5 bg-[#FF2E93]/85 rounded-t h-[65%] anim-bar-rise-2" />
            <div className="w-1.5 bg-[#FF2E93] rounded-t h-[95%] anim-bar-rise-3" />
          </div>

          {/* 16. Analytics Laptop */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '68.8%', top: '52.3%', width: '10.7%', animationDelay: '1.15s' }}
          >
            <img src="/doodle-laptop.png?v=2" alt="Analytics Laptop" className="w-full h-auto object-contain" />
          </div>

          {/* 17. Analytics Magnifying Glass */}
          <div
            className="absolute z-10 anim-illustr-in pointer-events-none select-none"
            style={{ left: '85.9%', top: '56.8%', width: '9.8%', animationDelay: '1.2s' }}
          >
            <img src="/doodle-search.png?v=2" alt="Magnifying Glass Scouting" className="w-full h-auto object-contain anim-glass-motion" />
          </div>

          {/* 18. Hawa Mahal Palace */}
          <div
            className="absolute z-20 anim-illustr-in pointer-events-none select-none"
            style={{ left: '65.4%', bottom: '0%', width: '32.2%', animationDelay: '0.9s' }}
          >
            <img src="/doodle-hawamahal.png?v=2" alt="Hawa Mahal Jaipur" className="w-full h-auto object-contain" />
          </div>

        </div>

        {/* Smooth Bouncing Scroll Invitation (Fades smoothly on scroll) */}
        <div
          onClick={() => document.getElementById('arena')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-6 flex flex-col items-center space-y-1 transition-opacity duration-150 cursor-pointer z-30"
          style={{
            opacity: scrollPromptOpacity,
            pointerEvents: scrollPromptOpacity <= 0.05 ? 'none' : 'auto',
          }}
        >
          <span className="text-[11px] font-bold text-[#FF2E93] uppercase tracking-widest font-mono">
            Scroll for Interactive Arena
          </span>
          <ChevronDown className="w-4 h-4 text-[#FF2E93] animate-bounce" />
        </div>

      </section>

      {/* =========================================================================
          3. INTERACTIVE 3D PRESSURE INTELLIGENCE ARENA (Parallax Scroll Effect)
         ========================================================================= */}
      <section
        id="arena"
        ref={arenaRef}
        className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
      >
        {/* Parallax Background Ambient Silhouettes */}
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-100 ease-out z-0 opacity-40"
          style={{ transform: `translateY(${bgSilhouetteY}px)` }}
        >
          <img
            src="/silhouette-palace-left.png"
            alt="Jaipur Palace"
            className="absolute -bottom-6 left-0 w-72 h-auto opacity-35"
          />
          <img
            src="/silhouette-palace-right.png"
            alt="Jaipur Palace"
            className="absolute -bottom-6 right-0 w-72 h-auto opacity-35"
          />
        </div>

        {/* Section Header */}
        <div className="relative z-10 text-center space-y-2 mb-12">
          <span className="text-xs font-bold text-[#FF2E93] uppercase tracking-wider font-mono">
            Tactical Decision Support Arena
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Pressure Intelligence Hub
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mx-auto">
            Interactive overview of our core analytical modules. Select any card to explore deep-dive player ratings and situational models.
          </p>
        </div>

        {/* Responsive 3-Column Arena Stage (Unified Connected Command Hub) */}
        <div 
          className="relative z-10 max-w-6xl mx-auto transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${arenaStageTranslateY}px)` }}
        >
          {/* Integrated Circuit Connection Lines Overlay (Desktop lg+) */}
          <svg
            viewBox="0 0 1152 523"
            className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="connGoldPink" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EAB308" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#FF2E93" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#EAB308" stopOpacity="0.85" />
              </linearGradient>
              <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connection 1: Batter Intelligence Card -> Stadium Left Floodlight */}
            <path
              d="M 270,131 C 320,131 345,110 382,110"
              fill="none"
              stroke="url(#connGoldPink)"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.85"
            />
            <circle cx="270" cy="131" r="3.5" fill="#EAB308" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="382" cy="110" r="4.5" fill="#FF2E93" stroke="#FDE047" strokeWidth="2" filter="url(#pinGlow)" />

            {/* Connection 2: Pressure Simulator Card -> Stadium Lower-Left Rim */}
            <path
              d="M 270,360 C 330,360 360,240 405,230"
              fill="none"
              stroke="url(#connGoldPink)"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.85"
            />
            <circle cx="270" cy="360" r="3.5" fill="#EAB308" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="405" cy="230" r="4.5" fill="#FF2E93" stroke="#FDE047" strokeWidth="2" filter="url(#pinGlow)" />

            {/* Connection 3: Bowler Intelligence Card -> Stadium Right Floodlight */}
            <path
              d="M 882,139 C 832,139 805,110 770,110"
              fill="none"
              stroke="url(#connGoldPink)"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.85"
            />
            <circle cx="882" cy="139" r="3.5" fill="#EAB308" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="770" cy="110" r="4.5" fill="#FF2E93" stroke="#FDE047" strokeWidth="2" filter="url(#pinGlow)" />

            {/* Connection 4: Reliability & Validation Card -> Stadium Lower-Right Rim */}
            <path
              d="M 882,350 C 822,350 790,240 747,230"
              fill="none"
              stroke="url(#connGoldPink)"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.85"
            />
            <circle cx="882" cy="350" r="3.5" fill="#EAB308" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="747" cy="230" r="4.5" fill="#FF2E93" stroke="#FDE047" strokeWidth="2" filter="url(#pinGlow)" />

            {/* Connection 5: Stadium Bottom Rim Pin -> RR Scouting Report Card */}
            <line
              x1="576"
              y1="282"
              x2="576"
              y2="346"
              stroke="url(#connGoldPink)"
              strokeWidth="2.5"
              opacity="0.9"
            />
            <circle cx="576" cy="282" r="5" fill="#EAB308" stroke="#FF2E93" strokeWidth="2" filter="url(#pinGlow)" />
            <circle cx="576" cy="346" r="4" fill="#FF2E93" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">

            {/* Left Wing (Cards 1 & 3): 3 cols on lg */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* CARD 1: BATTER INTELLIGENCE */}
              <div
                id="batters-section"
                onMouseEnter={() => setActiveCard('batters')}
                onMouseLeave={() => setActiveCard(null)}
                onClick={() => onNavigate('batters')}
                className="w-full bg-white/95 backdrop-blur-md border border-[#F0E4D5] hover:border-[#FF2E93] rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FF2E93]/10 text-[#FF2E93] flex items-center justify-center font-bold">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-[#0F172A] group-hover:text-[#FF2E93] transition">
                        Batter Intelligence
                      </h3>
                      <span className="text-[10px] font-bold text-[#FF2E93] uppercase font-mono">
                        Top 10 Pressure Batters
                      </span>
                    </div>
                  </div>
                  <img
                    src="/card-batter.png"
                    alt="Batter in RR Kit"
                    className="w-12 h-auto object-contain rounded-lg group-hover:scale-110 transition-transform"
                  />
                </div>
                <p className="text-xs text-[#64748B] mt-2.5 leading-relaxed">
                  Find batters who elevate their scoring performance when match equity is volatile.
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#F8EFE6] flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#94A3B8]">#1 Clutch Rank</span>
                  <span className="text-[#0F172A] group-hover:text-[#FF2E93] flex items-center space-x-1">
                    <span>Tristan Stubbs (+75.66 ΔSR)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* CARD 3: PRESSURE SCENARIO SIMULATOR */}
              <div
                id="simulator-section"
                onMouseEnter={() => setActiveCard('simulator')}
                onMouseLeave={() => setActiveCard(null)}
                onClick={() => onNavigate('simulator')}
                className="w-full bg-white/95 backdrop-blur-md border border-[#F0E4D5] hover:border-amber-500 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-[#0F172A] group-hover:text-amber-600 transition">
                        Pressure Simulator
                      </h3>
                      <span className="text-[10px] font-bold text-amber-600 uppercase font-mono">
                        Monte Carlo Engine
                      </span>
                    </div>
                  </div>
                  <img
                    src="/card-laptop.png"
                    alt="Simulator Laptop"
                    className="w-13 h-auto object-contain rounded-lg group-hover:scale-110 transition-transform"
                  />
                </div>
                <p className="text-xs text-[#64748B] mt-2.5 leading-relaxed">
                  Test hypothetical match situations and evaluate how pressure changes the expected outcome.
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#F8EFE6] flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#94A3B8]">Dual-Innings Engine</span>
                  <span className="text-[#0F172A] group-hover:text-amber-600 flex items-center space-x-1">
                    <span>2,500 Delivery Runs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Center Stage (3D Clean Stadium + Scouting Report): 6 cols on lg */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
              {/* 3D Clean Stadium with depth shadow */}
              <div className="w-full max-w-lg mx-auto flex flex-col items-center select-none">
                <div className="relative">
                  <img
                    src="/stadium-3d-clean.png"
                    alt="Rajasthan Royals 3D Stadium Hub"
                    className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle pedestal shadow */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-black/10 rounded-full blur-xl -z-10" />
                </div>
              </div>

              {/* CARD 5: RR SCOUTING REPORT (Cleanly docked below stadium) */}
              <div className="w-full max-w-md mt-6">
                <div
                  onMouseEnter={() => setActiveCard('unstop')}
                  onMouseLeave={() => setActiveCard(null)}
                  onClick={() => onNavigate('unstop')}
                  className="w-full bg-white/95 backdrop-blur-md border border-[#F0E4D5] hover:border-[#FF2E93] rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FF2E93]/10 text-[#FF2E93] flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-[#0F172A] group-hover:text-[#FF2E93] transition">
                          RR Scouting Report
                        </h3>
                        <span className="text-[10px] font-bold text-[#FF2E93] uppercase font-mono">
                          Auction Decision Support
                        </span>
                      </div>
                    </div>
                    <img
                      src="/card-report.png"
                      alt="Scouting Checklist"
                      className="w-13 h-auto object-contain rounded-lg group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <p className="text-xs text-[#64748B] mt-2.5 leading-relaxed">
                    Actionable player recommendations, auction budget tiers, and archetype fits for Rajasthan Royals IPL 2027.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Wing (Cards 2 & 4): 3 cols on lg */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* CARD 2: BOWLER INTELLIGENCE */}
              <div
                id="bowlers-section"
                onMouseEnter={() => setActiveCard('bowlers')}
                onMouseLeave={() => setActiveCard(null)}
                onClick={() => onNavigate('bowlers')}
                className="w-full bg-white/95 backdrop-blur-md border border-[#F0E4D5] hover:border-blue-500 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-[#0F172A] group-hover:text-blue-600 transition">
                        Bowler Intelligence
                      </h3>
                      <span className="text-[10px] font-bold text-blue-600 uppercase font-mono">
                        Top 10 Pressure Bowlers
                      </span>
                    </div>
                  </div>
                  <img
                    src="/card-bowler.png"
                    alt="Bowler in RR Kit"
                    className="w-11 h-auto object-contain rounded-lg group-hover:scale-110 transition-transform"
                  />
                </div>
                <p className="text-xs text-[#64748B] mt-2.5 leading-relaxed">
                  Identify bowlers who consistently control scoring and create breakthroughs under pressure.
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#F8EFE6] flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#94A3B8]">#1 Clutch Rank</span>
                  <span className="text-[#0F172A] group-hover:text-blue-600 flex items-center space-x-1">
                    <span>Sufiyan Muqeem (5.39 Econ)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* CARD 4: RELIABILITY & MODEL VALIDATION */}
              <div
                id="methodology-section"
                onMouseEnter={() => setActiveCard('engine')}
                onMouseLeave={() => setActiveCard(null)}
                onClick={() => onNavigate('engine')}
                className="w-full bg-white/95 backdrop-blur-md border border-[#F0E4D5] hover:border-emerald-500 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-[#0F172A] group-hover:text-emerald-600 transition">
                        Reliability & Validation
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase font-mono">
                        Bayesian Shrinkage
                      </span>
                    </div>
                  </div>
                  <img
                    src="/card-reliability.png"
                    alt="Reliability Chart"
                    className="w-12 h-auto object-contain rounded-lg group-hover:scale-110 transition-transform"
                  />
                </div>
                <p className="text-xs text-[#64748B] mt-2.5 leading-relaxed">
                  Go beyond raw stats with uncertainty intervals and cross-season ranking stability.
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#F8EFE6] flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#94A3B8]">Prior Model</span>
                  <span className="text-[#0F172A] group-hover:text-emerald-600 flex items-center space-x-1">
                    <span>Empirical-Bayes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FOOTER CALL-TO-ACTION (Every Ball Tells a Story -> Launch Command Centre)
         ========================================================================= */}
      <footer className="border-t border-[#F0E4D5] bg-[#FAF5EE] py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Every Ball Tells a Story. <br />
            <span className="text-[#FF2E93]">We Find the Players Who Change It.</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
            Step into the Pressure Intelligence Command Centre to explore player profiles, duel simulations, and scouting shortlists.
          </p>
          <div className="pt-2">
            <button
              onClick={onEnterCommandCentre}
              className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#FF2E93] to-[#E50693] hover:from-[#ff469c] hover:to-[#f0149c] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-pink-600/25 transition-all hover:scale-105 active:scale-95 flex items-center space-x-2.5 mx-auto cursor-pointer"
            >
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span>Enter Command Centre →</span>
            </button>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          ANIMATIONS CSS (Hardware-accelerated, respects prefers-reduced-motion)
         ========================================================================= */}
      <style>{`
        /* -------------------------------------------------------------
           TIMELINE ENTRANCE ANIMATIONS (Sections 1, 2, 3, 5, 6, 7)
           ------------------------------------------------------------- */

        /* 0.2s: Top Tagline Fade In */
        .anim-hero-tagline {
          opacity: 0;
          animation: heroFadeIn 0.6s ease-out 0.2s forwards;
        }

        /* 0.3s: Central Pink Crest Stroke Drawing & Gentle Scale (900ms) */
        .anim-crest-outline {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: drawCrestOutline 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
        }

        .anim-crest-content {
          opacity: 0;
          transform: scale(0.96);
          animation: crestScaleIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
        }

        .anim-crest-glow {
          opacity: 0;
          animation: crestGlowFade 1.0s ease-out 0.4s forwards;
        }

        .anim-crest-logo {
          opacity: 0;
          animation: heroFadeIn 0.6s ease-out 0.35s forwards;
        }

        /* 0.5s: Golden Radial Lines Drawing Outward */
        .anim-radial-ray {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: drawRadialRay 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* 0.8s: Decorative Dots Fade In at Terminals */
        .anim-dot-terminal {
          opacity: 0;
          transform: scale(0);
          animation: dotTerminalFade 0.5s ease-out forwards;
        }

        /* 0.6s: Headline Stage 1 — "Who Rises When the" */
        .anim-headline-line-1 {
          opacity: 0;
          transform: translateY(12px);
          animation: upwardReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
        }

        /* 0.75s: Headline Stage 2 — "Game Is on the Line?" */
        .anim-headline-line-2 {
          opacity: 0;
          transform: translateY(12px);
          animation: upwardReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.75s forwards;
        }

        /* 0.8s: Supporting Subtitle Text Reveal */
        .anim-hero-subtitle {
          opacity: 0;
          transform: translateY(10px);
          animation: upwardReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
        }

        /* 0.9s: Cricket Illustrations Entrance */
        .anim-illustr-in {
          opacity: 0;
          transform: translateY(8px) scale(0.96);
          animation: illustrEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards;
        }

        /* 1.1s: CTA Button Entrance (Fade in + Scale from 0.95 to 1) */
        .anim-hero-cta {
          opacity: 0;
          transform: scale(0.95);
          animation: ctaEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.1s forwards;
        }

        /* 1.3s: Analytics Visualizations Completion */
        .anim-bar-rise-1 {
          transform-origin: bottom;
          transform: scaleY(0);
          animation: barRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.25s forwards;
        }
        .anim-bar-rise-2 {
          transform-origin: bottom;
          transform: scaleY(0);
          animation: barRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.32s forwards;
        }
        .anim-bar-rise-3 {
          transform-origin: bottom;
          transform: scaleY(0);
          animation: barRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.40s forwards;
        }

        .anim-line-progress {
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
          animation: drawLineChart 0.7s ease-out 1.3s forwards;
        }
        .anim-dot-line-1 { opacity: 0; animation: heroFadeIn 0.3s ease-out 1.35s forwards; }
        .anim-dot-line-2 { opacity: 0; animation: heroFadeIn 0.3s ease-out 1.45s forwards; }
        .anim-dot-line-3 { opacity: 0; animation: heroFadeIn 0.3s ease-out 1.55s forwards; }
        .anim-dot-line-4 { opacity: 0; animation: heroFadeIn 0.3s ease-out 1.65s forwards; }

        /* -------------------------------------------------------------
           SUBTLE RESTRAINED CONTINUOUS MOTIONS (Section 4)
           ------------------------------------------------------------- */

        /* Batter: Tiny upper-body or bat movement */
        .anim-batter-subtle {
          animation: batterSubtleMotion 3.8s ease-in-out infinite alternate 1.6s;
        }

        /* Bowler: Subtle arm / pose shift */
        .anim-bowler-subtle {
          animation: bowlerSubtleMotion 4.2s ease-in-out infinite alternate 1.8s;
        }

        /* Catcher: Subtle floating motion */
        .anim-catcher-float {
          animation: catcherSubtleFloat 4.4s ease-in-out infinite alternate 1.9s;
        }

        /* Cricket Ball: Subtle bobbing float */
        .anim-ball-float {
          animation: ballSubtleFloat 3.4s ease-in-out infinite alternate 1.5s;
        }

        /* Trophy: Very subtle floating motion (3-4px) */
        .anim-trophy-float {
          animation: trophySubtleFloat 4.6s ease-in-out infinite alternate 2.0s;
        }

        /* Helmet: Gentle 2-3 degree tilt */
        .anim-helmet-tilt {
          animation: helmetSubtleTilt 3.6s ease-in-out infinite alternate 1.7s;
        }

        /* Magnifying Glass: Subtle movement of 2-4px */
        .anim-glass-motion {
          animation: glassSubtleHover 4.0s ease-in-out infinite alternate 2.1s;
        }

        /* -------------------------------------------------------------
           KEYFRAME DEFINITIONS
           ------------------------------------------------------------- */

        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes upwardReveal {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes drawCrestOutline {
          from { stroke-dashoffset: 1200; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes crestScaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes crestGlowFade {
          from { opacity: 0; }
          to { opacity: 0.9; }
        }

        @keyframes drawRadialRay {
          from { stroke-dashoffset: 220; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes dotTerminalFade {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 0.85; transform: scale(1); }
        }

        @keyframes illustrEntrance {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes ctaEntrance {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes barRise {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }

        @keyframes drawLineChart {
          from { stroke-dashoffset: 80; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes batterSubtleMotion {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-3px) rotate(-0.8deg); }
        }

        @keyframes bowlerSubtleMotion {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-3px) rotate(0.8deg); }
        }

        @keyframes catcherSubtleFloat {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-4px) rotate(0.8deg); }
        }

        @keyframes ballSubtleFloat {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-4px) rotate(12deg); }
        }

        @keyframes trophySubtleFloat {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-4px); }
        }

        @keyframes helmetSubtleTilt {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(2.5deg); }
        }

        @keyframes glassSubtleHover {
          0% { transform: translate(0px, 0px); }
          100% { transform: translate(3px, -3px); }
        }

        /* -------------------------------------------------------------
           ACCESSIBILITY: RESPECT PREFERS-REDUCED-MOTION (Section 10)
           ------------------------------------------------------------- */
        @media (prefers-reduced-motion: reduce) {
          .anim-hero-tagline,
          .anim-crest-outline,
          .anim-crest-content,
          .anim-crest-glow,
          .anim-crest-logo,
          .anim-radial-ray,
          .anim-dot-terminal,
          .anim-headline-line-1,
          .anim-headline-line-2,
          .anim-hero-subtitle,
          .anim-illustr-in,
          .anim-hero-cta,
          .anim-bar-rise-1,
          .anim-bar-rise-2,
          .anim-bar-rise-3,
          .anim-line-progress,
          .anim-batter-subtle,
          .anim-bowler-subtle,
          .anim-catcher-float,
          .anim-ball-float,
          .anim-trophy-float,
          .anim-helmet-tilt,
          .anim-glass-motion {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
            stroke-dashoffset: 0 !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

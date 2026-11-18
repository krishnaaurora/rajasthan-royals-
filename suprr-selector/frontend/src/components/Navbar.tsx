import React from 'react';
import { Trophy, BarChart3, Target, Cpu, Activity, ShieldCheck, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  metadata: any;
  onBackToLanding: () => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onBackToLanding,
}) => {
  const navItems = [
    { id: 'command_centre', label: 'Command Centre', icon: BarChart3 },
    { id: 'batters', label: 'Top Batters', icon: Trophy },
    { id: 'bowlers', label: 'Top Bowlers', icon: Target },
    { id: 'simulator', label: 'Scenario Simulator', icon: Cpu },
    { id: 'engine', label: 'Pressure & Architecture', icon: Activity },
    { id: 'unstop', label: 'RR Scouting & Unstop', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080D1A]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Return to Landing */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={onBackToLanding}
              title="Return to Landing Page"
              className="p-1 rounded-xl hover:bg-slate-800/80 transition flex items-center space-x-2.5 cursor-pointer"
            >
              <img
                src="/rr-official-crest.png"
                alt="Rajasthan Royals Crest"
                className="h-12 w-auto object-contain rounded-xl shadow-md shadow-pink-600/25"
              />
              <div className="text-left hidden sm:block">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-white tracking-wider font-mono uppercase">
                    SUPERR LAB
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#E879A8]/15 text-[#E879A8] border border-[#E879A8]/30">
                    S2
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">Command Centre</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#111827]/80 p-1.5 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E879A8] to-[#F472B6] text-white shadow-md shadow-pink-600/25'
                      : 'text-[#94A3B8] hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onBackToLanding}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2.5 border-t border-slate-800 space-x-2 no-scrollbar bg-[#080D1A]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition ${
                isActive
                  ? 'bg-[#E879A8] text-white'
                  : 'text-[#94A3B8] bg-[#111827] border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

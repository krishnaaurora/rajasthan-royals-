import React from 'react';
import {
  BarChart3,
  Trophy,
  Target,
  UserCheck,
  Activity,
  Sliders,
  GitCompare,
  FlaskConical,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Compass,
  Sparkles,
  Briefcase,
  Calculator
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: 'Recruitment & Auction',
    items: [
      { id: 'command_centre', label: 'Command Centre (Top 10)', icon: BarChart3 },
      { id: 'auction_decision_intel', label: 'Auction Strategy & Gaps', icon: Briefcase },
      { id: 'player_analyzer', label: 'Player Intelligence & Radar', icon: UserCheck },
    ],
  },
  {
    groupTitle: 'Simulations & Evidence',
    items: [
      { id: 'judge_test_lab', label: 'Scenario & Venue Lab', icon: FlaskConical },
      { id: 'evidence_methodology', label: 'Model Metrics & Evidence', icon: Calculator },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  onBackToLanding: () => void;
  onOpenGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onBackToLanding,
  onOpenGuide,
}) => {
  return (
    <aside
      className={`relative z-40 bg-[#0B1120] border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Header / Branding */}
      <div>
        <div
          className={`flex items-center h-20 px-4 border-b border-slate-800/80 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 overflow-hidden">
              <img
                src="/rr-crest-pink.png"
                alt="Rajasthan Royals"
                className="h-10 w-auto object-contain rounded-lg shadow-sm"
              />
              <div className="leading-tight">
                <span className="font-extrabold text-sm text-white tracking-wider font-mono uppercase block">
                  SUPERR LAB
                </span>
                <span className="text-[10px] text-[#FF2E93] font-bold tracking-widest block uppercase">
                  RR Intelligence
                </span>
              </div>
            </div>
          ) : (
            <img
              src="/rr-crest-pink.png"
              alt="Rajasthan Royals"
              className="h-10 w-auto object-contain rounded-lg shadow-sm"
            />
          )}

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer ${
              isCollapsed ? 'mt-3 hidden sm:block' : ''
            }`}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile / Floating toggle button when collapsed */}
        {isCollapsed && (
          <div className="p-2 flex justify-center border-b border-slate-800/80">
            <button
              onClick={() => setIsCollapsed(false)}
              title="Expand Sidebar"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Groups List */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-170px)] no-scrollbar">
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {group.groupTitle}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeTab === item.id ||
                  (item.id === 'player_analyzer' && (activeTab === 'batters' || activeTab === 'bowlers' || activeTab === 'player_comparison')) ||
                  (item.id === 'auction_decision_intel' && activeTab === 'rr_scouting') ||
                  (item.id === 'evidence_methodology' && (activeTab === 'model_explorer' || activeTab === 'pressure_explainer'));

                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center rounded-xl transition-all duration-200 cursor-pointer ${
                        isCollapsed ? 'justify-center p-3' : 'space-x-3 px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-gradient-to-r from-[#FF2E93] to-[#E50693] text-white font-bold shadow-lg shadow-pink-500/25 ring-1 ring-pink-400/40'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium'
                      }`}
                    >
                      <Icon
                        className={`shrink-0 transition-transform ${
                          isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                        } ${isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-white'}`}
                      />

                      {!isCollapsed && (
                        <span className="text-xs tracking-wide text-left truncate leading-tight">
                          {item.label}
                        </span>
                      )}
                    </button>

                    {/* Collapsed Hover Tooltip: Displays EXACT section name */}
                    {isCollapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 px-3.5 py-2 bg-[#0F172A] border border-slate-700/90 text-white text-xs font-bold rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-50 flex items-center space-x-1.5">
                        <span>{item.label}</span>
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-[#0F172A] border-l border-b border-slate-700/90 rotate-45" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Actions: Guide & Return to Landing Page */}
      <div className="p-3 border-t border-slate-800/80 space-y-1.5">
        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            title="Open 1-Minute Feature Guide"
            className={`w-full flex items-center rounded-xl text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 hover:bg-emerald-900/40 transition cursor-pointer text-xs font-bold ${
              isCollapsed ? 'justify-center p-2.5' : 'space-x-2 px-3 py-2'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0 text-[#FF2E93]" />
            {!isCollapsed && <span>Quick App Guide</span>}
          </button>
        )}

        <button
          onClick={onBackToLanding}
          title="Return to Landing Page"
          className={`w-full flex items-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer text-xs font-semibold ${
            isCollapsed ? 'justify-center p-2.5' : 'space-x-2 px-3 py-2'
          }`}
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Landing Page</span>}
        </button>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import {
  Compass,
  X,
  ShieldCheck,
  Trophy,
  Target,
  UserCheck,
  Activity,
  Sliders,
  GitCompare,
  FlaskConical,
  BarChart3,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [activeCategory, setActiveCategory] = useState<'tour' | 'glossary' | 'judge_tips'>('tour');

  if (!isOpen) return null;

  const features = [
    {
      id: 'command_centre',
      title: '1. Command Centre (Start Here)',
      badge: 'Flagship View',
      desc: 'The official All-Indian Top 10 Shortlist. Click any player to open their 5-Point Scouting Dossier. Use the Role Filters (Batters, All-Rounders, Spinners, Fast Bowlers) and toggle the ML Model Accuracy Benchmark table.',
      icon: BarChart3,
      color: 'text-[#FF2E93]'
    },
    {
      id: 'rr_scouting',
      title: '2. RR Scouting Report & Auction Blueprint',
      badge: 'Auction Strategy',
      desc: 'Explains Rajasthan Royals retained core (Samson, Jaiswal, Parag, Hetmyer), confirmed squad voids, and why Jaipur SMS Stadium large 75m square boundaries heavily reward spin bowling (1.30 rpo tighter than pace).',
      icon: ShieldCheck,
      color: 'text-emerald-400'
    },
    {
      id: 'judge_test_lab',
      title: '3. Judge Interactive Test Case Lab',
      badge: 'Monte Carlo Simulator',
      desc: 'Built specifically for Unstop competition judges! Pick any batter (e.g., Ashutosh Sharma) and bowler (e.g., Harshit Rana), set match context (e.g. Need 18 in last over with 3 wickets left), and simulate 2,500 balls in real time.',
      icon: FlaskConical,
      color: 'text-amber-400'
    },
    {
      id: 'player_comparison',
      title: '4. Player Head-to-Head Comparison',
      badge: 'Duels Analysis',
      desc: 'Compare any two players side-by-side with an interactive radar chart. Contrast Indian shortlist targets against overseas benchmarks (e.g., Ashutosh Sharma vs. Tim David).',
      icon: GitCompare,
      color: 'text-purple-400'
    },
    {
      id: 'player_analyzer',
      title: '5. Player Analyzer (X-Ray Deep Dive)',
      badge: 'Individual Stats',
      desc: 'Select any of the 958 players to see career vs. pressure performance, dot-ball resistance, boundary frequency, and match-phase breakdown across Powerplay, Middle, and Death overs.',
      icon: UserCheck,
      color: 'text-sky-400'
    },
    {
      id: 'model_explorer',
      title: '6. Model Explorer & Validation Lab',
      badge: 'ML Proof Room',
      desc: 'Displays the 5-Fold Cross-Validation accuracy benchmarks (LightGBM R² = 0.9952, MAE = 0.577), chronological holdout testing, and Bayesian shrinkage curves.',
      icon: Sliders,
      color: 'text-blue-400'
    },
    {
      id: 'pressure_explainer',
      title: '7. Pressure Explainer (0–100 Engine)',
      badge: 'Interactive Math',
      desc: 'Move interactive sliders for Runs Needed, Balls Left, and Wickets Lost to watch how the continuous Situational Pressure Index (PI) moves into the High-Pressure Crucible.',
      icon: Activity,
      color: 'text-rose-400'
    },
    {
      id: 'batters',
      title: '8. Batter Intelligence (All 888 Batters)',
      badge: 'Leaderboard',
      desc: 'Full leaderboard of all 888 batters sorted by Bayesian Batter PRI, Strike Rate elevation under pressure (ΔSR), and Win Probability Added.',
      icon: Trophy,
      color: 'text-amber-300'
    },
    {
      id: 'bowlers',
      title: '9. Bowler Intelligence (All 647 Bowlers)',
      badge: 'Leaderboard',
      desc: 'Full leaderboard of all 647 bowlers sorted by Bayesian Bowler PRI, death-overs economy suppression, and clutch wicket-taking.',
      icon: Target,
      color: 'text-emerald-300'
    }
  ];

  const glossary = [
    {
      term: 'CRPI (Composite Cross-Role Pressure Index)',
      def: 'A normalized 0–100 score that fairly compares batters, bowlers, and all-rounders by combining role-specific Bayesian PRI, WPA, baseline delta elevation, and volume reliability.'
    },
    {
      term: 'HP WPA (High-Pressure Win Probability Added)',
      def: 'The exact percentage shift in match outcome directly caused by this player during crucible situations (PI ≥ 0.60). A WPA of +1.772 means the player generated an extra 1.77 expected wins.'
    },
    {
      term: 'ΔSR and ΔEcon (Pressure Elevation)',
      def: 'The difference between performance under high pressure and non-pressure conditions. +52.8 ΔSR means the batter scores 52.8 runs per 100 balls faster when the game is on the line.'
    },
    {
      term: 'Empirical Bayes Shrinkage',
      def: 'A statistical technique (Stein shrinkage) that regresses sparse, small-sample performances toward cohort priors, eliminating misleading "fluke" performances.'
    },
    {
      term: 'The 4-Overseas Cap Constraint',
      def: 'IPL regulations strictly allow at most 4 overseas players in the playing XI. Sourcing Indian domestic finishers and spinners allows RR to preserve overseas spots for fast-bowling strike weapons.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0F172A] border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-[#111827]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF2E93]/15 border border-[#FF2E93]/30 flex items-center justify-center text-[#FF2E93]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold text-white">SupeRR Lab Quick Guide & Feature Tour</h2>
                <span className="px-2 py-0.2 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                  1-Min Overview
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Understand what each feature does and how to navigate the platform effortlessly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-slate-800/80 bg-[#0B1120] flex space-x-3 text-xs">
          <button
            onClick={() => setActiveCategory('tour')}
            className={`pb-3 px-2 font-bold transition border-b-2 cursor-pointer ${
              activeCategory === 'tour'
                ? 'border-[#FF2E93] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Feature Tour (All 9 Sections)
          </button>
          <button
            onClick={() => setActiveCategory('judge_tips')}
            className={`pb-3 px-2 font-bold transition border-b-2 cursor-pointer ${
              activeCategory === 'judge_tips'
                ? 'border-[#FF2E93] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Judge & Evaluator Cheatsheet
          </button>
          <button
            onClick={() => setActiveCategory('glossary')}
            className={`pb-3 px-2 font-bold transition border-b-2 cursor-pointer ${
              activeCategory === 'glossary'
                ? 'border-[#FF2E93] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Cricket & ML Glossary
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeCategory === 'tour' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.id}
                    className="p-4 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-600 transition flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-4 h-4 ${f.color}`} />
                          <h4 className="text-xs font-bold text-white group-hover:text-[#FF2E93] transition">
                            {f.title}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {f.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate(f.id);
                        onClose();
                      }}
                      className="flex items-center space-x-1.5 text-xs font-bold text-[#FF2E93] hover:text-pink-300 transition w-fit cursor-pointer pt-1"
                    >
                      <span>Open this section</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeCategory === 'judge_tips' && (
            <div className="space-y-4 text-xs">
              <div className="bg-gradient-to-r from-pink-950/30 to-purple-950/30 border border-[#FF2E93]/40 p-4 rounded-2xl space-y-2">
                <span className="text-[#FF2E93] font-bold uppercase tracking-wider font-mono text-[11px] flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The 3 Things Judges Should Test First</span>
                </span>
                <ol className="list-decimal pl-4 space-y-2 text-slate-300 text-[11px]">
                  <li>
                    <strong>Check the All-Indian Top 10 Shortlist:</strong> Go to <strong>Command Centre</strong> and click on #1 Ashutosh Sharma or #3 Rahul Tewatia to inspect the complete 5-Point Scouting Dossier.
                  </li>
                  <li>
                    <strong>Run a Live Duel Simulation:</strong> Go to <strong>Judge Test Case Lab</strong>, select Ashutosh Sharma (Batter) vs. Harshit Rana (Bowler), set required run rate to 16.0, and click <em>Run 2,500 Iterations</em>.
                  </li>
                  <li>
                    <strong>Verify Model Accuracy Benchmarks:</strong> In Command Centre, click <em>ML Model Accuracy & Benchmarks</em> to see the 5-fold cross-validation table (R² = 0.9952, MAE = 0.577).
                  </li>
                </ol>
              </div>

              <div className="bg-[#111827] border border-slate-800 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Why 100% Indian Players at the Auction?
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  IPL franchises are limited to 4 overseas players in the playing XI. Since Rajasthan Royals already retained <strong>Shimron Hetmyer</strong> and require overseas slots for starting international fast bowlers, targeting Indian domestic finishers (Ashutosh Sharma, Rahul Tewatia) and Indian spinners (Kuldeep Yadav, Yuzvendra Chahal) preserves overseas slots and provides an unmatched competitive advantage.
                </p>
              </div>
            </div>
          )}

          {activeCategory === 'glossary' && (
            <div className="space-y-3">
              {glossary.map((g, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-white font-mono flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{g.term}</span>
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed pl-5">
                    {g.def}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#111827] flex items-center justify-between text-xs text-slate-400">
          <span>SupeRR Pressure Intelligence Lab • Season 2</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

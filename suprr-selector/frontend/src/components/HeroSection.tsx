import React from 'react';
import { Trophy, Target, TrendingUp, Zap, Flame, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  topBatters: any[];
  topBowlers: any[];
  onOpenPlayer: (player: any, type: 'batter' | 'bowler') => void;
  onOpenRankingsModal: (type: 'batter' | 'bowler') => void;
  onOpenSimulatorModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  topBatters,
  topBowlers,
  onOpenPlayer,
  onOpenRankingsModal,
  onOpenSimulatorModal,
}) => {
  const top1Batter = topBatters[0];
  const top1Bowler = topBowlers[0];

  return (
    <section className="space-y-12 pt-4 pb-12">
      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#131c31] via-[#0f172a] to-[#090d16] border border-slate-800/80 p-8 sm:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-pink-600/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold tracking-wide">
            <Flame className="w-3.5 h-3.5 text-pink-400" />
            <span>Rajasthan Royals SupeRR Selector • Season 2</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Identify the Most Reliable Players Under Pressure
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
            A data-driven analytics engine measuring how batters and bowlers perform in high-pressure match situations compared with their baseline levels. Built with state-dependent match reconstruction, calibrated Bayesian reliability shrinkage, and dynamic Monte Carlo simulations across 200,999 historical deliveries.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenRankingsModal('batter')}
              className="px-6 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-sm transition-all shadow-lg shadow-pink-600/25 flex items-center space-x-2 hover:translate-y-[-1px]"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>View Top 10 Batters</span>
            </button>
            <button
              onClick={() => onOpenRankingsModal('bowler')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center space-x-2 hover:translate-y-[-1px]"
            >
              <Target className="w-4 h-4 text-blue-400" />
              <span>View Top 10 Bowlers</span>
            </button>
            <button
              onClick={onOpenSimulatorModal}
              className="px-6 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-semibold text-sm transition-all flex items-center space-x-2 hover:translate-y-[-1px]"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Launch Monte Carlo Duel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Dataset Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 transition hover:border-slate-700">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Deliveries Audited</span>
          <div className="text-3xl font-extrabold text-white font-mono mt-2">200,999</div>
          <p className="text-xs text-slate-400 mt-2">867 contested matches (883 total)</p>
        </div>

        <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 transition hover:border-slate-700">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">High-Pressure Deliveries</span>
          <div className="text-3xl font-extrabold text-pink-400 font-mono mt-2">39,736</div>
          <p className="text-xs text-slate-400 mt-2">Top 19.8% critical match intensity</p>
        </div>

        <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 transition hover:border-slate-700">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Competitions Scope</span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-2">141 Comps</div>
          <p className="text-xs text-slate-400 mt-2">IPL 2022-26 + T20Is + Asia Cups</p>
        </div>

        <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 transition hover:border-slate-700">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Player ID Integrity</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-2">100.0%</div>
          <p className="text-xs text-slate-400 mt-2">0 missing mappings across 1,217 players</p>
        </div>
      </div>

      {/* Two Champion Spotlight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top 1 Batter */}
        {top1Batter && (
          <div
            onClick={() => onOpenPlayer(top1Batter, 'batter')}
            className="cursor-pointer group relative overflow-hidden bg-gradient-to-br from-pink-950/20 via-[#111827] to-[#0f172a] border border-pink-500/30 rounded-3xl p-8 hover:border-pink-500/60 transition-all shadow-xl hover:shadow-pink-500/10"
          >
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full bg-pink-500/10 text-pink-300 text-xs font-bold border border-pink-500/30 flex items-center space-x-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>#1 Ranked Pressure Batter</span>
              </span>
              <span className="text-xs text-slate-400 group-hover:text-pink-400 flex items-center space-x-1 transition">
                <span>View Full Card</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="mt-6 flex items-center space-x-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-pink-500/25">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{top1Batter.name}</h3>
                <p className="text-sm text-pink-400 font-medium mt-0.5">
                  {top1Batter.teams?.join(', ') || 'IPL / T20'} • ID: {top1Batter.id}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
              <div>
                <span className="text-xs text-slate-400 block">Pressure SR</span>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">{top1Batter.hp_sr}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Pressure Avg</span>
                <span className="text-xl font-bold font-mono text-white mt-0.5 block">{top1Batter.hp_avg}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">SR Delta</span>
                <span className="text-xl font-bold font-mono text-pink-400 mt-0.5 block">+{top1Batter.sr_delta}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 mt-5 leading-relaxed">
              Tristan Stubbs demonstrates the single highest positive strike-rate surge in world cricket (+75.66 pts above baseline) while preserving an elite 41.42 average across 398 high-pressure balls.
            </p>
          </div>
        )}

        {/* Top 1 Bowler */}
        {top1Bowler && (
          <div
            onClick={() => onOpenPlayer(top1Bowler, 'bowler')}
            className="cursor-pointer group relative overflow-hidden bg-gradient-to-br from-blue-950/20 via-[#111827] to-[#0f172a] border border-blue-500/30 rounded-3xl p-8 hover:border-blue-500/60 transition-all shadow-xl hover:shadow-blue-500/10"
          >
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-bold border border-blue-500/30 flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>#1 Ranked Pressure Bowler</span>
              </span>
              <span className="text-xs text-slate-400 group-hover:text-blue-400 flex items-center space-x-1 transition">
                <span>View Full Card</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="mt-6 flex items-center space-x-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-500/25">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{top1Bowler.name}</h3>
                <p className="text-sm text-blue-400 font-medium mt-0.5">
                  {top1Bowler.teams?.join(', ') || 'IPL / T20'} • ID: {top1Bowler.id}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
              <div>
                <span className="text-xs text-slate-400 block">Pressure Econ</span>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">{top1Bowler.hp_econ} rpo</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Pressure SR</span>
                <span className="text-xl font-bold font-mono text-white mt-0.5 block">{top1Bowler.hp_sr} b/w</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Dot Ball %</span>
                <span className="text-xl font-bold font-mono text-blue-400 mt-0.5 block">{top1Bowler.dot_pct}%</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 mt-5 leading-relaxed">
              Sufiyan Muqeem acts as an absolute pressure valve, registering a world-class 54.1% dot-ball rate and a microscopic 5.39 rpo economy against batters operating at peak aggression.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};


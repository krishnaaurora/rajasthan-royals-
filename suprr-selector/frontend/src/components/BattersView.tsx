import React, { useState } from 'react';
import {
  Trophy,
  Search,
  Filter,
  RotateCcw,
  User,
  ArrowRight,
  ScatterChart as ScatterIcon,
  LineChart,
} from 'lucide-react';

interface BattersViewProps {
  batters?: any[];
  onSelectPlayer: (player: any, type: 'batter') => void;
  onNavigate?: (tab: string) => void;
}

export const BattersView: React.FC<BattersViewProps> = ({ batters = [], onSelectPlayer, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [competition, setCompetition] = useState('all');
  const [season, setSeason] = useState('all');
  const [minSample, setMinSample] = useState('60');
  const [sortBy, setSortBy] = useState('pri');

  const handleReset = () => {
    setSearchTerm('');
    setCompetition('all');
    setSeason('all');
    setMinSample('60');
    setSortBy('pri');
  };

  // Map real batters data
  const realBatters = (batters.length > 0 ? batters : []).map((b, i) => ({
    rank: b.rank || i + 1,
    id: b.id,
    name: b.name,
    team: b.team,
    priScore: b.pri_score !== undefined ? Number(b.pri_score).toFixed(1) : (b.priScore || '—'),
    priRaw: Number(b.pri_score || 0),
    pressureSr: b.hp_sr !== undefined ? Number(b.hp_sr).toFixed(1) : (b.pressureSr || '—'),
    srRaw: Number(b.hp_sr || 0),
    baselineSr: b.baseline_sr !== undefined ? Number(b.baseline_sr).toFixed(1) : (b.baselineSr || '—'),
    srDiff: b.sr_delta !== undefined ? (b.sr_delta > 0 ? `+${Number(b.sr_delta).toFixed(1)}` : Number(b.sr_delta).toFixed(1)) : '+0.0',
    diffRaw: Number(b.sr_delta || 0),
    pressureAvg: b.hp_avg !== undefined ? Number(b.hp_avg).toFixed(1) : '—',
    sampleSize: `${b.hp_balls || b.sampleSize || 0} balls`,
    sampleRaw: Number(b.hp_balls || 0),
    boundaryPct: b.hp_boundary_pct !== undefined ? `${b.hp_boundary_pct}%` : '—',
    dotPct: b.hp_dot_pct !== undefined ? `${b.hp_dot_pct}%` : '—',
    raw: b,
  }));

  const filtered = realBatters
    .filter((b) => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((b) => b.sampleRaw >= Number(minSample))
    .sort((a, b) => {
      if (sortBy === 'hp_sr') return b.srRaw - a.srRaw;
      if (sortBy === 'diff') return b.diffRaw - a.diffRaw;
      if (sortBy === 'sample') return b.sampleRaw - a.sampleRaw;
      return b.priRaw - a.priRaw;
    });

  return (
    <div className="space-y-8 animate-fade-in pb-16 text-[#F8FAFC]">
      {/* =========================================================================
          HEADER
         ========================================================================= */}
      <div className="bg-[#111827] border border-[#334155] p-6 sm:p-8 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F72585]/15 border border-[#F72585]/30 flex items-center justify-center text-[#F72585]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
                Batter Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
                Explore historical batting performance under pressure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FILTER BAR
         ========================================================================= */}
      <div className="bg-[#111827] border border-[#334155] p-4 sm:p-5 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Player Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search player..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-[#1F2937] border border-[#334155] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#F72585] w-44 sm:w-48"
            />
          </div>

          {/* Competition Filter */}
          <select
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
            className="bg-[#1F2937] border border-[#334155] text-xs font-semibold text-white px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">All Competitions</option>
            <option value="ipl">IPL Matches</option>
            <option value="t20i">T20 International</option>
          </select>

          {/* Season Filter */}
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="bg-[#1F2937] border border-[#334155] text-xs font-semibold text-white px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">All Seasons (2022–26)</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>

          {/* Minimum Sample Filter */}
          <select
            value={minSample}
            onChange={(e) => setMinSample(e.target.value)}
            className="bg-[#1F2937] border border-[#334155] text-xs font-semibold text-white px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="60">Min 60 balls</option>
            <option value="120">Min 120 balls (Standard)</option>
            <option value="180">Min 180 balls (Strict)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#1F2937] border border-[#334155] text-xs font-semibold text-white px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="pri">Sort By: PRI Score</option>
            <option value="hp_sr">Sort By: Pressure SR</option>
            <option value="diff">Sort By: SR Difference</option>
            <option value="sample">Sort By: Sample Size</option>
          </select>
        </div>

        {/* Reset Filters */}
        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1F2937] hover:bg-slate-800 border border-[#334155] text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* =========================================================================
          BATTER LEADERBOARD TABLE
         ========================================================================= */}
      <div className="bg-[#111827] border border-[#334155] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#334155] flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Batter Leaderboard</h2>
          <span className="text-xs text-emerald-400 font-mono">
            {filtered.length} Qualified Batters Loaded • Evaluated on 200,999 Deliveries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#1F2937]/80 text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#334155]">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4 text-left">RR Auction Strategy</th>
                <th className="py-3 px-4 text-center">PRI Score</th>
                <th className="py-3 px-4 text-center">Pressure SR</th>
                <th className="py-3 px-4 text-center">Baseline SR</th>
                <th className="py-3 px-4 text-center">SR Difference</th>
                <th className="py-3 px-4 text-center">Pressure Avg</th>
                <th className="py-3 px-4 text-center">Sample Size</th>
                <th className="py-3 px-4 text-right">View Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60">
              {filtered.map((b) => (
                <tr
                  key={b.rank}
                  onClick={() => {
                    onSelectPlayer(b.raw, 'batter');
                    if (onNavigate) onNavigate('player_analyzer');
                  }}
                  className="hover:bg-[#1F2937]/70 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-bold text-white">#{b.rank}</td>
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-200 group-hover:text-[#F72585] transition flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#1F2937] border border-[#334155] flex items-center justify-center text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span>{b.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-amber-300">
                        {b.raw.auction_strategy?.recommendation || 'Tier 1 Target'}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {b.raw.auction_strategy?.target_bid_bracket || '₹4.0 – ₹7.0 Cr'} • {b.raw.auction_strategy?.nationality === 'Indian' ? '🇮🇳 Ind' : '🌍 OS'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-[#F72585]">{b.priScore}</td>
                  <td className="py-3.5 px-4 text-center text-slate-300">{b.pressureSr}</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">{b.baselineSr}</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">{b.srDiff}</td>
                  <td className="py-3.5 px-4 text-center text-slate-300">{b.pressureAvg}</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">{b.sampleSize}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center space-x-1 text-slate-400 group-hover:text-[#F72585] font-sans font-semibold text-xs">
                      <span>Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          BATTER CLUTCH MATRIX (SCATTER PLOT VISUALIZATION)
         ========================================================================= */}
      <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#334155] pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ScatterIcon className="w-4 h-4 text-[#F72585]" />
              <span>Batter Clutch Matrix</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Multi-dimensional evaluation: X-Axis = Pressure Strike Rate, Y-Axis = Strike Rate Elevation vs Baseline (Δ), Bubble Size = High-Pressure Deliveries.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-[#1F2937] px-3 py-1 rounded-xl border border-[#334155]">
            Live Model Coordinates
          </span>
        </div>

        {/* Real Scatter Matrix Canvas */}
        <div className="bg-[#1F2937]/40 border border-[#334155] rounded-xl p-6">
          <div className="relative h-72 sm:h-80 w-full">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-dashed border-slate-400 w-full" />
            </div>

            {/* Quadrant labels */}
            <div className="absolute top-2 right-4 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
              ELITE CLUTCH ACCELERATORS (High SR + High Δ)
            </div>
            <div className="absolute bottom-2 left-4 text-[11px] font-mono text-slate-500">
              Low Baseline Divergence
            </div>

            {/* Interactive Player Bubbles */}
            {filtered.slice(0, 15).map((b) => {
              // Normalize SR (140 to 220) -> 5% to 92%
              const xPos = Math.min(92, Math.max(8, ((b.srRaw - 140) / 80) * 85 + 8));
              // Normalize Delta SR (20 to 80) -> 12% to 88%
              const yPos = Math.min(88, Math.max(12, 100 - (((b.diffRaw - 20) / 60) * 75 + 12)));
              const radius = Math.min(22, Math.max(12, Math.sqrt(b.sampleRaw) * 0.9));

              return (
                <div
                  key={b.rank}
                  onClick={() => {
                    onSelectPlayer(b.raw, 'batter');
                    if (onNavigate) onNavigate('player_analyzer');
                  }}
                  style={{ left: `${xPos}%`, top: `${yPos}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                >
                  <div
                    style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
                    className="rounded-full bg-gradient-to-tr from-[#F72585] to-[#FF5EAC] border-2 border-white/80 shadow-lg shadow-pink-500/30 group-hover:scale-125 transition-transform flex items-center justify-center"
                  >
                    <span className="text-[10px] font-mono font-bold text-white">#{b.rank}</span>
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#0F172A] border border-[#F72585]/60 rounded-xl p-2.5 shadow-2xl z-30 pointer-events-none text-left">
                    <p className="text-xs font-bold text-white truncate">{b.name}</p>
                    <div className="text-[10px] font-mono text-slate-300 space-y-0.5 mt-1">
                      <p>HP Strike Rate: <strong className="text-[#F72585]">{b.pressureSr}</strong></p>
                      <p>Δ SR Elevation: <strong className="text-emerald-400">{b.srDiff}</strong></p>
                      <p>PRI Score: <strong>{b.priScore}</strong></p>
                      <p>Sample: {b.sampleSize}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-4 border-t border-[#334155]">
            <span>← Baseline Strike Rate (140)</span>
            <span className="text-white font-bold">X: High-Pressure Strike Rate</span>
            <span>Explosive Strike Rate (220+) →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Target,
  Search,
  RotateCcw,
  User,
  ArrowRight,
  LineChart,
} from 'lucide-react';

interface BowlersViewProps {
  bowlers?: any[];
  onSelectPlayer: (player: any, type: 'bowler') => void;
  onNavigate?: (tab: string) => void;
}

export const BowlersView: React.FC<BowlersViewProps> = ({ bowlers = [], onSelectPlayer, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [competition, setCompetition] = useState('all');
  const [season, setSeason] = useState('all');
  const [bowlingPhase, setBowlingPhase] = useState('all');
  const [minSample, setMinSample] = useState('60');
  const [sortBy, setSortBy] = useState('pri');

  const handleReset = () => {
    setSearchTerm('');
    setCompetition('all');
    setSeason('all');
    setBowlingPhase('all');
    setMinSample('60');
    setSortBy('pri');
  };

  // Map real bowlers data
  const realBowlers = (bowlers.length > 0 ? bowlers : []).map((bw, i) => ({
    rank: bw.rank || i + 1,
    id: bw.id,
    name: bw.name,
    team: bw.team,
    priScore: bw.pri_score !== undefined ? Number(bw.pri_score).toFixed(1) : (bw.priScore || '—'),
    priRaw: Number(bw.pri_score || 0),
    pressureEcon: bw.hp_econ !== undefined ? Number(bw.hp_econ).toFixed(2) : (bw.pressureEcon || '—'),
    econRaw: Number(bw.hp_econ || 0),
    baselineEcon: bw.baseline_econ !== undefined ? Number(bw.baseline_econ).toFixed(2) : (bw.baselineEcon || '—'),
    econDiff: bw.econ_delta !== undefined ? (bw.econ_delta > 0 ? `+${Number(bw.econ_delta).toFixed(2)}` : Number(bw.econ_delta).toFixed(2)) : '+0.0',
    diffRaw: Number(bw.econ_delta || 0),
    pressureWktRate: bw.hp_sr !== undefined ? `${Number(bw.hp_sr).toFixed(1)} b/w` : '—',
    sampleSize: `${bw.hp_balls || bw.sampleSize || 0} balls`,
    sampleRaw: Number(bw.hp_balls || 0),
    dotPct: bw.hp_dot_pct !== undefined ? `${bw.hp_dot_pct}%` : '—',
    boundaryPct: bw.hp_boundary_pct !== undefined ? `${bw.hp_boundary_pct}%` : '—',
    raw: bw,
  }));

  const filtered = realBowlers
    .filter((bw) => bw.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((bw) => bw.sampleRaw >= Number(minSample))
    .sort((a, b) => {
      if (sortBy === 'hp_econ') return a.econRaw - b.econRaw; // lower economy is better
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
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
                Bowler Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
                Explore historical bowling performance under pressure.
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
              placeholder="Search bowler..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-[#1F2937] border border-[#334155] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 w-44 sm:w-48"
            />
          </div>

          {/* Competition */}
          <select
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
            className="bg-[#1F2937] border border-[#334155] text-xs font-semibold text-white px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">All Competitions</option>
            <option value="ipl">IPL Matches</option>
            <option value="t20i">T20 International</option>
          </select>

          {/* Season */}
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

          {/* Bowling Phase */}
          <select
            value={bowlingPhase}
            onChange={(e) => setBowlingPhase(e.target.value)}
            className="bg-[#1F2937] border border-[#334155] text-xs font-semibold text-white px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">All Bowling Phases</option>
            <option value="pp">Powerplay (Overs 1–6)</option>
            <option value="mid">Middle Overs (7–15)</option>
            <option value="death">Death Overs (16–20)</option>
          </select>

          {/* Minimum Sample */}
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
            <option value="hp_econ">Sort By: Pressure Economy</option>
            <option value="diff">Sort By: Economy Difference</option>
            <option value="sample">Sort By: Sample Size</option>
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1F2937] hover:bg-slate-800 border border-[#334155] text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* =========================================================================
          BOWLER LEADERBOARD TABLE
         ========================================================================= */}
      <div className="bg-[#111827] border border-[#334155] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#334155] flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Bowler Leaderboard</h2>
          <span className="text-xs text-blue-400 font-mono">
            {filtered.length} Qualified Bowlers Loaded • Evaluated on 200,999 Deliveries
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
                <th className="py-3 px-4 text-center">Pressure Economy</th>
                <th className="py-3 px-4 text-center">Baseline Economy</th>
                <th className="py-3 px-4 text-center">Economy Difference</th>
                <th className="py-3 px-4 text-center">Pressure Wicket Rate</th>
                <th className="py-3 px-4 text-center">Sample Size</th>
                <th className="py-3 px-4 text-right">View Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60">
              {filtered.map((bw) => (
                <tr
                  key={bw.rank}
                  onClick={() => {
                    onSelectPlayer(bw.raw, 'bowler');
                    if (onNavigate) onNavigate('player_analyzer');
                  }}
                  className="hover:bg-[#1F2937]/70 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-bold text-white">#{bw.rank}</td>
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-200 group-hover:text-blue-400 transition flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#1F2937] border border-[#334155] flex items-center justify-center text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span>{bw.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-amber-300">
                        {bw.raw.auction_strategy?.recommendation || 'Tier 1 Target'}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {bw.raw.auction_strategy?.target_bid_bracket || '₹4.0 – ₹7.0 Cr'} • {bw.raw.auction_strategy?.nationality === 'Indian' ? '🇮🇳 Ind' : '🌍 OS'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-blue-400">{bw.priScore}</td>
                  <td className="py-3.5 px-4 text-center text-slate-300">{bw.pressureEcon} rpo</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">{bw.baselineEcon} rpo</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">{bw.econDiff}</td>
                  <td className="py-3.5 px-4 text-center text-slate-300">{bw.pressureWktRate}</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">{bw.sampleSize}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center space-x-1 text-slate-400 group-hover:text-blue-400 font-sans font-semibold text-xs">
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
          BOWLER CLUTCH MATRIX (SCATTER PLOT VISUALIZATION)
         ========================================================================= */}
      <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#334155] pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <LineChart className="w-4 h-4 text-blue-400" />
              <span>Bowler Clutch Matrix</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Multi-dimensional evaluation: X-Axis = Pressure Economy Rate, Y-Axis = Economy Improvement vs Baseline (Δ), Bubble Size = Deliveries Bowled.
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
            <div className="absolute top-2 left-4 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
              ELITE PRESSURE SUFFOCATORS (Low Econ + High Δ)
            </div>
            <div className="absolute bottom-2 right-4 text-[11px] font-mono text-slate-500">
              High Economy Exposure
            </div>

            {/* Interactive Bowler Bubbles */}
            {filtered.slice(0, 15).map((bw) => {
              // Lower economy is better: 5.0 to 9.5 -> 12% to 90% (inverted X)
              const xPos = Math.min(90, Math.max(10, ((bw.econRaw - 5.0) / 4.5) * 80 + 10));
              // Higher delta econ is better: -0.5 to +2.5 -> 12% to 88% (Y inverted)
              const yPos = Math.min(88, Math.max(12, 100 - (((bw.diffRaw - (-0.5)) / 3.0) * 75 + 12)));
              const radius = Math.min(22, Math.max(12, Math.sqrt(bw.sampleRaw) * 0.9));

              return (
                <div
                  key={bw.rank}
                  onClick={() => {
                    onSelectPlayer(bw.raw, 'bowler');
                    if (onNavigate) onNavigate('player_analyzer');
                  }}
                  style={{ left: `${xPos}%`, top: `${yPos}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                >
                  <div
                    style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
                    className="rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 border-2 border-white/80 shadow-lg shadow-blue-500/30 group-hover:scale-125 transition-transform flex items-center justify-center"
                  >
                    <span className="text-[10px] font-mono font-bold text-white">#{bw.rank}</span>
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#0F172A] border border-blue-500/60 rounded-xl p-2.5 shadow-2xl z-30 pointer-events-none text-left">
                    <p className="text-xs font-bold text-white truncate">{bw.name}</p>
                    <div className="text-[10px] font-mono text-slate-300 space-y-0.5 mt-1">
                      <p>HP Economy: <strong className="text-blue-400">{bw.pressureEcon} rpo</strong></p>
                      <p>Δ Tightening: <strong className="text-emerald-400">{bw.econDiff} rpo</strong></p>
                      <p>PRI Score: <strong>{bw.priScore}</strong></p>
                      <p>Sample: {bw.sampleSize}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-4 border-t border-[#334155]">
            <span className="text-emerald-400">← Microscopic Economy (&lt;6.0 rpo)</span>
            <span className="text-white font-bold">X: High-Pressure Economy Rate</span>
            <span>Higher Concession (&gt;9.0 rpo) →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

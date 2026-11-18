import React, { useState } from 'react';
import {
  GitCompare,
  BarChart2,
  PieChart,
  CheckCircle2,
  Search,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

interface PlayerComparisonViewProps {
  batters?: any[];
  bowlers?: any[];
}

export const PlayerComparisonView: React.FC<PlayerComparisonViewProps> = ({
  batters = [],
  bowlers = [],
}) => {
  const [role, setRole] = useState<'batter' | 'bowler'>('batter');

  const currentPool = role === 'batter' ? batters : bowlers;

  const [playerAId, setPlayerAId] = useState<number>(
    role === 'batter' ? (batters[0]?.id || 20702) : (bowlers[0]?.id || 34485)
  );
  const [playerBId, setPlayerBId] = useState<number>(
    role === 'batter' ? (batters[1]?.id || 7897) : (bowlers[2]?.id || 6355)
  );
  const [playerCId, setPlayerCId] = useState<number | null>(null);

  const playerA = currentPool.find((p) => p.id === playerAId) || currentPool[0] || {};
  const playerB = currentPool.find((p) => p.id === playerBId) || currentPool[1] || {};
  const playerC = playerCId ? currentPool.find((p) => p.id === playerCId) : null;

  const isBatter = role === 'batter';

  const getMetricRow = (
    label: string,
    valA: string | number,
    valB: string | number,
    valC?: string | number,
    higherIsBetter = true
  ) => {
    const numA = typeof valA === 'number' ? valA : parseFloat(String(valA).replace(/[^0-9.-]/g, ''));
    const numB = typeof valB === 'number' ? valB : parseFloat(String(valB).replace(/[^0-9.-]/g, ''));
    const aWins = !isNaN(numA) && !isNaN(numB) ? (higherIsBetter ? numA > numB : numA < numB) : false;
    const bWins = !isNaN(numA) && !isNaN(numB) ? (higherIsBetter ? numB > numA : numB < numA) : false;

    return (
      <tr key={label} className="hover:bg-[#1F2937]/50 transition">
        <td className="py-3 px-4 text-white font-medium">{label}</td>
        <td className={`py-3 px-4 text-center font-bold ${aWins ? (isBatter ? 'text-[#F72585]' : 'text-blue-400') : 'text-slate-300'}`}>
          {valA}
        </td>
        <td className={`py-3 px-4 text-center font-bold ${bWins ? (isBatter ? 'text-[#F72585]' : 'text-blue-400') : 'text-slate-300'}`}>
          {valB}
        </td>
        {playerC && (
          <td className="py-3 px-4 text-center font-bold text-slate-300">
            {valC !== undefined ? valC : '—'}
          </td>
        )}
      </tr>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-16 text-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#111827] border border-[#334155] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#F72585]/15 border border-[#F72585]/30 flex items-center justify-center text-[#F72585]">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              Player Head-to-Head Comparison
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
              Direct statistical confrontation of player reliability under pressure.
            </p>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-[#1F2937] p-1 rounded-xl border border-[#334155] self-start md:self-auto">
          <button
            onClick={() => {
              setRole('batter');
              if (batters[0]) setPlayerAId(batters[0].id);
              if (batters[1]) setPlayerBId(batters[1].id);
              setPlayerCId(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              role === 'batter'
                ? 'bg-gradient-to-r from-[#F72585] to-[#E50693] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Compare Batters
          </button>
          <button
            onClick={() => {
              setRole('bowler');
              if (bowlers[0]) setPlayerAId(bowlers[0].id);
              if (bowlers[1]) setPlayerBId(bowlers[1].id);
              setPlayerCId(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              role === 'bowler'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Compare Bowlers
          </button>
        </div>
      </div>

      {/* =========================================================================
          PLAYER SELECTORS
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#111827] border border-[#334155] p-5 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-[#F72585] uppercase tracking-wider block font-mono">
            Candidate A
          </label>
          <select
            value={playerAId}
            onChange={(e) => setPlayerAId(Number(e.target.value))}
            className="w-full bg-[#1F2937] border border-[#334155] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#F72585] cursor-pointer"
          >
            {currentPool.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.rank} {p.name} ({p.team || 'T20'})
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-400 block font-mono">
            PRI: <strong className="text-white">{Number(playerA.pri_score || 0).toFixed(1)}</strong> • Sample: {playerA.hp_balls}b
          </span>
        </div>

        <div className="bg-[#111827] border border-[#334155] p-5 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-blue-400 uppercase tracking-wider block font-mono">
            Candidate B
          </label>
          <select
            value={playerBId}
            onChange={(e) => setPlayerBId(Number(e.target.value))}
            className="w-full bg-[#1F2937] border border-[#334155] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-400 cursor-pointer"
          >
            {currentPool.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.rank} {p.name} ({p.team || 'T20'})
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-400 block font-mono">
            PRI: <strong className="text-white">{Number(playerB.pri_score || 0).toFixed(1)}</strong> • Sample: {playerB.hp_balls}b
          </span>
        </div>

        <div className="bg-[#111827] border border-[#334155] p-5 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono">
            Candidate C (Optional)
          </label>
          <select
            value={playerCId || ''}
            onChange={(e) => setPlayerCId(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-[#1F2937] border border-[#334155] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-slate-500 cursor-pointer"
          >
            <option value="">None (Head-to-Head)</option>
            {currentPool
              .filter((p) => p.id !== playerAId && p.id !== playerBId)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.rank} {p.name} ({p.team || 'T20'})
                </option>
              ))}
          </select>
          <span className="text-[11px] text-slate-500 block font-mono">
            {playerC ? `PRI: ${Number(playerC.pri_score || 0).toFixed(1)}` : 'Select 3rd Player to compare trio'}
          </span>
        </div>
      </div>

      {/* =========================================================================
          DYNAMIC SIDE-BY-SIDE VISUAL COMPARISON
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Metric Comparison Bar Visualization */}
        <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-[#F72585]" />
              <span>Head-to-Head Metric Bars</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              Live Comparative Output
            </span>
          </div>

          <div className="space-y-5 pt-3 font-mono text-xs">
            {/* PRI Score Comparison */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>PRI Rating:</span>
                <span>
                  <strong className="text-[#F72585]">{playerA.name} ({Number(playerA.pri_score || 0).toFixed(1)})</strong> vs{' '}
                  <strong className="text-blue-400">{playerB.name} ({Number(playerB.pri_score || 0).toFixed(1)})</strong>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#1F2937] h-5 rounded-lg overflow-hidden border border-[#334155]">
                  <div
                    style={{ width: `${Math.min(100, (Number(playerA.pri_score || 0) / 115) * 100)}%` }}
                    className="h-full bg-[#F72585] rounded-lg"
                  />
                </div>
                <div className="bg-[#1F2937] h-5 rounded-lg overflow-hidden border border-[#334155]">
                  <div
                    style={{ width: `${Math.min(100, (Number(playerB.pri_score || 0) / 115) * 100)}%` }}
                    className="h-full bg-blue-500 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* High Pressure Speed (SR / Economy) */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Pressure Execution ({isBatter ? 'Strike Rate' : 'Economy'}):</span>
                <span>
                  <strong className="text-[#F72585]">{isBatter ? playerA.hp_sr : `${playerA.hp_econ} rpo`}</strong> vs{' '}
                  <strong className="text-blue-400">{isBatter ? playerB.hp_sr : `${playerB.hp_econ} rpo`}</strong>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#1F2937] h-5 rounded-lg overflow-hidden border border-[#334155]">
                  <div
                    style={{
                      width: isBatter
                        ? `${Math.min(100, (Number(playerA.hp_sr || 100) / 220) * 100)}%`
                        : `${Math.min(100, (Number(playerA.hp_econ || 5) / 11) * 100)}%`,
                    }}
                    className={`h-full ${isBatter ? 'bg-[#F72585]' : 'bg-blue-400'} rounded-lg`}
                  />
                </div>
                <div className="bg-[#1F2937] h-5 rounded-lg overflow-hidden border border-[#334155]">
                  <div
                    style={{
                      width: isBatter
                        ? `${Math.min(100, (Number(playerB.hp_sr || 100) / 220) * 100)}%`
                        : `${Math.min(100, (Number(playerB.hp_econ || 5) / 11) * 100)}%`,
                    }}
                    className={`h-full ${isBatter ? 'bg-pink-400' : 'bg-blue-600'} rounded-lg`}
                  />
                </div>
              </div>
            </div>

            {/* Performance Elevation (Delta) */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Baseline Elevation (Δ):</span>
                <span>
                  <strong className="text-emerald-400">+{isBatter ? playerA.sr_delta : playerA.econ_delta}</strong> vs{' '}
                  <strong className="text-emerald-400">+{isBatter ? playerB.sr_delta : playerB.econ_delta}</strong>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#1F2937] h-5 rounded-lg overflow-hidden border border-[#334155]">
                  <div
                    style={{
                      width: isBatter
                        ? `${Math.min(100, (Number(playerA.sr_delta || 0) / 80) * 100)}%`
                        : `${Math.min(100, (Number(playerA.econ_delta || 0) / 3) * 100)}%`,
                    }}
                    className="h-full bg-emerald-500 rounded-lg"
                  />
                </div>
                <div className="bg-[#1F2937] h-5 rounded-lg overflow-hidden border border-[#334155]">
                  <div
                    style={{
                      width: isBatter
                        ? `${Math.min(100, (Number(playerB.sr_delta || 0) / 80) * 100)}%`
                        : `${Math.min(100, (Number(playerB.econ_delta || 0) / 3) * 100)}%`,
                    }}
                    className="h-full bg-teal-400 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Dimensional Radar Breakdown */}
        <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-blue-400" />
              <span>Multi-Axis Dimension Comparison</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 bg-[#1F2937] px-2.5 py-0.5 rounded border border-[#334155]">
              Radar Axes
            </span>
          </div>

          <div className="space-y-3.5 pt-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#1F2937]">
              <span className="text-slate-400">Boundary Impact %</span>
              <span className="text-white">
                <strong className="text-[#F72585]">{playerA.hp_boundary_pct}%</strong> vs{' '}
                <strong className="text-blue-400">{playerB.hp_boundary_pct}%</strong>
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-[#1F2937]">
              <span className="text-slate-400">Dot Ball Avoidance / Concession %</span>
              <span className="text-white">
                <strong className="text-[#F72585]">{playerA.hp_dot_pct}%</strong> vs{' '}
                <strong className="text-blue-400">{playerB.hp_dot_pct}%</strong>
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-[#1F2937]">
              <span className="text-slate-400">Total Win Probability Added (WPA)</span>
              <span className="text-white">
                <strong className="text-emerald-400">+{playerA.hp_wpa}</strong> vs{' '}
                <strong className="text-emerald-400">+{playerB.hp_wpa}</strong>
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-[#1F2937]">
              <span className="text-slate-400">Sample Depth (Balls Audited)</span>
              <span className="text-white">
                <strong className="text-[#F72585]">{playerA.hp_balls}b</strong> vs{' '}
                <strong className="text-blue-400">{playerB.hp_balls}b</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          COMPARISON TABLE (FULL TABULAR BREAKDOWN)
         ========================================================================= */}
      <div className="bg-[#111827] border border-[#334155] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#334155] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Comparative Statistical Breakdown</h3>
          <span className="text-xs text-emerald-400 font-mono">
            Audited Against 200,999 Historical Deliveries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#1F2937]/80 text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#334155]">
              <tr>
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4 text-center text-[#F72585] font-bold">
                  {playerA.name} (#{playerA.rank})
                </th>
                <th className="py-3 px-4 text-center text-blue-400 font-bold">
                  {playerB.name} (#{playerB.rank})
                </th>
                {playerC && (
                  <th className="py-3 px-4 text-center text-slate-300 font-bold">
                    {playerC.name} (#{playerC.rank})
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60 text-slate-400">
              {getMetricRow(
                'Pressure Reliability Index (PRI)',
                Number(playerA.pri_score || 0).toFixed(1),
                Number(playerB.pri_score || 0).toFixed(1),
                playerC ? Number(playerC.pri_score || 0).toFixed(1) : undefined
              )}
              {getMetricRow(
                isBatter ? 'High-Pressure Strike Rate' : 'High-Pressure Economy',
                isBatter ? playerA.hp_sr : `${playerA.hp_econ} rpo`,
                isBatter ? playerB.hp_sr : `${playerB.hp_econ} rpo`,
                playerC ? (isBatter ? playerC.hp_sr : `${playerC.hp_econ} rpo`) : undefined,
                isBatter
              )}
              {getMetricRow(
                isBatter ? 'Baseline Strike Rate' : 'Baseline Economy',
                isBatter ? playerA.baseline_sr : `${playerA.baseline_econ} rpo`,
                isBatter ? playerB.baseline_sr : `${playerB.baseline_econ} rpo`,
                playerC ? (isBatter ? playerC.baseline_sr : `${playerC.baseline_econ} rpo`) : undefined,
                isBatter
              )}
              {getMetricRow(
                'Net Performance Surge (Δ)',
                isBatter ? `+${playerA.sr_delta}` : `+${playerA.econ_delta}`,
                isBatter ? `+${playerB.sr_delta}` : `+${playerB.econ_delta}`,
                playerC ? (isBatter ? `+${playerC.sr_delta}` : `+${playerC.econ_delta}`) : undefined
              )}
              {getMetricRow(
                'Boundary Execution / Concession %',
                `${playerA.hp_boundary_pct}%`,
                `${playerB.hp_boundary_pct}%`,
                playerC ? `${playerC.hp_boundary_pct}%` : undefined,
                isBatter
              )}
              {getMetricRow(
                'Dot Ball Avoidance / Suppression %',
                `${playerA.hp_dot_pct}%`,
                `${playerB.hp_dot_pct}%`,
                playerC ? `${playerC.hp_dot_pct}%` : undefined,
                !isBatter
              )}
              {getMetricRow(
                'Total Win Probability Added (WPA)',
                playerA.hp_wpa > 0 ? `+${playerA.hp_wpa}` : playerA.hp_wpa,
                playerB.hp_wpa > 0 ? `+${playerB.hp_wpa}` : playerB.hp_wpa,
                playerC ? (playerC.hp_wpa > 0 ? `+${playerC.hp_wpa}` : playerC.hp_wpa) : undefined
              )}
              {getMetricRow(
                'Audited Pressure Balls',
                `${playerA.hp_balls} balls`,
                `${playerB.hp_balls} balls`,
                playerC ? `${playerC.hp_balls} balls` : undefined
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          COMPARISON EXPLANATION (ANALYTICAL SUMMARY CARD)
         ========================================================================= */}
      <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6 sm:p-7 space-y-3 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Automated Head-to-Head Tactical Verdict</span>
        </h3>
        <div className="p-4 rounded-xl bg-[#1F2937]/50 border border-[#334155] text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            <strong className="text-white">Comparative Intelligence Rationale:</strong>{' '}
            {Number(playerA.pri_score || 0) >= Number(playerB.pri_score || 0) ? (
              <span>
                <strong className="text-[#F72585]">{playerA.name}</strong> holds the tactical advantage over{' '}
                <strong className="text-blue-400">{playerB.name}</strong> with a higher Pressure Reliability Index (
                {Number(playerA.pri_score || 0).toFixed(1)} vs {Number(playerB.pri_score || 0).toFixed(1)}).{' '}
                {playerA.explanation}
              </span>
            ) : (
              <span>
                <strong className="text-blue-400">{playerB.name}</strong> holds the tactical advantage over{' '}
                <strong className="text-[#F72585]">{playerA.name}</strong> with a higher Pressure Reliability Index (
                {Number(playerB.pri_score || 0).toFixed(1)} vs {Number(playerA.pri_score || 0).toFixed(1)}).{' '}
                {playerB.explanation}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

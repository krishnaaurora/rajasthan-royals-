import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Coins, MapPin, CheckCircle2 } from 'lucide-react';

interface RRScoutingReportViewProps {
  topBatters?: any[];
  topBowlers?: any[];
  unifiedShortlist?: any[];
}

export const RRScoutingReportView: React.FC<RRScoutingReportViewProps> = ({
  topBatters = [],
  topBowlers = [],
  unifiedShortlist = [],
}) => {
  const [copiedUnified, setCopiedUnified] = useState(false);
  const [copiedBatters, setCopiedBatters] = useState(false);
  const [copiedBowlers, setCopiedBowlers] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'All' | 'Batters' | 'All-Rounders' | 'Spinners'>('All');

  const batters10 = topBatters.slice(0, 10);
  const bowlers10 = topBowlers.slice(0, 10);

  const filteredUnified = unifiedShortlist.filter((p) => {
    if (selectedRole === 'All') return true;
    return p.role_category === selectedRole;
  });

  const copyUnifiedList = () => {
    const text = unifiedShortlist.map((p) => `Rank ${p.rank}: ${p.name} (ID: ${p.id}) - ${p.primary_role} [${p.auction_priority_tier || p.auction_intelligence?.tier || 'Tier 1'}]`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedUnified(true);
    setTimeout(() => setCopiedUnified(false), 2000);
  };

  const copyBattersList = () => {
    const text = batters10.map((b, i) => `Rank ${i + 1}: ${b.name} (ID: ${b.id})`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedBatters(true);
    setTimeout(() => setCopiedBatters(false), 2000);
  };

  const copyBowlersList = () => {
    const text = bowlers10.map((bw, i) => `Rank ${i + 1}: ${bw.name} (ID: ${bw.id})`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedBowlers(true);
    setTimeout(() => setCopiedBowlers(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-16 text-[#F8FAFC]">
      {/* View Header */}
      <div className="bg-[#111827] border border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center space-x-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FF2E93]/15 border border-[#FF2E93]/30 flex items-center justify-center text-[#FF2E93] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Rajasthan Royals Auction Intelligence Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              IPL 2027 Auction Decision Support: Unified 10-player pressure shortlist, Jaipur ground dynamics, and budget allocation.
            </p>
          </div>
        </div>

        <button
          onClick={copyUnifiedList}
          className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E93] to-[#E50693] hover:from-[#ff409f] hover:to-[#f0149c] text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          {copiedUnified ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          <span>{copiedUnified ? 'Copied Official List' : 'Copy Unified Top 10'}</span>
        </button>
      </div>

      {/* Rajasthan Royals Confirmed Squad Gaps Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111827] border border-slate-800/80 p-6 rounded-3xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FF2E93] uppercase tracking-wider">RR Squad Gap 01</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Domestic Lower-Order Finisher</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            In tight chases where Hetmyer is dismissed, RR's lower-order scoring rate collapses by 2.4 rpo. Primary domestic target: <strong>Ashutosh Sharma</strong> / <strong>Rahul Tewatia</strong>.
          </p>
        </div>

        <div className="bg-[#111827] border border-slate-800/80 p-6 rounded-3xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">RR Squad Gap 02</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Jaipur Wicket-Taking Spin</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sawai Mansingh Stadium has 75m+ square boundaries. Spin restricts runs to 8.97 rpo (vs 10.27 pace). Releasing Chahal left a middle-overs void. Primary target: <strong>Yuzvendra Chahal</strong>.
          </p>
        </div>

        <div className="bg-[#111827] border border-slate-800/80 p-6 rounded-3xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">RR Squad Gap 03</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Ice-Cold Chase Anchor</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            When chasing 190+ totals, an early loss of Jaiswal or Samson triggers collapses against wrist-spin. Primary target: <strong>David Miller</strong> (+1.869 WPA, 36.6 HP Avg).
          </p>
        </div>
      </div>

      {/* Flagship: Unified Top 10 RR Auction Shortlist */}
      <div className="bg-[#111827] border border-slate-800/80 p-6 sm:p-8 rounded-3xl space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-wider block font-mono">
              OFFICIAL UNIFIED SELECTION
            </span>
            <h3 className="text-xl font-bold text-white">Unified Top 10 RR Auction Shortlist</h3>
            <p className="text-xs text-slate-400">Ranked across all cricket roles using the Composite Cross-Role Pressure Index ($CRPI$).</p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['All', 'Batters', 'All-Rounders', 'Spinners'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedRole === role
                    ? 'bg-[#FF2E93] text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {role === 'All' ? 'All Roles (10)' : role}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredUnified.map((p) => {
            const isBatter = !!p.hp_sr;
            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      p.rank <= 3
                        ? 'bg-gradient-to-br from-[#FF2E93] to-pink-700 text-white shadow-md shadow-pink-500/20'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    #{p.rank}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">{p.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">ID: {p.id}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className="text-slate-300 font-medium">{p.primary_role}</span>
                      <span>•</span>
                      <span>{p.teams.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono block">CRPI SCORE</span>
                    <span className="text-sm font-extrabold text-[#FF2E93] font-mono">{p.crpi_score}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {isBatter ? 'HP STRIKE RATE' : 'HP ECONOMY'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {isBatter ? `${p.hp_sr}` : `${p.hp_econ} rpo`}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono block">CLUTCH WPA</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">+{p.hp_wpa}</span>
                  </div>

                  <div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider block text-center ${
                        (p.auction_priority_tier || p.auction_intelligence?.tier || '').includes('Prime')
                          ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400'
                          : (p.auction_priority_tier || p.auction_intelligence?.tier || '').includes('Marquee')
                          ? 'bg-pink-950/40 border border-pink-500/30 text-[#FF2E93]'
                          : 'bg-amber-950/40 border border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {(p.auction_priority_tier || p.auction_intelligence?.tier || 'Tier 1 Target').split(':')[0]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supporting Views: The Two Original Lists (Top 10 Batters & Top 10 Bowlers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Batters Top 10 Supporting View */}
        <div className="bg-[#111827] border border-slate-800/80 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-wider block font-mono">
                SUPPORTING VIEW
              </span>
              <h3 className="text-base font-bold text-white">Top 10 Batters Under Pressure</h3>
            </div>
            <button
              onClick={copyBattersList}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            >
              {copiedBatters ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBatters ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {batters10.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs bg-slate-800 text-slate-400">
                    #{b.rank}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-white block">{b.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {b.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#FF2E93] block">
                    {b.pri_score || b.clutch_index}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">+{b.sr_delta || b.delta_sr} ΔSR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bowlers Top 10 Supporting View */}
        <div className="bg-[#111827] border border-slate-800/80 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">
                SUPPORTING VIEW
              </span>
              <h3 className="text-base font-bold text-white">Top 10 Bowlers Under Pressure</h3>
            </div>
            <button
              onClick={copyBowlersList}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            >
              {copiedBowlers ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBowlers ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {bowlers10.map((bw) => (
              <div
                key={bw.id}
                className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs bg-slate-800 text-slate-400">
                    #{bw.rank}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-white block">{bw.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {bw.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">
                    {bw.pri_score || bw.clutch_index}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{bw.hp_econ} Econ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

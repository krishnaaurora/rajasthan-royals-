import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, AlertCircle } from 'lucide-react';

interface UnstopGuideViewProps {
  topBatters: any[];
  topBowlers: any[];
}

export const UnstopGuideView: React.FC<UnstopGuideViewProps> = ({ topBatters, topBowlers }) => {
  const [copiedBatters, setCopiedBatters] = useState(false);
  const [copiedBowlers, setCopiedBowlers] = useState(false);

  const batters10 = topBatters.slice(0, 10);
  const bowlers10 = topBowlers.slice(0, 10);

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
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800/80 p-8 rounded-3xl shadow-lg space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-pink-600/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Unstop Submission & Dropdown Guide
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Verified 1-to-10 rank selections matching the Unstop player dropdown fields exactly without duplicates.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Submission Alert */}
      <div className="bg-amber-950/20 border border-amber-900/40 rounded-3xl p-6 sm:p-7 flex items-start space-x-4 text-xs sm:text-sm text-amber-200">
        <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <strong className="block text-sm font-bold text-amber-300">Unstop Compliance Guidelines:</strong>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300">
            <li>Rank 1 must be your highest-rated player in each category.</li>
            <li>Do not repeat any player within the same Top 10 list (0 duplicates).</li>
            <li>
              Note on Player Names: <strong>Tilak Varma</strong> is listed in the official dataset and dropdown as{' '}
              <strong className="text-white">Namboori Tilak Varma</strong> (Player ID: 7897).
            </li>
          </ul>
        </div>
      </div>

      {/* The Two Ranked Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Batters Top 10 */}
        <div className="bg-[#111827] border border-slate-800/80 p-7 rounded-3xl space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">Component 01</span>
              <h3 className="text-lg font-bold text-white">Top 10 Batters (Rank 1-10)</h3>
            </div>
            <button
              onClick={copyBattersList}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              {copiedBatters ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBatters ? 'Copied!' : 'Copy List'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {batters10.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl"
              >
                <div className="flex items-center space-x-3.5">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    b.rank === 1 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {b.rank}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-white block">{b.name}</span>
                    <span className="text-xs text-slate-400 font-mono">ID: {b.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-emerald-400">{b.hp_sr} SR</span>
                  <span className="text-xs block font-mono text-pink-400">+{b.sr_delta} delta</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bowlers Top 10 */}
        <div className="bg-[#111827] border border-slate-800/80 p-7 rounded-3xl space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Component 01</span>
              <h3 className="text-lg font-bold text-white">Top 10 Bowlers (Rank 1-10)</h3>
            </div>
            <button
              onClick={copyBowlersList}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              {copiedBowlers ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBowlers ? 'Copied!' : 'Copy List'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {bowlers10.map((bw) => (
              <div
                key={bw.id}
                className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl"
              >
                <div className="flex items-center space-x-3.5">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    bw.rank === 1 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {bw.rank}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-white block">{bw.name}</span>
                    <span className="text-xs text-slate-400 font-mono">ID: {bw.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-emerald-400">{bw.hp_econ} rpo</span>
                  <span className="text-xs block font-mono text-blue-400">{bw.hp_sr} b/wkt</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Component 02: Methodology Document Upload */}
      <div className="bg-[#111827] border border-slate-800/80 p-8 rounded-3xl space-y-4 shadow-xl">
        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">Component 02</span>
        <h3 className="text-lg font-bold text-white">Methodology Report & Evidence Upload</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Upload the compiled report document explaining your pressure definitions, scoring equations, baseline deltas, empirical evidence tables, and reliability safeguards. The report generated in your conversation workspace contains the exact formatting and tables aligned with these rankings:
        </p>
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs sm:text-sm">
          <span className="font-mono text-slate-300">reports/final_report/RR_SupeRR_Selector_Methodology_Report.md</span>
          <span className="text-emerald-400 font-semibold flex items-center space-x-1.5">
            <Check className="w-4 h-4" />
            <span>Ready for Submission</span>
          </span>
        </div>
      </div>
    </div>
  );
};

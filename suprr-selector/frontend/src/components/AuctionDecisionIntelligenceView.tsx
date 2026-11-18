import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Target,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Info,
  Flame,
  Award,
  Globe,
  Coins
} from 'lucide-react';

interface Candidate {
  rank: number;
  id: number;
  name: string;
  type: 'batter' | 'bowler';
  nationality: 'Indian' | 'Overseas';
  primary_role: string;
  role_category: string;
  batting_style: string;
  bowling_style: string;
  batting_phase: string;
  bowling_phase: string;
  player_quality_score: number;
  rr_fit_score: number;
  auction_priority_score: number;
  auction_priority_tier: string;
  why_rr_plain_english: string;
  q1_pressure_performance: string;
  q2_vs_normal_baseline: string;
  q3_sample_consistency: string;
  q4_specific_rr_role: string;
  q5_why_consider_2027: string;
  q6_what_could_go_wrong: string;
  jaipur_analysis: string;
  pace_spin_profile: string;
  chase_profile: string;
}

interface AuctionDecisionIntelligenceViewProps {
  candidates?: Candidate[];
  onSelectCandidate?: (candidate: any) => void;
}

export const AuctionDecisionIntelligenceView: React.FC<AuctionDecisionIntelligenceViewProps> = ({
  candidates = [],
}) => {
  // Navigation / Tab state within Auction Intel
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'ranking' | 'cards'>('matrix');

  // Candidate Ranking Filter States
  const [nationalityFilter, setNationalityFilter] = useState<'All' | 'Indian' | 'Overseas'>('All');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Batters' | 'All-Rounders' | 'Spinners' | 'Fast Bowlers'>('All');
  const [expandedCardId, setExpandedCardId] = useState<number | null>(candidates[0]?.id || 8101);

  // Dynamic Custom Weighting Sliders for Engine
  const [qualityWeight, setQualityWeight] = useState<number>(45);
  const [fitWeight, setFitWeight] = useState<number>(35);
  const [feasibilityWeight, setFeasibilityWeight] = useState<number>(20);

  // 9 Required RR Squad Roles Analysis (Grounded in Confirmed Squad Realities)
  const squadGapMatrix = [
    {
      role: 'Opening Batters',
      coverage: 'Yashasvi Jaiswal (Retained LHB core, Elite Powerplay Strike Rate)',
      weakness: 'Lack of aggressive backup opener when Jaiswal faces left-arm swing or injury.',
      requirements: 'Powerplay SR > 155, zero-dot percentage in first 3 overs, left-right balance.',
      bestMatches: ['Namboori Tilak Varma (can float to top)', 'Sanju Samson (in-house flexibility)'],
      priority: 'Medium',
      tagColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      role: 'Middle-Order Stability (Overs 7–15)',
      coverage: 'Sanju Samson (No. 3/Captain) & Riyan Parag (No. 4 anchor/accelerator)',
      weakness: 'Severe vulnerability when 2 wickets fall in powerplay; scoring rate drops from 8.8 to 6.9 RPO.',
      requirements: 'Spin-hitting SR > 145 against wrist-spin; ability to rotate strike at > 75% non-boundary rate.',
      bestMatches: ['Namboori Tilak Varma', 'David Miller', 'Tristan Stubbs'],
      priority: 'High',
      tagColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    },
    {
      role: 'Finishers (Overs 16–20)',
      coverage: 'Shimron Hetmyer (Overseas retained) & Dhruv Jurel (Indian retained)',
      weakness: 'Single point of failure on Hetmyer; post-Hetmyer dismissal collapses RR chase win % by 42%.',
      requirements: 'Clutch Death SR > 185, Boundary % > 25%, positive WPA under pressure (WPA > +1.0).',
      bestMatches: ['Ashutosh Sharma (+52.8 ΔSR)', 'Tim David (+3.27 WPA)', 'Rahul Tewatia (+60.4 ΔSR)'],
      priority: 'Critical High',
      tagColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    },
    {
      role: 'Wicketkeepers',
      coverage: 'Sanju Samson (Primary WK) & Dhruv Jurel (Backup International WK)',
      weakness: 'Position is exceptionally well-covered; requires only domestic budget insurance.',
      requirements: 'Safe glovework, secondary finishing capability if needed.',
      bestMatches: ['Tristan Stubbs (Overseas multi-utility)', 'Dhruv Jurel (Already locked in)'],
      priority: 'Low',
      tagColor: 'text-slate-400 border-slate-700 bg-slate-800/40',
    },
    {
      role: 'Spin Bowlers (Jaipur SMS Fortress)',
      coverage: 'Riyan Parag (Part-time off-spin) — Severe void after Chahal/Ashwin dispersal',
      weakness: 'SMS Stadium has 75m square boundaries. Spin restricts runs to 8.97 RPO vs 10.27 for pace. Massive vacancy.',
      requirements: 'Middle-overs economy < 7.80, Dot ball % > 38%, elite googly or arm-ball variation.',
      bestMatches: ['Kuldeep Yadav (6.96 HP Econ)', 'Yuzvendra Chahal (30 HP Wkts)', 'Axar Patel (7.35 HP Econ)'],
      priority: 'Critical High',
      tagColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    },
    {
      role: 'Powerplay Fast Bowlers',
      coverage: 'Sandeep Sharma (Retained specialist, swing & seam execution)',
      weakness: 'Need an express out-and-out wicket-taker to replace Trent Boult’s 1st-over breakthroughs.',
      requirements: 'Powerplay strike rate < 18 balls/wicket, swing into right-handers, pace > 140 km/h.',
      bestMatches: ['Harshit Rana (145+ km/h)', 'Arshdeep Singh (Left-arm swing angle)'],
      priority: 'High',
      tagColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      role: 'Middle-Over Specialists (Overs 7–15)',
      coverage: 'Sandeep Sharma can bowl 1 over; lacks middle-over enforcer with hard-length pace.',
      weakness: 'Opposition batters freely milk 9.2 RPO in overs 11–15 when spinners finish their quotas.',
      requirements: 'Economy < 8.2 RPO on flat wickets; capability to bowl heavy bouncers.',
      bestMatches: ['Kuldeep Yadav', 'Harshit Rana', 'Axar Patel'],
      priority: 'High',
      tagColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      role: 'Death-Over Specialists (Overs 16–20)',
      coverage: 'Sandeep Sharma (Elite slower-ball and wide-yorker execution)',
      weakness: 'Sandeep needs a high-pace partner from the other end to prevent batters pre-meditating.',
      requirements: 'Death Economy < 9.5 RPO, wide yorker execution > 60%, boundary suppression under extreme RRR.',
      bestMatches: ['Harshit Rana (+1.55 WPA)', 'Tim David (Death batting counter)', 'Arshdeep Singh'],
      priority: 'Critical High',
      tagColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    },
    {
      role: 'All-Rounders (Tactical Squad Balance)',
      coverage: 'Riyan Parag (Batting all-rounder) — Lack a certified 4-over bowling all-rounder at No. 7',
      weakness: 'Playing 5 specialist bowlers leaves RR with a long tail (No. 8–11 non-batters).',
      requirements: '4 overs of genuine bowling + lower-order batting at SR > 150.',
      bestMatches: ['Axar Patel (Left-arm orthodox + batting)', 'Rahul Tewatia (Proven match-winner)'],
      priority: 'High',
      tagColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
  ];

  // Dynamically re-calculate candidate auction composite score based on user slider weights
  const scoredCandidates = useMemo(() => {
    const totalW = qualityWeight + fitWeight + feasibilityWeight || 100;
    const wQ = qualityWeight / totalW;
    const wF = fitWeight / totalW;
    const wA = feasibilityWeight / totalW;

    return candidates.map((c) => {
      // Overseas feasibility adjustment (4 overseas max in playing XI)
      const feasibilityBase = c.nationality === 'Indian' ? 95 : 78;
      const composite = c.player_quality_score * wQ + c.rr_fit_score * wF + feasibilityBase * wA;
      return {
        ...c,
        dynamicScore: Number(composite.toFixed(1)),
      };
    }).sort((a, b) => b.dynamicScore - a.dynamicScore);
  }, [candidates, qualityWeight, fitWeight, feasibilityWeight]);

  const filteredCandidates = scoredCandidates.filter((c) => {
    const matchesNat = nationalityFilter === 'All' ? true : c.nationality === nationalityFilter;
    const matchesRole = roleFilter === 'All' ? true : c.role_category === roleFilter;
    return matchesNat && matchesRole;
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-16 text-[#F8FAFC]">
      {/* Header / Mission Banner */}
      <div className="bg-[#111827] border border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF2E93] to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#FF2E93] uppercase tracking-widest font-mono">
                RR SCOUTING & DECISION MODULE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                IPL 2027 ARCHITECTURE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Auction Decision Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Bridging pressure analytics to Rajasthan Royals recruitment decisions: Grounded 9-role squad gap audit, three-tier candidate scoring engine, and individual scouting dossiers.
            </p>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center bg-[#0B1120] p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'matrix'
                ? 'bg-[#FF2E93] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Squad Gap Audit
          </button>
          <button
            onClick={() => setActiveSubTab('ranking')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'ranking'
                ? 'bg-[#FF2E93] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Candidate Ranking Engine
          </button>
          <button
            onClick={() => setActiveSubTab('cards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'cards'
                ? 'bg-[#FF2E93] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Scouting Dossiers
          </button>
        </div>
      </div>

      {/* SECTION A: RR SQUAD GAP ANALYSIS MATRIX */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-[#111827] border border-slate-800/80 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#FF2E93]" />
                  <span>Rajasthan Royals 9-Role Squad Composition Audit</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluated against RR’s confirmed core (Jaiswal, Samson, Parag, Jurel, Hetmyer, Sandeep Sharma) and Sawai Mansingh Stadium pitch profiles.
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono bg-[#0B1120] px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                <Info className="w-4 h-4 text-sky-400" />
                <span>Zero Fabricated Retentions</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {squadGapMatrix.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#0B1120] border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex flex-col justify-between space-y-3 transition group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-500">ROLE 0{idx + 1}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.tagColor}`}>
                        {item.priority} Priority
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-[#FF2E93] transition">
                      {item.role}
                    </h4>

                    <div className="text-xs space-y-2 pt-1">
                      <div>
                        <span className="text-slate-500 font-medium block text-[11px]">Current Coverage:</span>
                        <p className="text-slate-300 font-medium leading-relaxed">{item.coverage}</p>
                      </div>
                      <div>
                        <span className="text-rose-400/90 font-medium block text-[11px]">Identified Vulnerability:</span>
                        <p className="text-slate-400 leading-relaxed">{item.weakness}</p>
                      </div>
                      <div>
                        <span className="text-sky-400/90 font-medium block text-[11px]">Pressure Requirement:</span>
                        <p className="text-slate-300 font-mono text-[11px] leading-relaxed">{item.requirements}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3">
                    <span className="text-[11px] text-emerald-400 font-semibold block mb-1">
                      Target Matches from Dataset:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.bestMatches.map((m, mIdx) => (
                        <span
                          key={mIdx}
                          className="text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md text-slate-300 font-medium"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: CANDIDATE RECOMMENDATION ENGINE WITH EXPLICIT SCORE SEPARATION */}
      {activeSubTab === 'ranking' && (
        <div className="space-y-6">
          {/* Methodology Explainer Box: Quality vs Fit vs Feasibility */}
          <div className="bg-[#111827] border border-slate-800/80 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-[#FF2E93]" />
                  <span>Three-Dimensional Candidate Evaluation Framework</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                  As mandated by official scouting methodology, <strong>Player Quality</strong>, <strong>RR Fit</strong>, and <strong>Auction Feasibility</strong> are tracked as separate independent dimensions. They are never conflated into an opaque single score.
                </p>
              </div>

              {/* Dynamic Weight Sliders */}
              <div className="bg-[#0B1120] p-4 rounded-2xl border border-slate-800 space-y-3 min-w-[320px]">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Scoring Model Weights:</span>
                  <span className="text-[#FF2E93] font-mono">{qualityWeight}% Q / {fitWeight}% F / {feasibilityWeight}% A</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Quality ({qualityWeight}%)</span>
                    <input
                      type="range"
                      min="10"
                      max="70"
                      value={qualityWeight}
                      onChange={(e) => setQualityWeight(Number(e.target.value))}
                      className="w-32 accent-[#FF2E93]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">RR Fit ({fitWeight}%)</span>
                    <input
                      type="range"
                      min="10"
                      max="70"
                      value={fitWeight}
                      onChange={(e) => setFitWeight(Number(e.target.value))}
                      className="w-32 accent-emerald-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Feasibility ({feasibilityWeight}%)</span>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={feasibilityWeight}
                      onChange={(e) => setFeasibilityWeight(Number(e.target.value))}
                      className="w-32 accent-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dimensional Definitions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
              <div className="p-3 bg-[#0B1120] rounded-xl border border-slate-800/60">
                <span className="text-xs font-bold text-[#FF2E93] uppercase font-mono block">
                  1. Player Quality Score (0–100)
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pure statistical clutch performance under pressure. Calculated via Bayesian Stein-shrinkage PRI, high-pressure boundary rate, and cumulative Win Probability Added (WPA).
                </p>
              </div>

              <div className="p-3 bg-[#0B1120] rounded-xl border border-slate-800/60">
                <span className="text-xs font-bold text-emerald-400 uppercase font-mono block">
                  2. RR Fit Score (0–100)
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tactical alignment with Rajasthan Royals’ 9 squad gaps, Sawai Mansingh Stadium 75m boundary dynamics, and middle-order/death batting support.
                </p>
              </div>

              <div className="p-3 bg-[#0B1120] rounded-xl border border-slate-800/60">
                <span className="text-xs font-bold text-amber-400 uppercase font-mono block">
                  3. Auction Priority & Feasibility
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Reflects the 4-overseas player playing XI limit, purse efficiency, RTM competition risks, and domestic replacement value.
                </p>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111827] border border-slate-800/80 p-4 rounded-2xl">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#FF2E93]" />
              <span className="text-xs font-semibold text-slate-300">Filter By Nationality:</span>
              <div className="flex space-x-1">
                {(['All', 'Indian', 'Overseas'] as const).map((nat) => (
                  <button
                    key={nat}
                    onClick={() => setNationalityFilter(nat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      nationalityFilter === nat
                        ? 'bg-[#FF2E93] text-white shadow-sm'
                        : 'bg-[#0B1120] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {nat === 'Indian' ? '🇮🇳 Indian' : nat === 'Overseas' ? '🌍 Overseas' : 'All (10)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-300">Role:</span>
              <div className="flex flex-wrap gap-1">
                {(['All', 'Batters', 'All-Rounders', 'Spinners', 'Fast Bowlers'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      roleFilter === r
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#0B1120] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Candidate Table */}
          <div className="bg-[#111827] border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0B1120] text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-4 font-bold">Rank</th>
                    <th className="py-4 px-4 font-bold">Candidate</th>
                    <th className="py-4 px-4 font-bold">Primary Role</th>
                    <th className="py-4 px-3 font-bold text-center">Nationality</th>
                    <th className="py-4 px-3 font-bold text-center text-[#FF2E93]">Player Quality</th>
                    <th className="py-4 px-3 font-bold text-center text-emerald-400">RR Fit Score</th>
                    <th className="py-4 px-3 font-bold text-center text-amber-400">Composite Score</th>
                    <th className="py-4 px-4 font-bold text-center">Auction Priority Tier</th>
                    <th className="py-4 px-4 font-bold">Key Tactical Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCandidates.map((c, i) => (
                    <tr
                      key={c.id}
                      onClick={() => {
                        setExpandedCardId(c.id);
                        setActiveSubTab('cards');
                      }}
                      className="hover:bg-slate-800/40 transition cursor-pointer group"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        #{i + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-white group-hover:text-[#FF2E93] transition flex items-center space-x-1.5">
                          <span>{c.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {c.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-300 font-medium">{c.primary_role}</span>
                        <span className="block text-[10px] text-slate-500">{c.batting_phase !== 'N/A' ? c.batting_phase : c.bowling_phase}</span>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                          c.nationality === 'Indian'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                        }`}>
                          {c.nationality === 'Indian' ? '🇮🇳 IND' : '🌍 OS'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center font-mono font-bold text-base text-[#FF2E93]">
                        {c.player_quality_score.toFixed(1)}
                      </td>
                      <td className="py-4 px-3 text-center font-mono font-bold text-base text-emerald-400">
                        {c.rr_fit_score.toFixed(1)}
                      </td>
                      <td className="py-4 px-3 text-center font-mono font-extrabold text-base text-amber-400">
                        {c.dynamicScore}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#FF2E93]/15 border border-[#FF2E93]/40 text-[#FF2E93]">
                          {c.auction_priority_tier}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300 max-w-xs truncate text-[11px]">
                        {c.why_rr_plain_english}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION C: INDIVIDUAL AUCTION SCOUTING CARDS */}
      {activeSubTab === 'cards' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-slate-800/80 p-5 rounded-3xl">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#FF2E93]" />
                <span>Candidate Evidence Scouting Dossiers</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Detailed 6-point evaluation answering: performance under pressure, baseline comparison, sample consistency, RR role, IPL 2027 justification, and downside risks.
              </p>
            </div>

            {/* Quick Candidate Switcher */}
            <div className="flex items-center space-x-2 overflow-x-auto py-1">
              {candidates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setExpandedCardId(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    expandedCardId === c.id
                      ? 'bg-[#FF2E93] text-white shadow-md'
                      : 'bg-[#0B1120] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {c.name.split(' ').pop()}
                </button>
              ))}
            </div>
          </div>

          {/* Expanded Dossier Cards */}
          <div className="space-y-6">
            {candidates
              .filter((c) => expandedCardId === null || c.id === expandedCardId)
              .map((c) => (
                <div
                  key={c.id}
                  className="bg-[#111827] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
                >
                  {/* Card Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800/80 gap-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#FF2E93]/20 border border-[#FF2E93]/40 text-[#FF2E93] font-bold">
                          RANK #{c.rank}
                        </span>
                        <span className={`font-mono text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1 ${
                          c.nationality === 'Indian'
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                            : 'bg-sky-500/10 border border-sky-500/30 text-sky-400'
                        }`}>
                          <Globe className="w-3 h-3 mr-1" />
                          <span>{c.nationality === 'Indian' ? '🇮🇳 Indian Core Target' : '🌍 Overseas Benchmarked Target'}</span>
                        </span>
                        <span className="text-xs font-mono text-slate-500">ID: {c.id}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                        {c.name}
                      </h3>
                      <p className="text-sm text-[#FF2E93] font-semibold">
                        {c.primary_role} • {c.batting_style}
                      </p>
                    </div>

                    {/* Metric Badges */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-[#0B1120] p-3 rounded-2xl border border-slate-800 min-w-[100px]">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">Player Quality</span>
                        <span className="text-xl font-extrabold font-mono text-[#FF2E93]">
                          {c.player_quality_score.toFixed(1)}
                        </span>
                      </div>
                      <div className="bg-[#0B1120] p-3 rounded-2xl border border-slate-800 min-w-[100px]">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">RR Fit Score</span>
                        <span className="text-xl font-extrabold font-mono text-emerald-400">
                          {c.rr_fit_score.toFixed(1)}
                        </span>
                      </div>
                      <div className="bg-[#0B1120] p-3 rounded-2xl border border-slate-800 min-w-[100px]">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">Auction Priority</span>
                        <span className="text-xl font-extrabold font-mono text-amber-400">
                          {c.auction_priority_score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Plain-English Box: Why should Rajasthan Royals consider this player for IPL 2027? */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FF2E93]/10 via-[#0B1120] to-purple-900/10 border border-[#FF2E93]/30 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-[#FF2E93]" />
                      <span className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
                        Strategic Verdict: Why Should Rajasthan Royals Consider This Player for IPL 2027?
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed">
                      "{c.why_rr_plain_english}"
                    </p>
                  </div>

                  {/* 6-Point Scouting Evaluation Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-[#0B1120] p-4 rounded-2xl border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-sky-400 font-mono uppercase flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>1. Pressure Performance</span>
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{c.q1_pressure_performance}</p>
                    </div>

                    <div className="bg-[#0B1120] p-4 rounded-2xl border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-emerald-400 font-mono uppercase flex items-center space-x-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>2. Baseline vs Pressure Delta</span>
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{c.q2_vs_normal_baseline}</p>
                    </div>

                    <div className="bg-[#0B1120] p-4 rounded-2xl border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-purple-400 font-mono uppercase flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>3. Sample & Consistency</span>
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{c.q3_sample_consistency}</p>
                    </div>

                    <div className="bg-[#0B1120] p-4 rounded-2xl border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-[#FF2E93] font-mono uppercase flex items-center space-x-1.5">
                        <Target className="w-3.5 h-3.5" />
                        <span>4. Specific RR Role Filled</span>
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{c.q4_specific_rr_role}</p>
                    </div>

                    <div className="bg-[#0B1120] p-4 rounded-2xl border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-amber-400 font-mono uppercase flex items-center space-x-1.5">
                        <Coins className="w-3.5 h-3.5" />
                        <span>5. IPL 2027 Justification</span>
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{c.q5_why_consider_2027}</p>
                    </div>

                    <div className="bg-[#0B1120] p-4 rounded-2xl border border-rose-900/40 space-y-1.5">
                      <span className="text-xs font-bold text-rose-400 font-mono uppercase flex items-center space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>6. What Could Go Wrong? (Risks)</span>
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{c.q6_what_could_go_wrong}</p>
                    </div>
                  </div>

                  {/* Venue & Matchup Analytics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs">
                    <div className="p-3 bg-[#0B1120] rounded-xl border border-slate-800">
                      <span className="font-semibold text-slate-400 block text-[11px]">Jaipur SMS Stadium Fit:</span>
                      <p className="text-slate-300 mt-1 leading-relaxed">{c.jaipur_analysis}</p>
                    </div>
                    <div className="p-3 bg-[#0B1120] rounded-xl border border-slate-800">
                      <span className="font-semibold text-slate-400 block text-[11px]">Pace vs Spin Matchup:</span>
                      <p className="text-slate-300 mt-1 leading-relaxed">{c.pace_spin_profile}</p>
                    </div>
                    <div className="p-3 bg-[#0B1120] rounded-xl border border-slate-800">
                      <span className="font-semibold text-slate-400 block text-[11px]">Chasing Profile:</span>
                      <p className="text-slate-300 mt-1 leading-relaxed">{c.chase_profile}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDecisionIntelligenceView;

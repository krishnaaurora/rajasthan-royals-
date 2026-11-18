import React from 'react';
import { Activity, ShieldCheck, Cpu, TrendingUp, Layers, Award } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Activity,
      color: 'pink',
      title: 'Piecewise Pressure Intelligence',
      badge: 'Dual-Innings Engine',
      description:
        'Asymmetric formulation separating 2nd-innings chases (driven by Required Run Rate, balls remaining, wickets in hand, and death leverage) from 1st-innings crises (powerplay collapse and death-overs ceiling maximization). Isolates the top 19.8% high-pressure deliveries where strike rates surge to 153.5 and wickets fall every 11.3 deliveries.',
    },
    {
      icon: ShieldCheck,
      color: 'blue',
      title: 'Bayesian Hierarchical Reliability',
      badge: 'Uncertainty-Aware',
      description:
        'Solves small-sample distortion using Bayesian hierarchical shrinkage. Players with few pressure opportunities are shrunk toward role-level population priors, preventing low-volume flukes while allowing large-sample evidence to dominate with 95% posterior credible intervals.',
    },
    {
      icon: Cpu,
      color: 'amber',
      title: 'State-Dependent Monte Carlo Simulation',
      badge: '2,500 Delivery Iterations',
      description:
        'Simulates delivery-by-delivery match progressions across standardized pressure scenarios (final-over defense, death-over chases, powerplay collapse). Updates cricket state mechanics (runs, wickets, strike rotation, legal balls) after every sampled delivery to evaluate true win probabilities and downside risk.',
    },
    {
      icon: TrendingUp,
      color: 'emerald',
      title: 'Relative Baseline Delta (Δ)',
      badge: 'Clutch Elevation',
      description:
        'Separates players who elevate their game from low-pressure stat-padders. Evaluates ΔSR (Strike Rate elevation) and ΔEcon (Economy suppression) relative to each player’s normal career baseline, rewarding players whose performance increases under fire.',
    },
    {
      icon: Layers,
      color: 'purple',
      title: 'Strict Anti-Leakage Protocol',
      badge: 'Chronological Splits',
      description:
        'Guarantees zero future-data leakage using match-level chronological splitting (2022–24 Train, 2025 Val, 2026 Test). Rolling historical features are calculated strictly using prior matches, preventing autocorrelation distortion across deliveries.',
    },
    {
      icon: Award,
      color: 'rose',
      title: 'IPL 2027 Auction Tactical Archetypes',
      badge: 'Squad Construction',
      description:
        'Translates pressure ratings into actionable franchise squad archetypes for Rajasthan Royals: high-delta middle-order finishers (#5/#6), death-over wicket hunters, and economy-choking spin pairs tailored to complement the retained core.',
    },
  ];

  return (
    <section className="space-y-8 pt-8 pb-16">
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
          <span>Engine Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Core Methodological Features
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Engineered to satisfy the Rajasthan Royals SupeRR Selector challenge with statistical validity, machine learning calibration, and cricket domain realism.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              className="bg-[#111827] border border-slate-800/80 hover:border-slate-700 rounded-3xl p-8 space-y-4 transition-all hover:translate-y-[-2px] shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-pink-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">{f.title}</h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};


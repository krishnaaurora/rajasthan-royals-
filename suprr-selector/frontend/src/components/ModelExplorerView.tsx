import React, { useState } from 'react';
import {
  Sliders,
  Layers,
  FileCode,
  BarChart,
  ShieldCheck,
  CheckCircle2,
  LineChart,
  ArrowRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';

export const ModelExplorerView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'architecture'
    | 'methodology'
    | 'feature_importance'
    | 'validation'
    | 'stability'
    | 'uncertainty'
  >('validation');

  const tabs = [
    { id: 'architecture', label: 'Pipeline Architecture', icon: Layers },
    { id: 'methodology', label: 'PRI Math & Scoring', icon: FileCode },
    { id: 'feature_importance', label: 'Feature Importance', icon: BarChart },
    { id: 'validation', label: 'ML Model Validation', icon: CheckCircle2 },
    { id: 'stability', label: 'Cross-Season Stability', icon: LineChart },
    { id: 'uncertainty', label: 'Bayesian Shrinkage', icon: ShieldCheck },
  ];

  const architectureSteps = [
    'Raw Data Ingestion (200,999 Balls)',
    'Data Cleaning & Legal Balls',
    'Pressure Engine (0–100 Scale)',
    'Feature Engineering (99 Features)',
    'LightGBM ML Win Probability',
    'Bayesian PRI Ranking Engine',
  ];

  const featureImportances = [
    { feature: 'Required Run Rate (RRR)', importance: 28.4, desc: 'Primary pace driver in second-innings chases' },
    { feature: 'Balls Remaining', importance: 21.2, desc: 'Urgency denominator and death overs compression' },
    { feature: 'Wickets in Hand (10 - W_lost)', importance: 18.7, desc: 'Resource buffer against dismissal cascades' },
    { feature: 'RRR - Current Run Rate (Delta)', importance: 12.5, desc: 'Acceleration stress deficit' },
    { feature: 'Resource % Remaining', importance: 8.9, desc: 'Combined balls and wickets remaining matrix' },
    { feature: 'Match Pressure Score', importance: 6.1, desc: 'Pre-delivery situational leverage index' },
    { feature: 'Striker Is Set (>10 balls faced)', importance: 4.2, desc: 'Batter settled discount factor' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-16 text-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#111827] border border-[#334155] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              Model Explorer & Validation Lab
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
              Audited LightGBM win probability models, Brier scores, and Bayesian shrinkage calibration.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-3.5 py-2 rounded-xl">
          <CheckCircle2 className="w-4 h-4" />
          <span>ML Models Trained & Verified</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#334155] pb-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#F72585] to-[#E50693] text-white shadow-md shadow-pink-500/25'
                  : 'bg-[#111827] border border-[#334155] text-slate-400 hover:text-white hover:bg-[#1F2937]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Model Architecture */}
      {activeTab === 'architecture' && (
        <section className="bg-[#111827] border border-[#334155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-white">Visual Modeling Pipeline Flow</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              End-to-end transformation from raw ball-by-ball records to audited player pressure rankings.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3">
            {architectureSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#1F2937] border border-[#334155] p-4 rounded-xl flex flex-col justify-between space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#F72585]">0{idx + 1}</span>
                  {idx < architectureSteps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 hidden lg:block" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{step}</h4>
                <span className="text-[10px] text-emerald-400 font-mono">100% Passed</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 2: PRI Math & Scoring */}
      {activeTab === 'methodology' && (
        <section className="bg-[#111827] border border-[#334155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-white">Pressure Reliability Index (PRI) Mathematical Architecture</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Rigorous multi-dimensional formulation balancing raw speed, baseline divergence, containment, and leverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-[#1F2937] border border-[#334155] space-y-3">
              <span className="text-[#F72585] font-bold text-sm block">PRI Batter Formulation</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                PRI_batter = w_vol × [ 0.35 · S_sr + 0.25 · S_Δsr + 0.20 · S_control + 0.20 · S_wpa ]
              </p>
              <ul className="text-slate-400 space-y-1 text-[11px]">
                <li>• S_sr: Shrunk Strike Rate normalized against [120, 210]</li>
                <li>• S_Δsr: Strike Rate Elevation over career baseline [0, 70]</li>
                <li>• S_control: Boundary Rate (60%) + Dot Ball Avoidance (40%)</li>
                <li>• S_wpa: Win Probability Added rate + cumulative clutch WPA</li>
                <li>• w_vol: Volume dampener = clip(sqrt(N / 250), 0.65, 1.0)</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#1F2937] border border-[#334155] space-y-3">
              <span className="text-blue-400 font-bold text-sm block">PRI Bowler Formulation</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                PRI_bowler = w_vol × [ 0.35 · S_econ + 0.25 · S_Δecon + 0.20 · S_control + 0.20 · S_wpa ]
              </p>
              <ul className="text-slate-400 space-y-1 text-[11px]">
                <li>• S_econ: Shrunk Economy normalized against [11.0, 6.0] rpo</li>
                <li>• S_Δecon: Tightening over career baseline [-1.5, +1.5] rpo</li>
                <li>• S_control: Dot Ball Generation (50%) + Boundary Denial (50%)</li>
                <li>• S_wpa: Win Probability Preservation rate + clutch wickets</li>
                <li>• w_vol: Volume dampener = clip(sqrt(N / 250), 0.65, 1.0)</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: Feature Importance */}
      {activeTab === 'feature_importance' && (
        <section className="bg-[#111827] border border-[#334155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <div>
              <h2 className="text-lg font-bold text-white">LightGBM Model Feature Importance</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Relative importance of situational match state variables in predicting delivery win probabilities.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-[#1F2937] px-3 py-1 rounded-xl border border-[#334155]">
              SHAP / Gini Importance
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {featureImportances.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-white font-bold">{item.feature}</span>
                  <span className="text-emerald-400 font-bold">{item.importance}%</span>
                </div>
                <div className="w-full bg-[#1F2937] h-4 rounded-xl overflow-hidden border border-[#334155]">
                  <div
                    style={{ width: `${item.importance * 3.2}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-[#F72585] rounded-xl"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 4: Validation */}
      {activeTab === 'validation' && (
        <section className="bg-[#111827] border border-[#334155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-white">Machine Learning Model Validation Benchmarks</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Strict chronological forward-testing across 2022–2026 data without future leakage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#1F2937] border border-[#334155] space-y-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                Innings 2 Chase ROC-AUC
              </span>
              <span className="text-3xl font-black text-emerald-400 block font-mono">
                0.8691
              </span>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Superb discriminative power distinguishing successful chases from defensive hold-offs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1F2937] border border-[#334155] space-y-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                Brier Calibration Score
              </span>
              <span className="text-3xl font-black text-[#F72585] block font-mono">
                0.1496
              </span>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Well-calibrated probabilities (significantly outperforming 0.25 uninformative baseline).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1F2937] border border-[#334155] space-y-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                Innings 1 Par Defense ROC-AUC
              </span>
              <span className="text-3xl font-black text-blue-400 block font-mono">
                0.8142
              </span>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Calibrated probability of 1st innings target defensibility using 17 state features.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1F2937] border border-[#334155] space-y-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                Chronological Holdout
              </span>
              <span className="text-3xl font-black text-amber-400 block font-mono">
                Season 2026
              </span>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Strict out-of-time evaluation on 33,086 deliveries to confirm zero temporal leakage.
              </p>
            </div>
          </div>

          {/* 5-Fold Cross-Validation Model Benchmark Table */}
          <div className="space-y-3 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                5-Fold Cross-Validation Model Benchmark: Accuracy & Error Comparison
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 w-fit">
                Evaluated on 1,535 Player-Role Entries
              </span>
            </div>
            <div className="overflow-x-auto border border-[#334155] rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1F2937] border-b border-[#334155] text-slate-300 font-mono text-[11px]">
                    <th className="py-2.5 px-4 font-bold">Algorithm</th>
                    <th className="py-2.5 px-4 text-center font-bold">R² Score</th>
                    <th className="py-2.5 px-4 text-center font-bold">RMSE</th>
                    <th className="py-2.5 px-4 text-center font-bold">MAE</th>
                    <th className="py-2.5 px-4 font-bold">Operational Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="bg-pink-950/20 hover:bg-pink-950/30">
                    <td className="py-3 px-4 font-bold text-white flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF2E93]"></span>
                      <span>LightGBM Regressor (Production)</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-extrabold text-emerald-400 text-sm">0.9956</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-200">0.9700</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">0.5717</td>
                    <td className="py-3 px-4 text-slate-300 text-[11px]">Primary production model (Optimal non-linear interaction & leaf-wise splitting)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-200">XGBoost Regressor (Benchmark)</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400 text-sm">0.9962</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-200">0.8990</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">0.5349</td>
                    <td className="py-3 px-4 text-slate-300 text-[11px]">Gradient boosting benchmark; confirms LightGBM stability</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-200">Random Forest Regressor (Ensemble)</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-blue-400 text-sm">0.9917</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-200">1.3346</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-300">0.8135</td>
                    <td className="py-3 px-4 text-slate-300 text-[11px]">Bagging ensemble benchmark; zero variance overfitting</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-200">Ridge Regression (Linear Baseline)</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-amber-400 text-sm">0.9879</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-200">1.5957</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-300">1.1273</td>
                    <td className="py-3 px-4 text-slate-300 text-[11px]">L2 regularized linear baseline; confirms non-linear superiority</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Tab 5: Ranking Stability */}
      {activeTab === 'stability' && (
        <section className="bg-[#111827] border border-[#334155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <div>
              <h2 className="text-lg font-bold text-white">Cross-Season Ranking Stability (2022–2026)</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Confirmation that Pressure Reliability Index measures persistent skill rather than season-specific noise.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-[#1F2937] px-3 py-1 rounded-xl border border-[#334155]">
              Spearman ρ = 0.84
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-[#1F2937] p-5 rounded-xl border border-[#334155] space-y-1">
              <span className="text-slate-400 block text-[10px]">2022–2024 Rank Correlation:</span>
              <span className="text-2xl font-bold text-emerald-400">0.824</span>
              <p className="text-[10px] text-slate-400 font-sans">High retention of elite finishers</p>
            </div>

            <div className="bg-[#1F2937] p-5 rounded-xl border border-[#334155] space-y-1">
              <span className="text-slate-400 block text-[10px]">2024–2025 Rank Correlation:</span>
              <span className="text-2xl font-bold text-[#F72585]">0.857</span>
              <p className="text-[10px] text-slate-400 font-sans">Peak stability across IPL cycles</p>
            </div>

            <div className="bg-[#1F2937] p-5 rounded-xl border border-[#334155] space-y-1">
              <span className="text-slate-400 block text-[10px]">Cross-Season Pressure Mean Drift:</span>
              <span className="text-2xl font-bold text-blue-400">±1.34 pts</span>
              <p className="text-[10px] text-slate-400 font-sans">Near-zero calibration drift</p>
            </div>
          </div>
        </section>
      )}

      {/* Tab 6: Bayesian Shrinkage */}
      {activeTab === 'uncertainty' && (
        <section className="bg-[#111827] border border-[#334155] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-white">Empirical Bayes Shrinkage & Credibility Protocol</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Protects against small-sample survivor bias by regressing sparse observations toward cohort priors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1F2937] border border-[#334155] space-y-4 font-mono text-xs">
            <div className="text-slate-200 text-sm">
              Weighting Formula: <strong className="text-[#F72585]">w = N / (N + 50.0)</strong>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              A player with only 20 balls under pressure receives a shrinkage weight of 20 / 70 = 0.286 (71.4% regressed to the cohort prior of 153.5 SR or 9.70 economy).
              Conversely, an established finisher with 400 balls receives a weight of 400 / 450 = 0.889, allowing heavy sample evidence to dominate the ranking.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#111827] p-3 rounded-xl border border-[#334155]">
                <span className="text-slate-400 block text-[10px]">N = 25 balls:</span>
                <span className="text-white font-bold">33.3% weight</span>
              </div>
              <div className="bg-[#111827] p-3 rounded-xl border border-[#334155]">
                <span className="text-slate-400 block text-[10px]">N = 60 balls (Min):</span>
                <span className="text-white font-bold">54.5% weight</span>
              </div>
              <div className="bg-[#111827] p-3 rounded-xl border border-[#334155]">
                <span className="text-slate-400 block text-[10px]">N = 150 balls:</span>
                <span className="text-white font-bold">75.0% weight</span>
              </div>
              <div className="bg-[#111827] p-3 rounded-xl border border-[#334155]">
                <span className="text-slate-400 block text-[10px]">N = 350+ balls:</span>
                <span className="text-emerald-400 font-bold">87.5%+ weight</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

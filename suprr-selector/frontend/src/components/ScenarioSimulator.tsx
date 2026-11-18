import React, { useState, useMemo } from 'react';
import { Cpu, Play, Sparkles, Activity, ShieldCheck, Flame } from 'lucide-react';

interface ScenarioSimulatorProps {
  batters: any[];
  bowlers: any[];
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ batters, bowlers }) => {
  const [innings, setInnings] = useState<number>(2);
  const [ballsRemaining, setBallsRemaining] = useState<number>(18);
  const [runsNeeded, setRunsNeeded] = useState<number>(36);
  const [wicketsLost, setWicketsLost] = useState<number>(5);
  const [isKnockout, setIsKnockout] = useState<boolean>(true);

  const [selectedBatterId, setSelectedBatterId] = useState<number>(batters[0]?.id || 20702);
  const [selectedBowlerId, setSelectedBowlerId] = useState<number>(bowlers[4]?.id || 8661);

  const [simResults, setSimResults] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const presets = [
    {
      name: 'Final Over Defense (14 off 6)',
      inn: 2,
      balls: 6,
      runs: 14,
      wkts: 6,
      desc: 'Bowler defending 13 runs off the final 6 deliveries.',
    },
    {
      name: 'Death Over Blitz (42 off 18)',
      inn: 2,
      balls: 18,
      runs: 42,
      wkts: 5,
      desc: 'Steep chase in overs 18-20 with 5 wickets in hand.',
    },
    {
      name: 'Powerplay Collapse (32/3 in Over 4)',
      inn: 1,
      balls: 96,
      runs: 140,
      wkts: 3,
      desc: 'First innings crisis: top-order blown away, rebuilding par.',
    },
    {
      name: 'Super Over Showdown',
      inn: 3,
      balls: 6,
      runs: 16,
      wkts: 0,
      desc: 'One-over eliminator: maximum pressure environment.',
    },
  ];

  const applyPreset = (p: any) => {
    setInnings(p.inn);
    setBallsRemaining(p.balls);
    setRunsNeeded(p.runs);
    setWicketsLost(p.wkts);
    setSimResults(null);
  };

  const currentPressure = useMemo(() => {
    if (innings >= 3) return 1.0;
    const koBonus = isKnockout ? 0.1 : 0.0;
    const over = 20 - Math.floor(ballsRemaining / 6);

    if (innings === 2) {
      const rrr = ballsRemaining > 0 ? (runsNeeded / ballsRemaining) * 6 : 12;
      const rrrScore = Math.min(1.0, Math.max(0.0, (rrr - 4.0) / 14.0));
      const wStress = Math.min(1.0, wicketsLost / 7.0);
      const stageWeight = over >= 16 ? 1.2 : over >= 11 ? 1.0 : over >= 7 ? 0.85 : 0.75;
      let p2 = (0.55 * rrrScore + 0.35 * wStress + 0.1) * stageWeight;

      if (ballsRemaining <= 24 && rrr >= 8 && rrr <= 18) p2 += 0.15;
      if (runsNeeded <= 6 && ballsRemaining >= 18 && 10 - wicketsLost >= 5) p2 = 0.15;

      return Math.min(1.0, Math.max(0.0, p2 + koBonus));
    } else {
      const isPpCollapse = over <= 6 && wicketsLost >= 3;
      const isMidCollapse = over > 6 && over <= 11 && wicketsLost >= 4;
      let collapseScore = 0;
      if (isPpCollapse) collapseScore = 0.45 + (wicketsLost - 3) * 0.15;
      else if (isMidCollapse) collapseScore = 0.4 + (wicketsLost - 4) * 0.12;

      const deathScore = over >= 16 ? 0.45 + (over - 16) * 0.08 + (wicketsLost >= 6 ? 0.15 : 0) : 0;
      const base1 = 0.25 + 0.015 * over;
      const raw1 = Math.max(base1, collapseScore, deathScore);
      return Math.min(1.0, Math.max(0.0, raw1 + koBonus));
    }
  }, [innings, ballsRemaining, runsNeeded, wicketsLost, isKnockout]);

  const selectedBatter = batters.find((b) => b.id === Number(selectedBatterId)) || batters[0];
  const selectedBowler = bowlers.find((bw) => bw.id === Number(selectedBowlerId)) || bowlers[0];

  const runSimulation = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const nSims = 2500;
      let chaseWins = 0;
      let totalRunsScored = 0;
      let totalWicketsFallen = 0;
      let boundariesHit = 0;
      const outcomeBins: { [key: string]: number } = {
        'Loss (Defended)': 0,
        'Tight Finish (1-3 runs)': 0,
        'Comfortable Chase': 0,
        'Super Over Tie': 0,
      };

      const batterSr = selectedBatter ? selectedBatter.hp_sr : 155;
      const bowlerEcon = selectedBowler ? selectedBowler.hp_econ : 9.5;
      const batterOutRate = selectedBatter ? 1 / (selectedBatter.hp_avg || 25) : 0.04;
      const bowlerWktRate = selectedBowler ? 1 / (selectedBowler.hp_sr || 11) : 0.09;

      const expBallRun = (batterSr / 100 + (bowlerEcon / 6)) / 2;
      const expBallWkt = (batterOutRate + bowlerWktRate) / 2;

      for (let s = 0; s < nSims; s++) {
        let curRuns = 0;
        let curWkts = 0;
        let ballsBowled = 0;

        while (ballsBowled < ballsRemaining && curWkts < 10 - wicketsLost) {
          ballsBowled++;
          const rand = Math.random();
          if (rand < expBallWkt) {
            curWkts++;
          } else {
            const runRand = Math.random();
            let ballRun = 0;
            if (runRand < 0.32) ballRun = 0;
            else if (runRand < 0.68) ballRun = 1;
            else if (runRand < 0.78) ballRun = 2;
            else if (runRand < 0.91) {
              ballRun = 4;
              boundariesHit++;
            } else {
              ballRun = 6;
              boundariesHit++;
            }

            if (expBallRun > 1.8 && Math.random() < 0.15) ballRun = Math.min(6, ballRun + 2);
            if (expBallRun < 1.2 && Math.random() < 0.15) ballRun = Math.max(0, ballRun - 1);

            curRuns += ballRun;
          }

          if (innings === 2 && curRuns >= runsNeeded) break;
        }

        totalRunsScored += curRuns;
        totalWicketsFallen += curWkts;

        if (innings === 2) {
          if (curRuns >= runsNeeded) {
            chaseWins++;
            if (curRuns - runsNeeded <= 3) outcomeBins['Tight Finish (1-3 runs)']++;
            else outcomeBins['Comfortable Chase']++;
          } else if (curRuns === runsNeeded - 1) {
            outcomeBins['Super Over Tie']++;
          } else {
            outcomeBins['Loss (Defended)']++;
          }
        }
      }

      setSimResults({
        simCount: nSims,
        winRate: ((chaseWins / nSims) * 100).toFixed(1),
        expRuns: (totalRunsScored / nSims).toFixed(1),
        expWkts: (totalWicketsFallen / nSims).toFixed(2),
        boundaryRate: ((boundariesHit / (nSims * ballsRemaining)) * 100).toFixed(1),
        bins: outcomeBins,
      });

      setIsSimulating(false);
    }, 300);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Simulator Header */}
      <div className="bg-[#111827] border border-slate-800/80 p-8 rounded-3xl space-y-6 shadow-lg">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-pink-600/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Dynamic Monte Carlo Scenario Engine
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Simulating state-dependent delivery outcomes, player matchups, and win probabilities under calibrated constraints.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
            Load Standardized Match Presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p)}
                className="text-left p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/40 transition group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-pink-300">
                    {p.name}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-400" />
                </div>
                <p className="text-xs text-slate-400 leading-snug">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Controls & Sliders (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800/80 p-8 rounded-3xl space-y-8 shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-pink-400" />
            <span>Match State Parameters</span>
          </h3>

          {/* Innings Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2.5">Innings Context</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setInnings(2)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition ${
                  innings === 2
                    ? 'bg-pink-600/20 text-pink-300 border-pink-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                2nd Innings (Chase)
              </button>
              <button
                onClick={() => setInnings(1)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition ${
                  innings === 1
                    ? 'bg-pink-600/20 text-pink-300 border-pink-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                1st Innings (Par Target)
              </button>
              <button
                onClick={() => setInnings(3)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition ${
                  innings === 3
                    ? 'bg-pink-600/20 text-pink-300 border-pink-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Super Over (Max)
              </button>
            </div>
          </div>

          {/* Sliders with clear visual metrics */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-400">Balls Remaining:</span>
                <span className="font-mono font-bold text-pink-400 text-sm">{ballsRemaining} balls ({(ballsRemaining/6).toFixed(1)} ov)</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={ballsRemaining}
                onChange={(e) => setBallsRemaining(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {innings === 2 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">Runs Required to Win:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {runsNeeded} runs (RRR: {((runsNeeded/ballsRemaining)*6).toFixed(1)} rpo)
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="120"
                  value={runsNeeded}
                  onChange={(e) => setRunsNeeded(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-400">Wickets Lost Prior:</span>
                <span className="font-mono font-bold text-rose-400 text-sm">
                  {wicketsLost} down ({10 - wicketsLost} wickets in hand)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="9"
                value={wicketsLost}
                onChange={(e) => setWicketsLost(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs sm:text-sm text-slate-300">Playoff / Knockout Match Context (+0.10 Stake Boost)</span>
              <input
                type="checkbox"
                checked={isKnockout}
                onChange={(e) => setIsKnockout(e.target.checked)}
                className="w-4 h-4 rounded text-pink-600 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Duel Selection */}
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Head-to-Head Duel</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Striker (Batter)</label>
                <select
                  value={selectedBatterId}
                  onChange={(e) => setSelectedBatterId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
                >
                  {batters.map((b) => (
                    <option key={b.id} value={b.id}>
                      #{b.rank} {b.name} (HP SR: {b.hp_sr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Target Bowler</label>
                <select
                  value={selectedBowlerId}
                  onChange={(e) => setSelectedBowlerId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
                >
                  {bowlers.map((bw) => (
                    <option key={bw.id} value={bw.id}>
                      #{bw.rank} {bw.name} (HP Econ: {bw.hp_econ})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-pink-600/25 flex items-center justify-center space-x-2 transition hover:translate-y-[-1px]"
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating 2,500 Matches...' : 'Run 2,500 Monte Carlo Iterations'}</span>
          </button>
        </div>

        {/* Right: Pressure Gauge & Simulation Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pressure Score Live Gauge */}
          <div className="bg-[#111827] border border-slate-800/80 p-8 rounded-3xl space-y-4 shadow-xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Live Pressure Index ($PI$)
            </span>
            <div className="flex items-baseline space-x-4">
              <span className={`text-5xl font-black font-mono ${
                currentPressure >= 0.75 ? 'text-pink-400' : currentPressure >= 0.6 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {currentPressure.toFixed(2)}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700 font-mono">
                {currentPressure >= 0.75 ? 'CRITICAL / CLUTCH' : currentPressure >= 0.6 ? 'HIGH PRESSURE' : 'MODERATE / NORMAL'}
              </span>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-3 mt-4 overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  currentPressure >= 0.75
                    ? 'bg-gradient-to-r from-amber-500 to-pink-500'
                    : currentPressure >= 0.6
                    ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${currentPressure * 100}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              {currentPressure >= 0.6
                ? 'Qualifies into the Top 19.8% high-pressure dataset filter where strike rates jump to 153.5 and wickets fall every 11.3 deliveries.'
                : 'Ordinary baseline condition: teams possess sufficient balls or wickets, allowing calculated risk-taking.'}
            </p>
          </div>

          {/* Simulation Output Card */}
          <div className="bg-[#111827] border border-slate-800/80 p-8 rounded-3xl space-y-6 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Simulated Stochastic Outcomes</span>
            </h4>

            {simResults ? (
              <div className="space-y-5 animate-fade-in">
                {innings === 2 && (
                  <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 text-center space-y-1">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Chase Win Probability</span>
                    <span className="text-5xl font-black font-mono text-emerald-400 block">
                      {simResults.winRate}%
                    </span>
                    <span className="text-xs text-slate-500 pt-1 block">
                      Based on {simResults.simCount} calibrated scenario trials
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block">Expected Runs</span>
                    <span className="text-2xl font-bold font-mono text-white mt-1 block">
                      {simResults.expRuns}
                    </span>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block">Expected Wickets</span>
                    <span className="text-2xl font-bold font-mono text-pink-400 mt-1 block">
                      {simResults.expWkts}
                    </span>
                  </div>
                </div>

                {innings === 2 && simResults.bins && (
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-400 block">Scenario Outcome Breakdown</span>
                    {Object.entries(simResults.bins).map(([label, count]: any) => (
                      <div key={label} className="text-xs space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>{label}</span>
                          <span className="font-mono text-slate-400">{((count / simResults.simCount) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-pink-500 h-full"
                            style={{ width: `${(count / simResults.simCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs sm:text-sm">
                Select your match parameters and click <strong>Run 2,500 Monte Carlo Iterations</strong> to generate stochastic distribution.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

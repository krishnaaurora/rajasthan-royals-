import React from 'react';
import { X, Cpu } from 'lucide-react';
import { ScenarioSimulator } from './ScenarioSimulator';

interface SimulatorModalProps {
  batters: any[];
  bowlers: any[];
  onClose: () => void;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({ batters, bowlers, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#0f172a] border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-5 pr-12">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              State-Dependent Monte Carlo Pressure Duel Simulator
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Simulate 2,500 delivery-by-delivery trials between any batter and bowler under custom match contexts.
            </p>
          </div>
        </div>

        {/* Simulator Content */}
        <ScenarioSimulator batters={batters} bowlers={bowlers} />
      </div>
    </div>
  );
};


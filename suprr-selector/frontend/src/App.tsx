import React, { useState } from 'react';
import appData from './data/app_data.json';
import { LogoIntro } from './components/LogoIntro';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { BattersView } from './components/BattersView';
import { BowlersView } from './components/BowlersView';
import { PlayerAnalyzerView } from './components/PlayerAnalyzerView';
import { PressureEngineView } from './components/PressureEngineView';
import { ModelExplorerView } from './components/ModelExplorerView';
import { PlayerComparisonView } from './components/PlayerComparisonView';
import { JudgeTestLabView } from './components/JudgeTestLabView';
import { RRScoutingReportView } from './components/RRScoutingReportView';
import { AuctionDecisionIntelligenceView } from './components/AuctionDecisionIntelligenceView';
import { EvidenceMethodologyView } from './components/EvidenceMethodologyView';
import { PlayerModal } from './components/PlayerModal';
import { RankingsModal } from './components/RankingsModal';
import { SimulatorModal } from './components/SimulatorModal';
import { QuickGuideModal } from './components/QuickGuideModal';
import { ErrorBoundary } from './components/ErrorBoundary';

export const App: React.FC = () => {
  // Show the logo drawing animation on initial site load
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Platform view state: 'landing' (default) or one of the 9 intelligence tabs
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Modals state
  const [modalState, setModalState] = useState<{ player: any; type: 'batter' | 'bowler' } | null>(null);
  const [rankingsModalType, setRankingsModalType] = useState<'batter' | 'bowler' | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);

  const metadata = appData.metadata;
  const batters = appData.batters;
  const bowlers = appData.bowlers;
  const unifiedShortlist = (appData as any).unified_shortlist || [];

  const handleSelectPlayer = (player: any, type: 'batter' | 'bowler') => {
    setModalState({ player, type });
  };

  const handleCloseModal = () => {
    setModalState(null);
  };

  // 1. Initial Logo Drawing Animation (Authentic RR crest on plain pink)
  if (showIntro) {
    return <LogoIntro onComplete={() => setShowIntro(false)} />;
  }

  // 2. Cinematic Premium Landing Page View
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          metadata={metadata}
          topBatters={batters}
          topBowlers={bowlers}
          onEnterCommandCentre={() => setCurrentView('command_centre')}
          onNavigate={(view) => {
            if (view === 'simulator') setCurrentView('judge_test_lab');
            else if (view === 'engine') setCurrentView('model_explorer');
            else if (view === 'unstop') setCurrentView('rr_scouting');
            else setCurrentView(view);
          }}
          onReplayIntro={() => setShowIntro(true)}
          onSelectPlayer={handleSelectPlayer}
        />

        {/* Modals available on landing page */}
        {modalState && (
          <PlayerModal
            player={modalState.player}
            type={modalState.type}
            onClose={handleCloseModal}
          />
        )}

        {rankingsModalType && (
          <RankingsModal
            type={rankingsModalType}
            batters={batters}
            bowlers={bowlers}
            onClose={() => setRankingsModalType(null)}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {isSimulatorOpen && (
          <SimulatorModal
            batters={batters}
            bowlers={bowlers}
            onClose={() => setIsSimulatorOpen(false)}
          />
        )}
      </>
    );
  }

  // Normalize active tab to one of the 9 designated sections
  const activeTab =
    currentView === 'overview'
      ? 'command_centre'
      : currentView === 'simulator'
        ? 'judge_test_lab'
        : currentView === 'engine'
          ? 'pressure_explainer'
          : currentView === 'unstop'
            ? 'rr_scouting'
            : currentView;

  // 3. Command Centre & Analytics War-Room View with Collapsible Side Navigation
  return (
    <div className="h-screen w-screen bg-[#080D1A] text-slate-100 flex overflow-hidden font-sans selection:bg-[#FF2E93] selection:text-white animate-fade-in">
      {/* Collapsible Left Side Navigation Bar (Exclusively the 9 Specified Sections) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onBackToLanding={() => setCurrentView('landing')}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Analytics Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        <ErrorBoundary>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'command_centre' && (
              <ExecutiveOverview
                metadata={metadata}
                topBatters={batters}
                topBowlers={bowlers}
                unifiedShortlist={unifiedShortlist}
                onSelectPlayer={handleSelectPlayer}
                onNavigate={setCurrentView}
              />
            )}

            {activeTab === 'batters' && (
              <BattersView
                batters={batters}
                onSelectPlayer={handleSelectPlayer}
                onNavigate={setCurrentView}
              />
            )}

            {activeTab === 'bowlers' && (
              <BowlersView
                bowlers={bowlers}
                onSelectPlayer={handleSelectPlayer}
                onNavigate={setCurrentView}
              />
            )}

            {activeTab === 'player_analyzer' && (
              <PlayerAnalyzerView
                batters={batters}
                bowlers={bowlers}
                initialPlayerId={modalState?.player?.id}
                initialRole={modalState?.type}
                onSelectPlayer={handleSelectPlayer}
                onNavigate={setCurrentView}
              />
            )}

            {activeTab === 'pressure_explainer' && <PressureEngineView />}

            {activeTab === 'model_explorer' && <ModelExplorerView />}

            {activeTab === 'player_comparison' && (
              <PlayerComparisonView batters={batters} bowlers={bowlers} />
            )}

            {activeTab === 'judge_test_lab' && (
              <JudgeTestLabView batters={batters} bowlers={bowlers} />
            )}

            {activeTab === 'auction_decision_intel' && (
              <AuctionDecisionIntelligenceView
                candidates={unifiedShortlist}
                onSelectCandidate={(c) => handleSelectPlayer(c, c.type || 'batter')}
              />
            )}

            {activeTab === 'rr_scouting' && (
              <RRScoutingReportView
                topBatters={batters}
                topBowlers={bowlers}
                unifiedShortlist={unifiedShortlist}
              />
            )}

            {activeTab === 'evidence_methodology' && <EvidenceMethodologyView />}
          </main>
        </ErrorBoundary>

        {/* Player Evidence Card Modal */}
        {modalState && (
          <PlayerModal
            player={modalState.player}
            type={modalState.type}
            onClose={handleCloseModal}
          />
        )}

        {/* 1-Minute Quick Guide & Feature Tour Modal */}
        <QuickGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          onNavigate={(view) => setCurrentView(view)}
        />

        {/* App Footer */}
        <footer className="border-t border-slate-800/80 bg-[#060a14] py-6 text-center text-xs text-[#94A3B8]">
          <div className="max-w-7xl mx-auto px-4 space-y-1.5">
            <p className="font-semibold text-slate-300">
              SupeRR Pressure Intelligence Lab • Rajasthan Royals Season 2
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Audited on 200,999 ball-by-ball deliveries across 883 matches (2022–2026). Zero-Leakage Bayesian Reliability Engine.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;

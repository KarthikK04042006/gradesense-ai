import React, { useState, useEffect, Suspense } from 'react';
import { NavTab } from './types';
import { AppProvider, useApp } from './context/AppContext';
import {
  Header,
  Sidebar,
  ErrorBoundary,
  KeyboardShortcutsModal,
  ToastProvider
} from './components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './hooks/useTheme';

// Lazy Loaded Page Components for Code Splitting
const DashboardPage = React.lazy(() => import('./pages/Dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AIPredictionPage = React.lazy(() => import('./pages/AIPrediction/AIPredictionPage').then(m => ({ default: m.AIPredictionPage })));
const ExplainableAIPage = React.lazy(() => import('./pages/ExplainableAI/ExplainableAIPage').then(m => ({ default: m.ExplainableAIPage })));
const HistoricalExplorerPage = React.lazy(() => import('./pages/HistoricalExplorer/HistoricalExplorerPage').then(m => ({ default: m.HistoricalExplorerPage })));
const BusinessImpactPage = React.lazy(() => import('./pages/BusinessImpact/BusinessImpactPage').then(m => ({ default: m.BusinessImpactPage })));
const DigitalTwinPage = React.lazy(() => import('./pages/DigitalTwin/DigitalTwinPage').then(m => ({ default: m.DigitalTwinPage })));
const AICopilotPage = React.lazy(() => import('./pages/AICopilot/AICopilotPage').then(m => ({ default: m.AICopilotPage })));
const WhatIfSimulatorPage = React.lazy(() => import('./pages/WhatIfSimulator/WhatIfSimulatorPage').then(m => ({ default: m.WhatIfSimulatorPage })));
const AnalyticsPage = React.lazy(() => import('./pages/Analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const SettingsPage = React.lazy(() => import('./pages/Settings/SettingsPage').then(m => ({ default: m.SettingsPage })));

const PageFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border border-slate-800" />
        <div className="absolute inset-0 rounded-full border-t border-red-500 animate-spin" />
      </div>
      <span className="text-[11px] font-mono text-slate-500 tracking-widest uppercase">Loading...</span>
    </div>
  </div>
);

import { HowAIWorksModal } from './components/common/HowAIWorksModal';

export const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, currentGrade, targetGrade, isHowAIWorksOpen, setIsHowAIWorksOpen } = useApp();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Global Hotkey Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }
      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
      }
      if (e.altKey) {
        switch (e.key) {
          case '1': e.preventDefault(); setActiveTab('dashboard'); break;
          case '2': e.preventDefault(); setActiveTab('prediction'); break;
          case '3': e.preventDefault(); setActiveTab('explainable-ai'); break;
          case '4': e.preventDefault(); setActiveTab('historical-explorer'); break;
          case '5': e.preventDefault(); setActiveTab('business-impact'); break;
          case '6': e.preventDefault(); setActiveTab('digital-twin'); break;
          case '7': e.preventDefault(); setActiveTab('copilot'); break;
          case '8': e.preventDefault(); setActiveTab('simulator'); break;
          case '9': e.preventDefault(); setActiveTab('analytics'); break;
          case 's':
          case 'S': e.preventDefault(); setActiveTab('settings'); break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'prediction':
        return <AIPredictionPage />;
      case 'explainable-ai':
        return <ExplainableAIPage />;
      case 'historical-explorer':
        return <HistoricalExplorerPage />;
      case 'business-impact':
        return <BusinessImpactPage />;
      case 'digital-twin':
        return <DigitalTwinPage />;
      case 'copilot':
        return <AICopilotPage />;
      case 'simulator':
        return <WhatIfSimulatorPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans flex flex-col antialiased">
      {/* Industrial Header */}
      <Header onOpenShortcuts={() => setIsShortcutsOpen(true)} theme={theme} toggleTheme={toggleTheme} />

      {/* Main Grid Viewport */}
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        <main
          role="main"
          aria-label="GradeSense AI Workspace"
          className="flex-1 overflow-y-auto p-5 xl:p-6"
          style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(30,41,59,0.25) 0%, transparent 70%), #080c14' }}
        >
          <Suspense fallback={<PageFallback />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {renderActivePage()}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>

      {/* Hotkeys Overlay */}
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />

      {/* How AI Works Pipeline Modal */}
      <HowAIWorksModal isOpen={isHowAIWorksOpen} onClose={() => setIsHowAIWorksOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ToastProvider>
          <MainLayout />
        </ToastProvider>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;

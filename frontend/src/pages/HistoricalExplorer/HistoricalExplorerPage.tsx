import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/common/GlassCard';
import { DetailedHistoricalCase } from '../../types';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  DollarSign,
  FileText,
  Maximize2,
  X
} from 'lucide-react';

export const HistoricalExplorerPage: React.FC = () => {
  const [filterMode, setFilterMode] = useState<'all' | 'successful' | 'failed' | 'high_similarity'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('TR-101');
  const [compareCase, setCompareCase] = useState<DetailedHistoricalCase | null>(null);

  // Full dataset of historical grade transition cases
  const allCases: DetailedHistoricalCase[] = [
    {
      transitionId: 'TR-101',
      fromGrade: 'KRAFT-42',
      toGrade: 'KRAFT-33',
      similarityScore: 96.4,
      previousActions: [
        'Decreased Stock Flow from 4200 to 3650 L/min at t=0',
        'Ramped Wire Speed +130 m/min (820 -> 950 m/min) over 2.5 min',
        'Reduced Section 4 Steam Pressure from 4.2 to 3.5 bar at t=5 min'
      ],
      recoveryTimeMin: 16.8,
      finalResult: 'Successful',
      scrapTons: 3.8,
      costUsd: 4850,
      timestamp: '2026-07-24 14:30',
      operatorNotes: 'Optimal Honeywell MPC ramp curve applied. Zero moisture overshoot. Saved 4.8 minutes compared to baseline.'
    },
    {
      transitionId: 'TR-102',
      fromGrade: 'KRAFT-33',
      toGrade: 'LINER-50',
      similarityScore: 78.5,
      previousActions: [
        'Increased Stock Flow to 4500 L/min at t=0',
        'Decreased Wire Speed by -120 m/min',
        'Raised Dryer Group 2 Steam to 4.4 bar'
      ],
      recoveryTimeMin: 28.5,
      finalResult: 'Failed',
      scrapTons: 7.4,
      costUsd: 9200,
      timestamp: '2026-07-23 09:15',
      operatorNotes: 'Sheet break occurred in press section due to abrupt speed reduction. Root cause: jet-to-wire shear mismatch.'
    },
    {
      transitionId: 'TR-103',
      fromGrade: 'LINER-50',
      toGrade: 'KRAFT-42',
      similarityScore: 92.1,
      previousActions: [
        'Lowered Stock Flow by -350 L/min',
        'Increased Machine Speed by +80 m/min',
        'Adjusted Headbox Jet Drag Ratio to 1.02'
      ],
      recoveryTimeMin: 19.5,
      finalResult: 'Successful',
      scrapTons: 4.2,
      costUsd: 5400,
      timestamp: '2026-07-22 18:40',
      operatorNotes: 'Good basis weight transition. Minor moisture transient settled in 6 min.'
    },
    {
      transitionId: 'TR-104',
      fromGrade: 'KRAFT-42',
      toGrade: 'KRAFT-33',
      similarityScore: 89.2,
      previousActions: [
        'Decreased Stock Flow from 4150 to 3700 L/min',
        'Increased Wire Speed +110 m/min',
        'Maintained Steam Pressure at 4.0 bar'
      ],
      recoveryTimeMin: 22.0,
      finalResult: 'Warning',
      scrapTons: 5.5,
      costUsd: 6800,
      timestamp: '2026-07-21 11:10',
      operatorNotes: 'Moisture elevated +0.8% for 8 minutes before settling due to steam valve delay.'
    },
    {
      transitionId: 'TR-105',
      fromGrade: 'MED-26',
      toGrade: 'WHITE-38',
      similarityScore: 86.0,
      previousActions: [
        'Increased Ash/Filler slurry flow +60 L/min',
        'Adjusted Soft Calender Nip Pressure to 110 kN/m',
        'Lowered Wire Speed -50 m/min'
      ],
      recoveryTimeMin: 15.4,
      finalResult: 'Successful',
      scrapTons: 3.1,
      costUsd: 4100,
      timestamp: '2026-07-20 16:50',
      operatorNotes: 'Excellent sheet opacity & basis weight accuracy.'
    },
    {
      transitionId: 'TR-106',
      fromGrade: 'KRAFT-42',
      toGrade: 'KRAFT-33',
      similarityScore: 64.2,
      previousActions: [
        'Manual operator emergency speed ramp',
        'Rapid stock flow cut by -600 L/min'
      ],
      recoveryTimeMin: 34.0,
      finalResult: 'Failed',
      scrapTons: 8.9,
      costUsd: 11500,
      timestamp: '2026-07-19 03:20',
      operatorNotes: 'Unplanned grade change without AI decision support. High off-spec scrap.'
    }
  ];

  // Filtering Logic
  const filteredCases = allCases.filter((c) => {
    if (filterMode === 'successful' && c.finalResult !== 'Successful') return false;
    if (filterMode === 'failed' && c.finalResult !== 'Failed') return false;
    if (filterMode === 'high_similarity' && c.similarityScore < 85.0) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchGrade = `${c.fromGrade} ${c.toGrade}`.toLowerCase().includes(term);
      const matchId = c.transitionId.toLowerCase().includes(term);
      if (!matchGrade && !matchId) return false;
    }
    return true;
  });

  const getResultBadge = (result: 'Successful' | 'Warning' | 'Failed') => {
    switch (result) {
      case 'Successful':
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Successful</span>
          </span>
        );
      case 'Warning':
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-800/80 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Warning</span>
          </span>
        );
      case 'Failed':
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-red-950/80 text-red-400 border border-red-800/80 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>Failed (Web Break)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border-cyan-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400">
              <History className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                PM-4 Historical Case Explorer & Similarity Engine
              </h2>
              <p className="text-xs text-slate-400">
                Indexed database of 1,420 previous PM-4 grade transitions with vector similarity matching & outcome recovery diagnostics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
              <span>INDEXED CASES: <strong className="text-cyan-400">1,420 RUNS</strong></span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Filter Controls & Search Bar */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transition ID or grades (e.g. TR-101, KRAFT-42)..."
              className="w-full glass-input pl-9 text-xs"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-red-950/80 text-red-300 border-red-800 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              All Cases ({allCases.length})
            </button>
            <button
              onClick={() => setFilterMode('successful')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterMode === 'successful'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              Successful Transitions
            </button>
            <button
              onClick={() => setFilterMode('failed')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterMode === 'failed'
                  ? 'bg-red-950/80 text-red-300 border-red-800 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              Failed Transitions
            </button>
            <button
              onClick={() => setFilterMode('high_similarity')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterMode === 'high_similarity'
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              High Similarity (&gt;85%)
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Historical Cases Timeline & Expandable List (Single Unified Container) */}
      <GlassCard className="p-0 overflow-hidden border-slate-800/60 bg-slate-900/60">
        <div className="divide-y divide-slate-800/40">
          {filteredCases.map((item, idx) => {
            const isExpanded = expandedId === item.transitionId;

            return (
              <div key={item.transitionId} className="transition-colors">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.transitionId)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                >
                  {/* Left Side: ID & Grade Pair */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-900/60 border border-slate-800/40 flex flex-col items-center justify-center font-mono shrink-0">
                      <span className="text-[8px] text-slate-500 font-bold">CASE</span>
                      <span className="text-xs font-bold text-cyan-400">{item.transitionId}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100 font-mono">{item.fromGrade}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-bold text-sm text-slate-100 font-mono">{item.toGrade}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                        <span>Vector Match: <strong className="text-emerald-400">{item.similarityScore}%</strong></span>
                        <span>•</span>
                        <span>Duration: <strong className="text-slate-200">{item.recoveryTimeMin} min</strong></span>
                        <span>•</span>
                        <span>Cost: <strong className="text-slate-200">${item.costUsd.toLocaleString()}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Status Badge & Accordion Toggle */}
                  <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                    {getResultBadge(item.finalResult)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompareCase(item);
                      }}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/40 text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3 text-amber-400" />
                      <span>Compare</span>
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

              {/* Expandable Details Panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-slate-800/80 bg-slate-950/60 p-4 space-y-4 font-mono text-xs"
                  >
                    {/* Applied Recommendation Steps */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        APPLIED SETPOINT RECOMMENDATIONS:
                      </span>
                      <div className="space-y-1.5">
                        {item.previousActions.map((action, i) => (
                          <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operator Notes & Outcome */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">OPERATOR NOTES & ROOT CAUSE:</span>
                        <p className="text-slate-300 font-sans text-xs leading-relaxed">{item.operatorNotes}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">RECOVERED OUTCOME METRICS:</span>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Scrap Tons:</span>
                            <span className="text-slate-200 font-bold">{item.scrapTons} Tons</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Cost:</span>
                            <span className="text-slate-200 font-bold">${item.costUsd.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Timestamp:</span>
                            <span className="text-slate-400">{item.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        </div>
      </GlassCard>

      {/* Side-by-Side Comparison Modal */}
      <AnimatePresence>
        {compareCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-100">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Historical Case Comparison: Active Target vs Case {compareCase.transitionId}</span>
                </div>
                <button
                  onClick={() => setCompareCase(null)}
                  className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                {/* Active Target */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase">ACTIVE CURRENT TARGET</div>
                  <div className="text-sm font-bold text-slate-100">KRAFT-42 ➔ KRAFT-33</div>
                  <div className="text-slate-400">Duration: 16.8 min</div>
                  <div className="text-slate-400">Paper Scrap: 1.25 Tons</div>
                  <div className="text-slate-400">Cost: $1,850</div>
                </div>

                {/* Historical Case */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">HISTORICAL CASE {compareCase.transitionId}</div>
                  <div className="text-sm font-bold text-slate-100">{compareCase.fromGrade} ➔ {compareCase.toGrade}</div>
                  <div className="text-slate-400">Duration: {compareCase.recoveryTimeMin} min</div>
                  <div className="text-slate-400">Paper Scrap: {compareCase.scrapTons} Tons</div>
                  <div className="text-slate-400">Cost: ${compareCase.costUsd.toLocaleString()}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 font-sans">
                Active Honeywell AI optimization saves ${(compareCase.costUsd - 1850).toLocaleString()} and reduces transition duration by {(compareCase.recoveryTimeMin - 16.8).toFixed(1)} minutes compared to Historical Case {compareCase.transitionId}.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

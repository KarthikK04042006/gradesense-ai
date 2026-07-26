import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Cpu,
  Sparkles,
  PieChart,
  Search,
  CheckCircle2,
  UserCheck,
  RotateCcw,
  GraduationCap,
  ArrowRight,
  ChevronRight,
  Info
} from 'lucide-react';

interface StageDetail {
  title: string;
  sub: string;
  icon: any;
  color: string;
  borderColor: string;
  glowColor: string;
  metrics: string[];
  description: string;
}

export const AIDecisionFlow: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [activeAnimStage, setActiveAnimStage] = useState<number>(2); // Default step 3 active

  // Cycle active stage sequentially every 3.5s to show live AI processing stream
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveAnimStage((prev) => (prev + 1) % 9);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const stages: StageDetail[] = [
    {
      title: 'Telemetry',
      sub: '100Hz OPC-UA',
      icon: Activity,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/50',
      glowColor: 'shadow-cyan-500/30',
      description: 'Ingests high-frequency DCS signals from Fourdrinier table & scanners.',
      metrics: ['Headbox: 142.5 kPa', 'Wire: 885 m/min', 'Steam: 3.8 bar']
    },
    {
      title: 'Feature Eng.',
      sub: 'Jet/Wire Drag',
      icon: Cpu,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/50',
      glowColor: 'shadow-indigo-500/30',
      description: 'Calculates non-linear physics ratios and thermal inertia dynamics.',
      metrics: ['Jet/Wire Ratio: 1.02', 'Thermal Time Const: 4.2m', 'Freeness Index: 450 CSF']
    },
    {
      title: 'Prediction',
      sub: 'XGBoost + LSTM',
      icon: Sparkles,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/50',
      glowColor: 'shadow-amber-500/30',
      description: 'Multi-horizon time series forecast of moisture transient and off-spec scrap.',
      metrics: ['Transition Duration: 16.8m', 'Off-Spec Scrap: 3.8T', 'Risk Score: 18.5%']
    },
    {
      title: 'SHAP Impact',
      sub: 'TreeExplainer',
      icon: PieChart,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/50',
      glowColor: 'shadow-purple-500/30',
      description: 'Attributes root-cause variance across steam, speed, and stock parameters.',
      metrics: ['Steam Delay: +34%', 'Wire Drag: +26%', 'Stock Feed: -18%']
    },
    {
      title: 'Vector Search',
      sub: '1,420 Runs',
      icon: Search,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/50',
      glowColor: 'shadow-blue-500/30',
      description: 'Retrieves top-3 historical grade changes with 98%+ similarity.',
      metrics: ['Match ID #101: 98.4%', 'Historical Duration: 16.2m', 'Outcome: Zero Break']
    },
    {
      title: 'Recommendation',
      sub: 'Non-Linear MPC',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/50',
      glowColor: 'shadow-emerald-500/30',
      description: 'Generates optimal ramp curves for fan pump & dryer steam valves.',
      metrics: ['Stock Flow: -550 L/min', 'Speed Ramp: +130 m/min', 'Steam Dampen: -0.7 bar']
    },
    {
      title: 'Operator',
      sub: 'DCS Verification',
      icon: UserCheck,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/50',
      glowColor: 'shadow-rose-500/30',
      description: 'Human-in-the-loop review and Experion® DCS target dispatch.',
      metrics: ['Acceptance Rate: 94.2%', 'Operator Action: Approved', 'Verification: Synced']
    },
    {
      title: 'Feedback',
      sub: 'RL Closed-Loop',
      icon: RotateCcw,
      color: 'text-teal-400',
      borderColor: 'border-teal-500/50',
      glowColor: 'shadow-teal-500/30',
      description: 'Logs operator override micro-adjustments for reward model scoring.',
      metrics: ['Reward Score: +0.94', 'Hysteresis Delta: <0.2%', 'Actuator Lag: 0.8s']
    },
    {
      title: 'Learning',
      sub: 'Model Retrain',
      icon: GraduationCap,
      color: 'text-yellow-400',
      borderColor: 'border-yellow-500/50',
      glowColor: 'shadow-yellow-500/30',
      description: 'Updates active weight embeddings without production downtime.',
      metrics: ['Samples Logged: 1,420', 'Gradient Step: Completed', 'Accuracy Gain: +0.4%']
    }
  ];

  return (
    <div className="w-full space-y-3 font-sans">
      {/* Flow Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="font-bold tracking-wide uppercase">HONEYWELL AI DECISION & LEARNING PIPELINE</span>
        </div>
        <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>REAL-TIME STREAMING: ACTIVE</span>
        </div>
      </div>

      {/* Main Interactive Flow Bar */}
      <div className="w-full overflow-x-auto py-3 px-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex items-center justify-between min-w-[980px] gap-1.5">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = selectedStage === idx;
            const isActiveStep = activeAnimStage === idx;

            return (
              <React.Fragment key={stage.title}>
                {/* Node Box */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  onClick={() => {
                    setSelectedStage(isSelected ? null : idx);
                    setActiveAnimStage(idx);
                  }}
                  className={`flex-1 p-2.5 rounded-xl bg-slate-900/90 border ${stage.borderColor} text-center flex flex-col items-center gap-1.5 shadow-lg relative cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-red-500 bg-slate-800/90' : 'hover:bg-slate-800/80'
                  }`}
                >
                  {/* Glowing Flow Dot Badge */}
                  <div className={`p-2 rounded-xl bg-slate-950/90 ${stage.color} relative`}>
                    <Icon className="w-4 h-4" />
                    {isActiveStep && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>

                  <div className="text-[11px] font-bold text-slate-100 truncate w-full">{stage.title}</div>
                  <div className="text-[9px] text-slate-400 font-mono truncate w-full">{stage.sub}</div>

                  {/* Stage Number Badge */}
                  <span className="absolute -top-2 left-2 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {idx + 1}
                  </span>
                </motion.div>

                {/* Animated Connecting Flow Arrow with Particles */}
                {idx < stages.length - 1 && (
                  <div className="relative flex items-center justify-center w-5 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                    {/* Animated Flowing Particle */}
                    <motion.div
                      animate={{ x: [-8, 8] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: idx * 0.15, ease: 'linear' }}
                      className="absolute w-1.5 h-1.5 rounded-full bg-red-400 shadow-sm shadow-red-500"
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Popover Card */}
      <AnimatePresence>
        {selectedStage !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs text-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-slate-100 uppercase">
                  Stage {selectedStage + 1}: {stages[selectedStage].title} Diagnostic Breakdown
                </span>
              </div>
              <button
                onClick={() => setSelectedStage(null)}
                className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5 rounded bg-slate-950 border border-slate-800"
              >
                Close
              </button>
            </div>

            <p className="text-slate-300 font-sans text-xs">{stages[selectedStage].description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {stages[selectedStage].metrics.map((m, i) => (
                <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800/80 text-[11px] text-cyan-400">
                  {m}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

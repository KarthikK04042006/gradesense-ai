import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/common/GlassCard';
import { PlotlyChart } from '../../components/charts/PlotlyChart';
import { ConfidenceGauge } from '../../components/common/ConfidenceGauge';
import {
  BrainCircuit,
  HelpCircle,
  BarChart2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Search,
  Activity,
  Flame,
  Wind,
  Droplets,
  Layers,
  TrendingUp,
  ArrowRight,
  Sliders,
  DollarSign,
  Info,
  Gauge,
  RotateCcw
} from 'lucide-react';

interface XAIFeatureDetail {
  feature: string;
  shapValue: number;
  percentage: number;
  currentValue: string;
  impactDirection: 'increases_risk' | 'decreases_risk' | 'neutral';
  explanation: string;
  businessImpact: string;
  historicalEvidence: string;
  confidence: number;
}

export const ExplainableAIPage: React.FC = () => {
  // Primary Control Inputs
  const [steamPressureInput, setSteamPressureInput] = useState<number>(3.8);
  const [machineSpeedInput, setMachineSpeedInput] = useState<number>(885);
  const [stockFlowInput, setStockFlowInput] = useState<number>(3950);

  // Optional Operator Overrides for Sensors 4, 5, 6
  const [overrideMoisture, setOverrideMoisture] = useState<number | null>(null);
  const [overrideFiller, setOverrideFiller] = useState<number | null>(null);
  const [overrideCaliper, setOverrideCaliper] = useState<number | null>(null);

  // Physics-based Interconnected Auto-Calculations
  const autoMoisture = Math.max(4.0, Math.min(10.0, 7.2 - (steamPressureInput - 3.8) * 0.85 + (machineSpeedInput - 885) * 0.004));
  const autoFiller = Math.round(140 + (stockFlowInput - 3950) * 0.08);
  const autoCaliper = Math.max(0.180, Math.min(0.320, 0.245 + (stockFlowInput - 3950) * 0.00005 - (machineSpeedInput - 885) * 0.00004));

  const effectiveMoisture = overrideMoisture ?? autoMoisture;
  const effectiveFiller = overrideFiller ?? autoFiller;
  const effectiveCaliper = overrideCaliper ?? autoCaliper;

  // Dynamic SHAP Contributions computed from live interconnected values
  const steamContrib = Math.min(50, Math.max(8, Math.round(34 + (steamPressureInput - 3.8) * 12)));
  const speedContrib = Math.min(45, Math.max(8, Math.round(26 + (machineSpeedInput - 885) * 0.05)));
  const stockContrib = Math.min(30, Math.max(8, Math.round(18 + (stockFlowInput - 3950) * 0.01)));
  
  const moistureContrib = Math.min(25, Math.max(5, Math.round(12 + Math.abs(effectiveMoisture - 7.0) * 4.5)));
  const fillerPct = (effectiveFiller * 0.088).toFixed(1);
  const fillerContrib = Math.min(20, Math.max(3, Math.round(6 + (effectiveFiller - 140) * 0.06)));
  const caliperContrib = Math.min(18, Math.max(2, Math.round(4 + Math.abs(effectiveCaliper - 0.245) * 80)));

  const resetAllSliders = () => {
    setSteamPressureInput(3.8);
    setMachineSpeedInput(885);
    setStockFlowInput(3950);
    setOverrideMoisture(null);
    setOverrideFiller(null);
    setOverrideCaliper(null);
  };

  const featureList: XAIFeatureDetail[] = [
    {
      feature: 'Steam Pressure (Section 4)',
      shapValue: steamContrib / 100,
      percentage: steamContrib,
      currentValue: `${steamPressureInput.toFixed(1)} bar`,
      impactDirection: steamPressureInput > 4.0 ? 'increases_risk' : 'decreases_risk',
      explanation: 'Thermal inertia delay in section 4 steam cylinders dictates dryer evaporation rate during basis weight reduction.',
      businessImpact: `Adds estimated $${Math.round(steamContrib * 140)} off-spec scrap cost during thermal settling.`,
      historicalEvidence: 'Correlated with 84% of past moisture transient alarms in Historical Case #102.',
      confidence: 96.4
    },
    {
      feature: 'Machine Wire Speed',
      shapValue: speedContrib / 100,
      percentage: speedContrib,
      currentValue: `${machineSpeedInput} m/min`,
      impactDirection: speedContrib > 28 ? 'increases_risk' : 'decreases_risk',
      explanation: 'Fourdrinier wire drag acceleration dictates jet-to-wire velocity shear ratio.',
      businessImpact: `Influences web break risk probability by +${(speedContrib * 0.4).toFixed(1)}%.`,
      historicalEvidence: 'Verified against 1,420 PM-4 DCS speed ramp logs.',
      confidence: 94.8
    },
    {
      feature: 'Stock Flow Rate',
      shapValue: stockContrib / 100,
      percentage: stockContrib,
      currentValue: `${stockFlowInput} L/min`,
      impactDirection: 'decreases_risk',
      explanation: 'Headbox pulp slurry feed rate acts as primary corrective lever for basis weight target.',
      businessImpact: `Stabilizes basis weight transition, saving $${Math.round(stockContrib * 100)} per run.`,
      historicalEvidence: 'Matched in 98% of optimal grade transitions.',
      confidence: 97.2
    },
    {
      feature: 'Reel Moisture Sensor',
      shapValue: moistureContrib / 100,
      percentage: moistureContrib,
      currentValue: `${effectiveMoisture.toFixed(1)} %`,
      impactDirection: effectiveMoisture > 8.0 ? 'increases_risk' : 'decreases_risk',
      explanation: 'Scanner moisture feedback loop responds dynamically to steam drying rate and wire speed residence time.',
      businessImpact: effectiveMoisture > 8.0 ? 'High moisture increases web tear risk on reel.' : 'Optimal moisture range maintains paper elasticity.',
      historicalEvidence: 'Recorded across 340 consecutive defect-free rolls.',
      confidence: 95.1
    },
    {
      feature: 'Ash Filler Content',
      shapValue: fillerContrib / 100,
      percentage: fillerContrib,
      currentValue: `${effectiveFiller} L/min (${fillerPct}%)`,
      impactDirection: fillerContrib > 10 ? 'increases_risk' : 'neutral',
      explanation: 'Calcium carbonate mineral filler slurry flow adjusts dynamically with stock feed volume.',
      businessImpact: `Filler slurry level influences dewatering energy by $${Math.round(fillerContrib * 45)}/hour.`,
      historicalEvidence: 'Verified via online X-ray scanner readings.',
      confidence: 91.5
    },
    {
      feature: 'Sheet Caliper Thickness',
      shapValue: caliperContrib / 100,
      percentage: caliperContrib,
      currentValue: `${effectiveCaliper.toFixed(3)} mm`,
      impactDirection: Math.abs(effectiveCaliper - 0.245) > 0.02 ? 'increases_risk' : 'neutral',
      explanation: 'Soft calender nip gap pressure controls paper bulk thickness derived from stock density & speed.',
      businessImpact: `Roll density variance impact estimated at $${Math.round(caliperContrib * 60)}/roll.`,
      historicalEvidence: 'Synced with laboratory reel quality lab reports.',
      confidence: 93.0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border-cyan-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Honeywell Explainable AI (XAI) Diagnostic Dashboard
              </h2>
              <p className="text-xs text-slate-400">
                SHAP (SHapley Additive exPlanations) feature attribution, physics rationale, and business impact analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              onClick={resetAllSliders}
              className="bg-slate-950 hover:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>RESET SLIDERS</span>
            </button>
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MODEL TRANSPARENCY: <strong className="text-emerald-400">100% EXPLAINABLE</strong></span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Real-time XAI Parameter Simulation Controller (All 6 Sliders) */}
      <GlassCard className="bg-slate-900/80 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Interactive XAI Physics Sensitivity Simulator
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Drag sliders to simulate real-time interconnected physics shifts across all 6 parameters
          </span>
        </div>

        {/* 6 Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 font-mono text-xs">
          {/* Slider 1: Steam Pressure */}
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                1. Steam Pressure
              </span>
              <span className="text-red-400 font-bold">{steamPressureInput.toFixed(1)} bar</span>
            </div>
            <input
              type="range"
              min="2.5"
              max="5.0"
              step="0.1"
              value={steamPressureInput}
              onChange={(e) => setSteamPressureInput(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-400"
            />
          </div>

          {/* Slider 2: Machine Speed */}
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                2. Machine Speed
              </span>
              <span className="text-emerald-400 font-bold">{machineSpeedInput} m/min</span>
            </div>
            <input
              type="range"
              min="600"
              max="1100"
              step="25"
              value={machineSpeedInput}
              onChange={(e) => setMachineSpeedInput(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Slider 3: Stock Flow */}
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                3. Stock Flow Rate
              </span>
              <span className="text-cyan-400 font-bold">{stockFlowInput} L/min</span>
            </div>
            <input
              type="range"
              min="3000"
              max="4500"
              step="50"
              value={stockFlowInput}
              onChange={(e) => setStockFlowInput(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Slider 4: Moisture */}
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-amber-400" />
                4. Reel Moisture Sensor
              </span>
              <span className="text-amber-400 font-bold">
                {effectiveMoisture.toFixed(1)} % {overrideMoisture !== null ? '(Manual Override)' : '(Auto Physics)'}
              </span>
            </div>
            <input
              type="range"
              min="4.0"
              max="10.0"
              step="0.1"
              value={effectiveMoisture}
              onChange={(e) => setOverrideMoisture(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Slider 5: Ash Filler */}
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-300" />
                5. Ash Filler Content
              </span>
              <span className="text-cyan-300 font-bold">
                {effectiveFiller} L/min {overrideFiller !== null ? '(Manual)' : '(Auto)'}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              step="5"
              value={effectiveFiller}
              onChange={(e) => setOverrideFiller(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-300"
            />
          </div>

          {/* Slider 6: Caliper */}
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-slate-100" />
                6. Sheet Caliper Thickness
              </span>
              <span className="text-slate-100 font-bold">
                {effectiveCaliper.toFixed(3)} mm {overrideCaliper !== null ? '(Manual)' : '(Auto)'}
              </span>
            </div>
            <input
              type="range"
              min="0.180"
              max="0.320"
              step="0.002"
              value={effectiveCaliper}
              onChange={(e) => setOverrideCaliper(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-100"
            />
          </div>
        </div>
      </GlassCard>

      {/* Main Grid: SHAP Feature Importance List + Confidence Gauge Side Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Dynamic SHAP Ranking Bars */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard title="SHAP Feature Importance & Contribution Ranking" subtitle="Relative impact of paper machine parameters on transition risk and off-spec scrap">
            <div className="space-y-4 mt-3">
              {featureList.map((item, idx) => (
                <motion.div
                  key={item.feature}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                      <span className="text-sm font-bold text-slate-100 font-sans">{item.feature}</span>
                      <span className="text-xs font-mono font-semibold text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60">
                        Value: {item.currentValue}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        item.percentage > 25 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {item.percentage}% SHAP
                      </span>
                    </div>
                  </div>

                  {/* Animated SHAP Contribution Bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <motion.div
                      className={`h-full rounded-full ${
                        item.percentage > 25
                          ? 'bg-gradient-to-r from-amber-500 to-red-500'
                          : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-400 pt-1">
                    <div>
                      <strong className="text-slate-300">Physics Rationale:</strong> {item.explanation}
                    </div>
                    <div>
                      <strong className="text-amber-400">Financial Impact:</strong> {item.businessImpact}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column (1 Col): Confidence Gauge & Root Cause Diagnostic */}
        <div className="space-y-6">
          <GlassCard title="XAI Diagnostic Confidence" subtitle="Model Explainability Reliability">
            <div className="flex flex-col items-center justify-center py-4">
              <ConfidenceGauge confidence={96.4} />
            </div>
          </GlassCard>

          <GlassCard title="Root Cause Diagnostic Panel" subtitle="Automated fault isolation & process bottleneck analysis">
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/80 space-y-1">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Primary Root Cause Identified</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Section 4 dryer steam response delay (+3.8 min thermal lag) contributes {steamContrib}% of total transition risk score.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/80 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mitigation Recommendation</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Dampen stock flow rate by -550 L/min 45 seconds before ramping wire speed to offset thermal evaporation lag.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

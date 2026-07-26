import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/common/GlassCard';
import { PlotlyChart } from '../../components/charts/PlotlyChart';
import { AIDecisionFlow } from '../../components/common/AIDecisionFlow';
import { AnimatedCounter } from '../../components/common/AnimatedCounter';
import { ConfidenceGauge } from '../../components/common/ConfidenceGauge';
import { apiService } from '../../services/api';
import { MachineTelemetry, GRADE_RECIPES } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Gauge,
  Activity,
  Flame,
  Droplets,
  Wind,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Info,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Check,
  XCircle,
  Zap,
  DollarSign,
  Leaf
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    currentGrade,
    targetGrade,
    prediction,
    recommendation,
    isSimulating,
    simulationProgress,
    simulationStatus,
    startGradeChangeSimulation,
    isAiApplied,
    applyAiOptimization,
    resetAiOptimization,
    timelineProgress,
    isPlayingTimeline,
    toggleTimelinePlay,
    setTimelineProgress,
    alarms,
    acknowledgeAlarm,
    feedbackStats,
    submitOperatorFeedback
  } = useApp();

  const sourceRecipe = GRADE_RECIPES[currentGrade] || GRADE_RECIPES['KRAFT-42'];
  const targetRecipe = GRADE_RECIPES[targetGrade] || GRADE_RECIPES['KRAFT-33'];

  const [feedbackSubmitted, setFeedbackSubmitted] = useState<string | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');

  // Live KPI state
  const [telemetry, setTelemetry] = useState<MachineTelemetry[]>([]);
  const [currentKPIs, setCurrentKPIs] = useState({
    basisWeight: sourceRecipe.basisWeightTarget,
    basisWeightTarget: targetRecipe.basisWeightTarget,
    moisture: targetRecipe.moistureTarget + 0.2,
    moistureTarget: targetRecipe.moistureTarget,
    machineSpeed: sourceRecipe.targetSpeed,
    machineSpeedTarget: targetRecipe.targetSpeed,
    steamPressure: sourceRecipe.steamPressureTarget,
    steamPressureTarget: targetRecipe.steamPressureTarget,
    stockFlow: sourceRecipe.stockFlowTarget,
    stockFlowTarget: targetRecipe.stockFlowTarget,
    riskScore: isAiApplied ? 18.5 : 58.4,
    riskLevel: isAiApplied ? 'LOW' : ('HIGH' as 'LOW' | 'MEDIUM' | 'HIGH')
  });

  // Recommendation Card Details
  const recommendationData = {
    currentRecommendation: recommendation?.recommended_path_strategy || (sourceRecipe.basisWeightTarget > targetRecipe.basisWeightTarget ? 'Decrease Stock Flow & Increase Machine Speed' : 'Increase Stock Flow & Reduce Speed'),
    reason: `Prevent moisture transient as basis weight target changes from ${sourceRecipe.basisWeightTarget} g/m² (${currentGrade}) to ${targetRecipe.basisWeightTarget} g/m² (${targetGrade}).`,
    confidence: prediction?.confidence_interval_percent || 94.8,
    expectedImprovement: isAiApplied ? 'Saves 3.8 tons scrap ($4,850) & 8.2 min downtime' : `Saves estimated ${prediction?.estimated_off_spec_tons || 1.25} tons off-spec scrap in ${prediction?.predicted_duration_minutes || 16.8} minutes`
  };

  // Generate simulated telemetry ramp
  useEffect(() => {
    const startBW = sourceRecipe.basisWeightTarget;
    const endBW = targetRecipe.basisWeightTarget;
    const startSpeed = sourceRecipe.targetSpeed;
    const endSpeed = targetRecipe.targetSpeed;

    const progressFrac = isSimulating ? simulationProgress / 100 : timelineProgress / 100;
    const bwDiff = Math.abs(startBW - endBW);
    const calculatedRisk = isAiApplied ? 18.5 : (prediction?.quality_risk_score ?? (bwDiff > 60 ? 68.4 : bwDiff > 30 ? 42.1 : 24.5));
    let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (calculatedRisk > 60) level = 'HIGH';
    else if (calculatedRisk > 30) level = 'MEDIUM';

    setCurrentKPIs({
      basisWeight: Math.round((startBW + (endBW - startBW) * progressFrac) * 10) / 10,
      basisWeightTarget: endBW,
      moisture: Math.round((targetRecipe.moistureTarget + (1 - progressFrac) * 0.4) * 10) / 10,
      moistureTarget: targetRecipe.moistureTarget,
      machineSpeed: Math.round(startSpeed + (endSpeed - startSpeed) * progressFrac),
      machineSpeedTarget: endSpeed,
      steamPressure: Math.round((sourceRecipe.steamPressureTarget + (targetRecipe.steamPressureTarget - sourceRecipe.steamPressureTarget) * progressFrac) * 100) / 100,
      steamPressureTarget: targetRecipe.steamPressureTarget,
      stockFlow: Math.round(sourceRecipe.stockFlowTarget + (targetRecipe.stockFlowTarget - sourceRecipe.stockFlowTarget) * progressFrac),
      stockFlowTarget: targetRecipe.stockFlowTarget,
      riskScore: Math.round(calculatedRisk * 10) / 10,
      riskLevel: level
    });

    const initialSeries: MachineTelemetry[] = Array.from({ length: 20 }).map((_, i) => {
      const progress = (i / 19) * progressFrac;
      return {
        timestamp: `${14 + Math.floor(i / 3)}:${(i * 3) % 60 < 10 ? '0' : ''}${(i * 3) % 60}`,
        headbox_pressure_kPa: 142.5 + Math.sin(i * 0.4) * 2,
        wire_speed_m_min: Math.round(startSpeed + (endSpeed - startSpeed) * progress),
        steam_pressure_bar: Math.round((sourceRecipe.steamPressureTarget + (targetRecipe.steamPressureTarget - sourceRecipe.steamPressureTarget) * progress) * 100) / 100,
        stock_flow_l_min: Math.round(sourceRecipe.stockFlowTarget + (targetRecipe.stockFlowTarget - sourceRecipe.stockFlowTarget) * progress),
        basis_weight_actual: Math.round((startBW + (endBW - startBW) * progress) * 10) / 10,
        moisture_actual: Math.round((targetRecipe.moistureTarget + Math.sin(i * 0.8) * 0.35) * 10) / 10
      };
    });
    setTelemetry(initialSeries);
  }, [currentGrade, targetGrade, prediction, simulationProgress, timelineProgress, isAiApplied, isSimulating]);

  const handleFeedback = async (action: 'accept' | 'reject') => {
    setFeedbackSubmitted(action);
    await submitOperatorFeedback(101, action, feedbackComment || 'Verified setpoints against PM-4 DCS historian');
  };

  return (
    <div className="space-y-6">
      {/* 1. Sub-Header & Live Controls */}
      <div className="p-4 rounded-2xl glass-panel bg-gradient-to-r from-slate-900 via-slate-900/90 to-red-950/20 border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 font-sans tracking-wide">
                HONEYWELL PM-4 INDUSTRIAL CONTROL ROOM
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Live Grade Transition Controller • Model Predictive Optimizer (MPC) Active
              </p>
            </div>
          </div>

          {/* Hackathon Interactive Control Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Start Simulation Button */}
            <button
              onClick={startGradeChangeSimulation}
              disabled={isSimulating}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all shadow-lg cursor-pointer ${
                isSimulating
                  ? 'bg-amber-600/30 border border-amber-500/50 text-amber-300 animate-pulse'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/60 border border-red-500/40'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{isSimulating ? `SIMULATING (${simulationProgress}%)` : '▶ START GRADE CHANGE'}</span>
            </button>

            {/* Apply AI Optimization Button */}
            <button
              onClick={isAiApplied ? resetAiOptimization : applyAiOptimization}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all shadow-lg cursor-pointer ${
                isAiApplied
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-400 shadow-emerald-950/60'
                  : 'bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white border border-amber-400/40 shadow-amber-950/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAiApplied ? '✓ AI OPTIMIZED' : '✨ APPLY AI OPTIMIZATION'}</span>
            </button>
          </div>
        </div>

        {/* Live Simulation Progress Bar */}
        {isSimulating && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                PROCESS STATUS: {simulationStatus.toUpperCase()}
              </span>
              <span className="text-slate-400">{simulationProgress}% Complete</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${simulationProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Before vs After AI Optimization Panel */}
      <GlassCard className="bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              Before vs After AI Impact Comparison
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Status: <strong className={isAiApplied ? 'text-emerald-400' : 'text-amber-400'}>{isAiApplied ? 'AI Optimized' : 'Standard Manual MPC'}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">RECOVERY TIME</span>
            <div className="text-lg font-bold text-slate-100 font-mono">
              <AnimatedCounter value={isAiApplied ? 16.8 : 25.0} decimals={1} suffix=" min" />
            </div>
            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${isAiApplied ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-400'}`}>
              {isAiApplied ? '↓ 32.8% Faster' : 'Baseline'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">PAPER SCRAP</span>
            <div className="text-lg font-bold text-slate-100 font-mono">
              <AnimatedCounter value={isAiApplied ? 1.25 : 3.80} decimals={2} suffix=" Tons" />
            </div>
            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${isAiApplied ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-400'}`}>
              {isAiApplied ? '↓ 67.1% Saved' : 'Baseline'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">TRANSITION COST</span>
            <div className="text-lg font-bold text-slate-100 font-mono">
              <AnimatedCounter value={isAiApplied ? 1850 : 5420} decimals={0} prefix="$" />
            </div>
            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${isAiApplied ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-400'}`}>
              {isAiApplied ? '↓ $3,570 Saved' : 'Baseline'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">ENERGY USAGE</span>
            <div className="text-lg font-bold text-slate-100 font-mono">
              <AnimatedCounter value={isAiApplied ? 420 : 680} decimals={0} suffix=" kWh" />
            </div>
            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${isAiApplied ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-400'}`}>
              {isAiApplied ? '↓ 38.2% kWh' : 'Baseline'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">QUALITY RISK</span>
            <div className="text-lg font-bold text-slate-100 font-mono">
              <AnimatedCounter value={isAiApplied ? 18.5 : 58.4} decimals={1} suffix=" / 100" />
            </div>
            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${isAiApplied ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-400'}`}>
              {isAiApplied ? 'LOW RISK' : 'HIGH RISK'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">CO₂ REDUCTION</span>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              <AnimatedCounter value={isAiApplied ? -0.85 : 0.0} decimals={2} suffix=" Tons" />
            </div>
            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${isAiApplied ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-400'}`}>
              {isAiApplied ? 'Green Eco Impact' : 'Standard'}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* 3. Live KPIs Grid (6 Items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: Basis Weight */}
        <GlassCard className="p-4 border-slate-800/90 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>BASIS WEIGHT</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100 font-mono">
            <AnimatedCounter value={currentKPIs.basisWeight} decimals={1} suffix=" g/m²" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Target: {currentKPIs.basisWeightTarget}</span>
            <span className="text-cyan-400 font-medium">±0.4%</span>
          </div>
        </GlassCard>

        {/* KPI 2: Moisture Target */}
        <GlassCard className="p-4 border-slate-800/90 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SHEET MOISTURE</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100 font-mono">
            <AnimatedCounter value={currentKPIs.moisture} decimals={1} suffix=" %" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Target: {currentKPIs.moistureTarget}%</span>
            <span className="text-emerald-400 font-medium">NOMINAL</span>
          </div>
        </GlassCard>

        {/* KPI 3: Machine Speed */}
        <GlassCard className="p-4 border-slate-800/90 hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>WIRE SPEED</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100 font-mono">
            <AnimatedCounter value={currentKPIs.machineSpeed} decimals={0} suffix=" m/min" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Target: {currentKPIs.machineSpeedTarget}</span>
            <span className="text-emerald-400 font-medium">Ramping</span>
          </div>
        </GlassCard>

        {/* KPI 4: Steam Pressure */}
        <GlassCard className="p-4 border-slate-800/90 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>DRYER STEAM</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100 font-mono">
            <AnimatedCounter value={currentKPIs.steamPressure} decimals={2} suffix=" bar" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Target: {currentKPIs.steamPressureTarget}</span>
            <span className="text-amber-400 font-medium">+0.3 bar</span>
          </div>
        </GlassCard>

        {/* KPI 5: Stock Flow Rate */}
        <GlassCard className="p-4 border-slate-800/90 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>STOCK FLOW</span>
            <RefreshCw className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100 font-mono">
            <AnimatedCounter value={currentKPIs.stockFlow} decimals={0} suffix=" L/min" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Target: {currentKPIs.stockFlowTarget}</span>
            <span className="text-purple-400 font-medium">Flow Sync</span>
          </div>
        </GlassCard>

        {/* KPI 6: Risk Score Gauge */}
        <GlassCard className="p-4 border-slate-800/90 hover:border-red-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>QUALITY RISK</span>
            <ShieldAlert
              className={`w-4 h-4 ${
                currentKPIs.riskLevel === 'HIGH'
                  ? 'text-red-500 animate-pulse'
                  : currentKPIs.riskLevel === 'MEDIUM'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            />
          </div>
          <div
            className={`mt-2 text-2xl font-bold font-mono ${
              currentKPIs.riskLevel === 'HIGH'
                ? 'text-red-400'
                : currentKPIs.riskLevel === 'MEDIUM'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            <AnimatedCounter value={currentKPIs.riskScore} decimals={1} suffix=" / 100" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Status:</span>
            <span
              className={`font-bold ${
                currentKPIs.riskLevel === 'HIGH'
                  ? 'text-red-400'
                  : currentKPIs.riskLevel === 'MEDIUM'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {currentKPIs.riskLevel}
            </span>
          </div>
        </GlassCard>
      </div>

      {/* 4. Interactive Timeline Playback Scrubber */}
      <GlassCard className="bg-slate-900/80 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTimelinePlay}
              className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg cursor-pointer"
              title="Play/Pause Timeline Playback"
            >
              {isPlayingTimeline ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setTimelineProgress(0)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Restart Timeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div>
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider block">
                Timeline Replay Controller
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Playback Position: {(timelineProgress * 0.18).toFixed(1)} min / 18.0 min
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-xl flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-500">0s</span>
            <input
              type="range"
              min="0"
              max="100"
              value={timelineProgress}
              onChange={(e) => setTimelineProgress(Number(e.target.value))}
              className="w-full accent-red-500 h-2 bg-slate-950 rounded-lg cursor-pointer border border-slate-800"
            />
            <span className="text-[10px] font-mono text-slate-500">18m</span>
          </div>
        </div>
      </GlassCard>

      {/* 5. AI Decision Flow Architecture Visualization */}
      <GlassCard className="bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Real-Time AI Decision Pipeline Flow
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">Honeywell Experion® Engine</span>
        </div>
        <AIDecisionFlow />
      </GlassCard>

      {/* 6. Main Telemetry Graphs & Confidence Gauge Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Telemetry Trend Graph */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard
            title="Real-Time Machine Telemetry & Transition Ramp Curves"
            subtitle="OPC-UA High-Frequency Sensor Stream vs Target Recipe Bounds"
          >
            <div className="h-80 w-full mt-2">
              <PlotlyChart
                data={[
                  {
                    x: telemetry.map((t) => t.timestamp),
                    y: telemetry.map((t) => t.basis_weight_actual),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'Basis Weight Actual (g/m²)',
                    line: { color: '#06b6d4', width: 3 }
                  },
                  {
                    x: telemetry.map((t) => t.timestamp),
                    y: telemetry.map((t) => t.steam_pressure_bar * 40),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Steam Pressure (bar x 40)',
                    line: { color: '#f59e0b', width: 2, dash: 'dot' }
                  },
                  {
                    x: telemetry.map((t) => t.timestamp),
                    y: telemetry.map((t) => t.wire_speed_m_min / 5),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Wire Speed (m/min ÷ 5)',
                    line: { color: '#10b981', width: 2 }
                  }
                ]}
                layout={{
                  height: 320,
                  margin: { t: 20, b: 40, l: 40, r: 20 },
                  legend: { orientation: 'h', y: -0.2 }
                }}
              />
            </div>
          </GlassCard>
        </div>

        {/* Right Sidebar: AI Confidence Gauge & Recommendation */}
        <div className="space-y-6">
          {/* Quality AI Confidence Gauge Component */}
          <GlassCard
            title="AI Prediction Confidence Gauge"
            subtitle="XGBoost & LSTM Multi-Horizon Ensemble Reliability"
          >
            <div className="py-2">
              <ConfidenceGauge confidence={recommendationData.confidence} size="md" />
            </div>
          </GlassCard>

          {/* AI Recommendation Card with Operator Feedback */}
          <GlassCard
            title="AI Action Recommendation"
            subtitle="Honeywell Model Predictive Control Output"
          >
            <div className="space-y-3 font-sans text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">RECOMMENDED STRATEGY</div>
                <div className="text-sm font-bold text-slate-100 leading-snug">
                  {recommendationData.currentRecommendation}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">PHYSICS & QUALITY RATIONALE</span>
                <p className="text-slate-300 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                  {recommendationData.reason}
                </p>
              </div>

              {/* Operator Feedback Buttons */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>OPERATOR FEEDBACK</span>
                  <span className="text-emerald-400 font-bold">{feedbackStats.acceptanceRate}% ACCEPTANCE RATE</span>
                </div>

                {feedbackSubmitted ? (
                  <div className="p-2 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-mono text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Feedback Saved ({feedbackSubmitted.toUpperCase()})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFeedback('accept')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleFeedback('reject')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 7. Intelligent Live Alarms List */}
      <GlassCard
        title="Intelligent Control Room Alarms & Diagnostics"
        subtitle="Active fault detection and automated root-cause analysis"
        action={
          <span className="text-xs font-mono text-slate-400">
            Active Alarms: <strong className="text-amber-400">{alarms.filter(a => !a.acknowledged).length}</strong>
          </span>
        }
      >
        <div className="space-y-3 mt-2">
          {alarms.map((alarm) => (
            <motion.div
              key={alarm.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                alarm.acknowledged
                  ? 'bg-slate-900/30 border-slate-800/80 opacity-60'
                  : alarm.severity === 'high'
                  ? 'bg-red-950/30 border-red-800/80 text-red-200'
                  : 'bg-amber-950/30 border-amber-800/80 text-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    alarm.acknowledged
                      ? 'bg-slate-900 text-slate-500'
                      : alarm.severity === 'high'
                      ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{alarm.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                      {alarm.section}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{alarm.description}</p>
                  {alarm.aiCause && (
                    <div className="mt-2 p-2 rounded bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-cyan-300">
                      <strong>AI CAUSE:</strong> {alarm.aiCause}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 font-mono shrink-0">
                <span className="text-[11px] text-slate-500">{alarm.timestamp}</span>
                {!alarm.acknowledged ? (
                  <button
                    onClick={() => acknowledgeAlarm(alarm.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                  >
                    Acknowledge
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

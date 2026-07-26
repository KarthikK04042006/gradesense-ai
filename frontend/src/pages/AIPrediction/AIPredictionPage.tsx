import React, { useState } from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import { PlotlyChart } from '../../components/charts/PlotlyChart';
import { TimelineState, GRADE_RECIPES } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Gauge,
  Sparkles,
  Zap,
  Activity,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export const AIPredictionPage: React.FC = () => {
  const { currentGrade, targetGrade, prediction } = useApp();
  const [scenarioMode, setScenarioMode] = useState<'normal' | 'critical'>('normal');

  const sourceRecipe = GRADE_RECIPES[currentGrade] || GRADE_RECIPES['KRAFT-42'];
  const targetRecipe = GRADE_RECIPES[targetGrade] || GRADE_RECIPES['KRAFT-33'];

  const startBW = sourceRecipe.basisWeightTarget;
  const endBW = targetRecipe.basisWeightTarget;
  const bwGap = Math.abs(startBW - endBW);

  const baseRisk = prediction?.quality_risk_score ?? (bwGap > 60 ? 68.4 : bwGap > 30 ? 42.1 : 18.5);
  const currentRiskVal = scenarioMode === 'normal' ? baseRisk : Math.min(88.5, baseRisk + 45.0);

  // Core Prediction Summary Metrics dynamically calculated
  const metrics = {
    currentRisk: Math.round(currentRiskVal * 10) / 10,
    currentRiskLabel: currentRiskVal > 60 ? 'CRITICAL' : currentRiskVal > 30 ? 'WARNING' : 'SAFE',
    offSpecProbability: scenarioMode === 'normal' ? (currentRiskVal > 50 ? 54.2 : 11.2) : 78.5,
    predictedBasisWeight: targetRecipe.basisWeightTarget,
    predictedMoisture: targetRecipe.moistureTarget,
    predictedStabilizationTime: prediction?.predicted_duration_minutes ?? Math.round((10 + bwGap * 0.15) * 10) / 10,
    confidenceScore: prediction?.confidence_interval_percent ?? 96.4
  };

  // Timeline States dynamically matching selected grade pair
  const timelineData: TimelineState[] = [
    {
      label: 'Current',
      timeOffset: '0s',
      basisWeight: startBW,
      moisture: sourceRecipe.moistureTarget,
      offSpecProb: 8.2,
      riskScore: 15.0,
      status: 'safe'
    },
    {
      label: '30 Seconds Later',
      timeOffset: '+30s',
      basisWeight: Math.round((startBW + (endBW - startBW) * 0.5) * 10) / 10,
      moisture: scenarioMode === 'normal' ? Math.round((targetRecipe.moistureTarget + 0.8) * 10) / 10 : 9.8,
      offSpecProb: scenarioMode === 'normal' ? 42.0 : 82.5,
      riskScore: scenarioMode === 'normal' ? 38.0 : 78.0,
      status: scenarioMode === 'normal' ? 'warning' : 'critical'
    },
    {
      label: '60 Seconds Later',
      timeOffset: '+60s',
      basisWeight: Math.round((startBW + (endBW - startBW) * 0.85) * 10) / 10,
      moisture: targetRecipe.moistureTarget,
      offSpecProb: scenarioMode === 'normal' ? 14.5 : 55.0,
      riskScore: scenarioMode === 'normal' ? 22.0 : 62.0,
      status: scenarioMode === 'normal' ? 'safe' : 'warning'
    }
  ];

  // Utility for status color styling
  const getStatusBadge = (status: 'safe' | 'warning' | 'critical') => {
    switch (status) {
      case 'safe':
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SAFE</span>
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-800/80 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>WARNING</span>
          </span>
        );
      case 'critical':
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-red-950/80 text-red-400 border border-red-800/80 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>CRITICAL</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Selector */}
      <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-red-950/30 border-red-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Honeywell AI Grade Transition Predictor
              </h2>
              <p className="text-xs text-slate-400">
                Physics-informed Machine Learning forecasting moisture transients, basis weight settling, and off-spec risk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setScenarioMode(scenarioMode === 'normal' ? 'critical' : 'normal')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer ${
                scenarioMode === 'normal'
                  ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  : 'bg-red-950 text-red-300 border-red-800'
              }`}
            >
              Simulate Mode: <strong className="uppercase font-bold">{scenarioMode}</strong>
            </button>

            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MODEL CONFIDENCE: {metrics.confidenceScore}%</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Required Display Metrics Grid (Single Unified Stat Strip Container) */}
      <GlassCard className="p-0 border-slate-800/60 bg-slate-900/60 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 divide-y sm:divide-y-0 lg:divide-x divide-slate-800/50 font-mono">
          {/* 1. Current Risk */}
          <div className="p-4 space-y-1">
            <div className="text-xs text-slate-400">CURRENT RISK</div>
            <div className="text-xl font-bold text-slate-100">
              {metrics.currentRisk}%
            </div>
            <div className="flex items-center justify-between text-[10px] pt-1">
              <span className="text-slate-500">Threshold: 45%</span>
              <span
                className={`font-semibold ${
                  metrics.currentRisk > 60 ? 'text-red-400' : metrics.currentRisk > 30 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {metrics.currentRiskLabel}
              </span>
            </div>
          </div>

          {/* 2. Off-Spec Probability */}
          <div className="p-4 space-y-1">
            <div className="text-xs text-slate-400">OFF-SPEC PROBABILITY</div>
            <div className="text-xl font-bold text-amber-400">
              {metrics.offSpecProbability}%
            </div>
            <div className="text-[10px] text-slate-500 pt-1">Scrap Risk Estimate</div>
          </div>

          {/* 3. Predicted Basis Weight */}
          <div className="p-4 space-y-1">
            <div className="text-xs text-slate-400">PREDICTED BASIS WEIGHT</div>
            <div className="text-xl font-bold text-cyan-400">
              {metrics.predictedBasisWeight} <span className="text-xs text-slate-400 font-normal">g/m²</span>
            </div>
            <div className="text-[10px] text-slate-500 pt-1">Target: 185.0 g/m²</div>
          </div>

          {/* 4. Predicted Moisture */}
          <div className="p-4 space-y-1">
            <div className="text-xs text-slate-400">PREDICTED MOISTURE</div>
            <div className="text-xl font-bold text-amber-400">
              {metrics.predictedMoisture}%
            </div>
            <div className="text-[10px] text-slate-500 pt-1">Target: 7.0%</div>
          </div>

          {/* 5. Predicted Stabilization Time */}
          <div className="p-4 space-y-1">
            <div className="text-xs text-slate-400">PREDICTED STABILIZATION</div>
            <div className="text-xl font-bold text-emerald-400">
              {metrics.predictedStabilizationTime} <span className="text-xs text-slate-400 font-normal">min</span>
            </div>
            <div className="text-[10px] text-slate-500 pt-1">Faster by -4.2 min</div>
          </div>

          {/* 6. Confidence Score */}
          <div className="p-4 space-y-1">
            <div className="text-xs text-slate-400">CONFIDENCE SCORE</div>
            <div className="text-xl font-bold text-slate-100">
              {metrics.confidenceScore}%
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold pt-1">Honeywell MPC ML</div>
          </div>
        </div>
      </GlassCard>

      {/* Prediction Timeline Section (Current, 30s later, 60s later) */}
      <GlassCard title="Prediction Timeline Forecast" subtitle="3-step trajectory state cards (Current ➔ +30s ➔ +60s)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {timelineData.map((step, idx) => (
            <div
              key={step.label}
              className={`p-5 rounded-xl border transition-all relative ${
                step.status === 'safe'
                  ? 'bg-slate-900/40 border-slate-800/40'
                  : step.status === 'warning'
                  ? 'bg-amber-950/20 border-amber-900/30'
                  : 'bg-red-950/20 border-red-900/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3 border-b border-slate-800/40 pb-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">TIMELINE STEP 0{idx + 1}</span>
                  <span className="text-sm font-bold text-slate-100 font-mono">{step.label}</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-cyan-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800/40">
                  {step.timeOffset}
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs mb-4 divide-y divide-slate-800/30">
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400">Basis Weight:</span>
                  <span className="font-bold text-slate-100">{step.basisWeight} g/m²</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400">Moisture Level:</span>
                  <span className="font-bold text-amber-400">{step.moisture}%</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400">Off-Spec Probability:</span>
                  <span className={`font-bold ${step.offSpecProb > 60 ? 'text-red-400' : step.offSpecProb > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {step.offSpecProb}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">
                <span className="text-[11px] font-mono text-slate-400">Color Code Status:</span>
                {getStatusBadge(step.status)}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Plotly Forecast Curve Chart */}
      <GlassCard title="Dynamic Prediction Trajectory Plot" subtitle="Forecast curve extending from Current state to +120s with confidence interval">
        <PlotlyChart
          data={[
            {
              x: ['0s (Current)', '+30s', '+60s', '+90s', '+120s'],
              y: [205.0, 192.4, 178.1, 165.2, 161.0],
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Predicted Basis Weight (g/m²)',
              line: { color: '#38bdf8', width: 3 }
            },
            {
              x: ['0s (Current)', '+30s', '+60s', '+90s', '+120s'],
              y: [7.5, scenarioMode === 'normal' ? 8.4 : 9.8, 7.4, 7.1, 7.0],
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Predicted Moisture (%)',
              line: { color: '#f59e0b', width: 2.5, dash: 'dot' }
            }
          ]}
          layout={{
            height: 270,
            yaxis: { title: { text: 'Trajectory Value' }, gridcolor: '#1e293b' },
            xaxis: { title: { text: 'Timeline Horizon' }, gridcolor: '#1e293b' }
          }}
        />
      </GlassCard>
    </div>
  );
};

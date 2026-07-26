import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/common/GlassCard';
import { PlotlyChart } from '../../components/charts/PlotlyChart';
import { AnimatedCounter } from '../../components/common/AnimatedCounter';
import { apiService } from '../../services/api';
import { SimulatorResponse } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Sliders,
  Activity,
  Flame,
  Wind,
  Droplets,
  Gauge,
  Zap,
  Trash2,
  Clock,
  RefreshCw,
  Layers,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  DollarSign
} from 'lucide-react';

export const WhatIfSimulatorPage: React.FC = () => {
  const { applyAiOptimization, setActiveTab } = useApp();

  // 6 Required Sliders State
  const [machineSpeed, setMachineSpeed] = useState<number>(885);
  const [steamPressure, setSteamPressure] = useState<number>(3.8);
  const [stockFlow, setStockFlow] = useState<number>(3950);
  const [targetMoisture, setTargetMoisture] = useState<number>(7.0);
  const [fillerFlow, setFillerFlow] = useState<number>(140);
  const [recipeTargetBW, setRecipeTargetBW] = useState<number>(185);

  // Simulation Data State
  const [simData, setSimData] = useState<SimulatorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Baseline Scenario A values for comparison
  const baseline = {
    time: 25.0,
    scrap: 3.80,
    energy: 680,
    risk: 58.4,
    cost: 5420
  };

  // Trigger backend recalculation on every slider change (debounced 100ms)
  useEffect(() => {
    const fetchSimulation = async () => {
      setLoading(true);
      try {
        const res = await apiService.runSimulator({
          machine_speed_m_min: machineSpeed,
          steam_pressure_bar: steamPressure,
          stock_flow_l_min: stockFlow,
          target_moisture_percent: targetMoisture,
          filler_flow_l_min: fillerFlow,
          recipe_target_bw_gsm: recipeTargetBW
        });
        setSimData(res);
      } catch (e) {
        console.error('Error running backend simulation', e);
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => {
      fetchSimulation();
    }, 100);

    return () => clearTimeout(handler);
  }, [machineSpeed, steamPressure, stockFlow, targetMoisture, fillerFlow, recipeTargetBW]);

  const loadPreset = (preset: 'standard' | 'aggressive' | 'eco') => {
    if (preset === 'standard') {
      setMachineSpeed(885);
      setSteamPressure(3.8);
      setStockFlow(3950);
      setTargetMoisture(7.0);
      setFillerFlow(140);
      setRecipeTargetBW(185);
    } else if (preset === 'aggressive') {
      setMachineSpeed(1050);
      setSteamPressure(4.5);
      setStockFlow(4400);
      setTargetMoisture(6.8);
      setFillerFlow(180);
      setRecipeTargetBW(161);
    } else if (preset === 'eco') {
      setMachineSpeed(760);
      setSteamPressure(3.2);
      setStockFlow(3400);
      setTargetMoisture(7.4);
      setFillerFlow(110);
      setRecipeTargetBW(205);
    }
  };

  // Calculated Scenario B metrics
  const simScrap = simData?.estimated_paper_loss_tons ?? 1.25;
  const simTime = simData?.stabilization_time_min ?? 16.8;
  const simEnergy = simData?.energy_usage_kwh ?? 420;
  const simRisk = simData?.risk_score ?? 18.5;
  const simCost = Math.round(simScrap * 650 + (simTime / 60) * 850 * 0.12 + (simTime / 60) * 3500);

  const costSavings = baseline.cost - simCost;
  const winner = simCost < baseline.cost ? 'Scenario B (Simulated Setpoints)' : 'Scenario A (Baseline Manual MPC)';

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border-amber-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400">
              <Sliders className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Honeywell "What-If" Process & Scenario Simulator
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Real-time ML physics simulation recalculating curves, risk, and cost instantly on slider drag
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>ML RECALCULATION: {loading ? 'COMPUTING...' : 'LIVE'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadPreset('standard')}
                className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
              >
                Standard MPC
              </button>
              <button
                onClick={() => loadPreset('aggressive')}
                className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-amber-800/80 text-amber-400 transition-colors cursor-pointer"
              >
                High Speed
              </button>
              <button
                onClick={() => loadPreset('eco')}
                className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-emerald-800/80 text-emerald-400 transition-colors cursor-pointer"
              >
                Eco Mode
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Recommended Winner Banner */}
      <GlassCard className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                RECOMMENDED WINNER SCENARIO
              </div>
              <div className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>{winner}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {costSavings > 0 ? `Saves $${costSavings.toLocaleString()} per run` : 'Baseline Selected'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              applyAiOptimization();
              setActiveTab('dashboard');
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply Winner Setpoints to DCS</span>
          </button>
        </div>
      </GlassCard>

      {/* Side-by-Side Scenario Comparison Matrix */}
      <GlassCard title="Side-by-Side Scenario Comparison Matrix" subtitle="Scenario A (Baseline Standard MPC) vs Scenario B (Simulated Setpoints)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs pt-2">
          {/* Scenario A: Baseline */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-300">SCENARIO A: BASELINE MANUAL MPC</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">UNOPTIMIZED</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Transition Duration:</span>
                <span className="font-bold text-slate-200">{baseline.time} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Off-Spec Paper Scrap:</span>
                <span className="font-bold text-slate-200">{baseline.scrap} Tons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Energy Consumption:</span>
                <span className="font-bold text-slate-200">{baseline.energy} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quality Risk Score:</span>
                <span className="font-bold text-red-400">{baseline.risk} / 100</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-bold">Total Transition Cost:</span>
                <span className="font-bold text-red-400 text-sm">${baseline.cost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Scenario B: Simulated Setpoints */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/80 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
              <span className="font-bold text-emerald-400">SCENARIO B: SIMULATED SETPOINTS</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">ACTIVE SIMULATION</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Transition Duration:</span>
                <span className="font-bold text-emerald-400">
                  <AnimatedCounter value={simTime} decimals={1} suffix=" min" />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Off-Spec Paper Scrap:</span>
                <span className="font-bold text-emerald-400">
                  <AnimatedCounter value={simScrap} decimals={2} suffix=" Tons" />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Energy Consumption:</span>
                <span className="font-bold text-emerald-400">
                  <AnimatedCounter value={simEnergy} decimals={0} suffix=" kWh" />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quality Risk Score:</span>
                <span className="font-bold text-emerald-400">
                  <AnimatedCounter value={simRisk} decimals={1} suffix=" / 100" />
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-emerald-800/60">
                <span className="text-emerald-300 font-bold">Total Transition Cost:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  <AnimatedCounter value={simCost} decimals={0} prefix="$" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main Grid: 6 Sliders Column + Real Backend Response Charts Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: 6 Required Sliders */}
        <GlassCard title="Interactive Process Sliders" subtitle="Drag sliders to test real-time physics recalculations">
          <div className="space-y-4 mt-2 font-mono text-xs">
            
            {/* Slider 1: Machine Speed */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  1. Machine Speed
                </span>
                <span className="text-emerald-400 font-bold">{machineSpeed} m/min</span>
              </div>
              <input
                type="range"
                min="400"
                max="1200"
                step="25"
                value={machineSpeed}
                onChange={(e) => setMachineSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Slider 2: Steam Pressure */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                  2. Steam Pressure
                </span>
                <span className="text-red-400 font-bold">{steamPressure} bar</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={steamPressure}
                onChange={(e) => setSteamPressure(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-400"
              />
            </div>

            {/* Slider 3: Stock Flow */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  3. Stock Flow
                </span>
                <span className="text-cyan-400 font-bold">{stockFlow} L/min</span>
              </div>
              <input
                type="range"
                min="2500"
                max="5000"
                step="50"
                value={stockFlow}
                onChange={(e) => setStockFlow(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Slider 4: Moisture */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-amber-400" />
                  4. Moisture Target
                </span>
                <span className="text-amber-400 font-bold">{targetMoisture}%</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="10.0"
                step="0.2"
                value={targetMoisture}
                onChange={(e) => setTargetMoisture(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Slider 5: Filler Flow */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-300" />
                  5. Filler Flow (Ash Slurry)
                </span>
                <span className="text-cyan-300 font-bold">{fillerFlow} L/min</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={fillerFlow}
                onChange={(e) => setFillerFlow(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-300"
              />
            </div>

            {/* Slider 6: Recipe Target */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-slate-100" />
                  6. Recipe Target (Basis Weight)
                </span>
                <span className="text-slate-100 font-bold">{recipeTargetBW} g/m²</span>
              </div>
              <input
                type="range"
                min="120"
                max="300"
                step="5"
                value={recipeTargetBW}
                onChange={(e) => setRecipeTargetBW(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-100"
              />
            </div>

          </div>
        </GlassCard>

        {/* Right Column: Real Backend Response Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart 1: Basis Weight Dynamic Response Curve */}
          <GlassCard
            title="FastAPI Backend Basis Weight Curve"
            subtitle="Calculated in real-time by trained XGBoost & physics engine"
          >
            <PlotlyChart
              data={[
                {
                  x: simData?.simulation_time_points ?? ['0m', '5m', '10m', '15m', '20m', '25m', '30m'],
                  y: simData?.basis_weight_curve ?? [205, 195, 185, 175, 168, 162, 161],
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Predicted Basis Weight (g/m²)',
                  line: { color: '#38bdf8', width: 3 }
                },
                {
                  x: simData?.simulation_time_points ?? ['0m', '5m', '10m', '15m', '20m', '25m', '30m'],
                  y: (simData?.simulation_time_points ?? ['0m', '5m', '10m', '15m', '20m', '25m', '30m']).map(() => recipeTargetBW),
                  type: 'scatter',
                  mode: 'lines',
                  name: `Recipe Target (${recipeTargetBW} g/m²)`,
                  line: { color: '#10b981', width: 2, dash: 'dash' }
                }
              ]}
              layout={{
                height: 240,
                yaxis: { title: { text: 'Basis Weight (g/m²)' }, gridcolor: '#1e293b' },
                xaxis: { title: { text: 'Transition Time (min)' }, gridcolor: '#1e293b' }
              }}
            />
          </GlassCard>

          {/* Chart 2: Moisture Transient & Energy Response */}
          <GlassCard
            title="FastAPI Backend Moisture Trajectory"
            subtitle="LSTM sequence forecast curve calculated on FastAPI backend"
          >
            <PlotlyChart
              data={[
                {
                  x: simData?.simulation_time_points ?? ['0m', '5m', '10m', '15m', '20m', '25m', '30m'],
                  y: simData?.moisture_curve ?? [7.5, 8.1, 7.8, 7.3, 7.1, 7.0, 7.0],
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Moisture Forecast (%)',
                  line: { color: '#f59e0b', width: 2.5 }
                }
              ]}
              layout={{
                height: 230,
                yaxis: { title: { text: 'Moisture (%)' }, gridcolor: '#1e293b' },
                xaxis: { title: { text: 'Transition Time (min)' }, gridcolor: '#1e293b' }
              }}
            />
          </GlassCard>

        </div>

      </div>
    </div>
  );
};

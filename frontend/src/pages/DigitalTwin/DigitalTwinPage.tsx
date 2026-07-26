import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';
import { GRADE_RECIPES } from '../../types';
import {
  Cpu,
  Activity,
  Wind,
  Flame,
  Droplets,
  Gauge,
  Sliders,
  RotateCw,
  Sparkles,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  const { currentGrade, targetGrade, telemetry, isAiApplied, prediction } = useApp();
  const targetRecipe = GRADE_RECIPES[targetGrade] || GRADE_RECIPES['KRAFT-33'];
  const latest = telemetry[telemetry.length - 1];

  const [overrideSpeed, setOverrideSpeed] = useState<number | null>(null);
  const [overrideSteam, setOverrideSteam] = useState<number | null>(null);
  const [overrideStock, setOverrideStock] = useState<number | null>(null);

  const machineSpeed = overrideSpeed ?? (latest?.wire_speed_m_min || targetRecipe.targetSpeed);
  const steamPressure = overrideSteam ?? (latest?.steam_pressure_bar || targetRecipe.steamPressureTarget);
  const stockFlow = overrideStock ?? (latest?.stock_flow_l_min || targetRecipe.stockFlowTarget);
  const basisWeight = latest?.basis_weight_actual || targetRecipe.basisWeightTarget;
  const moisture = latest?.moisture_actual || targetRecipe.moistureTarget;

  // Compute dynamic animation speeds based on live machine speed
  const rotationDuration = Math.max(0.4, 3 - (machineSpeed / 1200) * 2.2);
  const steamDuration = Math.max(0.6, 2.2 - (steamPressure / 5.5) * 1.5);
  const conveyorDashDuration = Math.max(0.2, 1.8 - (machineSpeed / 1200) * 1.4);

  // Section Risk Highlighting Logic
  const riskScore = isAiApplied ? 18.5 : (prediction?.quality_risk_score ?? 58.4);
  const headboxRisk = stockFlow > 4200 || riskScore > 60;
  const pressRisk = steamPressure > 4.5 || (riskScore > 50 && !isAiApplied);
  const dryerRisk = steamPressure > 4.0 || moisture > 8.0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border-cyan-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                PM-4 Paper Manufacturing Digital Twin
              </h2>
              <p className="text-xs text-slate-400">
                Physics-based real-time paper machine simulation with stock slurry, steam heat, and paper web animations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>DIGITAL TWIN ENGINE: ACTIVE</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Live Value Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
        {/* Stock Flow */}
        <GlassCard className={`p-4 border-slate-800 ${headboxRisk ? 'border-amber-500/80 bg-amber-950/20' : ''}`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>STOCK FLOW</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-cyan-400">
            {stockFlow.toLocaleString()} <span className="text-xs text-slate-400">L/min</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Headbox Feed Slurry Rate</div>
        </GlassCard>

        {/* Steam Pressure */}
        <GlassCard className={`p-4 border-slate-800 ${pressRisk ? 'border-red-500/80 bg-red-950/20' : ''}`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>STEAM PRESSURE</span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-red-400">
            {steamPressure} <span className="text-xs text-slate-400">bar</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Dryer Group 1-4 Supply</div>
        </GlassCard>

        {/* Machine Speed */}
        <GlassCard className="p-4 border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>MACHINE SPEED</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-400">
            {machineSpeed} <span className="text-xs text-slate-400">m/min</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Fourdrinier Wire Drag</div>
        </GlassCard>

        {/* Moisture */}
        <GlassCard className={`p-4 border-slate-800 ${dryerRisk ? 'border-amber-500/80 bg-amber-950/20' : ''}`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>MOISTURE</span>
            <Droplets className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-amber-400">{moisture}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Scanner Sensor Readout</div>
        </GlassCard>

        {/* Basis Weight */}
        <GlassCard className="p-4 border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>BASIS WEIGHT</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-100">
            {basisWeight} <span className="text-xs text-slate-400">g/m²</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Target: {targetRecipe.basisWeightTarget} g/m²</div>
        </GlassCard>
      </div>

      {/* Main Digital Twin Machine Graphic Box */}
      <GlassCard
        title="Paper Machine PM-4 Animated Digital Twin Schematic"
        subtitle="Live animated pulp slurry stream, dryer steam clouds, moving paper sheet ribbon, and risk highlights"
      >
        <div className="relative w-full overflow-x-auto p-4 bg-slate-950/90 rounded-xl border border-slate-800 min-h-[460px] flex flex-col justify-between">
          
          {/* Section Titles Legend Overlay */}
          <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-mono font-bold text-slate-400 border-b border-slate-800/80 pb-2 mb-4">
            <span className={headboxRisk ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}>
              1. HEADBOX & STOCK {headboxRisk && '⚠️'}
            </span>
            <span className="text-emerald-400">2. WIRE CONVEYOR</span>
            <span className={pressRisk ? 'text-red-400 animate-pulse' : 'text-red-400'}>
              3. STEAM & PRESS {pressRisk && '⚠️'}
            </span>
            <span className={dryerRisk ? 'text-amber-400 animate-pulse' : 'text-amber-400'}>
              4. THERMAL DRYER {dryerRisk && '⚠️'}
            </span>
            <span className="text-slate-200">5. REEL & PAPER ROLL</span>
          </div>

          {/* Continuous Animated Paper Machine Canvas Area */}
          <div className="relative w-full h-72 my-auto flex items-center justify-between px-4 min-w-[920px]">
            
            {/* ---------------- SECTION 1: HEADBOX ---------------- */}
            <div className="relative flex flex-col items-center">
              <div className={`w-28 h-36 bg-slate-900 border-2 ${headboxRisk ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-cyan-500/80'} rounded-t-xl relative overflow-hidden flex flex-col justify-end shadow-lg shadow-cyan-950/50`}>
                {/* Pulsing Liquid Slurry Level */}
                <motion.div
                  className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 opacity-80"
                  animate={{ height: ['60%', '68%', '60%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                />

                {/* Animated Stock Slurry Particles inside Headbox */}
                <div className="absolute inset-0 flex flex-col justify-around p-2 pointer-events-none">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-cyan-200/90 shadow-sm shadow-cyan-400"
                      animate={{ y: [0, 15, 0], x: [0, (i % 2 === 0 ? 10 : -10), 0] }}
                      transition={{ repeat: Infinity, duration: 1 + i * 0.3, ease: 'easeInOut' }}
                    />
                  ))}
                </div>

                <div className="absolute top-2 left-0 right-0 text-center font-mono text-[9px] text-cyan-300 font-bold bg-slate-950/80 py-0.5">
                  142.5 kPa
                </div>
              </div>
              <div className="text-[10px] font-mono text-cyan-400 mt-2 font-semibold">Stock Headbox</div>
              <div className="absolute -top-6 bg-slate-900 border border-cyan-500 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-300 shadow">
                Sensor S1: {stockFlow} L/min
              </div>
            </div>

            {/* Liquid Slurry Discharge Jet Stream */}
            <div className="relative flex items-center justify-center w-10">
              <motion.div
                className="h-2.5 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full w-full shadow-sm shadow-cyan-400"
                animate={{ opacity: [0.7, 1, 0.7], scaleY: [0.9, 1.2, 0.9] }}
                transition={{ repeat: Infinity, duration: conveyorDashDuration }}
              />
              {/* Flowing particle dots */}
              <motion.div
                animate={{ x: [-15, 15] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="absolute w-2 h-2 rounded-full bg-cyan-200"
              />
            </div>

            {/* ---------------- SECTION 2: ANIMATED WIRE CONVEYOR ---------------- */}
            <div className="relative flex flex-col items-center">
              <div className="relative w-48 h-20 bg-slate-900/80 border border-emerald-500/60 rounded-xl flex items-center justify-between px-2 overflow-hidden shadow-md">
                
                {/* Continuous Moving Conveyor Wire Belt Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <motion.line
                    x1="0"
                    y1="6"
                    x2="100%"
                    y2="6"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                    animate={{ strokeDashoffset: [0, -28] }}
                    transition={{ repeat: Infinity, duration: conveyorDashDuration, ease: 'linear' }}
                  />
                  <motion.line
                    x1="0"
                    y1="72"
                    x2="100%"
                    y2="72"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                    animate={{ strokeDashoffset: [0, 28] }}
                    transition={{ repeat: Infinity, duration: conveyorDashDuration, ease: 'linear' }}
                  />
                </svg>

                {/* Rotating Roller Drums */}
                <motion.div
                  className="w-10 h-10 rounded-full border-2 border-emerald-400 bg-slate-800 flex items-center justify-center shadow"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: rotationDuration, ease: 'linear' }}
                >
                  <RotateCw className="w-5 h-5 text-emerald-400" />
                </motion.div>

                <motion.div
                  className="w-8 h-8 rounded-full border-2 border-emerald-500 bg-slate-800 flex items-center justify-center shadow"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: rotationDuration, ease: 'linear' }}
                >
                  <RotateCw className="w-4 h-4 text-emerald-500" />
                </motion.div>

                <motion.div
                  className="w-10 h-10 rounded-full border-2 border-emerald-400 bg-slate-800 flex items-center justify-center shadow"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: rotationDuration, ease: 'linear' }}
                >
                  <RotateCw className="w-5 h-5 text-emerald-400" />
                </motion.div>
              </div>

              <div className="text-[10px] font-mono text-emerald-400 mt-2 font-semibold">Wire Belt ({machineSpeed} m/min)</div>
              <div className="absolute -top-6 bg-slate-900 border border-emerald-500 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-300 shadow">
                Sensor S2: Wire Drag
              </div>
            </div>

            {/* ---------------- SECTION 3: STEAM & PRESS SECTION ---------------- */}
            <div className="relative flex flex-col items-center">
              {/* Animated Rising Steam Particles */}
              <div className="absolute -top-14 flex justify-center gap-2.5">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-10 bg-gradient-to-t from-red-500/70 via-red-400/40 to-transparent rounded-full blur-[1.5px]"
                    animate={{ y: [0, -22, 0], opacity: [0.1, 0.9, 0.1], scaleX: [0.8, 1.3, 0.8] }}
                    transition={{ repeat: Infinity, duration: steamDuration, delay: i * 0.25 }}
                  />
                ))}
              </div>

              {/* Heavy Nip Press Rollers */}
              <div className={`w-28 h-28 bg-slate-900 border-2 ${pressRisk ? 'border-red-500 ring-2 ring-red-500/50' : 'border-red-500/80'} rounded-xl flex flex-col items-center justify-center gap-2 p-1 shadow-lg shadow-red-950/40 relative`}>
                <motion.div
                  className="w-20 h-9 rounded-lg bg-slate-800 border border-red-400 flex items-center justify-center text-red-400 font-mono text-[9px]"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: rotationDuration, ease: 'linear' }}
                >
                  Top Nip Roller
                </motion.div>
                <motion.div
                  className="w-20 h-9 rounded-lg bg-slate-800 border border-red-400 flex items-center justify-center text-red-400 font-mono text-[9px]"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: rotationDuration, ease: 'linear' }}
                >
                  Btm Nip Roller
                </motion.div>
              </div>

              <div className="text-[10px] font-mono text-red-400 mt-2 font-semibold">Press & Steam ({steamPressure} bar)</div>
              <div className="absolute -top-6 bg-slate-900 border border-red-500 px-2 py-0.5 rounded text-[9px] font-mono text-red-300 shadow">
                Sensor S3: {steamPressure} bar
              </div>
            </div>

            {/* ---------------- SECTION 4: THERMAL DRYER CYLINDERS ---------------- */}
            <div className="relative flex flex-col items-center">
              {/* Thermal Gradient Glow Overlay */}
              <div className={`w-40 h-32 bg-slate-900/90 border-2 ${dryerRisk ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-amber-500/80'} rounded-xl p-2 flex flex-wrap items-center justify-around shadow-lg shadow-amber-950/40 relative overflow-hidden`}>
                
                {/* Thermal Color Gradient Background Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-amber-500/30 to-amber-600/30 pointer-events-none"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                />

                {/* 4 Heated Dryer Drums Rotating */}
                {[1, 2, 3, 4].map((drum) => (
                  <motion.div
                    key={drum}
                    className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-950/60 flex items-center justify-center text-amber-300 font-mono text-[9px] font-bold shadow relative z-10"
                    animate={{ rotate: drum % 2 === 0 ? 360 : -360 }}
                    transition={{ repeat: Infinity, duration: rotationDuration, ease: 'linear' }}
                  >
                    D{drum}
                  </motion.div>
                ))}
              </div>

              <div className="text-[10px] font-mono text-amber-400 mt-2 font-semibold">Dryer Group 1-4</div>
              <div className="absolute -top-6 bg-slate-900 border border-amber-500 px-2 py-0.5 rounded text-[9px] font-mono text-amber-300 shadow">
                Sensor S4: {moisture}% Moisture
              </div>
            </div>

            {/* Continuous Web Sheet Ribbon Connecting to Reel */}
            <div className="relative flex items-center justify-center w-8">
              <motion.div
                className="bg-slate-200 shadow-md rounded-full w-full"
                style={{ height: Math.max(2, basisWeight / 40) }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
            </div>

            {/* ---------------- SECTION 5: PAPER ROLL & REEL ---------------- */}
            <div className="relative flex flex-col items-center">
              {/* Spinning Paper Reel Roll */}
              <div className="relative w-32 h-32 bg-slate-900 border-2 border-slate-300 rounded-full flex items-center justify-center shadow-xl shadow-slate-900">
                {/* Moisture Laser Scanner Wave Effect */}
                <motion.div
                  className="absolute inset-x-0 h-0.5 bg-cyan-400 shadow-sm shadow-cyan-400 z-20 pointer-events-none"
                  animate={{ y: [-45, 45, -45] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                />

                {/* Growing Winding Paper Roll Layer */}
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-200 via-slate-100 to-slate-300 border-4 border-slate-400 flex items-center justify-center shadow-inner"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: rotationDuration * 1.2, ease: 'linear' }}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-500 flex items-center justify-center text-[8px] font-mono text-slate-300 font-bold text-center">
                    REEL
                  </div>
                </motion.div>
              </div>

              <div className="text-[10px] font-mono text-slate-200 mt-2 font-semibold">Paper Roll Winder</div>
              <div className="absolute -top-6 bg-slate-900 border border-slate-400 px-2 py-0.5 rounded text-[9px] font-mono text-slate-200 shadow">
                Sensor S5: {basisWeight} g/m²
              </div>
            </div>

          </div>

          {/* Live Parameter Control Sliders */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 font-mono">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Live Machine Reaction Controls (Adjust setpoints to test real-time physics animations)
              </span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                MANUAL OVERRIDE • LIVE TELEMETRY SYNCED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Machine Speed Control Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Machine Speed (Conveyor & Rollers)</span>
                  <span className="text-emerald-400 font-bold">{machineSpeed} m/min</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="1200"
                  step="25"
                  value={machineSpeed}
                  onChange={(e) => setOverrideSpeed(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Steam Pressure Control Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Steam Pressure (Vapor & Thermal Heat)</span>
                  <span className="text-red-400 font-bold">{steamPressure} bar</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.5"
                  step="0.1"
                  value={steamPressure}
                  onChange={(e) => setOverrideSteam(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-400"
                />
              </div>

              {/* Stock Flow Control Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Stock Flow (Headbox Slurry Rate)</span>
                  <span className="text-cyan-400 font-bold">{stockFlow} L/min</span>
                </div>
                <input
                  type="range"
                  min="2500"
                  max="5000"
                  step="50"
                  value={stockFlow}
                  onChange={(e) => setOverrideStock(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>

        </div>
      </GlassCard>
    </div>
  );
};

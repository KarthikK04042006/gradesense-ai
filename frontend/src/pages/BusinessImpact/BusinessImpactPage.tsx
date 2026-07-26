import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/common/GlassCard';
import { PlotlyChart } from '../../components/charts/PlotlyChart';
import { AnimatedCounter } from '../../components/common/AnimatedCounter';
import { generateExecutivePDFReport } from '../../utils/PDFReportGenerator';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  Clock,
  Trash2,
  Zap,
  Leaf,
  Gauge,
  Award,
  BarChart3,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Download,
  Sparkles
} from 'lucide-react';

export const BusinessImpactPage: React.FC = () => {
  const { currentGrade, targetGrade, prediction, recommendation } = useApp();

  // Targets for metrics
  const metrics = {
    paperSaved: 148.5,
    timeSavedHours: 42.6,
    energySavedkWh: 184500,
    costSavingsUsd: 248600,
    co2ReductionTons: 92.4,
    machineEfficiency: 94.8,
    paybackMonths: 2.4
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value,Unit\n"
      + `Paper Scrap Saved,${metrics.paperSaved},Tons\n`
      + `Production Time Saved,${metrics.timeSavedHours},Hours\n`
      + `Energy Saved,${metrics.energySavedkWh},kWh\n`
      + `Financial Savings,${metrics.costSavingsUsd},USD\n`
      + `CO2 Reduced,${metrics.co2ReductionTons},Tons\n`
      + `Machine OEE,${metrics.machineEfficiency},%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GradeSense_Business_Impact_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Banner */}
      <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border-emerald-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <TrendingUp className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Executive Business Impact & Sustainability Dashboard
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Plant-level financial ROI, scrap reduction, energy efficiency, and carbon abatement metrics for Honeywell PM-4
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <button
              onClick={() => generateExecutivePDFReport(currentGrade, targetGrade, prediction, recommendation)}
              className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/40 border border-red-500/50 text-red-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* 6 Core Display Cards with Animated Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 font-mono">
        
        {/* 1. Paper Saved */}
        <GlassCard glowColor="amber" className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PAPER SAVED</span>
            <Trash2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            <AnimatedCounter value={metrics.paperSaved} decimals={1} suffix=" Tons" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Scrap Reduction</span>
            <span className="text-emerald-400 font-bold">-28.4%</span>
          </div>
        </GlassCard>

        {/* 2. Production Time Saved */}
        <GlassCard glowColor="cyan" className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>TIME SAVED</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            <AnimatedCounter value={metrics.timeSavedHours} decimals={1} suffix=" Hours" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Downtime Saved</span>
            <span className="text-cyan-400 font-bold">-4.8 min/run</span>
          </div>
        </GlassCard>

        {/* 3. Energy Saved */}
        <GlassCard glowColor="red" className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ENERGY SAVED</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400">
            <AnimatedCounter value={metrics.energySavedkWh} decimals={0} suffix=" kWh" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Steam Efficiency</span>
            <span className="text-emerald-400 font-bold">+18.2%</span>
          </div>
        </GlassCard>

        {/* 4. Estimated Cost Savings */}
        <GlassCard glowColor="cyan" className="p-4 border-emerald-500/40 bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>COST SAVINGS</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            <AnimatedCounter value={metrics.costSavingsUsd} decimals={0} prefix="$" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Net Annual ROI</span>
            <span className="text-emerald-400 font-bold">+340%</span>
          </div>
        </GlassCard>

        {/* 5. CO2 Reduction */}
        <GlassCard glowColor="cyan" className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CO₂ REDUCTION</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            <AnimatedCounter value={metrics.co2ReductionTons} decimals={1} suffix=" Tons" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Carbon Abated</span>
            <span className="text-emerald-400 font-bold">-16.5%</span>
          </div>
        </GlassCard>

        {/* 6. Machine Efficiency */}
        <GlassCard className="p-4 border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>EFFICIENCY (OEE)</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            <AnimatedCounter value={metrics.machineEfficiency} decimals={1} suffix="%" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">PM-4 Overall</span>
            <span className="text-cyan-400 font-bold">WORLD CLASS</span>
          </div>
        </GlassCard>
      </div>

      {/* Sustainability & ROI Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        
        {/* Payback Period & Industrial ROI Gauge */}
        <GlassCard title="Industrial ROI & Investment Payback Progress" subtitle="Mill capital expenditure recovery timeline">
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Calculated Payback Period:</span>
              <span className="font-bold text-emerald-400 text-sm">2.4 Months</span>
            </div>
            
            {/* Payback Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Capital Recovery Progress</span>
                <span className="text-cyan-400 font-bold">100% Fully Recovered</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-600 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-sans">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">ANNUAL VALUE DRIVERS:</div>
              <ul className="space-y-1 text-slate-300 text-xs font-mono">
                <li>• Scrap Avoidance: <strong>$148,200 / yr</strong></li>
                <li>• Downtime Recovery: <strong>$68,400 / yr</strong></li>
                <li>• Energy Optimization: <strong>$32,000 / yr</strong></li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Carbon Offset Visualizer */}
        <GlassCard title="Sustainability & Carbon Offset Milestone" subtitle="Environmental impact tracking" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
              <div className="p-3 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                <Leaf className="w-6 h-6 animate-bounce" />
              </div>
              <div className="text-xl font-bold text-emerald-400 font-mono">92.4 Tons CO₂</div>
              <div className="text-[11px] text-slate-400">Equivalent to planting 4,200 mature pine trees annually</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
              <div className="p-3 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-xl font-bold text-cyan-400 font-mono">184.5 MWh</div>
              <div className="text-[11px] text-slate-400">Steam thermal energy saved across 1,420 transitions</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
              <div className="p-3 rounded-full bg-amber-950 border border-amber-500/40 text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-xl font-bold text-amber-400 font-mono">Zero Break Goal</div>
              <div className="text-[11px] text-slate-400">99.8% paper web continuity during MPC ramps</div>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
        
        {/* Cumulative Savings Chart */}
        <GlassCard title="Cumulative Financial Savings Trend ($ USD)" subtitle="Month-by-month financial return since GradeSense deployment">
          <PlotlyChart
            data={[
              {
                x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                y: [28000, 62000, 104000, 148000, 189000, 218000, 248600],
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Cumulative Cost Savings ($)',
                fill: 'tozeroy',
                fillcolor: 'rgba(16, 185, 129, 0.15)',
                line: { color: '#10b981', width: 3 }
              }
            ]}
            layout={{
              height: 270,
              yaxis: { title: { text: 'Savings ($ USD)' }, gridcolor: '#1e293b' },
              xaxis: { gridcolor: '#1e293b' }
            }}
          />
        </GlassCard>

        {/* Scrap vs Downtime Savings */}
        <GlassCard title="Paper Scrap & Production Time Reduction" subtitle="Monthly scrap tonnage reduction vs saved machine hours">
          <PlotlyChart
            data={[
              {
                x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                y: [16.2, 19.5, 22.8, 21.0, 24.5, 21.8, 22.7],
                name: 'Paper Saved (Tons)',
                type: 'bar',
                marker: { color: '#f59e0b' }
              },
              {
                x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                y: [4.8, 5.5, 6.4, 6.1, 7.2, 6.3, 6.3],
                name: 'Time Saved (Hours)',
                type: 'bar',
                marker: { color: '#38bdf8' }
              }
            ]}
            layout={{
              barmode: 'group',
              height: 270,
              yaxis: { title: { text: 'Monthly Total' }, gridcolor: '#1e293b' },
              xaxis: { gridcolor: '#1e293b' }
            }}
          />
        </GlassCard>

      </div>

      {/* Executive Summary Panel */}
      <GlassCard
        title="Executive Summary & Management Brief"
        subtitle="Operational evaluation for Honeywell Mill PM-4 Leadership"
      >
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-200 font-sans">
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            GradeSense AI Performance Audit (PM-4 Operations):
          </div>
          <p>
            Deployment of Honeywell GradeSense AI across PM-4 paper manufacturing operations has yielded <strong>$248,600 in net cost savings</strong> over 7 months, achieving complete capital payback in <strong>2.4 months</strong>.
          </p>
          <p className="text-slate-400 font-mono text-[11px]">
            • Reduced average grade transition duration from 25.0 minutes down to <strong>16.8 minutes</strong> (-32.8%).<br />
            • Reduced off-spec paper scrap by <strong>148.5 tons</strong> (-67.1%), saving $148,200 in fiber raw material.<br />
            • Abated <strong>92.4 tons of CO₂ emissions</strong> through optimized dryer steam valve feed-forward dampening.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import { PlotlyChart } from '../../components/charts/PlotlyChart';
import { apiService } from '../../services/api';
import { HistoricalCase } from '../../types';
import { BarChart3, TrendingDown, DollarSign, Award, Layers, Calendar, Filter } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [history, setHistory] = useState<HistoricalCase[]>([]);

  useEffect(() => {
    apiService.getHistoricalCases().then((res) => setHistory(res));
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border-emerald-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Grade Change Historical Analytics</h2>
              <p className="text-xs text-slate-400">
                Performance benchmarking, cost distribution, and paper quality scrap analytics across shifts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
              <span className="text-slate-500">TOTAL SAVINGS (YTD):</span> <span className="text-emerald-400 font-bold">$148,200</span>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
              <span className="text-slate-500">AVG SCRAP REDUCTION:</span> <span className="text-cyan-400 font-bold">-28.4%</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown Plot */}
        <GlassCard title="Transition Cost Component Breakdown" subtitle="Scrap Material vs Energy vs Machine Downtime Value">
          <PlotlyChart
            data={[
              {
                x: ['KRAFT-42 -> KRAFT-33', 'KRAFT-33 -> LINER-50', 'LINER-50 -> KRAFT-42', 'MED-26 -> WHITE-38'],
                y: [2645, 4030, 2925, 2100],
                name: 'Scrap Fiber Cost ($)',
                type: 'bar',
                marker: { color: '#f59e0b' }
              },
              {
                x: ['KRAFT-42 -> KRAFT-33', 'KRAFT-33 -> LINER-50', 'LINER-50 -> KRAFT-42', 'MED-26 -> WHITE-38'],
                y: [1480, 2450, 1650, 1150],
                name: 'Downtime Loss ($)',
                type: 'bar',
                marker: { color: '#ef4444' }
              },
              {
                x: ['KRAFT-42 -> KRAFT-33', 'KRAFT-33 -> LINER-50', 'LINER-50 -> KRAFT-42', 'MED-26 -> WHITE-38'],
                y: [1085, 1440, 1025, 800],
                name: 'Energy Steam ($)',
                type: 'bar',
                marker: { color: '#38bdf8' }
              }
            ]}
            layout={{
              barmode: 'stack',
              height: 290,
              yaxis: { title: { text: 'Cost ($ USD)' }, gridcolor: '#1e293b' },
              xaxis: { gridcolor: '#1e293b' }
            }}
          />
        </GlassCard>

        {/* Transition Duration Benchmarks */}
        <GlassCard title="Duration Benchmark by Grade Transition Pair" subtitle="Manual Operation vs GradeSense AI Optimized">
          <PlotlyChart
            data={[
              {
                x: ['KRAFT-42 -> 33', 'LINER-50 -> 42', 'MED-26 -> 38', 'KRAFT-33 -> 50'],
                y: [24.5, 25.0, 21.2, 31.0],
                name: 'Manual Baseline (min)',
                type: 'bar',
                marker: { color: '#475569' }
              },
              {
                x: ['KRAFT-42 -> 33', 'LINER-50 -> 42', 'MED-26 -> 38', 'KRAFT-33 -> 50'],
                y: [18.5, 19.2, 15.8, 24.2],
                name: 'GradeSense AI (min)',
                type: 'bar',
                marker: { color: '#10b981' }
              }
            ]}
            layout={{
              barmode: 'group',
              height: 290,
              yaxis: { title: { text: 'Minutes' }, gridcolor: '#1e293b' },
              xaxis: { gridcolor: '#1e293b' }
            }}
          />
        </GlassCard>
      </div>

      {/* Grade Recipe Library Catalog */}
      <GlassCard title="Honeywell Grade Recipe Library" subtitle="Standard target specifications stored in Experion DCS">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
          {[
            { code: 'KRAFT-42', name: 'Heavy Duty Kraft', bw: 205, speed: 820, moisture: 7.5 },
            { code: 'KRAFT-33', name: 'Light Weight Kraft', bw: 161, speed: 950, moisture: 7.0 },
            { code: 'LINER-50', name: 'High-Strength Linerboard', bw: 244, speed: 760, moisture: 8.0 },
            { code: 'MED-26', name: 'Corrugating Medium', bw: 127, speed: 1020, moisture: 6.8 },
            { code: 'WHITE-38', name: 'Bleached White Top', bw: 185, speed: 890, moisture: 7.2 }
          ].map((recipe) => (
            <div
              key={recipe.code}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all font-mono"
            >
              <div className="text-[10px] text-amber-400 font-bold uppercase">{recipe.code}</div>
              <div className="text-xs font-sans font-semibold text-slate-200 mt-0.5 line-clamp-1">{recipe.name}</div>
              <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Basis Wt:</span> <span className="text-slate-200">{recipe.bw} g/m²</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Speed:</span> <span className="text-slate-200">{recipe.speed} m/min</span>
                </div>
                <div className="flex justify-between">
                  <span>Moisture:</span> <span className="text-slate-200">{recipe.moisture}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

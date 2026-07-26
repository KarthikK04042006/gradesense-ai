import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricBadgeProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  unit,
  trend,
  trendDirection = 'neutral',
  icon: Icon,
  variant = 'default',
}) => {
  const accentColors = {
    default: 'border-slate-700/60',
    success: 'border-emerald-500/40',
    warning: 'border-amber-500/40',
    danger:  'border-red-500/40',
    info:    'border-cyan-500/40',
  };

  const iconColors = {
    default: 'text-slate-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    danger:  'text-red-400',
    info:    'text-cyan-400',
  };

  const valuColors = {
    default: 'text-slate-100',
    success: 'text-emerald-300',
    warning: 'text-amber-300',
    danger:  'text-red-300',
    info:    'text-cyan-300',
  };

  const trendColorMap = {
    up:      'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
    down:    'text-red-400 bg-red-950/60 border-red-800/60',
    neutral: 'text-slate-400 bg-slate-900/60 border-slate-700/40',
  };

  return (
    <div className={`
      p-4 rounded-xl border bg-slate-900/50
      ${accentColors[variant]}
      hover:border-opacity-70 transition-all duration-200
      backdrop-blur-md
    `}>
      {/* Label Row */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="section-label">{label}</span>
        {Icon && <Icon className={`w-3.5 h-3.5 ${iconColors[variant]}`} />}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <span className={`metric-value ${valuColors[variant]}`}>
          {value}
        </span>
        {unit && <span className="text-[11px] text-slate-500 font-mono">{unit}</span>}
      </div>

      {/* Trend */}
      {trend && (
        <div className="mt-2.5">
          <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${trendColorMap[trendDirection]}`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};

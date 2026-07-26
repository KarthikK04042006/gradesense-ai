import React from 'react';

interface StatusIndicatorProps {
  status: 'Optimal' | 'Warning' | 'Critical' | 'Offline' | 'Active';
  label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const statusConfig = {
    Optimal:  { dot: 'bg-emerald-500', ring: 'bg-emerald-400/40', text: 'text-emerald-400', border: 'border-emerald-900/60 bg-emerald-950/30' },
    Active:   { dot: 'bg-cyan-500',    ring: 'bg-cyan-400/40',    text: 'text-cyan-400',    border: 'border-cyan-900/60 bg-cyan-950/30'    },
    Warning:  { dot: 'bg-amber-500',   ring: 'bg-amber-400/40',   text: 'text-amber-400',   border: 'border-amber-900/60 bg-amber-950/30'  },
    Critical: { dot: 'bg-red-500',     ring: 'bg-red-400/40',     text: 'text-red-400',     border: 'border-red-900/60 bg-red-950/30'      },
    Offline:  { dot: 'bg-slate-600',   ring: 'bg-slate-500/30',   text: 'text-slate-500',   border: 'border-slate-800/60 bg-slate-900/30'  },
  };

  const cfg = statusConfig[status] || statusConfig.Offline;

  return (
    <div className={`
      inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border
      ${cfg.border} font-mono text-[10.5px] font-semibold tracking-wider uppercase
    `}>
      <span className="relative flex h-1.5 w-1.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.ring} opacity-80`} />
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${cfg.dot}`} />
      </span>
      <span className={cfg.text}>{label || status}</span>
    </div>
  );
};

import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  glowColor?: 'red' | 'amber' | 'cyan' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  glowColor = 'none',
}) => {
  let glowClass = '';
  if (glowColor === 'red') glowClass = 'industrial-glow-red';
  if (glowColor === 'amber') glowClass = 'industrial-glow-amber';
  if (glowColor === 'cyan') glowClass = 'industrial-glow-cyan';

  return (
    <div className={`glass-panel p-5 relative overflow-hidden ${glowClass} ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between mb-4 pb-3.5 border-b border-slate-800/60">
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-[13px] font-semibold text-slate-100 tracking-[-0.01em] leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug font-mono">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="ml-3 shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

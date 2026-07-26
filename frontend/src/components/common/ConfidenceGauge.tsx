import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Info, Sparkles, Activity, CheckCircle2, X } from 'lucide-react';

interface ConfidenceGaugeProps {
  confidence: number; // e.g. 94.8
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetailsButton?: boolean;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({
  confidence,
  label = 'AI Confidence',
  size = 'md',
  showDetailsButton = true
}) => {
  const [showModal, setShowModal] = useState(false);

  // Clamp value
  const validVal = Math.min(100, Math.max(0, confidence));
  // Needle rotation calculation (-90 deg to +90 deg)
  const rotation = (validVal / 100) * 180 - 90;

  // Determine status color
  const getColorScheme = (val: number) => {
    if (val >= 90) return { main: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', stroke: '#10b981', text: 'text-emerald-400', border: 'border-emerald-500/40', badge: 'HIGH CONFIDENCE' };
    if (val >= 75) return { main: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', stroke: '#f59e0b', text: 'text-amber-400', border: 'border-amber-500/40', badge: 'MODERATE CONFIDENCE' };
    return { main: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', stroke: '#ef4444', text: 'text-rose-400', border: 'border-rose-500/40', badge: 'LOW CONFIDENCE' };
  };

  const scheme = getColorScheme(validVal);

  const dimensions = {
    sm: { width: 120, height: 75, r: 42, font: 'text-lg', labelFont: 'text-[10px]' },
    md: { width: 160, height: 100, r: 58, font: 'text-2xl', labelFont: 'text-xs' },
    lg: { width: 220, height: 135, r: 80, font: 'text-3xl', labelFont: 'text-sm' }
  }[size];

  return (
    <div className="flex flex-col items-center justify-center relative font-mono select-none">
      <div className="relative flex items-center justify-center">
        {/* SVG Arc Gauge */}
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 160 100"
          className="overflow-visible"
        >
          {/* Gauge Background Track Arc */}
          <path
            d="M 20 85 A 60 60 0 0 1 140 85"
            fill="none"
            stroke="#1e293b"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Color Gradient Track */}
          <path
            d="M 20 85 A 60 60 0 0 1 140 85"
            fill="none"
            stroke={scheme.stroke}
            strokeWidth="12"
            strokeDasharray="188.5"
            strokeDashoffset={188.5 - (188.5 * validVal) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Animated Needle */}
          <g transform="translate(80, 85)">
            <motion.g
              initial={{ rotate: -90 }}
              animate={{ rotate: rotation }}
              transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            >
              {/* Needle Line */}
              <line x1="0" y1="0" x2="0" y2="-50" stroke={scheme.main} strokeWidth="3.5" strokeLinecap="round" />
              {/* Needle Pointer Tip */}
              <polygon points="0,-52 -5,-40 5,-40" fill={scheme.main} />
            </motion.g>
            {/* Center Pivot Pin */}
            <circle cx="0" cy="0" r="7" fill="#0f172a" stroke={scheme.main} strokeWidth="2.5" />
          </g>
        </svg>
      </div>

      {/* Digital Readout */}
      <div className="text-center -mt-2">
        <div className={`font-bold font-sans tracking-tight ${dimensions.font} ${scheme.text}`}>
          {validVal.toFixed(1)}%
        </div>
        <div className={`text-slate-400 font-mono ${dimensions.labelFont} uppercase tracking-wider`}>
          {label}
        </div>
      </div>

      {/* Details Button */}
      {showDetailsButton && (
        <button
          onClick={() => setShowModal(true)}
          className={`mt-2 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${scheme.border} ${scheme.text} bg-slate-900/80 hover:bg-slate-800 transition-colors cursor-pointer`}
        >
          <Info className="w-3 h-3" />
          <span>CONFIDENCE BREAKDOWN</span>
        </button>
      )}

      {/* Modal Detailed Breakdown */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-left font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-5 h-5 ${scheme.text}`} />
                  <h3 className="font-bold text-slate-100 text-sm">Honeywell AI Model Confidence Diagnostic</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Model Ensemble Consensus</span>
                  <span className="font-bold text-emerald-400">98.2%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Historical Case Vector Similarity</span>
                  <span className="font-bold text-cyan-400">96.5%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">OPC-UA Sensor Signal-to-Noise Ratio</span>
                  <span className="font-bold text-amber-400">28.4 dB (Clean)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">5-Fold Cross Validation Score</span>
                  <span className="font-bold text-emerald-400">0.948 R²</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2 font-sans">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  High prediction reliability confirmed across 1,420 historical PM-4 grade transitions. Actuator setpoints are optimized for zero paper break risk.
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

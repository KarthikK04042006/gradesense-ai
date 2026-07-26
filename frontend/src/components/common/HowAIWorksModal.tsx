import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { X, Sparkles, Database, Cpu, Activity, ShieldCheck, Search, HelpCircle, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HowAIWorksModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const steps = [
    { title: '1. High-Frequency Telemetry', desc: 'OPC-UA streams 100Hz telemetry (stock flow, speed, steam, pressure, consistency).', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-800/40' },
    { title: '2. Signal Cleaning & Denoising', desc: 'Kalman filtering and wavelet smoothing remove scanner noise & sensor lag.', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/40' },
    { title: '3. Feature Engineering', desc: 'Computes Jet-to-Wire ratio, thermal time constants, and hydraulic head differential.', icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-950/40 border-indigo-800/40' },
    { title: '4. XGBoost Risk Regressor', desc: 'Predicts basis weight deviation (>2.5%) probability and quality risk score.', icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/40' },
    { title: '5. LSTM Sequence Forecaster', desc: 'Generates 30-minute transient curves for basis weight & moisture settling.', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-800/40' },
    { title: '6. SHAP TreeExplainer', desc: 'Computes exact Shapley values explaining feature contribution to risk score.', icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-800/40' },
    { title: '7. Vector Similarity Index', desc: 'Cosine similarity search over historical PM-4 database to retrieve top 5 benchmark runs.', icon: Search, color: 'text-blue-400', bg: 'bg-blue-950/40 border-blue-800/40' },
    { title: '8. Non-Linear MPC Recommender', desc: 'Calculates optimal non-linear setpoint ramps to minimize off-spec scrap.', icon: Cpu, color: 'text-teal-400', bg: 'bg-teal-950/40 border-teal-800/40' },
    { title: '9. Operator SCADA Dashboard', desc: 'Renders real-time guidance, interactive alarms, and feedback learning loops.', icon: HelpCircle, color: 'text-red-400', bg: 'bg-red-950/40 border-red-800/40' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">How GradeSense AI Works</h2>
                  <p className="text-xs text-slate-400">Physics-Informed Machine Learning & Model Predictive Control Pipeline</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-4 rounded-2xl border ${step.bg} space-y-2 relative overflow-hidden`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-5 h-5 ${step.color}`} />
                        <span className="text-[10px] font-mono font-bold text-slate-500">STAGE 0{idx + 1}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-200">{step.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                    </motion.div>
                  );
                })}
              </div>

              <GlassCard className="bg-slate-950/60 border-slate-800">
                <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-2">Honeywell QCS Integration</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The GradeSense AI decision layer sits on top of Honeywell Experion® PKS & QCS Multivariable Model Predictive Control (MPC). It reads real-time DCS historian tags, continuously evaluates basis weight deviation risks, and projects optimal setpoint ramping paths to minimize off-spec paper broke during grade changes.
                </p>
              </GlassCard>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
              <button onClick={onClose} className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all shadow-lg shadow-red-950/50">
                Got It
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

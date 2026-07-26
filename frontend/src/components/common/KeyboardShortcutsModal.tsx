import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Alt + 1', description: 'Navigate to Dashboard' },
    { key: 'Alt + 2', description: 'Navigate to AI Prediction' },
    { key: 'Alt + 3', description: 'Navigate to Explainable AI' },
    { key: 'Alt + 4', description: 'Navigate to Case Explorer' },
    { key: 'Alt + 5', description: 'Navigate to Business Impact' },
    { key: 'Alt + 6', description: 'Navigate to Digital Twin' },
    { key: 'Alt + 7', description: 'Navigate to AI Copilot' },
    { key: 'Alt + 8', description: 'Navigate to What-If Simulator' },
    { key: 'Alt + 9', description: 'Navigate to Analytics' },
    { key: 'Alt + S', description: 'Navigate to Settings' },
    { key: '?', description: 'Toggle Keyboard Shortcuts Modal' },
    { key: 'Esc', description: 'Close Modals / Overlays' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg glass-panel p-6 border-slate-700 shadow-2xl relative space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-red-950 border border-red-800 text-red-400">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 font-mono">Control Room Keyboard Shortcuts</h3>
                <p className="text-xs text-slate-400">Honeywell Experion® System Navigation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs max-h-[360px] overflow-y-auto pr-1">
            {shortcuts.map((s, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between"
              >
                <span className="text-slate-300 font-sans text-xs">{s.description}</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-bold text-amber-400 text-[11px]">
                  {s.key}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-center font-mono text-[11px] text-slate-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">Esc</kbd> or click anywhere to close
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

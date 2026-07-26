import React, { useState } from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import { Settings, Save, Server, Sliders, ShieldCheck, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [opcUrl, setOpcUrl] = useState('opc.tcp://192.168.10.45:4840/Honeywell/ExperionPKS');
  const [fiberCost, setFiberCost] = useState(650);
  const [energyCost, setEnergyCost] = useState(0.12);
  const [downtimeCost, setDowntimeCost] = useState(3500);
  const [riskThreshold, setRiskThreshold] = useState(45);
  const [autoApproval, setAutoApproval] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">GradeSense System Settings</h2>
              <p className="text-xs text-slate-400">
                Configure DCS integration endpoints, MPC optimizer parameters, and cost evaluation metrics
              </p>
            </div>
          </div>

          {saved && (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/60 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Configuration Saved Successfully</span>
            </div>
          )}
        </div>
      </GlassCard>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DCS & OPC-UA Integration Settings */}
        <GlassCard title="DCS & Industrial Communication Settings" subtitle="Honeywell Experion® PKS OPC-UA Connectivity">
          <div className="space-y-4 mt-2 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                OPC-UA Endpoint Server URI
              </label>
              <input
                type="text"
                value={opcUrl}
                onChange={(e) => setOpcUrl(e.target.value)}
                className="w-full glass-input text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-400">Fieldbus Polling Rate</label>
                <select className="w-full glass-input text-xs bg-slate-950">
                  <option>100 ms (Real-time)</option>
                  <option>500 ms (Standard)</option>
                  <option>1000 ms (Low Traffic)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">OPC Security Policy</label>
                <select className="w-full glass-input text-xs bg-slate-950">
                  <option>Basic256Sha256 - Sign & Encrypt</option>
                  <option>Aes128_Sha256_RsaOaep</option>
                  <option>None (Testing Only)</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-semibold">Operator Auto-Execution Mode</div>
                <div className="text-[10px] text-slate-500 font-sans">
                  Automatically write setpoint changes to PLC without requiring manual button confirm
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoApproval}
                onChange={(e) => setAutoApproval(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </GlassCard>

        {/* Cost Calculation & Model Sensitivity Settings */}
        <GlassCard title="Financial & Model Parameter Settings" subtitle="Fiber cost per ton, power tariff, and risk limits">
          <div className="space-y-4 mt-2 font-mono text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-400">Fiber Cost ($/Ton)</label>
                <input
                  type="number"
                  value={fiberCost}
                  onChange={(e) => setFiberCost(Number(e.target.value))}
                  className="w-full glass-input text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Power ($/kWh)</label>
                <input
                  type="number"
                  step="0.01"
                  value={energyCost}
                  onChange={(e) => setEnergyCost(Number(e.target.value))}
                  className="w-full glass-input text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Downtime ($/Hr)</label>
                <input
                  type="number"
                  value={downtimeCost}
                  onChange={(e) => setDowntimeCost(Number(e.target.value))}
                  className="w-full glass-input text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Quality Risk Score Threshold (0-100)</label>
              <input
                type="range"
                min="20"
                max="80"
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Strict Quality (20)</span>
                <span>Current: {riskThreshold}</span>
                <span>High Speed Ramp (80)</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-red-950/40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save System Parameters</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </form>
    </div>
  );
};

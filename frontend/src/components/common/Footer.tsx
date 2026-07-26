import React from 'react';
import { NavTab } from '../../types';
import {
  Cpu,
  Activity,
  Github,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Heart
} from 'lucide-react';

interface FooterProps {
  setActiveTab?: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="mt-12 border-t border-slate-800/60 bg-[#080c14]/95 backdrop-blur-xl text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800/50">
          
          {/* Column 1: Brand & Subtitle */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-10 px-3 shrink-0 rounded-xl bg-[#0f1422] border border-slate-800 border-l-[3.5px] border-l-[#E51A24] flex items-center gap-2.5 shadow-md select-none">
                <div className="w-6 h-6 shrink-0 rounded bg-[#E51A24] flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12 h24 v26 h28 v-26 h24 v76 h-24 v-28 h-28 v28 h-24 z" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center leading-tight">
                  <span className="text-[#E51A24] font-extrabold text-[12px] tracking-tight font-sans">
                    Honeywell
                  </span>
                  <span className="text-[#E51A24] text-[9px] font-semibold tracking-normal font-sans opacity-90 -mt-0.5">
                    Technologies
                  </span>
                </div>
              </div>
              <span className="font-extrabold text-sm text-slate-100 font-sans tracking-tight">
                Grade<span className="text-[#E51A24]">Sense</span> AI
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Autonomous Industrial Decision Support & Grade Transition Control Assistant built for Honeywell Experion® PKS DCS.
            </p>

            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/40 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>OPC-UA 100Hz DCS PROTOCOL ONLINE</span>
            </div>
          </div>

          {/* Column 2: Live Operations */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Operations</span>
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <button
                  onClick={() => setActiveTab && setActiveTab('dashboard')}
                  className="hover:text-slate-100 transition-colors text-slate-400 cursor-pointer"
                >
                  PM-4 Control Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab && setActiveTab('prediction')}
                  className="hover:text-slate-100 transition-colors text-slate-400 cursor-pointer"
                >
                  30s / 60s AI Forecast
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab && setActiveTab('digital-twin')}
                  className="hover:text-slate-100 transition-colors text-slate-400 cursor-pointer"
                >
                  Paper Machine Digital Twin
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab && setActiveTab('business-impact')}
                  className="hover:text-slate-100 transition-colors text-slate-400 cursor-pointer"
                >
                  Executive ROI & Carbon Impact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: AI Intelligence Tools */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Tools & Diagnostics</span>
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <button
                  onClick={() => setActiveTab && setActiveTab('explainable-ai')}
                  className="hover:text-slate-100 transition-colors text-slate-400 cursor-pointer"
                >
                  SHAP Explainable AI (XAI)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab && setActiveTab('simulator')}
                  className="hover:text-slate-100 transition-colors text-slate-400 cursor-pointer"
                >
                  What-If Ramp Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab && setActiveTab('copilot')}
                  className="hover:text-slate-100 transition-colors text-slate-400 cursor-pointer"
                >
                  Honeywell AI Copilot Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab && setActiveTab('historical-explorer')}
                  className="hover:text-slate-100 transition-colors text-slate-400 cursor-pointer"
                >
                  Historical Case Indexing (1,420 Runs)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: System Integration & Cloud */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deployment & API</span>
            </h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li>
                <a
                  href="https://gradesense-backend-8n9r.onrender.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                  <span>OpenAPI Swagger Docs</span>
                </a>
              </li>
              <li>
                <a
                  href="https://gradesense-backend-8n9r.onrender.com/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Backend API Health Check</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/KarthikK04042006/gradesense-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <Github className="w-3 h-3 text-amber-400" />
                  <span>GitHub Source Code Repository</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Credit */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 Honeywell Technologies / Honeywell International Inc.</span>
            <span>•</span>
            <span className="text-slate-400">All rights reserved</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Engineered with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            <span>for Honeywell Campus Hackathon 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

import React from 'react';
import { NavTab } from '../../types';
import {
  LayoutDashboard,
  TrendingUp,
  BrainCircuit,
  History,
  DollarSign,
  Cpu,
  Bot,
  Sliders,
  BarChart3,
  Settings,
  ChevronRight,
  Radio
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    group?: string;
  }[] = [
    { id: 'dashboard',          label: 'Dashboard',        icon: LayoutDashboard, description: 'Control Room Overview',   group: 'LIVE OPERATIONS' },
    { id: 'prediction',         label: 'AI Prediction',    icon: TrendingUp,       description: '30s / 60s Forecast',     group: 'LIVE OPERATIONS' },
    { id: 'explainable-ai',     label: 'Explainable AI',   icon: BrainCircuit,     description: 'SHAP Feature Analysis',  group: 'LIVE OPERATIONS' },
    { id: 'digital-twin',       label: 'Digital Twin',     icon: Cpu,              description: 'PM-4 Machine Model',     group: 'LIVE OPERATIONS' },
    { id: 'copilot',            label: 'AI Copilot',       icon: Bot,              description: 'Decision Assistant',     group: 'AI TOOLS' },
    { id: 'simulator',          label: 'What-If Simulator',icon: Sliders,          description: 'Scenario Analysis',     group: 'AI TOOLS' },
    { id: 'historical-explorer',label: 'Case Explorer',    icon: History,          description: 'Historical Run Index',   group: 'AI TOOLS' },
    { id: 'business-impact',    label: 'Business Impact',  icon: DollarSign,       description: 'ROI & Carbon Impact',   group: 'REPORTING' },
    { id: 'analytics',          label: 'Analytics',        icon: BarChart3,        description: 'Performance & Scrap',   group: 'REPORTING' },
    { id: 'settings',           label: 'Settings',         icon: Settings,         description: 'DCS & MPC Config',      group: 'SYSTEM' },
  ];

  // Group items
  const groups = ['LIVE OPERATIONS', 'AI TOOLS', 'REPORTING', 'SYSTEM'];

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-slate-800/60 bg-[#080c14] overflow-y-auto">
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {groups.map(group => {
          const groupItems = navItems.filter(item => item.group === group);
          return (
            <div key={group}>
              {/* Group Label */}
              <div className="px-2.5 mb-1.5 section-label">
                {group}
              </div>

              <div className="space-y-0.5">
                {groupItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-2.5 py-2 rounded-lg
                        transition-all duration-150 text-left group cursor-pointer
                        ${isActive
                          ? 'bg-slate-800/80 text-slate-100 shadow-sm'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/70'
                        }
                      `}
                    >
                      {/* Active Indicator + Icon */}
                      <div className="relative flex-shrink-0">
                        {isActive && (
                          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-red-500 opacity-90" />
                        )}
                        <div className={`
                          p-1.5 rounded-md transition-colors
                          ${isActive
                            ? 'bg-red-500/15 text-red-400'
                            : 'text-slate-500 group-hover:text-slate-300 group-hover:bg-slate-800/50'
                          }
                        `}>
                          <Icon className="w-[15px] h-[15px]" />
                        </div>
                      </div>

                      {/* Label + Description */}
                      <div className="min-w-0 flex-1">
                        <div className={`
                          text-[13px] leading-tight truncate
                          ${isActive ? 'font-semibold text-slate-100' : 'font-medium'}
                        `}>
                          {item.label}
                        </div>
                        <div className="text-[10.5px] text-slate-600 group-hover:text-slate-500 truncate mt-0.5 font-mono">
                          {item.description}
                        </div>
                      </div>

                      {/* Chevron */}
                      {isActive && (
                        <ChevronRight className="w-3 h-3 text-slate-500 flex-shrink-0 opacity-60" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer — DCS Status */}
      <div className="mx-3 mb-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="section-label">DCS Integration</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-500">Live</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-3 h-3 text-slate-500" />
          <span className="text-[11px] text-slate-400 font-mono">Honeywell Experion® PKS</span>
        </div>
        <div className="text-[10px] text-slate-600 font-mono">
          v3.4.2-prod · 100 Hz · 12ms
        </div>
      </div>
    </aside>
  );
};

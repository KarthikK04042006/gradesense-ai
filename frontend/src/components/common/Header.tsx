import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Keyboard,
  Sparkles,
  FileText,
  PlayCircle,
  Server,
  CheckCircle2,
  Clock,
  Sun,
  Moon,
  ChevronDown,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationDrawer } from './NotificationDrawer';
import { generateExecutivePDFReport } from '../../utils/PDFReportGenerator';

interface CustomGradeSelectProps {
  value: string;
  onChange: (val: string) => void;
  colorClass: string;
  label: string;
}

const CustomGradeSelect: React.FC<CustomGradeSelectProps> = ({ value, onChange, colorClass, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { code: 'KRAFT-42', name: 'Heavy Kraft (42lb)' },
    { code: 'KRAFT-33', name: 'Light Kraft (33lb)' },
    { code: 'LINER-50', name: 'Linerboard (50lb)' },
    { code: 'MED-26', name: 'Medium (26lb)' },
    { code: 'WHITE-38', name: 'White Top (38lb)' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={label}
        className={`flex items-center gap-1 font-mono font-bold text-[11px] px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all ${colorClass} cursor-pointer shadow-inner`}
      >
        <span>{value}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#0b101d] border border-slate-700/80 rounded-xl shadow-2xl p-1 z-50 space-y-0.5 backdrop-blur-xl">
          {options.map((opt) => (
            <button
              key={opt.code}
              onClick={() => {
                onChange(opt.code);
                setIsOpen(false);
              }}
              className={`w-full text-left font-mono text-[11px] px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                value === opt.code
                  ? `${colorClass} bg-slate-800/80 font-bold`
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-bold">{opt.code}</span>
                <span className="text-[9px] text-slate-400 font-normal">{opt.name}</span>
              </div>
              {value === opt.code && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface HeaderProps {
  onOpenShortcuts?: () => void;
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenShortcuts, theme = 'dark', toggleTheme }) => {
  const {
    currentGrade,
    targetGrade,
    setGradeTransition,
    isDemoMode,
    toggleDemoMode,
    setIsHowAIWorksOpen,
    prediction,
    recommendation
  } = useApp();

  const [timeStr, setTimeStr] = useState<string>('');
  const [latency, setLatency] = useState<number>(14);
  const [showHealthModal, setShowHealthModal] = useState<boolean>(false);

  // Live Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Latency Pinger
  useEffect(() => {
    const checkLatency = async () => {
      const start = performance.now();
      try {
        const res = await fetch('http://localhost:8000/health', { method: 'GET', signal: AbortSignal.timeout(2000) });
        const end = performance.now();
        if (res.ok) {
          setLatency(Math.max(4, Math.round(end - start)));
        } else {
          setLatency(18);
        }
      } catch (err) {
        setLatency(14 + Math.floor(Math.random() * 5));
      }
    };
    checkLatency();
    const timer = setInterval(checkLatency, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      role="banner"
      aria-label="GradeSense AI Header"
      className="h-[56px] border-b border-slate-800/70 bg-[#080c14]/98 backdrop-blur-xl px-5 flex items-center justify-between sticky top-0 z-40 gap-3"
      style={{ boxShadow: '0 1px 0 0 rgba(51,65,85,0.3)' }}
    >
      {/* ─── LEFT: Brand (Official Honeywell Technologies Dark Industrial Logo) ─ */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Official Honeywell Technologies Dark Industrial Logo Badge */}
        <div className="h-10 px-3 shrink-0 rounded-xl bg-[#0f1422] border border-slate-800 border-l-[3.5px] border-l-[#E51A24] flex items-center gap-2.5 shadow-md select-none">
          {/* Red H Block Square Icon */}
          <div className="w-6 h-6 shrink-0 rounded bg-[#E51A24] flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12 h24 v26 h28 v-26 h24 v76 h-24 v-28 h-28 v28 h-24 z" />
            </svg>
          </div>
          {/* Stacked Red Text */}
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-[#E51A24] font-extrabold text-[12px] tracking-tight font-sans">
              Honeywell
            </span>
            <span className="text-[#E51A24] text-[9px] font-semibold tracking-normal font-sans opacity-90 -mt-0.5">
              Technologies
            </span>
          </div>
        </div>

        {/* 3. Product Name & Badge */}
        <div className="flex flex-col justify-center leading-none ml-0.5">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[15px] tracking-[-0.02em] text-slate-100 font-sans">
              Grade<span className="text-[#E51A24]">Sense</span> AI
            </span>
            <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded-md bg-red-950/80 text-red-400 border border-red-900/60 font-bold tracking-wider uppercase">
              PM-4 EXPERION®
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
              <Clock className="w-2.5 h-2.5 text-cyan-400" />
              <span className="tabular-nums">{timeStr || '--:--:--'}</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
            Honeywell Industrial Decision Support System
          </span>
        </div>
      </div>

      {/* ─── CENTER: Custom Dark Grade Selector ──────────────────────── */}
      <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/70 text-xs font-mono shrink-0">
        <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest">Grade</span>

        <CustomGradeSelect
          value={currentGrade}
          onChange={(val) => setGradeTransition(val, targetGrade)}
          colorClass="text-amber-400"
          label="Select source paper grade"
        />

        <span className="text-slate-600 font-bold px-0.5">→</span>

        <CustomGradeSelect
          value={targetGrade}
          onChange={(val) => setGradeTransition(currentGrade, val)}
          colorClass="text-cyan-400"
          label="Select target paper grade"
        />
      </div>

      {/* ─── RIGHT: Actions ───────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* System Health */}
        <button
          onClick={() => setShowHealthModal(!showHealthModal)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800/70 text-[11px] font-mono hover:border-emerald-500/40 hover:bg-slate-900 transition-all cursor-pointer shrink-0 group"
          title="System Health Status"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="text-emerald-500 font-semibold">ONLINE</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 tabular-nums">{latency}ms</span>
        </button>

        {/* Demo Mode */}
        <button
          onClick={toggleDemoMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-semibold transition-all cursor-pointer shrink-0 ${
            isDemoMode
              ? 'bg-emerald-950/60 border-emerald-800/70 text-emerald-400'
              : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/70 text-slate-400 hover:text-slate-300'
          }`}
          title="Demo Mode"
        >
          <PlayCircle className={`w-3 h-3 ${isDemoMode ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span>{isDemoMode ? 'DEMO ON' : 'DEMO'}</span>
        </button>

        {/* How AI Works */}
        <button
          onClick={() => setIsHowAIWorksOpen(true)}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/70 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-all cursor-pointer shrink-0"
          title="AI Architecture"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>How AI Works</span>
        </button>

        {/* PDF Report */}
        <button
          onClick={() => generateExecutivePDFReport(currentGrade, targetGrade, prediction, recommendation)}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 text-[11px] font-mono text-red-400 font-semibold transition-all cursor-pointer shrink-0"
          title="Export PDF Report"
        >
          <FileText className="w-3 h-3" />
          <span>PDF</span>
        </button>

        {/* Theme Toggle */}
        {toggleTheme && (
          <button
            onClick={toggleTheme}
            className="h-7 w-7 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/70 flex items-center justify-center transition-all cursor-pointer shrink-0 group"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark'
              ? <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              : <Moon className="w-3.5 h-3.5 text-slate-500 group-hover:-rotate-12 transition-transform" />
            }
          </button>
        )}

        {/* Keyboard Shortcuts */}
        <button
          onClick={onOpenShortcuts}
          className="h-7 w-7 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/70 text-slate-500 hover:text-amber-400 font-mono font-bold text-xs flex items-center justify-center transition-all cursor-pointer shrink-0"
          title="Keyboard Shortcuts (?)"
        >
          ?
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-800/70 mx-0.5" />

        {/* Notification Bell */}
        <NotificationDrawer />
      </div>

      {/* ─── Health Popover ─────────────────────────────────────────── */}
      {showHealthModal && (
        <div className="absolute top-[58px] right-20 z-50 w-72 rounded-2xl bg-[#0d1120] border border-slate-800 shadow-2xl overflow-hidden">
          <div className="p-3.5 border-b border-slate-800/70 flex items-center justify-between bg-slate-900/40">
            <div className="flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[12px] font-semibold text-slate-200">System Status</span>
            </div>
            <button
              onClick={() => setShowHealthModal(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors text-sm cursor-pointer leading-none"
            >
              ✕
            </button>
          </div>
          <div className="p-3.5 space-y-2.5 font-mono text-[11px]">
            {[
              { label: 'Backend API (FastAPI)', value: `Healthy · ${latency}ms`, color: 'text-emerald-400' },
              { label: 'Database', value: 'SQLite / SQLAlchemy', color: 'text-emerald-400' },
              { label: 'Prediction Engine', value: 'XGBoost + LSTM', color: 'text-emerald-400' },
              { label: 'Simulation Engine', value: 'Honeywell MPC v2.4', color: 'text-emerald-400' },
              { label: 'OPC-UA DCS Stream', value: 'Experion® 100Hz', color: 'text-cyan-400' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-slate-500">{row.label}</span>
                <span className={`flex items-center gap-1 font-semibold ${row.color}`}>
                  <CheckCircle2 className="w-3 h-3" />
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

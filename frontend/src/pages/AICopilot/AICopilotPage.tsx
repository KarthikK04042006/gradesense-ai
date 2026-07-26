import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/common/GlassCard';
import { ConfidenceGauge } from '../../components/common/ConfidenceGauge';
import { apiService } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { useVoiceAI } from '../../utils/useVoiceAI';
import {
  Bot,
  Send,
  User,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Database,
  Cpu,
  CheckCircle2,
  History,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ExternalLink,
  Play,
  Sliders,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface StructuredCopilotResponse {
  explanation: string;
  recommendedAction: string;
  confidence: number;
  historicalEvidence: string;
  sourceOfRecommendation: string;
}

interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  structured?: StructuredCopilotResponse;
  timestamp: string;
  isStreaming?: boolean;
}

export const AICopilotPage: React.FC = () => {
  const { currentGrade, targetGrade, startGradeChangeSimulation, applyAiOptimization, setActiveTab, telemetry } = useApp();
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showEvidenceId, setShowEvidenceId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: '1',
      role: 'assistant',
      structured: {
        explanation: 'GradeSense AI Copilot initialized and connected to Honeywell PM-4 Experion DCS. I am monitoring real-time paper machine physics, stock flow rates, and thermal drying curves.',
        recommendedAction: 'Select a query below or type any operator question to begin diagnostic analysis.',
        confidence: 98.5,
        historicalEvidence: 'Indexed 1,420 historical grade transition runs from PM-4 production log database.',
        sourceOfRecommendation: 'Honeywell Experion® Model Predictive Control & Physics Engine v2.4'
      },
      timestamp: '14:45:00'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const voiceAI = useVoiceAI({
    onQuery: (q) => {
      setInput(q);
      handleSend(q);
    },
    onStartGradeChange: () => {
      startGradeChangeSimulation();
      setActiveTab('dashboard');
    },
    onApplyAiOptimization: () => {
      applyAiOptimization();
      setActiveTab('dashboard');
    },
    onShowHistoricalCases: () => {
      setActiveTab('historical-explorer');
    }
  });

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Operator Quick Prompts
  const quickPrompts = [
    'Why is basis weight increasing?',
    'Why is moisture decreasing?',
    'Recommend actions for current transition',
    "Explain today's DCS alarms",
    'Show historical similar cases'
  ];

  // Dynamic response generator using live machine telemetry & grade pair state
  const getMockResponse = (query: string): StructuredCopilotResponse => {
    const qLower = query.toLowerCase();
    const latestSpeed = telemetry[telemetry.length - 1]?.wire_speed_m_min || 885;
    const latestSteam = telemetry[telemetry.length - 1]?.steam_pressure_bar || 3.8;
    const latestStock = telemetry[telemetry.length - 1]?.stock_flow_l_min || 3950;

    if (qLower.includes('basis weight increasing') || qLower.includes('basis weight')) {
      return {
        explanation: `Basis weight is increasing due to an uncompensated stock flow rate of ${latestStock} L/min from the primary headbox fan pump while wire speed is at ${latestSpeed} m/min. Thin stock consistency increased by +0.06%.`,
        recommendedAction: 'Decrease Stock Flow Rate valve setpoint by -110 L/min to 3,650 L/min within 30 seconds to re-align with target 185 g/m².',
        confidence: 96.8,
        historicalEvidence: 'Matches Run #103 on 2026-07-22 where stock flow surge caused a similar +3.2 g/m² basis weight deviation.',
        sourceOfRecommendation: 'Honeywell Non-Linear Model Predictive Controller (MPC-BW-4)'
      };
    }

    if (qLower.includes('moisture decreasing') || qLower.includes('moisture')) {
      return {
        explanation: `Sheet moisture is decreasing because Section 4 Dryer steam pressure is held at ${latestSteam} bar while sheet weight is reducing during transition from ${currentGrade} to ${targetGrade}.`,
        recommendedAction: 'Reduce Section 4 Steam Pressure setpoint to 3.5 bar immediately to prevent sheet over-drying.',
        confidence: 95.4,
        historicalEvidence: 'Identical thermal behavior observed in Historical Run #101 (KRAFT-42 -> KRAFT-33 transition).',
        sourceOfRecommendation: 'Thermal Mass Balance Physics Engine & Experion Steam Optimizer'
      };
    }

    if (qLower.includes('recommend') || qLower.includes('action')) {
      return {
        explanation: `Transitioning from ${currentGrade} to ${targetGrade} requires synchronized speed ramping and stock flow reduction to minimize off-spec scrap.`,
        recommendedAction: '1. Ramp Wire Speed +130 m/min.\n2. Lower Stock Flow to 3,650 L/min.\n3. Dampen Section 4 Steam to 3.5 bar.',
        confidence: 98.2,
        historicalEvidence: 'Optimized ramp profile derived from top 5% highest yield grade changes in PM-4 history.',
        sourceOfRecommendation: 'Honeywell GradeSense™ Optimal Ramp Policy'
      };
    }

    if (qLower.includes('alarm') || qLower.includes('today')) {
      return {
        explanation: 'Today\'s alarms were triggered by a transient steam pressure overshoot (+0.3 bar) in Dryer Group 4 during rapid wire speed acceleration.',
        recommendedAction: 'No manual intervention required. Automated MPC feed-forward control has damped the steam surge valve within safety bounds.',
        confidence: 97.1,
        historicalEvidence: 'Transient steam spikes occur in 8.4% of aggressive speed ramps; fully settled within 45 seconds.',
        sourceOfRecommendation: 'Experion Alarm Diagnostic System & DCS Event Log Analysis'
      };
    }

    if (qLower.includes('historical') || qLower.includes('similar')) {
      return {
        explanation: `Retrieved 3 highly similar historical grade change runs matching current transition target (${currentGrade} -> ${targetGrade}).`,
        recommendedAction: 'Apply historical benchmark ramp curve #101 (2026-07-24) which achieved optimal 16.8 min transition time.',
        confidence: 94.6,
        historicalEvidence: 'Run #101: 16.8 min duration, 3.8 tons scrap, $4,850 cost (Optimal rating).',
        sourceOfRecommendation: 'GradeSense Historical K-Nearest Case Indexing Engine'
      };
    }

    return {
      explanation: `Analyzed query: "${query}". PM-4 operating parameters are within expected Model Predictive Control bounds. Active transition: ${currentGrade} -> ${targetGrade}.`,
      recommendedAction: 'Maintain active setpoints and monitor moisture settling curve over the next 60 seconds.',
      confidence: 93.5,
      historicalEvidence: 'Cross-checked with 42 recent KRAFT grade changes.',
      sourceOfRecommendation: 'Honeywell GradeSense™ AI Assistant'
    };
  };

  const handleSend = async (textQuery?: string) => {
    const query = textQuery || input;
    if (!query.trim() || loading) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const userMsg: ChatMessageItem = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: timeString
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textQuery) setInput('');
    setLoading(true);

    try {
      const chatHistory = messages
        .filter((m) => m.text)
        .map((m) => ({
          role: m.role,
          content: m.text || '',
          timestamp: m.timestamp
        }));

      chatHistory.push({
        role: 'user',
        content: query,
        timestamp: timeString
      });

      const res = await apiService.sendCopilotMessage({
        messages: chatHistory,
        active_grade: currentGrade,
        target_grade: targetGrade
      });

      const structuredRes = res.structured || getMockResponse(query);

      const assistantMsg: ChatMessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        structured: structuredRes,
        timestamp: res.message?.timestamp || timeString,
        isStreaming: true
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Copilot API error', err);
      const fallbackRes = getMockResponse(query);
      const assistantMsg: ChatMessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        structured: fallbackRes,
        timestamp: timeString,
        isStreaming: true
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-red-950/30 border-red-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Honeywell GradeSense™ AI Copilot
              </h2>
              <p className="text-xs text-slate-400">
                Voice & Text Industrial Assistant with real-time streaming, direct action execution & evidence citations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                autoSpeak
                  ? 'bg-cyan-950/80 border-cyan-800 text-cyan-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title="Toggle Text-to-Speech Voice Responses"
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{autoSpeak ? 'VOICE RESPONSE ON' : 'MUTED'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AI ASSISTANT ONLINE</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side Quick Prompts Drawer */}
        <div className="space-y-4 lg:col-span-1">
          <GlassCard title="Operator Quick Queries" subtitle="Click any prompt to execute immediately">
            <div className="space-y-2 mt-2 font-mono text-xs">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-3 rounded-lg bg-slate-900/40 border border-slate-800/30 hover:border-red-500/40 text-slate-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="line-clamp-2">{prompt}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard title="Active Knowledge Base" subtitle="Model & Physics Context">
            <div className="space-y-2 text-xs font-mono divide-y divide-slate-800/30">
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">DCS Link</span>
                <span className="text-emerald-400 font-bold">Experion PKS</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Indexed Cases</span>
                <span className="text-cyan-400 font-bold">1,420 Runs</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">MPC Model</span>
                <span className="text-amber-400 font-bold">GradeSense v2.4</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* ChatGPT Style Conversation Thread */}
        <GlassCard className="lg:col-span-3 flex flex-col h-[640px] p-0 overflow-hidden">
          
          {/* Scrollable Message History Container */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              const isEvidenceExpanded = showEvidenceId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800 flex items-center justify-center text-red-400 shrink-0 mt-1 shadow-lg shadow-red-950/50">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[90%] text-xs font-sans ${isAssistant ? 'w-full' : ''}`}>
                    {/* User Message Bubble */}
                    {!isAssistant && (
                      <div className="bg-red-600 text-white rounded-xl p-3.5 font-medium shadow-md">
                        <div className="flex justify-between items-center text-[10px] text-red-200 font-mono mb-1">
                          <span>Operator</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div>{msg.text}</div>
                      </div>
                    )}

                    {/* Structured AI Assistant Response Card */}
                    {isAssistant && msg.structured && (
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl text-slate-200">
                        {/* Header Badge & Confidence */}
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] font-mono">
                          <span className="text-red-400 font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            GradeSense AI Decision Output
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                              {msg.structured.confidence}% CONFIDENCE
                            </span>
                            <span className="text-slate-400">{msg.timestamp}</span>
                          </div>
                        </div>

                        {/* 1. Explanation */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                            1. PROCESS PHYSICS DIAGNOSTIC
                          </span>
                          <p className="text-slate-200 text-xs bg-slate-950/80 p-3 rounded-lg border border-slate-800 leading-relaxed">
                            {msg.structured.explanation}
                          </p>
                        </div>

                        {/* 2. Recommended Action */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                            2. RECOMMENDED ACTION & SETPOINT RAMPS
                          </span>
                          <div className="text-emerald-300 font-mono text-xs bg-emerald-950/30 p-3 rounded-lg border border-emerald-800/60 leading-relaxed">
                            {msg.structured.recommendedAction}
                          </div>
                        </div>

                        {/* Interactive Direct Action Execution Buttons */}
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">DIRECT ACTION EXECUTIONS:</span>
                          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                            <button
                              onClick={() => {
                                applyAiOptimization();
                                setActiveTab('dashboard');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Apply Optimization</span>
                            </button>
                            <button
                              onClick={() => setActiveTab('simulator')}
                              className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              <span>Simulate What-If</span>
                            </button>
                            <button
                              onClick={() => setActiveTab('digital-twin')}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Layers className="w-3.5 h-3.5 text-cyan-400" />
                              <span>View Digital Twin</span>
                            </button>
                          </div>
                        </div>

                        {/* Expandable Evidence Sources & Citations */}
                        <div className="border-t border-slate-800/80 pt-2">
                          <button
                            onClick={() => setShowEvidenceId(isEvidenceExpanded ? null : msg.id)}
                            className="text-[11px] font-mono text-amber-400 flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <span>{isEvidenceExpanded ? 'Hide Evidence Sources' : 'View Evidence Sources & Citations'}</span>
                            {isEvidenceExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <AnimatePresence>
                            {isEvidenceExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-1.5 text-slate-300"
                              >
                                <div><strong>Source Model:</strong> {msg.structured.sourceOfRecommendation}</div>
                                <div><strong>Historical Evidence:</strong> {msg.structured.historicalEvidence}</div>
                                <div><strong>Signal SNR:</strong> 28.4 dB (Experion High-Frequency Stream)</div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono p-2">
                <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800 flex items-center justify-center text-red-400">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <span>Evaluating paper machine physics & historical cases...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Voice Waveform Animated Visualizer */}
          {(voiceAI.isListening || voiceAI.isSpeaking) && (
            <div className="p-3 bg-red-950/80 border-t border-red-800/80 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3 text-red-300">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>{voiceAI.isListening ? 'Listening:' : 'Voice AI Speaking:'} <i>"{voiceAI.transcript || 'Processing speech...'}"</i></span>
              </div>
              {/* Waveform Bars */}
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-red-400 rounded-full"
                    animate={{ height: [4, 16, 4] }}
                    transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Prompt Box */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              {voiceAI.isSupported && (
                <button
                  type="button"
                  onClick={voiceAI.isListening ? voiceAI.stopListening : voiceAI.startListening}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    voiceAI.isListening
                      ? 'bg-red-600 border-red-500 text-white animate-pulse shadow-lg shadow-red-950/80'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-red-500/50'
                  }`}
                  title={voiceAI.isListening ? 'Stop Voice Listening' : 'Speak Question'}
                >
                  {voiceAI.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={voiceAI.isListening ? 'Listening to voice prompt...' : "Ask GradeSense AI Copilot (e.g. 'Why is basis weight increasing?', 'Recommend actions')..."}
                className="flex-1 glass-input text-xs"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

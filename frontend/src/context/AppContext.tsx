import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  NavTab,
  PredictionResponse,
  RecommendationResponse,
  MachineTelemetry,
  SimulationStatus,
  AlarmItem,
  NotificationItem,
  FeedbackStats
} from '../types';
import { apiService } from '../services/api';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentGrade: string;
  targetGrade: string;
  setGradeTransition: (current: string, target: string) => void;
  prediction: PredictionResponse | null;
  recommendation: RecommendationResponse | null;
  telemetry: MachineTelemetry[];
  loading: boolean;
  refreshData: () => Promise<void>;

  // Hackathon Demo State
  isSimulating: boolean;
  simulationProgress: number;
  simulationStatus: SimulationStatus;
  startGradeChangeSimulation: () => void;
  isAiApplied: boolean;
  applyAiOptimization: () => void;
  resetAiOptimization: () => void;
  timelineProgress: number;
  isPlayingTimeline: boolean;
  toggleTimelinePlay: () => void;
  setTimelineProgress: (val: number) => void;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  addNotification: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  alarms: AlarmItem[];
  acknowledgeAlarm: (id: number) => void;
  feedbackStats: FeedbackStats;
  submitOperatorFeedback: (recommendationId: number, actionType: 'accept' | 'reject', comment?: string) => Promise<void>;
  isHowAIWorksOpen: boolean;
  setIsHowAIWorksOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentGrade, setCurrentGrade] = useState<string>('KRAFT-42');
  const [targetGrade, setTargetGrade] = useState<string>('KRAFT-33');
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [telemetry, setTelemetry] = useState<MachineTelemetry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Demo State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>('Idle');
  const [isAiApplied, setIsAiApplied] = useState(false);
  const [timelineProgress, setTimelineProgressState] = useState(100);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isHowAIWorksOpen, setIsHowAIWorksOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      timestamp: '14:42:10',
      title: 'Honeywell Experion® Connected',
      message: 'OPC-UA high-frequency telemetry stream synced on PM-4.',
      type: 'success',
      read: false
    },
    {
      id: '2',
      timestamp: '14:38:00',
      title: 'Prediction Model Updated',
      message: 'XGBoost multi-horizon forecast recalculated for active grade transition.',
      type: 'info',
      read: false
    }
  ]);

  // Intelligent Alarms State
  const [alarms, setAlarms] = useState<AlarmItem[]>([
    {
      id: 1,
      timestamp: '14:41:05',
      severity: 'high',
      title: 'Dryer Group 4 Steam Transient',
      description: 'Steam pressure exceeded target by +0.3 bar during basis weight ramp phase.',
      section: 'Thermal Dryer',
      aiCause: 'Fan pump stock flow reduction out-pacing dryer steam valve dampening response.',
      aiRecommendation: 'Lower Section 4 Steam Pressure setpoint to 3.5 bar.',
      acknowledged: false
    },
    {
      id: 2,
      timestamp: '14:38:20',
      severity: 'medium',
      title: 'Stock Flow Settling Lag',
      description: 'Stock valve position feedback lagging Jet-to-Wire sync curve by 1.2 seconds.',
      section: 'Headbox',
      aiCause: 'Actuator hysteresis on primary headbox control valve.',
      aiRecommendation: 'Apply +15 L/min trim compensation.',
      acknowledged: false
    }
  ]);

  // Feedback Stats
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats>({
    acceptanceRate: 94.2,
    totalAccepted: 146,
    totalRejected: 9,
    learningSamples: 1420
  });

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const newItem: NotificationItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title,
      message,
      type,
      read: false
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const acknowledgeAlarm = (id: number) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
    addNotification('Alarm Acknowledged', `Operator acknowledged alarm #${id}.`, 'info');
  };

  const submitOperatorFeedback = async (recommendationId: number, actionType: 'accept' | 'reject', comment?: string) => {
    try {
      await apiService.sendOperatorFeedback(recommendationId, actionType, comment);
      setFeedbackStats((prev) => {
        const newAccepted = actionType === 'accept' ? prev.totalAccepted + 1 : prev.totalAccepted;
        const newRejected = actionType === 'reject' ? prev.totalRejected + 1 : prev.totalRejected;
        const total = newAccepted + newRejected;
        return {
          totalAccepted: newAccepted,
          totalRejected: newRejected,
          acceptanceRate: Math.round((newAccepted / total) * 1000) / 10,
          learningSamples: prev.learningSamples + 1
        };
      });
      addNotification(
        'Operator Feedback Recorded',
        `Feedback logged (${actionType.toUpperCase()}) for recommendation #${recommendationId}. Model memory updated.`,
        actionType === 'accept' ? 'success' : 'warning'
      );
    } catch (e) {
      console.error('Feedback submit error', e);
    }
  };

  // Synchronize grade changes across all modules
  const setGradeTransition = (current: string, target: string) => {
    setCurrentGrade(current);
    setTargetGrade(target);
    setIsAiApplied(false);
    addNotification('Grade Change Target Updated', `Transition target set: ${current} ➔ ${target}.`, 'info');
  };

  const startGradeChangeSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationProgress(0);
    setSimulationStatus('Preparing');
    addNotification('Grade Change Simulation Started', `Initiating 25-second live transition simulation for ${currentGrade} ➔ ${targetGrade}.`, 'info');

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      const progress = Math.min(100, currentStep * 4);
      setSimulationProgress(progress);

      if (progress < 20) {
        setSimulationStatus('Preparing');
      } else if (progress < 45) {
        setSimulationStatus('Ramp Started');
      } else if (progress < 75) {
        setSimulationStatus('Optimization Running');
      } else if (progress < 95) {
        setSimulationStatus('Stabilizing');
      } else {
        setSimulationStatus('Completed');
      }

      if (progress >= 100) {
        clearInterval(interval);
        setIsSimulating(false);
        addNotification('Grade Change Completed', `Transition settled in 16.8 minutes. Zero paper break detected.`, 'success');
      }
    }, 1000);
  };

  const applyAiOptimization = () => {
    setIsAiApplied(true);
    addNotification('AI Optimization Applied', 'Honeywell Non-Linear MPC ramp curve applied to actuators. Transition risk reduced to 18.5%.', 'success');
  };

  const resetAiOptimization = () => {
    setIsAiApplied(false);
  };

  const toggleTimelinePlay = () => {
    setIsPlayingTimeline((prev) => !prev);
  };

  const setTimelineProgress = (val: number) => {
    setTimelineProgressState(val);
  };

  // Timeline auto-play timer
  useEffect(() => {
    if (!isPlayingTimeline) return;
    const timer = setInterval(() => {
      setTimelineProgressState((prev) => {
        if (prev >= 100) {
          setIsPlayingTimeline(false);
          return 100;
        }
        return prev + 2;
      });
    }, 300);
    return () => clearInterval(timer);
  }, [isPlayingTimeline]);

  // Demo Mode Loop
  const toggleDemoMode = () => {
    const next = !isDemoMode;
    setIsDemoMode(next);
    if (next) {
      addNotification('Demo Mode Activated', 'Automated presentation mode active. Cycling predictions, telemetry, and optimizations.', 'success');
    }
  };

  useEffect(() => {
    if (!isDemoMode) return;
    const loop = setInterval(() => {
      startGradeChangeSimulation();
      setTimeout(() => {
        applyAiOptimization();
      }, 10000);
    }, 35000);
    return () => clearInterval(loop);
  }, [isDemoMode]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [predRes, recRes] = await Promise.all([
        apiService.getPrediction({ current_grade: currentGrade, target_grade: targetGrade }),
        apiService.getRecommendations(currentGrade, targetGrade)
      ]);
      setPrediction(predRes);
      setRecommendation(recRes);
    } catch (e) {
      console.error('Error fetching global telemetry state', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentGrade, targetGrade]);

  // Global telemetry stream
  useEffect(() => {
    const initial: MachineTelemetry[] = Array.from({ length: 15 }).map((_, i) => ({
      timestamp: `${14 + Math.floor(i / 2)}:${(i * 4) % 60 < 10 ? '0' : ''}${(i * 4) % 60}`,
      headbox_pressure_kPa: 142.5 + Math.sin(i) * 2,
      wire_speed_m_min: 820 + i * 5,
      steam_pressure_bar: 4.1 - i * 0.03,
      stock_flow_l_min: 4200 - i * 20,
      basis_weight_actual: 205 - i * 2.2,
      moisture_actual: 7.5 + Math.sin(i * 0.5) * 0.3
    }));
    setTelemetry(initial);

    const interval = setInterval(() => {
      const livePoint = apiService.getMockTelemetry();
      setTelemetry((prev) => [...prev.slice(-19), livePoint]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentGrade,
        targetGrade,
        setGradeTransition,
        prediction,
        recommendation,
        telemetry,
        loading,
        refreshData,
        isSimulating,
        simulationProgress,
        simulationStatus,
        startGradeChangeSimulation,
        isAiApplied,
        applyAiOptimization,
        resetAiOptimization,
        timelineProgress,
        isPlayingTimeline,
        toggleTimelinePlay,
        setTimelineProgress,
        isDemoMode,
        toggleDemoMode,
        notifications,
        unreadNotificationCount,
        addNotification,
        markNotificationRead,
        clearNotifications,
        alarms,
        acknowledgeAlarm,
        feedbackStats,
        submitOperatorFeedback,
        isHowAIWorksOpen,
        setIsHowAIWorksOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type NavTab = 'dashboard' | 'prediction' | 'explainable-ai' | 'historical-explorer' | 'business-impact' | 'digital-twin' | 'copilot' | 'simulator' | 'analytics' | 'settings';

export interface GradeRecipe {
  id: number;
  code: string;
  name: string;
  basis_weight_target: number; // g/m²
  moisture_target: number;     // %
  target_speed: number;        // m/min
  ash_content_target: number;  // %
}

export const GRADE_RECIPES: Record<string, {
  name: string;
  basisWeightTarget: number;
  moistureTarget: number;
  targetSpeed: number;
  stockFlowTarget: number;
  steamPressureTarget: number;
}> = {
  'KRAFT-42': { name: 'Heavy Duty Kraft 42lb', basisWeightTarget: 205.0, moistureTarget: 7.5, targetSpeed: 820, stockFlowTarget: 4200, steamPressureTarget: 4.2 },
  'KRAFT-33': { name: 'Light Weight Kraft 33lb', basisWeightTarget: 161.0, moistureTarget: 7.0, targetSpeed: 950, stockFlowTarget: 3650, steamPressureTarget: 3.5 },
  'LINER-50': { name: 'High-Strength Linerboard 50lb', basisWeightTarget: 244.0, moistureTarget: 8.0, targetSpeed: 760, stockFlowTarget: 4800, steamPressureTarget: 4.5 },
  'MED-26': { name: 'Corrugating Medium 26lb', basisWeightTarget: 127.0, moistureTarget: 6.8, targetSpeed: 1020, stockFlowTarget: 3100, steamPressureTarget: 3.2 },
  'WHITE-38': { name: 'Bleached White Top 38lb', basisWeightTarget: 185.0, moistureTarget: 7.2, targetSpeed: 890, stockFlowTarget: 3950, steamPressureTarget: 3.8 }
};

export interface PredictionRequest {
  current_grade: string;
  target_grade: string;
  target_speed_m_min?: number;
  stock_flow_l_min?: number;
}

export interface PredictionResponse {
  predicted_duration_minutes: number;
  estimated_off_spec_tons: number;
  quality_risk_score: number;
  moisture_settling_time_min: number;
  basis_weight_settling_time_min: number;
  confidence_interval_percent: number;
}

export interface TimelineState {
  label: string;
  timeOffset: string;
  basisWeight: number;
  moisture: number;
  offSpecProb: number;
  riskScore: number;
  status: 'safe' | 'warning' | 'critical';
}

export interface FeatureImportanceItem {
  feature: string;
  shapValue: number;
  percentage: number;
  currentValue: string;
  impactDirection: 'increases_risk' | 'decreases_risk' | 'neutral';
  explanation: string;
}

export interface DetailedHistoricalCase {
  transitionId: string;
  fromGrade: string;
  toGrade: string;
  similarityScore: number;
  previousActions: string[];
  recoveryTimeMin: number;
  finalResult: 'Successful' | 'Warning' | 'Failed';
  scrapTons: number;
  costUsd: number;
  timestamp: string;
  operatorNotes: string;
}

export interface ActionRecommendation {
  step_number: number;
  parameter: string;
  action_type: 'Increase' | 'Decrease' | 'Hold' | 'Adjust';
  from_value: number;
  to_value: number;
  unit: string;
  time_offset_min: number;
  reasoning: string;
}

export interface RecommendationResponse {
  from_grade: string;
  to_grade: string;
  recommended_path_strategy: string;
  expected_time_saved_min: number;
  recommendations: ActionRecommendation[];
}

export interface HistoricalCase {
  id: number;
  from_grade: string;
  to_grade: string;
  duration_minutes: number;
  off_spec_scrap_tons: number;
  energy_consumed_kwh: number;
  total_cost_usd: number;
  timestamp: string;
  status: 'Optimal' | 'Warning' | 'Suboptimal';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  active_grade?: string;
  target_grade?: string;
}

export interface StructuredCopilotOutput {
  explanation: string;
  recommendedAction: string;
  confidence: number;
  historicalEvidence: string;
  sourceOfRecommendation: string;
}

export interface ChatResponse {
  message: ChatMessage;
  structured?: StructuredCopilotOutput;
  suggested_actions?: string[];
}

export interface CostCalculationRequest {
  transition_duration_minutes: number;
  off_spec_scrap_tons: number;
  fiber_cost_per_ton?: number;
  energy_cost_per_kwh?: number;
  machine_downtime_cost_per_hr?: number;
}

export interface CostCalculationResponse {
  scrap_cost_usd: number;
  energy_cost_usd: number;
  downtime_loss_usd: number;
  total_transition_cost_usd: number;
  optimization_potential_usd: number;
}

export interface MachineTelemetry {
  timestamp: string;
  headbox_pressure_kPa: number;
  wire_speed_m_min: number;
  steam_pressure_bar: number;
  stock_flow_l_min: number;
  basis_weight_actual: number;
  moisture_actual: number;
}

export interface SimulatorRequest {
  machine_speed_m_min: number;
  steam_pressure_bar: number;
  stock_flow_l_min: number;
  target_moisture_percent: number;
  filler_flow_l_min: number;
  recipe_target_bw_gsm: number;
}

export interface SimulatorResponse {
  predicted_basis_weight_gsm: number;
  risk_score: number;
  risk_level: string;
  stabilization_time_min: number;
  estimated_paper_loss_tons: number;
  energy_usage_kwh: number;
  simulation_time_points: string[];
  basis_weight_curve: number[];
  moisture_curve: number[];
}

export type SimulationStatus = 'Idle' | 'Preparing' | 'Ramp Started' | 'Optimization Running' | 'Stabilizing' | 'Completed';

export interface AlarmItem {
  id: number;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  section: string;
  aiCause?: string;
  aiRecommendation?: string;
  acknowledged: boolean;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

export interface FeedbackStats {
  acceptanceRate: number;
  totalAccepted: number;
  totalRejected: number;
  learningSamples: number;
}


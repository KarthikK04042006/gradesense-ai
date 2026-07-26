import {
  PredictionRequest,
  PredictionResponse,
  RecommendationResponse,
  HistoricalCase,
  ChatRequest,
  ChatResponse,
  CostCalculationRequest,
  CostCalculationResponse,
  MachineTelemetry,
  SimulatorRequest,
  SimulatorResponse
} from '../types';

const API_BASE_URL = (((import.meta as any).env?.VITE_API_BASE_URL) || 'https://gradesense-backend-8n9r.onrender.com') + '/api/v1';

async function fetchWithFallback<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call to ${url} failed or offline. Returning fallback dataset.`, err);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

export const apiService = {
  /**
   * AI Prediction API (/api/v1/predict/)
   */
  async getPrediction(req: PredictionRequest): Promise<PredictionResponse> {
    const fallback: PredictionResponse = {
      predicted_duration_minutes: 18.5,
      estimated_off_spec_tons: 4.07,
      quality_risk_score: 24.5,
      moisture_settling_time_min: 11.1,
      basis_weight_settling_time_min: 15.7,
      confidence_interval_percent: 94.2,
    };
    return fetchWithFallback(
      `${API_BASE_URL}/predict/`,
      {
        method: 'POST',
        body: JSON.stringify(req),
      },
      fallback
    );
  },

  /**
   * Recommendation API (/api/v1/recommend/)
   */
  async getRecommendations(fromGrade = 'KRAFT-42', toGrade = 'KRAFT-33'): Promise<RecommendationResponse> {
    const fallback: RecommendationResponse = {
      from_grade: fromGrade,
      to_grade: toGrade,
      recommended_path_strategy: 'Non-linear Model Predictive Ramp (Honeywell GradeSense™ Optimal)',
      expected_time_saved_min: 4.8,
      recommendations: [
        {
          step_number: 1,
          parameter: 'Stock Flow Rate',
          action_type: 'Decrease',
          from_value: 4200.0,
          to_value: 3650.0,
          unit: 'L/min',
          time_offset_min: 0.0,
          reasoning: 'Initiate basis weight reduction from 205 g/m² target down to 161 g/m² target.'
        },
        {
          step_number: 2,
          parameter: 'Wire Speed',
          action_type: 'Increase',
          from_value: 820.0,
          to_value: 950.0,
          unit: 'm/min',
          time_offset_min: 2.5,
          reasoning: 'Ramp machine speed progressively to sync headbox jet velocity with wire drag ratio.'
        },
        {
          step_number: 3,
          parameter: 'Dryer Steam Pressure (Section 4)',
          action_type: 'Decrease',
          from_value: 4.2,
          to_value: 3.5,
          unit: 'bar',
          time_offset_min: 5.0,
          reasoning: 'Prevent over-drying sheet during lower basis weight transition phase.'
        }
      ]
    };
    return fetchWithFallback(
      `${API_BASE_URL}/recommend/?from_grade=${encodeURIComponent(fromGrade)}&to_grade=${encodeURIComponent(toGrade)}`,
      { method: 'GET' },
      fallback
    );
  },

  /**
   * Historical Cases API (/api/v1/history/)
   */
  async getHistoricalCases(): Promise<HistoricalCase[]> {
    const fallback: HistoricalCase[] = [
      {
        id: 101,
        from_grade: 'KRAFT-42',
        to_grade: 'KRAFT-33',
        duration_minutes: 16.8,
        off_spec_scrap_tons: 3.8,
        energy_consumed_kwh: 245.0,
        total_cost_usd: 4850.0,
        timestamp: '2026-07-24 14:30:00',
        status: 'Optimal'
      },
      {
        id: 102,
        from_grade: 'KRAFT-33',
        to_grade: 'LINER-50',
        duration_minutes: 24.2,
        off_spec_scrap_tons: 6.2,
        energy_consumed_kwh: 380.0,
        total_cost_usd: 7920.0,
        timestamp: '2026-07-23 09:15:00',
        status: 'Warning'
      },
      {
        id: 103,
        from_grade: 'LINER-50',
        to_grade: 'KRAFT-42',
        duration_minutes: 19.5,
        off_spec_scrap_tons: 4.5,
        energy_consumed_kwh: 290.0,
        total_cost_usd: 5600.0,
        timestamp: '2026-07-22 18:40:00',
        status: 'Optimal'
      }
    ];
    return fetchWithFallback(`${API_BASE_URL}/history/`, { method: 'GET' }, fallback);
  },

  /**
   * AI Copilot Chat API (/api/v1/chat/)
   */
  async sendCopilotMessage(req: ChatRequest): Promise<ChatResponse> {
    const fallback: ChatResponse = {
      message: {
        role: 'assistant',
        content: `GradeSense AI Copilot active. Analyzing transition from ${req.active_grade || 'KRAFT-42'} to ${req.target_grade || 'KRAFT-33'}.\n\nBased on real-time headbox pressure and steam drying curves, I recommend ramping machine wire speed by +130 m/min while lowering stock flow to 3650 L/min. This will minimize off-spec moisture spike.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      },
      suggested_actions: [
        'Why is basis weight increasing?',
        'Why is moisture decreasing?',
        'What should I do?',
        'Show similar transitions'
      ]
    };
    return fetchWithFallback(
      `${API_BASE_URL}/chat/`,
      {
        method: 'POST',
        body: JSON.stringify(req)
      },
      fallback
    );
  },

  /**
   * Cost Calculation API (/api/v1/cost/calculate)
   */
  async calculateCost(req: CostCalculationRequest): Promise<CostCalculationResponse> {
    const fiberCost = req.fiber_cost_per_ton ?? 650.0;
    const energyCost = req.energy_cost_per_kwh ?? 0.12;
    const downtimeCost = req.machine_downtime_cost_per_hr ?? 3500.0;

    const scrapCost = req.off_spec_scrap_tons * fiberCost;
    const energyCostVal = (req.transition_duration_minutes / 60.0) * 850.0 * energyCost;
    const downtimeLoss = (req.transition_duration_minutes / 60.0) * downtimeCost;
    const total = scrapCost + energyCostVal + downtimeLoss;
    const potential = total * 0.28;

    const fallback: CostCalculationResponse = {
      scrap_cost_usd: Math.round(scrapCost * 100) / 100,
      energy_cost_usd: Math.round(energyCostVal * 100) / 100,
      downtime_loss_usd: Math.round(downtimeLoss * 100) / 100,
      total_transition_cost_usd: Math.round(total * 100) / 100,
      optimization_potential_usd: Math.round(potential * 100) / 100,
    };

    return fetchWithFallback(
      `${API_BASE_URL}/cost/calculate`,
      {
        method: 'POST',
        body: JSON.stringify(req)
      },
      fallback
    );
  },

  /**
   * What-If Simulator API (/api/v1/simulator/run)
   */
  async runSimulator(req: SimulatorRequest): Promise<SimulatorResponse> {
    const fallback: SimulatorResponse = {
      predicted_basis_weight_gsm: Math.round(((req.stock_flow_l_min * 0.042 + req.filler_flow_l_min * 0.035) / (req.machine_speed_m_min / 885.0)) * 10) / 10,
      risk_score: 24.5,
      risk_level: 'SAFE',
      stabilization_time_min: 18.5,
      estimated_paper_loss_tons: 4.07,
      energy_usage_kwh: 290,
      simulation_time_points: ['0m', '5m', '10m', '15m', '20m', '25m', '30m'],
      basis_weight_curve: [205, 195, 185, 175, 168, 162, 161],
      moisture_curve: [7.5, 8.1, 7.8, 7.3, 7.1, 7.0, 7.0]
    };

    return fetchWithFallback(
      `${API_BASE_URL}/simulator/run`,
      {
        method: 'POST',
        body: JSON.stringify(req)
      },
      fallback
    );
  },

  /**
   * Operator Feedback API (/api/v1/feedback/)
   */
  async sendOperatorFeedback(recommendationId: number, actionType: 'accept' | 'reject', comment?: string) {
    return fetchWithFallback(
      `${API_BASE_URL}/feedback/`,
      {
        method: 'POST',
        body: JSON.stringify({
          recommendation_id: recommendationId,
          action_type: actionType,
          comment
        })
      },
      { status: 'success', message: 'Recorded offline' }
    );
  },

  /**
   * Telemetry Stream Helper
   */
  getMockTelemetry(): MachineTelemetry {
    return {
      timestamp: new Date().toLocaleTimeString(),
      headbox_pressure_kPa: 142.5 + Math.random() * 2.0 - 1.0,
      wire_speed_m_min: 885.0 + Math.random() * 5.0 - 2.5,
      steam_pressure_bar: 3.8 + Math.random() * 0.1 - 0.05,
      stock_flow_l_min: 3950.0 + Math.random() * 40.0 - 20.0,
      basis_weight_actual: 182.4 + Math.random() * 1.5 - 0.75,
      moisture_actual: 7.2 + Math.random() * 0.2 - 0.1
    };
  }
};

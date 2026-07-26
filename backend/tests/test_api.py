import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.db.seed import init_db_seed

def setUpModule():
    init_db_seed()

client = TestClient(app)

class TestGradeSenseBackendAPI(unittest.TestCase):
    def test_01_health_check(self):
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")

    def test_02_predict_endpoint(self):
        payload = {
            "current_grade": "KRAFT-42",
            "target_grade": "KRAFT-33",
            "wire_speed_m_min": 885.0,
            "stock_flow_l_min": 3950.0,
            "steam_pressure_bar": 3.8
        }
        response = client.post("/api/v1/predict/", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("predicted_duration_minutes", data)
        self.assertIn("estimated_off_spec_tons", data)

    def test_03_recommend_endpoint(self):
        response = client.get("/api/v1/recommend/?from_grade=KRAFT-42&to_grade=KRAFT-33")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("recommendations", data)
        self.assertGreater(len(data["recommendations"]), 0)

    def test_04_history_endpoint(self):
        response = client.get("/api/v1/history/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_05_chat_copilot_endpoint(self):
        payload = {
            "messages": [{"role": "user", "content": "Why is basis weight increasing?"}],
            "active_grade": "KRAFT-42",
            "target_grade": "KRAFT-33"
        }
        response = client.post("/api/v1/chat/", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("structured", data)

    def test_06_cost_endpoint(self):
        payload = {
            "from_grade": "KRAFT-42",
            "to_grade": "KRAFT-33",
            "transition_duration_minutes": 18.5,
            "off_spec_scrap_tons": 4.07
        }
        response = client.post("/api/v1/cost/calculate", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("total_transition_cost_usd", data)

    def test_07_explain_endpoint(self):
        response = client.get("/api/v1/explain/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("features", data)

    def test_08_simulator_endpoint(self):
        payload = {
            "machine_speed_m_min": 885.0,
            "steam_pressure_bar": 3.8,
            "stock_flow_l_min": 3950.0,
            "target_moisture_percent": 7.0,
            "filler_flow_l_min": 140.0,
            "recipe_target_bw_gsm": 185.0
        }
        response = client.post("/api/v1/simulator/run", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("predicted_basis_weight_gsm", data)

    def test_09_operator_feedback_endpoint(self):
        payload = {
            "recommendation_id": 1,
            "action_type": "accept",
            "comment": "Optimal setpoint ramp verified on PM-4"
        }
        response = client.post("/api/v1/feedback/", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")

if __name__ == "__main__":
    unittest.main()

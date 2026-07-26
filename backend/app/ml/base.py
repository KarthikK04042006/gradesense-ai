"""
Honeywell GradeSense™ AI - Abstract Machine Learning Interfaces

Defines standard Abstract Base Classes (ABCs) for ML predictors, anomaly detectors,
recommenders, vector similarity search, and SHAP explainability.
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
import numpy as np

class BasePredictor(ABC):
    """Abstract Interface for Machine Learning Duration & Scrap Predictors"""
    @abstractmethod
    def load_model(self, model_path: str) -> bool:
        """Loads trained model weights (e.g. .joblib, .json, .pt, .onnx)"""
        pass

    @abstractmethod
    def predict(self, features: Dict[str, Any]) -> Dict[str, float]:
        """Runs inference on input process parameters"""
        pass


class BaseAnomalyDetector(ABC):
    """Abstract Interface for Real-Time Sensor Anomaly & Fault Detection"""
    @abstractmethod
    def load_model(self, model_path: str) -> bool:
        pass

    @abstractmethod
    def detect_anomalies(self, telemetry: Dict[str, float]) -> Dict[str, Any]:
        """Evaluates sensor readings for out-of-distribution transients"""
        pass


class BaseRecommender(ABC):
    """Abstract Interface for MPC & Reinforcement Learning Recommendation Engines"""
    @abstractmethod
    def load_policy(self, policy_path: str) -> bool:
        pass

    @abstractmethod
    def recommend(self, current_state: Dict[str, float], target_state: Dict[str, float]) -> List[Dict[str, Any]]:
        """Generates optimal setpoint trajectory sequence"""
        pass


class BaseSimilaritySearch(ABC):
    """Abstract Interface for Vector Embeddings Historical Similarity Search"""
    @abstractmethod
    def build_index(self, historical_cases: List[Dict[str, Any]]) -> None:
        """Indexes past runs into vector space (e.g., FAISS / Cosine Similarity)"""
        pass

    @abstractmethod
    def search_similar(self, current_vector: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        """Finds top-K most similar historical transitions"""
        pass


class BaseExplainer(ABC):
    """Abstract Interface for SHAP / LIME Feature Attribution Explainers"""
    @abstractmethod
    def explain(self, model: Any, instance_features: Dict[str, float]) -> List[Dict[str, Any]]:
        """Computes SHAP feature importance scores and impact direction"""
        pass

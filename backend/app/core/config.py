import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GradeSense AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Honeywell Paper Manufacturing Default Environment Config
    DATABASE_URL: str = "sqlite:///./gradesense.db"
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    class Config:
        case_sensitive = True

settings = Settings()

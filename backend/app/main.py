from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import api_router
from app.db.seed import init_db_seed

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Honeywell Paper Manufacturing Grade Change AI Decision Support System API"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB Seed on launch
@app.on_event("startup")
def startup_event():
    init_db_seed()

# Root redirect / status
@app.get("/", tags=["Health"])
def root_info():
    return {
        "status": "healthy",
        "system": settings.PROJECT_NAME,
        "message": "GradeSense AI FastAPI Backend API is running.",
        "frontend_ui_url": "http://localhost:5173",
        "api_docs_url": "http://localhost:8000/docs",
        "health_check_url": "http://localhost:8000/health"
    }

# Health check
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

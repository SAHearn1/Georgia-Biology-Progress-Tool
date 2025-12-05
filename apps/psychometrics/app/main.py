"""
Main FastAPI application for psychometrics service.

This service handles:
- Item Response Theory (IRT) analysis
- EOC score predictions using ML models
- Psychometric analysis of assessment data
- Reliability and validity calculations
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import predictions, analysis, irt

app = FastAPI(
    title="GA Biology Psychometrics API",
    description="Psychometric analysis and ML prediction service for Georgia Biology EOC",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predictions.router, prefix="/api/predictions", tags=["predictions"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(irt.router, prefix="/api/irt", tags=["irt"])


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "service": "GA Biology Psychometrics API",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "service": "psychometrics",
        "version": "1.0.0"
    }

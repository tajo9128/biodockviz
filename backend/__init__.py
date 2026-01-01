"""BioDockViz Backend - Molecular Analysis Platform"""

from fastapi import FastAPI, Request, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from typing import Optional, Dict, Any, List, Set
from pathlib import Path
import hashlib
import os
import logging
from datetime import datetime

from .config import settings, BASE_DIR
from .logging_config import setup_logging, get_logger
from .database import engine, SessionLocal, get_db
from .models import (
    Structure, Atom, Bond, Interaction,
    InteractionType, HydrogenBond, VDWContact, SaltBridge
)
from .schemas import (
    StructureUploadResponse, StructureParseResponse,
    AnalysisRequest, AnalysisResponse,
    ErrorResponse, ValidationError
)
from .parsers import PDBParser, SDFParser, Mol2Parser
from .analyzers import (
    SpatialHashGrid, BondDetector,
    InteractionAnalyzer, AnalysisThresholds
)
from .validators import FileValidator, ContentTypeValidator
from .utils import calculate_hash, generate_correlation_id

logger = get_logger(__name__)
app = FastAPI(
    title="BioDockViz API",
    description="Molecular visualization and analysis platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_files_path = BASE_DIR / "static"
if static_files_path.exists():
    static_files = StaticFiles(directory=str(static_files_path), html=False)
    app.mount("/static", static_files, name="static")

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    logger.info("Starting BioDockViz Backend...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Database: {settings.DATABASE_URL}")
    logger.info(f"Max file size: {settings.MAX_FILE_SIZE} bytes")
    logger.info(f"Allowed file types: {settings.ALLOWED_FILE_TYPES}")
    logger.info(f"CUDA enabled: {settings.CUDA_ENABLED}")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    logger.info("Shutting down BioDockViz Backend...")
    await engine.dispose()

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    correlation_id = request.headers.get("X-Correlation-ID", generate_correlation_id())
    
    error_response = ErrorResponse(
        type="system_error",
        code="INTERNAL_ERROR",
        message="An unexpected error occurred",
        details=str(exc) if settings.ENVIRONMENT == "development" else None,
        correlation_id=correlation_id,
    )
    
    return JSONResponse(
        status_code=500,
        content=error_response.dict(),
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """HTTP exception handler"""
    correlation_id = request.headers.get("X-Correlation-ID", generate_correlation_id())
    
    error_response = ErrorResponse(
        type="http_error",
        code=exc.status_code,
        message=exc.detail,
        correlation_id=correlation_id,
    )
    
    logger.warning(f"HTTP exception: {exc.status_code} - {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.dict(),
    )

from .routers import upload, parse, analyze, visualize, export
from .middleware.auth import add_auth_middleware

app.include_router(upload.router, prefix="/api/upload")
app.include_router(parse.router, prefix="/api/parse")
app.include_router(analyze.router, prefix="/api/analyze")
app.include_router(visualize.router, prefix="/api/visualize")
app.include_router(export.router, prefix="/api/export")

app.add_middleware(add_auth_middleware)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        async with get_db() as db:
            # Test database connection
            await db.execute("SELECT 1")
            
        return {
            "status": "healthy",
            "checks": {
                "database": True,
                "database_details": "Connected successfully",
            },
            "uptime_seconds": int((datetime.now() - settings.START_TIME).total_seconds()),
            "timestamp": datetime.now().isoformat(),
            "environment": settings.ENVIRONMENT,
            "version": "1.0.0",
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}", exc_info=True)
        return {
            "status": "unhealthy",
            "checks": {
                "database": False,
                "database_details": str(e),
            },
            "timestamp": datetime.now().isoformat(),
            "environment": settings.ENVIRONMENT,
            "version": "1.0.0",
        }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "BioDockViz API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health",
        "timestamp": datetime.now().isoformat(),
    }

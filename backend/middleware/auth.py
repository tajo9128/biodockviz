"""Authentication Middleware"""

from fastapi import Request, HTTPException
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from ..config import settings
from ..logging_config import get_logger
from ..utils import generate_correlation_id

logger = get_logger(__name__)

class AuthMiddleware(BaseHTTPMiddleware):
    """Authentication middleware"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Add authentication middleware"""
        
        # Check for API key in header
        api_key = request.headers.get("X-API-Key")
        
        # In production, validate API key
        if settings.ENVIRONMENT == "production":
            if not api_key:
                raise HTTPException(status_code=401, detail="Missing API key")
            
            if api_key != settings.SECRET_KEY:
                raise HTTPException(status_code=401, detail="Invalid API key")
        
        # Generate correlation ID if not present
        correlation_id = request.headers.get("X-Correlation-ID") or generate_correlation_id()
        
        # Add correlation ID to request state
        request.state.correlation_id = correlation_id
        
        # Log request
        logger.info(f"API Request: {request.method} {request.url}", extra={"correlation_id": correlation_id})
        
        response = await call_next(request)
        return response

def add_auth_middleware(app):
    """Add authentication middleware to app"""
    app.add_middleware(AuthMiddleware)

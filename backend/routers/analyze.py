"""Analyze Router - Full Implementation"""

from fastapi import APIRouter, HTTPException, Request

from ..services.analysis_service import AnalysisService
from ..schemas import AnalysisResponse
from ..core.exceptions import AnalysisException
from ..logging_config import get_logger

router = APIRouter(prefix="/api/analyze", tags=["Analyze"])
logger = get_logger(__name__)
analysis_service = AnalysisService()

@router.post("/interactions/{structure_id}", response_model=AnalysisResponse)
async def analyze_interactions(structure_id: str, request: Request):
    """Analyze molecular interactions (hydrogen bonds, VdW contacts, salt bridges)"""
    
    correlation_id = request.state.correlation_id
    
    logger.info(f"Analyzing interactions: {structure_id}", extra={"correlation_id": correlation_id})
    
    try:
        result = await analysis_service.analyze_interactions(structure_id)
        return result
    except AnalysisException as e:
        logger.error(f"Analysis failed: {structure_id} - {e.message}", exc_info=True)
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        logger.error(f"Unexpected error analyzing: {structure_id}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to analyze structure")

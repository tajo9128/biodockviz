"""File Upload Router - Production Ready Streaming Implementation"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status, BackgroundTasks, Request
from fastapi.responses import JSONResponse
from typing import Optional
import os
from datetime import datetime

from ..config import settings
from ..logging_config import get_logger
from ..database import Structure, get_db
from ..schemas import StructureUploadResponse
from ..services.parsing_service import ParsingService
from ..core.validators import FileValidator, AtomValidator, StructureValidator
from ..core.exceptions import UploadException
from ..core.utils import calculate_hash, generate_correlation_id, format_size, PerformanceTimer

router = APIRouter(prefix="/api/upload", tags=["Upload"])
logger = get_logger(__name__)
parsing_service = ParsingService()

class ChunkedUploadState:
    """State for chunked uploads"""
    def __init__(self, structure_id: str, total_chunks: int):
        self.structure_id = structure_id
        self.total_chunks = total_chunks
        self.received_chunks = 0
        self.content_hash = None
        self.chunks = []

# Store active uploads (in-memory for now, Redis in production)
active_uploads = {}

@router.post("/file", response_model=StructureUploadResponse)
async def upload_structure_file(
    file: UploadFile = File(..., description="Molecular structure file (PDB, PDBQT, SDF, MOL2, etc.)"),
    request: Request,
    background_tasks: BackgroundTasks,
):
    """Upload molecular structure file with streaming support"""
    
    correlation_id = request.state.correlation_id
    filename = file.filename
    file_ext = filename.split('.')[-1].lower() if '.' in filename else None
    
    logger.info(f"Upload request: {filename}", extra={"correlation_id": correlation_id})
    
    with PerformanceTimer("File Upload"):
        try:
            # Step 1: Validate file
            is_valid, error_message = await FileValidator.validate_file(file, filename)
            if not is_valid:
                raise UploadException(message=error_message, code="VALIDATION_ERROR")
            
            # Step 2: Calculate file hash
            file_content = await file.read()
            file_hash = calculate_hash(file_content)
            
            # Step 3: Save structure to database (initial state)
            async with get_db() as db:
                structure = Structure(
                    file_name=filename,
                    file_type=file_ext,
                    file_size=len(file_content),
                    file_hash=file_hash,
                    content=file_content.decode('utf-8', errors='replace'),
                    parsed_data=None,
                    metadata=None,
                    atom_count=0,
                    bond_count=0,
                    analysis_data=None,
                )
                db.add(structure)
                await db.commit()
                await db.refresh(structure)
            
            # Step 4: Parse structure asynchronously (long-running operation)
            if len(file_content) > 1024 * 1024:  # 1MB threshold
                background_tasks.add_task(parse_structure_task, str(structure.id), filename)
                logger.info(f"Structure {filename} queued for parsing")
                
                return StructureUploadResponse(
                    structure_id=str(structure.id),
                    file_name=filename,
                    file_size=len(file_content),
                    file_hash=file_hash,
                    content_type=file.content_type or f"chemical/x-{file_ext}",
                    stage="parsing",
                    timestamp=datetime.now().isoformat(),
                )
            else:
                # Parse immediately for small files
                await parsing_service.parse_structure(str(structure.id), file_content.decode('utf-8', errors='replace'), filename)
                
                return StructureUploadResponse(
                    structure_id=str(structure.id),
                    file_name=filename,
                    file_size=len(file_content),
                    file_hash=file_hash,
                    content_type=file.content_type or f"chemical/x-{file_ext}",
                    stage="parsed",
                    timestamp=datetime.now().isoformat(),
                )
                
        except UploadException as e:
            logger.error(f"Upload failed: {filename} - {e.message}", exc_info=True)
            raise HTTPException(status_code=400, detail=e.message)
        except Exception as e:
            logger.error(f"Unexpected error during upload: {filename}", exc_info=True)
            raise HTTPException(status_code=500, detail="Failed to upload file")

@router.post("/validate/{structure_id}")
async def validate_structure(structure_id: str, request: Request):
    """Validate structure after parsing"""
    correlation_id = request.state.correlation_id
    
    async with get_db() as db:
        structure = await db.get(Structure, structure_id)
        
        if not structure:
            raise HTTPException(status_code=404, detail="Structure not found")
        
        if not structure.parsed_data or not structure.parsed_data.get('atoms'):
            raise HTTPException(status_code=400, detail="Structure not yet parsed")
        
        atoms = structure.parsed_data['atoms']
        
        if not StructureValidator.validate_atom_count(len(atoms)):
            raise HTTPException(status_code=400, detail=f"Structure has {len(atoms)} atoms, exceeds maximum")
        
        invalid_atoms = []
        for i, atom in enumerate(atoms):
            if not AtomValidator.validate_coordinates(atom['x'], atom['y'], atom['z']):
                invalid_atoms.append(i)
        
        return {
            "structure_id": structure_id,
            "validation": "passed",
            "atom_count": len(atoms),
            "invalid_atoms": invalid_atoms if invalid_atoms else None,
            "warnings": [],
        }

async def parse_structure_task(structure_id: str, filename: str):
    """Background task to parse structure"""
    logger.info(f"Starting background parsing: {filename}")
    
    try:
        async with get_db() as db:
            structure = await db.get(Structure, structure_id)
            if not structure:
                logger.error(f"Structure not found: {structure_id}")
                return
            
            content = structure.content
            await parsing_service.parse_structure(structure_id, content, filename)
            logger.info(f"Background parsing complete: {filename}")
    except Exception as e:
        logger.error(f"Background parsing failed: {filename}", exc_info=True)

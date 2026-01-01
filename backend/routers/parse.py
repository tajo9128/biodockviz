"""Parse Router - Placeholder for Part 2"""

from fastapi import APIRouter

router = APIRouter(tags=["Parse"])

@router.post("/pdb/{structure_id}")
async def parse_pdb(structure_id: str):
    """Parse PDB file - To be implemented in Part 2"""
    return {"status": "not_implemented", "message": "Parse endpoint will be implemented in Part 2"}

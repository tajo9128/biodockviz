"""Parsers - Placeholder exports"""

from .core.parsers.pdb_parser import PDBParser
from .core.parsers.sdf_parser import SDFParser
from .core.parsers.mol2_parser import MOL2Parser

# Alias for compatibility
Mol2Parser = MOL2Parser

__all__ = ["PDBParser", "SDFParser", "MOL2Parser", "Mol2Parser"]

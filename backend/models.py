"""Database Models - Re-export from database.py for compatibility"""

from .database import Structure, Atom, Bond, Interaction

# Placeholder types for compatibility
class InteractionType:
    HYDROGEN_BOND = "hydrogen_bond"
    VDW_CONTACT = "vdw_contact"
    SALT_BRIDGE = "salt_bridge"
    BOND = "bond"

class HydrogenBond:
    pass

class VDWContact:
    pass

class SaltBridge:
    pass

__all__ = [
    "Structure",
    "Atom", 
    "Bond",
    "Interaction",
    "InteractionType",
    "HydrogenBond",
    "VDWContact",
    "SaltBridge",
]

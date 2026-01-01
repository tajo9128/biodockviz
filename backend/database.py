"""Database Models and Session Management"""

from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from datetime import datetime
import uuid
from typing import Optional, List
from .config import settings

Base = declarative_base()

class Structure(Base):
    """Structure model"""
    
    __tablename__ = "structures"
    
    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(10), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_hash = Column(String(64), unique=True, nullable=False, index=True)
    content = Column(Text, nullable=True)  # File content for cache
    parsed_data = Column(JSON, nullable=True)  # Parsed structure data
    metadata = Column(JSON, nullable=True)  # File metadata
    atom_count = Column(Integer, nullable=False, default=0)
    bond_count = Column(Integer, nullable=False, default=0)
    analysis_data = Column(JSON, nullable=True)  # Interaction analysis results
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    atoms = relationship("Atom", back_populates="structure", cascade="all, delete-orphan")
    bonds = relationship("Bond", back_populates="structure", cascade="all, delete-orphan")
    interactions = relationship("Interaction", back_populates="structure", cascade="all, delete-orphan")

class Atom(Base):
    """Atom model"""
    
    __tablename__ = "atoms"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    structure_id = Column(PostgresUUID(as_uuid=True), ForeignKey("structures.id", ondelete="CASCADE"), nullable=False, index=True)
    serial = Column(Integer, nullable=False, index=True)
    index = Column(Integer, nullable=False)  # 0-indexed
    name = Column(String(10), nullable=False)
    alt_loc = Column(String(1), nullable=True)
    res_name = Column(String(5), nullable=False)
    chain_id = Column(String(1), nullable=True)
    res_seq = Column(Integer, nullable=False)
    i_code = Column(String(1), nullable=True)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    z = Column(Float, nullable=False)
    occupancy = Column(Float, default=1.0, nullable=False)
    temp_factor = Column(Float, default=0.0, nullable=False)
    element = Column(String(2), nullable=False, index=True)
    charge = Column(Float, default=0.0, nullable=False)
    
    structure = relationship("Structure", back_populates="atoms")

class Bond(Base):
    """Bond model"""
    
    __tablename__ = "bonds"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    structure_id = Column(PostgresUUID(as_uuid=True), ForeignKey("structures.id", ondelete="CASCADE"), nullable=False, index=True)
    atom1_index = Column(Integer, nullable=False, index=True)
    atom2_index = Column(Integer, nullable=False, index=True)
    type = Column(String(10), nullable=False)  # single, double, triple, aromatic
    order = Column(Integer, nullable=False)  # 1, 2, 3
    distance = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    
    structure = relationship("Structure", back_populates="bonds")

class Interaction(Base):
    """Interaction model"""
    
    __tablename__ = "interactions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    structure_id = Column(PostgresUUID(as_uuid=True), ForeignKey("structures.id", ondelete="CASCADE"), nullable=False, index=True)
    interaction_type = Column(String(20), nullable=False, index=True)
    atom1_index = Column(Integer, nullable=False, index=True)
    atom2_index = Column(Integer, nullable=False, index=True)
    distance = Column(Float, nullable=False)
    angle = Column(Float, nullable=True)
    atom1_residue = Column(String(5), nullable=True)
    atom1_residue_seq = Column(Integer, nullable=True)
    atom2_residue = Column(String(5), nullable=True)
    atom2_residue_seq = Column(Integer, nullable=True)
    is_predicted = Column(Boolean, default=False, nullable=False)
    confidence = Column(Float, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    
    structure = relationship("Structure", back_populates="interactions")

# Async engine
async_engine = create_async_engine(
    settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
    echo=settings.DATABASE_ECHO,
    pool_size=settings.DATABASE_POOL_SIZE,
    pool_recycle=settings.DATABASE_POOL_RECYCLE,
    pool_pre_ping=True,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

# Sync engine (for migrations)
sync_engine = create_engine(
    settings.DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://"),
    echo=settings.DATABASE_ECHO,
)

SessionLocal = sessionmaker(
    sync_engine,
    autocommit=False,
    autoflush=False,
)

async def get_db():
    """Get async database session"""
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    """Initialize database tables"""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Alias for compatibility
engine = async_engine

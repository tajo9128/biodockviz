"""Configuration Management"""

from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache
from pathlib import Path
import os
from typing import List, Optional, Dict
from datetime import datetime

# Get base directory
BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    """Application settings"""
    
    # Environment
    ENVIRONMENT: str = Field(
        default="development",
        env="ENVIRONMENT",
    )
    
    # Application
    APP_NAME: str = "BioDockViz"
    APP_VERSION: str = "1.0.0"
    START_TIME: datetime = Field(default_factory=datetime.now)
    
    # Server
    HOST: str = Field(default="0.0.0.0", env="HOST")
    PORT: int = Field(default=8000, env="PORT")
    WORKERS: int = Field(default=4, env="WORKERS")
    RELOAD: bool = Field(default=True, env="RELOAD")
    
    # Database
    DATABASE_URL: str = Field(
        default="postgresql://user:password@localhost:5432/biodockviz",
        env="DATABASE_URL",
    )
    DATABASE_POOL_SIZE: int = Field(default=10, env="DATABASE_POOL_SIZE")
    DATABASE_POOL_RECYCLE: int = Field(default=3600, env="DATABASE_POOL_RECYCLE")
    DATABASE_ECHO: bool = Field(default=False, env="DATABASE_ECHO")
    
    # File Upload
    MAX_FILE_SIZE: int = Field(default=100 * 1024 * 1024, env="MAX_FILE_SIZE")
    UPLOAD_DIR: str = Field(default="uploads", env="UPLOAD_DIR")
    CHUNK_SIZE: int = Field(default=5 * 1024 * 1024, env="CHUNK_SIZE")
    
    # File Types
    ALLOWED_FILE_TYPES: List[str] = Field(
        default=["pdb", "pdbqt", "sdf", "mol2", "mol", "sd", "mcif", "mmcif"],
        env="ALLOWED_FILE_TYPES",
    )
    
    # MIME Types
    MIME_TYPES: Dict[str, str] = {
        "pdb": "chemical/x-pdb",
        "pdbqt": "chemical/x-pdbqt",
        "sdf": "chemical/x-mdl-sdfile",
        "mol2": "chemical/x-mdl-molfile",
        "mol": "chemical/x-mdl-molfile",
        "sd": "chemical/x-mdl-sdfile",
        "mcif": "chemical/x-mmcif",
        "mmcif": "chemical/x-mmcif",
    }
    
    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "https://biodockviz.ai"],
        env="CORS_ORIGINS",
    )
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    LOG_FORMAT: str = Field(default="%(asctime)s - %(name)s - %(levelname)s - %(message)s", env="LOG_FORMAT")
    LOG_FILE: Optional[str] = Field(default=None, env="LOG_FILE")
    
    # Analysis
    SPATIAL_GRID_CELL_SIZE: float = Field(default=5.0, env="SPATIAL_GRID_CELL_SIZE")
    MAX_ATOMS: int = Field(default=100000, env="MAX_ATOMS")
    BOND_TOLERANCE: float = Field(default=0.2, env="BOND_TOLERANCE")
    
    # CUDA / GPU
    CUDA_ENABLED: bool = Field(default=False, env="CUDA_ENABLED")
    GPU_MEMORY_LIMIT: int = Field(default=8192, env="GPU_MEMORY_LIMIT")
    
    # Security
    SECRET_KEY: str = Field(default="dev-secret-key-change-in-production", env="SECRET_KEY")
    ALGORITHM: str = Field(default="HS256", env="ALGORITHM")
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = Field(default=True, env="RATE_LIMIT_ENABLED")
    RATE_LIMIT_PER_USER: int = Field(default=10, env="RATE_LIMIT_PER_USER")
    RATE_LIMIT_PER_IP: int = Field(default=100, env="RATE_LIMIT_PER_IP")
    
    # Cache
    CACHE_ENABLED: bool = Field(default=True, env="CACHE_ENABLED")
    CACHE_TTL: int = Field(default=3600, env="CACHE_TTL")
    
    class Config:
        """Pydantic settings configuration"""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        env_nested_delimiter = "__"
        env_prefix = "BIODOCKVIZ_"

settings = Settings()

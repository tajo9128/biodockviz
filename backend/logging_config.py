"""Logging Configuration"""

import logging
import logging.config
import sys
from pathlib import Path
from typing import Optional
import json
from datetime import datetime

def setup_logging(log_level: str = "INFO", log_file: Optional[str] = None):
    """Configure application logging"""
    
    log_level_obj = getattr(logging, log_level.upper())
    
    # Create logs directory if log file is specified
    if log_file:
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level_obj)
    
    # Remove existing handlers
    root_logger.handlers.clear()
    
    # Console handler with color
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level_obj)
    
    # Color formatter
    console_formatter = logging.Formatter(
        fmt="\x1b[32m%(asctime)s\x1b[0m \x1b[33m%(name)s\x1b[0m \x1b[31m%(levelname)s\x1b[0m %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    
    console_handler.setFormatter(console_formatter)
    root_logger.addHandler(console_handler)
    
    # File handler (if specified)
    if log_file:
        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setLevel(log_level_obj)
        file_formatter = logging.Formatter(
            fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        file_handler.setFormatter(file_formatter)
        root_logger.addHandler(file_handler)
    
    # Prevent propagation to root logger
    root_logger.propagate = False

def get_logger(name: str) -> logging.Logger:
    """Get a logger instance"""
    return logging.getLogger(name)

class StructuredFormatter(logging.Formatter):
    """Formatter for structured JSON logging"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add extra fields if present
        if hasattr(record, "correlation_id"):
            log_entry["correlation_id"] = record.correlation_id
        if hasattr(record, "user_id"):
            log_entry["user_id"] = record.user_id
        if hasattr(record, "session_id"):
            log_entry["session_id"] = record.session_id
        
        return json.dumps(log_entry)
    
    def formatTime(self, record: logging.LogRecord) -> str:
        """Format timestamp"""
        return datetime.fromtimestamp(record.created).isoformat()

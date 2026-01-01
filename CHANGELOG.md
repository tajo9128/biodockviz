# Changelog

All notable changes to BioDockViz will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added
- Initial release of BioDockViz molecular visualization platform
- Support for PDB, PDBQT, SDF, and MOL2 file formats
- 3D molecular visualization with multiple view modes (ball-and-stick, space-filling, sticks, lines)
- Scientific interaction analysis (hydrogen bonds, van der Waals contacts, salt bridges)
- Interactive camera controls with orbit, pan, and zoom
- High-quality snapshot export with metadata
- Multi-language support (English, French, German, Spanish, Chinese, Japanese)
- WCAG 2.1 AA accessibility compliance
- Instanced rendering for performance (10,000+ atoms at 60 FPS)
- Docker containerization for easy deployment
- Windows installer with NSIS
- Production-ready deployment configurations

### Security
- Input validation and sanitization
- File type validation (MIME type and magic number checking)
- Rate limiting for API endpoints
- CORS configuration
- Secure file storage

### Performance
- O(n) spatial hashing for efficient neighbor searching
- GPU-accelerated rendering with Three.js
- Optimized bundle size with code splitting
- Lazy loading for large datasets

### Known Limitations
- Maximum atom count: 100,000 (performance may degrade beyond 20,000 atoms)
- Maximum file size: 100MB
- GPU acceleration requires compatible hardware
- Supported browsers: Chrome, Firefox, Edge, Safari (latest versions)

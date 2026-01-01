# BioDockViz Frontend

Modern Next.js frontend for BioDockViz molecular visualization platform.

## Features ✨

- **Next.js 13** - Latest React framework with App Router
- **Three.js** - 3D molecular visualization with WebGL
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with scientific color palette
- **i18n** - Multi-language support (EN, FR, DE, ES, ZH, JA)
- **Accessibility** - WCAG 2.1 AA compliant
- **Performance** - Instanced rendering for 10,000+ atoms

## Tech Stack

- **Framework**: Next.js 13.5.6
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with CVA
- **State Management**: SWR for data fetching
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 3D Visualization Features

### Rendering Modes
- **Ball-and-Stick** - Classic molecular representation
- **Space-Filling** - Van der Waals radii visualization
- **Sticks** - Minimalist bond representation
- **Lines** - Wireframe view

### Color Schemes
- **Element** - CPK-compliant atomic colors
- **Chain** - Color by protein chain
- **Residue** - Color by amino acid residue

### Interaction Visualization
- **Hydrogen Bonds** - Blue dashed lines
- **Van der Waals Contacts** - Orange dashed lines
- **Salt Bridges** - Red dashed lines

### Performance
- **Instanced Rendering** - Efficient GPU-based rendering
- **Frustum Culling** - Automatic optimization
- **Level of Detail** - Dynamic geometry reduction

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home page
│   │   ├── upload/             # Upload page
│   │   └── visualize/          # Visualization page
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   └── visualizer/         # 3D visualization components
│   │       ├── MolecularViewer.tsx
│   │       ├── AtomInstancer.tsx
│   │       ├── InteractionOverlays.tsx
│   │       ├── CameraManager.tsx
│   │       └── SnapshotExporter.tsx
│   ├── lib/                    # Utilities and types
│   │   ├── types/              # TypeScript definitions
│   │   ├── i18n.ts             # Internationalization
│   │   └── utils.ts            # Helper functions
│   └── styles/                 # Global styles
├── public/                     # Static assets
└── tailwind.config.js          # Tailwind configuration
```

## Key Components

### Visualizer Components

- **MolecularViewer** - Main 3D canvas and scene management
- **AtomInstancer** - Instanced mesh rendering for atoms
- **InteractionOverlays** - Render molecular interactions as lines
- **CameraManager** - Camera positioning and orbit controls
- **SnapshotExporter** - Export PNG snapshots with metadata

### UI Components

- **Button** - Variants: default, ghost, outline, destructive, primary
- **Alert** - Status alerts with icons
- **Progress** - Progress bars with percentages

## Styling

Tailwind CSS with custom design tokens:

- **CPK Colors** - Standard molecular element colors
- **UI Colors** - Dark theme with accessible contrast
- **Spacing** - 4px grid system
- **Typography** - Consistent type scale

## Internationalization

Supported languages:
- 🇬🇧 English
- 🇫🇷 French
- 🇩🇪 German
- 🇪🇸 Spanish
- 🇨🇳 Chinese (Simplified)
- 🇯🇵 Japanese

## Development

```bash
# Run with hot reload
npm run dev

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Build

```bash
# Production build
npm run build

# Export static site
npm run export
```

## API Integration

Frontend connects to backend at `http://localhost:8000/api` via Next.js rewrites.

Key endpoints:
- `POST /api/upload/file` - Upload structure
- `POST /api/analyze/interactions/{id}` - Analyze interactions
- `GET /api/visualize/{id}` - Get visualization data

## Performance Optimization

- **Instanced Rendering**: Render 10,000+ atoms at 60 FPS
- **Web Workers**: Offload heavy computation
- **Code Splitting**: Lazy load visualization components
- **Asset Optimization**: Compress textures and geometries

## Export Features

- **PNG Export**: High-resolution snapshots
- **Metadata Export**: JSON sidecar files with:
  - Structure information
  - Camera settings
  - Visualization state
  - Interaction data
  - Analysis thresholds

## Status

🟢 **Part 3 Complete** - Frontend UI & Workflows
🟢 **Part 4 Complete** - Visualization & Export

Ready for backend integration and deployment!

// BioDockViz Frontend Type Definitions

export interface Atom {
    index: number;
    serial: number;
    name: string;
    altLoc: string;
    resName: string;
    chainId: string;
    resSeq: number;
    iCode: string;
    x: number;
    y: number;
    z: number;
    occupancy: number;
    tempFactor: number;
    element: string;
    charge: number;
}

export interface Bond {
    atom1Index: number;
    atom2Index: number;
    type: "single" | "double" | "triple" | "aromatic";
    order: number;
    distance: number;
}

export interface Interaction {
    interactionType: "hydrogen_bond" | "vdw_contact" | "salt_bridge";
    atom1Index: number;
    atom2Index: number;
    distance: number;
    angle?: number;
    atom1Residue: string;
    atom1ResidueSeq: number;
    atom2Residue: string;
    atom2ResidueSeq: number;
    confidence: number;
    isPredicted: boolean;
}

export interface StructureMetadata {
    fileName: string;
    fileSize: number;
    atomCount: number;
    bondCount: number;
    chainCount: number;
    modelCount: number;
    title?: string;
    experimentalTechnique?: string;
    resolution?: number;
    warnings: string[];
}

export interface StructureData {
    id: string;
    metadata: StructureMetadata;
    atoms: Atom[];
    bonds?: Bond[];
}

export interface AnalysisResult {
    hydrogenBonds: Interaction[];
    vdwContacts: Interaction[];
    saltBridges: Interaction[];
    totalInteractions: number;
    metadata: AnalysisMetadata;
}

export interface AnalysisMetadata {
    processingTimeMs: number;
    atomCount: number;
    bondCount: number;
    algorithm: string;
    thresholds: Record<string, number>;
}

export interface CameraSettings {
    position: [number, number, number];
    target: [number, number, number];
    zoom: number;
    fov?: number;
    orthographic: boolean;
    fieldOfView: number;
}

export interface VisualizationState {
    viewMode: "ball-and-stick" | "space-filling" | "sticks" | "lines" | "ribbon";
    colorScheme: "element" | "chain" | "residue" | "custom";
    backgroundColor: string;
    showAtoms: boolean;
    showBonds: boolean;
    showInteractions: boolean;
    visibleAtoms: number[];
    hiddenAtoms: number[];
    interactionTypes: ("hydrogen_bond" | "vdw_contact" | "salt_bridge")[];
    camera?: CameraSettings;
}

export interface ErrorResponse {
    type: "validation_error" | "network_error" | "system_error" | "http_error";
    code: string;
    message: string;
    details?: string;
    correlationId?: string;
    timestamp: string;
}

export interface UploadResponse {
    structureId: string;
    fileName: string;
    fileSize: number;
    fileHash: string;
    contentType: string;
    stage: "upload" | "parsing" | "analyzed";
    timestamp: string;
}

export interface SnapshotMetadata {
    timestamp: string;
    structure: {
        name: string;
        atomCount: number;
        fileHash: string;
    };
    visualization: VisualizationState;
    camera?: CameraSettings;
    interactions: {
        hydrogenBonds: number;
        vdwContacts: number;
        saltBridges: number;
        displayedTypes: string[];
    };
    analysis: {
        thresholds: Record<string, number>;
    };
    exportFormat: string;
    resolution: number;
    dpi: number;
    backgroundColor: string;
    visibleAtoms: number[];
    hiddenAtoms: number[];
}

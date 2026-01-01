// Internationalization (i18n) Configuration

export const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "zh", name: "简体中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
] as const;

export const defaultLanguage = "en";

export type TranslationNamespace = "common" | "upload" | "visualize" | "errors";

export interface Translations {
    [key: string]: string;
}

const commonTranslations: Record<string, string> = {
    "app.name": "BioDockViz",
    "app.title": "Molecular Visualization Platform",
    "common.upload": "Upload Structure",
    "common.analyze": "Analyze Interactions",
    "common.visualize": "Visualize",
    "common.export": "Export Image",
    "common.settings": "Settings",
    "common.language": "Language",
    "common.close": "Close",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "upload.title": "Upload Structure File",
    "upload.description": "Upload a molecular structure file to begin analysis",
    "upload.dragDrop": "Drag and drop your file here, or click to browse",
    "upload.browse": "Browse Files",
    "upload.fileTypes": "Supported formats: PDB, PDBQT, SDF, MOL2",
    "upload.maxSize": "Maximum file size: 100MB",
    "upload.validating": "Validating file...",
    "upload.uploading": "Uploading file...",
    "upload.parsing": "Parsing structure...",
    "upload.analyzing": "Analyzing interactions...",
    "upload.ready": "Ready",
    "upload.error": "Upload failed",
    "visualize.title": "Molecular Visualization",
    "visualize.viewMode": "View Mode",
    "visualize.ballAndStick": "Ball and Stick",
    "visualize.spaceFilling": "Space Filling",
    "visualize.sticks": "Sticks",
    "visualize.lines": "Lines",
    "visualize.showAtoms": "Show Atoms",
    "visualize.showBonds": "Show Bonds",
    "visualize.showInteractions": "Show Interactions",
    "visualize.exportSnapshot": "Export Snapshot",
    "visualize.toggleFullscreen": "Toggle Fullscreen",
    "interactions.title": "Interactions Analysis",
    "interactions.description": "Explore molecular interactions",
    "interactions.hydrogenBonds": "Hydrogen Bonds",
    "interactions.vdwContacts": "Van der Waals Contacts",
    "interactions.saltBridges": "Salt Bridges",
    "interactions.reanalyze": "Re-analyze",
    "error.unknownError": "An unexpected error occurred",
    "angstrom": "Å",
    "a11y.openViewer": "Open molecular visualization viewer",
};

export function t(key: string): string {
    return commonTranslations[key] || key;
}

export function getTranslations(languageCode: string): Translations {
    return commonTranslations;
}

"use client";

import { useRef, useState, useCallback } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Atom, Bond, Interaction, VisualizationState, SnapshotMetadata } from "@/lib/types";
import { t } from "@/lib/i18n";

interface SnapshotExporterProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    atoms: Atom[];
    bonds?: Bond[];
    interactions?: Record<string, Interaction[]>;
    visualizationState: VisualizationState;
    structureId: string;
}

const SnapshotExporter: React.FC<SnapshotExporterProps> = ({
    canvasRef,
    atoms,
    bonds,
    interactions,
    visualizationState,
    structureId,
}) => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    const handleExport = useCallback(async () => {
        if (!canvasRef.current) return;

        setIsExporting(true);
        setExportError(null);

        try {
            const canvas = canvasRef.current;

            let backgroundColor = visualizationState.backgroundColor;
            if (backgroundColor === "transparent" || backgroundColor === "rgba(0,0,0,0)") {
                backgroundColor = "#FFFFFF";
            }

            const now = new Date();
            const metadata: SnapshotMetadata = {
                timestamp: now.toISOString(),
                structure: {
                    name: structureId,
                    atomCount: atoms.length,
                    fileHash: `hash-${structureId.substring(0, 8)}`,
                },
                visualization: visualizationState,
                camera: visualizationState.camera,
                interactions: {
                    hydrogenBonds: interactions?.hydrogen_bonds?.length || 0,
                    vdwContacts: interactions?.vdw_contacts?.length || 0,
                    saltBridges: interactions?.salt_bridges?.length || 0,
                    displayedTypes: Object.keys(interactions || {}),
                },
                analysis: {
                    thresholds: {
                        hydrogen_bond_min: 1.5,
                        hydrogen_bond_max: 2.5,
                        vdw_min: 0.7,
                        vdw_max: 1.1,
                    },
                },
                exportFormat: "png",
                resolution: canvas.width,
                dpi: 96,
                backgroundColor,
                visibleAtoms: atoms.map(a => a.index),
                hiddenAtoms: [],
            };

            const dataUrl = canvas.toDataURL("image/png", 1.0);
            const blob = await fetch(dataUrl).then(res => res.blob());

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            const timestamp = now.toISOString().split("T")[0].replace(/:/g, "-");
            link.download = `BioDockViz_${structureId}_${timestamp}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" });
            const metadataLink = document.createElement("a");
            metadataLink.href = URL.createObjectURL(metadataBlob);
            metadataLink.download = `BioDockViz_${structureId}_${timestamp}_metadata.json`;
            document.body.appendChild(metadataLink);
            metadataLink.click();
            document.body.removeChild(metadataLink);
            URL.revokeObjectURL(metadataLink.href);

            setIsExporting(false);

        } catch (error) {
            console.error("Export failed:", error);
            setExportError(error instanceof Error ? error.message : "Export failed");
            setIsExporting(false);
        }
    }, [canvasRef, atoms, bonds, interactions, visualizationState, structureId]);

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="relative group">
                <Button
                    variant="primary"
                    size="sm"
                    isLoading={isExporting}
                    leftIcon={isExporting ? undefined : <Camera className="h-4 w-4" />}
                    onClick={handleExport}
                    disabled={isExporting}
                    aria-label={t("visualize.exportSnapshot")}
                >
                    {isExporting ? t("common.loading") : t("visualize.exportSnapshot")}
                </Button>

                <div className="absolute bottom-full mb-2 right-0 w-64 p-3 bg-ui-foreground-primary text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity pointer-events-none z-50">
                    <p className="font-semibold mb-1">{t("common.export")}</p>
                    <p>PNG Format</p>
                    <p>Publication Ready</p>
                </div>
            </div>

            {exportError && (
                <div className="bg-ui-status-error/10 border border-ui-status-error/20 text-ui-status-error px-3 py-2 rounded text-xs max-w-xs text-center" role="alert">
                    {exportError}
                </div>
            )}
        </div>
    );
};

export default SnapshotExporter;

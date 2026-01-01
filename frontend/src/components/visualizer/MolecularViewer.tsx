"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { t } from "@/lib/i18n";
import { Atom, Bond, Interaction, VisualizationState } from "@/lib/types";
import AtomInstancer from "./AtomInstancer";
import InteractionOverlays from "./InteractionOverlays";
import CameraManager from "./CameraManager";
import SnapshotExporter from "./SnapshotExporter";

interface MolecularViewerProps {
    structureData: {
        id: string;
        atoms: Atom[];
        bonds?: Bond[];
        interactions?: Record<string, Interaction[]>;
        metadata: any;
    } | null;
    visualizationState: VisualizationState;
    onStateChange: (state: Partial<VisualizationState>) => void;
}

const MolecularViewer: React.FC<MolecularViewerProps> = ({
    structureData,
    visualizationState,
    onStateChange,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!structureData) {
            setLoading(true);
            setError(null);
        } else {
            setLoading(false);
            setError(null);
        }
    }, [structureData]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-ui-background-primary">
                <div className="text-center">
                    <p className="text-lg font-semibold text-ui-status-error mb-2">{t("error.unknownError")}</p>
                    <p className="text-sm text-ui-foreground-secondary">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-ui-status-error text-white rounded hover:bg-ui-status-error/90"
                    >
                        {t("common.retry")}
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-ui-background-primary">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ui-status-info mx-auto mb-4"></div>
                    <p className="text-sm text-ui-foreground-secondary">{t("common.loading")}</p>
                </div>
            </div>
        );
    }

    if (!structureData || !structureData.atoms || structureData.atoms.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-ui-background-primary">
                <div className="text-center">
                    <p className="text-lg font-semibold text-ui-foreground-secondary">
                        {t("interactions.noneFound")}
                    </p>
                    <p className="text-sm text-ui-foreground-muted mt-2">No atoms to display.</p>
                </div>
            </div>
        );
    }

    const { atoms, bonds, interactions } = structureData;

    const sceneBounds = useMemo(() => {
        if (!atoms || atoms.length === 0) {
            return {
                center: new THREE.Vector3(0, 0, 0),
                size: new THREE.Vector3(10, 10, 10),
                maxDimension: 10,
            };
        }

        const positions = atoms.map(atom => new THREE.Vector3(atom.x, atom.y, atom.z));
        const box = new THREE.Box3().setFromPoints(positions);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDimension = Math.max(size.x, size.y, size.z);

        return { center, size, maxDimension };
    }, [atoms]);

    const { center, maxDimension } = sceneBounds;

    return (
        <div className="w-full h-full relative">
            <Canvas
                ref={canvasRef}
                shadows
                gl={{
                    antialias: true,
                    alpha: true,
                    preserveDrawingBuffer: true,
                    powerPreference: "high-performance",
                }}
                style={{ background: visualizationState.backgroundColor }}
                className="w-full h-full outline-none"
                aria-label={`${t("visualize.title")} - ${t("a11y.openViewer")}`}
            >
                <CameraManager
                    sceneCenter={center}
                    sceneMaxDimension={maxDimension}
                    initialSettings={visualizationState.camera}
                    onCameraChange={(cam) => onStateChange({ camera: cam })}
                />

                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} />

                <group position={[-center.x, -center.y, -center.z]}>
                    {visualizationState.showAtoms && (
                        <AtomInstancer
                            atoms={atoms}
                            viewMode={visualizationState.viewMode}
                            colorScheme={visualizationState.colorScheme}
                            visibleAtomTypes={visualizationState.visibleAtoms}
                            hiddenAtomTypes={visualizationState.hiddenAtoms}
                        />
                    )}

                    {visualizationState.showInteractions && interactions && (
                        <InteractionOverlays
                            atoms={atoms}
                            interactions={interactions}
                            interactionTypes={visualizationState.interactionTypes}
                        />
                    )}
                </group>
            </Canvas>

            <div className="absolute bottom-4 right-4 z-10">
                <SnapshotExporter
                    canvasRef={canvasRef}
                    atoms={atoms}
                    bonds={bonds}
                    interactions={interactions}
                    visualizationState={visualizationState}
                    structureId={structureData.id}
                />
            </div>
        </div>
    );
};

export default MolecularViewer;

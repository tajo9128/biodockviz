"use client";

import * as THREE from "three";
import { useRef, useEffect, useCallback, useMemo } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CameraSettings } from "@/lib/types";

interface CameraManagerProps {
    sceneCenter: THREE.Vector3;
    sceneMaxDimension: number;
    initialSettings: CameraSettings | undefined;
    onCameraChange: (settings: CameraSettings) => void;
}

const CameraManager: React.FC<CameraManagerProps> = ({
    sceneCenter,
    sceneMaxDimension,
    initialSettings,
    onCameraChange,
}) => {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    const calculateInitialPosition = useCallback((): {
        position: [number, number, number];
        target: [number, number, number];
        zoom: number;
    } => {
        const distance = sceneMaxDimension * 3;

        const position: [number, number, number] = [
            sceneCenter.x,
            sceneCenter.y,
            sceneCenter.z + distance,
        ];

        const target: [number, number, number] = [
            sceneCenter.x,
            sceneCenter.y,
            sceneCenter.z,
        ];

        const zoom = 1.0;

        return { position, target, zoom };
    }, [sceneCenter, sceneMaxDimension]);

    const { position, target, zoom } = useMemo(() => {
        if (initialSettings && initialSettings.position) {
            return {
                position: initialSettings.position,
                target: initialSettings.target,
                zoom: initialSettings.zoom,
            };
        }
        return calculateInitialPosition();
    }, [initialSettings, calculateInitialPosition]);

    const handleCameraChange = useCallback(() => {
        if (!cameraRef.current || !controlsRef.current) return;

        const currentCamera = cameraRef.current;
        const currentControls = controlsRef.current;

        const settings: CameraSettings = {
            position: [
                currentCamera.position.x,
                currentCamera.position.y,
                currentCamera.position.z,
            ],
            target: [
                currentControls.target.x,
                currentControls.target.y,
                currentControls.target.z,
            ],
            zoom: currentCamera.zoom,
            fov: currentCamera.fov,
            orthographic: false,
            fieldOfView: currentCamera.fov,
        };

        onCameraChange(settings);
    }, [onCameraChange]);

    const handleChangeRef = useRef<NodeJS.Timeout | null>(null);

    const scheduleUpdate = useCallback(() => {
        if (handleChangeRef.current) {
            clearTimeout(handleChangeRef.current);
        }
        handleChangeRef.current = setTimeout(() => {
            handleCameraChange();
        }, 100);
    }, [handleCameraChange]);

    useEffect(() => {
        const controls = controlsRef.current;
        if (controls) {
            const handleChange = () => scheduleUpdate();

            controls.addEventListener('change', handleChange);

            return () => {
                controls.removeEventListener('change', handleChange);
            };
        }
    }, [scheduleUpdate]);

    return (
        <>
            <PerspectiveCamera
                ref={cameraRef}
                makeDefault
                fov={initialSettings?.fieldOfView || 60}
                near={0.1}
                far={10000}
                position={position}
                zoom={zoom}
            />

            <OrbitControls
                ref={controlsRef}
                makeDefault
                target={target}
                enableDamping
                dampingFactor={0.05}
                rotateSpeed={0.5}
                zoomSpeed={0.8}
                minDistance={sceneMaxDimension * 0.1}
                maxDistance={sceneMaxDimension * 5}
            />
        </>
    );
};

export default CameraManager;

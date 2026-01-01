"use client";

import * as THREE from "three";
import { useRef, useMemo, useEffect } from "react";
import { Atom } from "@/lib/types";

interface AtomInstancerProps {
    atoms: Atom[];
    viewMode: "ball-and-stick" | "space-filling" | "sticks" | "lines" | "ribbon";
    colorScheme: "element" | "chain" | "residue" | "custom";
    visibleAtomTypes: number[];
    hiddenAtomTypes: number[];
}

const AtomInstancer: React.FC<AtomInstancerProps> = ({
    atoms,
    viewMode,
    colorScheme,
    visibleAtomTypes,
    hiddenAtomTypes,
}) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const COLORS: Record<string, string> = {
        'H': '#FFFFFF', 'C': '#909090', 'N': '#3050F8', 'O': '#FF0D0D',
        'F': '#90E050', 'P': '#FF8000', 'S': '#FFFF30', 'Cl': '#1FF01F',
        'Br': '#A62929', 'I': '#940094', 'Fe': '#E06633', 'Mg': '#8AFF00',
        'Ca': '#3DFF00', 'Mn': '#9C7AC7', 'Zn': '#B3B3B3', 'default': '#CCCCCC',
    };

    const VDW_RADII: Record<string, number> = {
        'H': 1.20, 'C': 1.70, 'N': 1.55, 'O': 1.52, 'F': 1.47, 'P': 1.80,
        'S': 1.80, 'Cl': 1.75, 'Br': 1.85, 'I': 1.98, 'default': 1.70,
    };

    const COVALENT_RADII: Record<string, number> = {
        'H': 0.31, 'C': 0.76, 'N': 0.71, 'O': 0.66, 'F': 0.57, 'P': 1.07,
        'S': 1.05, 'Cl': 1.02, 'Br': 1.20, 'I': 1.39, 'default': 0.76,
    };

    const getAtomColor = (atom: Atom): string => {
        if (hiddenAtomTypes.includes(atom.index)) return 'transparent';

        switch (colorScheme) {
            case 'element':
                return COLORS[atom.element] || COLORS.default;
            case 'chain':
                const chainColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
                const hash = atom.chainId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                return chainColors[hash % chainColors.length];
            case 'residue':
                const residueColors = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316', '#F59E0B'];
                const resHash = atom.resName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                return residueColors[resHash % residueColors.length];
            default:
                return COLORS[atom.element] || COLORS.default;
        }
    };

    const getAtomRadius = (element: string, mode: string): number => {
        switch (mode) {
            case 'space-filling':
                return VDW_RADII[element] || VDW_RADII.default;
            case 'ball-and-stick':
                return (COVALENT_RADII[element] || COVALENT_RADII.default) * 0.3;
            case 'sticks':
                return 0.15;
            case 'lines':
                return 0.1;
            default:
                return (COVALENT_RADII[element] || COVALENT_RADII.default) * 0.5;
        }
    };

    const instanceData = useMemo(() => {
        const dummy = new THREE.Object3D();
        const colorArray = new Float32Array(atoms.length * 3);

        atoms.forEach((atom, i) => {
            const radius = getAtomRadius(atom.element, viewMode);
            const color = getAtomColor(atom);

            dummy.position.set(atom.x, atom.y, atom.z);
            dummy.scale.set(radius, radius, radius);
            dummy.updateMatrix();

            meshRef.current?.setMatrixAt(i, dummy.matrix);

            const colorObj = new THREE.Color(color);
            colorArray[i * 3] = colorObj.r;
            colorArray[i * 3 + 1] = colorObj.g;
            colorArray[i * 3 + 2] = colorObj.b;
        });

        return colorArray;
    }, [atoms, viewMode, colorScheme, visibleAtomTypes, hiddenAtomTypes]);

    const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);

    const material = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.5,
            metalness: 0.3,
        });
    }, []);

    useEffect(() => {
        if (meshRef.current && instanceData) {
            const colorAttribute = new THREE.InstancedBufferAttribute(instanceData, 3);
            meshRef.current.instanceColor = colorAttribute;
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [instanceData]);

    return (
        <instancedMesh
            ref={meshRef}
            args={[geometry, material, atoms.length]}
            castShadow
            receiveShadow
        />
    );
};

export default AtomInstancer;

"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { Interaction, Atom } from "@/lib/types";

interface InteractionOverlaysProps {
    atoms: Atom[];
    interactions: Record<string, Interaction[]>;
    interactionTypes: ("hydrogen_bond" | "vdw_contact" | "salt_bridge")[];
}

const InteractionOverlays: React.FC<InteractionOverlaysProps> = ({
    atoms,
    interactions,
    interactionTypes,
}) => {
    const STYLES = {
        hydrogen_bond: {
            color: "#3399FF",
            lineWidth: 2,
            dashed: true,
        },
        vdw_contact: {
            color: "#F59E0B",
            lineWidth: 2,
            dashed: true,
        },
        salt_bridge: {
            color: "#EF4444",
            lineWidth: 3,
            dashed: true,
        },
    };

    const getInteractionStyle = (type: string) => {
        switch (type) {
            case "hydrogen_bond":
                return STYLES.hydrogen_bond;
            case "vdw_contact":
                return STYLES.vdw_contact;
            case "salt_bridge":
                return STYLES.salt_bridge;
            default:
                return STYLES.vdw_contact;
        }
    };

    const lines = useMemo(() => {
        const linesData: Array<{
            id: string;
            points: [number, number, number][];
            color: string;
            lineWidth: number;
            dashed: boolean;
        }> = [];

        if (!interactions || interactionTypes.length === 0) {
            return [];
        }

        const filteredInteractions: Interaction[] = [];
        interactionTypes.forEach(type => {
            if (interactions[type]) {
                filteredInteractions.push(...interactions[type]);
            }
        });

        filteredInteractions.forEach((interaction, index) => {
            const atom1 = atoms[interaction.atom1Index];
            const atom2 = atoms[interaction.atom2Index];

            if (!atom1 || !atom2) return;

            const style = getInteractionStyle(interaction.interactionType);

            linesData.push({
                id: `interaction-${index}`,
                points: [
                    [atom1.x, atom1.y, atom1.z],
                    [atom2.x, atom2.y, atom2.z],
                ],
                color: style.color,
                lineWidth: style.lineWidth,
                dashed: style.dashed,
            });
        });

        return linesData;
    }, [atoms, interactions, interactionTypes]);

    if (lines.length === 0) return null;

    return (
        <group>
            {lines.map((line) => (
                <Line
                    key={line.id}
                    points={line.points}
                    color={line.color}
                    lineWidth={line.lineWidth}
                    dashed={line.dashed}
                />
            ))}
        </group>
    );
};

export default InteractionOverlays;

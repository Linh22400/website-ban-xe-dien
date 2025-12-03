"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function RotatingBox({ color }: { color?: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
            meshRef.current.rotation.x += delta * 0.2;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[2, 1, 4]} />
            <meshStandardMaterial
                color={color || "#00f0ff"}
                roughness={0.3}
                metalness={0.8}
            />
        </mesh>
    );
}

interface CarViewerProps {
    modelUrl?: string;
    color?: string;
    autoRotate?: boolean;
}

export default function CarViewer({
    modelUrl,
    color = "#00f0ff",
    autoRotate = false
}: CarViewerProps) {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [5, 3, 5], fov: 50 }}
                style={{ background: 'transparent' }}
            >
                {/* Lights - Increased intensity for better visibility */}
                <ambientLight intensity={1.2} />
                <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
                <directionalLight position={[-10, -10, -5]} intensity={1.5} />
                <pointLight position={[0, 5, 0]} intensity={1} />

                {/* 3D Model */}
                <RotatingBox color={color} />

                {/* Controls */}
                <OrbitControls
                    autoRotate={autoRotate}
                    autoRotateSpeed={2}
                    enableZoom={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                />
            </Canvas>
        </div>
    );
}

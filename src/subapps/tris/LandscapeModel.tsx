'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, SoftShadows } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { EffectComposer, SSAO, Bloom, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { Color } from 'three';

type LandscapeModelProps = {
    modelPath: string;
    onClick: () => void;
    size?: number;
    color?: string;
    scale?: [number, number, number];
    position?: [number, number, number];
    rotation?: [number, number, number];
    cameraPosition?: [number, number, number];
    fov?: number;
};

const LandscapeModelRenderer = ({ modelPath, scale, position, rotation }) => {
    const { scene } = useGLTF(modelPath);

    scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return (
        <primitive object={scene} scale={scale} position={position} rotation={rotation} />
    );
};

export const LandscapeModel: React.FC<LandscapeModelProps> = ({
    modelPath,
    onClick,
    size = 400,
    color = 'white',
    scale = [0.5, 0.5, 0.5],
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    cameraPosition = [0, 70, 100], // Adjusted for better top-down view
    fov = 40, // Increased for wider view
}) => {
    return (
        <Canvas
            shadows
            style={{ width: `${size}px`, height: `${0.8 * size}px`, cursor: 'pointer' }}
            camera={{ position: cameraPosition, fov: fov, up: [0, 1, 0] }} // Changed up vector for landscape orientation
            onClick={onClick}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick();
                }
            }}
            aria-label="Landscape 3D Model"
            role="button"
            gl={{ alpha: true, antialias: true }}
        >

            {/* Enable soft shadows */}
            {/* disabled because of shader error when enabled */}
            {/* <SoftShadows size={20} samples={10} focus={0.7} /> */}

            <ambientLight intensity={0.3} /> {/* Increased ambient light */}

            <directionalLight
                position={[-10, 20, -10]}
                intensity={15}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={50}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
                shadow-radius={10}  // Increased shadow radius for softer edges
                shadow-bias={0}
            />

            <Suspense fallback={null}>
                <LandscapeModelRenderer
                    modelPath={modelPath}
                    scale={scale}
                    position={[0, 5, 0]}
                    rotation={rotation}
                />
            </Suspense>

            {/* Ground plane to receive shadows */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[1000, 1000]} />
                <shadowMaterial opacity={0.4} />
            </mesh>

            <Environment preset="sunset" />

            <EffectComposer>
                <SSAO radius={0.1} intensity={20} luminanceInfluence={0.6} color="black" />
                <Bloom intensity={0.2} luminanceThreshold={0.4} luminanceSmoothing={0.05} />
                <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
            </EffectComposer>
        </Canvas>
    );
};

useGLTF.preload('/models-3d/cloudy-mountains.glb');
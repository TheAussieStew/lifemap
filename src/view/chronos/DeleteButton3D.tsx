// components/DeleteButton3D.tsx
'use client'; // Ensures client-side rendering

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { MeshStandardMaterial, ShadowMaterial } from 'three';

type DeleteButton3DProps = {
  onClick: () => void;
  size?: number;
  color?: string;
};

const Model = () => {
  const { scene } = useGLTF('/models-3d/starIcon.glb') as any;

  // Enable shadows for all meshes in the model
  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = true;    // Model casts shadows
      child.receiveShadow = true; // Model can receive shadows if needed
      child.material = new MeshStandardMaterial({ color: child.material.color });
    }
  });

  return <primitive object={scene} />;
};

export const DeleteButton3D: React.FC<DeleteButton3DProps> = ({ onClick, size = 1, color = 'white' }) => {
  return (
    <Canvas
      shadows // Enables shadow mapping in the renderer
      style={{ width: '40px', height: '40px', cursor: 'pointer' }} // Adjust size as needed
      camera={{ position: [0, 2, 5], fov: 50 }} // Position camera to capture shadows
      onClick={onClick}
      tabIndex={0} // Makes the canvas focusable for accessibility
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-label="Delete All Pomodoros"
      role="button"
    >
      {/* Lighting Setup */}
      <ambientLight intensity={0.2} /> {/* Soft ambient light */}

      {/* Directional Light for Model Illumination and Shadow Casting */}
      <directionalLight
        position={[-5, 10, 5]}
        intensity={7}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />

      {/* Backing Plane Positioned Behind the Star */}
      <mesh
        rotation={[0, 0, 0]} // No rotation; vertical plane
        position={[0, 0, -0.1]}  // Positioned behind the model along the Z-axis
        receiveShadow            // Enable the plane to receive shadows
      >
        <planeGeometry args={[10, 10]} /> {/* Large enough to catch shadows */}
        <shadowMaterial transparent opacity={0.5} /> {/* Transparent cream-colored plane that only shows shadows */}
      </mesh>

      {/* 3D Model */}
      <Suspense fallback={null}>
        <motion.group
          whileHover={{ scale: 1.2 }} // Scales up on hover
          whileTap={{ scale: 0.9 }}   // Scales down on tap/click
          position={[0, 0, 0]}         // Adjust position if needed
        >
          <Model />
        </motion.group>
      </Suspense>
    </Canvas>
  );
};

useGLTF.preload('/models-3d/starIcon.glb'); // Preloads the GLB model for faster loading

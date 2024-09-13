// components/DeleteButton3D.tsx
'use client'; // Ensure client-side rendering

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { MeshStandardMaterial } from 'three';

type DeleteButton3DProps = {
  onClick: () => void;
  size?: number;
  color?: string;
};

const Model = () => {
  const { scene } = useGLTF('/models-3d/starIcon.glb') as any;

  // Optionally, modify materials or other properties
  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material = new MeshStandardMaterial({ color: child.material.color });
    }
  });

  return <primitive object={scene} />;
};

export const DeleteButton3D: React.FC<DeleteButton3DProps> = ({ onClick, size = 1, color = 'white' }) => {
  return (
    <Canvas
      style={{ width: '30px', height: '30px', cursor: 'pointer' }} // Adjust size as needed
      camera={{ position: [0, 0, 5], fov: 50 }}
      onClick={onClick}
      tabIndex={0} // Make focusable for accessibility
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-label="Delete All Pomodoros"
      role="button"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <motion.group
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Model />
        </motion.group>
      </Suspense>
    </Canvas>
  );
};

useGLTF.preload('/models-3d/starIcon.glb');

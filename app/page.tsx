'use client'

import * as React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { offWhite } from '../src/subapps/Theme';
import { DoubleSide } from 'three';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const segments = 9;

const colors = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#8B00FF', // Violet
  '#FF00FF', // Magenta
  '#FF1493', // Deep Pink
];

const Logo = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {Array.from({ length: segments }).map((_, i) => {
          const thetaStart = (i / segments) * Math.PI * 2;
          const thetaLength = (0.8 / segments) * Math.PI * 2; // Reduced arc angle for gaps
          return (
            <mesh key={i}>
              <circleGeometry args={[5, 32, thetaStart, thetaLength]} />
              <meshBasicMaterial color={colors[i % colors.length]} side={DoubleSide} />
            </mesh>
          );
        })}
      </group>
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[2.5, 32, 32]} /> {/* Increased size */}
        <meshBasicMaterial color="#FFD700" /> {/* Warm, natural yellow color */}
      </mesh>
      <EffectComposer>
        <Bloom intensity={5.0} /> {/* Increased bloom intensity */}
      </EffectComposer>
      <OrbitControls />
    </Canvas>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <motion.div style={{ padding: '45px', backgroundColor: offWhite }}>
        <Logo />
      </motion.div>
    </React.StrictMode>
  );
};

export default App;
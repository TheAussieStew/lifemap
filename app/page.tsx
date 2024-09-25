'use client'

import * as React from 'react';
import { motion } from 'framer-motion';
import { Canvas, useThree } from '@react-three/fiber';
import { offWhite } from '../src/subapps/Theme';
import { DoubleSide, AdditiveBlending } from 'three';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const segments = 9;

const pastelColors = [
  '#FFB3BA', // Pastel Red
  '#FFDFBA', // Pastel Orange
  '#FFFFBA', // Pastel Yellow
  '#BAFFC9', // Pastel Green
  '#BAE1FF', // Pastel Blue
  '#D4BAFF', // Pastel Indigo
  '#FFBAF2', // Pastel Violet
  '#FFBAE1', // Pastel Magenta
  '#FFBAD4', // Pastel Deep Pink
];

const CameraSetup = () => {
  const { camera } = useThree();
  React.useEffect(() => {
    camera.position.set(0, 0, 10); // Set the camera position
    camera.lookAt(0, 0, 0); // Make the camera look at the center of the scene
  }, [camera]);
  return null;
};

const Logo = () => {
  return (
    <Canvas>
      <CameraSetup />
      <ambientLight intensity={1.5} />
      <group>
        {Array.from({ length: segments }).map((_, i) => {
          const thetaStart = (i / segments) * Math.PI * 2;
          const thetaLength = (0.9 / segments) * Math.PI * 2; // Reduced arc angle for gaps
          return (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[5, 32, thetaStart, thetaLength]} />
              <meshStandardMaterial color={pastelColors[i % pastelColors.length]} side={DoubleSide} />
            </mesh>
          );
        })}
      </group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.8, 32, 32]} /> {/* Further increased size for greater visibility */}
        <meshStandardMaterial
          color="#FFD700" // Warm, natural yellow color
          emissive="#FFD700" // Emissive to enhance brightness
          emissiveIntensity={0.1} // Increased emissive intensity
          blending={AdditiveBlending}
        />
      </mesh>
      <EffectComposer>
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={1}
          intensity={10} // Further increased bloom intensity
          mipmapBlur
          kernelSize={1}
        />
      </EffectComposer>
      <OrbitControls enableZoom={false} />
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
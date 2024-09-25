'use client'

import * as React from 'react';
import { motion } from 'framer-motion';
import { Canvas, useThree } from '@react-three/fiber';
import { offWhite } from '../src/subapps/Theme';
import { DoubleSide, AdditiveBlending } from 'three';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const segments = 9;

// Rearranged pastel colors to follow the electromagnetic spectrum from Infrared to Ultraviolet
const pastelColors = [
  '#FFB3BA', // Infrared (IR) - Represented as a soft pastel red
  '#FFDFBA', // Red
  '#FFFFBA', // Orange
  '#BAFFC9', // Yellow
  '#BAE1FF', // Green
  '#D4BAFF', // Blue
  '#FFBAF2', // Indigo
  '#FFBAE1', // Violet
  '#E1BAFF', // Ultraviolet - Represented as a soft pastel purple
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
      {/* Adjusted ambient light intensity for better visibility */}
      <ambientLight intensity={2.0} />

      {/* Added a PointLight to illuminate the color segments */}
      <pointLight
        position={[0, 0, 5]} // Positioned in front of the color wheel
        color="#FFFFFF" // White light to evenly illuminate colors
        intensity={10}
        distance={40}
        castShadow
      />

      <group>
        {Array.from({ length: segments }).map((_, i) => {
          const thetaStart = (i / segments) * Math.PI * 2;
          const thetaLength = (0.9 / segments) * Math.PI * 2; // Reduced arc angle for gaps
          return (
            <mesh key={i}>
              <circleGeometry args={[5, 32, thetaStart, thetaLength]} />
              <meshStandardMaterial
                color={pastelColors[i % pastelColors.length]}
                side={DoubleSide}
                metalness={0.1} // Subtle sheen for a more natural look
                roughness={0.5} // Controls the roughness for diffuse reflection
              />
            </mesh>
          );
        })}
      </group>

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.8, 32, 32]} /> {/* Further increased size for greater visibility */}
        <meshStandardMaterial
          color="#FFD700" // Warm, natural yellow color
          emissive="#FFD700" // Emissive to enhance brightness
          emissiveIntensity={0.5} // Increased emissive intensity
          blending={AdditiveBlending}
        />
      </mesh>

      <EffectComposer>
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={2}
          intensity={4} // Further increased bloom intensity
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
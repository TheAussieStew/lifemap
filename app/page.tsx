'use client'

import * as React from 'react';
import { motion } from 'framer-motion';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { offWhite } from '../src/subapps/Theme';
import { DoubleSide, AdditiveBlending, TextureLoader, OrthographicCamera } from 'three';
import { Billboard } from '@react-three/drei';
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

const reversedPastelColors = pastelColors.reverse();

const CameraSetup = () => {
  const { camera } = useThree();
  React.useEffect(() => {
    if (camera instanceof OrthographicCamera) {
      camera.zoom = 0.09; // Adjusted zoom
      camera.updateProjectionMatrix();
    }
  }, [camera]);
  return null;
};

const LensFlare = () => {
  const lensFlareTexture = useLoader(TextureLoader, '/lensflare.png');
  return (
    <Billboard>
      <sprite scale={[10, 10, 1]}> // Adjusted scale
        <spriteMaterial map={lensFlareTexture} transparent /> // Removed opacity
      </sprite>
    </Billboard>
  );
};

const Logo = () => {
  return (
    <Canvas orthographic camera={{ position: [0, 0, 5], near: 0.1, far: 1000 }}>
      <CameraSetup />
      {/* Adjusted ambient light intensity for better visibility */}
      <ambientLight intensity={2} />

      {/* Added a PointLight to illuminate the color segments */}
      <pointLight
        position={[0, 0, 5]} // Positioned in front of the color wheel
        color="#FFFFFF" // White light to evenly illuminate colors
        intensity={10}
        distance={40}
        castShadow
      />

      {/* Colour Wheel */}
      <group rotation={[0, 0, 0.035]}> {/* Applied slight anti-clockwise rotation */}
        {Array.from({ length: segments }).map((_, i) => {
          const thetaStart = (i / segments) * Math.PI * 2 + Math.PI / 2;
          const thetaLength = (0.9 / segments) * Math.PI * 2; // Reduced arc angle for gaps
          return (
            <mesh key={i}>
              <circleGeometry args={[5, 32, thetaStart, thetaLength]} />
              <meshStandardMaterial
                color={reversedPastelColors[i % reversedPastelColors.length]}
                side={DoubleSide}
                metalness={0.2} // Subtle sheen for a more natural look
                roughness={0.8} // Controls the roughness for diffuse reflection
              />
            </mesh>
          );
        })}
      </group>

      {/* Sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 32, 32]} /> {/* Further increased size for greater visibility */}
        <meshStandardMaterial
          color="#FFD700" // Warm, natural yellow color
          emissive="#FFD700" // Emissive to enhance brightness
          emissiveIntensity={0.5} // Increased emissive intensity
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Lens Flare */}
      <LensFlare />

      {/* Bloom Effect for Sun */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={2}
          intensity={4} // Further increased bloom intensity
          mipmapBlur
          kernelSize={1}
        />
      </EffectComposer>

    </Canvas>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <motion.div style={{ 
        width: '200px',  // Adjusted width
        height: '200px', // Adjusted height
        backgroundColor: offWhite 
      }}>
        <Logo />
      </motion.div>
    </React.StrictMode>
  );
};

export default App;
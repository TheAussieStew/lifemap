'use client'; // Ensures client-side rendering

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { useGLTF, Environment, SoftShadows, OrbitControls, Html } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { EffectComposer, SSAO, Bloom, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { Color, TextureLoader } from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';


type Generic3DModelProps = {
  modelPath: string;
  size?: number;
  color?: string;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  cameraPosition?: [number, number, number];
  fov?: number;
};

// A generic model component that loads a GLTF model and applies shadows.
const GenericModel = ({
  // @ts-ignore
  modelPath,
  scale = [2, 2, 2],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  // @ts-ignore
  const { scene } = useGLTF(modelPath);
  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return <primitive object={scene} scale={scale} position={position} rotation={rotation} />;
};

const useAvailableModels = () => {
  const [isLoading, setIsLoading] = useState(true);

  const availableModels = [
    '/models-3d/buddha-preaching.glb',
    '/models-3d/buddha-statue.glb',
    '/models-3d/chinese-mountains.glb',
    '/models-3d/cloudy-mountains.glb',
    '/models-3d/falcon-statues.glb',
    '/models-3d/garbage-bin.glb',
    '/models-3d/nelson-statue.glb',
    '/models-3d/solar-system.glb',
    '/models-3d/st-pancras.glb',
    '/models-3d/star-icon.glb'
  ];

  useEffect(() => {
    // Simulate a quick loading state to avoid flash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { availableModels, isLoading };
}

export const Generic3DModel: React.FC<Generic3DModelProps> = ({
  modelPath,
  size = 160,
  // Reduce scale if model is too large
  scale: modelScale = [1, 1, 1],
  position: modelPosition = [0, 0, 0],
  rotation: modelRotation = [0, 0, 0],
  cameraPosition = [0, 10.5, 52],
  fov = 20,
}) => {
  const { availableModels, isLoading } = useAvailableModels();

  // Load all texture maps
  const [
    diffuseMap,
    displacementMap
  ] = useLoader(TextureLoader, [
    '/textures/wood/dark_wood_diff_1k.jpg',
    '/textures/wood/dark_wood_disp_1k.png',
  ]);

  const [
    normalMap,
    roughnessMap
  ] = useLoader(EXRLoader, [
    '/textures/wood/dark_wood_nor_gl_1k.exr',
    '/textures/wood/dark_wood_rough_1k.exr'
  ]);

  // Adjust the stand and model positions
  const standSize: [number, number, number] = [10, 1.0, 10];
  const standPosition: [number, number, number] = [0, 0, 0];
  // Raise the model position higher above the stand
  modelPosition[1] += 1.6;

  return (
    <Canvas
      shadows
      style={{ width: `${size}px`, height: `${size}px`, cursor: 'pointer' }}
      camera={{ position: cameraPosition, fov: fov, up: [0, 1, 0] }}
      tabIndex={0}
      aria-label="3D Model"
      role="button"
      gl={{ alpha: true, antialias: true }}
    >
      <Html center>
        {isLoading && <div>Loading models...</div>}
        {!isLoading && !availableModels.some(path => modelPath.endsWith(path)) && (
          <div>The model you selected is not available</div>
        )}
      </Html>

      {!isLoading && availableModels.some(path => modelPath.endsWith(path)) && (
        <>
          <SoftShadows size={20} samples={16} focus={0.7} />
          <ambientLight intensity={0.1} />
          <directionalLight
            position={[-3, 5, 8]}
            intensity={2.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-radius={18}
            shadow-bias={-0.0001}
          />

          {/* Environment helps with realistic lighting */}
          <Environment preset="apartment" />

          {/* Wall to catch shadows - positioned behind model */}
          <mesh 
            rotation={[0, 0, 0]}
            position={[0, 0, - (standSize[0] / 2) ]}
            receiveShadow
          >
            <planeGeometry args={[100, 100]} />
            <shadowMaterial opacity={0.5} />
          </mesh>

          <Suspense fallback={null}>
            <motion.group position={modelPosition}>
              {/* The Model on top of the stand */}
              <GenericModel
                modelPath={modelPath}
                scale={modelScale}
                position={modelPosition}
                rotation={modelRotation}
              />

              {/* Wooden Stand */}
              <mesh
                position={[standPosition[0], standPosition[1] + standSize[1] / 2, standPosition[2]]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={standSize} />
                <meshStandardMaterial
                  map={diffuseMap}
                  normalMap={normalMap}
                  roughnessMap={roughnessMap}
                  displacementMap={displacementMap}
                  displacementScale={0.05}
                  metalness={0.2}
                  roughness={0.8}
                />
              </mesh>
            </motion.group>
          </Suspense>

          {/* Post-processing for a polished look */}
          <EffectComposer>
            <SSAO
              radius={0.1}
              intensity={2}
              luminanceInfluence={0.6}
              color={new Color('black')}
              worldDistanceThreshold={0}
              worldDistanceFalloff={0}
              worldProximityThreshold={0}
              worldProximityFalloff={0}
            />
            <Bloom intensity={0.05} luminanceThreshold={0.9} luminanceSmoothing={0.025} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>

          {/* Orbit controls for camera movement - mainly used to find good default camera positions*/}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            makeDefault
            onChange={(e) => {
              console.log('Camera Position:', e?.target?.object?.position);
              console.log('Camera Rotation:', e?.target?.object?.rotation);
            }}
          />
        </>
      )}
    </Canvas>
  );
};

useGLTF.preload('/models-3d/nelson-statue.glb'); // Preload model if desired
'use client'; // Ensures client-side rendering

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useLoader, LoaderProto } from '@react-three/fiber';
import { useGLTF, Environment, SoftShadows, OrbitControls, Html } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { EffectComposer, SSAO, Bloom, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { Color, TextureLoader, Box3, Vector3 } from 'three';
import { EXRLoader } from 'three-stdlib';
import { DataTexture } from 'three';

type Generic3DModelProps = {
  modelPath: string;
  canvasSize?: number;         // Size of the rendered canvas in pixels
  modelBaseSize?: number;      // Normalized size for the model's largest dimension
  color?: string;
  scale?: [number, number, number];
  modelPosition?: [number, number, number];
  rotation?: [number, number, number];
  cameraPosition?: [number, number, number];
  fov?: number;
};

type GenericModelProps = {
  modelPath: string;
  modelBaseSize: number;
  modelScale: [number, number, number];
  modelPosition: [number, number, number];
  modelRotation: [number, number, number];
  standSize: [number, number, number];
  standPosition: [number, number, number];
};

const GenericModel = ({
  modelPath,
  modelBaseSize,
  modelScale,
  modelPosition,
  modelRotation,
  standSize,
  standPosition
}: GenericModelProps) => {
  const { scene } = useGLTF(modelPath);
  const [isScaled, setIsScaled] = useState(false);

  useEffect(() => {
    if (scene && !isScaled) {
      // Defer the bounding box and scale calculation to the next frame
      // to ensure the scene is fully mounted and ready.
      requestAnimationFrame(() => {
        const box = new Box3().setFromObject(scene);
        const sizeVec = box.getSize(new Vector3());
        const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);

        // Scale the model so its largest dimension matches modelBaseSize
        const scaleFactor = modelBaseSize / maxDim;
        scene.scale.setScalar(scaleFactor);

        // Recompute bounding box after scaling
        box.setFromObject(scene);
        const center = box.getCenter(new Vector3());

        // Position the model so its base sits at the top of the stand
        const standTopY = standPosition[1] + standSize[1] / 2;
        scene.position.x -= center.x;
        scene.position.z -= center.z;
        scene.position.y -= box.min.y - standTopY;

        // Apply user-defined transforms after normalization
        scene.rotation.set(...modelRotation);
        scene.scale.x *= modelScale[0];
        scene.scale.y *= modelScale[1];
        scene.scale.z *= modelScale[2];

        scene.position.x += modelPosition[0];
        scene.position.y += modelPosition[1];
        scene.position.z += modelPosition[2];

        // Enable shadows on all meshes
        scene.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        setIsScaled(true);
      });
    }
  }, [
    scene,
    isScaled,
    modelBaseSize,
    modelScale,
    modelPosition,
    modelRotation,
    standSize,
    standPosition
  ]);

  return scene ? <primitive object={scene} /> : null;
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
    '/models-3d/cash-suitcase.glb',
    '/models-3d/st-pancras.glb',
    '/models-3d/star-icon.glb'
  ];

  // Model-specific configurations
  const modelConfigs: Record<string, Partial<Generic3DModelProps>> = {
    'cash-suitcase': {
      rotation: [0, Math.PI / 2 + Math.PI, 0], // Rotate 180 degrees around Y axis to face user
      modelBaseSize: 10, // Slightly smaller base size
      modelPosition: [-0.5, 0, 5], // Lift slightly off the stand
      cameraPosition: [0, 7.5, 52], // Adjusted for straight-on view
    },
    'nelson-statue': {
      modelPosition: [0, 0, 5], // Lift slightly off the stand
      cameraPosition: [0, 7.5, 52], // Adjusted for straight-on view
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return { availableModels, isLoading, modelConfigs };
}

// Calculate camera settings based on stand dimensions
const calculateCameraSettings = (standSize: [number, number, number], standPosition: [number, number, number]) => {
  // Calculate center of the stand
  const centerX = standPosition[0];
  const centerY = standPosition[1] + standSize[1] / 2;
  const centerZ = standPosition[2];

  // Calculate camera position
  // We want to be far enough back to see the whole scene
  const distance = Math.max(standSize[0], standSize[1]) * 6; // Adjust multiplier as needed
  
  return {
    cameraPosition: [centerX, centerY, centerZ + distance] as [number, number, number],
    target: [centerX, centerY, centerZ] as [number, number, number]
  };
};

export const Generic3DModel: React.FC<Generic3DModelProps> = ({
  modelPath,
  canvasSize = 400,
  modelBaseSize = 10,
  scale: modelScale = [1, 1, 1],
  modelPosition: modelPosition = [0, 0, 0],
  rotation: modelRotation = [0, 0, 0],
  fov = 20,
  color = 'white',
}) => {
  const { availableModels, isLoading, modelConfigs } = useAvailableModels();
  const standSize: [number, number, number] = [10, 1.0, 10];
  const standPosition: [number, number, number] = [0, -2, 0]; // Move the stand down slightly off centre
  const backStandSize: [number, number, number] = [15, 15, 1];

  // Calculate camera settings based on stand
  const { cameraPosition, target } = calculateCameraSettings(standSize, standPosition);

  // Extract model name from path
  const modelName = modelPath.split('/').pop()?.replace('.glb', '');
  
  // Get model-specific configuration if it exists
  const modelConfig = modelName ? modelConfigs[modelName] : undefined;

  // Merge default props with model-specific configuration
  const finalProps = {
    modelBaseSize: modelConfig?.modelBaseSize ?? modelBaseSize,
    modelScale: modelConfig?.scale ?? modelScale,
    modelPosition: modelConfig?.modelPosition ?? modelPosition,
    modelRotation: modelConfig?.rotation ?? modelRotation,
    cameraPosition: modelConfig?.cameraPosition ?? cameraPosition,
    fov: modelConfig?.fov ?? fov
  };

  // Load texture maps for the stand
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
  ] = useLoader(EXRLoader as unknown as LoaderProto<DataTexture>, [
    '/textures/wood/dark_wood_nor_gl_1k.exr',
    '/textures/wood/dark_wood_rough_1k.exr'
  ]);

  return (
    <Canvas
      shadows
      style={{ width: `${canvasSize}px`, height: `${canvasSize}px`, cursor: 'pointer' }}
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
            position={[-5, 5, 7]}
            intensity={2.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-radius={20}
            shadow-bias={-0.0001}
          />

          <Environment preset="apartment" />

          {/* Shadow-catching plane behind the model */}
          <mesh rotation={[0, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <shadowMaterial opacity={0.5}/>
          </mesh>

          {/* Wooden Backing */}
          <mesh
            position={[0, 0, backStandSize[2] / 2]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={backStandSize} />
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

          <Suspense fallback={null}>
            <motion.group>
              {/* The Model on top of the stand, scaled after initial render frame */}
              <GenericModel
                modelPath={modelPath}
                modelBaseSize={finalProps.modelBaseSize}
                modelScale={finalProps.modelScale}
                modelPosition={finalProps.modelPosition}
                modelRotation={finalProps.modelRotation}
                standSize={standSize}
                standPosition={standPosition}
              />

              {/* Wooden Stand */}
              <mesh
                position={[standPosition[0], standPosition[1], standSize[2]/2]}
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

          {/* Post-processing */}
          <EffectComposer>
            {/* @ts-ignore */}
            <SSAO
              radius={0.1}
              intensity={2}
              luminanceInfluence={0.6}
              color={new Color('black')}
            />
            <Bloom intensity={0.05} luminanceThreshold={0.9} luminanceSmoothing={0.025} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            makeDefault
            target={target}
          />
        </>
      )}
    </Canvas>
  );
};

useGLTF.preload('/models-3d/nelson-statue.glb');
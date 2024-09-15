import React from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import {
  Center,
  Text3D,
  Environment,
  Lightformer,
  OrbitControls,
  RandomizedLight,
  AccumulativeShadows,
  MeshTransmissionMaterial
} from '@react-three/drei'
import { RGBELoader } from 'three-stdlib'

interface ThreeDTextProps {
  text: string
}

export const ThreeDText: React.FC<ThreeDTextProps> = ({ text }) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, -1, 500], fov: 1 }}
      gl={{ preserveDrawingBuffer: true, alpha: true }}
    >
      <Text
        text={text}
        config={{
          transmission: 1,
          clearcoat: 1,
          clearcoatRoughness: 0.0,
          thickness: 0.3,
          anisotropy: 0.25,
          roughness: 0,
          distortion: 0.5,
          distortionScale: 0.1,
          temporalDistortion: 0,
          ior: 1.25,
          color: 'white',
          shadow: '#000000'
        }}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      />
      {/* Controls */}
      <OrbitControls
        target={[0, 0, 0]}
        autoRotate={false}
        autoRotateSpeed={-0.1}
        enableZoom={false}
        enablePan={false}
        dampingFactor={0.05}
        minPolarAngle={0}
        maxPolarAngle={0}
      />
      {/* Environment */}
      <Environment resolution={32}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={20} rotation-x={Math.PI / 4} position={[-15, 10, 10]} scale={[10, 10, 1]} />
        </group>
      </Environment>
      {/* Soft shadows */}
      <AccumulativeShadows
        frames={3}
        color="#94cbff"
        colorBlend={5}
        toneMapped
        alphaTest={0.9}
        opacity={1}
        scale={30}
        position={[0, -1.01, 0]}
      >
        <RandomizedLight
          amount={4}
          radius={10}
          ambient={0.5}
          intensity={1}
          position={[0, 10, -10]}
          size={15}
          mapSize={1024}
          bias={0.0001}
        />
      </AccumulativeShadows>
    </Canvas>
  )
}

interface TextProps {
  text: string
  config: {
    transmission: number
    clearcoat: number
    clearcoatRoughness: number
    thickness: number
    anisotropy: number
    roughness: number
    distortion: number
    distortionScale: number
    temporalDistortion: number
    ior: number
    color: string
    shadow: string
  }
  font?: string
  position: [number, number, number]
  rotation: [number, number, number]
}

const Text: React.FC<TextProps> = ({ text, config, font = '/fonts/Inter-Medium-Regular.json', ...props }) => {
  const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')

  return (
    <group>
      <Center scale={[0.8, 1, 1]} {...props}>
        <Text3D
          castShadow
          bevelEnabled
          font={font}
          scale={5}
          letterSpacing={-0.03}
          height={0.25}
          bevelSize={0.01}
          bevelSegments={10}
          curveSegments={128}
          bevelThickness={0.01}
        >
          {text}
          <MeshTransmissionMaterial {...config} background={texture} />
        </Text3D>
      </Center>
    </group>
  )
}

export default ThreeDText

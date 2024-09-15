import React from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import {
  Center,
  Text3D,
  Instance,
  Instances,
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
    <Canvas shadows camera={{ position: [10, 20, 20], fov: 60 }} gl={{ preserveDrawingBuffer: true }}>
      <color attach="background" args={['#f2f2f5']} />
      {/* The text and the grid */}
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
          shadow: '#94cbff'
        }}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 2.25]}
      />
      {/* Controls */}
      <OrbitControls
        autoRotate={false}
        autoRotateSpeed={-0.1}
        zoomSpeed={0.25}
        minZoom={40}
        maxZoom={140}
        enablePan={false}
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
      />
      {/* Environment */}
      <Environment resolution={32}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
          <Lightformer type="ring" intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
        </group>
      </Environment>
      {/* Soft shadows */}
      <AccumulativeShadows
        frames={100}
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
      <Grid />
    </group>
  )
}

interface GridProps {
  number?: number
  lineWidth?: number
  height?: number
}

const Grid: React.FC<GridProps> = ({ number = 23, lineWidth = 0.026, height = 0.5 }) => (
  <Instances position={[0, -1.02, 0]}>
    <planeGeometry args={[lineWidth, height]} />
    <meshBasicMaterial color="#999" />
    {Array.from({ length: number }, (_, y) =>
      Array.from({ length: number }, (_, x) => (
        <group key={`${x}:${y}`} position={[x * 2 - Math.floor(number / 2) * 2, -0.01, y * 2 - Math.floor(number / 2) * 2]}>
          <Instance rotation={[-Math.PI / 2, 0, 0]} />
          <Instance rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
        </group>
      ))
    )}
    <gridHelper args={[100, 100, '#bbb', '#bbb']} position={[0, -0.01, 0]} />
  </Instances>
)

export default ThreeDText

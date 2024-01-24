import React from 'react'
import { Canvas } from '@react-three/fiber'
import { AccumulativeShadows, Environment, OrbitControls, Text, Lightformer, RandomizedLight } from '@react-three/drei'
import { button, useControls } from 'leva'

interface ThreeDTextProps {
  text: string
}

export const ThreeDText: React.FC<ThreeDTextProps> = ({ text }) => {
  const config = {
    shadow: '#750d57',
  }

  // const { autoRotate, shadow } = useControls({
  //   text: text,
  //   backside: true,
  //   backsideThickness: { value: 0.3, min: 0, max: 2 },
  //   samples: { value: 16, min: 1, max: 32, step: 1 },
  //   resolution: { value: 1024, min: 64, max: 2048, step: 64 },
  //   transmission: { value: 1, min: 0, max: 1 },
  //   clearcoat: { value: 0, min: 0.1, max: 1 },
  //   clearcoatRoughness: { value: 0.0, min: 0, max: 1 },
  //   thickness: { value: 0.3, min: 0, max: 5 },
  //   chromaticAberration: { value: 5, min: 0, max: 5 },
  //   anisotropy: { value: 0.3, min: 0, max: 1, step: 0.01 },
  //   roughness: { value: 0, min: 0, max: 1, step: 0.01 },
  //   distortion: { value: 0.5, min: 0, max: 4, step: 0.01 },
  //   distortionScale: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
  //   temporalDistortion: { value: 0, min: 0, max: 1, step: 0.01 },
  //   ior: { value: 1.5, min: 0, max: 2, step: 0.01 },
  //   color: '#ff9cf5',
  //   gColor: '#ff7eb3',
    // shadow: '#750d57',
  //   autoRotate: false,
  //   screenshot: button(() => {
  //     // Save the canvas as a *.png
  //     const link = document.createElement('a')
  //     link.setAttribute('download', 'canvas.png')
  //         {/* @ts-ignore */}
  //     link.setAttribute('href', document.querySelector('canvas').toDataURL('image/png').replace('image/png', 'image/octet-stream'))
  //     link.click()
  //   })
  // })

  return (
    <Canvas shadows orthographic camera={{ position: [10, 20, 20], zoom: 80 }} gl={{ preserveDrawingBuffer: true }}>
      <color attach="background" args={['#f2f2f5']} />
      <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 2.25]}>
        {text}
      </Text>
      <Text
        position={[0, 0, 0]}
        font="https://fonts.gstatic.com/s/inter/v2/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff"
        fontSize={1}
        color="black"
        receiveShadow
        {...({ depth: 0.5 } as any)}
      >
        {text}
      </Text>
      <OrbitControls
        // autoRotate={autoRotate}
        autoRotateSpeed={-0.1}
        zoomSpeed={0.25}
        minZoom={40}
        maxZoom={140}
        enablePan={false}
        dampingFactor={0.05}
        minPolarAngle={-Math.PI / 2}
        maxPolarAngle={-Math.PI / 2}
      />
      {/** The environment is just a bunch of shapes emitting light. This is needed for the clear-coat */}
      <Environment resolution={32}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          {/* @ts-ignore */}
          <Lightformer intensity={50} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          {/* @ts-ignore */}
          <Lightformer type="ring" intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
        </group>
      </Environment>
      {/** Soft shadows */}
          {/* @ts-ignore */}
      <AccumulativeShadows frames={100} color={config.shadow} colorBlend={5} toneMapped={true} alphaTest={0.9} opacity={1} scale={30} position={[0, -1.01, 0]}>
          {/* @ts-ignore */}
        <RandomizedLight amount={10} radius={10} ambient={0.5} intensity={1} position={[-15, 10, -17]} size={15} mapSize={1024} bias={0.05} />
      </AccumulativeShadows>
    </Canvas>
  )
}

export default ThreeDText

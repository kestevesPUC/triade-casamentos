import { Component, Suspense, useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Float, useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_URL = '/models/violin.glb'

class ModelBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.info('Modelo GLB do violino não encontrado, usando violino procedural.', error?.message)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

// Loads client/public/models/violin.glb when present. Throws (caught by
// ModelBoundary) if the file hasn't been added yet, so the procedural violin
// below is used as an automatic fallback.
function GLTFViolin() {
  const { scene } = useGLTF(MODEL_URL)
  const cloned = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [cloned])

  return (
    <Center>
      <primitive object={cloned} scale={2.6} />
    </Center>
  )
}

useGLTF.preload?.(MODEL_URL)

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

// Procedural violin body built from lathe + boxes — no external 3D assets required.
function ViolinBody() {
  const bodyProfile = useMemo(() => {
    const pts = [
      new THREE.Vector2(0, -1.55),
      new THREE.Vector2(0.42, -1.4),
      new THREE.Vector2(0.5, -1.1),
      new THREE.Vector2(0.34, -0.78),
      new THREE.Vector2(0.5, -0.42),
      new THREE.Vector2(0.46, 0),
      new THREE.Vector2(0.5, 0.42),
      new THREE.Vector2(0.34, 0.78),
      new THREE.Vector2(0.48, 1.1),
      new THREE.Vector2(0.4, 1.4),
      new THREE.Vector2(0, 1.55),
    ]
    return pts
  }, [])

  const woodMat = (
    <meshStandardMaterial color="#8a4a24" roughness={0.35} metalness={0.15} />
  )
  const darkWoodMat = (
    <meshStandardMaterial color="#2a1710" roughness={0.5} metalness={0.1} />
  )
  const goldMat = (
    <meshStandardMaterial color="#d4af37" roughness={0.25} metalness={0.85} />
  )
  const stringMat = (
    <meshStandardMaterial color="#f4ede0" roughness={0.4} metalness={0.2} />
  )

  return (
    <group>
      {/* Body — flattened lathe silhouette reads as a violin front */}
      <group scale={[1, 1, 0.32]}>
        <mesh castShadow receiveShadow>
          <latheGeometry args={[bodyProfile, 64]} />
          {woodMat}
        </mesh>
      </group>

      {/* F-holes (simple dark ellipses) */}
      <mesh position={[0.2, 0.15, 0.17]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.03, 0.32, 0.01]} />
        {darkWoodMat}
      </mesh>
      <mesh position={[-0.2, 0.15, 0.17]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.03, 0.32, 0.01]} />
        {darkWoodMat}
      </mesh>

      {/* Neck */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <boxGeometry args={[0.16, 1.4, 0.12]} />
        {darkWoodMat}
      </mesh>

      {/* Fingerboard */}
      <mesh position={[0, 2.05, 0.09]} castShadow>
        <boxGeometry args={[0.1, 1.55, 0.03]} />
        {darkWoodMat}
      </mesh>

      {/* Scroll (peg box) */}
      <mesh position={[0, 2.85, 0]} rotation={[0.3, 0, 0]} castShadow>
        <torusGeometry args={[0.14, 0.05, 12, 24]} />
        {darkWoodMat}
      </mesh>
      <mesh position={[0, 2.68, -0.02]}>
        <boxGeometry args={[0.14, 0.32, 0.1]} />
        {darkWoodMat}
      </mesh>

      {/* Pegs */}
      {[[-0.09, 2.74, 0.04], [0.09, 2.74, 0.04], [-0.09, 2.6, -0.04], [0.09, 2.6, -0.04]].map(
        (p, i) => (
          <mesh key={i} position={p} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.16, 8]} />
            {goldMat}
          </mesh>
        )
      )}

      {/* Chinrest hint */}
      <mesh position={[0.28, -1.15, 0.14]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.22, 0.1, 0.12]} />
        {darkWoodMat}
      </mesh>

      {/* Tailpiece */}
      <mesh position={[0, -1.05, 0.1]}>
        <boxGeometry args={[0.16, 0.34, 0.02]} />
        {darkWoodMat}
      </mesh>

      {/* Bridge */}
      <mesh position={[0, 0.02, 0.16]}>
        <boxGeometry args={[0.22, 0.16, 0.015]} />
        {woodMat}
      </mesh>

      {/* Strings */}
      {[-0.06, -0.02, 0.02, 0.06].map((x, i) => (
        <mesh key={i} position={[x, 0.9, 0.17]}>
          <cylinderGeometry args={[0.004, 0.004, 3.9, 6]} />
          {stringMat}
        </mesh>
      ))}
    </group>
  )
}

function SpinningViolin({ reduced }) {
  const group = useRef()

  useFrame((_, delta) => {
    if (!reduced && group.current) {
      group.current.rotation.y += delta * 0.18
    }
  })

  return (
    <Float speed={reduced ? 0 : 1.4} rotationIntensity={reduced ? 0 : 0.25} floatIntensity={reduced ? 0 : 0.6}>
      <group ref={group} position={[0, -0.1, 0]} rotation={[0.15, 0.6, 0.12]} scale={0.62}>
        <ModelBoundary fallback={<ViolinBody />}>
          <Suspense fallback={<ViolinBody />}>
            <GLTFViolin />
          </Suspense>
        </ModelBoundary>
      </group>
    </Float>
  )
}

export default function Violin3D() {
  const reduced = useReducedMotion()

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6.5], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[3, 4, 3]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#f4ede0" />
      <pointLight position={[-3, -1, -2]} intensity={0.5} color="#d4af37" />
      <pointLight position={[2, -1, 3]} intensity={0.35} color="#f4ede0" />

      <Suspense fallback={null}>
        <SpinningViolin reduced={reduced} />
        <ContactShadows
          position={[0, -2.05, 0]}
          opacity={0.45}
          scale={8}
          blur={2.4}
          far={3}
          color="#0e0c0a"
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 2 - 0.6}
        maxPolarAngle={Math.PI / 2 + 0.6}
      />
    </Canvas>
  )
}

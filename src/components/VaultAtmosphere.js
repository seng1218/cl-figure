"use client";
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function Relic({ position, scale = 1, speed = 1, wireframe = false, color = '#1d4ed8', detail = 0 }) {
  const mesh = useRef();
  useFrame(() => {
    mesh.current.rotation.x += 0.003 * speed;
    mesh.current.rotation.y += 0.005 * speed;
  });
  return (
    <Float speed={speed * 0.4} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={mesh} position={position} scale={scale}>
        <icosahedronGeometry args={[1, detail]} />
        {wireframe
          ? <meshBasicMaterial color={color} wireframe transparent opacity={0.25} />
          : <meshStandardMaterial color={color} metalness={0.85} roughness={0.1} transparent opacity={0.55} />
        }
      </mesh>
    </Float>
  );
}

function Particles() {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={180} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#3b82f6" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[4, 6, 4]}   intensity={1.8}  color="#3b82f6" />
      <pointLight position={[-6, -4, -3]} intensity={0.7}  color="#1e40af" />
      <pointLight position={[0, -6, 6]}   intensity={0.4}  color="#60a5fa" />

      <Relic position={[-3.5, 1.2, -4]}  scale={1.1}  speed={0.7}                       />
      <Relic position={[3.8, -0.8, -3.5]} scale={0.75} speed={1.4} wireframe             />
      <Relic position={[0.2, 2.2, -7]}   scale={1.8}  speed={0.35} color="#1e3a8a"       />
      <Relic position={[-5.5, -1.8, -5]} scale={0.45} speed={2.1}  wireframe color="#60a5fa" />
      <Relic position={[6.2, 0.4, -6]}   scale={0.9}  speed={0.55} color="#1d4ed8"       />
      <Relic position={[-1.5, -2.5, -3]} scale={0.35} speed={3}    wireframe color="#93c5fd" />

      <Particles />

      <gridHelper args={[40, 25, '#0c1a2e', '#0c1a2e']} position={[0, -5.5, 0]} />
    </>
  );
}

export default function VaultAtmosphere() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 70 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  );
}

"use client";
import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} dispose={null} />
    </Center>
  );
}

function Placeholder() {
  const mesh = useRef();
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#1d4ed8" wireframe />
    </mesh>
  );
}

export default function ProductViewer3D({ modelUrl }) {
  return (
    <div className="w-full aspect-[4/5] rounded-[3rem] bg-[#080808] border border-gray-800/60 overflow-hidden relative group">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]}   intensity={1.5} color="#3b82f6" />
        <pointLight position={[-4, -4, 3]} intensity={0.8} color="#ffffff" />
        <Suspense fallback={<Placeholder />}>
          <Model url={modelUrl} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={7}
          autoRotate
          autoRotateSpeed={1.2}
        />
      </Canvas>

      <div className="absolute bottom-5 left-0 right-0 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
          Drag · Rotate · Scroll to zoom
        </span>
      </div>

      <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 pointer-events-none">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_6px_rgba(59,130,246,0.9)]" />
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-400">3D View</span>
      </div>
    </div>
  );
}

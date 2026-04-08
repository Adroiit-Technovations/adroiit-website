"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, PerspectiveCamera, Environment } from "@react-three/drei";

export default function ModelViewer({ geometry }: { geometry: any }) {
  if (!geometry) return null;

  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[150, 150, 150]} fov={45} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      
      <Stage intensity={0.6} environment="city" adjustCamera={1.2}>
        <mesh geometry={geometry} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color="#8b5cf6" 
            metalness={0.6}
            roughness={0.2}
            transparent={true}
            opacity={0.9}
            transmission={0.1}
            thickness={1}
          />
        </mesh>
      </Stage>
      
      <OrbitControls 
        makeDefault 
        autoRotate 
        autoRotateSpeed={0.8}
        enableDamping={true}
        maxDistance={400}
        minDistance={50}
      />
    </Canvas>
  );
}
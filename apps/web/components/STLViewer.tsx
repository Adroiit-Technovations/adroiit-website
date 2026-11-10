"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three-stdlib";
import * as THREE from "three";

function Model({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url);

  geometry.computeBoundingBox();
  const center = new THREE.Vector3();
  geometry.boundingBox?.getCenter(center);
  geometry.translate(-center.x, -center.y, -center.z);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#8c52ff" />
    </mesh>
  );
}

export default function STLViewer({ fileUrl }: { fileUrl: string }) {
  return (
    <div className="h-[350px] w-full rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 120] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} />
        <Model url={fileUrl} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
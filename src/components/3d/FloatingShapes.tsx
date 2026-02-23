import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Torus, Box, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={position}>
      <MeshDistortMaterial
        color="#1e40af"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.4}
        metalness={0.8}
      />
    </Sphere>
  );
}

function AnimatedTorus({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.getElapsedTime() * 0.8) * 0.15;
    }
  });

  return (
    <Torus ref={meshRef} args={[1, 0.4, 16, 32]} position={position}>
      <MeshDistortMaterial
        color="#dc2626"
        attach="material"
        distort={0.2}
        speed={1.5}
        roughness={0.3}
        metalness={0.9}
      />
    </Torus>
  );
}

function AnimatedBox({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.2) * 0.12;
    }
  });

  return (
    <Box ref={meshRef} args={[1.2, 1.2, 1.2]} position={position}>
      <MeshDistortMaterial
        color="#f97316"
        attach="material"
        distort={0.25}
        speed={1.8}
        roughness={0.35}
        metalness={0.85}
      />
    </Box>
  );
}

export const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-15">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        <AnimatedSphere position={[-3, 0, 0]} />
        <AnimatedTorus position={[3, 1, -2]} />
        <AnimatedBox position={[0, -2, -1]} />
      </Canvas>
    </div>
  );
};

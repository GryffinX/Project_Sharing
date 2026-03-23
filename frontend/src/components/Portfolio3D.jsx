/* eslint-disable no-unused-vars */
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, MeshWobbleMaterial } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';

function AnimatedKnot() {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);

  const [{ scale }] = useSpring(() => ({
    scale: hovered ? 1.2 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  }), [hovered]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <a.mesh 
      ref={meshRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      scale={scale}
    >
      <TorusKnot args={[1, 0.3, 128, 16]}>
        <MeshWobbleMaterial 
          color={hovered ? "#818cf8" : "#3e7bfa"}
          attach="material" 
          factor={0.5} 
          speed={2} 
          roughness={0.1}
          metalness={0.8}
          wireframe={!hovered}
        />
      </TorusKnot>
    </a.mesh>
  );
}

export default function Portfolio3D() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.4, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ pointerEvents: 'auto' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <AnimatedKnot />
      </Canvas>
    </div>
  );
}

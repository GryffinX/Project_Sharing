/* eslint-disable no-unused-vars */
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Stars, MeshDistortMaterial } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import * as THREE from 'three';

function InteractiveShape() {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  
  // Smoothly interpolate mouse position
  const targetRotation = useRef(new THREE.Vector2(0, 0));

  const [{ scale }] = useSpring(() => ({
    scale: hovered ? 1.2 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  }), [hovered]);

  useFrame((state) => {
    // Slowly rotate by default
    if (meshRef.current) {
        meshRef.current.rotation.y += 0.002;
        meshRef.current.rotation.x += 0.001;

        // React to mouse movement
        const { pointer } = state;
        targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, (pointer.x * Math.PI) / 4, 0.1);
        targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, (pointer.y * Math.PI) / 4, 0.1);

        meshRef.current.rotation.x += targetRotation.current.y * 0.05;
        meshRef.current.rotation.y += targetRotation.current.x * 0.05;
    }
  });

  return (
    <a.mesh 
      ref={meshRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      scale={scale}
    >
      <Icosahedron args={[2.5, 4]}>
        <MeshDistortMaterial 
          color={hovered ? "#60a5fa" : "#3e7bfa"}
          attach="material" 
          distort={0.4} 
          speed={hovered ? 4 : 2} 
          roughness={0.2}
          metalness={0.8}
          emissive="#0f1219"
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </Icosahedron>
    </a.mesh>
  );
}

function FloatingParticles() {
  const particlesRef = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particlesPosition.length / 3} 
          array={particlesPosition} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#3e7bfa" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <spotLight position={[-10, -10, -5]} angle={0.3} penumbra={1} intensity={2} color="#3e7bfa" />
      
      <InteractiveShape />
      <FloatingParticles />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </Canvas>
  );
}

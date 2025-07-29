"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, OrbitControls, Text, Box } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Mesh, Vector3 } from 'three';
import * as THREE from 'three';

// Educational Knowledge Nodes - representing different subjects
function KnowledgeNode({ position, color, subject, delay = 0 }: { 
  position: [number, number, number]; 
  color: string; 
  subject: string;
  delay?: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const textRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 + delay;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.2;
      
      // Scale on hover
      const targetScale = isHovered ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (textRef.current) {
      textRef.current.lookAt(0, 0, 5);
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
        <Sphere 
          ref={meshRef}
          args={[0.4, 32, 32]}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        >
          <MeshDistortMaterial
            color={color}
            distort={0.2}
            speed={1.5}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.9}
          />
        </Sphere>
        <Text
          ref={textRef}
          position={[0, -0.8, 0]}
          fontSize={0.2}
          color={color}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {subject}
        </Text>
      </Float>
    </group>
  );
}

// Central Learning Brain - the main educational element
function LearningBrain() {
  const meshRef = useRef<Mesh>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle pulsing brain-like movement
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      meshRef.current.rotation.y += delta * 0.2;
      
      // Responsive to mouse with educational feel
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        mousePosition.x * 0.3,
        0.03
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        mousePosition.y * 0.2,
        0.03
      );

      // Breathing effect for organic feel
      const breathe = 1 + Math.sin(time * 2) * 0.1;
      meshRef.current.scale.setScalar(breathe);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.2}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#4F46E5"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.7}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
}

// Learning Connections - showing knowledge transfer
function LearningConnections() {
  const points = useRef<THREE.Points>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const particleCount = 80;

  const [positions, connections] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const connectionPoints = [];
    
    // Create educational constellation pattern
    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      const height = (Math.random() - 0.5) * 4;
      
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      // Create connections between nearby knowledge points
      if (i > 0 && Math.random() > 0.7) {
        connectionPoints.push(
          positions[(i - 1) * 3], positions[(i - 1) * 3 + 1], positions[(i - 1) * 3 + 2],
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]
        );
      }
    }
    
    return [positions, new Float32Array(connectionPoints)];
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (lines.current) {
      lines.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#8B5CF6" transparent opacity={0.8} />
      </points>
      
      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connections, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#6366F1" transparent opacity={0.3} />
      </lineSegments>
    </>
  );
}

// Floating Educational Elements
function FloatingEducationElements() {
  const subjects = [
    { name: "Code", color: "#3B82F6", position: [-3, 1, -2] as [number, number, number] },
    { name: "Design", color: "#8B5CF6", position: [3, -1, -1] as [number, number, number] },
    { name: "Data", color: "#10B981", position: [-2, -2, -3] as [number, number, number] },
    { name: "AI", color: "#F59E0B", position: [2, 2, -2] as [number, number, number] },
    { name: "Business", color: "#EF4444", position: [0, 3, -4] as [number, number, number] },
  ];

  return (
    <>
      {subjects.map((subject, index) => (
        <KnowledgeNode
          key={subject.name}
          position={subject.position}
          color={subject.color}
          subject={subject.name}
          delay={index * 0.5}
        />
      ))}
    </>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        {/* Educational lighting setup */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4F46E5" />
        <pointLight position={[-10, -10, -5]} intensity={0.6} color="#8B5CF6" />
        <pointLight position={[0, 0, 10]} intensity={0.4} color="#3B82F6" />
        
        {/* Main learning brain */}
        <LearningBrain />
        
        {/* Educational knowledge nodes */}
        <FloatingEducationElements />
        
        {/* Learning connections network */}
        <LearningConnections />
        
        {/* Gentle camera movement */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
}

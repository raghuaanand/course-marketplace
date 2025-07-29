"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, OrbitControls, Sphere, MeshDistortMaterial, Html } from '@react-three/drei';
import { useRef, useState, useMemo } from 'react';
import { Group, Vector3 } from 'three';
import Image from 'next/image';

interface Instructor {
  id: string;
  name: string;
  role: string;
  specialty: string;
  rating: number;
  students: number;
  courses: number;
  image: string;
  color: string;
}

const instructors: Instructor[] = [
  {
    id: "1",
    name: "Dr. Sarah Kim",
    role: "Former Google ML Engineer",
    specialty: "Machine Learning & AI",
    rating: 4.9,
    students: 45000,
    courses: 12,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    color: "#8B5CF6"
  },
  {
    id: "2",
    name: "Alex Chen",
    role: "Ex-Netflix Senior Engineer",
    specialty: "Full-Stack Development",
    rating: 4.8,
    students: 62000,
    courses: 18,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    color: "#06B6D4"
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    role: "Former Airbnb Design Lead",
    specialty: "Product Design & UX",
    rating: 4.9,
    students: 38000,
    courses: 9,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    color: "#EF4444"
  },
  {
    id: "4",
    name: "David Park",
    role: "Data Science Director at Spotify",
    specialty: "Data Science & Analytics",
    rating: 4.7,
    students: 29000,
    courses: 14,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    color: "#10B981"
  },
  {
    id: "5",
    name: "Sophie Laurent",
    role: "Former Tesla Mobile Lead",
    specialty: "Mobile Development",
    rating: 4.8,
    students: 34000,
    courses: 11,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    color: "#F59E0B"
  },
  {
    id: "6",
    name: "James Wilson",
    role: "Ex-AWS Solutions Architect",
    specialty: "DevOps & Cloud",
    rating: 4.9,
    students: 41000,
    courses: 16,
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=80&h=80&fit=crop&crop=face",
    color: "#8B5CF6"
  }
];

function InstructorOrb({ instructor, position, onClick }: { 
  instructor: Instructor; 
  position: Vector3; 
  onClick: () => void;
}) {
  const meshRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.lerp(new Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.2}>
      <group
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        {/* Glowing background sphere */}
        <Sphere args={[0.6, 32, 32]}>
          <MeshDistortMaterial
            color={instructor.color}
            distort={0.2}
            speed={1.5}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={hovered ? 0.9 : 0.6}
          />
        </Sphere>
        
        {/* Profile HTML overlay */}
        <Html
          center
          distanceFactor={8}
          style={{
            width: '120px',
            height: '120px',
            pointerEvents: hovered ? 'auto' : 'none',
            opacity: hovered ? 1 : 0.8,
            transition: 'all 0.3s ease',
          }}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg mb-2">
              <Image
                src={instructor.image}
                alt={instructor.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-white text-xs font-bold leading-tight">
              {instructor.name}
            </div>
            <div className="text-white/80 text-[10px] leading-tight">
              {instructor.specialty}
            </div>
            {hovered && (
              <div className="mt-1 text-white/70 text-[8px] leading-tight">
                ⭐ {instructor.rating} • {(instructor.students/1000).toFixed(0)}K students
              </div>
            )}
          </div>
        </Html>
      </group>
    </Float>
  );
}

function InstructorSphereScene() {
  const groupRef = useRef<Group>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  useFrame((state) => {
    if (groupRef.current && !selectedInstructor) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  // Position instructors in a sphere formation with golden ratio
  const positions = useMemo(() => {
    const radius = 3.5;
    return instructors.map((_, index) => {
      const phi = Math.acos(-1 + (2 * index) / instructors.length);
      const theta = Math.sqrt(instructors.length * Math.PI) * phi;
      
      return new Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi)
      );
    });
  }, []);

  const handleInstructorClick = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setTimeout(() => setSelectedInstructor(null), 3000);
  };

  return (
    <>
      <group ref={groupRef}>
        {instructors.map((instructor, index) => (
          <InstructorOrb
            key={instructor.id}
            instructor={instructor}
            position={positions[index]}
            onClick={() => handleInstructorClick(instructor)}
          />
        ))}
      </group>

      {/* Central connecting lines */}
      {positions.map((position, index) => (
        <line key={`line-${index}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0, 0, 0, position.x, position.y, position.z]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#8B5CF6" transparent opacity={0.1} />
        </line>
      ))}

      {/* Selected instructor details */}
      {selectedInstructor && (
        <Html center>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-xl max-w-xs">
            <div className="flex items-center space-x-3 mb-3">
              <Image
                src={selectedInstructor.image}
                alt={selectedInstructor.name}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <h3 className="font-bold text-slate-900">{selectedInstructor.name}</h3>
                <p className="text-sm text-slate-600">{selectedInstructor.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-bold text-slate-900">{selectedInstructor.rating}</div>
                <div className="text-slate-500">Rating</div>
              </div>
              <div>
                <div className="font-bold text-slate-900">{(selectedInstructor.students/1000).toFixed(0)}K</div>
                <div className="text-slate-500">Students</div>
              </div>
              <div>
                <div className="font-bold text-slate-900">{selectedInstructor.courses}</div>
                <div className="text-slate-500">Courses</div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

export default function InstructorSphere() {
  return (
    <div className="w-full h-96 relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#8B5CF6" />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#06B6D4" />
        
        <InstructorSphereScene />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>
      
      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 text-white/70 text-sm">
        Click on instructors to learn more • Drag to rotate
      </div>
    </div>
  );
}

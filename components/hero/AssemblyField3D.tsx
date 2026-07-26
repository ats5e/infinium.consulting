"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera, Environment } from "@react-three/drei";
import * as THREE from "three";

// Reference brand colors
const M_COBALT = new THREE.Color("#0044FF");
const M_NAVY = new THREE.Color("#001133");
const M_LIGHT = new THREE.Color("#88AAFF");
const GLASS_COLOR = new THREE.Color("#f0f8ff");

function MainCube() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  useEffect(() => {
    if (!meshRef.current) return;
    
    let i = 0;
    const size = 1.0;
    const offset = (4 * size) / 2 - (size / 2);
    
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        for (let z = 0; z < 4; z++) {
          const matrix = new THREE.Matrix4();
          matrix.setPosition(
            x * size - offset,
            y * size - offset,
            z * size - offset
          );
          meshRef.current.setMatrixAt(i, matrix);
          
          // Reference has some dark navy cubes, most are cobalt
          const color = new THREE.Color();
          if (Math.random() > 0.85) {
             color.copy(M_NAVY);
          } else if (Math.random() > 0.8) {
             color.copy(M_LIGHT);
          } else {
             color.copy(M_COBALT);
          }
          meshRef.current.setColorAt(i, color);
          i++;
        }
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  return (
    <group position={[-6, 0, 0]}>
      {/* 
        We use a tiny scale reduction on the geometry so they don't z-fight,
        and it creates a natural "bevel" gap between blocks
      */}
      <instancedMesh ref={meshRef} args={[null as unknown as THREE.BufferGeometry, null as unknown as THREE.Material, 64]}>
        <boxGeometry args={[0.98, 0.98, 0.98]} />
        <meshPhysicalMaterial
          metalness={0.4}
          roughness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
        />
      </instancedMesh>
    </group>
  );
}

function GlassSheets() {
  const planes = [-2, 0, 2, 4, 6, 8]; // X positions of the sheets

  return (
    <group>
      {planes.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Glass pane */}
          <mesh>
            <boxGeometry args={[0.1, 10, 10]} />
            <meshPhysicalMaterial 
              color={GLASS_COLOR}
              transparent
              opacity={0.3}
              metalness={0.1}
              roughness={0.05}
              transmission={0.9}
              thickness={0.5}
              ior={1.5}
              depthWrite={false}
            />
          </mesh>
          
          {/* Grid lines on the pane */}
          <gridHelper 
            args={[10, 10, "#3E66D8", "#3E66D8"]} 
            rotation={[0, 0, Math.PI / 2]}
            material-opacity={0.2}
            material-transparent={true}
          />

          {/* Dots on the intersections */}
          <instancedMesh args={[null as unknown as THREE.BufferGeometry, null as unknown as THREE.Material, 121]} position={[-0.06, -5, -5]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#0044FF" />
            <DotsInstance />
          </instancedMesh>
        </group>
      ))}
    </group>
  );
}

// Helper for the grid dots
function DotsInstance() {
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    if (!ref.current) return;
    let i = 0;
    for (let y = 0; y <= 10; y++) {
      for (let z = 0; z <= 10; z++) {
        const matrix = new THREE.Matrix4();
        matrix.setPosition(0, y, z);
        ref.current.setMatrixAt(i++, matrix);
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return null;
}

function ScaffoldingLines() {
  // Horizontal lines connecting the planes
  const lineMaterial = new THREE.LineBasicMaterial({ color: "#3E66D8", transparent: true, opacity: 0.3 });
  
  const [lines] = useState(() => {
    const arr = [];
    // Generate a few random Z/Y grid coordinates to connect across X
    for (let i = 0; i < 40; i++) {
      const y = Math.floor(Math.random() * 10) - 5;
      const z = Math.floor(Math.random() * 10) - 5;
      const xStart = Math.floor(Math.random() * 3) * 2 - 2; // -2, 0, 2
      const xEnd = xStart + (Math.floor(Math.random() * 3) + 1) * 2; // spans across sheets
      
      const pts = [
        new THREE.Vector3(xStart, y, z),
        new THREE.Vector3(xEnd, y, z)
      ];
      arr.push(pts);
    }
    return arr;
  });

  return (
    <group>
      {lines.map((pts, i) => (
        <line key={i}>
          <bufferGeometry attach="geometry" />
          <primitive attach="material" object={lineMaterial} />
          <LineGeometry points={pts} />
        </line>
      ))}
    </group>
  );
}

// Helper to construct line geometry
function LineGeometry({ points }: { points: THREE.Vector3[] }) {
  const ref = useRef<THREE.BufferGeometry>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.setFromPoints(points);
    }
  }, [points]);
  return null;
}

function GridParticles({ count = 150, onOrder }: { count?: number; onOrder?: (pct: number) => void }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Snapped to grid
      temp.push({
        x: Math.floor(Math.random() * 8) * 2 - 2, // -2, 0, 2, 4, 6, 8, 10, 12
        y: Math.floor(Math.random() * 10) - 5,
        z: Math.floor(Math.random() * 10) - 5,
        speed: 0.02 + Math.random() * 0.03, // Very slow, deliberate movement
        scale: Math.random() > 0.8 ? 0.8 : 0.4,
        color: Math.random() > 0.6 ? M_NAVY : (Math.random() > 0.5 ? M_LIGHT : M_COBALT),
        targetX: 0
      });
    }
    // Initialize targets
    temp.forEach(p => p.targetX = p.x);
    return temp;
  });

  useEffect(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(p.x, p.y, p.z),
        new THREE.Quaternion(),
        new THREE.Vector3(p.scale, p.scale, p.scale)
      );
      meshRef.current!.setMatrixAt(i, matrix);
      meshRef.current!.setColorAt(i, p.color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [particles]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    let organised = 0;
    
    particles.forEach((p, i) => {
      // Snap movement: they move smoothly but stay aligned to grid Y and Z
      p.x -= p.speed * delta * 60; // Normalize speed
      
      // Reset if it goes into the main cube
      if (p.x < -6) {
        p.x = 12 + Math.random() * 4;
        p.y = Math.floor(Math.random() * 10) - 5;
        p.z = Math.floor(Math.random() * 10) - 5;
      }
      
      if (p.x < 0) organised++;
      
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(p.x, p.y, p.z), // Strict grid Y and Z, no floating
        new THREE.Quaternion(),
        new THREE.Vector3(p.scale, p.scale, p.scale)
      );
      meshRef.current!.setMatrixAt(i, matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;

    if (onOrder) {
      onOrder(Math.round((organised / count) * 100));
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null as unknown as THREE.BufferGeometry, null as unknown as THREE.Material, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial
        metalness={0.3}
        roughness={0.1}
        clearcoat={1.0}
      />
    </instancedMesh>
  );
}

export default function AssemblyField3D({
  still = false,
  onOrder
}: {
  still?: boolean;
  onOrder?: (pct: number) => void;
}) {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas shadows={false} gl={{ antialias: true, alpha: true }}>
        {/* Isometric perspective: looking down at a 45 degree angle, rotated 45 degrees */}
        <OrthographicCamera 
          makeDefault 
          position={[20, 20, 20]} 
          zoom={35} 
          near={-100} 
          far={100}
          onUpdate={c => c.lookAt(0, 0, 0)}
        />
        
        {/* Soft studio lighting */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 20, 15]} intensity={3.5} color="#ffffff" />
        <directionalLight position={[-10, 10, -10]} intensity={1.5} color="#88AAFF" />
        
        {/* We wrap everything in a group to center the visual mass */}
        <group position={[1.5, 0, 0]}>
          <MainCube />
          <GlassSheets />
          <ScaffoldingLines />
          {!still && <GridParticles count={250} onOrder={onOrder} />}
        </group>
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

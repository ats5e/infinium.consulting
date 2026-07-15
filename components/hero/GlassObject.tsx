"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/*
 * The hero polyhedron. Faceted icosahedron of optical glass with a lattice
 * of thin internal planes, per the chosen hero-v1 reference. Rotation
 * 0.0008 rad/frame; cursor adds a damped ±8° tilt; scroll progress
 * (0..1, from the hero timeline) tightens the internal refraction.
 * Procedural Lightformer environment — no HDR fetched from anywhere.
 */

const MAX_TILT = (8 * Math.PI) / 180;

function Polyhedron({ progress }: { progress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    spin.current += 0.0008;
    const p = progress.current ?? 0;
    const tx = state.pointer.y * MAX_TILT;
    const ty = state.pointer.x * MAX_TILT;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, tx + 0.15, 0.06);
    g.rotation.y = spin.current + THREE.MathUtils.lerp(g.rotation.y - spin.current, ty, 0.06);
    // refraction shifts with scroll: the object tightens as it compresses
    g.rotation.z = p * 0.35;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.35, 0]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={1.2}
          roughness={0.05}
          ior={1.45}
          chromaticAberration={0.5}
          anisotropicBlur={0.3}
          distortion={0.2}
          samples={8}
          backside
          backsideThickness={0.6}
          color="#cddef1"
          flatShading
        />
      </mesh>
      {/* internal lattice — thin planes catching the light */}
      {[0.4, -0.3, 0.1].map((offset, i) => (
        <mesh key={i} position={[offset * 0.5, offset, 0]} rotation={[0.6 * i, 0.8 * i, 0.3]}>
          <boxGeometry args={[1.4, 1.4, 0.012]} />
          <meshPhysicalMaterial
            color="#73a8fb"
            emissive="#4c7ef5"
            emissiveIntensity={1.4 + i * 0.3}
            transparent
            opacity={0.55}
            roughness={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function GlassObject({
  progress,
  onContextLost,
}: {
  progress: React.RefObject<number>;
  onContextLost?: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost?.();
        });
      }}
      className="!absolute inset-0"
      aria-hidden
    >
      <directionalLight position={[-4, 5, 3]} intensity={2.2} color="#ffffff" />
      <pointLight position={[4, -1, 2]} intensity={6} color="#365eee" />
      <Polyhedron progress={progress} />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={9} position={[-3, 4, 2]} scale={[4, 3, 1]} color="#f2f7ff" />
        <Lightformer intensity={6} position={[4, 0, 1]} scale={[3, 5, 1]} color="#4c7ef5" />
        <Lightformer intensity={3} position={[0, -4, -2]} scale={[8, 2, 1]} color="#2f55b6" />
        <Lightformer intensity={4} position={[0, 1, -4]} scale={[5, 5, 1]} color="#9ac7f8" />
      </Environment>
    </Canvas>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/*
 * The hero object IS the Infinium icon: the faceted glass cube from the
 * logo — composed as a cluster of three overlapping cubes so the mark
 * reads as a living structure. Face mapping follows the logo (ice-glass
 * top, deep-navy left, bright-cobalt right) with its white refraction
 * edges. The cluster holds the brand pose, sways gently, tilts toward
 * the cursor (±8°, damped) and hands scroll progress to the compression
 * exit in Hero.tsx. LogoCrystal.tsx mirrors the cluster for fallbacks.
 */

const MAX_TILT = (8 * Math.PI) / 180;

// brand pose — the tilt the cube has in the logo lockup: at +y rotation
// the viewer sees the -x face on the left (deep navy) and the +z face on
// the right (bright cobalt), exactly like the mark
const POSE = { x: 0.38, y: 0.62, z: -0.08 };

// BoxGeometry material order: +x, -x, +y, -y, +z, -z
const FACES = [
  { color: "#2f55b6", emissive: "#22365d", intensity: 0.3 }, // +x — mid facet (mostly hidden)
  { color: "#22365d", emissive: "#16244a", intensity: 0.3 }, // -x left — deep navy facet
  { color: "#cddef1", emissive: "#9ac7f8", intensity: 0.22 }, // +y top — refraction highlight
  { color: "#0a1020", emissive: "#0a1020", intensity: 0.15 }, // -y bottom
  { color: "#365eee", emissive: "#365eee", intensity: 0.55 }, // +z right in pose — cobalt core
  { color: "#101f45", emissive: "#0a1020", intensity: 0.2 }, // -z back
] as const;

/* one shared material set + edge geometry for all three cubes */
function useCubeAssets() {
  return useMemo(() => {
    const materials = FACES.map(
      (f) =>
        new THREE.MeshPhysicalMaterial({
          color: f.color,
          emissive: f.emissive,
          emissiveIntensity: f.intensity,
          metalness: 0,
          roughness: 0.08,
          clearcoat: 0.7,
          clearcoatRoughness: 0.25,
          transparent: true,
          opacity: 0.72,
          side: THREE.DoubleSide,
          depthWrite: false,
          envMapIntensity: 1.8,
        })
    );
    const box = new THREE.BoxGeometry(1.9, 1.9, 1.9);
    const edges = new THREE.EdgesGeometry(box);
    return { materials, box, edges };
  }, []);
}

/* three equal bricks in a loose, tumbling cluster — staggered in depth
 * and rotation rather than stacked in a line, each slowly turning on its
 * own axis at its own rate */
const CLUSTER = [
  { scale: 0.72, position: [-0.95, 0.5, -0.75] as const, spin: [0.42, -0.55, 0.18] as const, drift: 0.035, phase: 1.7 },
  { scale: 0.72, position: [0.2, -0.25, 0.15] as const, spin: [-0.12, 0.3, -0.08] as const, drift: -0.05, phase: 0 },
  { scale: 0.72, position: [0.85, 0.85, -1.15] as const, spin: [0.6, 1.05, -0.35] as const, drift: 0.042, phase: 3.4 },
] as const;

function Cube({
  assets,
  scale,
  position,
  spin,
  drift,
  phase,
}: {
  assets: ReturnType<typeof useCubeAssets>;
  scale: number;
  position: readonly [number, number, number];
  spin: readonly [number, number, number];
  drift: number;
  phase: number;
}) {
  const inner = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = inner.current;
    if (!g) return;
    const t = state.clock.elapsedTime + phase;
    // each brick tumbles slowly on its own axis and rate — a live cluster,
    // not a formation
    g.position.y = position[1] + Math.sin(t * 0.4) * 0.05;
    g.position.x = position[0] + Math.cos(t * 0.31) * 0.04;
    g.rotation.x = spin[0] + Math.cos(t * 0.23) * 0.05 + t * drift * 0.4;
    g.rotation.y = spin[1] + t * drift;
    g.rotation.z = spin[2] + Math.sin(t * 0.19) * 0.04;
  });

  return (
    <group ref={inner} position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh geometry={assets.box} material={assets.materials} />
      <lineSegments geometry={assets.edges} renderOrder={3}>
        <lineBasicMaterial color="#e9f6ff" transparent opacity={0.85} depthTest={false} />
      </lineSegments>
      <lineSegments geometry={assets.edges} scale={1.04} renderOrder={2}>
        <lineBasicMaterial color="#73a8fb" transparent opacity={0.18} depthTest={false} />
      </lineSegments>
    </group>
  );
}

/* drifting light-dust around the cluster — the atmosphere the glass sits in */
function Dust() {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 320;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const p = points.current;
    if (!p) return;
    const t = state.clock.elapsedTime;
    p.rotation.y = t * 0.012;
    p.position.y = Math.sin(t * 0.11) * 0.25;
  });

  return (
    <points ref={points} geometry={geometry} renderOrder={0}>
      <pointsMaterial
        color="#73a8fb"
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function LogoCluster({ progress }: { progress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const assets = useCubeAssets();

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = progress.current ?? 0;
    // gentle sway around the brand pose — the icon stays recognisable
    const swayY = Math.sin(t * 0.32) * 0.18;
    const swayX = Math.cos(t * 0.21) * 0.05;
    const tx = state.pointer.y * MAX_TILT;
    const ty = state.pointer.x * MAX_TILT;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, POSE.x + swayX + tx, 0.06);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, POSE.y + swayY + ty, 0.06);
    // the compression exit twists the cluster as it becomes the hairline
    g.rotation.z = POSE.z + p * 0.4;
    g.position.y = Math.sin(t * 0.5) * 0.04;
  });

  return (
    <group ref={group} scale={0.78}>
      {CLUSTER.map((c, i) => (
        <Cube key={i} assets={assets} {...c} />
      ))}
      {/* the inner core of the centre brick — the mark's internal refraction */}
      <mesh rotation={[0.5, 0.7, 0.2]} scale={0.36} renderOrder={0}>
        <boxGeometry args={[1.9, 1.9, 1.9]} />
        <meshPhysicalMaterial
          color="#9ac7f8"
          emissive="#73a8fb"
          emissiveIntensity={1.1}
          roughness={0.2}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
      <pointLight position={[0.6, 1.2, 2.2]} intensity={2.5} color="#73a8fb" />
      <Dust />
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
      dpr={[1, 2]}
      camera={{ position: [0, 0.75, 4.8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        // GPU pressure/driver resets kill the context and leave a dead
        // canvas — fall back to the SVG mark instead
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost?.();
        });
      }}
      className="!absolute inset-0"
      aria-hidden
    >
      {/* key from upper-left, cobalt rim from the right — the logo's lighting */}
      <directionalLight position={[-4, 5, 3]} intensity={2.6} color="#ffffff" />
      <pointLight position={[4, -1, 2]} intensity={7} color="#365eee" />
      <LogoCluster progress={progress} />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={9} position={[-3, 4, 2]} scale={[4, 3, 1]} color="#f2f7ff" />
        <Lightformer intensity={6} position={[4, 0, 1]} scale={[3, 5, 1]} color="#4c7ef5" />
        <Lightformer intensity={3} position={[0, -4, -2]} scale={[8, 2, 1]} color="#2f55b6" />
        <Lightformer intensity={4} position={[0, 1, -4]} scale={[5, 5, 1]} color="#9ac7f8" />
      </Environment>
    </Canvas>
  );
}

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
 * edges. The cluster holds the brand pose, sways gently and tilts toward
 * the cursor (±8°, damped). Each brick is hover-reactive: pointing at one
 * lifts it, quickens its tumble and lights its edges. LogoCrystal.tsx
 * mirrors the cluster for fallbacks.
 */

const MAX_TILT = (8 * Math.PI) / 180;

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

// brand pose — the tilt the cube has in the logo lockup: at +y rotation
// the viewer sees the -x face on the left (deep navy) and the +z face on
// the right (bright cobalt), exactly like the mark
const POSE = { x: 0.38, y: 0.62, z: -0.08 };

// BoxGeometry material order: +x, -x, +y, -y, +z, -z
// Colours sampled from the logo artwork (mirrored in LogoCrystal's
// gradients): bright ice top, deep navy left, vivid cobalt right.
const FACES = [
  { color: "#173866", emissive: "#07152f", intensity: 0.025 }, // +x — dark logo facet
  { color: "#173866", emissive: "#07152f", intensity: 0.03 }, // -x left — logo navy
  { color: "#d7e3f1", emissive: "#73a8fb", intensity: 0.04 }, // +y top — logo ice highlight
  { color: "#07152f", emissive: "#07152f", intensity: 0.02 }, // -y bottom
  { color: "#234fbd", emissive: "#173866", intensity: 0.04 }, // +z right — brand cobalt
  { color: "#102b50", emissive: "#07152f", intensity: 0.025 }, // -z back
] as const;

/* one shared material set + geometry for all three cubes — crisp glass:
 * low roughness, hard clearcoat, strong environment speculars */
function useCubeAssets() {
  return useMemo(() => {
    const materials = FACES.map(
      (f) =>
        new THREE.MeshPhysicalMaterial({
          color: f.color,
          emissive: f.emissive,
          emissiveIntensity: f.intensity,
          metalness: 0,
          roughness: 0.06,
          clearcoat: 1,
          clearcoatRoughness: 0.035,
          transparent: false,
          opacity: 1,
          side: THREE.FrontSide,
          depthWrite: true,
          envMapIntensity: 1.05,
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
  const glowLine = useRef<THREE.LineBasicMaterial>(null);
  const hovered = useRef(false);
  // damped hover springs — lift, growth, tumble speed, edge light
  const spring = useRef({ lift: 0, grow: 0, speed: 1, glow: 0.66 });

  useFrame((state) => {
    const g = inner.current;
    if (!g) return;
    const s = spring.current;
    const on = hovered.current;
    s.lift = THREE.MathUtils.lerp(s.lift, on ? 0.16 : 0, 0.1);
    s.grow = THREE.MathUtils.lerp(s.grow, on ? 0.1 : 0, 0.1);
    s.speed = THREE.MathUtils.lerp(s.speed, on ? 3.4 : 1, 0.06);
    s.glow = THREE.MathUtils.lerp(s.glow, on ? 0.9 : 0.66, 0.12);
    if (glowLine.current) glowLine.current.opacity = s.glow;

    const t = state.clock.elapsedTime + phase;
    // each brick tumbles slowly on its own axis and rate — a live cluster,
    // not a formation; hover quickens the tumble and lifts the brick
    g.position.y = position[1] + Math.sin(t * 0.4) * 0.05 + s.lift;
    g.position.x = position[0] + Math.cos(t * 0.31) * 0.04;
    g.rotation.x = spin[0] + Math.cos(t * 0.23) * 0.05 + t * drift * 0.4 * s.speed;
    g.rotation.y = spin[1] + t * drift * s.speed;
    g.rotation.z = spin[2] + Math.sin(t * 0.19) * 0.04;
    g.scale.setScalar(scale * (1 + s.grow));
  });

  return (
    <group ref={inner} position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh
        geometry={assets.box}
        material={assets.materials}
        onPointerOver={(e) => {
          e.stopPropagation();
          hovered.current = true;
        }}
        onPointerOut={() => {
          hovered.current = false;
        }}
      />
      <lineSegments geometry={assets.edges} renderOrder={2}>
        <lineBasicMaterial ref={glowLine} color="#173866" transparent opacity={0.66} depthTest />
      </lineSegments>
    </group>
  );
}

/* drifting light-dust around the cluster — the atmosphere the glass sits in */
function Dust() {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (seededUnit(i * 3 + 1) - 0.5) * 11;
      positions[i * 3 + 1] = (seededUnit(i * 3 + 2) - 0.5) * 7;
      positions[i * 3 + 2] = (seededUnit(i * 3 + 3) - 0.5) * 5 - 1;
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
        color="#1b57c8"
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

/* satellite bricks at depth — the cluster's field. Far ones barely move
 * with the pointer, near ones sweep: the offset difference IS the depth.
 * [x, y, z, scale, spinX, spinY, drift, phase] — x kept inside the
 * camera frustum at each depth so nothing is ever cut mid-frame. */
const SATELLITES = [
  [-1.55, 1.55, -2.4, 0.2, 0.5, 1.1, 0.06, 0.4],
  [1.7, -1.5, -2.2, 0.24, 1.2, 0.4, -0.05, 2.1],
  [-1.35, -1.7, -1.9, 0.16, 0.8, 2.1, 0.07, 4.4],
  [1.45, 1.8, -2.5, 0.28, 2.0, 0.9, -0.045, 1.2],
  [-1.7, 0.25, -2.6, 0.14, 0.3, 1.6, 0.08, 3.3],
  [0.5, 2.0, -1.6, 0.12, 1.5, 0.2, -0.07, 5.0],
] as const;

function Satellites({ assets }: { assets: ReturnType<typeof useCubeAssets> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const px = state.pointer.x;
    const py = state.pointer.y;
    g.children.forEach((child, i) => {
      const s = SATELLITES[i];
      if (!s) return;
      const t = state.clock.elapsedTime + s[7];
      const depth = (s[2] + 2.6) / 3.2; // 0 far → 1 near
      const targetX = s[0] + px * (0.1 + depth * 0.5);
      const targetY = s[1] + py * (0.07 + depth * 0.34) + Math.sin(t * 0.35) * 0.05;
      child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, 0.06);
      child.position.y = THREE.MathUtils.lerp(child.position.y, targetY, 0.06);
      child.rotation.x = s[4] + t * s[6];
      child.rotation.y = s[5] + t * s[6] * 1.4;
    });
  });

  return (
    <group ref={group}>
      {SATELLITES.map((s, i) => (
        <group key={i} position={[s[0], s[1], s[2]]} scale={s[3]}>
          <mesh geometry={assets.box} material={assets.materials} />
          <lineSegments geometry={assets.edges}>
            <lineBasicMaterial color="#173866" transparent opacity={0.64} depthTest />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

/* a light that travels with the cursor — glints sweep the glass as the
 * pointer moves */
function CursorLight() {
  const light = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const l = light.current;
    if (!l) return;
    l.position.x = THREE.MathUtils.lerp(l.position.x, state.pointer.x * 3.4, 0.07);
    l.position.y = THREE.MathUtils.lerp(l.position.y, state.pointer.y * 2.2, 0.07);
  });
  return <pointLight ref={light} position={[0, 0, 2.4]} intensity={1.5} distance={8} decay={1.6} color="#365eee" />;
}

function LogoCluster({ assets }: { assets: ReturnType<typeof useCubeAssets> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // gentle sway around the brand pose — the icon stays recognisable
    const swayY = Math.sin(t * 0.32) * 0.18;
    const swayX = Math.cos(t * 0.21) * 0.05;
    const tx = state.pointer.y * MAX_TILT;
    const ty = state.pointer.x * MAX_TILT;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, POSE.x + swayX + tx, 0.06);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, POSE.y + swayY + ty, 0.06);
    g.rotation.z = POSE.z;
    g.position.y = Math.sin(t * 0.5) * 0.04;
  });

  return (
    <group ref={group} scale={0.72}>
      {CLUSTER.map((c, i) => (
        <Cube key={i} assets={assets} {...c} />
      ))}
      {/* the inner core of the centre brick — the mark's internal refraction */}
      <mesh rotation={[0.5, 0.7, 0.2]} scale={0.36} renderOrder={0}>
        <boxGeometry args={[1.9, 1.9, 1.9]} />
        <meshPhysicalMaterial
          color="#2f55b6"
          emissive="#1e3f9e"
          emissiveIntensity={0.14}
          roughness={0.2}
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </mesh>
      <pointLight position={[0.6, 1.2, 2.2]} intensity={0.8} color="#365eee" />
      <Dust />
    </group>
  );
}

/* one shared material set feeds the cluster and its satellite field */
function Scene() {
  const assets = useCubeAssets();
  return (
    <group position={[0.45, 0, 0]}>
      <LogoCluster assets={assets} />
      <Satellites assets={assets} />
      <CursorLight />
    </group>
  );
}

export default function GlassObject({
  onContextLost,
}: {
  onContextLost?: () => void;
}) {
  return (
    <Canvas
      dpr={[1.5, 2]}
      camera={{ position: [0, 0.6, 5.6], fov: 42 }}
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
      <directionalLight position={[-4, 5, 3]} intensity={1.15} color="#ffffff" />
      <pointLight position={[4, -1, 2]} intensity={1.65} color="#234fbd" />
      <pointLight position={[-3.5, -2, 1]} intensity={1.6} color="#173866" />
      <Scene />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={4} position={[-3, 4, 2]} scale={[4, 3, 1]} color="#f2f7ff" />
        <Lightformer intensity={1.8} position={[4, 0, 1]} scale={[3, 5, 1]} color="#365eee" />
        <Lightformer intensity={2} position={[0, -4, -2]} scale={[8, 2, 1]} color="#22365d" />
        <Lightformer intensity={0.9} position={[0, 1, -4]} scale={[5, 5, 1]} color="#9ac7f8" />
      </Environment>
    </Canvas>
  );
}

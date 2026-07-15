"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/*
 * The hero object IS the Infinium icon: three equal glass cubes tumbling
 * in a loose cluster. This build uses true refraction — a transmission
 * material bending an in-scene light field (the backdrop plane), so the
 * cubes read as optical glass, not tinted panes. Facet colour comes from
 * the logo's lighting story: white key upper-left, cobalt from the right,
 * navy fill low-left. Cluster holds the brand pose, sways, tilts with the
 * cursor and hands scroll progress to the compression exit in Hero.tsx.
 */

const MAX_TILT = (8 * Math.PI) / 180;
const POSE = { x: 0.38, y: 0.62, z: -0.08 };

/* three equal bricks in a loose, tumbling cluster */
const CLUSTER = [
  { position: [-0.95, 0.5, -0.75] as const, spin: [0.42, -0.55, 0.18] as const, drift: 0.035, phase: 1.7 },
  { position: [0.2, -0.25, 0.15] as const, spin: [-0.12, 0.3, -0.08] as const, drift: -0.05, phase: 0 },
  { position: [0.85, 0.85, -1.15] as const, spin: [0.6, 1.05, -0.35] as const, drift: 0.042, phase: 3.4 },
] as const;

/* the light field the glass refracts — painted once, lives behind the cluster */
function useBackdropTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#05070c";
    ctx.fillRect(0, 0, 512, 384);
    const paint = (x: number, y: number, r: number, stops: Array<[number, string]>) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      for (const [o, c] of stops) g.addColorStop(o, c);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 384);
    };
    paint(340, 190, 260, [[0, "rgba(54,94,238,0.55)"], [0.4, "rgba(34,54,93,0.3)"], [1, "rgba(5,7,12,0)"]]);
    paint(120, 90, 200, [[0, "rgba(154,199,248,0.28)"], [1, "rgba(5,7,12,0)"]]);
    paint(180, 330, 220, [[0, "rgba(14,26,58,0.5)"], [1, "rgba(5,7,12,0)"]]);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Backdrop() {
  const texture = useBackdropTexture();
  return (
    <mesh position={[0, 0, -7]} renderOrder={-1}>
      <planeGeometry args={[30, 20]} />
      <meshBasicMaterial map={texture} depthWrite={false} />
    </mesh>
  );
}

/* drifting light-dust around the cluster */
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

function Cube({
  geometry,
  edges,
  position,
  spin,
  drift,
  phase,
}: {
  geometry: THREE.BoxGeometry;
  edges: THREE.EdgesGeometry;
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
    g.position.y = position[1] + Math.sin(t * 0.4) * 0.05;
    g.position.x = position[0] + Math.cos(t * 0.31) * 0.04;
    g.rotation.x = spin[0] + Math.cos(t * 0.23) * 0.05 + t * drift * 0.4;
    g.rotation.y = spin[1] + t * drift;
    g.rotation.z = spin[2] + Math.sin(t * 0.19) * 0.04;
  });

  return (
    <group ref={inner} position={[position[0], position[1], position[2]]} scale={0.72}>
      <mesh geometry={geometry}>
        <MeshTransmissionMaterial
          transmission={1}
          thickness={1.35}
          roughness={0.04}
          ior={1.5}
          chromaticAberration={0.55}
          anisotropicBlur={0.25}
          distortion={0.22}
          distortionScale={0.45}
          temporalDistortion={0.06}
          samples={6}
          resolution={768}
          backside
          backsideThickness={0.45}
          color="#cddef1"
          attenuationColor="#365eee"
          attenuationDistance={2.6}
        />
      </mesh>
      <lineSegments geometry={edges} renderOrder={3}>
        <lineBasicMaterial color="#e9f6ff" transparent opacity={0.8} depthTest={false} />
      </lineSegments>
      <lineSegments geometry={edges} scale={1.045} renderOrder={2}>
        <lineBasicMaterial color="#73a8fb" transparent opacity={0.2} depthTest={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}

function LogoCluster({ progress }: { progress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const assets = useMemo(() => {
    const box = new THREE.BoxGeometry(1.9, 1.9, 1.9);
    return { box, edges: new THREE.EdgesGeometry(box) };
  }, []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = progress.current ?? 0;
    const swayY = Math.sin(t * 0.32) * 0.18;
    const swayX = Math.cos(t * 0.21) * 0.05;
    const tx = state.pointer.y * MAX_TILT;
    const ty = state.pointer.x * MAX_TILT;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, POSE.x + swayX + tx, 0.06);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, POSE.y + swayY + ty, 0.06);
    g.rotation.z = POSE.z + p * 0.4;
    g.position.y = Math.sin(t * 0.5) * 0.04;
  });

  return (
    <group ref={group} scale={0.78}>
      {CLUSTER.map((c, i) => (
        <Cube key={i} geometry={assets.box} edges={assets.edges} {...c} />
      ))}
      {/* the inner core of the centre brick — the mark's internal refraction */}
      <mesh rotation={[0.5, 0.7, 0.2]} scale={0.36} renderOrder={0}>
        <boxGeometry args={[1.9, 1.9, 1.9]} />
        <meshPhysicalMaterial
          color="#9ac7f8"
          emissive="#73a8fb"
          emissiveIntensity={1.2}
          roughness={0.2}
          transparent
          opacity={0.32}
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
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost?.();
        });
      }}
      className="!absolute inset-0"
      aria-hidden
    >
      {/* the logo's lighting story: white key upper-left, cobalt right, navy fill */}
      <directionalLight position={[-4, 5, 3]} intensity={2.4} color="#ffffff" />
      <pointLight position={[4, -1, 2]} intensity={7} color="#365eee" />
      <pointLight position={[-3.5, -2, 1]} intensity={2} color="#22365d" />
      <Backdrop />
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

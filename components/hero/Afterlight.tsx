"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/*
 * AFTERLIGHT — the brand material.
 *
 * The pattern light makes after passing through glass, cast on paper.
 * The glass is never shown; only its consequence. A full-viewport
 * fragment shader: three drifting refraction layers sharpened into
 * caustic filaments, pooled off-centre, tinted from paper through ice
 * to a warm white core with the faintest cobalt bias. It breathes on a
 * ~20s period — the only thing on the brand's pages that never stops
 * moving — and leans slowly toward the cursor, like attention.
 */

const vertex = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uPointer;   // -1..1, lerped outside
  uniform float uIntensity; // entrance 0..1

  // hash + voronoi-style caustic filaments
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }

  // true caustic filaments: light gathers on voronoi cell BORDERS
  // (F2 - F1 ≈ 0), forming a connected web of thin bright lines —
  // never dots, never bubbles
  float caustic(vec2 uv, float t) {
    vec2 g = floor(uv);
    vec2 f = fract(uv);
    float f1 = 8.0;
    float f2 = 8.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 o = vec2(float(x), float(y));
        vec2 r = hash2(g + o);
        vec2 p = o + 0.5 + 0.42 * sin(t + 6.2831 * r) - f;
        float d = dot(p, p);
        if (d < f1) { f2 = f1; f1 = d; }
        else if (d < f2) { f2 = d; }
      }
    }
    float edge = sqrt(f2) - sqrt(f1);
    return pow(1.0 - smoothstep(0.0, 0.26, edge), 3.0);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    // one pool: off-centre right, tight falloff, leaning to the pointer
    vec2 centre = vec2(0.24 * aspect, 0.03) + uPointer * vec2(0.10 * aspect, 0.07);
    float dist = length(p - centre);
    float pool = smoothstep(0.62, 0.1, dist);
    pool = pool * pool;

    float t = uTime * 0.05; // the 20-second breath
    float c1 = caustic((p - centre) * 2.2 + 5.0, t * 6.2831);
    float c2 = caustic((p - centre) * 3.9 + 11.0, t * 6.2831 * 1.31 + 2.0);
    float light = (c1 * 0.8 + c2 * 0.45) * pool * uIntensity;

    // paper -> ice -> warm white core, with the faintest cobalt bias
    vec3 paper = vec3(0.9686, 0.9765, 0.9882);       // #f7f9fc
    vec3 ice = vec3(0.898, 0.9333, 0.9804);
    vec3 core = vec3(1.0, 1.0, 1.0);
    vec3 cobalt = vec3(0.137, 0.310, 0.741);

    vec3 col = paper;
    col = mix(col, ice, smoothstep(0.0, 0.5, light));
    col = mix(col, core, smoothstep(0.45, 1.1, light));
    // a whisper of ink where filaments cross the pool's edge
    float rim = pool * (1.0 - pool) * 4.0;
    col = mix(col, mix(col, cobalt, 0.16), rim * light * uIntensity);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function LightField({ reduced }: { reduced: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: reduced ? 34.0 : 0.0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: reduced ? 1.0 : 0.0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state, delta) => {
    const m = material.current;
    if (!m) return;
    m.uniforms.uResolution.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
    if (!reduced) {
      m.uniforms.uTime.value += delta;
      // the light warms in once, then only breathes
      m.uniforms.uIntensity.value = Math.min(1, m.uniforms.uIntensity.value + delta * 0.55);
      pointer.current.lerp(state.pointer, 0.02);
      m.uniforms.uPointer.value.copy(pointer.current);
    }
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Afterlight({
  reduced,
  onContextLost,
}: {
  reduced: boolean;
  onContextLost?: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost?.();
        });
      }}
      className="!absolute inset-0"
      aria-hidden
    >
      <LightField reduced={reduced} />
    </Canvas>
  );
}

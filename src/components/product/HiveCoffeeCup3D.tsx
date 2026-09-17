"use client";

import { Component, Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { prefersReducedMotion, onReducedMotionChange } from "@/lib/animation/reducedMotion";

const MODEL_URL = "/models/hive-coffee-cup.glb";
const AUTO_ROTATE_SPEED = 2.1; // ~ -0.22 rad/s, matches three.js's "seconds per orbit at 60fps" scale
const REDUCED_MOTION_SPIN_FACTOR = 0.3; // crawl, don't freeze, under prefers-reduced-motion
const TARGET_HEIGHT = 1.80; // normalized scene height — reduced from 2.05 so the tilted lid clears the frame
const DOWN_SHIFT = 0.12; // nudges the model down within the frame, adding headroom above the lid

// Camera starts at a 26° azimuth for a 3/4 view (not a flat front-on shot)
// and a 70° polar angle (a gentle downward look, per three.js convention
// where 90° is dead-on eye-level and 0° is straight down) so the lid and
// cup rim are visible by default, not just the side wall.
const ORBIT_DISTANCE = 5.5;
const INITIAL_POLAR_DEG = 70;
const INITIAL_AZIMUTH_DEG = 26;
const LEAN_TILT_DEG = 7; // slight static lean to the left, product-shot style
const LEAN_TILT_RAD = THREE.MathUtils.degToRad(LEAN_TILT_DEG);
const polarRad = THREE.MathUtils.degToRad(INITIAL_POLAR_DEG);
const azimuthRad = THREE.MathUtils.degToRad(INITIAL_AZIMUTH_DEG);
const orbitHorizontal = ORBIT_DISTANCE * Math.sin(polarRad);
const START_POSITION: [number, number, number] = [
  orbitHorizontal * Math.sin(azimuthRad),
  ORBIT_DISTANCE * Math.cos(polarRad),
  orbitHorizontal * Math.cos(azimuthRad),
];

/** Centers the model on the origin and scales it to TARGET_HEIGHT, so camera
 * framing never depends on the exact dimensions baked into the GLB. */
function useAutoFramedScene(source: THREE.Object3D) {
  return useMemo(() => {
    const model = source.clone(true);
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    model.position.sub(center);
    const scale = size.y > 0 ? TARGET_HEIGHT / size.y : 1;
    model.scale.setScalar(scale);
    model.position.y -= DOWN_SHIFT;
    return model;
  }, [source]);
}

function HiveCupModel() {
  const { scene } = useGLTF(MODEL_URL);
  const framed = useAutoFramedScene(scene);
  return <primitive object={framed} />;
}

/** Placeholder shown until public/models/hive-coffee-cup.glb loads (or if it errors). */
function FallbackCup() {
  return (
    <group scale={0.878} position={[0, -DOWN_SHIFT / 0.878, 0]}>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.55, 0.42, 1.7, 24]} />
        <meshStandardMaterial color="#f8f4ea" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.16, 24]} />
        <meshStandardMaterial color="#1c1a19" roughness={0.32} />
      </mesh>
    </group>
  );
}

class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function StudioLighting() {
  return (
    <>
      <hemisphereLight args={["#fdf6ec", "#241812", 0.55]} />
      <directionalLight position={[2.4, 3.2, 2.6]} intensity={1.15} color="#fff6e8" />
      <directionalLight position={[-2.6, 1.4, -1.8]} intensity={0.32} color="#dbe6ff" />
      <directionalLight position={[0, 1.6, -3]} intensity={0.38} color="#fff2df" />
    </>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(prefersReducedMotion());
    return onReducedMotionChange(setReduced);
  }, []);
  return reduced;
}

export function HiveCoffeeCup3D() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <PerspectiveCamera makeDefault fov={27} position={START_POSITION} />
      <StudioLighting />
      <Suspense fallback={null}>
        <group rotation={[0, 0, LEAN_TILT_RAD]}>
          <ModelErrorBoundary fallback={<FallbackCup />}>
            <HiveCupModel />
          </ModelErrorBoundary>
        </group>
        <ContactShadows position={[0, -1.02, 0]} opacity={0.38} scale={4} blur={2.6} far={1.4} color="#160d09" />
      </Suspense>
      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        autoRotate
        autoRotateSpeed={reduced ? AUTO_ROTATE_SPEED * REDUCED_MOTION_SPIN_FACTOR : AUTO_ROTATE_SPEED}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        minPolarAngle={THREE.MathUtils.degToRad(32)}
        maxPolarAngle={THREE.MathUtils.degToRad(95)}
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.ROTATE }}
      />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);

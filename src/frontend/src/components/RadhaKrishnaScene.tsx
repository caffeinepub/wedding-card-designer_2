import { Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// ─── Camera Orbit ─────────────────────────────────────────────────────────────
function CameraOrbit() {
  const { camera } = useThree();
  const t = useRef(0);
  useFrame((_, delta) => {
    t.current += delta;
    const angle = (t.current / 30) * Math.PI * 2;
    const radius = 8;
    camera.position.x = Math.sin(angle) * radius;
    camera.position.y = 3 + Math.sin(t.current * 0.1) * 0.3;
    camera.position.z = Math.cos(angle) * radius;
    camera.lookAt(0, 1.5, 0);
  });
  return null;
}

function Moon() {
  return (
    <group position={[-4, 6, -8]}>
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#fffde7"
          emissive="#fff9c4"
          emissiveIntensity={1.2}
          roughness={0.8}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshStandardMaterial
          color="#fff8e1"
          emissive="#fff176"
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <circleGeometry args={[18, 64]} />
      <meshStandardMaterial
        color="#3d2b00"
        emissive="#7c5c00"
        emissiveIntensity={0.12}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}

function MistParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 120;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = -1.2 + Math.random() * 1.2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    return arr;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        color="#c8b89a"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

function RosePetals() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 200;
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * 14 + 1,
        z: (Math.random() - 0.5) * 20,
        speed: 0.3 + Math.random() * 0.5,
        rotSpeed: (Math.random() - 0.5) * 2,
        sway: Math.random() * Math.PI * 2,
      })),
    [],
  );
  useFrame((state) => {
    if (!ref.current) return;
    const matrix = new THREE.Matrix4();
    const quat = new THREE.Quaternion();
    const pos = new THREE.Vector3();
    const scale = new THREE.Vector3(1, 1, 1);
    data.forEach((p, i) => {
      const t = state.clock.elapsedTime;
      let y = p.y - ((t * p.speed) % 15);
      if (y < -1.5) y += 15;
      const x = p.x + Math.sin(t * 0.5 + p.sway) * 0.4;
      pos.set(x, y, p.z);
      quat.setFromEuler(
        new THREE.Euler(
          Math.sin(t * p.rotSpeed) * 0.8,
          t * p.rotSpeed * 0.5,
          Math.cos(t * p.rotSpeed) * 0.8,
        ),
      );
      matrix.compose(pos, quat, scale);
      ref.current!.setMatrixAt(i, matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.12, 0.18]} />
      <meshStandardMaterial
        color="#ff69b4"
        emissive="#c2185b"
        emissiveIntensity={0.4}
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
      />
    </instancedMesh>
  );
}

function GoldenSparkles() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 150;
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 6,
        y: Math.random() * 6 - 1,
        z: (Math.random() - 0.5) * 6,
        speed: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );
  useFrame((state) => {
    if (!ref.current) return;
    const matrix = new THREE.Matrix4();
    const quat = new THREE.Quaternion();
    const pos = new THREE.Vector3();
    const scale = new THREE.Vector3();
    data.forEach((p, i) => {
      const t = state.clock.elapsedTime;
      let y = p.y + ((t * p.speed) % 8);
      if (y > 7) y -= 8;
      pos.set(p.x + Math.sin(t * 0.3 + p.phase) * 0.3, y, p.z);
      const s = 0.04 + Math.sin(t * 2 + p.phase) * 0.02;
      scale.set(s, s, s);
      quat.identity();
      matrix.compose(pos, quat, scale);
      ref.current!.setMatrixAt(i, matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FFD700"
        emissiveIntensity={3}
      />
    </instancedMesh>
  );
}

function LotusFlower({ position }: { position: [number, number, number] }) {
  const petalCount = 8;
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.25, 0.3, 0.08, 16]} />
        <meshStandardMaterial
          color="#4caf50"
          emissive="#388e3c"
          emissiveIntensity={0.3}
        />
      </mesh>
      {Array.from({ length: petalCount }, (_, i) => {
        const angle = (i / petalCount) * Math.PI * 2;
        return (
          <mesh
            key={angle.toFixed(4)}
            position={[Math.sin(angle) * 0.22, 0.1, Math.cos(angle) * 0.22]}
            rotation={[Math.PI / 3, 0, angle]}
          >
            <coneGeometry args={[0.1, 0.28, 6]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#f8bbd0" : "#fff9c4"}
              emissive={i % 2 === 0 ? "#f48fb1" : "#fff176"}
              emissiveIntensity={0.5}
              transparent
              opacity={0.9}
            />
          </mesh>
        );
      })}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

function AuraSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
      ref.current.scale.set(s, s, s);
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });
  return (
    <mesh ref={ref} position={[0, 1.2, 0]}>
      <sphereGeometry args={[2.6, 32, 32]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FFD700"
        emissiveIntensity={0.3}
        transparent
        opacity={0.07}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function KrishnaFigure() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });
  return (
    <group ref={groupRef} position={[-0.6, 0, 0]}>
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.9, 12]} />
        <meshStandardMaterial
          color="#1a237e"
          emissive="#283593"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.28, 0.22, 1.0, 12]} />
        <meshStandardMaterial
          color="#1565c0"
          emissive="#1a237e"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <torusGeometry args={[0.28, 0.04, 8, 20]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.2, 10]} />
        <meshStandardMaterial
          color="#1565c0"
          emissive="#1a237e"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial
          color="#283593"
          emissive="#1a237e"
          emissiveIntensity={0.7}
        />
      </mesh>
      <mesh position={[0, 1.08, 0.18]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color="#bbdefb"
          emissive="#90caf9"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1}
        />
      </mesh>
      {[-0.16, -0.08, 0, 0.08, 0.16].map((x, featherIdx) => (
        <mesh
          key={x}
          position={[x, 1.55 + Math.abs(x) * 0.3, 0]}
          rotation={[0, 0, x * 5]}
        >
          <planeGeometry args={[0.06, 0.3]} />
          <meshStandardMaterial
            color={
              featherIdx === 2
                ? "#1de9b6"
                : featherIdx % 2 === 0
                  ? "#00e676"
                  : "#40c4ff"
            }
            emissive={featherIdx === 2 ? "#1de9b6" : "#00e676"}
            emissiveIntensity={1.5}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
      <mesh position={[0.45, 0.1, 0.1]} rotation={[0.1, 0, -0.3]}>
        <cylinderGeometry args={[0.022, 0.018, 0.85, 8]} />
        <meshStandardMaterial
          color="#a5860a"
          emissive="#c9a227"
          emissiveIntensity={0.8}
          metalness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <torusGeometry args={[0.15, 0.025, 8, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[-0.38, 0.2, 0]} rotation={[0, 0, Math.PI / 5]}>
        <cylinderGeometry args={[0.07, 0.06, 0.55, 8]} />
        <meshStandardMaterial
          color="#1565c0"
          emissive="#1a237e"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0.38, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.07, 0.06, 0.55, 8]} />
        <meshStandardMaterial
          color="#1565c0"
          emissive="#1a237e"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function RadhaFigure() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.8 + 0.7) * 0.08;
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3 + 0.3) * 0.06 + 0.2;
    }
  });
  return (
    <group ref={groupRef} position={[0.85, 0, 0]}>
      <mesh position={[0, -0.65, 0]}>
        <coneGeometry args={[0.52, 1.0, 16]} />
        <meshStandardMaterial
          color="#e91e63"
          emissive="#c2185b"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[0, -1.1, 0]}>
        <torusGeometry args={[0.52, 0.04, 8, 24]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1.2}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.85, 12]} />
        <meshStandardMaterial
          color="#f48fb1"
          emissive="#e91e63"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0.25, 0.3, -0.05]} rotation={[0.1, 0, 0.4]}>
        <planeGeometry args={[0.5, 0.9]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#ffc107"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.09, 0.1, 0.18, 10]} />
        <meshStandardMaterial
          color="#f48fb1"
          emissive="#e91e63"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshStandardMaterial
          color="#fce4ec"
          emissive="#f8bbd0"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[0, 1.17, 0.15]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0, 1.15, -0.1]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial
          color="#1a0a00"
          emissive="#2d1200"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[-0.1, 1.2, -0.05]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color="#ff80ab"
          emissive="#ff4081"
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[0.12, 0.02, 8, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1.5}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[-0.32, 0.1, 0]} rotation={[0, 0, Math.PI / 5]}>
        <cylinderGeometry args={[0.06, 0.05, 0.48, 8]} />
        <meshStandardMaterial
          color="#f48fb1"
          emissive="#e91e63"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0.32, 0.1, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <cylinderGeometry args={[0.06, 0.05, 0.48, 8]} />
        <meshStandardMaterial
          color="#f48fb1"
          emissive="#e91e63"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

function KalindTree({
  position,
  scale,
}: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 2.5, 8]} />
        <meshStandardMaterial
          color="#2d1b0e"
          emissive="#3e2723"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.9, 12, 12]} />
        <meshStandardMaterial
          color="#1b5e20"
          emissive="#2e7d32"
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0.5, 2.2, 0]}>
        <sphereGeometry args={[0.55, 10, 10]} />
        <meshStandardMaterial
          color="#2e7d32"
          emissive="#388e3c"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

function DivineRays() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current)
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });
  return (
    <group ref={groupRef} position={[0, 1.5, 0]}>
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh
            key={angle.toFixed(4)}
            position={[Math.sin(angle) * 0.1, 0, Math.cos(angle) * 0.1]}
            rotation={[0, angle, 0]}
          >
            <planeGeometry args={[0.06, 5]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.8}
              transparent
              opacity={0.04 + (i % 3) * 0.015}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function SceneContents() {
  return (
    <>
      <CameraOrbit />
      <ambientLight color="#ffe082" intensity={0.5} />
      <pointLight
        position={[0, 5, 0]}
        color="#FFD700"
        intensity={3}
        distance={20}
      />
      <pointLight
        position={[-3, 3, -3]}
        color="#1565c0"
        intensity={1.5}
        distance={15}
      />
      <spotLight
        position={[2, 8, 2]}
        color="#fff9c4"
        intensity={2.5}
        angle={0.5}
        penumbra={0.6}
        castShadow
      />
      <pointLight
        position={[3, 1, 3]}
        color="#ff80ab"
        intensity={0.8}
        distance={10}
      />
      <Stars
        radius={60}
        depth={40}
        count={500}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      <Moon />
      <Ground />
      <MistParticles />
      <AuraSphere />
      <DivineRays />
      <KrishnaFigure />
      <RadhaFigure />
      <LotusFlower position={[-2.5, -1.45, 1.5]} />
      <LotusFlower position={[2.5, -1.45, 1.2]} />
      <LotusFlower position={[0, -1.45, 2.8]} />
      <LotusFlower position={[-3.2, -1.45, -1.0]} />
      <LotusFlower position={[3.0, -1.45, -0.8]} />
      <LotusFlower position={[1.2, -1.45, -2.5]} />
      <LotusFlower position={[-1.5, -1.45, -2.2]} />
      <KalindTree position={[-5.5, -1.5, -3]} scale={1} />
      <KalindTree position={[5, -1.5, -4]} scale={0.85} />
      <KalindTree position={[-6, -1.5, 2]} scale={1.1} />
      <KalindTree position={[5.5, -1.5, 3]} scale={0.9} />
      <RosePetals />
      <GoldenSparkles />
    </>
  );
}

// ─── Music Player ─────────────────────────────────────────────────────────────
function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <>
      {/* Hidden audio element - Hare Krishna Bhajan */}
      {/* biome-ignore lint/a11y/useMediaCaption: bhajan background music */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        src="https://archive.org/download/HareKrishnaMahaMantra_201507/Hare%20Krishna%20Maha%20Mantra.mp3"
      />

      {/* Music control button */}
      <div className="absolute top-4 right-4 z-30 flex flex-col items-center gap-2">
        <button
          type="button"
          data-ocid="music.toggle"
          onClick={toggle}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: playing ? "rgba(255,215,0,0.25)" : "rgba(10,10,40,0.7)",
            border: "1.5px solid rgba(255,215,0,0.6)",
            color: "#FFD700",
            fontSize: 22,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            boxShadow: playing
              ? "0 0 18px rgba(255,215,0,0.5)"
              : "0 0 8px rgba(255,215,0,0.2)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title={playing ? "Music Band Karo" : "Bhajan Chalao"}
        >
          {playing ? "🔊" : "🎵"}
        </button>
        {playing && (
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => {
              const v = Number.parseFloat(e.target.value);
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
            }}
            style={{
              width: 52,
              accentColor: "#FFD700",
              cursor: "pointer",
            }}
            title="Volume"
          />
        )}
        <span
          style={{
            fontSize: "0.55rem",
            color: "rgba(255,215,0,0.6)",
            letterSpacing: "0.1em",
            textAlign: "center",
          }}
        >
          {playing ? "Bhajan" : "Music"}
        </span>
      </div>
    </>
  );
}

// ─── Image Panels ─────────────────────────────────────────────────────────────
function ImagePanels() {
  return (
    <>
      {/* Krishna Photo - Left Panel */}
      <div
        className="absolute left-4 top-1/2 z-20"
        style={{
          transform: "translateY(-50%)",
          width: "clamp(90px, 14vw, 160px)",
        }}
      >
        <div
          style={{
            border: "2px solid rgba(255,215,0,0.6)",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow:
              "0 0 24px rgba(255,215,0,0.35), 0 0 60px rgba(255,215,0,0.1)",
            background: "rgba(5,5,25,0.4)",
          }}
        >
          <img
            src="/assets/generated/krishna_divine.dim_800x1000.jpg"
            alt="Shri Krishna"
            style={{ width: "100%", display: "block", objectFit: "cover" }}
          />
        </div>
        <p
          style={{
            textAlign: "center",
            color: "#FFD700",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            marginTop: 6,
            textShadow: "0 0 10px rgba(255,215,0,0.7)",
            fontFamily: "'Noto Sans Devanagari', serif",
          }}
        >
          🪈 श्री कृष्ण
        </p>
      </div>

      {/* Radha Krishna Together - Right Panel */}
      <div
        className="absolute right-4 top-1/2 z-20"
        style={{
          transform: "translateY(-50%)",
          width: "clamp(90px, 14vw, 160px)",
        }}
      >
        <div
          style={{
            border: "2px solid rgba(255,150,200,0.6)",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow:
              "0 0 24px rgba(255,100,180,0.35), 0 0 60px rgba(255,100,180,0.1)",
            background: "rgba(5,5,25,0.4)",
          }}
        >
          <img
            src="/assets/generated/radha_krishna_together.dim_800x1000.jpg"
            alt="Radha Krishna"
            style={{ width: "100%", display: "block", objectFit: "cover" }}
          />
        </div>
        <p
          style={{
            textAlign: "center",
            color: "#FFD700",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            marginTop: 6,
            textShadow: "0 0 10px rgba(255,215,0,0.7)",
            fontFamily: "'Noto Sans Devanagari', serif",
          }}
        >
          🌸 राधे कृष्ण
        </p>
      </div>
    </>
  );
}

// ─── UI Overlay ───────────────────────────────────────────────────────────────
function UIOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between py-8 z-10">
      <div
        className="absolute inset-3 pointer-events-none"
        style={{
          border: "1.5px solid rgba(255, 215, 0, 0.35)",
          boxShadow:
            "inset 0 0 60px rgba(255,215,0,0.04), 0 0 40px rgba(255,215,0,0.06)",
        }}
      />
      {[
        "top-3 left-3",
        "top-3 right-3",
        "bottom-3 left-3",
        "bottom-3 right-3",
      ].map((pos) => {
        const isTop = pos.includes("top");
        const isLeft = pos.includes("left");
        return (
          <div
            key={pos}
            className={`absolute ${pos} w-10 h-10`}
            style={{
              borderTop: isTop ? "2px solid #FFD700" : "none",
              borderBottom: !isTop ? "2px solid #FFD700" : "none",
              borderLeft: isLeft ? "2px solid #FFD700" : "none",
              borderRight: !isLeft ? "2px solid #FFD700" : "none",
            }}
          />
        );
      })}
      <div className="flex flex-col items-center gap-3 mt-6">
        <div
          className="text-center px-8 py-3"
          style={{
            background: "rgba(5, 5, 25, 0.55)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,215,0,0.3)",
            borderRadius: "4px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.6rem, 4vw, 3.2rem)",
              color: "#FFD700",
              textShadow:
                "0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.4)",
              letterSpacing: "0.12em",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            🪈 Radhe Radhe 🪈
          </h1>
        </div>
        <p
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(0.7rem, 1.5vw, 1rem)",
            color: "rgba(255, 215, 0, 0.6)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Divine Vrindavan Leela
        </p>
      </div>
      <div
        className="flex flex-col items-center gap-2 mb-4"
        style={{
          background: "rgba(5, 5, 25, 0.55)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,215,0,0.25)",
          borderRadius: "4px",
          padding: "12px 32px",
        }}
      >
        <p
          style={{
            fontFamily: "'Noto Sans Devanagari', 'Playfair Display', serif",
            fontSize: "clamp(1.2rem, 3vw, 2.2rem)",
            color: "#FFD700",
            textShadow: "0 0 20px rgba(255,215,0,0.7)",
            letterSpacing: "0.08em",
          }}
        >
          राधे कृष्ण
        </p>
        <p
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(0.65rem, 1.2vw, 0.85rem)",
            color: "rgba(255, 200, 100, 0.5)",
            letterSpacing: "0.25em",
          }}
        >
          ✦ हरे कृष्ण हरे राम ✦
        </p>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function RadhaKrishnaScene() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#050518" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('/assets/generated/radha-krishna-bg.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.25,
        }}
      />

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-1">
        <Canvas
          camera={{ position: [0, 3, 8], fov: 60 }}
          shadows
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <SceneContents />
        </Canvas>
      </div>

      {/* HTML Overlay */}
      <UIOverlay />

      {/* Photo Panels */}
      <ImagePanels />

      {/* Music Player */}
      <MusicPlayer />

      {/* Footer */}
      <div
        className="absolute bottom-0 left-0 right-0 text-center py-1.5 z-20 pointer-events-none"
        style={{
          fontSize: "0.7rem",
          color: "rgba(255, 215, 0, 0.3)",
          letterSpacing: "0.1em",
        }}
      >
        © {new Date().getFullYear()}. Built with ♡ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="pointer-events-auto"
          style={{ color: "rgba(255,215,0,0.5)", textDecoration: "none" }}
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}

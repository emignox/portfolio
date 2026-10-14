import React, { useRef, useMemo, useEffect } from "react";
import { Sky, Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping, PlaneGeometry, Vector3 } from "three";
import { Water } from "three-stdlib";
import Moon from "./moon";
import * as THREE from "three";
import TechCube from "./TechCube";

// Texture condivise per colore: una sola CanvasTexture per tinta di nuvola
const cloudTextures = new Map<string, THREE.CanvasTexture>();

// Oltre il far plane della camera (1000) le nuvole non si vedono: niente da animare là fuori
const CLOUD_X_MIN = -1200;
const CLOUD_X_MAX = 1800;

// Nuvola custom con sprite circolari realistici
const CustomCloud: React.FC<{
  position: [number, number, number];
  opacity: number;
  size: number;
  color: string;
}> = ({ position, opacity, size, color }) => {
  const ref = useRef<THREE.Group>(null!);

  // Texture canvas per sprite circolare con gradiente morbido (in cache per colore)
  const texture = useMemo(() => {
    const cached = cloudTextures.get(color);
    if (cached) return cached;

    // Adjust color to make it more red / sandy
    const [r, g, b] = color.match(/\d+/g)!.map(Number);

    const nr = Math.min(255, r + 40); // boost red
    const ng = g; // keep green
    const nb = Math.max(0, b - 40); // reduce blue (removes pink)

    const stop = (a: number) => `rgba(${nr}, ${ng}, ${nb}, ${a})`;

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, stop(0.9));
    gradient.addColorStop(0.4, stop(0.5));
    gradient.addColorStop(0.7, stop(0.2));
    gradient.addColorStop(1, stop(0));

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    cloudTextures.set(color, tex);
    return tex;
  }, [color]);

  useFrame((_, delta) => {
    if (ref.current) {
      // Si muovono da sinistra a destra (indipendente dal framerate)
      ref.current.position.x += 0.2 * size * Math.min(delta, 0.1) * 60;
      if (ref.current.position.x > CLOUD_X_MAX) {
        ref.current.position.x = CLOUD_X_MIN;
      }
    }
  });

  // Crea sprite multipli con distribuzione più realistica
  const sprites = useMemo(() => {
    const numSprites = Math.floor(10 + Math.random() * 8); // 10-18 sprite
    return Array.from({ length: numSprites }, (_, i) => {
      const angle = (i / numSprites) * Math.PI * 2;
      const distance = Math.random() * 40 * size;

      return {
        position: [
          Math.cos(angle) * distance + (Math.random() - 0.5) * 20 * size,
          Math.sin(angle) * distance * 0.6 + (Math.random() - 0.5) * 15 * size,
          (Math.random() - 0.5) * 20,
        ] as [number, number, number],
        scale: (Math.random() * 25 + 30) * size,
        opacity: Math.random() * 0.3 + 0.7,
      };
    });
  }, [size]);

  return (
    <group ref={ref} position={position}>
      {sprites.map((sprite, i) => (
        <sprite
          key={i}
          position={sprite.position}
          scale={[sprite.scale, sprite.scale, 1]}
        >
          <spriteMaterial
            map={texture}
            transparent
            opacity={opacity * sprite.opacity * 0.8}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
};

// Sistema di nuvole
const DynamicClouds: React.FC = () => {
  const hour = new Date().getHours();

  // Determina il colore delle nuvole in base all'orario e all'altezza
  const getCloudColor = (yPosition: number) => {
    if (hour >= 16 && hour < 21) {
      // Pomeriggio/Tramonto - gradiente da arancione (basso) a grigio (alto)
      // Normalizza la posizione Y (da 500 a 750) in un valore tra 0 e 1
      // (quantizzata in 5 fasce così le texture si riusano)
      const normalizedY = Math.round(((yPosition - 500) / 250) * 4) / 4;

      // Interpola tra arancione caldo (bottom) e grigio (top)
      const r = Math.round(250 - normalizedY * 50); // da 250 a 200
      const g = Math.round(220 - normalizedY * 40); // da 220 a 180
      const b = Math.round(200 - normalizedY * 30); // da 200 a 170

      return `rgb(${r}, ${g}, ${b})`;
    }
    // Giorno - colore bianco
    return "rgb(240, 240, 245)";
  };

  const clouds = useMemo(() => {
    return Array.from({ length: 70 }, () => ({
      position: [
        CLOUD_X_MIN + Math.random() * (CLOUD_X_MAX - CLOUD_X_MIN), // X
        Math.random() * 250 + 500, // Y: da 500 a 750
        Math.random() * 2000 - 1000, // Z: da -1000 a 1000
      ] as [number, number, number],
      opacity: Math.random() * 0.5 + 0.2,
      size: Math.random() * 10 + 6, // Dimensione da 0.4x a 10.4x
    }));
  }, []);

  // Non mostrare le nuvole di notte (dopo le 21 o prima delle 6)
  if (hour >= 21 || hour < 6) {
    return null;
  }

  return (
    <>
      {clouds.map((cloud, i) => (
        <CustomCloud
          key={i}
          position={cloud.position}
          opacity={cloud.opacity}
          size={cloud.size}
          color={getCloudColor(cloud.position[1])}
        />
      ))}
    </>
  );
};

const Background: React.FC = () => {
  const { scene } = useThree();

  const water = useMemo(() => {
    const waterNormals = new TextureLoader().load(
      `${import.meta.env.BASE_URL}water.jpeg`
    );
    waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;

    const w = new Water(new PlaneGeometry(10000, 10000), {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: waterNormals,
      alpha: 1,
      sunDirection: new Vector3(1, 1, 1),
      sunColor: 0xffffff,
      waterColor: 0x000033,
      distortionScale: 15,
      fog: scene.fog !== undefined,
    });

    w.rotateX((3 * Math.PI) / 2);
    w.position.x = -5;
    return w;
  }, [scene]);

  // Libera GPU quando si lascia la scena
  useEffect(() => {
    return () => {
      water.geometry.dispose();
      (water.material as THREE.ShaderMaterial).uniforms.normalSampler.value.dispose();
      water.material.dispose();
    };
  }, [water]);

  useFrame((_, delta) => {
    water.material.uniforms["time"].value += Math.min(delta, 0.1);
  });

  const getTimePreset = () => {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 16) {
      // Giorno - sole alto
      return {
        skyPosition: [1, 0.005, 0] as [number, number, number],
        sunPosition: [600, 120, -60] as [number, number, number],
        sunColor: "#FFFEF0",
        sunGlow1: "#FFF8C4",
        sunGlow2: "#fff",
        showSun: true,
        turbidity: 10,
        rayleigh: 0,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
      };
    } else if (hour >= 16 && hour < 21) {
      // Tramonto - colori caldi arancioni
      return {
        skyPosition: [5, 0.005, -0.1] as [number, number, number],
        sunPosition: [600, 20, -60] as [number, number, number],
        sunColor: "#FFE382", // Bianco caldo
        sunGlow1: "#fff", // Arancione chiaro
        sunGlow2: "#F28E55", // Arancione intenso
        showSun: true,
        turbidity: 32,
        rayleigh: 9,
        mieCoefficient: 0.01,
        mieDirectionalG: 0.8,
      };
    } else {
      // Notte
      return {
        skyPosition: [0, 0, 0] as [number, number, number],
        sunPosition: [0, 0, 0] as [number, number, number],
        sunColor: "#FFFACD",
        sunGlow1: "#FFF",
        sunGlow2: "#FFF",
        showSun: false,
        turbidity: 10,
        rayleigh: 0.5,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
      };
    }
  };

  const timePreset = useMemo(getTimePreset, []);

  return (
    <>
      {/* Cubo con tecnologie interattivo */}
      {/* Camera è a [0, 15, 50] e guarda verso [500, 0, 0], quindi posiziono il cubo sulla linea visuale */}
      <TechCube position={[200, 15, 20]} size={60} />

      {/* Luce ambientale per illuminare la scena */}
      <ambientLight intensity={0.3} />

      <primitive object={water} />

      <Sky
        sunPosition={timePreset.skyPosition}
        turbidity={timePreset.turbidity}
        rayleigh={timePreset.rayleigh}
        mieCoefficient={timePreset.mieCoefficient}
        mieDirectionalG={timePreset.mieDirectionalG}
      />

      {/* Nuvole dinamiche che si muovono da destra a sinistra */}
      <DynamicClouds />

      {!timePreset.showSun && (
        <>
          <Moon />
          <Stars
            radius={2000}
            depth={50}
            count={1000}
            factor={10}
            saturation={100}
            fade
          />
        </>
      )}
    </>
  );
};

export default Background;

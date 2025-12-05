import React, { useRef, useMemo } from "react";
import { Sky, Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  TextureLoader,
  RepeatWrapping,
  PlaneGeometry,
  Vector3,
  Mesh,
} from "three";
import { Water } from "three-stdlib";
import Moon from "./moon";
import * as THREE from "three";

// Nuvola custom con sprite circolari realistici
const CustomCloud: React.FC<{
  position: [number, number, number];
  opacity: number;
  size: number;
  color: string;
}> = ({ position, opacity, size, color }) => {
  const ref = useRef<THREE.Group>(null!);

  // Crea texture canvas per sprite circolare con gradiente morbido
  const texture = useMemo(() => {
    // Adjust color to make it more red / sandy
    const [r, g, b] = color.match(/\d+/g)!.map(Number);

    const nr = Math.min(255, r + 40); // boost red
    const ng = g; // keep green
    const nb = Math.max(0, b - 40); // reduce blue (removes pink)

    const adjustedColor = `rgb(${nr}, ${ng}, ${nb})`;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);

    gradient.addColorStop(
      0,
      adjustedColor.replace(")", ", 0.9)").replace("rgb", "rgba")
    );
    gradient.addColorStop(
      0.4,
      adjustedColor.replace(")", ", 0.5)").replace("rgb", "rgba")
    );
    gradient.addColorStop(
      0.7,
      adjustedColor.replace(")", ", 0.2)").replace("rgb", "rgba")
    );
    gradient.addColorStop(
      1,
      adjustedColor.replace(")", ", 0)").replace("rgb", "rgba")
    );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
  }, [color]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x += 0.2 * size; // Invertito: ora si muovono da sinistra a destra
      if (ref.current.position.x > 3000) {
        ref.current.position.x = -1000;
      }
    }
  });

  // Crea sprite multipli con distribuzione più realistica
  const sprites = useMemo(() => {
    const numSprites = Math.floor(15 + Math.random() * 10); // 15-25 sprite
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
      const normalizedY = (yPosition - 500) / 250;

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
    return Array.from({ length: 100 }, () => ({
      position: [
        Math.random() * 4000 - 300, // X: da -300 a 3700
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
  const waterRef = useRef<Mesh>(null);
  const { scene } = useThree();

  const loader = new TextureLoader();
  const waterNormals = loader.load("water.jpeg", (texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
  });

  const water = new Water(new PlaneGeometry(10000, 10000), {
    textureWidth: 500,
    textureHeight: 500,
    waterNormals: waterNormals,
    alpha: 1,
    sunDirection: new Vector3(1, 1, 1),
    sunColor: 0xffffff,
    waterColor: 0x000033,
    distortionScale: 15,
    fog: scene.fog !== undefined,
  });

  water.rotateX((3 * Math.PI) / 2);
  water.position.x = -5;

  useFrame(() => {
    if (waterRef.current) {
      water.material.uniforms["time"].value += 1.0 / 60.0;
    }
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

  const timePreset = getTimePreset();

  return (
    <>
      {/* Luce ambientale per illuminare la scena */}
      <ambientLight intensity={0.3} />

      <primitive object={water} ref={waterRef} />

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

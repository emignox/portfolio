import React, { useRef } from "react";
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

// Tipizzare il componente Background
const Background: React.FC = () => {
  const waterRef = useRef<Mesh>(null);
  const { scene } = useThree();

  // Carica la texture dell'acqua
  const loader = new TextureLoader();
  const waterNormals = loader.load("water.jpeg", (texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
  });

  // Crea e configura l'acqua
  const water = new Water(new PlaneGeometry(10000, 10000), {
    textureWidth: 500,
    textureHeight: 500,
    waterNormals: waterNormals,
    alpha: 1,
    sunDirection: new Vector3(1, 1, 1), // Direzione della luce solare
    sunColor: parseInt("", 16), // Colore del sole
    waterColor: 0x000033, // Colore dell'acqua
    distortionScale: 15, // Scala di distorsione
    fog: scene.fog !== undefined,
  });

  water.rotateX((3 * Math.PI) / 2);
  water.position.x = -5;

  useFrame(({}) => {
    if (waterRef.current) {
      water.material.uniforms["time"].value += 1.0 / 60.0;
    }
  });

  // Imposta il preset del cielo per il giorno
  const getTimePreset = () => {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) {
      return [1, 0, 1];
    } else if (hour >= 12 && hour < 21) {
      return [40, 0, 1];
    } else {
      return [0, 0, 0];
    }
  };

  const timePreset = getTimePreset();

  return (
    <>
      <primitive object={water} ref={waterRef} />
      <Sky
        sunPosition={timePreset as [number, number, number]}
        inclination={0.5} // Imposta l'inclinazione per il giorno
        azimuth={0.5} // Imposta l'azimuth per il giorno
      />
      {timePreset[0] === 0 && timePreset[1] === 0 && timePreset[2] === 0 && (
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

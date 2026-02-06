import { SphereGeometry, MeshPhongMaterial, Mesh, TextureLoader } from "three";
import { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

const textureURL =
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg";
const displacementURL =
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg";

function Moon() {
  const [moonMesh, setMoonMesh] = useState<Mesh | null>(null);

  useEffect(() => {
    const textureLoader = new TextureLoader();
    const moonSize = 100;
    const moonGeometry = new SphereGeometry(moonSize, 32, 32);

    const createFallback = () => {
      const fallbackMaterial = new MeshPhongMaterial({ color: 0xaaaaaa, shininess: 0 });
      setMoonMesh(new Mesh(moonGeometry, fallbackMaterial));
    };

    textureLoader.load(textureURL, function (texture) {
      textureLoader.load(displacementURL, function (displacementMap) {
        const moonMaterial = new MeshPhongMaterial({
          map: texture,
          displacementMap: displacementMap,
          displacementScale: 0.06,
          bumpMap: displacementMap,
          bumpScale: 0.04,
          reflectivity: 0,
          shininess: 0,
        });
        setMoonMesh(new Mesh(moonGeometry, moonMaterial));
      }, undefined, createFallback);
    }, undefined, createFallback);
  }, []);

  useFrame(() => {
    if (moonMesh) {
      moonMesh.rotation.y += 0.001;
    }
  });

  if (!moonMesh) return null;

  return (
    <>
      <primitive object={moonMesh} position={[700, 250, 20]} />
    </>
  );
}

export default Moon;

import { SphereGeometry, MeshPhongMaterial, Mesh, TextureLoader, DirectionalLight } from "three";
import { useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const textureURL =
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg";
const displacementURL =
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg";

function Moon() {
  const [moonMesh, setMoonMesh] = useState<Mesh | null>(null);
  const { scene } = useThree(); // Access the scene to add the light

  useEffect(() => {
    const textureLoader = new TextureLoader();
    const moonSize = 30;
    const moonGeometry = new SphereGeometry(moonSize, 32, 32);

    const setupMoon = (moon: Mesh) => {
      setMoonMesh(moon);
      const directionalLight = new DirectionalLight(0xffffff, 1);
      directionalLight.position.set(500, 400, -200);
      directionalLight.target = moon;
      scene.add(directionalLight);
    };

    const createFallback = () => {
      const fallbackMaterial = new MeshPhongMaterial({ color: 0xaaaaaa, shininess: 0 });
      setupMoon(new Mesh(moonGeometry, fallbackMaterial));
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
        setupMoon(new Mesh(moonGeometry, moonMaterial));
      }, undefined, createFallback);
    }, undefined, createFallback);
  }, [scene]);

  useFrame(() => {
    if (moonMesh) {
      moonMesh.rotation.y += 0.001;
    }
  });

  if (!moonMesh) return null;

  return <primitive object={moonMesh} position={[800, 500, -1000]} />;
}

export default Moon;

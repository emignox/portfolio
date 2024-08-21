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

        const moonSize = 30;
        const moonGeometry = new SphereGeometry(moonSize, 32, 32);
        const moon = new Mesh(moonGeometry, moonMaterial);
        setMoonMesh(moon);

        // Create a directional light
        const directionalLight = new DirectionalLight(0xffffff, 1);
        directionalLight.position.set(500, 400, -200); // Position the light
        directionalLight.target = moon; // Point the light at the moon
        scene.add(directionalLight);
      });
    });
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

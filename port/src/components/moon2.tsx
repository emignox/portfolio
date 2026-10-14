import { SphereGeometry, MeshPhongMaterial, Mesh, DirectionalLight } from "three";
import { useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { createMoonTexture } from "./moon";

function Moon() {
  const { scene } = useThree(); // Access the scene to add the light

  const moonMesh = useMemo(() => {
    const texture = createMoonTexture(); // procedurale: niente CDN esterno (403)
    const geometry = new SphereGeometry(30, 32, 32);
    const material = new MeshPhongMaterial({
      map: texture,
      bumpMap: texture,
      bumpScale: 0.6,
      reflectivity: 0,
      shininess: 0,
    });
    return new Mesh(geometry, material);
  }, []);

  useEffect(() => {
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(500, 400, -200);
    directionalLight.target = moonMesh;
    scene.add(directionalLight);

    return () => {
      scene.remove(directionalLight);
      const material = moonMesh.material as MeshPhongMaterial;
      material.map?.dispose();
      material.dispose();
      moonMesh.geometry.dispose();
    };
  }, [scene, moonMesh]);

  useFrame((_, delta) => {
    moonMesh.rotation.y += 0.06 * Math.min(delta, 0.1);
  });

  return <primitive object={moonMesh} position={[800, 500, -1000]} />;
}

export default Moon;

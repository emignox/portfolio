import { SphereGeometry, MeshPhongMaterial, Mesh, CanvasTexture, SRGBColorSpace } from "three";
import { useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

// Texture lunare procedurale (mari + crateri): niente CDN esterno
// (le texture su s3.amazonaws.com/s.cdpn.io rispondono 403).
export const createMoonTexture = () => {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Random deterministico: la luna è sempre uguale
  let seed = 1337;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  ctx.fillStyle = "#b9b7b2";
  ctx.fillRect(0, 0, w, h);

  // Mari scuri (macchie grandi e morbide)
  for (let i = 0; i < 9; i++) {
    const x = rnd() * w;
    const y = h * 0.2 + rnd() * h * 0.6;
    const r = 40 + rnd() * 90;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(78,78,84,0.55)");
    g.addColorStop(0.6, "rgba(78,78,84,0.3)");
    g.addColorStop(1, "rgba(78,78,84,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Crateri: bordo chiaro + interno scuro
  for (let i = 0; i < 260; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const r = 2 + rnd() * rnd() * 22;
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    g.addColorStop(0, "rgba(70,70,74,0.45)");
    g.addColorStop(0.75, "rgba(110,110,114,0.25)");
    g.addColorStop(0.9, "rgba(235,233,228,0.5)");
    g.addColorStop(1, "rgba(235,233,228,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

function Moon() {
  const moonMesh = useMemo(() => {
    const texture = createMoonTexture();
    const geometry = new SphereGeometry(100, 32, 32);
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
    return () => {
      const material = moonMesh.material as MeshPhongMaterial;
      material.map?.dispose();
      material.dispose();
      moonMesh.geometry.dispose();
    };
  }, [moonMesh]);

  useFrame((_, delta) => {
    moonMesh.rotation.y += 0.06 * Math.min(delta, 0.1);
  });

  return <primitive object={moonMesh} position={[700, 250, 20]} />;
}

export default Moon;

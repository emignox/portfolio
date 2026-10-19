// Pagina corrente vista dall'universo 3D
export type SpaceMode = "home" | "projects" | "about";

// Stato condiviso tra le pagine (React) e l'universo 3D (useFrame), senza re-render.

// Pianeta da inquadrare nella pagina Projects: id del pianeta oppure null (vista d'insieme).
// Id validi: "nemei", "ep", "reader", "odoo", "radar", "piano".
export const spaceFocus: { current: string | null } = { current: null };

// Intensita' dell'effetto iperspazio, 0..1: la scrive il regista della camera durante i voli.
export const warp: { current: number } = { current: 0 };

// Titolo progetto (project-data) -> pianeta del sistema solare
export const PLANET_OF_PROJECT: Record<string, string> = {
  "Nemei App": "nemei",
  "EP Sportwear": "ep",
  Reader: "reader",
  "Immoweb Radar": "radar",
  "Piano Trainer": "piano",
};

// Ellisse della fascia di asteroidi (tra Marte e Giove), scritta ogni frame dal sistema solare.
// Un punto dell'orbita all'angolo th: (cx + a*cos th, cy - b*sin th, cz + d*sin th).
export const beltShape = { cx: 0, cy: 0, cz: -75, a: 0, b: 0, d: 0, appear: 0 };

// Posizione del sole nel mondo, scritta ogni frame dal sistema solare.
export const sunWorld = { x: 0, y: 20, z: -75 };

// Pagina corrente vista dall'universo: "home" | "projects" | "about"
export const currentMode = { current: "home" as SpaceMode };

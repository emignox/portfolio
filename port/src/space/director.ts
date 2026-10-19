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

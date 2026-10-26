import seed from '../../data/seed.json';

const CLAVE = 'congreso.revisiones';

export function obtenerRevisiones() {
  try {
    const guardadas = localStorage.getItem(CLAVE);
    if (guardadas) return JSON.parse(guardadas);
  } catch {
  }
  return seed.revisiones;
}

export function guardarRevisiones(revisiones) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(revisiones));
  } catch {
  }
}
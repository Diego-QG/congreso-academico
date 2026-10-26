import seed from '../../data/seed.json';

const CLAVE_REVISIONES = 'congreso.revisiones';
const CLAVE_DICTAMENES = 'congreso.dictamenes';


export function obtenerCriterios() {
  return seed.edicion.criterios;
}

export function obtenerTrabajo(trabajoId) {
  return seed.trabajos.find((t) => t.id === trabajoId);
}

export function obtenerAsignacion(asignacionId) {
  return seed.asignaciones.find((a) => a.id === asignacionId);
}

export function obtenerAsignacionesDeRevisor(revisorId) {
  return seed.asignaciones.filter((a) => a.revisorId === revisorId);
}


function leer(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    if (guardado) return JSON.parse(guardado);
  } catch {

  }
  return valorInicial;
}

function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    
  }
}

export function obtenerRevisiones() {
  return leer(CLAVE_REVISIONES, seed.revisiones);
}

export function guardarRevisiones(revisiones) {
  guardar(CLAVE_REVISIONES, revisiones);
}

export function obtenerDictamenes() {
  return leer(CLAVE_DICTAMENES, seed.dictamenes);
}

export function guardarDictamenes(dictamenes) {
  guardar(CLAVE_DICTAMENES, dictamenes);
}
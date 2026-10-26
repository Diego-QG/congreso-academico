import seed from '../../data/seed.json';

const CLAVE_SESIONES = 'congreso.sesiones';
const CLAVE_PROGRAMA = 'congreso.programa';

export const DURACION_TRABAJO = 20;

export const SALAS = ['A-101', 'B-201', 'C-305'];

// Lee de localStorage; si no hay datos guardados devuelve los del seed.
function leer(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : valorInicial;
  } catch {
    return valorInicial;
  }
}

function escribir(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function obtenerSesiones() {
  return leer(CLAVE_SESIONES, seed.sesiones);
}

export function guardarSesiones(sesiones) {
  escribir(CLAVE_SESIONES, sesiones);
}

export function obtenerPrograma() {
  return leer(CLAVE_PROGRAMA, seed.programa);
}

export function guardarPrograma(programa) {
  escribir(CLAVE_PROGRAMA, programa);
}

// Trabajos con dictamen de aceptación (HU-5): los únicos que entran al programa.
export function obtenerTrabajosAceptados() {
  const aceptados = seed.dictamenes
    .filter((d) => d.decision === 'aceptado' || d.decision === 'aceptado_con_observaciones')
    .map((d) => d.trabajoId);
  return seed.trabajos.filter((t) => aceptados.includes(t.id));
}

export function aMinutos(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

export function aHora(minutos) {
  const h = String(Math.floor(minutos / 60)).padStart(2, '0');
  const m = String(minutos % 60).padStart(2, '0');
  return `${h}:${m}`;
}

// Hora de inicio del trabajo según su posición en la sesión.
export function horaDeTrabajo(sesion, posicion) {
  return aHora(aMinutos(sesion.horaInicio) + posicion * DURACION_TRABAJO);
}

export function capacidadDeSesion(sesion) {
  return Math.floor((aMinutos(sesion.horaFin) - aMinutos(sesion.horaInicio)) / DURACION_TRABAJO);
}

export function formatearFecha(fecha) {
  const [a, m, d] = fecha.split('-');
  return `${d}/${m}/${a}`;
}

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function nombreDelDia(fecha) {
  const [a, m, d] = fecha.split('-').map(Number);
  return DIAS[new Date(a, m - 1, d).getDay()];
}

// Abrevia los autores, por ejemplo: "R. Quispe y 2 más".
export function autoresAbreviados(trabajo) {
  const [nombre, apellido] = trabajo.autor.nombre.split(' ');
  const principal = `${nombre[0]}. ${apellido}`;
  const otros = trabajo.coautores.length;
  return otros === 0 ? principal : `${principal} y ${otros} más`;
}

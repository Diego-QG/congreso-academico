import { aMinutos } from './programaServicio';

// Dos sesiones se solapan si comparten fecha y sala y sus horarios se cruzan.
export function seSolapan(a, b) {
  return (
    a.id !== b.id &&
    a.fecha === b.fecha &&
    a.sala === b.sala &&
    aMinutos(a.horaInicio) < aMinutos(b.horaFin) &&
    aMinutos(b.horaInicio) < aMinutos(a.horaFin)
  );
}

// Devuelve los pares [a, b] de sesiones en conflicto.
export function conflictosDeSala(sesiones) {
  const pares = [];
  sesiones.forEach((a, i) => {
    sesiones.slice(i + 1).forEach((b) => {
      if (seSolapan(a, b)) pares.push([a, b]);
    });
  });
  return pares;
}

// Devuelve los errores por campo de una sesión; vacío si es válida.
export function validarSesion(sesion, otrasSesiones) {
  const errores = {};
  if (!sesion.nombre.trim()) errores.nombre = 'Ingrese el nombre de la sesión.';
  if (!sesion.eje) errores.eje = 'Elija un eje temático.';
  if (!sesion.fecha) errores.fecha = 'Elija la fecha.';
  if (!sesion.sala) errores.sala = 'Elija la sala.';
  if (!sesion.moderador.trim()) errores.moderador = 'Ingrese el moderador.';
  if (!sesion.horaInicio || !sesion.horaFin) {
    errores.horario = 'Ingrese la hora de inicio y de fin.';
  } else if (aMinutos(sesion.horaFin) <= aMinutos(sesion.horaInicio)) {
    errores.horario = 'La hora de fin debe ser posterior a la de inicio.';
  }

  if (!errores.horario && !errores.fecha && !errores.sala) {
    const choque = otrasSesiones.find((o) => seSolapan(sesion, o));
    if (choque) {
      errores.horario = `La sala ${sesion.sala} ya está ocupada por «${choque.nombre}» de ${choque.horaInicio} a ${choque.horaFin}.`;
    }
  }
  return errores;
}

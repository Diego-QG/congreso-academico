import { useState } from 'react';
import {
  obtenerSesiones,
  guardarSesiones,
  obtenerPrograma,
  guardarPrograma,
  obtenerTrabajosAceptados,
} from './programaServicio';
import { ProgramaContexto } from './programaContexto';

export default function ProgramaProvider({ children }) {
  const [sesiones, setSesiones] = useState(obtenerSesiones);
  const [programa, setPrograma] = useState(obtenerPrograma);
  const [trabajosAceptados] = useState(obtenerTrabajosAceptados);

  function actualizarSesiones(nuevas) {
    setSesiones(nuevas);
    guardarSesiones(nuevas);
  }

  function guardarSesion(sesion) {
    if (sesion.id) {
      actualizarSesiones(sesiones.map((s) => (s.id === sesion.id ? sesion : s)));
    } else {
      actualizarSesiones([...sesiones, { ...sesion, id: 'S' + Date.now(), trabajos: [] }]);
    }
  }

  function eliminarSesion(sesionId) {
    actualizarSesiones(sesiones.filter((s) => s.id !== sesionId));
  }

  function cambiarTrabajos(sesionId, cambiar) {
    actualizarSesiones(
      sesiones.map((s) => (s.id === sesionId ? { ...s, trabajos: cambiar(s.trabajos) } : s)),
    );
  }

  function asignarTrabajo(sesionId, trabajoId) {
    cambiarTrabajos(sesionId, (lista) => [...lista, trabajoId]);
  }

  function quitarTrabajo(sesionId, trabajoId) {
    cambiarTrabajos(sesionId, (lista) => lista.filter((id) => id !== trabajoId));
  }

  // Cambia el orden de un trabajo: direccion -1 lo sube, +1 lo baja.
  function moverTrabajo(sesionId, posicion, direccion) {
    cambiarTrabajos(sesionId, (lista) => {
      const destino = posicion + direccion;
      if (destino < 0 || destino >= lista.length) return lista;
      const nueva = [...lista];
      [nueva[posicion], nueva[destino]] = [nueva[destino], nueva[posicion]];
      return nueva;
    });
  }

  function cambiarPublicacion(publicado) {
    const nuevo = { ...programa, publicado };
    setPrograma(nuevo);
    guardarPrograma(nuevo);
  }

  const valor = {
    sesiones,
    programa,
    trabajosAceptados,
    guardarSesion,
    eliminarSesion,
    asignarTrabajo,
    quitarTrabajo,
    moverTrabajo,
    cambiarPublicacion,
  };

  return <ProgramaContexto.Provider value={valor}>{children}</ProgramaContexto.Provider>;
}

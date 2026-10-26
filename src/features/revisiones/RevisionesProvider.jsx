import { useState } from 'react';
import {
  obtenerRevisiones,
  guardarRevisiones,
  obtenerDictamenes,
  guardarDictamenes,
} from './revisionesServicio';
import { RevisionesContexto } from './revisionesContexto';

// Reemplaza el elemento con el mismo valor en `campo`, o lo agrega al final si no existe.
function reemplazarOAgregar(lista, elemento, campo) {
  const existe = lista.some((x) => x[campo] === elemento[campo]);
  return existe ? lista.map((x) => (x[campo] === elemento[campo] ? elemento : x)) : [...lista, elemento];
}

export default function RevisionesProvider({ children }) {
  const [revisiones, setRevisiones] = useState(obtenerRevisiones);
  const [dictamenes, setDictamenes] = useState(obtenerDictamenes);

  function guardarRevision(revision) {
    const nuevas = reemplazarOAgregar(revisiones, revision, 'id');
    setRevisiones(nuevas);
    guardarRevisiones(nuevas);
  }

  function guardarDictamen(dictamen) {
    const nuevos = reemplazarOAgregar(dictamenes, dictamen, 'trabajoId');
    setDictamenes(nuevos);
    guardarDictamenes(nuevos);
  }

  return (
    <RevisionesContexto.Provider value={{ revisiones, guardarRevision, dictamenes, guardarDictamen }}>
      {children}
    </RevisionesContexto.Provider>
  );
}
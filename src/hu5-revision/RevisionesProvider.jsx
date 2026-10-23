import { useState } from 'react';
import { obtenerRevisiones, guardarRevisiones } from './revisionesServicio';
import { RevisionesContexto } from './revisionesContexto';

export default function RevisionesProvider({ children }) {
  const [revisiones, setRevisiones] = useState(obtenerRevisiones);

  function guardarRevision(revision) {
    const existe = revisiones.some((r) => r.id === revision.id);
    const nuevas = existe
      ? revisiones.map((r) => (r.id === revision.id ? revision : r))
      : [...revisiones, revision];
    setRevisiones(nuevas);
    guardarRevisiones(nuevas);
  }

  return (
    <RevisionesContexto.Provider value={{ revisiones, guardarRevision }}>{children}</RevisionesContexto.Provider>
  );
}
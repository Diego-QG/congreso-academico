import { createContext, useContext } from 'react';

export const RevisionesContexto = createContext(null);

export function useRevisiones() {
  return useContext(RevisionesContexto);
}
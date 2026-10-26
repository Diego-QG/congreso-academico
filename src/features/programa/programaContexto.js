import { createContext, useContext } from 'react';

export const ProgramaContexto = createContext(null);

export function usePrograma() {
  return useContext(ProgramaContexto);
}

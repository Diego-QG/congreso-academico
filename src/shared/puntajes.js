// Cálculos de puntaje compartidos (formulario de evaluación y consolidado).

// Convierte lo que hay en el campo a número; vacío = sin calificar.
export function aNumero(valor) {
  if (valor === null || valor === undefined || valor === '') return null;
  return Number(valor);
}

// Promedio ponderado sobre 20, usando solo los criterios ya calificados.
export function promedioPonderado(puntajes, criterios) {
  let suma = 0;
  let pesos = 0;
  let calificados = 0;

  for (const criterio of criterios) {
    const p = puntajes.find((x) => x.criterioId === criterio.id);
    const n = p ? aNumero(p.puntaje) : null;
    if (n !== null && !Number.isNaN(n)) {
      suma += n * criterio.peso;
      pesos += criterio.peso;
      calificados += 1;
    }
  }

  return { valor: pesos === 0 ? null : suma / pesos, calificados };
}
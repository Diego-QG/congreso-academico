// Cálculos del consolidado de un trabajo, a partir de sus revisiones enviadas.
import { promedioPonderado } from '../../shared/puntajes';

export const MINIMO_REVISIONES = 2;

export const TEXTO_RECOMENDACION = {
  aceptar: 'Aceptar',
  aceptar_con_observaciones: 'Aceptar con observaciones',
  rechazar: 'Rechazar',
};

function promedio(numeros) {
  if (numeros.length === 0) return null;
  return numeros.reduce((suma, n) => suma + n, 0) / numeros.length;
}

export function calcularConsolidado(revisiones, criterios) {
  const filas = revisiones.map((r) => ({
    ...r,
    ponderado: promedioPonderado(r.puntajes, criterios).valor,
  }));

  const ponderados = filas.map((f) => f.ponderado);
  const fechas = filas.map((f) => f.fechaEnvio).sort();

  return {
    filas,
    promedio: promedio(ponderados),
    // Diferencia entre la nota más alta y la más baja: si es grande, los revisores no coinciden.
    dispersion: ponderados.length > 0 ? Math.max(...ponderados) - Math.min(...ponderados) : null,
    promedioPorCriterio: criterios.map((c) =>
      promedio(filas.map((f) => Number(f.puntajes.find((p) => p.criterioId === c.id)?.puntaje)))
    ),
    recomiendanAceptar: filas.filter((f) => f.recomendacion !== 'rechazar').length,
    conObservaciones: filas.filter((f) => f.recomendacion === 'aceptar_con_observaciones').length,
    ultimaEntrega: fechas.length > 0 ? fechas[fechas.length - 1] : null,
  };
}

// '2026-10-14' -> '14/10'
export function diaMes(fecha) {
  if (!fecha) return '—';
  const [, mes, dia] = fecha.split('-');
  return dia + '/' + mes;
}

export function unDecimal(numero) {
  return numero === null ? '—' : numero.toFixed(1);
}

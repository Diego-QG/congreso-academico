// Utilidades de fechas. Las fechas del sistema se guardan como texto 'AAAA-MM-DD'.

// '2026-10-15' -> '15/10/2026'
export function formatoFecha(fecha) {
  if (!fecha) return '—';
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

// '2026-10-15' -> '15/10'
export function diaMes(fecha) {
  if (!fecha) return '—';
  const [, mes, dia] = fecha.split('-');
  return `${dia}/${mes}`;
}

// Días entre hoy y la fecha: positivo si falta, negativo si ya pasó.
export function diasHasta(fecha) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const limite = new Date(fecha + 'T00:00:00');
  return Math.round((limite - hoy) / 86400000);
}

// Texto corto del plazo: 'faltan 3 días', 'vence hoy', 'hace 2 días'.
export function textoDias(dias) {
  if (dias === 0) return 'vence hoy';
  if (dias > 0) return dias === 1 ? 'falta 1 día' : `faltan ${dias} días`;
  return -dias === 1 ? 'hace 1 día' : `hace ${-dias} días`;
}

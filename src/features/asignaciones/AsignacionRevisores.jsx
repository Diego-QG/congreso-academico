import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import './AsignacionRevisores.css';

/* ======================= DATOS DE PRUEBA (semilla local) ======================= */
const HOY = '2026-10-12'; // fecha de referencia fija para que el demo sea reproducible
const CIERRE_REVISION = '2026-10-20';
const EJES = ['Inteligencia artificial y datos', 'Ingeniería de software', 'Sostenibilidad y ciudad', 'Innovación y emprendimiento', 'Salud y sociedad', 'Economía y mercados'];
const TIPOS = ['Artículo completo', 'Resumen extendido', 'Póster', 'Caso de estudio'];
const ESTADOS = ['Borrador', 'Enviado', 'En revisión', 'Aceptado', 'Rechazado'];
const UL = 'Universidad de Lima', UP = 'Universidad del Pacífico', PUCP = 'Pontificia Universidad Católica del Perú';
const UNI = 'Universidad Nacional de Ingeniería', UPC = 'Universidad Peruana de Ciencias Aplicadas';
const UPCH = 'Universidad Peruana Cayetano Heredia', USIL = 'Universidad San Ignacio de Loyola';
const UNMSM = 'Universidad Nacional Mayor de San Marcos';

const REVISORES = [
  { id: 'R1', nombre: 'Mg. Luis Ramírez Cárdenas', inst: UL, lineas: [EJES[1], EJES[0]] },
  { id: 'R2', nombre: 'Mg. Carmen Effio Vargas', inst: UL, lineas: [EJES[1], EJES[2]] },
  { id: 'R3', nombre: 'Ing. Jorge Palomino Ávila', inst: UL, lineas: [EJES[3], EJES[1]] },
  { id: 'R4', nombre: 'Dra. Milagros Yupanqui Ríos', inst: UL, lineas: [EJES[4]] },
  { id: 'R5', nombre: 'Dr. Óscar Nakamura Trigoso', inst: PUCP, lineas: [EJES[0], EJES[5]] },
  { id: 'R6', nombre: 'Mg. Renzo Bustamante Loayza', inst: UP, lineas: [EJES[5]] },
  { id: 'R7', nombre: 'Mg. Patricia Zegarra Coronado', inst: UL, lineas: [EJES[3]] },
  { id: 'R8', nombre: 'Dr. Álvaro Ccahuana Pinto', inst: UNI, lineas: [EJES[2]] },
  { id: 'R9', nombre: 'Dra. Rocío Mendoza Salas', inst: UNMSM, lineas: [EJES[4], EJES[5]] },
];

// autor y coautores: nombre + institución; revisorId solo si esa persona también es revisora.
const TRABAJOS = [
  { id: 'T031', codigo: 'TRB-2026-031', titulo: 'Refactorización guiada por métricas de deuda técnica', eje: EJES[1], tipo: TIPOS[0], estado: 'Enviado', autor: { nombre: 'Camila Rojas Huamán', inst: UP }, coautores: [] },
  { id: 'T035', codigo: 'TRB-2026-035', titulo: 'Pruebas automatizadas en proyectos universitarios de software', eje: EJES[1], tipo: TIPOS[1], estado: 'Enviado', autor: { nombre: 'Diego Chávez Manrique', inst: UL }, coautores: [{ nombre: 'Milagros Yupanqui Ríos', inst: UL, revisorId: 'R4' }] },
  { id: 'T040', codigo: 'TRB-2026-040', titulo: 'Arquitectura de microservicios para un sistema de matrícula', eje: EJES[1], tipo: TIPOS[3], estado: 'Enviado', autor: { nombre: 'Valeria Soto Paredes', inst: UNI }, coautores: [{ nombre: 'Marco Núñez Salas', inst: UNI }] },
  { id: 'T042', codigo: 'TRB-2026-042', titulo: 'Predicción de deserción universitaria mediante aprendizaje supervisado', eje: EJES[0], tipo: TIPOS[0], estado: 'En revisión', autor: { nombre: 'Rosa Quispe Ttito', inst: UL }, coautores: [{ nombre: 'Diego Chávez Manrique', inst: UL }] },
  { id: 'T045', codigo: 'TRB-2026-045', titulo: 'Detección de fraude en pagos móviles con modelos de árboles', eje: EJES[5], tipo: TIPOS[0], estado: 'En revisión', autor: { nombre: 'Gabriela Ñahui Torres', inst: PUCP }, coautores: [{ nombre: 'Marco Ibáñez Cruz', inst: PUCP }] },
  { id: 'T051', codigo: 'TRB-2026-051', titulo: 'Evaluación del uso de agua reciclada en riego de áreas verdes del campus', eje: EJES[2], tipo: TIPOS[1], estado: 'Aceptado', autor: { nombre: 'Elena Cáceres Rivas', inst: UPC }, coautores: [] },
  { id: 'T053', codigo: 'TRB-2026-053', titulo: 'Bienestar emocional y rendimiento académico en primeros ciclos', eje: EJES[4], tipo: TIPOS[2], estado: 'En revisión', autor: { nombre: 'Andrea Salinas Ortiz', inst: UPCH }, coautores: [{ nombre: 'Luis Gamarra Peña', inst: UPCH }] },
  { id: 'T057', codigo: 'TRB-2026-057', titulo: 'Tablero de indicadores para la gestión de residuos sólidos en Surco', eje: EJES[2], tipo: TIPOS[3], estado: 'Rechazado', autor: { nombre: 'Jhon Quiroz Medina', inst: UPC }, coautores: [] },
  { id: 'T058', codigo: 'TRB-2026-058', titulo: 'Modelos de lenguaje para clasificar consultas de atención al estudiante', eje: EJES[0], tipo: TIPOS[0], estado: 'En revisión', autor: { nombre: 'Sofía Medina Arce', inst: UPC }, coautores: [{ nombre: 'Renato Villanueva Díaz', inst: UPC }] },
  { id: 'T059', codigo: 'TRB-2026-059', titulo: 'Modelo de negocio para una plataforma de microseguros agrícolas', eje: EJES[3], tipo: TIPOS[1], estado: 'En revisión', autor: { nombre: 'Daniel Paucar Rojas', inst: USIL }, coautores: [] },
  { id: 'T060', codigo: 'TRB-2026-060', titulo: 'Impacto de la ciclovía de Javier Prado en la movilidad estudiantil', eje: EJES[2], tipo: TIPOS[0], estado: 'En revisión', autor: { nombre: 'Fiorella Tapia Zúñiga', inst: UPCH }, coautores: [{ nombre: 'Piero Alva Montes', inst: UPCH }] },
  { id: 'T061', codigo: 'TRB-2026-061', titulo: 'Análisis de la inflación de alimentos en Lima Metropolitana (2019–2025)', eje: EJES[5], tipo: TIPOS[0], estado: 'En revisión', autor: { nombre: 'Bruno Carrasco Lira', inst: USIL }, coautores: [] },
  { id: 'T062', codigo: 'TRB-2026-062', titulo: 'Hábitos de sueño y desempeño en exámenes finales', eje: EJES[4], tipo: TIPOS[2], estado: 'Borrador', autor: { nombre: 'Ximena Prado León', inst: UL }, coautores: [] },
  { id: 'T063', codigo: 'TRB-2026-063', titulo: 'Chatbot de orientación vocacional para escolares', eje: EJES[0], tipo: TIPOS[3], estado: 'Borrador', autor: { nombre: 'Hugo Benavides Ríos', inst: UNMSM }, coautores: [] },
];

// [id, trabajo, revisor, fecha límite, estado]
const ASIGNACIONES_INICIALES = [
  ['A1', 'T042', 'R5', '2026-10-15', 'pendiente'], ['A2', 'T042', 'R6', '2026-10-20', 'entregada'], ['A3', 'T042', 'R8', '2026-10-20', 'entregada'],
  ['A4', 'T045', 'R3', '2026-10-08', 'pendiente'], ['A5', 'T045', 'R4', '2026-10-08', 'entregada'],
  ['A6', 'T051', 'R2', '2026-10-08', 'entregada'], ['A7', 'T051', 'R4', '2026-10-08', 'entregada'], ['A8', 'T051', 'R1', '2026-10-08', 'entregada'],
  ['A9', 'T053', 'R7', '2026-10-09', 'pendiente'], ['A10', 'T053', 'R1', '2026-10-09', 'pendiente'],
  ['A11', 'T057', 'R3', '2026-10-08', 'entregada'], ['A12', 'T057', 'R8', '2026-10-08', 'entregada'], ['A13', 'T057', 'R2', '2026-10-08', 'entregada'],
  ['A14', 'T058', 'R2', '2026-10-18', 'pendiente'], ['A15', 'T058', 'R6', '2026-10-18', 'entregada'], ['A16', 'T058', 'R4', '2026-10-18', 'entregada'],
  ['A17', 'T059', 'R6', '2026-10-20', 'pendiente'], ['A18', 'T059', 'R1', '2026-10-20', 'entregada'], ['A19', 'T059', 'R5', '2026-10-20', 'entregada'],
  ['A20', 'T060', 'R8', '2026-10-20', 'pendiente'], ['A21', 'T060', 'R3', '2026-10-20', 'entregada'], ['A22', 'T060', 'R7', '2026-10-20', 'entregada'],
  ['A23', 'T061', 'R1', '2026-10-20', 'entregada'], ['A24', 'T061', 'R4', '2026-10-20', 'entregada'], ['A25', 'T061', 'R5', '2026-10-20', 'entregada'],
].map(([id, trabajoId, revisorId, fecha, estado]) => ({ id, trabajoId, revisorId, fecha, estado }));

const MIN_REV = 2;
const MAX_REV = 3;
const POR_PAGINA = 8;

/* ============================ REGLAS Y UTILIDADES ============================ */
const fmt = (iso) => iso.split('-').reverse().join('/');
const plural = (n, uno, varios) => (n === 1 ? uno : varios);
const norm = (t) => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const diasEntre = (a, b) => {
  const [y1, m1, d1] = a.split('-').map(Number);
  const [y2, m2, d2] = b.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 864e5);
};
const nDias = (n) => `${n} ${plural(n, 'día', 'días')}`;

/** entregada | vencida (días de atraso) | pendiente (días que faltan) */
function estadoAsig(a) {
  if (a.estado === 'entregada') return { tipo: 'entregada', dias: 0 };
  const d = diasEntre(HOY, a.fecha);
  return d < 0 ? { tipo: 'vencida', dias: -d } : { tipo: 'pendiente', dias: d };
}

/** Coautoría/autoría BLOQUEA; misma institución ADVIERTE y exige justificación. */
function conflicto(t, r) {
  if (t.autor.revisorId === r.id) return { tipo: 'bloqueo', texto: 'Autoría del trabajo' };
  if (t.coautores.some((c) => c.revisorId === r.id)) return { tipo: 'bloqueo', texto: 'Coautoría del trabajo' };
  if ([t.autor.inst, ...t.coautores.map((c) => c.inst)].includes(r.inst)) return { tipo: 'adv', texto: 'Misma institución' };
  return { tipo: 'ok', texto: 'Sin conflicto' };
}
const PESO = { ok: 0, adv: 1, bloqueo: 2 };
const conflictoLote = (ts, r) => ts.map((t) => conflicto(t, r)).reduce((p, c) => (PESO[c.tipo] > PESO[p.tipo] ? c : p), { tipo: 'ok', texto: 'Sin conflicto' });

/** Cuántos revisores NUEVOS hay que elegir para que cada trabajo quede entre 2 y 3. */
function limites(ts, asig) {
  const ex = ts.map((t) => asig.filter((a) => a.trabajoId === t.id).length);
  const min = Math.max(1, ...ex.map((n) => MIN_REV - n));
  const max = Math.min(...ex.map((n) => MAX_REV - n));
  let error = '';
  if (max < 1) error = 'Alguno de los trabajos seleccionados ya tiene el máximo de revisores.';
  else if (min > max) error = 'Los trabajos seleccionados tienen distinta cantidad de revisores. Asígnelos por separado.';
  return { min, max, error };
}

const errMotivo = (t) => {
  const s = (t || '').trim();
  if (!s) return 'Ingrese el motivo.';
  return s.length < 10 ? 'Describa el motivo con al menos 10 caracteres.' : '';
};
const errFecha = (f) => {
  if (!f) return 'Ingrese la fecha límite de la revisión.';
  if (f < HOY) return 'La fecha límite no puede ser anterior a hoy.';
  if (f > CIERRE_REVISION) return `La fecha límite no puede superar el cierre de la etapa de revisión (${fmt(CIERRE_REVISION)}).`;
  return '';
};
const errCorreo = (t) => {
  const s = (t || '').trim();
  if (!s) return 'Ingrese el correo del revisor.';
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) ? '' : 'Ingrese un correo válido, por ejemplo nombre@universidad.edu.pe.';
};

function paginar(lista, pagina) {
  const total = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const actual = Math.min(Math.max(1, pagina), total);
  const inicio = (actual - 1) * POR_PAGINA;
  return { actual, total, inicio, visibles: lista.slice(inicio, inicio + POR_PAGINA) };
}

/* =========================== COMPONENTES COMPARTIDOS =========================== */
const FOCUSABLES = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])';

/** Modal accesible: Esc y clic fuera cierran; el foco se queda dentro y vuelve al cerrar. */
function Modal({ titulo, subtitulo, onCerrar, ancho, pie, children }) {
  const idTitulo = useId();
  const ref = useRef(null);
  const cerrar = useRef(onCerrar);
  useEffect(() => {
    cerrar.current = onCerrar;
  });
  useEffect(() => {
    const previo = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dlg = ref.current;
    dlg?.focus();
    function tecla(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        cerrar.current();
      } else if (e.key === 'Tab' && dlg) {
        const items = [...dlg.querySelectorAll(FOCUSABLES)];
        if (!items.length) return;
        const [primero, ultimo] = [items[0], items[items.length - 1]];
        if (e.shiftKey && (document.activeElement === primero || document.activeElement === dlg)) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primero.focus();
        }
      }
    }
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('keydown', tecla);
      document.body.style.overflow = overflow;
      if (previo instanceof HTMLElement && document.contains(previo)) previo.focus();
    };
  }, []);
  return (
    <div className="h4-fondo" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div ref={ref} className={`h4-modal${ancho ? ' ancho' : ''}`} role="dialog" aria-modal="true" aria-labelledby={idTitulo} tabIndex={-1}>
        <div className="h4-modal-cab">
          <div>
            <h2 id={idTitulo}>{titulo}</h2>
            {subtitulo && <p>{subtitulo}</p>}
          </div>
          <button type="button" className="h4-x" onClick={onCerrar} aria-label="Cerrar">×</button>
        </div>
        <div className="h4-modal-cuerpo">{children}</div>
        {pie && <div className="h4-modal-pie">{pie}</div>}
      </div>
    </div>
  );
}

function Aviso({ aviso, onQuitar }) {
  useEffect(() => {
    const t = setTimeout(() => onQuitar(aviso.id), 6000);
    return () => clearTimeout(t);
  }, [aviso.id, onQuitar]);
  return (
    <div className={`h4-aviso ${aviso.tipo}`} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
      <span>{aviso.texto}</span>
      <button type="button" onClick={() => onQuitar(aviso.id)} aria-label="Cerrar aviso">×</button>
    </div>
  );
}

const Alerta = ({ nivel, children, accion }) => (
  <div className={`h4-alerta ${nivel}`} role={nivel === 'error' ? 'alert' : 'status'}>
    <span>{children}</span>
    {accion}
  </div>
);

const Vacio = ({ titulo, texto, children }) => (
  <div className="h4-vacio">
    <h2>{titulo}</h2>
    <p>{texto}</p>
    {children}
  </div>
);

function BadgeRevision({ e }) {
  if (e.tipo === 'entregada') return <span className="h4-badge entregada">Entregada</span>;
  if (e.tipo === 'vencida') return <span className="h4-badge vencida">Vencida · {nDias(e.dias)}</span>;
  return <span className="h4-badge pendiente">{e.dias === 0 ? 'Pendiente · vence hoy' : `Pendiente · ${nDias(e.dias)}`}</span>;
}

function Paginacion({ pagina, total, inicio, mostrados, cantidad, nombre, extra, onCambiar }) {
  return (
    <div className="h4-pag">
      <span>
        Mostrando {mostrados === 0 ? 0 : inicio + 1}–{inicio + mostrados} de {cantidad} {nombre}
        {extra ? ` · ${extra}` : ''}
      </span>
      {total > 1 && (
        <nav aria-label="Paginación">
          <button type="button" disabled={pagina === 1} onClick={() => onCambiar(pagina - 1)}>Anterior</button>
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" className={n === pagina ? 'on' : ''} aria-current={n === pagina ? 'page' : undefined} onClick={() => onCambiar(n)}>
              {n}
            </button>
          ))}
          <button type="button" disabled={pagina === total} onClick={() => onCambiar(pagina + 1)}>Siguiente</button>
        </nav>
      )}
    </div>
  );
}

/* ============================== MODAL DE ASIGNACIÓN ============================== */
function ModalAsignar({ d, ids, onCerrar, onHecho }) {
  const idFecha = useId();
  const idJust = useId();
  const [busca, setBusca] = useState('');
  const [sel, setSel] = useState([]);
  const [forzar, setForzar] = useState(false);
  const [just, setJust] = useState('');
  const [fecha, setFecha] = useState(CIERRE_REVISION);
  const [intento, setIntento] = useState(false);

  const trabajos = d.filas.filter((f) => ids.includes(f.id));
  const lim = limites(trabajos, d.asig);
  const ejes = [...new Set(trabajos.map((t) => t.eje))];
  const info = [...d.revs]
    .sort((a, b) => ejes.filter((e) => b.lineas.includes(e)).length - ejes.filter((e) => a.lineas.includes(e)).length || a.pendientes - b.pendientes || a.nombre.localeCompare(b.nombre, 'es'))
    .map((r) => ({ r, c: conflictoLote(trabajos, r), ya: d.asig.some((a) => a.revisorId === r.id && ids.includes(a.trabajoId)) }));
  const q = norm(busca.trim());
  const visibles = info.filter(({ r }) => !q || norm([r.nombre, r.inst, ...r.lineas].join(' ')).includes(q));

  const libres = info.filter((i) => !i.ya);
  const nBloq = libres.filter((i) => i.c.tipo === 'bloqueo').length;
  const nAdv = libres.filter((i) => i.c.tipo === 'adv').length;
  const pideJust = info.some((i) => sel.includes(i.r.id) && i.c.tipo === 'adv');
  const eFecha = errFecha(fecha);
  const eJust = pideJust ? errMotivo(just) : '';
  const faltan = !lim.error && sel.length < lim.min;
  const sobran = !lim.error && sel.length > lim.max;
  const puede = !lim.error && !faltan && !sobran;

  function alternarForzar(v) {
    setForzar(v);
    if (!v) setSel((p) => p.filter((id) => info.find((i) => i.r.id === id)?.c.tipo !== 'adv'));
  }

  function enviar() {
    setIntento(true);
    if (!puede || eFecha || eJust) return;
    if (!d.asignar({ trabajoIds: ids, revisorIds: sel, fecha, justificacion: pideJust ? just.trim() : '' })) {
      d.avisar('error', 'No se pudo registrar la asignación. Verifique que ningún trabajo supere los 3 revisores.');
      return;
    }
    d.avisar('exito', `Revisores asignados a ${trabajos.length} ${plural(trabajos.length, 'trabajo', 'trabajos')}. Se notificó a ${sel.length} ${plural(sel.length, 'revisor', 'revisores')}.`);
    onHecho(ids);
    onCerrar();
  }

  if (!trabajos.length) return null;
  let pie = `${sel.length} ${plural(sel.length, 'revisor seleccionado', 'revisores seleccionados')}`;
  if (lim.error) pie = 'No es posible asignar con la selección actual.';
  else if (faltan) pie = `Seleccione al menos ${lim.min} ${plural(lim.min, 'revisor', 'revisores')} sin conflicto`;
  else if (sobran) pie = `Seleccione como máximo ${lim.max} ${plural(lim.max, 'revisor', 'revisores')}`;
  const partes = [];
  if (nBloq) partes.push(`${nBloq} ${plural(nBloq, 'revisor figura', 'revisores figuran')} como autor o coautor ${trabajos.length === 1 ? 'del trabajo' : 'de alguno de los trabajos'}`);
  if (nAdv) partes.push(`${nAdv} ${plural(nAdv, 'pertenece', 'pertenecen')} a la misma institución de los autores`);

  return (
    <Modal
      ancho
      titulo="Asignar revisores"
      subtitulo={trabajos.length === 1 ? `${trabajos[0].codigo} · ${trabajos[0].titulo} · ${trabajos[0].eje}` : `${trabajos.length} trabajos seleccionados · ${trabajos.map((t) => t.codigo).join(', ')}`}
      onCerrar={onCerrar}
      pie={
        <>
          <span style={{ color: lim.error || faltan || sobran ? 'var(--er)' : undefined }}>{pie}</span>
          <div className="h4-acciones">
            <button type="button" className="h4-btn sec" onClick={onCerrar}>Cancelar</button>
            <button type="button" className="h4-btn pri" disabled={!puede} onClick={enviar}>Asignar y notificar</button>
          </div>
        </>
      }
    >
      {lim.error && <Alerta nivel="error">{lim.error}</Alerta>}
      {partes.length > 0 && (
        <Alerta nivel={nBloq ? 'error' : 'aviso'}>
          <strong>Conflicto detectado:</strong> {partes.join(' y ')}.{nBloq ? ' No es posible asignar a un autor o coautor.' : ''}
        </Alerta>
      )}
      <div className="h4-fila">
        <input type="search" className="h4-input" placeholder="Buscar revisor por nombre, institución o línea de interés…" aria-label="Buscar revisor por nombre, institución o línea de interés" value={busca} onChange={(e) => setBusca(e.target.value)} />
        {!lim.error && <span className="h4-ayuda" style={{ whiteSpace: 'nowrap' }}>Mínimo {lim.min} · máximo {lim.max} {plural(lim.max, 'revisor', 'revisores')}</span>}
      </div>
      <div className="h4-lista">
        <table className="h4-tabla">
          <thead>
            <tr><th className="chk"><span className="h4-solo">Seleccionar</span></th><th>Revisor</th><th>Líneas de interés</th><th>Carga actual</th><th>Conflicto</th></tr>
          </thead>
          <tbody>
            {visibles.length === 0 && <tr><td colSpan={5} className="h4-suave">Ningún revisor coincide con la búsqueda.</td></tr>}
            {visibles.map(({ r, c, ya }) => {
              const marcado = sel.includes(r.id);
              const sinCupo = !marcado && sel.length >= lim.max;
              const off = Boolean(lim.error) || ya || c.tipo === 'bloqueo' || (c.tipo === 'adv' && !forzar) || sinCupo;
              let clase = '';
              if (marcado) clase = 'h4-sel';
              else if (!ya && c.tipo === 'bloqueo') clase = 'h4-bloq';
              else if (!ya && c.tipo === 'adv') clase = 'h4-adv';
              let ayuda = '';
              if (ya) ayuda = 'Ya está asignado a este trabajo.';
              else if (c.tipo === 'bloqueo') ayuda = 'No es posible asignar a un autor o coautor del trabajo.';
              else if (c.tipo === 'adv' && !forzar) ayuda = 'Active la excepción de misma institución para elegirlo.';
              else if (sinCupo) ayuda = `Ya eligió el máximo de ${lim.max} revisores.`;
              const claseConf = { ok: 'h4-verde', adv: 'h4-ambar', bloqueo: 'h4-rojo' }[c.tipo];
              return (
                <tr key={r.id} className={clase}>
                  <td className="chk">
                    <input type="checkbox" checked={marcado} disabled={off} title={ayuda} aria-label={`Seleccionar a ${r.nombre}`} onChange={() => setSel((p) => (p.includes(r.id) ? p.filter((x) => x !== r.id) : [...p, r.id]))} />
                  </td>
                  <td><strong>{r.nombre}</strong><br /><span className="h4-suave">{r.inst}</span></td>
                  <td className="h4-suave">{r.lineas.join(' · ')}</td>
                  <td>{r.pendientes} {plural(r.pendientes, 'pendiente', 'pendientes')}</td>
                  <td>{ya ? <span className="h4-suave">Ya asignado</span> : <span className={claseConf}>{c.texto}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {nAdv > 0 && (
        <div className="h4-caja-adv">
          <label className="h4-chk">
            <input type="checkbox" checked={forzar} onChange={(e) => alternarForzar(e.target.checked)} />
            <span>Asignar de todos modos al revisor de la misma institución (requiere justificación del comité).</span>
          </label>
          {forzar && (
            <div className="h4-campo">
              <label htmlFor={idJust}>Justificación del comité{pideJust ? ' *' : ''}</label>
              <textarea id={idJust} className={`h4-area${intento && eJust ? ' h4-err' : ''}`} value={just} aria-invalid={intento && Boolean(eJust)} onChange={(e) => setJust(e.target.value)} placeholder="Ejemplo: no hay otro revisor disponible en este eje temático." />
              {intento && eJust && <span className="h4-msg-err">{eJust}</span>}
            </div>
          )}
        </div>
      )}
      <div className="h4-campo">
        <label htmlFor={idFecha}>Fecha límite de la revisión *</label>
        <input id={idFecha} type="date" className={`h4-input${eFecha ? ' h4-err' : ''}`} style={{ maxWidth: 220 }} min={HOY} max={CIERRE_REVISION} value={fecha} aria-invalid={Boolean(eFecha)} onChange={(e) => setFecha(e.target.value)} />
        {eFecha ? <span className="h4-msg-err">{eFecha}</span> : <span className="h4-ayuda">Cierre de la etapa de revisión: {fmt(CIERRE_REVISION)}.</span>}
      </div>
    </Modal>
  );
}

/* ====================== MODAL: REASIGNAR / RETIRAR (con motivo) ====================== */
function ModalMotivo({ d, modo, asigId, onCerrar }) {
  const idMotivo = useId();
  const idNuevo = useId();
  const idFecha = useId();
  const idJust = useId();
  const [nuevoId, setNuevoId] = useState('');
  const [motivo, setMotivo] = useState('');
  const [fecha, setFecha] = useState(CIERRE_REVISION);
  const [excepcion, setExcepcion] = useState(false);
  const [just, setJust] = useState('');
  const [intento, setIntento] = useState(false);

  const a = d.asig.find((x) => x.id === asigId);
  const t = a && d.filas.find((f) => f.id === a.trabajoId);
  const actual = a && d.revs.find((r) => r.id === a.revisorId);
  if (!a || !t || !actual || a.estado !== 'pendiente') return null;

  const reasignar = modo === 'reasignar';
  const candidatos = [...d.revs]
    .filter((r) => r.id !== a.revisorId)
    .sort((x, y) => (y.lineas.includes(t.eje) ? 1 : 0) - (x.lineas.includes(t.eje) ? 1 : 0) || x.pendientes - y.pendientes)
    .map((r) => ({ r, c: conflicto(t, r), ya: d.asig.some((x) => x.trabajoId === t.id && x.revisorId === r.id) }));
  const elegido = candidatos.find((x) => x.r.id === nuevoId);
  const pideExc = reasignar && elegido?.c.tipo === 'adv';
  const e = {
    nuevo: reasignar && !nuevoId ? 'Seleccione el nuevo revisor.' : '',
    motivo: errMotivo(motivo),
    fecha: reasignar ? errFecha(fecha) : '',
    exc: pideExc && !excepcion ? 'Marque la excepción de misma institución para continuar.' : '',
    just: pideExc && excepcion ? errMotivo(just) : '',
  };
  const ver = (k) => (intento ? e[k] : '');
  const restantes = d.asig.filter((x) => x.trabajoId === t.id).length - 1;

  function confirmar() {
    setIntento(true);
    if (Object.values(e).some(Boolean)) return;
    if (reasignar) {
      const m = pideExc ? `${motivo.trim()} Justificación de misma institución: ${just.trim()}` : motivo.trim();
      if (!d.reasignar(asigId, nuevoId, fecha, m)) return d.avisar('error', 'No se pudo reasignar la revisión. Intente nuevamente.');
      d.avisar('exito', `Revisión reasignada de ${actual.nombre} a ${elegido.r.nombre}. Motivo registrado.`);
    } else {
      if (!d.retirar(asigId, motivo.trim())) return d.avisar('error', 'No se pudo retirar al revisor. Intente nuevamente.');
      d.avisar('exito', `Se retiró a ${actual.nombre} del trabajo ${t.codigo}. Motivo registrado.`);
    }
    onCerrar();
  }

  return (
    <Modal
      titulo={reasignar ? 'Reasignar revisión' : 'Retirar revisor'}
      subtitulo={`${t.codigo} · ${t.titulo}`}
      onCerrar={onCerrar}
      pie={
        <>
          <span>El motivo queda registrado en el historial del trabajo.</span>
          <div className="h4-acciones">
            <button type="button" className="h4-btn sec" onClick={onCerrar}>Cancelar</button>
            <button type="button" className={`h4-btn ${reasignar ? 'pri' : 'pel'}`} onClick={confirmar}>{reasignar ? 'Reasignar revisión' : 'Retirar revisor'}</button>
          </div>
        </>
      }
    >
      <div className="h4-fila">
        <p><span className="h4-etq">Revisor actual</span><br /><strong>{actual.nombre}</strong><br /><span className="h4-suave">Fecha límite: {fmt(a.fecha)}</span></p>
        <BadgeRevision e={estadoAsig(a)} />
      </div>
      {!reasignar && (
        <>
          <Alerta nivel="aviso">Esta acción no se puede deshacer: {actual.nombre} dejará de ver este trabajo en su bandeja.</Alerta>
          {restantes < MIN_REV && <Alerta nivel="aviso">Después del retiro el trabajo quedará con {restantes} {plural(restantes, 'revisor', 'revisores')}. Se necesitan al menos {MIN_REV} para consolidar el dictamen.</Alerta>}
        </>
      )}
      {reasignar && (
        <>
          <div className="h4-campo">
            <label htmlFor={idNuevo}>Nuevo revisor *</label>
            <select id={idNuevo} className={`h4-select${ver('nuevo') ? ' h4-err' : ''}`} style={{ width: '100%' }} value={nuevoId} aria-invalid={Boolean(ver('nuevo'))} onChange={(ev) => { setNuevoId(ev.target.value); setExcepcion(false); }}>
              <option value="">Seleccione un revisor…</option>
              {candidatos.map(({ r, c, ya }) => (
                <option key={r.id} value={r.id} disabled={ya || c.tipo === 'bloqueo'}>
                  {r.nombre} · {r.inst} · {r.pendientes} {plural(r.pendientes, 'pendiente', 'pendientes')}{ya ? ' · ya asignado a este trabajo' : c.tipo !== 'ok' ? ` · ${c.texto}` : ''}
                </option>
              ))}
            </select>
            {ver('nuevo') && <span className="h4-msg-err">{ver('nuevo')}</span>}
          </div>
          {pideExc && (
            <div className="h4-caja-adv">
              <label className="h4-chk">
                <input type="checkbox" checked={excepcion} onChange={(ev) => setExcepcion(ev.target.checked)} />
                <span>Asignar de todos modos al revisor de la misma institución (requiere justificación del comité).</span>
              </label>
              {ver('exc') && <span className="h4-msg-err">{ver('exc')}</span>}
              {excepcion && (
                <div className="h4-campo">
                  <label htmlFor={idJust}>Justificación del comité *</label>
                  <textarea id={idJust} className={`h4-area${ver('just') ? ' h4-err' : ''}`} value={just} onChange={(ev) => setJust(ev.target.value)} />
                  {ver('just') && <span className="h4-msg-err">{ver('just')}</span>}
                </div>
              )}
            </div>
          )}
          <div className="h4-campo">
            <label htmlFor={idFecha}>Nueva fecha límite *</label>
            <input id={idFecha} type="date" className={`h4-input${ver('fecha') ? ' h4-err' : ''}`} style={{ maxWidth: 220 }} min={HOY} max={CIERRE_REVISION} value={fecha} onChange={(ev) => setFecha(ev.target.value)} />
            {ver('fecha') && <span className="h4-msg-err">{ver('fecha')}</span>}
          </div>
        </>
      )}
      <div className="h4-campo">
        <label htmlFor={idMotivo}>Motivo {reasignar ? 'de la reasignación' : 'del retiro'} *</label>
        <textarea id={idMotivo} className={`h4-area${ver('motivo') ? ' h4-err' : ''}`} value={motivo} aria-invalid={Boolean(ver('motivo'))} onChange={(ev) => setMotivo(ev.target.value)} placeholder={reasignar ? 'Ejemplo: la revisión está vencida y el revisor no respondió al recordatorio.' : 'Ejemplo: el revisor informó un conflicto de interés.'} />
        {ver('motivo') && <span className="h4-msg-err">{ver('motivo')}</span>}
      </div>
    </Modal>
  );
}

/* ================== MODAL: REVISORES DE UN TRABAJO + HISTORIAL ================== */
function ModalRevisoresTrabajo({ d, trabajoId, onCerrar, onAccion, onAgregar }) {
  const t = d.filas.find((f) => f.id === trabajoId);
  if (!t) return null;
  const nombre = (id) => REVISORES.find((r) => r.id === id)?.nombre ?? id;
  const propias = d.asig.filter((a) => a.trabajoId === trabajoId);
  const eventos = d.historial.filter((h) => h.trabajoId === trabajoId);
  const puedeAgregar = ['Enviado', 'En revisión'].includes(t.estado) && propias.length < MAX_REV;
  const describir = (h) => {
    if (h.accion === 'retirada') return `Se retiró a ${nombre(h.revisorId)}. Motivo: ${h.motivo}`;
    if (h.accion === 'reasignada') return `Se reasignó de ${nombre(h.revisorId)} a ${nombre(h.nuevoId)}. Motivo: ${h.motivo}`;
    return `Se asignó a ${nombre(h.revisorId)}.${h.motivo ? ` Justificación: ${h.motivo}` : ''}`;
  };
  return (
    <Modal
      ancho
      titulo="Revisores del trabajo"
      subtitulo={`${t.codigo} · ${t.titulo}`}
      onCerrar={onCerrar}
      pie={
        <>
          <span>{propias.length} de {MAX_REV} revisores asignados</span>
          <div className="h4-acciones">
            {puedeAgregar && <button type="button" className="h4-btn sec" onClick={() => onAgregar(trabajoId)}>Asignar {propias.length === 0 ? 'revisores' : 'más revisores'}</button>}
            <button type="button" className="h4-btn pri" onClick={onCerrar}>Cerrar</button>
          </div>
        </>
      }
    >
      {propias.length === 0 ? (
        <p className="h4-suave">Este trabajo no tiene revisores asignados.</p>
      ) : (
        <div className="h4-caja">
          <div className="h4-scroll">
            <table className="h4-tabla">
              <thead><tr><th>Revisor</th><th>Fecha límite</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {propias.map((a) => {
                  const r = d.revs.find((x) => x.id === a.revisorId);
                  const e = estadoAsig(a);
                  return (
                    <tr key={a.id} className={e.tipo === 'vencida' ? 'h4-venc' : ''}>
                      <td><strong>{r?.nombre}</strong><br /><span className="h4-suave">{r?.inst}</span></td>
                      <td className={e.tipo === 'vencida' ? 'h4-rojo' : ''}>{fmt(a.fecha)}</td>
                      <td><BadgeRevision e={e} /></td>
                      <td>
                        {a.estado === 'pendiente' ? (
                          <span style={{ display: 'flex', gap: 16 }}>
                            <button type="button" className="h4-link" onClick={() => onAccion(a.id, 'reasignar')}>Reasignar</button>
                            <button type="button" className="h4-link" onClick={() => onAccion(a.id, 'retirar')}>Retirar</button>
                          </span>
                        ) : (
                          <span className="h4-suave" title="Una revisión entregada no se puede modificar.">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {eventos.length > 0 && (
        <section>
          <h3 style={{ font: "600 16px 'Source Serif 4',serif", marginBottom: 8 }}>Historial de cambios</h3>
          <ul className="h4-hist">
            {eventos.map((h) => (
              <li key={h.id}><span className="h4-suave">{fmt(h.fecha)} · </span>{describir(h)}</li>
            ))}
          </ul>
        </section>
      )}
    </Modal>
  );
}

/* ================================ 4.1 TRABAJOS ================================ */
function Trabajos({ d, irA }) {
  const [f, setF] = useState({ eje: '', estado: '', tipo: '', texto: '' });
  const [pagina, setPagina] = useState(1);
  const [sel, setSel] = useState([]);
  const [modal, setModal] = useState(null);

  const k = {
    enviados: d.filas.filter((x) => x.estado !== 'Borrador').length,
    enRevision: d.filas.filter((x) => x.estado === 'En revisión').length,
    sin: d.filas.filter((x) => x.estado === 'Enviado' && x.asignados === 0).length,
    decision: d.filas.filter((x) => x.estado === 'Aceptado' || x.estado === 'Rechazado').length,
  };
  const borradores = d.filas.length - k.enviados;
  const q = norm(f.texto.trim());
  const filtrados = d.filas.filter(
    (x) => (!f.eje || x.eje === f.eje) && (!f.estado || x.estado === f.estado) && (!f.tipo || x.tipo === f.tipo) &&
      (!q || norm([x.codigo, x.titulo, x.autor.nombre, ...x.coautores.map((c) => c.nombre)].join(' ')).includes(q)),
  );
  const pg = paginar(filtrados, pagina);
  const asignable = (x) => x.estado === 'Enviado' || x.estado === 'En revisión';
  const idsOk = new Set(d.filas.filter(asignable).map((x) => x.id));
  const marcados = sel.filter((id) => idsOk.has(id));
  const delaPagina = pg.visibles.filter(asignable);
  const nMarc = delaPagina.filter((x) => marcados.includes(x.id)).length;
  const todos = delaPagina.length > 0 && nMarc === delaPagina.length;
  const chips = [f.eje && ['eje', `Eje: ${f.eje}`], f.estado && ['estado', `Estado: ${f.estado}`], f.tipo && ['tipo', `Tipo: ${f.tipo}`], f.texto.trim() && ['texto', `Búsqueda: «${f.texto.trim()}»`]].filter(Boolean);

  const cambiar = (campo, v) => { setF((p) => ({ ...p, [campo]: v })); setPagina(1); };
  const limpiar = () => { setF({ eje: '', estado: '', tipo: '', texto: '' }); setPagina(1); };
  const volver = (m) => setModal(m.volverA ? { tipo: 'revisores', trabajoId: m.volverA } : null);

  function exportar() {
    if (!filtrados.length) return d.avisar('error', 'No hay trabajos para exportar con los filtros actuales.');
    const c = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const filas = filtrados.map((x) => [x.codigo, x.titulo, x.eje, x.tipo, x.asignados, x.entregadas, x.estado].map(c).join(','));
    const csv = ['Código,Título,Eje,Tipo,Revisores asignados,Revisiones entregadas,Estado', ...filas].join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trabajos-recibidos.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    d.avisar('exito', `Listado exportado: ${filtrados.length} ${plural(filtrados.length, 'trabajo', 'trabajos')}.`);
  }

  return (
    <>
      <div className="h4-head">
        <div>
          <h1 className="h4-titulo">Trabajos recibidos</h1>
          <p className="h4-sub">
            {d.filas.length === 0 ? 'Sin trabajos enviados por el momento' : `${d.filas.length} trabajos · ${k.enviados} ${plural(k.enviados, 'enviado', 'enviados')} · ${borradores} ${plural(borradores, 'borrador', 'borradores')} fuera de proceso`}
          </p>
        </div>
        <div className="h4-acciones">
          <button type="button" className="h4-btn sec" onClick={exportar} disabled={d.filas.length === 0}>Exportar listado</button>
          <button type="button" className="h4-btn pri" disabled={marcados.length === 0} onClick={() => setModal({ tipo: 'asignar', ids: marcados })}>
            {marcados.length > 0 ? `Asignar revisores (${marcados.length} ${plural(marcados.length, 'seleccionado', 'seleccionados')})` : 'Asignar revisores'}
          </button>
        </div>
      </div>

      {d.filas.length > 0 && (
        <div className="h4-kpis">
          {[['Enviados', k.enviados, 'var(--in)'], ['En revisión', k.enRevision, 'var(--wa)'], ['Sin revisores', k.sin, 'var(--ac)'], ['Con decisión', k.decision, 'var(--ok)']].map(([n, v, c]) => (
            <div key={n} className="h4-kpi" style={{ borderTopColor: c }}><small>{n}</small><b>{v}</b></div>
          ))}
        </div>
      )}

      <div className="h4-filtros">
        <div>
          <select className="h4-select" aria-label="Filtrar por eje temático" value={f.eje} onChange={(e) => cambiar('eje', e.target.value)}>
            <option value="">Eje: todos</option>
            {EJES.map((x) => <option key={x} value={x}>Eje: {x}</option>)}
          </select>
          <select className="h4-select" aria-label="Filtrar por estado" value={f.estado} onChange={(e) => cambiar('estado', e.target.value)}>
            <option value="">Estado: todos</option>
            {ESTADOS.map((x) => <option key={x} value={x}>Estado: {x}</option>)}
          </select>
          <select className="h4-select" aria-label="Filtrar por tipo de trabajo" value={f.tipo} onChange={(e) => cambiar('tipo', e.target.value)}>
            <option value="">Tipo: todos</option>
            {TIPOS.map((x) => <option key={x} value={x}>Tipo: {x}</option>)}
          </select>
        </div>
        <input type="search" className="h4-input h4-buscar" placeholder="Buscar por código, título o autor…" aria-label="Buscar por código, título o autor" value={f.texto} onChange={(e) => cambiar('texto', e.target.value)} />
      </div>

      {chips.length > 0 && (
        <div className="h4-chips">
          <span>Filtros activos:</span>
          {chips.map(([campo, texto]) => (
            <span key={campo} className="h4-chip">{texto}<button type="button" aria-label={`Quitar filtro ${texto}`} onClick={() => cambiar(campo, '')}>×</button></span>
          ))}
          <button type="button" className="h4-link" onClick={limpiar}>Limpiar todo</button>
        </div>
      )}

      {d.filas.length === 0 && (
        <Vacio titulo="Todavía no hay trabajos enviados" texto="Cuando los autores envíen sus trabajos aparecerán aquí para asignar revisores.">
          <button type="button" className="h4-btn sec" onClick={() => irA('configuracion')}>Revisar la configuración de la edición</button>
        </Vacio>
      )}
      {d.filas.length > 0 && filtrados.length === 0 && (
        <Vacio titulo="Ningún trabajo coincide con los filtros" texto="Pruebe con otros filtros o limpie la búsqueda para ver todos los trabajos.">
          <button type="button" className="h4-btn sec" onClick={limpiar}>Limpiar filtros</button>
        </Vacio>
      )}

      {filtrados.length > 0 && (
        <>
          <div className="h4-caja">
            <div className="h4-scroll">
              <table className="h4-tabla">
                <caption className="h4-solo">Trabajos recibidos</caption>
                <thead>
                  <tr>
                    <th className="chk">
                      <input type="checkbox" aria-label="Seleccionar todos los trabajos asignables de esta página" ref={(el) => { if (el) el.indeterminate = nMarc > 0 && !todos; }} checked={todos} disabled={delaPagina.length === 0}
                        onChange={(e) => { const ids = delaPagina.map((x) => x.id); setSel((p) => (e.target.checked ? [...new Set([...p, ...ids])] : p.filter((id) => !ids.includes(id)))); }} />
                    </th>
                    <th>Código</th><th>Título</th><th>Eje</th><th>Tipo</th><th>Revisores</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pg.visibles.map((x) => {
                    const ok = asignable(x);
                    const marcado = marcados.includes(x.id);
                    return (
                      <tr key={x.id} className={marcado ? 'h4-sel' : ''}>
                        <td className="chk">
                          <input type="checkbox" checked={marcado} disabled={!ok} title={ok ? '' : `No se puede asignar: el trabajo está en estado «${x.estado}».`} aria-label={`Seleccionar ${x.codigo}`} onChange={() => setSel((p) => (p.includes(x.id) ? p.filter((id) => id !== x.id) : [...p, x.id]))} />
                        </td>
                        <td>{x.codigo}</td>
                        <td className="h4-bold">{x.titulo}</td>
                        <td>{x.eje}</td>
                        <td>{x.tipo}</td>
                        <td>
                          {x.asignados === 0 && ok && <button type="button" className="h4-celda-btn rojo" aria-label={`Asignar revisores a ${x.codigo}`} onClick={() => setModal({ tipo: 'asignar', ids: [x.id] })}>Sin asignar</button>}
                          {x.asignados === 0 && !ok && <span className="h4-suave">—</span>}
                          {x.asignados > 0 && (
                            <button type="button" className="h4-celda-btn" aria-label={`Ver revisores de ${x.codigo}`} onClick={() => setModal({ tipo: 'revisores', trabajoId: x.id })}>
                              {x.asignados} {plural(x.asignados, 'asignado', 'asignados')} · {x.entregadas} {plural(x.entregadas, 'entregada', 'entregadas')}
                            </button>
                          )}
                        </td>
                        <td><span className={`h4-badge ${x.estado === 'En revisión' ? 'revision' : x.estado}`}>{x.estado}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Paginacion pagina={pg.actual} total={pg.total} inicio={pg.inicio} mostrados={pg.visibles.length} cantidad={filtrados.length} nombre={plural(filtrados.length, 'trabajo', 'trabajos')} extra={marcados.length ? `${marcados.length} ${plural(marcados.length, 'seleccionado', 'seleccionados')}` : ''} onCambiar={setPagina} />
        </>
      )}

      {modal?.tipo === 'asignar' && <ModalAsignar d={d} ids={modal.ids} onCerrar={() => volver(modal)} onHecho={(ids) => setSel((p) => p.filter((id) => !ids.includes(id)))} />}
      {modal?.tipo === 'revisores' && <ModalRevisoresTrabajo d={d} trabajoId={modal.trabajoId} onCerrar={() => setModal(null)} onAccion={(asigId, modo) => setModal({ tipo: 'motivo', modo, asigId, volverA: modal.trabajoId })} onAgregar={(id) => setModal({ tipo: 'asignar', ids: [id], volverA: id })} />}
      {modal?.tipo === 'motivo' && <ModalMotivo d={d} modo={modal.modo} asigId={modal.asigId} onCerrar={() => volver(modal)} />}
    </>
  );
}

/* ================================ 4.3 REVISORES ================================ */
function Revisores({ d }) {
  const [f, setF] = useState({ linea: '', inst: '', venc: false, texto: '' });
  const [pagina, setPagina] = useState(1);
  const [invitando, setInvitando] = useState(false);
  const [correo, setCorreo] = useState('');
  const [intento, setIntento] = useState(false);
  const idCorreo = useId();

  const asignadas = d.revs.reduce((s, r) => s + r.asignadas, 0);
  const vencidas = d.revs.reduce((s, r) => s + r.vencidas, 0);
  const conVenc = d.revs.filter((r) => r.vencidas > 0).length;
  const instituciones = [...new Set(d.revs.map((r) => r.inst))].sort((a, b) => a.localeCompare(b, 'es'));
  const q = norm(f.texto.trim());
  const filtrados = d.revs.filter((r) => (!f.linea || r.lineas.includes(f.linea)) && (!f.inst || r.inst === f.inst) && (!f.venc || r.vencidas > 0) && (!q || norm([r.nombre, r.inst, ...r.lineas].join(' ')).includes(q)));
  const pg = paginar(filtrados, pagina);
  const hayFiltros = Boolean(f.linea || f.inst || f.venc || f.texto.trim());
  const cambiar = (campo, v) => { setF((p) => ({ ...p, [campo]: v })); setPagina(1); };
  const eCorreo = errCorreo(correo);

  function invitar(ev) {
    ev.preventDefault();
    setIntento(true);
    if (eCorreo) return;
    d.avisar('exito', `Invitación enviada a ${correo.trim()}.`);
    setInvitando(false);
    setCorreo('');
    setIntento(false);
  }

  return (
    <>
      <div className="h4-head">
        <div>
          <h1 className="h4-titulo">Revisores</h1>
          <p className="h4-sub">{d.revs.length} {plural(d.revs.length, 'revisor registrado', 'revisores registrados')} · {asignadas} {plural(asignadas, 'revisión asignada', 'revisiones asignadas')} · {vencidas} {plural(vencidas, 'vencida', 'vencidas')}</p>
        </div>
        <div className="h4-acciones"><button type="button" className="h4-btn sec" onClick={() => setInvitando(true)}>Invitar revisor</button></div>
      </div>

      <div className="h4-filtros">
        <div>
          <select className="h4-select" aria-label="Filtrar por línea de interés" value={f.linea} onChange={(e) => cambiar('linea', e.target.value)}>
            <option value="">Línea: todas</option>
            {EJES.map((x) => <option key={x} value={x}>Línea: {x}</option>)}
          </select>
          <select className="h4-select" aria-label="Filtrar por institución" value={f.inst} onChange={(e) => cambiar('inst', e.target.value)}>
            <option value="">Institución: todas</option>
            {instituciones.map((x) => <option key={x} value={x}>Institución: {x}</option>)}
          </select>
          <button type="button" className={`h4-toggle${f.venc ? ' on' : ''}`} aria-pressed={f.venc} onClick={() => cambiar('venc', !f.venc)}>Con revisiones vencidas · {conVenc}</button>
        </div>
        <input type="search" className="h4-input h4-buscar" placeholder="Buscar revisor…" aria-label="Buscar revisor por nombre, institución o línea de interés" value={f.texto} onChange={(e) => cambiar('texto', e.target.value)} />
      </div>

      {filtrados.length === 0 ? (
        <Vacio titulo={hayFiltros ? 'Ningún revisor coincide con los filtros' : 'Todavía no hay revisores registrados'} texto={hayFiltros ? 'Pruebe con otros filtros o limpie la búsqueda para ver a todos los revisores.' : 'Invite a los primeros revisores para poder asignarles trabajos.'}>
          {hayFiltros && <button type="button" className="h4-btn sec" onClick={() => { setF({ linea: '', inst: '', venc: false, texto: '' }); setPagina(1); }}>Limpiar filtros</button>}
        </Vacio>
      ) : (
        <>
          <div className="h4-caja">
            <div className="h4-scroll">
              <table className="h4-tabla">
                <caption className="h4-solo">Revisores y su carga de revisiones</caption>
                <thead><tr><th>Revisor</th><th>Institución</th><th>Líneas de interés</th><th className="num">Asignadas</th><th className="num">Entregadas</th><th className="num">Vencidas</th></tr></thead>
                <tbody>
                  {pg.visibles.map((r) => (
                    <tr key={r.id}>
                      <td><strong>{r.nombre}</strong></td>
                      <td>{r.inst}</td>
                      <td className="h4-suave">{r.lineas.join(' · ')}</td>
                      <td className="num">{r.asignadas}</td>
                      <td className={`num${r.entregadas > 0 ? ' h4-verde' : ''}`}>{r.entregadas}</td>
                      <td className={`num${r.vencidas > 0 ? ' h4-rojo' : ''}`}>{r.vencidas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Paginacion pagina={pg.actual} total={pg.total} inicio={pg.inicio} mostrados={pg.visibles.length} cantidad={filtrados.length} nombre={plural(filtrados.length, 'revisor', 'revisores')} onCambiar={setPagina} />
        </>
      )}

      {invitando && (
        <Modal titulo="Invitar revisor" subtitulo="Le enviaremos un enlace para crear su cuenta como revisor." onCerrar={() => setInvitando(false)}
          pie={<div className="h4-acciones"><button type="button" className="h4-btn sec" onClick={() => setInvitando(false)}>Cancelar</button><button type="submit" form={`${idCorreo}-f`} className="h4-btn pri">Enviar invitación</button></div>}>
          <form id={`${idCorreo}-f`} onSubmit={invitar} noValidate>
            <div className="h4-campo">
              <label htmlFor={idCorreo}>Correo del revisor *</label>
              <input id={idCorreo} type="email" className={`h4-input${intento && eCorreo ? ' h4-err' : ''}`} value={correo} aria-invalid={intento && Boolean(eCorreo)} onChange={(e) => setCorreo(e.target.value)} placeholder="nombre@universidad.edu.pe" />
              {intento && eCorreo && <span className="h4-msg-err">{eCorreo}</span>}
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

/* =============================== 4.4 SEGUIMIENTO =============================== */
function Seguimiento({ d, setVista }) {
  const [soloVenc, setSoloVenc] = useState(false);
  const [modal, setModal] = useState(null);

  const filas = d.asig
    .filter((a) => a.estado === 'pendiente')
    .map((a) => ({ a, t: TRABAJOS.find((x) => x.id === a.trabajoId), r: REVISORES.find((x) => x.id === a.revisorId), e: estadoAsig(a) }))
    .sort((x, y) => (x.e.tipo === 'vencida' ? 0 : 1) - (y.e.tipo === 'vencida' ? 0 : 1) || x.a.fecha.localeCompare(y.a.fecha) || x.t.codigo.localeCompare(y.t.codigo));
  const venc = filas.filter((x) => x.e.tipo === 'vencida').length;
  const verSolo = soloVenc && venc > 0;
  const lista = verSolo ? filas.filter((x) => x.e.tipo === 'vencida') : filas;
  const entregadas = d.asig.filter((a) => a.estado === 'entregada').length;
  const nRevisores = new Set(filas.map((x) => x.a.revisorId)).size;

  return (
    <>
      <div className="h4-head">
        <div>
          <h1 className="h4-titulo">Seguimiento de revisiones</h1>
          <p className="h4-sub">Pendientes ordenadas por fecha límite · cierre de la etapa: {fmt(CIERRE_REVISION)}</p>
        </div>
        <div className="h4-acciones"><button type="button" className="h4-btn sec" disabled={filas.length === 0} onClick={() => setModal({ tipo: 'todos' })}>Recordatorio a todos los pendientes</button></div>
      </div>

      {venc > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Alerta nivel="error" accion={<button type="button" className="h4-btn pel" aria-pressed={verSolo} onClick={() => setSoloVenc(!verSolo)}>{verSolo ? 'Ver todas' : 'Ver solo vencidas'}</button>}>
            <strong>{venc} {plural(venc, 'revisión vencida', 'revisiones vencidas')}.</strong> Considere reasignar para no retrasar la publicación de resultados.
          </Alerta>
        </div>
      )}

      {filas.length === 0 ? (
        <Vacio titulo={d.asig.length === 0 ? 'Todavía no hay revisiones asignadas' : 'No hay revisiones pendientes'} texto={d.asig.length === 0 ? 'Cuando asigne revisores a los trabajos recibidos, el avance aparecerá aquí.' : 'Todas las revisiones asignadas ya fueron entregadas.'}>
          {d.asig.length === 0 && <button type="button" className="h4-btn sec" onClick={() => setVista('trabajos')}>Ir a trabajos recibidos</button>}
        </Vacio>
      ) : (
        <div className="h4-caja">
          <div className="h4-scroll">
            <table className="h4-tabla">
              <caption className="h4-solo">Revisiones pendientes</caption>
              <thead><tr><th>Código</th><th>Trabajo</th><th>Revisor</th><th>Fecha límite</th><th>Estado</th><th className="num">Acción</th></tr></thead>
              <tbody>
                {lista.map(({ a, t, r, e }) => (
                  <tr key={a.id} className={e.tipo === 'vencida' ? 'h4-venc' : ''}>
                    <td>{t.codigo}</td>
                    <td className="h4-bold">{t.titulo}</td>
                    <td>{r.nombre}</td>
                    <td className={e.tipo === 'vencida' ? 'h4-rojo' : ''}>{fmt(a.fecha)}</td>
                    <td><BadgeRevision e={e} /></td>
                    <td className="num">
                      {e.tipo === 'vencida' ? (
                        <button type="button" className="h4-link" aria-label={`Reasignar la revisión de ${t.codigo} a otro revisor`} onClick={() => setModal({ tipo: 'reasignar', asigId: a.id })}>Reasignar</button>
                      ) : (
                        <button type="button" className="h4-link" aria-label={`Recordar a ${r.nombre} la revisión de ${t.codigo}`} onClick={() => d.avisar('exito', `Recordatorio enviado a ${r.nombre} por ${t.codigo}.`)}>Recordar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="h4-resumen">
        <div>Revisiones entregadas<b className="h4-verde">{entregadas} de {d.asig.length}</b></div>
        <div>Pendientes en plazo<b className="h4-ambar">{filas.length - venc}</b></div>
        <div>Vencidas<b className={venc > 0 ? 'h4-rojo' : ''}>{venc}</b></div>
      </div>

      {modal?.tipo === 'reasignar' && <ModalMotivo d={d} modo="reasignar" asigId={modal.asigId} onCerrar={() => setModal(null)} />}
      {modal?.tipo === 'todos' && (
        <Modal titulo="Recordatorio a todos los pendientes" onCerrar={() => setModal(null)}
          pie={<div className="h4-acciones"><button type="button" className="h4-btn sec" onClick={() => setModal(null)}>Cancelar</button><button type="button" className="h4-btn pri" onClick={() => { d.avisar('exito', `Recordatorio enviado a ${nRevisores} ${plural(nRevisores, 'revisor', 'revisores')} con ${filas.length} ${plural(filas.length, 'revisión pendiente', 'revisiones pendientes')}.`); setModal(null); }}>Enviar recordatorios</button></div>}>
          <p>Se enviará un recordatorio a {nRevisores} {plural(nRevisores, 'revisor', 'revisores')} por {filas.length} {plural(filas.length, 'revisión pendiente', 'revisiones pendientes')}, incluidas las vencidas. ¿Desea continuar?</p>
        </Modal>
      )}
    </>
  );
}

/* ============================= PANTALLA PRINCIPAL ============================= */
const PESTANAS = [
  ['configuracion', 'Configuración', false], ['trabajos', 'Trabajos recibidos', true], ['revisores', 'Revisores', true], ['seguimiento', 'Seguimiento', true],
  ['programa', 'Programa', false], ['tablero', 'Tablero', false], ['usuarios', 'Usuarios', false],
];

function AsignacionRevisores({ onNavegar, vistaInicial = 'trabajos' }) {
  const [vista, setVista] = useState(vistaInicial);
  const [asig, setAsig] = useState(ASIGNACIONES_INICIALES);
  const [historial, setHistorial] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const contador = useRef(0);

  const avisar = useCallback((tipo, texto) => {
    contador.current += 1;
    const id = contador.current;
    setAvisos((p) => [...p, { id, tipo, texto }]);
  }, []);
  const quitarAviso = useCallback((id) => setAvisos((p) => p.filter((a) => a.id !== id)), []);

  const filas = useMemo(
    () => TRABAJOS.map((t) => {
      const mias = asig.filter((a) => a.trabajoId === t.id);
      const fijo = ['Borrador', 'Aceptado', 'Rechazado'].includes(t.estado);
      return { ...t, estado: fijo ? t.estado : mias.length ? 'En revisión' : 'Enviado', asignados: mias.length, entregadas: mias.filter((a) => a.estado === 'entregada').length };
    }),
    [asig],
  );
  const revs = useMemo(
    () => REVISORES.map((r) => {
      const m = asig.filter((a) => a.revisorId === r.id);
      const ent = m.filter((a) => a.estado === 'entregada').length;
      return { ...r, asignadas: m.length, entregadas: ent, pendientes: m.length - ent, vencidas: m.filter((a) => estadoAsig(a).tipo === 'vencida').length };
    }),
    [asig],
  );

  // Cada operación devuelve true/false: la interfaz nunca anuncia un éxito que no ocurrió.
  function asignar({ trabajoIds, revisorIds, fecha, justificacion }) {
    let n = Math.max(0, ...asig.map((a) => Number(a.id.slice(1)))) + 1;
    const nuevas = [];
    const eventos = [];
    for (const trabajoId of trabajoIds) {
      const actuales = asig.filter((a) => a.trabajoId === trabajoId);
      const agregar = revisorIds.filter((rid) => !actuales.some((a) => a.revisorId === rid));
      if (actuales.length + agregar.length > MAX_REV) return false;
      for (const revisorId of agregar) {
        nuevas.push({ id: `A${n++}`, trabajoId, revisorId, fecha, estado: 'pendiente' });
        eventos.push({ accion: 'asignada', trabajoId, revisorId, motivo: justificacion });
      }
    }
    if (!nuevas.length) return false;
    setAsig((p) => [...p, ...nuevas]);
    setHistorial((p) => [...p, ...eventos.map((e, i) => ({ ...e, id: p.length + i + 1, fecha: HOY }))]);
    return true;
  }
  function retirar(asigId, motivo) {
    const a = asig.find((x) => x.id === asigId);
    if (!a || a.estado === 'entregada') return false;
    setAsig((p) => p.filter((x) => x.id !== asigId));
    setHistorial((p) => [...p, { id: p.length + 1, fecha: HOY, accion: 'retirada', trabajoId: a.trabajoId, revisorId: a.revisorId, motivo }]);
    return true;
  }
  function reasignar(asigId, nuevoId, fecha, motivo) {
    const a = asig.find((x) => x.id === asigId);
    if (!a || a.estado === 'entregada' || asig.some((x) => x.trabajoId === a.trabajoId && x.revisorId === nuevoId)) return false;
    const idNuevo = `A${Math.max(0, ...asig.map((x) => Number(x.id.slice(1)))) + 1}`;
    setAsig((p) => [...p.filter((x) => x.id !== asigId), { id: idNuevo, trabajoId: a.trabajoId, revisorId: nuevoId, fecha, estado: 'pendiente' }]);
    setHistorial((p) => [...p, { id: p.length + 1, fecha: HOY, accion: 'reasignada', trabajoId: a.trabajoId, revisorId: a.revisorId, nuevoId, motivo }]);
    return true;
  }

  const d = { asig, filas, revs, historial, asignar, retirar, reasignar, avisar };

  // Pestañas de otras historias: si el padre no las resuelve, se avisa.
  function irA(id) {
    if (['trabajos', 'revisores', 'seguimiento'].includes(id)) setVista(id);
    else if (onNavegar) onNavegar(id);
    else avisar('info', 'Esa sección pertenece a otra historia y todavía no está integrada.');
  }

  return (
    <div className="h4-app">
      <nav className="h4-nav" aria-label="Navegación del comité">
        <div className="h4-in">
          <ul className="h4-tabs">
            {PESTANAS.map(([id, texto]) => (
              <li key={id}>
                <button type="button" className={`h4-tab${vista === id ? ' on' : ''}`} aria-current={vista === id ? 'page' : undefined} onClick={() => irA(id)}>{texto}</button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="h4-main">
        <div className="h4-in">
          {vista === 'trabajos' && <Trabajos d={d} irA={irA} />}
          {vista === 'revisores' && <Revisores d={d} />}
          {vista === 'seguimiento' && <Seguimiento d={d} setVista={setVista} />}
        </div>
      </div>

      <div className="h4-avisos" aria-live="polite">
        {avisos.map((a) => <Aviso key={a.id} aviso={a} onQuitar={quitarAviso} />)}
      </div>
    </div>
  );
}

export default AsignacionRevisores;

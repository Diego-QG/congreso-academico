import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './Trabajos.css';
import './MisTrabajos.css';

const filtros = ['Todos', 'Borrador', 'En revisión', 'Aceptado'];

function leerTrabajos(claveBorrador, registration) {
  let contenido;
  try {
    contenido = window.localStorage.getItem(claveBorrador);
  } catch {
    return { trabajos: [], error: 'No se pudo acceder a los trabajos guardados en este navegador.' };
  }

  if (!contenido) return { trabajos: [], error: '' };

  let borrador;
  try {
    borrador = JSON.parse(contenido);
  } catch {
    return { trabajos: [], error: 'El trabajo guardado tiene datos dañados y no se pudo cargar.' };
  }

  if (!borrador?.formulario || typeof borrador.formulario !== 'object') {
    return { trabajos: [], error: 'El trabajo guardado no tiene un formato válido.' };
  }

  const fecha = borrador.guardadoEn && new Date(borrador.guardadoEn);
  const fechaLegible = fecha && !Number.isNaN(fecha.getTime())
    ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'short' }).format(fecha)
    : '';
  const autores = [
    `${registration.nombres || ''} ${registration.apellidos || ''}`.trim(),
    ...(Array.isArray(borrador.coautores)
      ? borrador.coautores.map((coautor) => coautor.nombre).filter(Boolean)
      : []),
  ].filter(Boolean);

  return {
    trabajos: [{
      id: borrador.id || 'Trabajo sin código',
      titulo: borrador.formulario.titulo?.trim() || 'Trabajo sin título',
      autores: autores.join(', ') || registration.email || registration.correo || '',
      eje: borrador.formulario.eje || 'Eje temático pendiente',
      tipo: borrador.formulario.tipo || 'Tipo pendiente',
      estado: borrador.estado || 'Borrador',
      detalle: borrador.estado === 'En revisión'
        ? `Enviado el ${fechaLegible || 'fecha no disponible'}`
        : `No enviado · borrador guardado${fechaLegible ? ` el ${fechaLegible}` : ''}`,
    }],
    error: '',
  };
}

export default function MisTrabajos() {
  const registration = getCurrentParticipant();
  const claveBorrador = `congreso.trabajo.borrador.${registration?.email || registration?.correo || 'autor'}`;
  const [datosGuardados] = useState(() => leerTrabajos(claveBorrador, registration || {}));
  const trabajos = datosGuardados.trabajos;
  const errorCarga = datosGuardados.error;
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const sinTrabajos = trabajos.length === 0 && !errorCarga;
  const recepcionAbierta = trabajos.every((trabajo) => trabajo.estado === 'Borrador');

  const consulta = busqueda.trim().toLocaleLowerCase();
  const trabajosVisibles = trabajos.filter((trabajo) => {
    const coincideEstado = filtro === 'Todos' || trabajo.estado === filtro;
    const coincideBusqueda = !consulta
      || `${trabajo.id} ${trabajo.titulo}`.toLocaleLowerCase().includes(consulta);
    return coincideEstado && coincideBusqueda;
  });

  if (!['autor', 'ambos'].includes(registration?.rolParticipacion)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="mis-trabajos">
      <div className={`trabajos__aviso mis-trabajos__aviso${recepcionAbierta ? ' mis-trabajos__aviso--abierta' : ''}`}>
        {recepcionAbierta ? (
          <>
            <span><strong>Recepción abierta.</strong> Cierra el 30/09/2026 a las 23:59.</span>
            <strong>Faltan 12 días · 04:11 h</strong>
          </>
        ) : (
          <>
            <span><strong>Etapa de revisión.</strong> Los resultados se publican el 28/10/2026 a las 12:00.</span>
            <strong>Faltan 22 días</strong>
          </>
        )}
      </div>

      {errorCarga ? (
        <>
          <header className="mis-trabajos__encabezado">
            <h1>Mis trabajos</h1>
          </header>
          <p className="trabajos__panel mis-trabajos__vacio" role="alert">{errorCarga}</p>
        </>
      ) : sinTrabajos ? (
        <>
          <header className="mis-trabajos__encabezado mis-trabajos__encabezado--vacio">
            <div>
              <h1>Mis trabajos</h1>
              <p>Aún no registra trabajos en esta edición</p>
            </div>
            <Link className="mis-trabajos__nuevo" to="/nuevo-trabajo">Nuevo trabajo</Link>
          </header>

          <section className="trabajos__panel mis-trabajos__estado-vacio" aria-labelledby="mis-trabajos-vacio-titulo">
            <span className="mis-trabajos__icono-vacio" aria-hidden="true">✎</span>
            <h2 id="mis-trabajos-vacio-titulo">Todavía no tiene trabajos registrados</h2>
            <p>
              Registre su trabajo antes del 30/09/2026 a las 23:59. Puede guardarlo<br />
              como borrador y completarlo después.
            </p>
            <Link className="mis-trabajos__registrar" to="/nuevo-trabajo">
              Registrar mi primer trabajo
            </Link>
            <a className="mis-trabajos__bases" href="/#bases">Revisar las bases del congreso</a>
          </section>
        </>
      ) : (
        <>
          <header className="mis-trabajos__encabezado">
            <div>
              <h1>Mis trabajos</h1>
              <p>{trabajos.length} trabajo{trabajos.length === 1 ? '' : 's'} registrado{trabajos.length === 1 ? '' : 's'} como autor o coautor</p>
            </div>
            <button className="mis-trabajos__nuevo" type="button" disabled>
              Nuevo trabajo (recepción cerrada)
            </button>
          </header>

          <div className="mis-trabajos__herramientas">
            <div className="mis-trabajos__filtros" aria-label="Filtrar trabajos por estado">
              {filtros.map((opcion) => {
                const total = opcion === 'Todos'
                  ? trabajos.length
                  : trabajos.filter((trabajo) => trabajo.estado === opcion).length;
                return (
                  <button
                    className={filtro === opcion ? 'activo' : ''}
                    type="button"
                    key={opcion}
                    aria-pressed={filtro === opcion}
                    onClick={() => setFiltro(opcion)}
                  >
                    {opcion} · {total}
                  </button>
                );
              })}
            </div>
            <label className="mis-trabajos__busqueda">
              <span className="visually-hidden">Buscar por título o código</span>
              <input
                className="trabajos__campo-control"
                type="search"
                placeholder="Buscar por título o código..."
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
              />
            </label>
          </div>

          {trabajosVisibles.length > 0 ? (
            <div className="mis-trabajos__lista">
              {trabajosVisibles.map((trabajo) => (
                <article className="trabajos__superficie mis-trabajos__tarjeta" key={trabajo.id}>
                  <div className="mis-trabajos__meta">
                    <span>{trabajo.id}</span>
                    <span className={`mis-trabajos__estado mis-trabajos__estado--${trabajo.estado.toLocaleLowerCase().replace(' ', '-')}`}>
                      {trabajo.estado}
                    </span>
                  </div>
                  <h2>
                    <Link to={`/mis-trabajos/${encodeURIComponent(trabajo.id)}`}>
                      {trabajo.titulo}
                    </Link>
                  </h2>
                  <p className="mis-trabajos__autores">{trabajo.autores}</p>
                  <div className="mis-trabajos__etiquetas">
                    <span>{trabajo.eje}</span>
                    <span>{trabajo.tipo}</span>
                  </div>
                  <footer className="mis-trabajos__pie-tarjeta">
                    <span className={trabajo.estado === 'Borrador' ? 'pendiente' : ''}>
                      {trabajo.detalle}
                    </span>
                    <Link
                      className="mis-trabajos__ver-detalle"
                      to={`/mis-trabajos/${encodeURIComponent(trabajo.id)}`}
                    >
                      Ver detalle
                    </Link>
                  </footer>
                </article>
              ))}
            </div>
          ) : (
            <p className="trabajos__panel mis-trabajos__vacio">No se encontraron trabajos con esos criterios.</p>
          )}

          <footer className="trabajos__panel mis-trabajos__paginacion">
            <span>Mostrando {trabajosVisibles.length} de {trabajos.length} trabajos</span>
            <div>
              <button type="button" disabled>Anterior</button>
              <button className="activo" type="button" aria-current="page">1</button>
              <button type="button" disabled>Siguiente</button>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}

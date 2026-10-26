import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import './MisTrabajos.css';

const trabajos = [
  {
    id: 'TRB-2026-051',
    titulo: 'Evaluación del uso de agua reciclada en riego de áreas verdes del campus',
    autores: 'Rosa Quispe Tito, Sofía Bustamante León',
    eje: 'Sostenibilidad y ciudad',
    tipo: 'Resumen extendido',
    estado: 'Aceptado',
    detalle: 'Dictamen publicado el 28/10/2026',
  },
  {
    id: 'TRB-2026-057',
    titulo: 'Tablero de indicadores para la gestión de residuos sólidos en Surco',
    autores: 'Diego Chávez Manrique, Rosa Quispe Tito',
    eje: 'Sostenibilidad y ciudad',
    tipo: 'Caso de estudio',
    estado: 'En revisión',
    detalle: 'Enviado el 28/09/2026',
  },
];

const filtros = ['Todos', 'Borrador', 'En revisión', 'Aceptado'];

export default function MisTrabajos() {
  const registration = JSON.parse(
    window.sessionStorage.getItem('congreso.participante') || 'null'
  );
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const trabajosVisibles = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase();
    return trabajos.filter((trabajo) => {
      const coincideEstado = filtro === 'Todos' || trabajo.estado === filtro;
      const coincideBusqueda = !consulta
        || `${trabajo.id} ${trabajo.titulo}`.toLocaleLowerCase().includes(consulta);
      return coincideEstado && coincideBusqueda;
    });
  }, [busqueda, filtro]);

  if (!['autor', 'ambos'].includes(registration?.rolParticipacion)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="mis-trabajos">
      <div className="mis-trabajos__aviso">
        <span><strong>Etapa de revisión.</strong> Los resultados se publican el 28/10/2026 a las 12:00.</span>
        <strong>Faltan 22 días</strong>
      </div>

      <header className="mis-trabajos__encabezado">
        <div>
          <h1>Mis trabajos</h1>
          <p>4 trabajos registrados como autor o coautor</p>
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
            <article className="mis-trabajos__tarjeta" key={trabajo.id}>
              <div className="mis-trabajos__meta">
                <span>{trabajo.id}</span>
                <span className={`mis-trabajos__estado mis-trabajos__estado--${trabajo.estado.toLocaleLowerCase().replace(' ', '-')}`}>
                  {trabajo.estado}
                </span>
              </div>
              <h2>{trabajo.titulo}</h2>
              <p className="mis-trabajos__autores">{trabajo.autores}</p>
              <div className="mis-trabajos__etiquetas">
                <span>{trabajo.eje}</span>
                <span>{trabajo.tipo}</span>
              </div>
              <footer>
                <span className={trabajo.estado === 'Borrador' ? 'pendiente' : ''}>
                  {trabajo.detalle}
                </span>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <p className="mis-trabajos__vacio">No se encontraron trabajos con esos criterios.</p>
      )}

      <footer className="mis-trabajos__paginacion">
        <span>Mostrando {trabajosVisibles.length} de {trabajos.length} trabajos</span>
        <div>
          <button type="button" disabled>Anterior</button>
          <button className="activo" type="button" aria-current="page">1</button>
          <button type="button" disabled>Siguiente</button>
        </div>
      </footer>
    </section>
  );
}

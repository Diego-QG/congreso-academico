import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrograma } from './programaContexto';
import {
  aMinutos,
  autoresAbreviados,
  formatearFecha,
  horaDeTrabajo,
  nombreDelDia,
} from './programaServicio';
import ilustracionPendiente from '../../assets/ilustraciones/programa-pendiente.svg';
import './ProgramaPublico.css';

const TODOS = '';

function unicos(lista) {
  return [...new Set(lista)].sort();
}

export default function ProgramaPublico() {
  const { sesiones, programa, trabajosAceptados } = usePrograma();
  const dias = unicos(sesiones.map((s) => s.fecha));
  const ejes = unicos(sesiones.map((s) => s.eje));
  const salas = unicos(sesiones.map((s) => s.sala));

  const [dia, setDia] = useState(dias[0]);
  const [eje, setEje] = useState(TODOS);
  const [sala, setSala] = useState(TODOS);

  if (!programa.publicado || sesiones.length === 0) {
    return (
      <section className="programa">
        <h1 className="programa-titulo">Programa del congreso</h1>
        <div className="programa-vacio">
          <img className="programa-vacio-icono" src={ilustracionPendiente} alt="" />
          <h2>El programa aún no se ha publicado</h2>
          <p>
            El comité organizador está armando las sesiones con los trabajos aceptados.
            Vuelva a consultar después de la publicación de resultados.
          </p>
          <Link to="/" className="programa-boton-secundario">Ir al inicio</Link>
        </div>
      </section>
    );
  }

  const trabajoPorId = (id) => trabajosAceptados.find((t) => t.id === id);
  const totalTrabajos = sesiones.reduce((suma, s) => suma + s.trabajos.length, 0);

  const sesionesVisibles = sesiones
    .filter((s) => s.fecha === dia)
    .filter((s) => eje === TODOS || s.eje === eje)
    .filter((s) => sala === TODOS || s.sala === sala)
    .sort((a, b) => aMinutos(a.horaInicio) - aMinutos(b.horaInicio) || a.sala.localeCompare(b.sala));

  function limpiarFiltros() {
    setEje(TODOS);
    setSala(TODOS);
  }

  return (
    <section className="programa programa-publico">
      <div className="programa-cabecera">
        <div>
          <h1 className="programa-titulo">Programa del congreso</h1>
          <p className="programa-sub">
            {totalTrabajos} {totalTrabajos === 1 ? 'trabajo' : 'trabajos'} ·{' '}
            {sesiones.length} sesiones · Salas {salas.join(', ')}
          </p>
        </div>
        <button type="button" className="programa-boton-secundario" onClick={() => window.print()}>
          Descargar programa en PDF
        </button>
      </div>

      <div className="programa-barra">
        <div className="programa-dias" role="tablist">
          {dias.map((d) => (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={d === dia}
              className={'programa-dia' + (d === dia ? ' activo' : '')}
              onClick={() => setDia(d)}
            >
              {nombreDelDia(d)} {formatearFecha(d)}
            </button>
          ))}
        </div>

        <div className="programa-filtros">
          <label>
            <span className="programa-etiqueta">Eje</span>
            <select value={eje} onChange={(e) => setEje(e.target.value)}>
              <option value={TODOS}>Todos</option>
              {ejes.map((e) => <option key={e}>{e}</option>)}
            </select>
          </label>
          <label>
            <span className="programa-etiqueta">Sala</span>
            <select value={sala} onChange={(e) => setSala(e.target.value)}>
              <option value={TODOS}>Todas</option>
              {salas.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
      </div>

      {sesionesVisibles.length === 0 ? (
        <div className="programa-vacio">
          <h2>No hay sesiones con estos filtros</h2>
          <p>Pruebe con otro eje, otra sala u otro día del congreso.</p>
          <button type="button" className="programa-boton-secundario" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        sesionesVisibles.map((sesion) => (
          <article key={sesion.id} className="sesion">
            <header className="sesion-cabecera">
              <div>
                <h2>{sesion.nombre}</h2>
                <p>Moderación: {sesion.moderador}</p>
              </div>
              <div className="sesion-chips">
                <span className="chip chip-hora">{sesion.horaInicio} – {sesion.horaFin}</span>
                <span className="chip">Sala {sesion.sala}</span>
              </div>
            </header>

            {sesion.trabajos.length === 0 ? (
              <p className="sesion-sin-trabajos">Trabajos por confirmar.</p>
            ) : (
              <ol className="sesion-trabajos">
                {sesion.trabajos.map(trabajoPorId).filter(Boolean).map((trabajo, i) => (
                  <li key={trabajo.id}>
                    <span className="sesion-hora">{horaDeTrabajo(sesion, i)}</span>
                    <span className="sesion-titulo">{trabajo.titulo}</span>
                    <span className="sesion-autores">{autoresAbreviados(trabajo)}</span>
                  </li>
                ))}
              </ol>
            )}
          </article>
        ))
      )}
    </section>
  );
}

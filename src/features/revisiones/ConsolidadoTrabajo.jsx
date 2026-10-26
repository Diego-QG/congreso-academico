import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRevisiones } from './revisionesContexto';
import {
  obtenerAsignacionesDeTrabajo,
  obtenerCriterios,
  obtenerRevisor,
  obtenerTrabajo,
} from './revisionesServicio';
import { calcularConsolidado, diaMes, MINIMO_REVISIONES, TEXTO_RECOMENDACION, unDecimal } from './consolidado';
import './ConsolidadoTrabajo.css';

const CRITERIOS = obtenerCriterios();

export default function ConsolidadoTrabajo() {
  const { trabajoId } = useParams();
  const trabajo = obtenerTrabajo(trabajoId);

  if (!trabajo) {
    return (
      <section className="consolidado">
        <p className="consolidado-vacio">No se encontró este trabajo.</p>
      </section>
    );
  }

  return <Consolidado trabajo={trabajo} />;
}

function Consolidado({ trabajo }) {
  const { revisiones, dictamenes } = useRevisiones();
  const [pestana, setPestana] = useState('autor');

  const asignadas = obtenerAsignacionesDeTrabajo(trabajo.id).length;
  const enviadas = revisiones.filter((r) => r.trabajoId === trabajo.id && r.estado === 'enviada');
  const c = calcularConsolidado(enviadas, CRITERIOS);
  const dictamen = dictamenes.find((d) => d.trabajoId === trabajo.id);
  const puedeDecidir = enviadas.length >= MINIMO_REVISIONES && !dictamen;

  return (
    <section className="consolidado">
      <p className="consolidado-migas">
        <Link to="/comite/asignaciones">Trabajos recibidos</Link> › {trabajo.codigo} › Consolidado
      </p>

      <header className="consolidado-cabecera">
        <div>
          <div className="consolidado-codigo">
            {trabajo.codigo}
            <span className={'consolidado-estado' + (dictamen ? ' consolidado-estado-decidido' : '')}>
              {trabajo.estado} · {enviadas.length} de {asignadas} entregadas
            </span>
          </div>
          <h1>{trabajo.titulo}</h1>
          <p className="consolidado-datos">
            {trabajo.eje} · {trabajo.tipo} · {trabajo.autor.nombre}
            {trabajo.coautores.length > 0 && ` y ${trabajo.coautores.length} coautor${trabajo.coautores.length > 1 ? 'es' : ''}`}
          </p>
        </div>
        <div className="consolidado-acciones">
          <button type="button" className="boton-primario" disabled={!puedeDecidir}>
            Registrar decisión final
          </button>
          {!dictamen && enviadas.length < MINIMO_REVISIONES && (
            <span className="consolidado-aviso">
              Se necesitan al menos {MINIMO_REVISIONES} revisiones entregadas para decidir.
            </span>
          )}
        </div>
      </header>

      {dictamen && (
        <p className="consolidado-dictamen">
          Dictamen publicado el {dictamen.fecha}: <strong>{dictamen.decision === 'aceptado' ? 'Aceptado' : 'Rechazado'}</strong>
        </p>
      )}

      {enviadas.length === 0 ? (
        <p className="consolidado-vacio">Todavía ningún revisor entregó su evaluación.</p>
      ) : (
        <>
          <div className="consolidado-indicadores">
            <Indicador titulo="Puntaje promedio" valor={unDecimal(c.promedio)} detalle="de 20" />
            <Indicador titulo="Dispersión" valor={unDecimal(c.dispersion)} detalle="diferencia máx." />
            <Indicador
              titulo="Recomiendan aceptar"
              valor={`${c.recomiendanAceptar} de ${enviadas.length}`}
              detalle={`${c.conObservaciones} con observaciones`}
            />
            <Indicador titulo="Última entrega" valor={diaMes(c.ultimaEntrega)} detalle={c.ultimaEntrega?.slice(0, 4)} />
          </div>

          <table className="consolidado-tabla">
            <thead>
              <tr>
                <th>Revisor</th>
                {CRITERIOS.map((cr) => (
                  <th key={cr.id} className="numero">
                    {cr.nombre} {cr.peso} %
                  </th>
                ))}
                <th className="numero">Ponderado</th>
                <th className="numero">Recomendación</th>
              </tr>
            </thead>
            <tbody>
              {c.filas.map((f, i) => (
                <tr key={f.id}>
                  <td>
                    Revisor {i + 1} · {obtenerRevisor(f.revisorId)?.nombre}
                  </td>
                  {CRITERIOS.map((cr) => (
                    <td key={cr.id} className="numero">
                      {f.puntajes.find((p) => p.criterioId === cr.id)?.puntaje}
                    </td>
                  ))}
                  <td className="numero">
                    <strong>{unDecimal(f.ponderado)}</strong>
                  </td>
                  <td className="numero">
                    <span className={'recomendacion recomendacion-' + f.recomendacion}>
                      {TEXTO_RECOMENDACION[f.recomendacion]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Promedio por criterio</td>
                {c.promedioPorCriterio.map((p, i) => (
                  <td key={CRITERIOS[i].id} className="numero">
                    {unDecimal(p)}
                  </td>
                ))}
                <td className="numero consolidado-total">{unDecimal(c.promedio)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <div className="consolidado-comentarios">
            <div className="consolidado-pestanas">
              <button type="button" className={pestana === 'autor' ? 'activa' : ''} onClick={() => setPestana('autor')}>
                Comentarios al autor
              </button>
              <button type="button" className={pestana === 'comite' ? 'activa' : ''} onClick={() => setPestana('comite')}>
                Observaciones confidenciales
              </button>
            </div>
            <div className="consolidado-lista">
              {c.filas.map((f, i) => {
                const texto = pestana === 'autor' ? f.comentarioAutor : f.observacionComite;
                return (
                  <div key={f.id} className="consolidado-comentario">
                    <span>Revisor {i + 1}</span>
                    <p>{texto || 'Sin observaciones.'}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Indicador({ titulo, valor, detalle }) {
  return (
    <div className="indicador">
      <span className="indicador-titulo">{titulo}</span>
      <strong className="indicador-valor">{valor}</strong>
      <span className="indicador-detalle">{detalle}</span>
    </div>
  );
}

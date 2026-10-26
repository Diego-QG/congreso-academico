import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import seed from '../../data/seed.json';
import FormularioCriterios from '../../shared/FormularioCriterios';
import { aNumero } from '../../shared/puntajes';
import { useRevisiones } from './revisionesContexto';
import './FormularioEvaluacion.css';

const RECOMENDACIONES = [
  { valor: 'aceptar', texto: 'Aceptar' },
  { valor: 'aceptar_con_observaciones', texto: 'Aceptar con observaciones' },
  { valor: 'rechazar', texto: 'Rechazar' },
];

const CRITERIOS = seed.edicion.criterios;
const MENSAJE_PUNTAJE = 'Ingrese un puntaje entre 0 y 20.';

// Si el revisor ya tiene un borrador o una revisión enviada, se usa esa;
// si no, se arma una revisión vacía con un puntaje por cada criterio.
function revisionInicial(asignacion, revisiones) {
  const existente = revisiones.find((r) => r.asignacionId === asignacion.id);
  if (existente) return existente;
  return {
    id: 'REV-' + asignacion.id,
    asignacionId: asignacion.id,
    trabajoId: asignacion.trabajoId,
    revisorId: asignacion.revisorId,
    estado: 'borrador',
    puntajes: CRITERIOS.map((c) => ({ criterioId: c.id, puntaje: null, comentario: '' })),
    comentarioAutor: '',
    observacionComite: '',
    recomendacion: '',
    fechaEnvio: null,
  };
}

export default function FormularioEvaluacion() {
  const { asignacionId } = useParams();
  const asignacion = seed.asignaciones.find((a) => a.id === asignacionId);

  if (!asignacion) {
    return (
      <section className="evaluacion">
        <p className="evaluacion-vacia">
          No se encontró esta revisión. <Link to="/revisor/bandeja">Volver a mi bandeja</Link>
        </p>
      </section>
    );
  }

  return <Evaluacion asignacion={asignacion} />;
}

function Evaluacion({ asignacion }) {
  const trabajo = seed.trabajos.find((t) => t.id === asignacion.trabajoId);
  const { revisiones, guardarRevision } = useRevisiones();
  const [revision, setRevision] = useState(() => revisionInicial(asignacion, revisiones));
  const [errores, setErrores] = useState({ criterios: {} });
  const [aviso, setAviso] = useState('');
  const soloLectura = revision.estado === 'enviada';

  function cambiarCriterio(criterioId, campo, valor) {
    setRevision((r) => ({
      ...r,
      puntajes: r.puntajes.map((p) => (p.criterioId === criterioId ? { ...p, [campo]: valor } : p)),
    }));
  }

  function cambiarCampo(campo, valor) {
    setRevision((r) => ({ ...r, [campo]: valor }));
  }

  // El borrador admite campos vacíos; el envío exige todo completo.
  function validar(paraEnviar) {
    const nuevos = { criterios: {} };
    for (const p of revision.puntajes) {
      const vacio = p.puntaje === null || p.puntaje === '';
      if (vacio) {
        if (paraEnviar) nuevos.criterios[p.criterioId] = MENSAJE_PUNTAJE;
        continue;
      }
      const n = Number(p.puntaje);
      if (Number.isNaN(n) || n < 0 || n > 20) nuevos.criterios[p.criterioId] = MENSAJE_PUNTAJE;
    }
    if (paraEnviar && revision.comentarioAutor.trim() === '') {
      nuevos.comentarioAutor = 'Escriba un comentario para el autor.';
    }
    if (paraEnviar && revision.recomendacion === '') {
      nuevos.recomendacion = 'Elija una recomendación.';
    }
    setErrores(nuevos);
    return Object.keys(nuevos.criterios).length === 0 && !nuevos.comentarioAutor && !nuevos.recomendacion;
  }

  // Arma la revisión tal como se guarda: puntajes como número (o null) y fecha de envío.
  function revisionParaGuardar(estado) {
    return {
      ...revision,
      estado,
      puntajes: revision.puntajes.map((p) => ({ ...p, puntaje: aNumero(p.puntaje) })),
      fechaEnvio: estado === 'enviada' ? new Date().toLocaleDateString('en-CA') : null,
    };
  }

  function guardarBorrador() {
    if (!validar(false)) {
      setAviso('');
      return;
    }
    const nueva = revisionParaGuardar('borrador');
    guardarRevision(nueva);
    setRevision(nueva);
    const hora = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    setAviso('Borrador guardado a las ' + hora + '.');
  }

  function enviar() {
    if (!validar(true)) {
      setAviso('');
      return;
    }
    const confirmado = window.confirm('Una vez enviada, la evaluación ya no admite cambios. ¿Desea enviarla?');
    if (!confirmado) return;
    const nueva = revisionParaGuardar('enviada');
    guardarRevision(nueva);
    setRevision(nueva); // pasa a modo lectura y aparece el banner de "enviada"
    window.scrollTo(0, 0);
  }

  const recomendacionTexto = RECOMENDACIONES.find((r) => r.valor === revision.recomendacion)?.texto;

  return (
    <section className="evaluacion">
      <p className="evaluacion-migas">
        <Link to="/revisor/bandeja">Mi bandeja</Link> › {trabajo.codigo} › Evaluación
      </p>

      {soloLectura && (
        <p className="evaluacion-banner">
          Evaluación enviada el {revision.fechaEnvio}. Ya no admite cambios; si necesita corregirla, solicítelo al
          comité.
        </p>
      )}

      <header className="evaluacion-trabajo">
        <div>
          <p className="evaluacion-etiquetas">
            <span>{trabajo.codigo}</span>
            <span className="evaluacion-eje">{trabajo.eje}</span>
            <span className="evaluacion-tipo">{trabajo.tipo}</span>
          </p>
          <h1>{trabajo.titulo}</h1>
        </div>
        <div className="evaluacion-plazo">
          {soloLectura ? (
            <span className="evaluacion-recomendada">Recomendación: {recomendacionTexto}</span>
          ) : (
            <>
              <strong>Vence el {asignacion.fecha}</strong>
              <span>Revisión ciega: no verá los nombres de los autores.</span>
            </>
          )}
        </div>
      </header>

      <div className="evaluacion-cuerpo">
        <FormularioCriterios
          criterios={CRITERIOS}
          puntajes={revision.puntajes}
          errores={errores.criterios}
          soloLectura={soloLectura}
          onCambiar={cambiarCriterio}
        />

        {!soloLectura && (
          <aside className="evaluacion-lateral">
            <fieldset className="evaluacion-recomendacion">
              <legend>Recomendación *</legend>
              {RECOMENDACIONES.map((r) => (
                <label
                  key={r.valor}
                  className={'evaluacion-opcion' + (revision.recomendacion === r.valor ? ' evaluacion-opcion-activa' : '')}
                >
                  <input
                    type="radio"
                    name="recomendacion"
                    value={r.valor}
                    checked={revision.recomendacion === r.valor}
                    onChange={() => cambiarCampo('recomendacion', r.valor)}
                  />
                  {r.texto}
                </label>
              ))}
              {errores.recomendacion && <span className="evaluacion-error">{errores.recomendacion}</span>}
            </fieldset>
            <p className="evaluacion-nota">
              Los comentarios al autor se publican con el dictamen. Las observaciones al comité son confidenciales.
            </p>
          </aside>
        )}
      </div>

      <div className="evaluacion-comentarios">
        <label>
          <span>Comentarios al autor{soloLectura ? '' : ' *'}</span>
          {soloLectura ? (
            <p>{revision.comentarioAutor}</p>
          ) : (
            <textarea
              rows="3"
              className={errores.comentarioAutor ? 'evaluacion-campo-error' : ''}
              value={revision.comentarioAutor}
              onChange={(e) => cambiarCampo('comentarioAutor', e.target.value)}
            />
          )}
          {errores.comentarioAutor && <span className="evaluacion-error">{errores.comentarioAutor}</span>}
        </label>
        <label>
          <span>Observaciones al comité (confidencial)</span>
          {soloLectura ? (
            <p>{revision.observacionComite}</p>
          ) : (
            <textarea
              rows="3"
              value={revision.observacionComite}
              onChange={(e) => cambiarCampo('observacionComite', e.target.value)}
            />
          )}
        </label>
      </div>

      {!soloLectura && (
        <footer className="evaluacion-acciones">
          <span className="evaluacion-aviso">{aviso}</span>
          <button type="button" className="boton-secundario" onClick={guardarBorrador}>
            Guardar borrador
          </button>
          <button type="button" className="boton-primario" onClick={enviar}>
            Enviar recomendación
          </button>
        </footer>
      )}
    </section>
  );
}
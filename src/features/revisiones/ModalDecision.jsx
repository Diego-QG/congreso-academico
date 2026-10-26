import { useEffect, useState } from 'react';
import DialogoConfirmacion from '../../shared/DialogoConfirmacion';
import { sugerenciaPorPuntaje, unDecimal } from './consolidado';
import './ModalDecision.css';

const OPCIONES = [
  { valor: 'aceptado', texto: 'Aceptar', detalle: 'Pasa al programa del congreso.' },
  { valor: 'rechazado', texto: 'Rechazar', detalle: 'No participa en esta edición.' },
];

// Une los comentarios al autor de todos los revisores en un solo texto.
function textoDeRevisores(filas) {
  return filas
    .map((f) => f.comentarioAutor.trim())
    .filter((t) => t !== '')
    .join(' ');
}

export default function ModalDecision({ trabajo, consolidado, dictamen, onGuardar, onCerrar }) {
  const [decision, setDecision] = useState(dictamen?.decision ?? '');
  const [retroalimentacion, setRetroalimentacion] = useState(
    dictamen?.retroalimentacion ?? textoDeRevisores(consolidado.filas)
  );
  const [errores, setErrores] = useState({});
  const [confirmando, setConfirmando] = useState(false);

  // Escape cierra el modal (si el diálogo de confirmación no está abierto).
  useEffect(() => {
    function alPresionar(e) {
      if (e.key === 'Escape' && !confirmando) onCerrar();
    }
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [confirmando, onCerrar]);

  function validar() {
    const nuevos = {};
    if (decision === '') nuevos.decision = 'Elija aceptar o rechazar.';
    if (retroalimentacion.trim() === '') nuevos.retroalimentacion = 'Escriba la retroalimentación para el autor.';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  function guardar(estado) {
    onGuardar({
      trabajoId: trabajo.id,
      decision,
      retroalimentacion: retroalimentacion.trim(),
      estado,
      fecha: new Date().toLocaleDateString('en-CA'),
    });
  }

  function guardarSinPublicar() {
    if (validar()) guardar('borrador');
  }

  function pedirConfirmacion() {
    if (validar()) setConfirmando(true);
  }

  return (
    <div className="modal-fondo">
      <div className="modal-decision" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <header className="modal-cabecera">
          <div>
            <h2 id="modal-titulo">Decisión final del comité</h2>
            <p>
              {trabajo.codigo} · promedio {unDecimal(consolidado.promedio)} · {consolidado.filas.length} revisiones
              entregadas · sugerencia: {sugerenciaPorPuntaje(consolidado.promedio)}
            </p>
          </div>
          <button type="button" className="modal-cerrar" aria-label="Cerrar" onClick={onCerrar}>
            ×
          </button>
        </header>

        <div className="modal-cuerpo">
          <div className="modal-opciones">
            {OPCIONES.map((o) => (
              <label key={o.valor} className={'modal-opcion' + (decision === o.valor ? ' elegida-' + o.valor : '')}>
                <input
                  type="radio"
                  name="decision"
                  value={o.valor}
                  checked={decision === o.valor}
                  onChange={() => setDecision(o.valor)}
                />
                <span>
                  <strong>{o.texto}</strong>
                  <small>{o.detalle}</small>
                </span>
              </label>
            ))}
          </div>
          {errores.decision && <p className="modal-error">{errores.decision}</p>}

          <div className="modal-retro-titulo">
            <span>Retroalimentación al autor *</span>
            <button
              type="button"
              className="modal-enlace"
              onClick={() => setRetroalimentacion(textoDeRevisores(consolidado.filas))}
            >
              Restaurar texto de los revisores
            </button>
          </div>
          <textarea
            rows={6}
            value={retroalimentacion}
            onChange={(e) => setRetroalimentacion(e.target.value)}
          />
          {errores.retroalimentacion && <p className="modal-error">{errores.retroalimentacion}</p>}
          <p className="modal-ayuda">Precargado con los comentarios al autor de los revisores. Puede editarlo antes de publicar.</p>

          <p className="modal-advertencia">
            Al publicar, el resultado será visible para el autor en el detalle de su trabajo. La decisión no se puede
            modificar después.
          </p>
        </div>

        <footer className="modal-acciones">
          <button type="button" className="boton-secundario" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="button" className="modal-enlace" onClick={guardarSinPublicar}>
            Guardar sin publicar
          </button>
          <button type="button" className="boton-primario" onClick={pedirConfirmacion}>
            Publicar decisión
          </button>
        </footer>
      </div>

      <DialogoConfirmacion
        abierto={confirmando}
        titulo="¿Publicar la decisión?"
        mensaje={`El trabajo quedará ${decision === 'aceptado' ? 'aceptado' : 'rechazado'} y el autor podrá ver la retroalimentación. Esta acción no se puede deshacer.`}
        textoConfirmar="Sí, publicar"
        onConfirmar={() => guardar('publicado')}
        onCancelar={() => setConfirmando(false)}
      />
    </div>
  );
}

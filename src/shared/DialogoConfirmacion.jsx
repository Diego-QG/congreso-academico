import { useEffect } from 'react';
import './DialogoConfirmacion.css';

// Diálogo común para confirmar acciones que no se pueden deshacer.
// Uso: <DialogoConfirmacion abierto={...} titulo="..." mensaje="..." onConfirmar={...} onCancelar={...} />
export default function DialogoConfirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}) {
  // Escape cierra el diálogo, como en cualquier ventana.
  useEffect(() => {
    if (!abierto) return;
    function alPresionar(e) {
      if (e.key === 'Escape') onCancelar();
    }
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  return (
    <div className="dialogo-fondo" onClick={onCancelar}>
      <div
        className="dialogo"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialogo-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dialogo-titulo">{titulo}</h2>
        <p>{mensaje}</p>
        <div className="dialogo-acciones">
          <button type="button" className="boton-secundario" onClick={onCancelar}>
            {textoCancelar}
          </button>
          <button type="button" className="boton-primario" onClick={onConfirmar} autoFocus>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

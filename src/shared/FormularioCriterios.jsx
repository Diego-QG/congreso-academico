import { promedioPonderado } from './puntajes';
import './FormularioCriterios.css';

// Componente común: formulario de evaluación por criterios.
// Editable para el revisor, o en modo lectura cuando la revisión ya se envió.
export default function FormularioCriterios({ criterios, puntajes, errores = {}, soloLectura = false, onCambiar }) {
  const { valor, calificados } = promedioPonderado(puntajes, criterios);
  const completo = calificados === criterios.length;

  return (
    <div className="fc">
      <table className="fc-tabla">
        <thead>
          <tr>
            <th>Criterio</th>
            <th>Peso</th>
            <th>Puntaje (0-20)</th>
            <th>Comentario del criterio</th>
          </tr>
        </thead>
        <tbody>
          {criterios.map((c) => {
            const p = puntajes.find((x) => x.criterioId === c.id) ?? { puntaje: '', comentario: '' };
            const error = errores[c.id];
            return (
              <tr key={c.id}>
                <td className="fc-nombre">{c.nombre}</td>
                <td className="fc-peso" data-etiqueta="Peso">{c.peso} %</td>
                <td className="fc-celda-puntaje" data-etiqueta="Puntaje (0-20)">
                  {soloLectura ? (
                    <strong>{p.puntaje}</strong>
                  ) : (
                    <>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        className={'fc-puntaje' + (error ? ' fc-campo-error' : '')}
                        value={p.puntaje ?? ''}
                        onChange={(e) => onCambiar(c.id, 'puntaje', e.target.value)}
                        aria-label={'Puntaje de ' + c.nombre}
                      />
                      {error && <span className="fc-mensaje">{error}</span>}
                    </>
                  )}
                </td>
                <td className="fc-celda-comentario" data-etiqueta="Comentario del criterio">
                  {soloLectura ? (
                    <span className="fc-texto">{p.comentario}</span>
                  ) : (
                    <textarea
                      rows="2"
                      className="fc-comentario"
                      placeholder="Escriba su comentario..."
                      value={p.comentario}
                      onChange={(e) => onCambiar(c.id, 'comentario', e.target.value)}
                      aria-label={'Comentario de ' + c.nombre}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="fc-total">
        <span>
          {completo
            ? 'Promedio ponderado'
            : `Promedio ponderado provisional (${calificados} de ${criterios.length} criterios)`}
        </span>
        <strong>{valor === null ? '—' : valor.toFixed(1)}</strong>
      </div>
    </div>
  );
}
import { useState } from 'react';
import CabeceraComite from './CabeceraComite';
import PestanasConfig from './PestanasConfig';
import PieComite from './PieComite';
import './Historia2.css';

const CRONOGRAMA_INICIAL = {
  recepcion: { fecha: '2026-09-30', hora: '23:59' },
  revision: { fecha: '2026-10-20', hora: '18:00' },
  resultados: { fecha: '2026-10-28', hora: '12:00' },
};

const ETAPAS = [
  { clave: 'recepcion', etiqueta: 'CIERRE DE RECEPCIÓN DE TRABAJOS', punto: 'punto-primario' },
  { clave: 'revision', etiqueta: 'CIERRE DE LA ETAPA DE REVISIÓN', punto: 'punto-acento' },
  { clave: 'resultados', etiqueta: 'PUBLICACIÓN DE RESULTADOS', punto: 'punto-exito' },
];

function formatear(fecha) {
  if (fecha === '') {
    return '—';
  }
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

function fechaHora(etapa) {
  return `${etapa.fecha}T${etapa.hora}`;
}

function validar(cronograma) {
  const errores = {};

  ETAPAS.forEach(({ clave }) => {
    if (cronograma[clave].fecha === '' || cronograma[clave].hora === '') {
      errores[clave] = 'Este campo es obligatorio.';
    }
  });

  if (
    !errores.recepcion &&
    !errores.revision &&
    fechaHora(cronograma.revision) <= fechaHora(cronograma.recepcion)
  ) {
    errores.revision = `Debe ser posterior al cierre de la recepción (${formatear(cronograma.recepcion.fecha)}).`;
  }

  if (
    !errores.resultados &&
    ((!errores.revision && fechaHora(cronograma.resultados) <= fechaHora(cronograma.revision)) ||
      (!errores.recepcion && fechaHora(cronograma.resultados) <= fechaHora(cronograma.recepcion)))
  ) {
    errores.resultados = 'Debe ser posterior al cierre de la revisión.';
  }

  return errores;
}

function Historia2p4() {
  const [cronograma, setCronograma] = useState(CRONOGRAMA_INICIAL);
  const [guardado, setGuardado] = useState(false);

  const errores = validar(cronograma);
  const hayErrores = Object.keys(errores).length > 0;

  const evitarEnvio = (e) => {
    e.preventDefault();
  };

  const cambiarCampo = (clave, campo, valor) => {
    setCronograma({
      ...cronograma,
      [clave]: { ...cronograma[clave], [campo]: valor },
    });
    setGuardado(false);
  };

  const guardarCronograma = () => {
    if (hayErrores) {
      return;
    }
    setGuardado(true);
  };

  return (
    <div className="historia2-pagina">
      <CabeceraComite estado="Recepción abierta" />

      <main className="contenido">
        <div className="contenedor">
          <div className="pagina-cabecera">
            <div>
              <h1 className="pagina-titulo">Fechas límite</h1>
              <p className="texto-auxiliar">
                Las fechas deben ser consecutivas: recepción, revisión y publicación.
              </p>
            </div>
            <div className="pagina-acciones">
              <button
                type="button"
                className="btn btn-primario"
                disabled={hayErrores}
                onClick={guardarCronograma}
              >
                Guardar cronograma
              </button>
            </div>
          </div>

          <PestanasConfig activa="Fechas límite" />

          {hayErrores ? (
            <div className="aviso-error">
              <strong>El cronograma no es consecutivo.</strong> Corrija las fechas marcadas
              para poder guardar.
            </div>
          ) : null}

          {guardado ? (
            <div className="aviso-exito aviso-separado">
              ✓ Cronograma guardado correctamente. El aviso de fecha límite de los autores
              se actualizó.
            </div>
          ) : null}

          <div className="fila-config">
            <section className="tarjeta">
              <form className="formulario" onSubmit={evitarEnvio}>
                {ETAPAS.map(({ clave, etiqueta, punto }) => (
                  <div className="cronograma-fila" key={clave}>
                    <span className={`fecha-punto ${errores[clave] ? 'punto-error' : punto}`}></span>

                    <div className="cronograma-campos">
                      <div className="fecha-fila">
                        <div>
                          <label className="etiqueta" htmlFor={`${clave}-fecha`}>{etiqueta} *</label>
                          <input
                            type="date"
                            id={`${clave}-fecha`}
                            className={`entrada ${errores[clave] ? 'entrada-error' : ''}`}
                            value={cronograma[clave].fecha}
                            onChange={(e) => cambiarCampo(clave, 'fecha', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="etiqueta" htmlFor={`${clave}-hora`}>HORA</label>
                          <input
                            type="time"
                            id={`${clave}-hora`}
                            className={`entrada ${errores[clave] ? 'entrada-error' : ''}`}
                            value={cronograma[clave].hora}
                            onChange={(e) => cambiarCampo(clave, 'hora', e.target.value)}
                          />
                        </div>
                      </div>
                      {errores[clave] ? <p className="mensaje-error">{errores[clave]}</p> : null}
                    </div>
                  </div>
                ))}

                {!hayErrores ? (
                  <div className="aviso-exito">
                    Cronograma válido: las tres fechas son consecutivas.
                  </div>
                ) : null}
              </form>
            </section>

            <aside className="lateral">
              {hayErrores ? (
                <div className="tarjeta">
                  <p className="etiqueta">ORDEN ESPERADO</p>
                  <ol className="lista-orden">
                    <li>Cierre de recepción</li>
                    <li>Cierre de la revisión</li>
                    <li>Publicación de resultados</li>
                  </ol>
                  <p className="texto-auxiliar">
                    El botón de guardar permanece deshabilitado mientras exista una inconsistencia.
                  </p>
                </div>
              ) : (
                <div className="tarjeta">
                  <p className="etiqueta">VISTA PREVIA PÚBLICA</p>
                  <div className="resumen-fila">
                    <span>Recepción</span>
                    <strong>hasta {formatear(cronograma.recepcion.fecha)}</strong>
                  </div>
                  <div className="resumen-fila">
                    <span>Revisión</span>
                    <strong>hasta {formatear(cronograma.revision.fecha)}</strong>
                  </div>
                  <div className="resumen-fila">
                    <span>Resultados</span>
                    <strong>{formatear(cronograma.resultados.fecha)}</strong>
                  </div>
                  <p className="texto-auxiliar nota-vista-previa">
                    Al guardar, el aviso de fecha límite de los autores se actualiza automáticamente.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <PieComite />
    </div>
  );
}

export default Historia2p4;

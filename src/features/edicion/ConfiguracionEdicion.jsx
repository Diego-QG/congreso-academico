import { useState } from 'react';
import PestanasConfig from './PestanasConfig';
import './ConfiguracionEdicion.css';
import { EDICION_INICIAL, TRANSICIONES_ESTADO, AVISOS_ESTADO } from './datosConfiguracion.js';

function ConfiguracionEdicion() {
  const [edicion, setEdicion] = useState(EDICION_INICIAL);
  const [estado, setEstado] = useState('Recepción abierta');
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');

  // Modal de cambio de estado (2.6)
  const [modalAbierto, setModalAbierto] = useState(false);
  const [entiende, setEntiende] = useState(false);
  const [palabra, setPalabra] = useState('');

  const transicion = TRANSICIONES_ESTADO[estado]; // undefined si ya no hay más estados
  const puedeConfirmar =
    transicion !== undefined && entiende && palabra.trim().toUpperCase() === transicion.palabra;

  const evitarEnvio = (e) => {
    e.preventDefault();
  };

  const cambiarCampo = (campo, valor) => {
    setEdicion({ ...edicion, [campo]: valor });
    setExito('');
    setError('');
  };

  const guardarCambios = () => {
    if (edicion.nombre.trim() === '' || edicion.anio.trim() === '' || edicion.sede.trim() === '') {
      setExito('');
      setError('Complete el nombre, el año y la sede de la edición antes de guardar.');
      return;
    }
    setError('');
    setExito('✓ Cambios guardados correctamente.');
  };

  const abrirModal = () => {
    setEntiende(false);
    setPalabra('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const confirmarCambioEstado = () => {
    if (!puedeConfirmar) {
      return;
    }
    setEstado(transicion.siguiente);
    setExito(`✓ Estado de la edición actualizado: ${transicion.siguiente}.`);
    setError('');
    setModalAbierto(false);
  };

  return (
    <div className="pagina-configuracion">

      <div className="contenido">
        <div className="contenedor">
          <div className="pagina-cabecera">
            <div>
              <h1 className="pagina-titulo">Configuración de la edición</h1>
              <p className="texto-auxiliar">Defina la edición vigente antes de abrir la recepción de trabajos.</p>
            </div>
            <div className="pagina-acciones">
              <button
                type="button"
                className={transicion ? 'btn btn-secundario' : 'btn btn-secundario btn-deshabilitado'}
                disabled={!transicion}
                onClick={abrirModal}
              >
                Cambiar estado de la edición
              </button>
              <button type="button" className="btn btn-primario" onClick={guardarCambios}>
                Guardar cambios
              </button>
            </div>
          </div>

          <PestanasConfig activa="Edición" />

          {error !== '' ? <div className="aviso-error">{error}</div> : null}
          {exito !== '' ? <div className="aviso-exito aviso-separado">{exito}</div> : null}

          <div className="fila-config">
            <section className="tarjeta">
              <div className="tarjeta-cabecera">
                <h2 className="tarjeta-titulo">Datos generales</h2>
                <span className="insignia-estado">Estado: {estado.toLowerCase()}</span>
              </div>

              <form className="formulario" onSubmit={evitarEnvio}>
                <div className="fila-campos">
                  <div className="campo campo-grande">
                    <label className="etiqueta" htmlFor="nombre">NOMBRE DE LA EDICIÓN</label>
                    <input
                      type="text"
                      id="nombre"
                      className="entrada"
                      value={edicion.nombre}
                      onChange={(e) => cambiarCampo('nombre', e.target.value)}
                    />
                  </div>
                  <div className="campo">
                    <label className="etiqueta" htmlFor="anio">AÑO</label>
                    <input
                      type="text"
                      id="anio"
                      className="entrada"
                      value={edicion.anio}
                      onChange={(e) => cambiarCampo('anio', e.target.value)}
                    />
                  </div>
                </div>

                <div className="campo">
                  <label className="etiqueta" htmlFor="sede">SEDE</label>
                  <input
                    type="text"
                    id="sede"
                    className="entrada"
                    value={edicion.sede}
                    onChange={(e) => cambiarCampo('sede', e.target.value)}
                  />
                </div>

                <div className="campo">
                  <label className="etiqueta" htmlFor="descripcion">DESCRIPCIÓN PÚBLICA</label>
                  <textarea
                    id="descripcion"
                    className="entrada entrada-area"
                    maxLength={400}
                    value={edicion.descripcion}
                    onChange={(e) => cambiarCampo('descripcion', e.target.value)}
                  />
                  <p className="texto-auxiliar">Se muestra en la página pública del congreso. Máximo 400 caracteres.</p>
                </div>
              </form>
            </section>

            <aside className="lateral">
              <div className="tarjeta">
                <p className="etiqueta">RESUMEN DE LO CONFIGURADO</p>
                <div className="resumen-fila"><span>Ejes temáticos</span><strong className="ok">6 · listo</strong></div>
                <div className="resumen-fila"><span>Tipos de trabajo</span><strong className="ok">4 · listo</strong></div>
                <div className="resumen-fila"><span>Fechas límite</span><strong className="ok">3 · listo</strong></div>
                <div className="resumen-fila"><span>Criterios de evaluación</span><strong className="pendiente">Pendiente: pesos suman 95</strong></div>
              </div>

              <div className="aviso">
                <p className="aviso-titulo">{estado}</p>
                <p>{AVISOS_ESTADO[estado]}</p>
              </div>

              <div className="tarjeta">
                <p className="etiqueta">ACTIVIDAD</p>
                <div className="resumen-fila"><span>Trabajos recibidos</span><strong>14</strong></div>
                <div className="resumen-fila"><span>Revisores registrados</span><strong>9</strong></div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {modalAbierto && transicion ? (
        <div className="modal-fondo">
          <div className="modal">
            <div className="modal-cabecera">
              <h2 className="modal-titulo">{transicion.titulo}</h2>
              <button type="button" className="modal-cerrar" onClick={cerrarModal}>✕</button>
            </div>

            <div className="modal-cuerpo">
              <form className="formulario" onSubmit={evitarEnvio}>
                <div className="transicion-estado">
                  <span className="chip-estado chip-estado-actual">{estado}</span>
                  <span>→</span>
                  <span className="chip-estado chip-estado-siguiente">{transicion.siguiente}</span>
                </div>

                <div className="aviso-error">
                  <p className="aviso-titulo">Esta acción tiene efectos inmediatos</p>
                  <p>{transicion.aviso}</p>
                </div>

                <label className="casilla">
                  <input
                    type="checkbox"
                    checked={entiende}
                    onChange={(e) => setEntiende(e.target.checked)}
                  />
                  {transicion.casilla}
                </label>

                <div className="campo">
                  <label className="etiqueta" htmlFor="palabra-confirmacion">
                    ESCRIBA {transicion.palabra} PARA CONFIRMAR
                  </label>
                  <input
                    type="text"
                    id="palabra-confirmacion"
                    className="entrada"
                    value={palabra}
                    onChange={(e) => setPalabra(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <div className="modal-pie">
              <button type="button" className="btn btn-secundario" onClick={cerrarModal}>Cancelar</button>
              <button
                type="button"
                className={puedeConfirmar ? 'btn btn-peligro' : 'btn btn-deshabilitado'}
                disabled={!puedeConfirmar}
                onClick={confirmarCambioEstado}
              >
                {transicion.boton}
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}

export default ConfiguracionEdicion;

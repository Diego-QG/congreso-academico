import { useState } from 'react';
import CabeceraComite from './CabeceraComite';
import PestanasConfig from './PestanasConfig';
import PieComite from './PieComite';
import './ConfiguracionEdicion.css';
import { EDICION_INICIAL } from './data/datosConfiguracion.js';

const ESTADOS = ['En preparación', 'Recepción abierta', 'En revisión', 'Cerrada'];

function ConfiguracionEdicion() {
  const [edicion, setEdicion] = useState(EDICION_INICIAL);
  const [estado, setEstado] = useState('Recepción abierta');
  const [modalEstado, setModalEstado] = useState(null); // null = cerrado, texto = estado elegido
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState('');

  const evitarEnvio = (e) => {
    e.preventDefault();
  };

  // Copiamos el objeto con spread y cambiamos solo un campo
  const cambiarCampo = (campo, valor) => {
    setEdicion({ ...edicion, [campo]: valor });
    setGuardado(false);
    setError('');
  };

  const guardarCambios = () => {
    if (edicion.nombre.trim() === '' || edicion.anio.trim() === '' || edicion.sede.trim() === '') {
      setGuardado(false);
      setError('Complete el nombre, el año y la sede de la edición antes de guardar.');
      return;
    }
    setError('');
    setGuardado(true);
  };

  const confirmarEstado = () => {
    setEstado(modalEstado);
    setModalEstado(null);
    setGuardado(false);
  };

  return (
    <div className="pagina-configuracion">
      <CabeceraComite estado={estado} />

      <main className="contenido">
        <div className="contenedor">
          <div className="pagina-cabecera">
            <div>
              <h1 className="pagina-titulo">Configuración de la edición</h1>
              <p className="texto-auxiliar">Defina la edición vigente antes de abrir la recepción de trabajos.</p>
            </div>
            <div className="pagina-acciones">
              <button type="button" className="btn btn-secundario" onClick={() => setModalEstado(estado)}>
                Cambiar estado de la edición
              </button>
              <button type="button" className="btn btn-primario" onClick={guardarCambios}>
                Guardar cambios
              </button>
            </div>
          </div>

          <PestanasConfig activa="Edición" />

          {error !== '' ? <div className="aviso-error">{error}</div> : null}

          {guardado ? (
            <div className="aviso-exito aviso-separado">✓ Cambios guardados correctamente.</div>
          ) : null}

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
                {estado === 'Recepción abierta' ? (
                  <p>Cierra el 30/09/2026 a las 23:59. Mientras esté abierta, los autores pueden editar sus trabajos.</p>
                ) : (
                  <p>Estado actual de la edición. Use «Cambiar estado de la edición» para modificarlo.</p>
                )}
              </div>

              <div className="tarjeta">
                <p className="etiqueta">ACTIVIDAD</p>
                <div className="resumen-fila"><span>Trabajos recibidos</span><strong>14</strong></div>
                <div className="resumen-fila"><span>Revisores registrados</span><strong>9</strong></div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {modalEstado !== null ? (
        <div className="modal-fondo">
          <div className="modal">
            <div className="modal-cabecera">
              <h2 className="modal-titulo">Cambiar estado de la edición</h2>
              <button type="button" className="modal-cerrar" onClick={() => setModalEstado(null)}>✕</button>
            </div>

            <div className="modal-cuerpo">
              <form className="formulario" onSubmit={evitarEnvio}>
                <div className="campo">
                  <label className="etiqueta" htmlFor="nuevo-estado">NUEVO ESTADO</label>
                  <select
                    id="nuevo-estado"
                    className="entrada"
                    value={modalEstado}
                    onChange={(e) => setModalEstado(e.target.value)}
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
              </form>
            </div>

            <div className="modal-pie">
              <button type="button" className="btn btn-secundario" onClick={() => setModalEstado(null)}>Cancelar</button>
              <button type="button" className="btn btn-primario" onClick={confirmarEstado}>Confirmar cambio</button>
            </div>
          </div>
        </div>
      ) : null}

      <PieComite />
    </div>
  );
}

export default ConfiguracionEdicion;

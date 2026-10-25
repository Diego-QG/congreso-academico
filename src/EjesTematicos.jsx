import { useState } from 'react';
import CabeceraComite from './CabeceraComite';
import PestanasConfig from './PestanasConfig';
import PieComite from './PieComite';
import './ConfiguracionEdicion.css';
import { EJES_INICIALES } from './data/datosConfiguracion.js';

const FORMULARIO_VACIO = { id: null, nombre: '', descripcion: '', responsable: '', trabajos: 0 };

function EjesTematicos() {
  const [ejes, setEjes] = useState(EJES_INICIALES);
  const [mensaje, setMensaje] = useState('');
  const [modal, setModal] = useState(null); // null = cerrado, objeto = datos del formulario
  const [errores, setErrores] = useState({});

  const totalTrabajos = ejes.reduce((suma, eje) => suma + eje.trabajos, 0);

  const evitarEnvio = (e) => {
    e.preventDefault();
  };

  const abrirNuevo = () => {
    setErrores({});
    setMensaje('');
    setModal(FORMULARIO_VACIO);
  };

  const abrirEditar = (eje) => {
    setErrores({});
    setMensaje('');
    setModal({ ...eje });
  };

  const cerrarModal = () => {
    setModal(null);
    setErrores({});
  };

  const cambiarCampo = (campo, valor) => {
    setModal({ ...modal, [campo]: valor });
  };

  const guardarEje = () => {
    const nuevosErrores = {};

    if (modal.nombre.trim() === '') {
      nuevosErrores.nombre = 'Ingrese el nombre del eje temático.';
    }
    if (modal.responsable.trim() === '') {
      nuevosErrores.responsable = 'Ingrese el responsable del eje.';
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    const ejeGuardado = {
      id: modal.id,
      nombre: modal.nombre.trim(),
      descripcion: modal.descripcion.trim(),
      responsable: modal.responsable.trim(),
      trabajos: modal.trabajos,
    };

    if (modal.id === null) {
      // id nuevo: el mayor que existe + 1
      ejeGuardado.id = Math.max(0, ...ejes.map((e) => e.id)) + 1;
      setEjes([...ejes, ejeGuardado]);
    } else {
      setEjes(ejes.map((e) => (e.id === modal.id ? ejeGuardado : e)));
    }
    cerrarModal();
  };

  // Regla del mockup: un eje con trabajos recibidos no se puede eliminar
  const eliminarEje = (id) => {
    const eje = ejes.find((e) => e.id === id);
    if (eje.trabajos > 0) {
      setMensaje(`No se puede eliminar "${eje.nombre}": primero reasigne sus trabajos.`);
      return;
    }
    setEjes(ejes.filter((e) => e.id !== id));
    setMensaje('');
  };

  return (
    <div className="pagina-configuracion">
      <CabeceraComite estado={ejes.length > 0 ? 'Recepción abierta' : 'En preparación'} />

      <main className="contenido">
        <div className="contenedor">
          <div className="pagina-cabecera">
            <div>
              <h1 className="pagina-titulo">Ejes temáticos</h1>
              <p className="texto-auxiliar">
                {ejes.length > 0
                  ? `${ejes.length} ejes configurados · ${totalTrabajos} trabajos recibidos en total`
                  : 'Sin ejes configurados'}
              </p>
            </div>
            <div className="pagina-acciones">
              <button type="button" className="btn btn-primario" onClick={abrirNuevo}>
                Nuevo eje temático
              </button>
            </div>
          </div>

          <PestanasConfig activa="Ejes temáticos" />

          {mensaje !== '' ? (
            <div className="aviso aviso-separado">
              <p className="aviso-titulo">No se pudo eliminar</p>
              <p>{mensaje}</p>
            </div>
          ) : null}

          {ejes.length > 0 ? (
            <div>
              <div className="tabla-contenedor">
                <table className="tabla">
                  <thead>
                    <tr>
                      <th>NOMBRE</th>
                      <th>DESCRIPCIÓN</th>
                      <th>RESPONSABLE</th>
                      <th className="columna-numero">TRABAJOS</th>
                      <th className="columna-acciones">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ejes.map((eje) => (
                      <tr key={eje.id}>
                        <td className="celda-nombre">{eje.nombre}</td>
                        <td className="celda-gris">{eje.descripcion}</td>
                        <td className="celda-gris">{eje.responsable}</td>
                        <td className="columna-numero celda-nombre">{eje.trabajos}</td>
                        <td className="columna-acciones">
                          <button type="button" className="enlace-accion" onClick={() => abrirEditar(eje)}>
                            Editar
                          </button>
                          {' · '}
                          <button type="button" className="enlace-accion" onClick={() => eliminarEje(eje.id)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="texto-auxiliar nota-tabla">
                Un eje con trabajos recibidos no puede eliminarse; primero reasigne los trabajos.
              </p>
            </div>
          ) : (
            <div className="estado-vacio">
              <div className="estado-vacio-icono">▤</div>
              <h2 className="estado-vacio-titulo">Todavía no hay ejes temáticos</h2>
              <p className="texto-auxiliar estado-vacio-texto">
                Los ejes organizan los trabajos y determinan a qué revisores se pueden asignar.
                Cree al menos uno antes de abrir la recepción.
              </p>
              <button type="button" className="btn btn-primario" onClick={abrirNuevo}>
                Crear el primer eje
              </button>
            </div>
          )}
        </div>
      </main>

      {modal !== null ? (
        <div className="modal-fondo">
          <div className="modal">
            <div className="modal-cabecera">
              <h2 className="modal-titulo">
                {modal.id === null ? 'Nuevo eje temático' : 'Editar eje temático'}
              </h2>
              <button type="button" className="modal-cerrar" onClick={cerrarModal}>✕</button>
            </div>

            <div className="modal-cuerpo">
              <form className="formulario" onSubmit={evitarEnvio}>
                <div className="campo">
                  <label className="etiqueta" htmlFor="eje-nombre">NOMBRE *</label>
                  <input
                    type="text"
                    id="eje-nombre"
                    className={`entrada ${errores.nombre ? 'entrada-error' : ''}`}
                    value={modal.nombre}
                    onChange={(e) => cambiarCampo('nombre', e.target.value)}
                  />
                  {errores.nombre ? <p className="mensaje-error">{errores.nombre}</p> : null}
                </div>

                <div className="campo">
                  <label className="etiqueta" htmlFor="eje-descripcion">DESCRIPCIÓN</label>
                  <textarea
                    id="eje-descripcion"
                    className="entrada entrada-area"
                    value={modal.descripcion}
                    onChange={(e) => cambiarCampo('descripcion', e.target.value)}
                  />
                </div>

                <div className="campo">
                  <label className="etiqueta" htmlFor="eje-responsable">RESPONSABLE *</label>
                  <input
                    type="text"
                    id="eje-responsable"
                    className={`entrada ${errores.responsable ? 'entrada-error' : ''}`}
                    value={modal.responsable}
                    onChange={(e) => cambiarCampo('responsable', e.target.value)}
                  />
                  {errores.responsable ? <p className="mensaje-error">{errores.responsable}</p> : null}
                </div>
              </form>
            </div>

            <div className="modal-pie">
              <button type="button" className="btn btn-secundario" onClick={cerrarModal}>Cancelar</button>
              <button type="button" className="btn btn-primario" onClick={guardarEje}>Guardar eje</button>
            </div>
          </div>
        </div>
      ) : null}

      <PieComite />
    </div>
  );
}

export default EjesTematicos;

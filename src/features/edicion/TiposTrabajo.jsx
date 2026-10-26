import { useState } from 'react';
import CabeceraComite from './CabeceraComite';
import PestanasConfig from './PestanasConfig';
import PieComite from './PieComite';
import './ConfiguracionEdicion.css';
import { TIPOS_INICIALES, FORMATOS } from './datosConfiguracion.js';

const FORMULARIO_VACIO = { id: null, nombre: '', extension: '', formato: 'PDF', admite: false, maximo: '1' };

function TiposTrabajo() {
  const [tipos, setTipos] = useState(TIPOS_INICIALES);
  const [modal, setModal] = useState(null);
  const [errores, setErrores] = useState({});

  const evitarEnvio = (e) => {
    e.preventDefault();
  };

  const abrirNuevo = () => {
    setErrores({});
    setModal(FORMULARIO_VACIO);
  };

  const abrirEditar = (tipo) => {
    setErrores({});
    setModal({ ...tipo, maximo: `${tipo.maximo}` });
  };

  const cerrarModal = () => {
    setModal(null);
    setErrores({});
  };

  const cambiarCampo = (campo, valor) => {
    setModal({ ...modal, [campo]: valor });
  };

  const guardarTipo = () => {
    const nuevosErrores = {};

    if (modal.nombre === '') {
      nuevosErrores.nombre = 'Ingrese el nombre del tipo de trabajo.';
    }
    if (modal.extension === '') {
      nuevosErrores.extension = 'Ingrese la extensión máxima.';
    } else if (modal.extension < 1) {
      nuevosErrores.extension = 'La extensión debe ser mayor a cero.';
    }
    if (modal.admite && modal.maximo < 1) {
      nuevosErrores.maximo = 'Ingrese un número mayor o igual a 1.';
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    const tipoGuardado = {
      id: modal.id,
      nombre: modal.nombre,
      extension: modal.extension,
      formato: modal.formato,
      admite: modal.admite,
      maximo: modal.admite ? modal.maximo * 1 : 0,
    };

    if (modal.id === null) {
      tipoGuardado.id = Math.max(0, ...tipos.map((t) => t.id)) + 1;
      setTipos([...tipos, tipoGuardado]);
    } else {
      setTipos(tipos.map((t) => (t.id === modal.id ? tipoGuardado : t)));
    }
    cerrarModal();
  };

  const eliminarTipo = (id) => {
    setTipos(tipos.filter((t) => t.id !== id));
  };

  return (
    <div className="pagina-configuracion">
      <CabeceraComite estado="Recepción abierta" />

      <main className="contenido">
        <div className="contenedor">
          <div className="pagina-cabecera">
            <div>
              <h1 className="pagina-titulo">Tipos de trabajo</h1>
              <p className="texto-auxiliar">{tipos.length} tipos habilitados para esta edición</p>
            </div>
            <div className="pagina-acciones">
              <button type="button" className="btn btn-primario" onClick={abrirNuevo}>
                Nuevo tipo de trabajo
              </button>
            </div>
          </div>

          <PestanasConfig activa="Tipos de trabajo" />

          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th>NOMBRE</th>
                  <th>EXTENSIÓN MÁXIMA</th>
                  <th>FORMATO ESPERADO</th>
                  <th>ADMITE COAUTORES</th>
                  <th className="columna-acciones">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {tipos.map((tipo) => (
                  <tr key={tipo.id}>
                    <td className="celda-nombre">{tipo.nombre}</td>
                    <td>{tipo.extension}</td>
                    <td>{tipo.formato}</td>
                    <td className={tipo.admite ? 'texto-ok' : ''}>
                      {tipo.admite ? `Sí · hasta ${tipo.maximo}` : 'No'}
                    </td>
                    <td className="columna-acciones">
                      <button type="button" className="enlace-accion" onClick={() => abrirEditar(tipo)}>Editar</button>
                      {' · '}
                      <button type="button" className="enlace-accion" onClick={() => eliminarTipo(tipo.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="aviso aviso-arriba">
            <p>
              El alta y la edición de un tipo de trabajo se realizan en modal, con los mismos campos
              de la tabla y validación de extensión mayor a cero.
            </p>
          </div>
        </div>
      </main>

      {modal !== null ? (
        <div className="modal-fondo">
          <div className="modal">
            <div className="modal-cabecera">
              <h2 className="modal-titulo">
                {modal.id === null ? 'Nuevo tipo de trabajo' : 'Editar tipo de trabajo'}
              </h2>
              <button type="button" className="modal-cerrar" onClick={cerrarModal}>✕</button>
            </div>

            <div className="modal-cuerpo">
              <form className="formulario" onSubmit={evitarEnvio}>
                <div className="campo">
                  <label className="etiqueta" htmlFor="tipo-nombre">NOMBRE *</label>
                  <input
                    type="text"
                    id="tipo-nombre"
                    className={`entrada ${errores.nombre ? 'entrada-error' : ''}`}
                    value={modal.nombre}
                    onChange={(e) => cambiarCampo('nombre', e.target.value)}
                  />
                  {errores.nombre ? <p className="mensaje-error">{errores.nombre}</p> : null}
                </div>

                <div className="fila-campos-iguales">
                  <div className="campo">
                    <label className="etiqueta" htmlFor="tipo-extension">EXTENSIÓN MÁXIMA *</label>
                    <input
                      type="text"
                      id="tipo-extension"
                      className={`entrada ${errores.extension ? 'entrada-error' : ''}`}
                      value={modal.extension}
                      onChange={(e) => cambiarCampo('extension', e.target.value)}
                    />
                    {errores.extension ? <p className="mensaje-error">{errores.extension}</p> : null}
                  </div>
                  <div className="campo">
                    <label className="etiqueta" htmlFor="tipo-formato">FORMATO ESPERADO *</label>
                    <select
                      id="tipo-formato"
                      className="entrada"
                      value={modal.formato}
                      onChange={(e) => cambiarCampo('formato', e.target.value)}
                    >
                      {FORMATOS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="campo">
                  <label className="etiqueta">COAUTORES</label>
                  <label className="casilla">
                    <input
                      type="checkbox"
                      checked={modal.admite}
                      onChange={(e) => cambiarCampo('admite', e.target.checked)}
                    />
                    Admite coautores
                  </label>
                </div>

                {modal.admite ? (
                  <div className="campo">
                    <label className="etiqueta" htmlFor="tipo-maximo">NÚMERO MÁXIMO DE COAUTORES</label>
                    <input
                      type="number"
                      id="tipo-maximo"
                      min="1"
                      className={`entrada ${errores.maximo ? 'entrada-error' : ''}`}
                      value={modal.maximo}
                      onChange={(e) => cambiarCampo('maximo', e.target.value)}
                    />
                    {errores.maximo ? <p className="mensaje-error">{errores.maximo}</p> : null}
                  </div>
                ) : null}
              </form>
            </div>

            <div className="modal-pie">
              <button type="button" className="btn btn-secundario" onClick={cerrarModal}>Cancelar</button>
              <button type="button" className="btn btn-primario" onClick={guardarTipo}>Guardar tipo</button>
            </div>
          </div>
        </div>
      ) : null}

      <PieComite />
    </div>
  );
}

export default TiposTrabajo;

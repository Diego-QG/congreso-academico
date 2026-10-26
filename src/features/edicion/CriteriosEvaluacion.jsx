import { useState } from 'react';
import PestanasConfig from './PestanasConfig';
import './ConfiguracionEdicion.css';
import { CRITERIOS_INICIALES } from './datosConfiguracion.js';

const FORMULARIO_VACIO = { id: null, nombre: '', descripcion: '', peso: '' };

function textoPuntos(cantidad) {
  return cantidad === 1 ? '1 punto' : `${cantidad} puntos`;
}

function CriteriosEvaluacion() {
  const [criterios, setCriterios] = useState(CRITERIOS_INICIALES);
  const [modal, setModal] = useState(null);
  const [errores, setErrores] = useState({});
  const [guardado, setGuardado] = useState(false);

  const total = criterios.reduce((suma, c) => suma + c.peso, 0);
  const diferencia = 100 - total;

  const evitarEnvio = (e) => {
    e.preventDefault();
  };

  const abrirNuevo = () => {
    setErrores({});
    setModal(FORMULARIO_VACIO);
  };

  const abrirEditar = (criterio) => {
    setErrores({});
    setModal({ ...criterio, peso: `${criterio.peso}` });
  };

  const cerrarModal = () => {
    setModal(null);
    setErrores({});
  };

  const cambiarCampo = (campo, valor) => {
    setModal({ ...modal, [campo]: valor });
  };

  const guardarCriterio = () => {
    const nuevosErrores = {};
    const peso = modal.peso * 1;

    if (modal.nombre === '') {
      nuevosErrores.nombre = 'Ingrese el nombre del criterio.';
    }
    if (peso < 1 || peso > 100) {
      nuevosErrores.peso = 'Ingrese un peso entre 1 y 100.';
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    const criterioGuardado = {
      id: modal.id,
      nombre: modal.nombre,
      descripcion: modal.descripcion,
      peso: peso,
    };

    if (modal.id === null) {
      criterioGuardado.id = Math.max(0, ...criterios.map((c) => c.id)) + 1;
      setCriterios([...criterios, criterioGuardado]);
    } else {
      setCriterios(criterios.map((c) => (c.id === modal.id ? criterioGuardado : c)));
    }
    setGuardado(false);
    cerrarModal();
  };

  const eliminarCriterio = (id) => {
    setCriterios(criterios.filter((c) => c.id !== id));
    setGuardado(false);
  };

  const guardarCriterios = () => {
    setGuardado(true);
  };

  return (
    <div className="pagina-configuracion">

      <div className="contenido">
        <div className="contenedor">
          <div className="pagina-cabecera">
            <div>
              <h1 className="pagina-titulo">Criterios de evaluación</h1>
              <p className="texto-auxiliar">Los pesos de todos los criterios deben sumar 100.</p>
            </div>
            <div className="pagina-acciones">
              <button type="button" className="btn btn-secundario" onClick={abrirNuevo}>
                Nuevo criterio
              </button>
              <button type="button" className="btn btn-primario" onClick={guardarCriterios}>
                Guardar criterios
              </button>
            </div>
          </div>

          <PestanasConfig activa="Criterios de evaluación" />

          {total === 100 ? (
            <div className="banner-pesos banner-pesos-ok">
              <span>
                <strong>Pesos completos:</strong> los criterios suman 100 de 100. Ya puede abrir la etapa de revisión.
              </span>
              <strong>✓ 100 / 100</strong>
            </div>
          ) : (
            <div className="banner-pesos banner-pesos-alerta">
              <span>
                <strong>Advertencia:</strong> los pesos suman {total} de 100. Ajuste los criterios antes de abrir la etapa de revisión.
              </span>
              <strong>
                {diferencia > 0 ? `Faltan ${textoPuntos(diferencia)}` : `Sobran ${textoPuntos(-diferencia)}`}
              </strong>
            </div>
          )}

          {guardado ? (
            <div className="aviso-exito aviso-separado">
              ✓ Criterios guardados correctamente.
            </div>
          ) : null}

          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th>CRITERIO</th>
                  <th>DESCRIPCIÓN</th>
                  <th className="columna-numero">PESO</th>
                  <th className="columna-acciones">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {criterios.map((criterio) => (
                  <tr key={criterio.id}>
                    <td className="celda-nombre">{criterio.nombre}</td>
                    <td className="celda-gris">{criterio.descripcion}</td>
                    <td className="columna-numero celda-nombre">{criterio.peso}</td>
                    <td className="columna-acciones">
                      <button type="button" className="enlace-accion" onClick={() => abrirEditar(criterio)}>Editar</button>
                      {' · '}
                      <button type="button" className="enlace-accion" onClick={() => eliminarCriterio(criterio.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                <tr className="fila-total">
                  <td>Total</td>
                  <td></td>
                  <td className={`columna-numero ${total === 100 ? 'total-ok' : 'total-alerta'}`}>{total}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal !== null ? (
        <div className="modal-fondo">
          <div className="modal">
            <div className="modal-cabecera">
              <h2 className="modal-titulo">
                {modal.id === null ? 'Nuevo criterio' : 'Editar criterio'}
              </h2>
              <button type="button" className="modal-cerrar" onClick={cerrarModal}>✕</button>
            </div>

            <div className="modal-cuerpo">
              <form className="formulario" onSubmit={evitarEnvio}>
                <div className="campo">
                  <label className="etiqueta" htmlFor="criterio-nombre">NOMBRE *</label>
                  <input
                    type="text"
                    id="criterio-nombre"
                    className={`entrada ${errores.nombre ? 'entrada-error' : ''}`}
                    value={modal.nombre}
                    onChange={(e) => cambiarCampo('nombre', e.target.value)}
                  />
                  {errores.nombre ? <p className="mensaje-error">{errores.nombre}</p> : null}
                </div>

                <div className="campo">
                  <label className="etiqueta" htmlFor="criterio-descripcion">DESCRIPCIÓN</label>
                  <textarea
                    id="criterio-descripcion"
                    className="entrada entrada-area"
                    value={modal.descripcion}
                    onChange={(e) => cambiarCampo('descripcion', e.target.value)}
                  />
                </div>

                <div className="campo">
                  <label className="etiqueta" htmlFor="criterio-peso">PESO (1 A 100) *</label>
                  <input
                    type="number"
                    id="criterio-peso"
                    min="1"
                    max="100"
                    className={`entrada ${errores.peso ? 'entrada-error' : ''}`}
                    value={modal.peso}
                    onChange={(e) => cambiarCampo('peso', e.target.value)}
                  />
                  {errores.peso ? <p className="mensaje-error">{errores.peso}</p> : null}
                </div>
              </form>
            </div>

            <div className="modal-pie">
              <button type="button" className="btn btn-secundario" onClick={cerrarModal}>Cancelar</button>
              <button type="button" className="btn btn-primario" onClick={guardarCriterio}>Guardar criterio</button>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}

export default CriteriosEvaluacion;

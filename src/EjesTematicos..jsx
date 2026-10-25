import { useState } from 'react';
import CabeceraComite from './CabeceraComite';
import PestanasConfig from './PestanasConfig';
import PieComite from './PieComite';
import './ConfiguracionEdicion.css';
import { EJES_INICIALES } from './data/datosConfiguracion.js';

function EjesTematicos() {
  const [ejes, setEjes] = useState(EJES_INICIALES);
  const [mensaje, setMensaje] = useState('');

  const totalTrabajos = ejes.reduce((suma, eje) => suma + eje.trabajos, 0);

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
              <button type="button" className="btn btn-primario">Nuevo eje temático</button>
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
                          <button type="button" className="enlace-accion">Editar</button>
                          {' · '}
                          <button
                            type="button"
                            className="enlace-accion"
                            onClick={() => eliminarEje(eje.id)}
                          >
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
              <button type="button" className="btn btn-primario">Crear el primer eje</button>
            </div>
          )}
        </div>
      </main>

      <PieComite />
    </div>
  );
}

export default EjesTematicos;

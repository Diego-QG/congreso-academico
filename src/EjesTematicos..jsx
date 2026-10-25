import { useState } from 'react';
import CabeceraComite from './CabeceraComite';
import PestanasConfig from './PestanasConfig';
import PieComite from './PieComite';
import './ConfiguracionEdicion.css';

// Datos de ejemplo (del mockup 2.2)
const EJES_INICIALES = [
  { id: 1, nombre: 'Inteligencia artificial y datos', descripcion: 'Aprendizaje automático y ciencia de datos aplicada.', responsable: 'Dra. Ana Salazar', trabajos: 4 },
  { id: 2, nombre: 'Ingeniería de software', descripcion: 'Arquitectura, calidad y procesos de desarrollo.', responsable: 'Mg. Luis Ramírez', trabajos: 3 },
  { id: 3, nombre: 'Sostenibilidad y ciudad', descripcion: 'Movilidad, gestión del agua y ciudades resilientes.', responsable: 'Mg. Carmen Effio', trabajos: 3 },
  { id: 4, nombre: 'Innovación y emprendimiento', descripcion: 'Modelos de negocio y transferencia tecnológica.', responsable: 'Ing. Jorge Palomino', trabajos: 2 },
  { id: 5, nombre: 'Salud y sociedad', descripcion: 'Salud pública y bienestar estudiantil.', responsable: 'Dra. Milagros Yupanqui', trabajos: 1 },
  { id: 6, nombre: 'Economía y mercados', descripcion: 'Mercados financieros, comercio y desarrollo.', responsable: 'Mg. Renzo Bustamante', trabajos: 1 },
];

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

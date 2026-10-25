import { useState } from 'react';
import CabeceraComite from './CabeceraComite';
import PestanasConfig from './PestanasConfig';
import PieComite from './PieComite';
import './ConfiguracionEdicion.css';

const EDICION_INICIAL = {
  nombre: 'VIII Congreso Académico Estudiantil',
  anio: '2026',
  sede: 'Auditorio Central, Universidad de Lima — Santiago de Surco',
  descripcion:
    'Encuentro anual de investigación estudiantil. Se reciben artículos completos, resúmenes extendidos, pósteres y casos de estudio en seis ejes temáticos.',
};

function ConfiguracionEdicion() {
  const [edicion, setEdicion] = useState(EDICION_INICIAL);

  const evitarEnvio = (e) => {
    e.preventDefault();
  };

  // Copiamos el objeto con spread y cambiamos solo un campo
  const cambiarCampo = (campo, valor) => {
    setEdicion({ ...edicion, [campo]: valor });
  };

  return (
    <div className="pagina-configuracion">
      <CabeceraComite estado="Recepción abierta" />

      <main className="contenido">
        <div className="contenedor">
          <div className="pagina-cabecera">
            <div>
              <h1 className="pagina-titulo">Configuración de la edición</h1>
              <p className="texto-auxiliar">Defina la edición vigente antes de abrir la recepción de trabajos.</p>
            </div>
            <div className="pagina-acciones">
              <button type="button" className="btn btn-secundario">Cambiar estado de la edición</button>
              <button type="button" className="btn btn-primario">Guardar cambios</button>
            </div>
          </div>

          <PestanasConfig activa="Edición" />

          <div className="fila-config">
            <section className="tarjeta">
              <div className="tarjeta-cabecera">
                <h2 className="tarjeta-titulo">Datos generales</h2>
                <span className="insignia-estado">Estado: recepción abierta</span>
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
                <p className="aviso-titulo">Recepción abierta</p>
                <p>Cierra el 30/09/2026 a las 23:59. Mientras esté abierta, los autores pueden editar sus trabajos.</p>
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

      <PieComite />
    </div>
  );
}

export default ConfiguracionEdicion;

import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './NuevoTrabajo.css';

export default function NuevoTrabajo() {
  const [palabrasClave, setPalabrasClave] = useState([]);
  const [nuevaPalabra, setNuevaPalabra] = useState('');
  const registration = JSON.parse(
    window.sessionStorage.getItem('congreso.participante') || 'null'
  );
  const isAuthor = ['autor', 'ambos'].includes(registration?.rolParticipacion);

  function agregarPalabraClave(event) {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    const palabra = nuevaPalabra.trim();
    if (!palabra) return;

    setPalabrasClave((actuales) => (
      actuales.some((actual) => actual.toLocaleLowerCase() === palabra.toLocaleLowerCase())
        ? actuales
        : [...actuales, palabra]
    ));
    setNuevaPalabra('');
  }

  if (!isAuthor) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="nuevo-trabajo">
      <div className="nuevo-trabajo__aviso">
        <span><strong>Recepción abierta.</strong> Cierra el 30/09/2026 a las 23:59.</span>
        <strong>Faltan 12 días - 04:11 h</strong>
      </div>

      <div className="nuevo-trabajo__contenido">
        <header className="nuevo-trabajo__encabezado">
          <div>
            <h1>Nuevo trabajo</h1>
            <p>Paso 1 de 3 · Datos generales</p>
          </div>
          <div className="nuevo-trabajo__acciones">
            <button className="nuevo-trabajo__boton-borrador" type="button">
              Guardar como borrador
            </button>
            <button className="nuevo-trabajo__boton-continuar" type="button">
              Continuar a coautores
            </button>
          </div>
        </header>

        <ol className="nuevo-trabajo__pasos" aria-label="Pasos para registrar un trabajo">
          <li className="nuevo-trabajo__paso-activo" aria-current="step">1. Datos generales</li>
          <li>2. Resumen y palabras clave</li>
          <li>3. Documento y coautores</li>
        </ol>

        <div className="nuevo-trabajo__formulario">
          <div className="nuevo-trabajo__campos-principales">
            <div className="nuevo-trabajo__campo">
              <label htmlFor="trabajo-titulo">Título del trabajo *</label>
              <input
                id="trabajo-titulo"
                name="titulo"
                type="text"
                maxLength={180}
                defaultValue=""
              />
            </div>

            <div className="nuevo-trabajo__fila">
              <div className="nuevo-trabajo__campo">
                <label htmlFor="trabajo-tipo">Tipo de trabajo *</label>
                <select id="trabajo-tipo" name="tipo" defaultValue="Artículo completo">
                  <option value="Artículo completo">Artículo completo</option>
                  <option value="Resumen extendido">Resumen extendido</option>
                  <option value="Póster">Póster</option>
                </select>
              </div>

              <div className="nuevo-trabajo__campo">
                <label htmlFor="trabajo-eje">Eje temático *</label>
                <select id="trabajo-eje" name="eje" defaultValue="Inteligencia artificial y datos">
                  <option value="Inteligencia artificial y datos">Inteligencia artificial y datos</option>
                  <option value="Ingeniería de software">Ingeniería de software</option>
                  <option value="Sostenibilidad y ciudad">Sostenibilidad y ciudad</option>
                  <option value="Innovación y emprendimiento">Innovación y emprendimiento</option>
                  <option value="Salud y sociedad">Salud y sociedad</option>
                  <option value="Economía y mercados">Economía y mercados</option>
                </select>
              </div>
            </div>

            <div className="nuevo-trabajo__campo">
              <label htmlFor="trabajo-resumen">Resumen *</label>
              <textarea
                id="trabajo-resumen"
                name="resumen"
                rows={4}
                maxLength={1500}
                defaultValue={''}
              />
              <div className="nuevo-trabajo__ayuda-campo">
                <small>Máximo 68 caracteres por línea para facilitar la lectura.</small>
                <small>158 / 1 500 caracteres</small>
              </div>
            </div>

            <div className="nuevo-trabajo__campo">
              <label htmlFor="trabajo-palabra-clave">Palabras clave *</label>
              <div className="nuevo-trabajo__etiquetas">
                {palabrasClave.map((palabra) => (
                  <span className="nuevo-trabajo__etiqueta" key={palabra}>
                    {palabra}<span aria-hidden="true">×</span>
                  </span>
                ))}
                <input
                  id="trabajo-palabra-clave"
                  type="text"
                  placeholder="Escriba y presione Enter..."
                  aria-label="Agregar una palabra clave"
                  value={nuevaPalabra}
                  onChange={(event) => setNuevaPalabra(event.target.value)}
                  onKeyDown={agregarPalabraClave}
                />
              </div>
            </div>

            <div className="nuevo-trabajo__campo">
              <label htmlFor="trabajo-enlace">Enlace al documento *</label>
              <input
                id="trabajo-enlace"
                name="enlace"
                type="url"
                defaultValue=""
              />
              <small>El enlace debe permitir el acceso de lectura al comité y a los revisores.</small>
            </div>
          </div>

          <aside className="nuevo-trabajo__paneles">
            <section className="nuevo-trabajo__panel">
              <h2>Requisitos del tipo elegido</h2>
              <p>Artículo completo · hasta 8 000 palabras · PDF con plantilla IEEE · admite hasta 4 coautores.</p>
              <small>Puede cambiar el tipo mientras el trabajo esté en borrador.</small>
            </section>

            <section className="nuevo-trabajo__panel">
              <h2>Antes de enviar</h2>
              <p>Verifique que el documento no contenga los nombres de los autores: la revisión es ciega.</p>
              <p>Podrá editar el trabajo hasta el cierre de la recepción.</p>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './NuevoTrabajo.css';

function esUrlHttps(valor) {
  try {
    return new URL(valor).protocol === 'https:';
  } catch {
    return false;
  }
}

export default function NuevoTrabajo() {
  const [formulario, setFormulario] = useState({
    titulo: '',
    eje: '',
    resumen: '',
    enlace: '',
  });

  const [errores, setErrores] = useState();

  const [palabrasClave, setPalabrasClave] = useState();

  const [nuevaPalabra, setNuevaPalabra] = useState();

  const registration = JSON.parse(
    window.sessionStorage.getItem('congreso.participante') || 'null'
  );

  const isAuthor = ['autor', 'ambos'].includes(registration?.rolParticipacion);

  function agregarPalabraClave(event) {

    if (event.key !== 'Enter') 
      return;

    event.preventDefault();
    const palabra = nuevaPalabra.trim();
    if (!palabra) 
      return;

    const yaExiste = palabrasClave.some(
      (actual) => actual.toLocaleLowerCase() === palabra.toLocaleLowerCase()
    );

    if (!yaExiste) {
      setPalabrasClave([...palabrasClave, palabra]);
    }

    if (!yaExiste && palabrasClave.length >= 2) {
      setErrores((actuales) => {
        if (!actuales.palabrasClave) return actuales;
        const nuevosErrores = { ...actuales };
        delete nuevosErrores.palabrasClave;
        return nuevosErrores;
      });
    }

    setNuevaPalabra('');
  }

  function validarFormulario(event) {


    event.preventDefault();
    const nuevosErrores = {};

    if (!formulario.titulo.trim()) {
      nuevosErrores.titulo = 'Ingrese el título del trabajo.';
    }

    if (!formulario.eje) {
      nuevosErrores.eje = 'Debe elegir un eje temático.';
    }

    if (!formulario.resumen.trim()) {
      nuevosErrores.resumen = 'Ingrese el resumen del trabajo.';
    } else if (formulario.resumen.length > 1500) {
      nuevosErrores.resumen = `El resumen supera el máximo permitido. Reduzca ${formulario.resumen.length - 1500} caracteres.`;
    }

    if (palabrasClave.length < 3) {
      nuevosErrores.palabrasClave = 'Agregue al menos una palabra clave mas (mínimo 3)';
    }

    if (!formulario.enlace.trim()) {
      nuevosErrores.enlace = 'Ingrese el enlace al documento.';
    } else if (!esUrlHttps(formulario.enlace)) {
      nuevosErrores.enlace = 'Ingrese una URL completa que empiece con https://.';
    }

    setErrores(nuevosErrores);
  }

  function actualizarCampo(event) {
  
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
    
    setErrores((actuales) => {
      if (!actuales[name]) 
        return actuales;

      const nuevosErrores = { ...actuales };
      delete nuevosErrores[name];
      return nuevosErrores;
    });
  }

  function quitarPalabraClave(palabra) {
    const palabrasRestantes = palabrasClave.filter((actual) => actual !== palabra);
    setPalabrasClave(palabrasRestantes);
    setErrores((actuales) => {
      if (!actuales.palabrasClave || palabrasRestantes.length < 3) 
        return actuales;

      const nuevosErrores = { ...actuales };
      delete nuevosErrores.palabrasClave;
      return nuevosErrores;
    });
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
            <button className="nuevo-trabajo__boton-continuar" type="submit" form="nuevo-trabajo-formulario">
              Continuar a coautores
            </button>
          </div>
        </header>

        <ol className="nuevo-trabajo__pasos" aria-label="Pasos para registrar un trabajo">
          <li className="nuevo-trabajo__paso-activo" aria-current="step">1. Datos generales</li>
          <li>2. Resumen y palabras clave</li>
          <li>3. Documento y coautores</li>
        </ol>

        {Object.keys(errores).length > 0 && (
          <section className="nuevo-trabajo__error-general" role="alert" aria-live="assertive">
            <strong>No se pudo continuar: revise {Object.keys(errores).length} {Object.keys(errores).length === 1 ? 'campo' : 'campos'}.</strong>
            <p>{Object.values(errores).join(' · ')}</p>
          </section>
        )}

        <form
          id="nuevo-trabajo-formulario"
          className="nuevo-trabajo__formulario"
          noValidate
          onSubmit={validarFormulario}
        >
          <div className="nuevo-trabajo__campos-principales">
            <div className="nuevo-trabajo__campo">
              <label htmlFor="trabajo-titulo">Título del trabajo *</label>
              <input
                id="trabajo-titulo"
                name="titulo"
                type="text"
                maxLength={180}
                value={formulario.titulo}
                onChange={actualizarCampo}
                aria-invalid={Boolean(errores.titulo)}
                aria-describedby={errores.titulo ? 'error-trabajo-titulo' : undefined}
              />
              {errores.titulo && <small id="error-trabajo-titulo" className="nuevo-trabajo__error-campo">{errores.titulo}</small>}
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
                <select
                  id="trabajo-eje"
                  name="eje"
                  value={formulario.eje}
                  onChange={actualizarCampo}
                  aria-invalid={Boolean(errores.eje)}
                  aria-describedby={errores.eje ? 'error-trabajo-eje' : undefined}
                >
                  <option value="">Seleccione un eje</option>
                  <option value="Inteligencia artificial y datos">Inteligencia artificial y datos</option>
                  <option value="Ingeniería de software">Ingeniería de software</option>
                  <option value="Sostenibilidad y ciudad">Sostenibilidad y ciudad</option>
                  <option value="Innovación y emprendimiento">Innovación y emprendimiento</option>
                  <option value="Salud y sociedad">Salud y sociedad</option>
                  <option value="Economía y mercados">Economía y mercados</option>
                </select>
                {errores.eje && <small id="error-trabajo-eje" className="nuevo-trabajo__error-campo">{errores.eje}</small>}
              </div>
            </div>

            <div className="nuevo-trabajo__campo">
              <label htmlFor="trabajo-resumen">Resumen *</label>
              <textarea
                id="trabajo-resumen"
                name="resumen"
                rows={4}
                value={formulario.resumen}
                onChange={actualizarCampo}
                aria-invalid={Boolean(errores.resumen)}
                aria-describedby={errores.resumen ? 'error-trabajo-resumen' : 'ayuda-trabajo-resumen'}
              />
              <div className="nuevo-trabajo__ayuda-campo">
                <small id="ayuda-trabajo-resumen">Máximo 1 500 caracteres.</small>
                <small>{formulario.resumen.length} / 1 500 caracteres</small>
              </div>
              {errores.resumen && <small id="error-trabajo-resumen" className="nuevo-trabajo__error-campo">{errores.resumen}</small>}
            </div>

            <div className="nuevo-trabajo__campo">
              <label htmlFor="trabajo-palabra-clave">Palabras clave *</label>
              <div className="nuevo-trabajo__campo-palabras">
                <div
                  className="nuevo-trabajo__etiquetas"
                  aria-invalid={Boolean(errores.palabrasClave)}
                  aria-describedby={errores.palabrasClave ? 'error-trabajo-palabras' : undefined}
                >
                {palabrasClave.map((palabra) => (
                  <span className="nuevo-trabajo__etiqueta" key={palabra}>
                    {palabra}
                    <button type="button" aria-label={`Quitar palabra ${palabra}`} onClick={() => quitarPalabraClave(palabra)}>
                      ×
                    </button>
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
                {errores.palabrasClave && <small id="error-trabajo-palabras" className="nuevo-trabajo__error-campo">{errores.palabrasClave}</small>}
              </div>
            </div>

            <div className="nuevo-trabajo__campo">
              <label htmlFor="trabajo-enlace">Enlace al documento *</label>
              <input
                id="trabajo-enlace"
                name="enlace"
                type="url"
                value={formulario.enlace}
                onChange={actualizarCampo}
                aria-invalid={Boolean(errores.enlace)}
                aria-describedby={errores.enlace ? 'error-trabajo-enlace' : 'ayuda-trabajo-enlace'}
              />
              {errores.enlace
                ? <small id="error-trabajo-enlace" className="nuevo-trabajo__error-campo">{errores.enlace}</small>
                : <small id="ayuda-trabajo-enlace">El enlace debe permitir el acceso de lectura al comité y a los revisores.</small>}
            </div>
          </div>

          <aside className="nuevo-trabajo__paneles">
            <section className="nuevo-trabajo__panel nuevo-trabajo__panel--borrador" role="status">
              <h2>Sus cambios no se han guardado</h2>
              <p>Aún no se ha guardado este trabajo. La opción para guardar como borrador todavía no está disponible.</p>
            </section>
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
        </form>
      </div>
    </section>
  );
}

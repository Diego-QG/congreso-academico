import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentParticipant } from '../../shared/cuentaServicio';
import Coautores from './Coautores';
import './Trabajos.css';
import './NuevoTrabajo.css';

function esUrlHttps(valor) {
  try {
    return new URL(valor).protocol === 'https:';
  } catch {
    return false;
  }
}

export default function NuevoTrabajo() {
  const location = useLocation();
  const registration = getCurrentParticipant();
  const claveBorrador = `congreso.trabajo.borrador.${registration?.email || registration?.correo || 'autor'}`;
  const [borradorGuardado, setBorradorGuardado] = useState(() => {
    const borradorExistente = window.localStorage.getItem(claveBorrador);
    return borradorExistente ? JSON.parse(borradorExistente) : null;
  });
  const quiereEditarBorrador = Boolean(location.state?.editarBorrador);
  const datosIniciales = quiereEditarBorrador ? borradorGuardado?.formulario : null;
  const [formulario, setFormulario] = useState({
    titulo: datosIniciales?.titulo || '',
    eje: datosIniciales?.eje || '',
    resumen: datosIniciales?.resumen || '',
    enlace: datosIniciales?.enlace || '',
  });
  const [tipoTrabajo, setTipoTrabajo] = useState(datosIniciales?.tipo || 'Artículo completo');
  const [errores, setErrores] = useState({});
  const [palabrasClave, setPalabrasClave] = useState(
    quiereEditarBorrador ? borradorGuardado?.palabrasClave || [] : []
  );
  const [nuevaPalabra, setNuevaPalabra] = useState('');
  const [mostrarBorrador, setMostrarBorrador] = useState(
    Boolean(borradorGuardado) && !quiereEditarBorrador
  );
  const [errorGuardado, setErrorGuardado] = useState('');
  const [pasoActual, setPasoActual] = useState(1);
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

  function obtenerErroresFormulario(datos = formulario, claves = palabrasClave) {
    const nuevosErrores = {};

    if (!datos.titulo.trim()) {
      nuevosErrores.titulo = 'Ingrese el título del trabajo.';
    }

    if (!datos.eje) {
      nuevosErrores.eje = 'Debe elegir un eje temático.';
    }

    if (!datos.resumen.trim()) {
      nuevosErrores.resumen = 'Ingrese el resumen del trabajo.';
    } else if (datos.resumen.length > 1500) {
      nuevosErrores.resumen = `El resumen supera el máximo permitido. Reduzca ${datos.resumen.length - 1500} caracteres.`;
    }

    if (claves.length < 3) {
      nuevosErrores.palabrasClave = 'Agregue al menos una palabra clave mas (mínimo 3)';
    }

    if (!datos.enlace.trim()) {
      nuevosErrores.enlace = 'Ingrese el enlace al documento.';
    } else if (!esUrlHttps(datos.enlace)) {
      nuevosErrores.enlace = 'Ingrese una URL completa que empiece con https://.';
    }

    return nuevosErrores;
  }

  function validarFormulario(event) {
    event.preventDefault();
    const nuevosErrores = obtenerErroresFormulario();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      continuarAcoautores();
    }
  }

  function continuarAcoautores() {
    const nuevosErrores = obtenerErroresFormulario();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const borrador = {
      id: borradorGuardado?.id || `TRB-${new Date().getFullYear()}-${String(Date.now()).slice(-3).padStart(3, '0')}`,
      estado: 'Borrador',
      guardadoEn: borradorGuardado?.guardadoEn || new Date().toISOString(),
      formulario: { ...formulario, tipo: tipoTrabajo },
      palabrasClave: [...palabrasClave],
      coautores: borradorGuardado?.coautores || [],
      autorCorrespondencia: borradorGuardado?.autorCorrespondencia || registration.email,
    };

    try {
      window.localStorage.setItem(claveBorrador, JSON.stringify(borrador));
    } catch {
      setErrorGuardado('No se pudo guardar el trabajo para continuar. Inténtelo de nuevo.');
      return;
    }

    setBorradorGuardado(borrador);
    setPasoActual(3);
  }

  function guardarComoBorrador() {
    const borrador = {
      id: borradorGuardado?.id || `TRB-${new Date().getFullYear()}-${String(Date.now()).slice(-3).padStart(3, '0')}`,
      estado: 'Borrador',
      guardadoEn: new Date().toISOString(),
      formulario: { ...formulario, tipo: tipoTrabajo },
      palabrasClave: [...palabrasClave],
      coautores: borradorGuardado?.coautores || [],
      autorCorrespondencia: borradorGuardado?.autorCorrespondencia || registration.email,
    };

    try {
      window.localStorage.setItem(claveBorrador, JSON.stringify(borrador));
    } catch {
      setErrorGuardado('No se pudo guardar el borrador en este navegador. Inténtelo de nuevo.');
      return;
    }

    setBorradorGuardado(borrador);
    setMostrarBorrador(true);
    setErrores({});
    setErrorGuardado('');
  }

  function continuarEditando() {
    setFormulario({
      titulo: borradorGuardado.formulario.titulo,
      eje: borradorGuardado.formulario.eje,
      resumen: borradorGuardado.formulario.resumen,
      enlace: borradorGuardado.formulario.enlace,
    });
    setTipoTrabajo(borradorGuardado.formulario.tipo);
    setPalabrasClave(borradorGuardado.palabrasClave || []);
    setMostrarBorrador(false);
  }

  function enviarBorrador() {
    const nuevosErrores = obtenerErroresFormulario(borradorGuardado.formulario, borradorGuardado.palabrasClave);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {

      continuarEditando();
      setMostrarBorrador(false);

    } else {
      
      setErrorGuardado('El envío al comité todavía no está disponible.');

    }
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

  const datosBorrador = borradorGuardado?.formulario;
  const tieneDatosGenerales = Boolean(datosBorrador?.titulo.trim() && datosBorrador?.eje);
  const tieneResumenYPalabras = Boolean(datosBorrador?.resumen.trim() && borradorGuardado?.palabrasClave.length >= 3);
  const tieneEnlaceValido = Boolean(datosBorrador?.enlace && esUrlHttps(datosBorrador.enlace));

  return (
    <section className="nuevo-trabajo">

      {!mostrarBorrador && <div className="trabajos__aviso nuevo-trabajo__aviso">

        <span><strong>Recepción abierta.</strong> Cierra el 30/09/2026 a las 23:59.</span>
        <strong>Faltan 12 días - 04:11 h</strong>

      </div>}

      <div className="nuevo-trabajo__contenido">
        {mostrarBorrador && borradorGuardado ? (
          <div className="nuevo-trabajo__vista-borrador">


            <div className="nuevo-trabajo__aviso-guardado" role="status">
              <strong>Borrador guardado el {new Intl.DateTimeFormat('es-PE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date(borradorGuardado.guardadoEn))} · Aún no ha sido enviado al comité.</strong>
            </div>

            <div className="trabajos__aviso nuevo-trabajo__aviso">
              <span><strong>Recepción abierta.</strong> Cierra el 30/09/2026 a las 23:59.</span>
              <strong>Faltan 12 días - 04:11 h</strong>
            </div>

            <header className="nuevo-trabajo__encabezado nuevo-trabajo__encabezado-borrador">
              <div>
                <div className="nuevo-trabajo__identificador">
                  <span>{borradorGuardado.id}</span>
                  <span>Borrador</span>
                </div>
                <h1>{datosBorrador.titulo || 'Trabajo sin título'}</h1>
              </div>
              <div className="nuevo-trabajo__acciones">
                <button className="nuevo-trabajo__boton-borrador-secundario" type="button" onClick={continuarEditando}>
                  Seguir editando
                </button>
                <button className="nuevo-trabajo__boton-continuar" type="button" onClick={enviarBorrador}>
                  Enviar al comité
                </button>


              </div>
            </header>

            {errorGuardado && <p className="nuevo-trabajo__error-general" role="alert">{errorGuardado}</p>}

            <div className="nuevo-trabajo__resumen-borrador">
              <section className="trabajos__panel nuevo-trabajo__panel nuevo-trabajo__panel-resumen">

                <h2>Resumen del borrador</h2>
                <dl className="nuevo-trabajo__datos-borrador">
                  <div><dt>Tipo</dt><dd>{datosBorrador.tipo}</dd></div>
                  <div><dt>Eje temático</dt><dd>{datosBorrador.eje || 'Pendiente de seleccionar'}</dd></div>
                  <div><dt>Coautores</dt><dd>0 declarados</dd></div>
                  <div>
                    <dt>Enlace al documento</dt>

                    <dd>{datosBorrador.enlace
                      ? esUrlHttps(datosBorrador.enlace)
                        ? <a href={datosBorrador.enlace} target="_blank" rel="noreferrer">{datosBorrador.enlace}</a>
                        : datosBorrador.enlace
                      : 'Pendiente de agregar'}</dd>
                  </div>
                  <div className="nuevo-trabajo__dato-resumen">
                    <dt>Resumen</dt>
                    <dd>{datosBorrador.resumen || 'Aún no se ha agregado un resumen.'}</dd>
                  </div>
                </dl>
                {borradorGuardado.palabrasClave.length > 0 && (
                  <div className="nuevo-trabajo__palabras-borrador">
                    <h3>Palabras clave</h3>
                    <ul>{borradorGuardado.palabrasClave.map((palabra) => <li key={palabra}>{palabra}</li>)}</ul>
                  </div>
                )}
              </section>

              <aside className="nuevo-trabajo__paneles">
                <section className="trabajos__panel nuevo-trabajo__panel">
                  <h2>Lista de verificación</h2>
                  <ul className="nuevo-trabajo__verificacion">


                    <li className={tieneDatosGenerales ? 'completo' : 'pendiente'}>
                      {tieneDatosGenerales ? '✓' : '•'} Datos generales {tieneDatosGenerales ? 'completos' : 'pendientes'}
                    </li>
                    <li className={tieneResumenYPalabras ? 'completo' : 'pendiente'}>
                      {tieneResumenYPalabras ? '✓' : '•'} Resumen y palabras clave
                    </li>
                    <li className={tieneEnlaceValido ? 'completo' : 'pendiente'}>
                      {tieneEnlaceValido ? '✓' : '•'} Enlace al documento
                    </li>
                    <li className="pendiente">• Falta confirmar al autor de correspondencia</li>
                  </ul>
                </section>
                <section className="trabajos__panel nuevo-trabajo__panel nuevo-trabajo__panel--borrador">
                  <p>Los borradores no participan del proceso de revisión. Debe enviarlo antes del cierre de la recepción.</p>
                </section>
              </aside>
            </div>
          </div>
        ) : (
          <>
        {pasoActual === 1 && (
        <header className="nuevo-trabajo__encabezado">
          <div>
            <h1>Nuevo trabajo</h1>
            <p>Paso 1 de 3 · Datos generales</p>
          </div>
          <div className="nuevo-trabajo__acciones">
            <button className="nuevo-trabajo__boton-borrador" type="button" onClick={guardarComoBorrador}>
              Guardar como borrador
            </button>
            <button className="nuevo-trabajo__boton-continuar" type="submit" form="nuevo-trabajo-formulario">
              Continuar a coautores
            </button>
          </div>
        </header>
        )}

        <ol className="nuevo-trabajo__pasos" aria-label="Pasos para registrar un trabajo">
          <li className={pasoActual === 1 ? 'nuevo-trabajo__paso-activo' : ''}>
            <button
              type="button"
              aria-current={pasoActual === 1 ? 'step' : undefined}
              onClick={() => setPasoActual(1)}
            >
              1. Datos generales
            </button>
          </li>
          <li>2. Resumen y palabras clave</li>
          <li className={pasoActual === 3 ? 'nuevo-trabajo__paso-activo' : ''}>
            <button
              type="button"
              aria-current={pasoActual === 3 ? 'step' : undefined}
              onClick={continuarAcoautores}
            >
              3. Documento y coautores
            </button>
          </li>
        </ol>

        {pasoActual === 1 ? (
          <>
        {Object.keys(errores).length > 0 && (
          <section className="nuevo-trabajo__error-general" role="alert" aria-live="assertive">
            <strong>No se pudo continuar: revise {Object.keys(errores).length} {Object.keys(errores).length === 1 ? 'campo' : 'campos'}.</strong>
            <p>{Object.values(errores).join(' · ')}</p>
          </section>
        )}
        {errorGuardado && <p className="nuevo-trabajo__error-general" role="alert">{errorGuardado}</p>}

        <form
          id="nuevo-trabajo-formulario"
          className="trabajos__panel nuevo-trabajo__formulario"
          noValidate
          onSubmit={validarFormulario}
        >
          <div className="nuevo-trabajo__campos-principales">

            <div className="nuevo-trabajo__campo">
              <label htmlFor="trabajo-titulo">Título del trabajo *</label>
              <input
                className="trabajos__campo-control"
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
                <select className="trabajos__campo-control" id="trabajo-tipo" name="tipo" value={tipoTrabajo} onChange={(event) => setTipoTrabajo(event.target.value)}>
                  <option value="Artículo completo">Artículo completo</option>
                  <option value="Resumen extendido">Resumen extendido</option>
                  <option value="Póster">Póster</option>
                </select>
              </div>

              <div className="nuevo-trabajo__campo">
                <label htmlFor="trabajo-eje">Eje temático *</label>
                <select
                  className="trabajos__campo-control"
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
                className="trabajos__campo-control"
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
                className="trabajos__campo-control"
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
            <section className="trabajos__panel nuevo-trabajo__panel nuevo-trabajo__panel--borrador" role="status">
              <h2>Sus cambios no se han guardado</h2>
              <p>Aún no se ha guardado este trabajo. Puede guardar el borrador y continuar editándolo antes del cierre de la recepción.</p>
            </section>
            <section className="trabajos__panel nuevo-trabajo__panel">
              <h2>Requisitos del tipo elegido</h2>
              <p>Artículo completo · hasta 8 000 palabras · PDF con plantilla IEEE · admite hasta 4 coautores.</p>
              <small>Puede cambiar el tipo mientras el trabajo esté en borrador.</small>
            </section>

            <section className="trabajos__panel nuevo-trabajo__panel">
              <h2>Antes de enviar</h2>
              <p>Verifique que el documento no contenga los nombres de los autores: la revisión es ciega.</p>
              <p>Podrá editar el trabajo hasta el cierre de la recepción.</p>
            </section>
          </aside>
        </form>
          </>
        ) : (
          <Coautores
            integrado
            onVolver={() => setPasoActual(1)}
            onBorradorActualizado={setBorradorGuardado}
          />
        )}
          </>
        )}
      </div>
    </section>
  );
}

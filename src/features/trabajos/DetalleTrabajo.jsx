import { Link, Navigate, useParams } from 'react-router-dom';
import './DetalleTrabajo.css';

function leerParticipante() {
  try {
    return JSON.parse(window.sessionStorage.getItem('congreso.participante') || 'null');
  } catch {
    return null;
  }
}

function fechaLegible(fecha, incluirHora = false) {
  if (!fecha) return '';
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return '';
  const opciones = incluirHora
    ? { dateStyle: 'short', timeStyle: 'short' }
    : { dateStyle: 'short' };
  return new Intl.DateTimeFormat('es-PE', opciones).format(valor);
}

function leerTrabajo(claveBorrador, trabajoId, registration) {
  let contenido;
  try {
    contenido = window.localStorage.getItem(claveBorrador);
  } catch {
    return { trabajo: null, error: 'No se pudo acceder al trabajo guardado en este navegador.' };
  }

  if (!contenido) return { trabajo: null, error: '' };

  let borrador;
  try {
    borrador = JSON.parse(contenido);
  } catch {
    return { trabajo: null, error: 'Los datos guardados del trabajo están dañados y no se pudieron cargar.' };
  }

  if (!borrador?.formulario || typeof borrador.formulario !== 'object') {
    return { trabajo: null, error: 'El trabajo guardado no tiene un formato válido.' };
  }

  if (borrador.id !== trabajoId) return { trabajo: null, error: '' };

  const autores = [
    {
      nombre: `${registration?.nombres || ''} ${registration?.apellidos || ''}`.trim(),
      correo: registration?.email || registration?.correo || '',
      institucion: registration?.institucion || 'Universidad de Lima',
    },
    ...(Array.isArray(borrador.coautores) ? borrador.coautores : []),
  ].filter((autor) => autor.nombre);

  return {
    trabajo: {
      ...borrador,
      autores,
      estado: borrador.estado || 'Borrador',
      formulario: borrador.formulario,
      palabrasClave: Array.isArray(borrador.palabrasClave) ? borrador.palabrasClave : [],
    },
    error: '',
  };
}

function enlaceDocumentoSeguro(enlace) {
  try {
    const url = new URL(enlace);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

export default function DetalleTrabajo() {
  const { trabajoId } = useParams();
  const registration = leerParticipante();

  if (!['autor', 'ambos'].includes(registration?.rolParticipacion)) {
    return <Navigate to="/login" replace />;
  }

  const correo = registration.email || registration.correo || 'autor';
  const claveBorrador = `congreso.trabajo.borrador.${correo}`;
  const { trabajo, error } = leerTrabajo(claveBorrador, trabajoId, registration);

  if (error || !trabajo) {
    return (
      <section className="detalle-trabajo">
        <nav className="detalle-trabajo__miga" aria-label="Ruta de navegación">
          <Link to="/mis-trabajos">Mis trabajos</Link>
          <span aria-hidden="true">›</span>
          <span>Detalle del trabajo</span>
        </nav>
        <div className="detalle-trabajo__no-disponible" role={error ? 'alert' : 'status'}>
          <h1>{error ? 'No se pudo cargar el trabajo' : 'Trabajo no disponible'}</h1>
          <p>{error || 'El trabajo ya no está guardado en este navegador o no pertenece a su cuenta.'}</p>
          <Link to="/mis-trabajos">Volver a Mis trabajos</Link>
        </div>
      </section>
    );
  }

  const enRevision = trabajo.estado === 'En revisión';
  const fechaEnvio = fechaLegible(trabajo.enviadoEn, true);
  const fechaGuardado = fechaLegible(trabajo.guardadoEn, true);
  const enlaceDocumento = enlaceDocumentoSeguro(trabajo.formulario.enlace);
  const autorCorrespondencia = trabajo.autorCorrespondencia
    || registration.email
    || registration.correo;

  return (
    <section className="detalle-trabajo">
      <nav className="detalle-trabajo__miga" aria-label="Ruta de navegación">
        <Link to="/mis-trabajos">Mis trabajos</Link>
        <span aria-hidden="true">›</span>
        <span>{trabajo.id}</span>
      </nav>

      <header className="detalle-trabajo__encabezado">
        <div className="detalle-trabajo__titulo">
          <div className="detalle-trabajo__identificador">
            <span>{trabajo.id}</span>
            <span className={`detalle-trabajo__estado${enRevision ? ' detalle-trabajo__estado--revision' : ''}`}>
              {trabajo.estado}
            </span>
          </div>
          <h1>{trabajo.formulario.titulo?.trim() || 'Trabajo sin título'}</h1>
        </div>
        {enlaceDocumento ? (
          <a
            className="detalle-trabajo__documento"
            href={enlaceDocumento}
            target="_blank"
            rel="noreferrer"
          >
            Ver documento
          </a>
        ) : (
          <button
            className="detalle-trabajo__documento"
            type="button"
            disabled
            title="Este trabajo no tiene un enlace de documento válido."
          >
            Documento no disponible
          </button>
        )}
      </header>

      <div className="detalle-trabajo__columnas">
        <div className="detalle-trabajo__principal">
          <section className="detalle-trabajo__panel detalle-trabajo__datos">
            <h2>Datos del trabajo</h2>
            <dl className="detalle-trabajo__metadatos">
              <div>
                <dt>Tipo</dt>
                <dd>{trabajo.formulario.tipo || 'No especificado'}</dd>
              </div>
              <div>
                <dt>Eje temático</dt>
                <dd>{trabajo.formulario.eje || 'No especificado'}</dd>
              </div>
              <div>
                <dt>{enRevision ? 'Enviado' : 'Guardado'}</dt>
                <dd>{enRevision ? (fechaEnvio || 'Fecha no disponible') : (fechaGuardado || 'Fecha no disponible')}</dd>
              </div>
            </dl>
            <div className="detalle-trabajo__resumen">
              <h3>Resumen</h3>
              <p>{trabajo.formulario.resumen?.trim() || 'No se registró un resumen para este trabajo.'}</p>
            </div>
            {trabajo.palabrasClave.length > 0 && (
              <ul className="detalle-trabajo__etiquetas" aria-label="Palabras clave">
                {trabajo.palabrasClave.map((palabra) => <li key={palabra}>{palabra}</li>)}
              </ul>
            )}
          </section>

          <section className="detalle-trabajo__panel detalle-trabajo__autores">
            <h2>Autores</h2>
            <ul>
              {trabajo.autores.map((autor) => (
                <li key={autor.correo || autor.nombre}>
                  <span>
                    <strong>{autor.nombre}</strong>
                    {autor.institucion && <span> · {autor.institucion}</span>}
                  </span>
                  <small>
                    {(autor.correo || '').toLocaleLowerCase() === (autorCorrespondencia || '').toLocaleLowerCase()
                      ? 'Autor de correspondencia'
                      : 'Coautor'}
                  </small>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="detalle-trabajo__lateral">
          <section className={`detalle-trabajo__dictamen${enRevision ? ' detalle-trabajo__dictamen--revision' : ''}`}>
            <span className="detalle-trabajo__sobrelinea">Dictamen</span>
            <h2>{enRevision ? 'En revisión' : 'Borrador'}</h2>
            <p>
              {enRevision
                ? 'La retroalimentación se mostrará aquí cuando el comité publique la decisión, el 28/10/2026 a las 12:00.'
                : 'Este trabajo todavía no se ha enviado al comité. Puede continuar editándolo desde Nuevo trabajo.'}
            </p>
          </section>

          <section className="detalle-trabajo__panel detalle-trabajo__seguimiento">
            <span className="detalle-trabajo__sobrelinea">Seguimiento</span>
            <ol>
              {enRevision ? (
                <>
                  <li className="completado">
                    <strong>Enviado al comité</strong>
                    <span>{fechaEnvio || 'Fecha de envío no disponible'}</span>
                  </li>
                  <li className="activo">
                    <strong>Revisión en curso</strong>
                    <span>El trabajo está pendiente de dictamen.</span>
                  </li>
                  <li>
                    <strong>Publicación de resultados</strong>
                    <span>28/10/2026</span>
                  </li>
                </>
              ) : (
                <li className="activo">
                  <strong>Borrador guardado</strong>
                  <span>{fechaGuardado || 'Fecha de guardado no disponible'}</span>
                </li>
              )}
            </ol>
          </section>
        </aside>
      </div>
    </section>
  );
}

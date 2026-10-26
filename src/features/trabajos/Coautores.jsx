import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './Trabajos.css';
import './Coautores.css';

function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export default function Coautores({
  integrado = false,
  onVolver,
  onBorradorActualizado,
}) {
  const navigate = useNavigate();
  const registration = JSON.parse(
    window.sessionStorage.getItem('congreso.participante') || 'null'
  );

  const email = registration?.email || registration?.correo || '';

  const claveBorrador = `congreso.trabajo.borrador.${email || 'autor'}`;

  const borrador = JSON.parse(window.localStorage.getItem(claveBorrador) || 'null');

  const [coautores, setCoautores] = useState(() => (
    (Array.isArray(borrador?.coautores) ? borrador.coautores : [])
      .filter((coautor) => coautor.correo?.toLowerCase() !== email.toLowerCase())
  ));
  const [autorCorrespondencia, setAutorCorrespondencia] = useState(
    borrador?.autorCorrespondencia || email
  );
  const [nuevoCoautor, setNuevoCoautor] = useState({
    nombre: '',
    correo: '',
    institucion: registration?.institucion || '',
  });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [editandoCorreo, setEditandoCorreo] = useState('');
  const isAuthor = ['autor', 'ambos'].includes(registration?.rolParticipacion);

  if (!isAuthor) {
    return <Navigate to="/login" replace />;
  }

  if (!borrador) {
    return <Navigate to="/nuevo-trabajo" replace />;
  }

  const autores = [
    {
      nombre: `${registration.nombres || ''} ${registration.apellidos || ''}`.trim(),
      correo: email,
      institucion: registration.institucion || 'Universidad de Lima',
    },
    ...coautores,
  ];
  const maxCoautores = 4;

  function actualizarNuevoCoautor(event) {
    const { name, value } = event.target;
    setNuevoCoautor((actual) => ({ ...actual, [name]: value }));
    setErrores((actuales) => ({ ...actuales, [name]: '' }));
    setMensaje('');
  }

  function agregarCoautor(event) {
    event.preventDefault();
    const nuevosErrores = {};
    const nombre = nuevoCoautor.nombre.trim();
    const correo = nuevoCoautor.correo.trim().toLowerCase();
    const institucion = nuevoCoautor.institucion.trim();

    if (!nombre) nuevosErrores.nombre = 'Ingrese el nombre completo.';
    if (!correo) {
      nuevosErrores.correo = 'Ingrese el correo del coautor.';
    } else if (!correoValido(correo)) {
      nuevosErrores.correo = 'Ingrese un correo válido.';
    } else if (autores.some((autor) => (
      autor.correo.toLowerCase() === correo && autor.correo !== editandoCorreo
    ))) {
      nuevosErrores.correo = 'Este correo ya figura entre los autores del trabajo.';
    }
    if (!institucion) nuevosErrores.institucion = 'Ingrese la institución.';
    if (!editandoCorreo && coautores.length >= maxCoautores) {
      nuevosErrores.limite = 'El trabajo admite hasta 4 coautores además del autor principal.';
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    if (editandoCorreo) {
      setCoautores((actuales) => actuales.map((autor) => (
        autor.correo === editandoCorreo ? { nombre, correo, institucion } : autor
      )));
      if (autorCorrespondencia === editandoCorreo) setAutorCorrespondencia(correo);
      setEditandoCorreo('');
    } else {
      setCoautores((actuales) => [...actuales, { nombre, correo, institucion }]);
    }
    setNuevoCoautor({
      nombre: '',
      correo: '',
      institucion: registration.institucion || '',
    });
    setErrores({});
    setMensaje('');
  }

  function editarCoautor(autor) {
    setNuevoCoautor({
      nombre: autor.nombre,
      correo: autor.correo,
      institucion: autor.institucion,
    });
    setEditandoCorreo(autor.correo);
    setErrores({});
    setMensaje('');
  }

  function guardarYContinuar() {
    if (!autores.some((autor) => autor.correo === autorCorrespondencia)) {
      setErrores({ correspondencia: 'Seleccione un autor de correspondencia.' });
      return;
    }

    const borradorActualizado = {
      ...borrador,
      coautores,
      autorCorrespondencia,
      guardadoEn: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(claveBorrador, JSON.stringify(borradorActualizado));
    } catch {
      setMensaje('No se pudieron guardar los cambios de coautores. Inténtelo de nuevo.');
      return;
    }

    onBorradorActualizado?.(borradorActualizado);
    setMensaje('Coautores guardados en el borrador. El siguiente paso aún no está disponible.');
  }

  function volverADatosGenerales() {
    if (onVolver) {
      onVolver();
      return;
    }

    navigate('/nuevo-trabajo', { state: { editarBorrador: true } });
  }

  return (
    <section className={`coautores${integrado ? ' coautores--integrado' : ''}`}>
      {!integrado && <div className="trabajos__aviso coautores__aviso">
        <span><strong>Recepción abierta.</strong> Cierra el 30/09/2026 a las 23:59.</span>
        <strong>Faltan 12 días - 04:11 h</strong>
      </div>}

      <header className="coautores__encabezado">
        <div>
          <h1>Coautores</h1>
          <p>Paso 3 de 3 · {borrador.id} · {borrador.formulario.tipo} (hasta 4 coautores)</p>
        </div>
        <div className="coautores__acciones">
          <button
            className="coautores__boton coautores__boton--secundario"
            type="button"
            onClick={volverADatosGenerales}
          >
            Volver a datos generales
          </button>
          <button className="coautores__boton coautores__boton--primario" type="button" onClick={guardarYContinuar}>
            Continuar
          </button>
        </div>
      </header>

      {mensaje && <p className="coautores__mensaje" role="status">{mensaje}</p>}
      {errores.correspondencia && <p className="coautores__error-general" role="alert">{errores.correspondencia}</p>}

      <div className="coautores__contenido">
        <section className="trabajos__panel coautores__lista" aria-label="Autores del trabajo">
          <div className="coautores__tabla-cabecera" aria-hidden="true">
            <span>Nombre completo</span>
            <span>Correo</span>
            <span>Institución</span>
            <span>Correspondencia</span>
            <span />
          </div>

          {coautores.map((autor) => (
            <div className="coautores__fila" key={autor.correo}>
              <strong>{autor.nombre || 'Autor principal'}</strong>
              <span className="coautores__correo">{autor.correo}</span>
              <span>{autor.institucion}</span>
              <label className="coautores__seleccion-correspondencia">
                <input
                  type="radio"
                  name="autorCorrespondencia"
                  value={autor.correo}
                  checked={autorCorrespondencia === autor.correo}
                  onChange={() => {
                    setAutorCorrespondencia(autor.correo);
                    setErrores((actuales) => ({ ...actuales, correspondencia: '' }));
                  }}
                />
                <span>{autorCorrespondencia === autor.correo ? 'Autor de correspondencia' : 'Marcar'}</span>
              </label>
              <button
                className="coautores__accion-texto"
                type="button"
                onClick={() => editarCoautor(autor)}
                aria-label={`Editar a ${autor.nombre}`}
              >
                Editar
              </button>
            </div>
          ))}

          <form className="coautores__formulario" onSubmit={agregarCoautor} noValidate>
            <h2>Agregar coautor</h2>
            <div className="coautores__campos">
              <label>
                <span>Nombre completo</span>
                <input
                  className="trabajos__campo-control"
                  name="nombre"
                  value={nuevoCoautor.nombre}
                  onChange={actualizarNuevoCoautor}
                  aria-invalid={Boolean(errores.nombre)}
                />
                {errores.nombre && <small>{errores.nombre}</small>}
              </label>
              <label>
                <span>Correo</span>
                <input
                  className="trabajos__campo-control"
                  name="correo"
                  type="email"
                  value={nuevoCoautor.correo}
                  onChange={actualizarNuevoCoautor}
                  aria-invalid={Boolean(errores.correo)}
                />
                {errores.correo && <small>{errores.correo}</small>}
              </label>
              <label>
                <span>Institución</span>
                <input
                  className="trabajos__campo-control"
                  name="institucion"
                  value={nuevoCoautor.institucion}
                  onChange={actualizarNuevoCoautor}
                  aria-invalid={Boolean(errores.institucion)}
                />
                {errores.institucion && <small>{errores.institucion}</small>}
              </label>
              <button
                className="coautores__boton coautores__boton--secundario coautores__boton-agregar"
                type="submit"
                disabled={!editandoCorreo && coautores.length >= maxCoautores}
              >
                {editandoCorreo ? 'Guardar cambios' : 'Agregar'}
              </button>
            </div>
            {errores.limite && <small className="coautores__error-general">{errores.limite}</small>}
            {editandoCorreo && (
              <button
                className="coautores__accion-texto coautores__cancelar-edicion"
                type="button"
                onClick={() => {
                  setEditandoCorreo('');
                  setNuevoCoautor({ nombre: '', correo: '', institucion: registration.institucion || '' });
                  setErrores({});
                }}
              >
                Cancelar edición
              </button>
            )}
          </form>

          <footer className="coautores__pie-lista">
            <span>{coautores.length} de {maxCoautores} coautores declarados; el autor principal se conserva en el trabajo.</span>
            <span>El orden de la lista es el orden de firma.</span>
          </footer>
        </section>

        <aside className="coautores__paneles">
          <section className="trabajos__panel coautores__panel">
            <h2>Autor de correspondencia</h2>
            <p>Recibe las notificaciones del comité y es responsable de la comunicación oficial. Debe haber exactamente uno.</p>
          </section>
          <section className="trabajos__panel coautores__panel coautores__panel--conflicto">
            <h2>Conflicto de revisión</h2>
            <p>Los coautores declarados no podrán ser asignados como revisores de este trabajo.</p>
          </section>
        </aside>
      </div>
    </section>
  );
}

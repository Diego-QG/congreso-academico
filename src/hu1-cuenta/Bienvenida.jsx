import { Navigate, useLocation } from 'react-router-dom';
import './Bienvenida.css';

export default function Bienvenida() {
  const location = useLocation();
  const registration = location.state?.registration;

  if (!registration) {
    return <Navigate to="/registro" replace />;
  }

  const roleDescriptions = {
    autor: 'autora',
    revisor: 'revisora',
    ambos: 'autora y revisora'
  };
  const fullName = `${registration.nombres} ${registration.apellidos}`.trim();
  const roleDescription = roleDescriptions[registration.rolParticipacion] || 'participante';

  return (
    <section className="welcome-page">
      <div className="registration-success-banner" role="status">
        <span className="success-banner-icon" aria-hidden="true">✓</span>
        <p>
          Cuenta creada correctamente. Le enviamos un correo de verificación a {registration.email}.
        </p>
      </div>

      <section className="welcome-hero" id="inicio">
        <span className="welcome-eyebrow">Bienvenida</span>
        <h1 id="mi-presentacion">
          {fullName}, su cuenta de {roleDescription} está activa
        </h1>
        <p>
          Ya puede registrar sus trabajos. La recepción cierra el 30/09/2026 a las 23:59; después de esa fecha los envíos quedan en modo lectura.
        </p>
        <div className="welcome-actions">
          <a className="welcome-primary-button" href="#nuevo-trabajo">
            Registrar mi primer trabajo
          </a>
          <a className="welcome-secondary-button" href="#mi-cuenta">
            Completar mi perfil
          </a>
        </div>
      </section>

      <div className="submission-steps" id="nuevo-trabajo">
        <article className="submission-step">
          <h2>1. Datos del trabajo</h2>
          <p>Título, tipo, eje temático, resumen y palabras clave.</p>
        </article>
        <article className="submission-step" id="mis-trabajos">
          <h2>2. Coautores</h2>
          <p>Declare a sus coautores y al autor de correspondencia.</p>
        </article>
        <article className="submission-step">
          <h2>3. Envío</h2>
          <p>Adjunte el enlace al documento y envíe antes del cierre.</p>
        </article>
      </div>
    </section>
  );
}

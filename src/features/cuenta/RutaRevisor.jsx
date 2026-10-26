import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import ilustracion from '../../assets/ilustraciones/acceso-denegado.svg';
import './RutaRevisor.css';

const STORAGE_KEY = 'congreso.participante';

function getRegistration(locationState) {
  return locationState?.registration
    || JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || 'null');
}

export default function RutaRevisor() {
  const location = useLocation();
  const registration = getRegistration(location.state);

  if (!registration) {
    return <Navigate to="/login" replace />;
  }

  if (!['revisor', 'ambos'].includes(registration.rolParticipacion)) {
    return <AccesoDenegado registration={registration} />;
  }

  return <Outlet />;
}

function AccesoDenegado({ registration }) {
  const fullName = `${registration.nombres || ''} ${registration.apellidos || ''}`.trim();
  const role = registration.rolParticipacion === 'autor' ? 'autor' : 'participante';
  const emailSubject = encodeURIComponent('Solicitud de cambio de rol a revisor');
  const emailBody = encodeURIComponent(
    `Hola, quisiera solicitar acceso a la bandeja de revisión.\n\nNombre: ${fullName}\nCorreo: ${registration.email || ''}`
  );

  return (
    <section className="access-denied-page" aria-labelledby="access-denied-title">
      <div className="access-denied-content">
        <img className="access-denied-icon" src={ilustracion} alt="" />
        <h1 id="access-denied-title">No tiene permiso para ver esta página</h1>
        <p>
          La bandeja de revisión es exclusiva del rol revisor. Si cree que debería
          tener acceso, solicite el cambio de rol al comité organizador.
        </p>
        <div className="access-denied-actions">
          <Link className="access-denied-primary" to="/autor/trabajos">
            Volver a mis trabajos
          </Link>
          <a
            className="access-denied-secondary"
            href={`mailto:congreso@ulima.edu.pe?subject=${emailSubject}&body=${emailBody}`}
          >
            Escribir al comité
          </a>
        </div>
        <small>
          Código de error: 403 · Sesión de {fullName || 'participante'} (rol {role})
        </small>
      </div>
    </section>
  );
}

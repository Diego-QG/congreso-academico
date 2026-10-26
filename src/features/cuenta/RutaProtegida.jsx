import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { getCurrentParticipant, getParticipantHome } from '../../shared/cuentaServicio';
import './RutaRevisor.css';

const ROLE_LABELS = {
  autor: 'autor',
  revisor: 'revisor',
  ambos: 'autor y revisor',
  comite: 'comité'
};

export default function RutaProtegida({ rolesPermitidos }) {
  const location = useLocation();
  const participant = getCurrentParticipant();

  if (!participant) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!rolesPermitidos.includes(participant.rolParticipacion)) {
    return (
      <section className="access-denied-page" aria-labelledby="access-denied-title">
        <div className="access-denied-content">
          <span className="access-denied-icon" aria-hidden="true">!</span>
          <h1 id="access-denied-title">No tiene permiso para ver esta página</h1>
          <p>
            Esta sección es exclusiva para {rolesPermitidos
              .map((role) => ROLE_LABELS[role] || role)
              .join(' o ')}. Su sesión corresponde al rol{' '}
            {ROLE_LABELS[participant.rolParticipacion] || 'participante'}.
          </p>
          <div className="access-denied-actions">
            <Link className="access-denied-primary" to={getParticipantHome(participant)}>
              Ir a mi espacio
            </Link>
            <Link className="access-denied-secondary" to="/">
              Volver al inicio
            </Link>
          </div>
          <small>Código de error: 403</small>
        </div>
      </section>
    );
  }

  return <Outlet />;
}

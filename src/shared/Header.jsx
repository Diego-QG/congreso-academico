import { Link, NavLink, useLocation } from 'react-router-dom';

// Encabezado común. Se modifica SOLO aquí.
export default function Header() {
  const location = useLocation();
  const registration = location.state?.registration;
  const isWelcomePage = location.pathname === '/bienvenida' && registration;
  const firstName = registration?.nombres?.trim().split(/\s+/)[0] || '';
  const firstSurname = registration?.apellidos?.trim().split(/\s+/)[0] || '';
  const initials = `${firstName[0] || ''}${firstSurname[0] || ''}`.toUpperCase();
  const roleLabels = {
    autor: 'Autor',
    revisor: 'Revisor',
    ambos: 'Autor y revisor'
  };

  return (
    <>
      <div className="top-header-bar"></div>

      <header className="main-header">
        <div className="header-top">
          <Link to="/" className="brand-logo">
            <div className="logo-box">C</div>
            <div className="brand-titles">
              <h2>Congreso Académico Estudiantil</h2>
              <p>UNIVERSIDAD DE LIMA · EDICIÓN 2026</p>
            </div>
          </Link>

          <div className="edition-status">
            <span className="status-label">ESTADO DE LA EDICIÓN</span>
            <span className="status-badge">Recepción abierta</span>
          </div>
        </div>

        <nav className="main-nav">
          <ul className="nav-links">
            {isWelcomePage ? (
              <>
                <li><a href="#inicio" className="active">Inicio</a></li>
                <li><a href="#nuevo-trabajo">Nuevo trabajo</a></li>
                <li><a href="#mis-trabajos">Mis trabajos</a></li>
                <li><a href="#inicio">Mi presentación</a></li>
                <li><a href="#mi-cuenta">Mi cuenta</a></li>
              </>
            ) : (
              <>
                <li><NavLink to="/" end>Inicio</NavLink></li>
                <li><a href="/#bases">Bases del congreso</a></li>
                <li><a href="/#ejes">Ejes temáticos</a></li>
                <li><a href="/#programa">Programa</a></li>
              </>
            )}
          </ul>

          {isWelcomePage ? (
            <div className="registered-user" id="mi-cuenta">
              <span className="registered-user-name">
                {registration.nombres} {registration.apellidos}
                <small>Rol: {roleLabels[registration.rolParticipacion] || 'Participante'}</small>
              </span>
              <span className="registered-user-initials" aria-label={`Iniciales ${initials}`}>
                {initials}
              </span>
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/login" className="btn-secondary">Iniciar sesión</NavLink>
              <NavLink to="/registro" className="btn-primary">Crear cuenta</NavLink>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import isotipo from '../assets/marca/isotipo.svg';
import { getCurrentParticipant, signOut } from './cuentaServicio';

// Encabezado común. Se modifica SOLO aquí.
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  // Menú desplegable del celular (en escritorio no se usa).
  const [menuAbierto, setMenuAbierto] = useState(false);
  const registration = location.state?.registration
    || getCurrentParticipant();
  const isWelcomePage = location.pathname === '/bienvenida' && registration;
  const hasReviewerRole = ['revisor', 'ambos'].includes(registration?.rolParticipacion);
  const hasAuthorRole = ['autor', 'ambos'].includes(registration?.rolParticipacion);
  const hasCommitteeRole = registration?.rolParticipacion === 'comite';
  const firstName = registration?.nombres?.trim().split(/\s+/)[0] || '';
  const firstSurname = registration?.apellidos?.trim().split(/\s+/)[0] || '';
  const initials = `${firstName[0] || ''}${firstSurname[0] || ''}`.toUpperCase();
  const roleLabels = {
    autor: 'Autor',
    revisor: 'Revisor',
    ambos: 'Autor y revisor',
    comite: 'Comité'
  };
  const handleSignOut = () => {
    signOut();
    navigate('/', { replace: true });
  };

  // Escape cierra el menú del celular.
  useEffect(() => {
    if (!menuAbierto) return;
    function alPresionar(e) {
      if (e.key === 'Escape') setMenuAbierto(false);
    }
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [menuAbierto]);

  // Al tocar un enlace del menú, se cierra.
  function alTocarMenu(e) {
    if (e.target.closest('a')) setMenuAbierto(false);
  }

  return (
    <>
      <div className="top-header-bar"></div>

      <header className="main-header">
        <div className="header-top">
          <div className="contenedor header-top-interno">
            <Link to="/" className="brand-logo">
              <img src={isotipo} alt="" className="logo-box" />
              <div className="brand-titles">
                <h2>Congreso Académico Estudiantil</h2>
                <p>UNIVERSIDAD DE LIMA · EDICIÓN 2026</p>
              </div>
            </Link>

            <div className="edition-status">
              <span className="status-label">ESTADO DE LA EDICIÓN</span>
              <span className="status-badge">Recepción abierta</span>
            </div>

            <button
              type="button"
              className="boton-menu"
              aria-expanded={menuAbierto}
              aria-controls="menu-principal"
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              {menuAbierto ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <nav
          id="menu-principal"
          className={'main-nav contenedor' + (menuAbierto ? ' abierto' : '')}
          aria-label="Principal"
          onClick={alTocarMenu}
        >
          <ul className="nav-links">
            {registration ? (
              <>
                <li>
                  {isWelcomePage
                    ? <a href="#inicio" className="active">Inicio</a>
                    : <NavLink to="/">Inicio</NavLink>}
                </li>
                {hasAuthorRole && (
                  <li><NavLink to="/nuevo-trabajo">Nuevo trabajo</NavLink></li>
                )}
                {hasAuthorRole && (
                  <li><NavLink to="/mis-trabajos">Mis trabajos</NavLink></li>
                )}
                {hasReviewerRole && (
                  <li><NavLink to="/revisor/bandeja">Mi bandeja</NavLink></li>
                )}
                {hasCommitteeRole && (
                  <>
                    <li><NavLink to="/comite/edicion">Edición</NavLink></li>
                    <li><NavLink to="/comite/asignaciones">Asignaciones</NavLink></li>
                  </>
                )}
                {isWelcomePage && (
                  <li><a href="#mi-presentacion">Mi presentación</a></li>
                )}
                <li><NavLink to="/mi-cuenta">Mi cuenta</NavLink></li>
              </>
            ) : (
              <>
                <li><NavLink to="/" end>Inicio</NavLink></li>
                <li><a href="/#bases">Bases del congreso</a></li>
                <li><a href="/#ejes">Ejes temáticos</a></li>
                <li><NavLink to="/programa">Programa</NavLink></li>
              </>
            )}
          </ul>

          {registration ? (
            <div className="registered-user">
              <span className="registered-user-name">
                {registration.nombres} {registration.apellidos}
                <small>Rol: {roleLabels[registration.rolParticipacion] || 'Participante'}</small>
              </span>
              <span className="registered-user-initials" aria-label={`Iniciales ${initials}`}>
                {initials}
              </span>
              <button className="logout-button" onClick={handleSignOut} type="button">
                Cerrar sesión
              </button>
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
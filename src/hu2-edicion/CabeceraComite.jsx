import { useNavigate } from 'react-router-dom';

const OPCIONES_MENU = [
  'Configuración',
  'Trabajos recibidos',
  'Revisores',
  'Seguimiento',
  'Programa',
  'Tablero',
  'Usuarios',
];

// Uso: <CabeceraComite estado="Recepción abierta" />
function CabeceraComite({ estado = 'Recepción abierta' }) {
  const navigate = useNavigate();

  const evitarSalto = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <header className="cabecera">
        <div className="contenedor cabecera-interna">
          <div className="marca" onClick={() => navigate('/portada')}>
            <div className="logo-c">C</div>
            <div>
              <p className="marca-nombre">Congreso Académico Estudiantil</p>
              <p className="marca-sub">UNIVERSIDAD DE LIMA · EDICIÓN 2026</p>
            </div>
          </div>
          <div className="estado-edicion">
            ESTADO DE LA EDICIÓN
            <span className="etiqueta-estado">
              <span className="punto-estado">●</span> {estado}
            </span>
          </div>
        </div>
      </header>

      <nav className="barra-nav">
        <div className="contenedor barra-nav-interna">
          <ul className="menu">
            {OPCIONES_MENU.map((opcion) => (
              <li key={opcion}>
                <a
                  href="#"
                  className={opcion === 'Configuración' ? 'activo' : ''}
                  onClick={evitarSalto}
                >
                  {opcion}
                </a>
              </li>
            ))}
          </ul>
          <div className="usuario">
            <span className="usuario-icono"></span>
            <div className="usuario-datos">
              <p className="usuario-nombre">Dra. Ana Salazar Bermúdez</p>
              <p className="usuario-rol">Rol: Comité organizador</p>
            </div>
            <div className="avatar">AS</div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default CabeceraComite;

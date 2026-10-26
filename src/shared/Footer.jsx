import { Link } from "react-router-dom";
import logoNegativo from "../assets/marca/logo-horizontal-negativo.svg";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="contenedor">
        <div className="footer-content">
          <div className="footer-column">
            <img
              src={logoNegativo}
              alt="Congreso Académico Estudiantil · Universidad de Lima"
              className="footer-logo"
            />
            <p>
              Facultad de Ingeniería · Universidad de Lima. Av. Javier Prado Este
              4600, Santiago de Surco, Lima.
            </p>
          </div>
          <div className="footer-col">
            <h4 className="gold-title">EL CONGRESO</h4>
            <ul>
              <li>
                <a href="/#bases">Bases y requisitos</a>
              </li>
              <li>
                <a href="/#ejes">Ejes temáticos</a>
              </li>
              <li>
                <Link to="/programa">Programa</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="gold-title">PARTICIPANTES</h4>
            <ul>
              <li>
                <Link to="/registro">Crear cuenta</Link>
              </li>
              <li>
                <Link to="/login">Iniciar sesión</Link>
              </li>
              <li>
                <Link to="/recuperar-contrasena">Recuperar contraseña</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="gold-title">CONTACTO</h4>
            <p>
              <a href="mailto:congreso@ulima.edu.pe">congreso@ulima.edu.pe</a>
            </p>
            <p>
              <a href="tel:+5114376767">(01) 437 6767 anexo 30450</a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Universidad de Lima. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="contenedor">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Congreso Académico Estudiantil</h3>
            <p>
              Facultad de Ingeniería · Universidad de Lima. Av. Javier Prado Este
              4600, Santiago de Surco, Lima.
            </p>
          </div>
          <div className="footer-col">
            <h4 className="gold-title">EL CONGRESO</h4>
            <ul>
              <li>
                <a href="#bases">Bases y requisitos</a>
              </li>
              <li>
                <a href="#ejes">Ejes temáticos</a>
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
                <Link to="/registro" className="footer-link-btn">
                  Guía para autores
                </Link>
              </li>
              <li>
                <a href="#revisores">Guía para revisores</a>
              </li>
              <li>
                <a href="#faq">Preguntas frecuentes</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="gold-title">CONTACTO</h4>
            <p>congreso@ulima.edu.pe</p>
            <p>(01) 437 6767 anexo 30450</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Universidad de Lima. Todos los derechos reservados.</p>
          <div className="footer-legal">
            <a href="#terminos">Términos de uso</a>
            <a href="#privacidad">Política de privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

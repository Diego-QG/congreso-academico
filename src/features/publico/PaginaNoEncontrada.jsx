import { Link } from 'react-router-dom';
import './PaginaNoEncontrada.css';

export default function PaginaNoEncontrada() {
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div className="not-found-content">
        <span className="not-found-code" aria-hidden="true">404</span>
        <h1 id="not-found-title">No encontramos la página que busca</h1>
        <p>
          El enlace pudo cambiar o el trabajo ya no está publicado. Puede
          volver al inicio o consultar el programa del congreso.
        </p>
        <div className="not-found-actions">
          <Link className="not-found-primary" to="/">
            Ir al inicio
          </Link>
          <Link className="not-found-secondary" to="/programa">
            Ver el programa
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import "./Inicio.css";

export default function Inicio() {
  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="hero-section" id="inicio">
        <div className="hero-card">
          <div className="hero-left">
            <span className="hero-tag">
              CONVOCATORIA ABIERTA · LIMA, 12 Y 13 DE NOVIEMBRE DE 2026
            </span>
            <h1 className="hero-title">VIII Congreso Académico Estudiantil</h1>
            <p className="hero-description">
              Presenta tu investigación ante el comité y la comunidad
              universitaria. Recibimos artículos completos, resúmenes
              extendidos, pósteres y casos de estudio en seis ejes temáticos.
            </p>
          </div>
          <div className="hero-right">
            {/* BOTÓN "ENVIAR MI TRABAJO" LLEVA AL LOGIN (1.2) */}
            <Link to="/login" className="btn-hero-primary">
              Enviar mi trabajo
            </Link>
            <a href="#bases" className="btn-hero-secondary">
              Descargar las bases
            </a>
          </div>
        </div>
      </section>

      {/* --- EJES TEMÁTICOS --- */}
      <section className="section-ejes" id="ejes">
        <div className="section-header">
          <h2 className="section-title">Ejes temáticos</h2>
          <a href="#bases" className="link-action">
            Ver bases completas
          </a>
        </div>
        <div className="grid-cards">
          <div className="card">
            <h3>Inteligencia artificial y datos</h3>
            <p>
              Aprendizaje automático, analítica y ciencia de datos aplicada.
            </p>
          </div>
          <div className="card">
            <h3>Ingeniería de software</h3>
            <p>Arquitectura, calidad, pruebas y procesos de desarrollo.</p>
          </div>
          <div className="card">
            <h3>Sostenibilidad y ciudad</h3>
            <p>Movilidad, gestión del agua y ciudades resilientes.</p>
          </div>
          <div className="card">
            <h3>Innovación y emprendimiento</h3>
            <p>Modelos de negocio, transferencia tecnológica y startups.</p>
          </div>
          <div className="card">
            <h3>Salud y sociedad</h3>
            <p>Salud pública, bienestar estudiantil y política social.</p>
          </div>
          <div className="card">
            <h3>Economía y mercados</h3>
            <p>Mercados financieros, comercio y desarrollo económico.</p>
          </div>
        </div>
      </section>

      {/* --- FECHAS LÍMITE Y CRITERIOS --- */}
      <section className="section-info grid-two-columns" id="bases">
        <div className="info-block">
          <h2 className="section-title">Fechas límite</h2>
          <ul className="info-list">
            <li>
              <span>Cierre de recepción de trabajos</span>
              <strong>30/09/2026</strong>
            </li>
            <li>
              <span>Cierre de la etapa de revisión</span>
              <strong>20/10/2026</strong>
            </li>
            <li>
              <span>Publicación de resultados</span>
              <strong>28/10/2026</strong>
            </li>
            <li>
              <span>Días del congreso</span>
              <strong>12/11/2026 – 13/11/2026</strong>
            </li>
          </ul>
        </div>

        <div className="info-block">
          <h2 className="section-title">Criterios de evaluación</h2>
          <div className="color-description">
            <ul className="info-list">
              <li>
                <span>Originalidad</span>
                <strong>25 %</strong>
              </li>
              <li>
                <span>Rigor metodológico</span>
                <strong>30 %</strong>
              </li>
              <li>
                <span>Claridad de la exposición</span>
                <strong>20 %</strong>
              </li>
              <li>
                <span>Relevancia y aporte</span>
                <strong>25 %</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

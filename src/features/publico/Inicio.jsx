import { Link } from "react-router-dom";
import heroGrande from "../../assets/fotos/hero-congreso.webp";
import heroNormal from "../../assets/fotos/hero-congreso-1x.webp";
import heroMovil from "../../assets/fotos/hero-congreso-movil.webp";
import heroJpg from "../../assets/fotos/hero-congreso.jpg";
import { BrainCircuit, Building2, ChartLine, CodeXml, HeartPulse, Rocket } from "lucide-react";
import "./Inicio.css";

const EJES = [
  { titulo: "Inteligencia artificial y datos", texto: "Aprendizaje automático, analítica y ciencia de datos aplicada.", Icono: BrainCircuit },
  { titulo: "Ingeniería de software", texto: "Arquitectura, calidad, pruebas y procesos de desarrollo.", Icono: CodeXml },
  { titulo: "Sostenibilidad y ciudad", texto: "Movilidad, gestión del agua y ciudades resilientes.", Icono: Building2 },
  { titulo: "Innovación y emprendimiento", texto: "Modelos de negocio, transferencia tecnológica y startups.", Icono: Rocket },
  { titulo: "Salud y sociedad", texto: "Salud pública, bienestar estudiantil y política social.", Icono: HeartPulse },
  { titulo: "Economía y mercados", texto: "Mercados financieros, comercio y desarrollo económico.", Icono: ChartLine },
];

export default function Inicio() {
  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="hero-section" id="inicio">
        <picture className="hero-foto">
          <source media="(max-width: 767px)" srcSet={heroMovil} type="image/webp" />
          <source srcSet={`${heroNormal} 1280w, ${heroGrande} 2560w`} sizes="100vw" type="image/webp" />
          <img src={heroJpg} alt="" fetchPriority="high" />
        </picture>

        <div className="contenedor hero-card">
          <span className="hero-tag">Convocatoria abierta · Lima, 12 y 13 de noviembre de 2026</span>
          <h1 className="hero-title">
            <span className="hero-edicion">VIII</span> Congreso Académico Estudiantil
          </h1>
          <p className="hero-description">
            Presenta tu investigación ante el comité y la comunidad
            universitaria. Recibimos artículos completos, resúmenes
            extendidos, pósteres y casos de estudio en seis ejes temáticos.
          </p>
          <div className="hero-acciones">
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
          {EJES.map(({ titulo, texto, Icono }) => (
            <div className="card" key={titulo}>
              <span className="card-icono" aria-hidden="true">
                <Icono size={22} strokeWidth={1.75} />
              </span>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </div>
          ))}
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

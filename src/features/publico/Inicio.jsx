import { Link } from "react-router-dom";
import heroGrande from "../../assets/fotos/hero-congreso.webp";
import heroNormal from "../../assets/fotos/hero-congreso-1x.webp";
import heroMovil from "../../assets/fotos/hero-congreso-movil.webp";
import heroJpg from "../../assets/fotos/hero-congreso.jpg";
import sedeFoto from "../../assets/fotos/sede-campus.webp";
import {
  BrainCircuit, Building2, CalendarDays, ChartLine, ClipboardCheck, CodeXml,
  FileUp, HeartPulse, MapPin, Rocket, UserPlus,
} from "lucide-react";
import { diasHasta, formatoFecha, textoDias } from "../../shared/fechas";
import "./Inicio.css";

const EJES = [
  { titulo: "Inteligencia artificial y datos", texto: "Aprendizaje automático, analítica y ciencia de datos aplicada.", Icono: BrainCircuit },
  { titulo: "Ingeniería de software", texto: "Arquitectura, calidad, pruebas y procesos de desarrollo.", Icono: CodeXml },
  { titulo: "Sostenibilidad y ciudad", texto: "Movilidad, gestión del agua y ciudades resilientes.", Icono: Building2 },
  { titulo: "Innovación y emprendimiento", texto: "Modelos de negocio, transferencia tecnológica y startups.", Icono: Rocket },
  { titulo: "Salud y sociedad", texto: "Salud pública, bienestar estudiantil y política social.", Icono: HeartPulse },
  { titulo: "Economía y mercados", texto: "Mercados financieros, comercio y desarrollo económico.", Icono: ChartLine },
];

// Los tres pasos para participar (es una secuencia real, por eso van numerados).
const PASOS = [
  { titulo: "Crea tu cuenta", texto: "Regístrate con tu correo institucional como autor, revisor o ambos.", Icono: UserPlus },
  { titulo: "Envía tu trabajo", texto: "Sube tu artículo, resumen extendido, póster o caso de estudio antes del cierre de recepción.", Icono: FileUp },
  { titulo: "Recibe el dictamen", texto: "El comité evalúa cada trabajo con los criterios publicados y te notifica el resultado.", Icono: ClipboardCheck },
];

// Etapas del congreso. "fin" es el último día de cada etapa (AAAA-MM-DD).
const ETAPAS = [
  { nombre: "Recepción de trabajos", detalle: "Cierre a las 23:59", fin: "2026-09-30" },
  { nombre: "Revisión por pares", detalle: "Cierre de la etapa", fin: "2026-10-20" },
  { nombre: "Publicación de resultados", detalle: "Dictamen para cada autor", fin: "2026-10-28" },
  { nombre: "Días del congreso", detalle: "12 y 13 de noviembre", fin: "2026-11-13", inicio: "2026-11-12" },
];

const CRITERIOS = [
  { nombre: "Originalidad", peso: 25 },
  { nombre: "Rigor metodológico", peso: 30 },
  { nombre: "Claridad de la exposición", peso: 20 },
  { nombre: "Relevancia y aporte", peso: 25 },
];

// Cada etapa queda como terminada, la próxima o pendiente, según la fecha de hoy.
function estadosDeEtapas() {
  let proximaMarcada = false;
  return ETAPAS.map((e) => {
    if (diasHasta(e.fin) < 0) return { ...e, estado: "terminada" };
    if (!proximaMarcada) {
      proximaMarcada = true;
      return { ...e, estado: "proxima", dias: diasHasta(e.inicio || e.fin) };
    }
    return { ...e, estado: "pendiente" };
  });
}

const TEXTO_ESTADO = { terminada: "Terminada", proxima: "Próxima etapa", pendiente: "Pendiente" };

export default function Inicio() {
  const etapas = estadosDeEtapas();

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

      {/* --- CÓMO PARTICIPAR --- */}
      <section className="section-pasos" aria-labelledby="pasos-titulo">
        <div className="section-header">
          <h2 className="section-title" id="pasos-titulo">Cómo participar</h2>
        </div>
        <ol className="pasos">
          {PASOS.map(({ titulo, texto, Icono }, i) => (
            <li className="paso" key={titulo}>
              <span className="paso-icono" aria-hidden="true">
                <Icono size={22} strokeWidth={1.75} />
              </span>
              <span className="paso-numero">Paso {i + 1}</span>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </li>
          ))}
        </ol>
        <Link to="/registro" className="pasos-boton">Crear mi cuenta</Link>
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

      {/* --- FECHAS CLAVE Y CRITERIOS (bases del congreso) --- */}
      <section className="section-bases" id="bases" aria-labelledby="fechas-titulo">
        <div className="section-header">
          <h2 className="section-title" id="fechas-titulo">Fechas clave</h2>
        </div>
        <ol className="etapas">
          {etapas.map((e) => (
            <li className={"etapa etapa-" + e.estado} key={e.nombre}>
              <span className="etapa-punto" aria-hidden="true"></span>
              <span className="etapa-estado">
                {TEXTO_ESTADO[e.estado]}
                {e.estado === "proxima" && e.dias > 0 && ` · ${textoDias(e.dias)}`}
              </span>
              <strong className="etapa-fecha">
                {e.inicio ? `${formatoFecha(e.inicio)} – ${formatoFecha(e.fin)}` : formatoFecha(e.fin)}
              </strong>
              <span className="etapa-nombre">{e.nombre}</span>
              <span className="etapa-detalle">{e.detalle}</span>
            </li>
          ))}
        </ol>

        <div className="section-header criterios-cabecera">
          <h2 className="section-title">Criterios de evaluación</h2>
        </div>
        <ul className="criterios">
          {CRITERIOS.map((c) => (
            <li className="criterio" key={c.nombre}>
              <div className="criterio-fila">
                <span>{c.nombre}</span>
                <strong>{c.peso} %</strong>
              </div>
              <span className="criterio-barra" aria-hidden="true">
                <span style={{ width: `${c.peso * 2.5}%` }}></span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* --- SEDE --- */}
      <section className="section-sede" aria-labelledby="sede-titulo">
        <img className="sede-foto" src={sedeFoto} alt="Vista del campus de la Universidad de Lima" loading="lazy" />
        <div className="sede-info">
          <span className="sede-etiqueta">Sede</span>
          <h2 className="section-title" id="sede-titulo">Universidad de Lima</h2>
          <ul className="sede-datos">
            <li>
              <MapPin size={20} strokeWidth={1.75} aria-hidden="true" />
              <span>Av. Javier Prado Este 4600, Santiago de Surco, Lima</span>
            </li>
            <li>
              <CalendarDays size={20} strokeWidth={1.75} aria-hidden="true" />
              <span>Jueves 12 y viernes 13 de noviembre de 2026</span>
            </li>
            <li>
              <Building2 size={20} strokeWidth={1.75} aria-hidden="true" />
              <span>Facultad de Ingeniería · Salas A-101 y B-201</span>
            </li>
          </ul>
          <div className="sede-acciones">
            <a
              className="btn-sede-primario"
              href="https://www.google.com/maps/search/?api=1&query=Universidad+de+Lima"
              target="_blank"
              rel="noreferrer"
            >
              Ver en Google Maps
            </a>
            <Link className="btn-sede-secundario" to="/programa">Ver el programa</Link>
          </div>
        </div>
      </section>
    </>
  );
}

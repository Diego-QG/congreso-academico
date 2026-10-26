import { useState } from "react";
import { Link } from "react-router-dom";
import { useRevisiones } from "./revisionesContexto";
import { obtenerAsignacionesDeRevisor, obtenerTrabajo } from "./revisionesServicio";
import { TEXTO_RECOMENDACION } from "./consolidado";
import { diasHasta, formatoFecha, textoDias } from "../../shared/fechas";
import ilustracionVacia from "../../assets/ilustraciones/vacio-bandeja.svg";
import "./BandejaRevisor.css";

// Temporal: se leerá de la sesión cuando HU-1 tenga el contexto compartido.
const REVISOR_ACTUAL = "R5";

const FILTROS = [
  { valor: "todas", texto: "Todas" },
  { valor: "pendientes", texto: "Pendientes" },
  { valor: "entregadas", texto: "Entregadas" },
  { valor: "vencidas", texto: "Vencidas" },
];

const ESTADOS = {
  pendiente: { texto: "Revisión pendiente", boton: "Evaluar" },
  progreso: { texto: "En progreso", boton: "Continuar" },
  vencida: { texto: "Vencida", boton: "Evaluar ahora" },
  entregada: { texto: "Entregada", boton: "Ver evaluación" },
};

function estadoDe(revision, dias) {
  if (revision?.estado === "enviada") return "entregada";
  if (dias < 0) return "vencida";
  return revision ? "progreso" : "pendiente";
}

function textoPlazo(a) {
  if (a.estado === "entregada") {
    const recomendacion = TEXTO_RECOMENDACION[a.revision.recomendacion]?.toLowerCase();
    return `Enviada el ${formatoFecha(a.revision.fechaEnvio)} · ${recomendacion}`;
  }
  if (a.dias < 0) return `Venció el ${formatoFecha(a.fecha)} · ${textoDias(a.dias)}`;
  return `Vence el ${formatoFecha(a.fecha)} · ${textoDias(a.dias)}`;
}

function pasaFiltro(a, filtro) {
  if (filtro === "pendientes") return a.estado !== "entregada";
  if (filtro === "entregadas") return a.estado === "entregada";
  if (filtro === "vencidas") return a.estado === "vencida";
  return true;
}

export default function BandejaRevisor() {
  const { revisiones } = useRevisiones();
  const [filtro, setFiltro] = useState("todas");

  const asignaciones = obtenerAsignacionesDeRevisor(REVISOR_ACTUAL)
    .map((a) => {
      const revision = revisiones.find((r) => r.asignacionId === a.id);
      const dias = diasHasta(a.fecha);
      return { ...a, trabajo: obtenerTrabajo(a.trabajoId), revision, dias, estado: estadoDe(revision, dias) };
    })
    // Primero lo que vence antes; las entregadas al final.
    .sort((x, y) => (x.estado === "entregada") - (y.estado === "entregada") || x.dias - y.dias);

  const total = (f) => asignaciones.filter((a) => pasaFiltro(a, f)).length;
  const visibles = asignaciones.filter((a) => pasaFiltro(a, filtro));
  // Fecha de cierre: el plazo más tardío de las asignaciones (hasta que la edición la guarde).
  const cierre = asignaciones.reduce((max, a) => (a.fecha > max ? a.fecha : max), "");

  if (asignaciones.length === 0) {
    return (
      <section className="bandeja">
        <h1>Mi bandeja de revisión</h1>
        <p className="bandeja-sub">Sin trabajos asignados por ahora</p>
        <div className="bandeja-vacia">
          <img className="bandeja-vacia-icono" src={ilustracionVacia} alt="" />
          <h2>No tiene revisiones asignadas</h2>
          <p>
            El comité asigna los trabajos cuando cierra la recepción. Mantenga sus líneas de interés actualizadas para
            recibir trabajos afines.
          </p>
          <Link className="boton-secundario" to="/mi-cuenta">
            Actualizar mis líneas de interés
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bandeja">
      <header className="bandeja-cabecera">
        <div>
          <h1>Mi bandeja de revisión</h1>
          <p className="bandeja-sub">
            {asignaciones.length} {asignaciones.length === 1 ? "trabajo asignado" : "trabajos asignados"}
            {" · "}la etapa de revisión cierra el {formatoFecha(cierre)}
          </p>
        </div>
        <div className="bandeja-contadores">
          <div className="contador contador-pendientes">
            <span>Pendientes</span>
            <strong>{total("pendientes")}</strong>
          </div>
          <div className="contador contador-entregadas">
            <span>Entregadas</span>
            <strong>{total("entregadas")}</strong>
          </div>
          {total("vencidas") > 0 && (
            <div className="contador contador-vencidas">
              <span>Vencidas</span>
              <strong>{total("vencidas")}</strong>
            </div>
          )}
        </div>
      </header>

      <div className="bandeja-filtros" role="group" aria-label="Filtrar revisiones">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            type="button"
            className={
              "filtro" + (filtro === f.valor ? " activo" : "") + (f.valor === "vencidas" ? " filtro-vencidas" : "")
            }
            onClick={() => setFiltro(f.valor)}
          >
            {f.texto} · {total(f.valor)}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="bandeja-sin-resultados">No hay revisiones en este filtro.</p>
      ) : (
        <div className="bandeja-tarjetas">
          {visibles.map((a) => (
            <article key={a.id} className={"revision-tarjeta revision-tarjeta-" + a.estado}>
              <div className="revision-tarjeta-superior">
                <span className="revision-tarjeta-codigo">{a.trabajo.codigo}</span>
                <span className={"insignia insignia-" + a.estado}>{ESTADOS[a.estado].texto}</span>
              </div>
              <h2>{a.trabajo.titulo}</h2>
              <div className="revision-tarjeta-etiquetas">
                <span className="revision-tarjeta-eje">{a.trabajo.eje}</span>
                <span className="revision-tarjeta-tipo">{a.trabajo.tipo}</span>
              </div>
              <footer className="revision-tarjeta-pie">
                <span className={"revision-tarjeta-plazo plazo-" + a.estado}>{textoPlazo(a)}</span>
                <Link
                  className={a.estado === "entregada" ? "revision-tarjeta-enlace" : "boton-primario revision-tarjeta-boton"}
                  to={"/revisor/revision/" + a.id}
                >
                  {ESTADOS[a.estado].boton}
                </Link>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

import { Link } from "react-router-dom";
import seed from "../data/seed.json";
import "./BandejaRevisor.css";

// Temporallllll
const REVISOR_ACTUAL = "R5";

function estadoDeRevision(asignacionId) {
  const revision = seed.revisiones.find((r) => r.asignacionId === asignacionId);
  if (!revision) return "Pendiente";
  return revision.estado === "enviada" ? "Enviada" : "En progreso";
}

const TEXTO_BOTON = {
  Pendiente: "Evaluar",
  "En progreso": "Continuar",
  Enviada: "Ver",
};

const ASIGNACIONES = seed.asignaciones
  .filter((a) => a.revisorId === REVISOR_ACTUAL)
  .map((a) => {
    const trabajo = seed.trabajos.find((t) => t.id === a.trabajoId);
    return {
      id: a.id,
      codigo: trabajo.codigo,
      titulo: trabajo.titulo,
      eje: trabajo.eje,
      fechaLimite: a.fecha,
      estado: estadoDeRevision(a.id),
    };
  });

function claseEstado(estado) {
  return "estado-" + estado.toLowerCase().replace(" ", "-");
}

export default function BandejaRevisor() {
  return (
    <section className="bandeja">
      <h1>Mis revisiones asignadas</h1>
      <p className="bandeja-sub">
        Trabajos que el comité le asignó para evaluar.
      </p>

      {ASIGNACIONES.length === 0 ? (
        <p className="bandeja-vacia">Aún no tiene trabajos asignados.</p>
      ) : (
        <table className="bandeja-tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Trabajo</th>
              <th>Fecha límite</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ASIGNACIONES.map((a) => (
              <tr key={a.id}>
                <td>{a.codigo}</td>
                <td>
                  <strong>{a.titulo}</strong>
                  <span className="bandeja-eje">{a.eje}</span>
                </td>
                <td>{a.fechaLimite}</td>
                <td>
                  <span className={"etiqueta " + claseEstado(a.estado)}>
                    {a.estado}
                  </span>
                </td>
                <td>
                  <Link
                    className="bandeja-boton"
                    to={"/revisor/revision/" + a.id}
                  >
                    {TEXTO_BOTON[a.estado]}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

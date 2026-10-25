import { Routes, Route } from "react-router-dom";
import Layout from "./shared/Layout";
import Inicio from "./pages/Inicio";
import Portada from "./pages/Portada";

// HU-1 · Cuenta y acceso
import Login from "./hu1-cuenta/Login";
import Register from "./hu1-cuenta/Register";
import Bienvenida from "./hu1-cuenta/Bienvenida";
import MiCuenta from "./hu1-cuenta/MiCuenta";
import RecuperarContrasena from "./hu1-cuenta/RecuperarContrasena";
import PaginaNoEncontrada from "./hu1-cuenta/PaginaNoEncontrada";
// HU-3 · Envío de trabajos
import { MisTrabajos, NuevoTrabajo } from "./hu3-trabajos/Historia3";
// Configuración de la edición
import ConfiguracionEdicion from "./ConfiguracionEdicion";
import EjesTematicos from "./EjesTematicos";
import TiposTrabajo from "./TiposTrabajo";
import FechasLimite from "./FechasLimite";
import CriteriosEvaluacion from "./CriteriosEvaluacion";
// HU-4 · Asignación de revisiones
import Historia4 from "./hu4-asignacion/Historia4";
// HU-5 · Revisión y dictamen
import BandejaRevisor from "./hu5-revision/BandejaRevisor";
import FormularioEvaluacion from "./hu5-revision/FormularioEvaluacion";
import RevisionesProvider from "./hu5-revision/RevisionesProvider";
import RutaRevisor from "./hu1-cuenta/RutaRevisor";

export default function App() {
  return (
    <RevisionesProvider>
      <Routes>
        {/* Portada del proyecto: índice de historias (diseño propio, sin header ni footer) */}
        <Route path="/portada" element={<Portada />} />

        {/* TODO: la configuración de la edición*/}
        <Route path="/comite/edicion" element={<ConfiguracionEdicion />} />
        <Route path="/comite/edicion/ejes" element={<EjesTematicos />} />
        <Route path="/comite/edicion/tipos" element={<TiposTrabajo />} />
        <Route path="/comite/asignaciones" element={<Historia4 />} />
        <Route path="/comite/edicion/fechas" element={<FechasLimite />} />
        <Route path="/comite/edicion/criterios" element={<CriteriosEvaluacion />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />

          {/* HU-1 */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/bienvenida" element={<Bienvenida />} />
          <Route path="/mi-cuenta" element={<MiCuenta />} />
          <Route
            path="/recuperar-contrasena"
            element={<RecuperarContrasena />}
          />
          <Route path="*" element={<PaginaNoEncontrada />} />

          {/* HU-3 */}
          <Route path="/autor/trabajos" element={<MisTrabajos />} />
          <Route path="/nuevo-trabajo" element={<NuevoTrabajo />} />

          {/* HU-5 */}
          <Route element={<RutaRevisor />}>
            <Route path="/revisor/bandeja" element={<BandejaRevisor />} />
            <Route
              path="/revisor/revision/:asignacionId"
              element={<FormularioEvaluacion />}
            />
          </Route>
        </Route>
      </Routes>
    </RevisionesProvider>
  );
}

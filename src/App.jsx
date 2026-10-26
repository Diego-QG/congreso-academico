import { Routes, Route } from "react-router-dom";
import Layout from "./shared/Layout";
import Inicio from "./features/publico/Inicio";
import Portada from "./features/publico/Portada";

// HU-1 · Cuenta y acceso
import InicioSesion from "./features/cuenta/InicioSesion";
import Registro from "./features/cuenta/Registro";
import Bienvenida from "./features/cuenta/Bienvenida";
import MiCuenta from "./features/cuenta/MiCuenta";
import RecuperarContrasena from "./features/cuenta/RecuperarContrasena";
import PaginaNoEncontrada from "./features/publico/PaginaNoEncontrada";
// HU-3 · Envío de trabajos
import NuevoTrabajo from "./features/trabajos/NuevoTrabajo";
import Coautores from "./features/trabajos/Coautores";
import MisTrabajos from "./features/trabajos/MisTrabajos";
import DetalleTrabajo from "./features/trabajos/DetalleTrabajo";
// Configuración de la edición
import ConfiguracionEdicion from "./features/edicion/ConfiguracionEdicion";
import EjesTematicos from "./features/edicion/EjesTematicos";
import TiposTrabajo from "./features/edicion/TiposTrabajo";
import FechasLimite from "./features/edicion/FechasLimite";
import CriteriosEvaluacion from "./features/edicion/CriteriosEvaluacion";
// HU-4 · Asignación de revisiones
import AsignacionRevisores from "./features/asignaciones/AsignacionRevisores";
// HU-5 · Revisión y dictamen
import BandejaRevisor from "./features/revisiones/BandejaRevisor";
import FormularioEvaluacion from "./features/revisiones/FormularioEvaluacion";
import RevisionesProvider from "./features/revisiones/RevisionesProvider";
import ConsolidadoTrabajo from "./features/revisiones/ConsolidadoTrabajo";
import RutaRevisor from "./features/cuenta/RutaRevisor";
// HU-6 · Programa del congreso
import ProgramaProvider from "./features/programa/ProgramaProvider";
import ProgramaPublico from "./features/programa/ProgramaPublico";

export default function App() {
  return (
    <RevisionesProvider>
    <ProgramaProvider>
      <Routes>
        {/* Portada del proyecto: índice de historias (diseño propio, sin header ni footer) */}
        <Route path="/portada" element={<Portada />} />

        {/* TODO: la configuración de la edición*/}
        <Route path="/comite/edicion" element={<ConfiguracionEdicion />} />
        <Route path="/comite/edicion/ejes" element={<EjesTematicos />} />
        <Route path="/comite/edicion/tipos" element={<TiposTrabajo />} />
        <Route path="/comite/asignaciones" element={<AsignacionRevisores />} />
        <Route path="/comite/edicion/fechas" element={<FechasLimite />} />
        <Route path="/comite/edicion/criterios" element={<CriteriosEvaluacion />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />

          {/* HU-1 */}
          <Route path="/login" element={<InicioSesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/bienvenida" element={<Bienvenida />} />
          <Route path="/mi-cuenta" element={<MiCuenta />} />
          <Route
            path="/recuperar-contrasena"
            element={<RecuperarContrasena />}
          />
          <Route path="*" element={<PaginaNoEncontrada />} />

          {/* HU-3 */}
          <Route path="/nuevo-trabajo" element={<NuevoTrabajo />} />
          <Route path="/nuevo-trabajo/coautores" element={<Coautores />} />
          <Route path="/mis-trabajos" element={<MisTrabajos />} />
          <Route path="/mis-trabajos/:trabajoId" element={<DetalleTrabajo />} />

          {/* HU-5 */}
          <Route element={<RutaRevisor />}>
            <Route path="/revisor/bandeja" element={<BandejaRevisor />} />
            <Route
              path="/revisor/revision/:asignacionId"
              element={<FormularioEvaluacion />}
            />
            
          </Route>
            <Route
              path="/comite/trabajos/:trabajoId/consolidado"
              element={<ConsolidadoTrabajo />}
            />

          {/* HU-6 */}
          <Route path="/programa" element={<ProgramaPublico />} />
        </Route>
      </Routes>
    </ProgramaProvider>
    </RevisionesProvider>
  );
}

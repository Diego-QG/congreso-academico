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
import RutaProtegida from "./features/cuenta/RutaProtegida";
// HU-3 · Envío de trabajos
import NuevoTrabajo from "./features/trabajos/NuevoTrabajo";
import Coautores from "./features/trabajos/Coautores";
import MisTrabajos from "./features/trabajos/MisTrabajos";
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

        {/* HU-2 usa su propia cabecera y pie de comité; no envolver en Layout. */}
        <Route element={<RutaProtegida rolesPermitidos={['comite']} />}>
          <Route path="/comite/edicion" element={<ConfiguracionEdicion />} />
          <Route path="/comite/edicion/ejes" element={<EjesTematicos />} />
          <Route path="/comite/edicion/tipos" element={<TiposTrabajo />} />
          <Route path="/comite/edicion/fechas" element={<FechasLimite />} />
          <Route path="/comite/edicion/criterios" element={<CriteriosEvaluacion />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />

          {/* HU-1 */}
          <Route path="/login" element={<InicioSesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/bienvenida" element={<Bienvenida />} />
          <Route element={<RutaProtegida rolesPermitidos={['autor', 'revisor', 'ambos', 'comite']} />}>
            <Route path="/mi-cuenta" element={<MiCuenta />} />
          </Route>
          <Route
            path="/recuperar-contrasena"
            element={<RecuperarContrasena />}
          />
          {/* HU-3 · Solo autores */}
          <Route element={<RutaProtegida rolesPermitidos={['autor', 'ambos']} />}>
            <Route path="/nuevo-trabajo" element={<NuevoTrabajo />} />
            <Route path="/nuevo-trabajo/coautores" element={<Coautores />} />
            <Route path="/mis-trabajos" element={<MisTrabajos />} />
          </Route>

          {/* HU-5 · Solo revisores */}
          <Route element={<RutaRevisor />}>
            <Route path="/revisor/bandeja" element={<BandejaRevisor />} />
            <Route
              path="/revisor/revision/:asignacionId"
              element={<FormularioEvaluacion />}
            />
          </Route>

          {/* Configuración y dictámenes · Solo comité */}
          <Route element={<RutaProtegida rolesPermitidos={['comite']} />}>
            <Route path="/comite/asignaciones" element={<AsignacionRevisores />} />
            <Route
              path="/comite/trabajos/:trabajoId/consolidado"
              element={<ConsolidadoTrabajo />}
            />
          </Route>

          {/* HU-6 */}
          <Route path="/programa" element={<ProgramaPublico />} />
          <Route path="*" element={<PaginaNoEncontrada />} />
        </Route>
      </Routes>
    </ProgramaProvider>
    </RevisionesProvider>
  );
}

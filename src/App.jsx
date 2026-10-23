import { Routes, Route } from 'react-router-dom';
import Layout from './shared/Layout';
import Inicio from './pages/Inicio';
import Portada from './pages/Portada';

// HU-1 · Cuenta y acceso
import Login from './hu1-cuenta/Login';
import Register from './hu1-cuenta/Register';
import Bienvenida from './hu1-cuenta/Bienvenida';
import RecuperarContrasena from './hu1-cuenta/RecuperarContrasena';
// HU-3 · Envío de trabajos
import { MisTrabajos, NuevoTrabajo } from './hu3-trabajos/Historia3';
// HU-2 · Configuración de la edición
import Historia2 from './hu2-edicion/Historia2';
import Historia2p2 from './hu2-edicion/Historia2p2';
import Historia2p3 from './hu2-edicion/Historia2p3';
import Historia2p4 from './hu2-edicion/Historia2p4';
import Historia2p5 from './hu2-edicion/Historia2p5';
// HU-4 · Asignación de revisiones
import Historia4 from './hu4-asignacion/Historia4';
// HU-5 · Revisión y dictamen
import BandejaRevisor from './hu5-revision/BandejaRevisor';

export default function App() {
  return (
    <Routes>
      {/* Portada del proyecto: índice de historias (diseño propio, sin header ni footer) */}
      <Route path="/portada" element={<Portada />} />

      {/* TODO: HU-2 y HU-4 todavía tienen su propio header.
          Cuando lo quiten, se mueven dentro del Layout. */}
      <Route path="/comite/edicion" element={<Historia2 />} />
      <Route path="/comite/edicion/ejes" element={<Historia2p2 />} />
      <Route path="/comite/edicion/tipos" element={<Historia2p3 />} />
      <Route path="/comite/asignaciones" element={<Historia4 />} />
      <Route path="/comite/edicion/fechas" element={<Historia2p4 />} />
      <Route path="/comite/edicion/criterios" element={<Historia2p5 />} />
      

      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />

        {/* HU-1 */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/bienvenida" element={<Bienvenida />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />

        {/* HU-3 */}
        <Route path="/autor/trabajos" element={<MisTrabajos />} />
        <Route path="/nuevo-trabajo" element={<NuevoTrabajo />} />

        {/* HU-5 */}
        <Route path="/revisor/bandeja" element={<BandejaRevisor />} />
      </Route>
    </Routes>
  );
}
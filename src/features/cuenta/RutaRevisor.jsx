import RutaProtegida from './RutaProtegida';

export default function RutaRevisor() {
  return <RutaProtegida rolesPermitidos={['revisor', 'ambos']} />;
}

import foto from '../assets/fotos/acceso-lateral.webp';
import isotipo from '../assets/marca/isotipo.svg';
import './DisenoAcceso.css';

// Marco común de las pantallas de cuenta: foto a la izquierda y el formulario a la derecha.
// Uso: <DisenoAcceso><div className="mi-formulario">…</div></DisenoAcceso>
// En celular la foto se oculta y queda solo el formulario.
export default function DisenoAcceso({ children }) {
  return (
    <div className="acceso">
      <aside className="acceso-foto" aria-hidden="true">
        <img src={foto} alt="" />
        <div className="acceso-foto-texto">
          <img src={isotipo} alt="" className="acceso-isotipo" />
          <p>VIII Congreso Académico Estudiantil</p>
          <span>Universidad de Lima · 12 y 13 de noviembre de 2026</span>
        </div>
      </aside>
      <div className="acceso-contenido">{children}</div>
    </div>
  );
}

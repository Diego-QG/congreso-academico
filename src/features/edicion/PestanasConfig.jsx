import { useNavigate } from 'react-router-dom';
import { PESTANAS } from './datosConfiguracion.js';

function PestanasConfig({ activa }) {
  const navigate = useNavigate();

  const irA = (e, ruta) => {
    e.preventDefault();
    if (ruta !== null) {
      navigate(ruta);
    }
  };

  return (
    <div className="pestanas">
      {PESTANAS.map((p) => (
        <a
          key={p.texto}
          href="#"
          className={p.texto === activa ? 'pestana activa' : 'pestana'}
          onClick={(e) => irA(e, p.ruta)}
        >
          {p.texto}
        </a>
      ))}
    </div>
  );
}

export default PestanasConfig;

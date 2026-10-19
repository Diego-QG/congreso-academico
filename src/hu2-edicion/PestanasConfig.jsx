import { useNavigate } from 'react-router-dom';

const PESTANAS = [
  { texto: 'Edición', ruta: '/comite/edicion' },
  { texto: 'Ejes temáticos', ruta: '/comite/edicion/ejes' },
  { texto: 'Tipos de trabajo', ruta: '/comite/edicion/tipos' },
  { texto: 'Fechas límite', ruta: '/comite/edicion/fechas' },
  { texto: 'Criterios de evaluación', ruta: null }, // todavía sin página
];

// Uso: <PestanasConfig activa="Ejes temáticos" />
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

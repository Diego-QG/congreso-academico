import { useNavigate } from 'react-router-dom';
import './Portada.css';

function Portada() {
  const navigate = useNavigate();
  const ir = (e, ruta) => {
    e.preventDefault();
    if (ruta) navigate(ruta);
  };

  return (
    <div className="portada-pagina">
      <div className="portada-container">
        <div className="panel-izquierdo">
          <div className="cabecera-izq">
            <div className="logo-c">C</div>
            <p className="universidad">UNIVERSIDAD DE LIMA</p>
            <p className="curso">PROGRAMACIÓN WEB</p>
          </div>
        </div>

        <div className="panel-derecho">
          <div className="contenido-principal">
            <p className="tema">TEMA 6</p>
            <h1 className="titulo-principal">
              Congreso académico
              <br />
              estudiantil
            </h1>
            <hr className="linea-dorada" />
            <p className="descripcion-proyecto">
              Plataforma web para gestionar el envío y la revisión de los trabajos de un congreso académico estudiantil: configuración de la edición, recepción de trabajos, asignación de revisores, dictamen y programa.
            </p>
          </div>

          <div className="historias-roles">
            <hr className="linea-separadora" />
            <div className="grid-historias">
              <a href="#" className="btn-enlace" onClick={(e) => ir(e, '/')}>Historia 1 - Cuenta y acceso</a>
              <a href="#" className="btn-enlace" onClick={(e) => ir(e, '/revisor/bandeja')}>Historia 5 - Revisión y dictamen</a>
              <a href="#" className="btn-enlace" onClick={(e) => ir(e, '/comite/edicion')}>Historia 2 - Configuración de la edición</a>
              <a href="#" className="btn-enlace" onClick={(e) => ir(e, '/programa')}>Historia 6 - Programa del congreso</a>
              <a href="#" className="btn-enlace" onClick={(e) => ir(e)}>Historia 3 - Envío de trabajos</a>
              <a href="#" className="btn-enlace" onClick={(e) => ir(e)}>Historia 7 - Métricas y usuarios</a>
              <a href="#" className="btn-enlace" onClick={(e) => ir(e, '/comite/asignaciones')}>Historia 4 - Asignación de revisiones</a>

              <div className="roles-container">
                Roles:{' '}
                <a href="#" className="btn-rol" onClick={(e) => ir(e)}>visitante</a>
                {', '}
                <a href="#" className="btn-rol" onClick={(e) => ir(e)}>autor</a>
                {', '}
                <a href="#" className="btn-rol" onClick={(e) => ir(e, '/revisor/bandeja')}>revisor</a>
                {' y '}
                <a href="#" className="btn-rol" onClick={(e) => ir(e)}>comité</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portada;
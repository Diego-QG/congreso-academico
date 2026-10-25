// Pie de página del módulo del comité
function PieComite() {
  const evitarSalto = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="pie">
      <div className="contenedor">
        <div className="pie-columnas">
          <div>
            <p className="pie-marca">Congreso Académico Estudiantil</p>
            <p>Universidad de Lima · Edición 2026</p>
            <p>Encuentro anual de investigación estudiantil.</p>
          </div>
          <div>
            <p className="pie-titulo">COMITÉ</p>
            <p><a href="#" onClick={evitarSalto}>Configuración</a></p>
            <p><a href="#" onClick={evitarSalto}>Revisores</a></p>
            <p><a href="#" onClick={evitarSalto}>Seguimiento</a></p>
          </div>
          <div>
            <p className="pie-titulo">AYUDA</p>
            <p><a href="#" onClick={evitarSalto}>Manual del comité</a></p>
            <p><a href="#" onClick={evitarSalto}>Contacto</a></p>
          </div>
        </div>
        <div className="pie-legal">
          <div className="pie-legal-interno">
            <span>© 2026 Congreso Académico Estudiantil</span>
            <span>Universidad de Lima</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PieComite;

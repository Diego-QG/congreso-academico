function PieComite() {
  const evitarSalto = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="pie">
      <div className="contenedor pie-columnas">
        <div>
          <p className="pie-marca">Congreso Académico Estudiantil</p>
          <p>Facultad de Ingeniería · Universidad de Lima. Av. Javier Prado Este 4600, Santiago de Surco, Lima.</p>
        </div>
        <div>
          <h4 className="pie-titulo">EL CONGRESO</h4>
          <p><a href="#" onClick={evitarSalto}>Bases y requisitos</a></p>
          <p><a href="#" onClick={evitarSalto}>Ejes temáticos</a></p>
          <p><a href="#" onClick={evitarSalto}>Programa</a></p>
        </div>
        <div>
          <h4 className="pie-titulo">PARTICIPANTES</h4>
          <p><a href="#" onClick={evitarSalto}>Guía para autores</a></p>
          <p><a href="#" onClick={evitarSalto}>Guía para revisores</a></p>
          <p><a href="#" onClick={evitarSalto}>Preguntas frecuentes</a></p>
        </div>
        <div>
          <h4 className="pie-titulo">CONTACTO</h4>
          <p>congreso@ulima.edu.pe</p>
          <p>(01) 437 6767 anexo 30450</p>
        </div>
      </div>
      <div className="pie-legal">
        <div className="contenedor pie-legal-interno">
          <span>© 2026 Universidad de Lima. Todos los derechos reservados.</span>
          <span>
            <a href="#" onClick={evitarSalto}>Términos de uso</a> &nbsp;
            <a href="#" onClick={evitarSalto}>Política de privacidad</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default PieComite;

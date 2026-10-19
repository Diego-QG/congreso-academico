import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function MisTrabajos({ trabajos = [] }) {
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const trabajosFiltrados = trabajos.filter((tr) => {
    const coincideEstado = filtroEstado === 'Todos' || tr.estado === filtroEstado;
    const coincideBusqueda =
      tr.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      tr.codigo.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

  return (
    <div className="app-container">
      {/* Aviso de fecha límite compartido (Mockup 3.1, 3.3) */}
      <div style={{ backgroundColor: '#F6E9EC', padding: '12px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '500' }}>
          Recepción abierta. Cierra el 30/09/2026 a las 23:59.
        </span>
        <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '600' }}>
          Faltan 12 días - 04:11 h
        </span>
      </div>

      <div style={{ padding: '30px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'Source Serif 4, serif', fontSize: '24px', color: 'var(--color-text)' }}>
              Mis trabajos
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {trabajos.length} trabajos registrados como autora o coautora
            </p>
          </div>
          <Link to="/nuevo-trabajo" className="btn-primary" style={{ textDecoration: 'none' }}>
            Nuevo trabajo
          </Link>
        </div>

        {trabajos.length === 0 ? (
          /* Estado vacío exacto de la historia 3 (Mockup 3.6) */
          <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <div className="logo-box" style={{ margin: '0 auto 16px auto', borderRadius: '50%' }}>!</div>
            <h3 style={{ fontFamily: 'Source Serif 4, serif', fontSize: '18px', marginBottom: '8px' }}>
              Todavía no tiene trabajos registrados
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Registre su trabajo antes del 30/09/2026 a las 23:59. Puede guardarlo como borrador y completarlo después.
            </p>
            <Link to="/nuevo-trabajo" className="btn-primary" style={{ textDecoration: 'none' }}>
              Registrar mi primer trabajo
            </Link>
          </div>
        ) : (
          /* Listado con filtros y tarjetas de trabajo (Mockup 3.3) */
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Todos', 'Borrador', 'En revisión', 'Aceptado', 'Rechazado'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFiltroEstado(st)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: filtroEstado === st ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                      color: filtroEstado === st ? 'var(--color-primary)' : 'var(--color-text)',
                      borderRadius: '2px',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Buscar por título o código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ padding: '6px 12px', border: '1px solid var(--color-border)', borderRadius: '2px', width: '260px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {trabajosFiltrados.map((tr) => (
                <div key={tr.codigo} style={{ border: '1px solid var(--color-border)', padding: '20px', backgroundColor: 'var(--color-surface)', borderRadius: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)' }}>{tr.codigo}</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '2px', backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                      {tr.estado}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Source Serif 4, serif', fontSize: '16px', marginBottom: '8px', color: 'var(--color-text)' }}>
                    {tr.titulo}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                    {tr.autores}
                  </p>
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Enviado el {tr.fechaEnvio}</span>
                    <Link to={`/trabajos/${tr.codigo}`} style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>
                      Ver detalle →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


export function NuevoTrabajo() {
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'Artículo completo',
    eje: '',
    resumen: '',
    palabrasClave: '',
    enlace: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="app-container">
      {/* Aviso superior de fecha límite */}
      <div style={{ backgroundColor: '#F6E9EC', padding: '12px 40px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', color: 'var(--color-primary)' }}>Recepción abierta. Cierra el 30/09/2026 a las 23:59.</span>
        <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '600' }}>Faltan 12 días - 04:11 h</span>
      </div>

      <div style={{ padding: '30px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'Source Serif 4, serif', fontSize: '24px' }}>Nuevo trabajo</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Paso {paso} de 3 — {paso === 1 ? 'Datos generales' : 'Coautores'}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary">Guardar como borrador</button>
            {paso === 1 ? (
              <button onClick={() => setPaso(2)} className="btn-primary">Continuar a coautores</button>
            ) : (
              <button className="btn-primary">Enviar al comité</button>
            )}
          </div>
        </div>

        {paso === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>TÍTULO DEL TRABAJO *</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '2px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>TIPO DE TRABAJO *</label>
                  <select name="tipo" value={formData.tipo} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '2px', fontSize: '14px' }}>
                    <option value="Artículo completo">Artículo completo</option>
                    <option value="Resumen extendido">Resumen extendido</option>
                    <option value="Póster">Póster</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>EJE TEMÁTICO *</label>
                  <select name="eje" value={formData.eje} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '2px', fontSize: '14px' }}>
                    <option value="">Seleccione un eje</option>
                    <option value="Inteligencia artificial y datos">Inteligencia artificial y datos</option>
                    <option value="Ingeniería de software">Ingeniería de software</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>RESUMEN *</label>
                <textarea
                  name="resumen"
                  rows="4"
                  value={formData.resumen}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '2px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>ENLACE AL DOCUMENTO *</label>
                <input
                  type="url"
                  name="enlace"
                  placeholder="https://"
                  value={formData.enlace}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '2px', fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Panel de requisitos según Mockup 3.1 */}
            <div style={{ backgroundColor: 'var(--color-bg)', padding: '20px', border: '1px solid var(--color-border)', height: 'fit-content', borderRadius: '2px' }}>
              <h4 style={{ fontSize: '13px', color: 'var(--color-text)', marginBottom: '8px', fontWeight: '600' }}>REQUISITOS DEL TIPO ELEGIDO</h4>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                Artículo completo · hasta 8 000 palabras · PDF con plantilla IEEE · admite hasta 4 coautores[cite: 113].
              </p>
            </div>
          </div>
        )}

        {paso === 2 && (
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', fontFamily: 'Source Serif 4, serif' }}>Coautores declarados</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '8px' }}>NOMBRE COMPLETO</th>
                  <th style={{ padding: '8px' }}>CORREO</th>
                  <th style={{ padding: '8px' }}>INSTITUCIÓN</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                  <td style={{ padding: '10px' }}>Rosa María Quispe Ttito</td>
                  <td style={{ padding: '10px', color: 'var(--color-text-muted)' }}>rosa.quispe@aloe.ulima.edu.pe</td>
                  <td style={{ padding: '10px', color: 'var(--color-text-muted)' }}>Universidad de Lima</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
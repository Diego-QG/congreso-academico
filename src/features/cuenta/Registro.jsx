import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FotoAcceso } from '../../shared/DisenoAcceso';
import './Registro.css';

function getPasswordRequirements(password, confirmPassword) {
  return [
    { label: 'Mínimo 8 caracteres', isMet: password.length >= 8 },
    { label: 'Al menos una mayúscula', isMet: /[A-Z]/.test(password) },
    { label: 'Al menos un número', isMet: /\d/.test(password) },
    {
      label: 'La confirmación debe coincidir',
      isMet: confirmPassword.length > 0 && confirmPassword === password
    }
  ];
}

function validateRegistration(formData) {
  const errors = {};
  const institutionalEmailPattern = /^[^\s@]+@aloe\.ulima\.edu\.pe$/i;
  const passwordRequirements = getPasswordRequirements(
    formData.password,
    formData.confirmPassword
  );

  if (!formData.nombres.trim()) {
    errors.nombres = 'Este campo es obligatorio.';
  }

  if (!formData.apellidos.trim()) {
    errors.apellidos = 'Este campo es obligatorio.';
  }

  if (!institutionalEmailPattern.test(formData.email.trim())) {
    errors.email = 'Use un correo institucional válido (@aloe.ulima.edu.pe).';
  }

  if (!formData.institucion) {
    errors.institucion = 'Seleccione una institución.';
  }

  if (passwordRequirements.slice(0, 3).some((requirement) => !requirement.isMet)) {
    errors.password = formData.password
      ? 'La contraseña no cumple todos los requisitos.'
      : 'Este campo es obligatorio.';
  }

  if (!passwordRequirements[3].isMet) {
    errors.confirmPassword = formData.confirmPassword
      ? 'Las contraseñas no coinciden.'
      : 'Este campo es obligatorio.';
  }

  if (!formData.carrera) {
    errors.carrera = 'Seleccione una carrera.';
  }

  if (!formData.rolParticipacion) {
    errors.rolParticipacion = 'Seleccione cómo desea participar.';
  }

  if (!formData.aceptaBases) {
    errors.aceptaBases = 'Debe aceptar las bases para continuar.';
  }

  return errors;
}

function Registro() {
  const [formData, setFormData] = useState({
    nombres: 'Rosa María',
    apellidos: 'Quispe Ttito',
    email: 'rosa.quispe@aloe.ulima.edu.pe',
    institucion: 'Universidad de Lima',
    password: '',
    confirmPassword: '',
    carrera: 'Ingeniería de Sistemas',
    codigoAlumno: '20211547',
    rolParticipacion: 'autor', // 'autor', 'revisor' o 'ambos'
    aceptaBases: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const passwordRequirements = getPasswordRequirements(
    formData.password,
    formData.confirmPassword
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
    setFormData(updatedFormData);
    if (Object.keys(errors).length > 0) {
      setErrors(validateRegistration(updatedFormData));
    }
  };

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateRegistration(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const registration = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      email: formData.email,
      institucion: formData.institucion,
      carrera: formData.carrera,
      codigoAlumno: formData.codigoAlumno,
      rolParticipacion: formData.rolParticipacion
    };
    window.sessionStorage.setItem(
      'congreso.participante',
      JSON.stringify(registration)
    );
    navigate('/bienvenida', { state: { registration } });
  };

  return (
    <div className="login-app-container">

      {/* --- CONTENIDO PRINCIPAL: REGISTRO DE PARTICIPANTE --- */}
      <main className="register-main-section">
        <div className="register-layout-grid">
          
          {/* Columna Izquierda: Formulario de Registro */}
          <div className="register-card">
            <h1 className="register-title">Registro de participante</h1>
            <p className="register-subtitle">
              Los campos marcados con asterisco (*) son obligatorios.
            </p>

            <form className="register-form" onSubmit={handleSubmit} noValidate>
              {Object.keys(errors).length > 0 && (
                <div className="register-error-banner" role="alert">
                  Revise {Object.keys(errors).length} campo
                  {Object.keys(errors).length === 1 ? '' : 's'} con errores antes de continuar.
                </div>
              )}
              
              {/* Nombres y Apellidos */}
              <div className="form-row-two-cols">
                <div className="form-group">
                  <label htmlFor="nombres">NOMBRES *</label>
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    required
                    className={errors.nombres ? 'input-field-error' : ''}
                    aria-invalid={Boolean(errors.nombres)}
                  />
                  {errors.nombres && <span className="field-error-message">{errors.nombres}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="apellidos">APELLIDOS *</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    className={errors.apellidos ? 'input-field-error' : ''}
                    aria-invalid={Boolean(errors.apellidos)}
                  />
                  {errors.apellidos && <span className="field-error-message">{errors.apellidos}</span>}
                </div>
              </div>

              {/* Correo Institucional */}
              <div className="form-group">
                <label htmlFor="email">CORREO INSTITUCIONAL *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={errors.email ? 'input-field-error' : ''}
                  aria-invalid={Boolean(errors.email)}
                />
                <span className={errors.email ? 'field-error-message' : 'field-help-text'}>
                  {errors.email || 'Se usará para todas las notificaciones.'}
                </span>
              </div>

              {/* Institución */}
              <div className="form-group">
                <label htmlFor="institucion">INSTITUCIÓN *</label>
                <select
                  id="institucion"
                  name="institucion"
                  value={formData.institucion}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(errors.institucion)}
                  className={errors.institucion ? 'input-field-error' : ''}
                >
                  <option value="Universidad de Lima">Universidad de Lima</option>
                  <option value="Otra Institución">Otra Institución</option>
                </select>
                {errors.institucion && <span className="field-error-message">{errors.institucion}</span>}
              </div>

              {/* Contraseñas en dos columnas */}
              <div className="form-row-two-cols">
                <div className="form-group">
                  <label htmlFor="password">CONTRASEÑA *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={errors.password ? 'input-field-error' : ''}
                      aria-invalid={Boolean(errors.password)}
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  <span className={errors.password ? 'field-error-message' : 'field-help-text'}>
                    {errors.password || 'Mínimo 8 caracteres, con una mayúscula y un número.'}
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">CONFIRMAR CONTRASEÑA *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={errors.confirmPassword ? 'input-field-error' : ''}
                      aria-invalid={Boolean(errors.confirmPassword)}
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="field-error-message">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              {/* Carrera y Código de Alumno */}
              <div className="form-row-two-cols">
                <div className="form-group">
                  <label htmlFor="carrera">CARRERA *</label>
                  <select
                    id="carrera"
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleChange}
                    required
                    aria-invalid={Boolean(errors.carrera)}
                    className={errors.carrera ? 'input-field-error' : ''}
                  >
                    <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                    <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                    <option value="Administración">Administración</option>
                    <option value="Economía">Economía</option>
                  </select>
                  {errors.carrera && <span className="field-error-message">{errors.carrera}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="codigoAlumno">CÓDIGO DE ALUMNO</label>
                  <input
                    type="text"
                    id="codigoAlumno"
                    name="codigoAlumno"
                    value={formData.codigoAlumno}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Deseo participar como (Radio buttons) */}
              <div className="form-group">
                <label className="section-radio-title">DESEO PARTICIPAR COMO *</label>
                <div className="radio-options-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="rolParticipacion"
                      value="autor"
                      checked={formData.rolParticipacion === 'autor'}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.rolParticipacion)}
                    />
                    <div>
                      <strong>Autor</strong>
                      <span>Enviaré uno o más trabajos.</span>
                    </div>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="rolParticipacion"
                      value="revisor"
                      checked={formData.rolParticipacion === 'revisor'}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.rolParticipacion)}
                    />
                    <div>
                      <strong>Revisor</strong>
                      <span>Evaluaré trabajos asignados.</span>
                    </div>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="rolParticipacion"
                      value="ambos"
                      checked={formData.rolParticipacion === 'ambos'}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.rolParticipacion)}
                    />
                    <div>
                      <strong>Ambos</strong>
                      <span>Autor y revisor.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="register-footer-actions">
                {/* Checkbox Acepto bases */}
                <div className="form-group checkbox-bases">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="aceptaBases"
                      checked={formData.aceptaBases}
                      onChange={handleChange}
                      required
                      aria-invalid={Boolean(errors.aceptaBases)}
                    />
                    <span>Acepto las bases del congreso y el tratamiento de mis datos.</span>
                  </label>
                  {errors.aceptaBases && (
                    <span className="field-error-message">{errors.aceptaBases}</span>
                  )}
                </div>

                {/* Acciones del formulario */}
                <div className="register-actions">
                  <button
                    type="button"
                    className="btn-cancel-register"
                    onClick={() => navigate('/')}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit-register">
                    Crear mi cuenta
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* Columna Derecha: Panel informativo lateral */}
          <aside className="register-info-sidebar">
            <FotoAcceso className="register-foto" />
            <div className="info-sidebar-box">
              <h3>Antes de registrarse</h3>
              <p>
                La recepción de trabajos cierra el <strong>30/09/2026 a las 23:59</strong>. Después de esa fecha no será posible editar los envíos.
              </p>
              <p>
                Si participa como revisor, deberá declarar sus líneas de interés para recibir asignaciones sin conflicto.
              </p>
            </div>
            <div className="password-requirements-box" aria-live="polite">
              <h3>Requisitos de la contraseña</h3>
              <ul>
                {passwordRequirements.map(({ label, isMet }) => (
                  <li
                    className={isMet ? 'password-requirement met' : 'password-requirement'}
                    key={label}
                  >
                    <span className="password-requirement-icon" aria-hidden="true">
                      {isMet ? '✓' : '×'}
                    </span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

        </div>
      </main>

    </div>
  );
}

export default Registro;
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DisenoAcceso from "../../shared/DisenoAcceso";
import "./InicioSesion.css";

function InicioSesion() {
  const location = useLocation();
  const [email, setEmail] = useState(
    location.state?.email || "rosa.quispe@aloe.ulima.edu.pe"
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(
    Boolean(location.state?.passwordUpdated)
  );
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    // Aquí simulamos que las credenciales ingresadas son incorrectas
    // y mostramos la alerta de error (Página 7 del mockup)
    setHasError(true);
  };

  return (
    <div className="login-app-container">

      {/* --- SECCIÓN PRINCIPAL DE INICIO DE SESIÓN --- */}
      <section className="login-main-section">
        <DisenoAcceso>
        <div className="login-card">
          <h1 className="login-title">Inicio de sesión</h1>

          {passwordUpdated && (
            <div className="login-success-banner" role="status">
              La contraseña se actualizó correctamente. Inicie sesión con su nueva contraseña.
            </div>
          )}

          {/* Subtítulo normal: solo se muestra si NO hay error */}
          {!hasError && (
            <p className="login-subtitle">
              Ingrese con su correo institucional para enviar o revisar
              trabajos.
            </p>
          )}

          {/* ALERTA DE ERROR GENERAL: Se muestra RECIÉN cuando hasError cambia a true */}
          {hasError && (
            <div className="alert-error-banner">
              <span className="alert-icon">!</span>
              <p>
                El correo o la contraseña no son correctos. Le quedan 3 intentos
                antes del bloqueo temporal.
              </p>
            </div>
          )}

          {/* Al enviar el formulario se llama a handleSubmit */}
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Campo: Correo Institucional */}
            <div className="form-group">
              <label htmlFor="email">CORREO INSTITUCIONAL</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (hasError) setHasError(false); // Limpia el error al escribir
                  if (passwordUpdated) setPasswordUpdated(false);
                }}
                placeholder="usuario@aloe.ulima.edu.pe"
                required
              />
            </div>

            {/* Campo: Contraseña */}
            <div className="form-group">
              <label htmlFor="password">CONTRASEÑA</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (hasError) setHasError(false); // Limpia el error al escribir
                    if (passwordUpdated) setPasswordUpdated(false);
                  }}
                  className={hasError ? "input-field-error" : ""}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              {/* MENSAJE EN LÍNEA DEBAJO DEL INPUT (Solo cuando hay error) */}
              {hasError && (
                <span className="field-error-message">
                  Verifique su contraseña.
                </span>
              )}
            </div>

            {/* Checkbox y Opciones */}
            <div className="login-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Recordarme en este equipo</span>
              </label>
              <Link
                to="/recuperar-contrasena"
                state={{ email }}
                className="forgot-password-link"
              >
                ¿Olvidó su contraseña?
              </Link>
            </div>

            {/* Botón Submit: Al presionar activa el handleSubmit */}
            <button type="submit" className="btn-submit-login">
              Ingresar
            </button>
          </form>

          {/* Registro link */}
          <div className="login-register-prompt">
            <span>¿No tiene cuenta? </span>
            <Link to="/registro" className="register-link">
              Registrarse como participante
            </Link>
          </div>
        </div>
        </DisenoAcceso>
      </section>

    </div>
  );
}

export default InicioSesion;

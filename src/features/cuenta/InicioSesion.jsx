import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DisenoAcceso from "../../shared/DisenoAcceso";
import {
  getParticipantHome,
  signIn,
  startCommitteeDemoSession
} from "../../shared/cuentaServicio";
import "./InicioSesion.css";

function InicioSesion() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(
    location.state?.email || "rosa.quispe@aloe.ulima.edu.pe"
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [credentialsInvalid, setCredentialsInvalid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStartingDemo, setIsStartingDemo] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(
    Boolean(location.state?.passwordUpdated)
  );
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setCredentialsInvalid(false);
    setIsSubmitting(true);
    try {
      const participant = await signIn(email, password, rememberMe);
      if (!participant) {
        setCredentialsInvalid(true);
        setErrorMessage("El correo o la contraseña no son correctos.");
        return;
      }
      navigate(getParticipantHome(participant), {
        replace: true,
        state: { registration: participant }
      });
    } catch {
      setErrorMessage("No se pudo validar el acceso. Inténtelo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCommitteeDemo = () => {
    setErrorMessage("");
    setCredentialsInvalid(false);
    setIsStartingDemo(true);
    try {
      const participant = startCommitteeDemoSession(rememberMe);
      navigate(getParticipantHome(participant), {
        replace: true,
        state: { registration: participant }
      });
    } catch {
      setErrorMessage("No se pudo iniciar el acceso de demostración. Inténtelo nuevamente.");
    } finally {
      setIsStartingDemo(false);
    }
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

          {!errorMessage && (
            <p className="login-subtitle">
              Ingrese con su correo institucional para enviar o revisar
              trabajos.
            </p>
          )}

          {errorMessage && (
            <div className="alert-error-banner" role="alert">
              <span className="alert-icon">!</span>
              <p>{errorMessage}</p>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">CORREO INSTITUCIONAL</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) {
                    setErrorMessage("");
                    setCredentialsInvalid(false);
                  }
                  if (passwordUpdated) setPasswordUpdated(false);
                }}
                autoComplete="username"
                placeholder="usuario@aloe.ulima.edu.pe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">CONTRASEÑA</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) {
                      setErrorMessage("");
                      setCredentialsInvalid(false);
                    }
                    if (passwordUpdated) setPasswordUpdated(false);
                  }}
                  className={credentialsInvalid ? "input-field-error" : ""}
                  autoComplete="current-password"
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

              {credentialsInvalid && (
                <span className="field-error-message">
                  Verifique su contraseña.
                </span>
              )}
            </div>

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

            <button type="submit" className="btn-submit-login" disabled={isSubmitting}>
              {isSubmitting ? "Validando..." : "Ingresar"}
            </button>
          </form>

          <div className="login-demo-access">
            <p>¿Necesita revisar la configuración de la edición?</p>
            <button
              className="login-demo-button"
              disabled={isSubmitting || isStartingDemo}
              onClick={handleCommitteeDemo}
              type="button"
            >
              {isStartingDemo ? "Abriendo demostración..." : "Entrar como comité"}
            </button>
            <small>Acceso local de demostración; no usar en producción.</small>
          </div>

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

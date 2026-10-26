import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import DisenoAcceso from '../../shared/DisenoAcceso';
import './RecuperarContrasena.css';

const RECOVERY_TOKEN_KEY = 'demo-password-recovery-token';
const RECOVERY_EMAIL_KEY = 'demo-password-recovery-email';
const RECOVERY_EXPIRATION_KEY = 'demo-password-recovery-expiration';
const RECOVERY_TOKEN_LIFETIME = 30 * 60 * 1000;

function checkPasswordRequirements(password, confirmPassword) {
  return [
    { label: 'Mínimo 8 caracteres', isMet: password.length >= 8 },
    { label: 'Al menos una mayúscula', isMet: /[A-Z]/.test(password) },
    { label: 'Al menos un número', isMet: /\d/.test(password) },
    {
      label: 'Las contraseñas coinciden',
      isMet: confirmPassword.length > 0 && confirmPassword === password
    }
  ];
}

export default function RecuperarContrasena() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [recoveryToken, setRecoveryToken] = useState(
    () => window.sessionStorage.getItem(RECOVERY_TOKEN_KEY) || ''
  );
  const [email, setEmail] = useState(
    () => location.state?.email || window.sessionStorage.getItem(RECOVERY_EMAIL_KEY) || ''
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [resendSeconds, setResendSeconds] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const passwordRequirements = checkPasswordRequirements(newPassword, confirmNewPassword);
  const isRecoveryTokenValid = Boolean(
    token &&
    token === recoveryToken &&
    Number(window.sessionStorage.getItem(RECOVERY_EXPIRATION_KEY)) > Date.now()
  );
  const isNewPasswordStep = isRecoveryTokenValid;
  const isSentStep = hasSubmitted && !isNewPasswordStep;
  const meetsPasswordRequirements = passwordRequirements.slice(0, 3).every(
    (requirement) => requirement.isMet
  );

  useEffect(() => {
    if (!hasSubmitted || resendSeconds === 0) {
      return undefined;
    }

    const countdown = window.setTimeout(() => {
      setResendSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(countdown);
  }, [hasSubmitted, resendSeconds]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@aloe\.ulima\.edu\.pe$/i.test(normalizedEmail)) {
      setError('Ingrese un correo institucional válido (@aloe.ulima.edu.pe).');
      setHasSubmitted(false);
      return;
    }

    const newToken = window.crypto.randomUUID();
    const expiresAt = Date.now() + RECOVERY_TOKEN_LIFETIME;
    window.sessionStorage.setItem(RECOVERY_TOKEN_KEY, newToken);
    window.sessionStorage.setItem(RECOVERY_EMAIL_KEY, normalizedEmail);
    window.sessionStorage.setItem(RECOVERY_EXPIRATION_KEY, String(expiresAt));
    setRecoveryToken(newToken);
    setEmail(normalizedEmail);
    setError('');
    setResendSeconds(120);
    setHasSubmitted(true);
  };

  const handleResend = () => {
    const newToken = window.crypto.randomUUID();
    window.sessionStorage.setItem(RECOVERY_TOKEN_KEY, newToken);
    window.sessionStorage.setItem(
      RECOVERY_EXPIRATION_KEY,
      String(Date.now() + RECOVERY_TOKEN_LIFETIME)
    );
    setRecoveryToken(newToken);
    setResendSeconds(120);
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    const updatedPassword = name === 'newPassword' ? value : newPassword;
    const updatedConfirmation = name === 'confirmNewPassword' ? value : confirmNewPassword;

    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmNewPassword') setConfirmNewPassword(value);
    if (Object.keys(passwordErrors).length > 0) {
      setPasswordErrors(validateNewPassword(updatedPassword, updatedConfirmation));
    }
  };

  const validateNewPassword = (password, confirmation) => {
    const requirements = checkPasswordRequirements(password, confirmation);
    const validationErrors = {};
    if (requirements.slice(0, 3).some((requirement) => !requirement.isMet)) {
      validationErrors.newPassword = 'La contraseña no cumple todos los requisitos.';
    }
    if (!requirements[3].isMet) {
      validationErrors.confirmNewPassword = 'Las contraseñas no coinciden.';
    }
    return validationErrors;
  };

  const handleSavePassword = (event) => {
    event.preventDefault();
    const validationErrors = validateNewPassword(newPassword, confirmNewPassword);
    setPasswordErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    window.sessionStorage.removeItem(RECOVERY_TOKEN_KEY);
    window.sessionStorage.removeItem(RECOVERY_EMAIL_KEY);
    window.sessionStorage.removeItem(RECOVERY_EXPIRATION_KEY);
    navigate('/login', { state: { email, passwordUpdated: true } });
  };

  const formattedResendTime = `${String(Math.floor(resendSeconds / 60)).padStart(2, '0')}:${String(resendSeconds % 60).padStart(2, '0')}`;

  return (
    <section className="password-recovery-section">
      <DisenoAcceso>
      <section className="password-recovery-card">
        <ol className="recovery-progress" aria-label="Pasos para recuperar la contraseña">
          <li className={!isSentStep && !isNewPasswordStep ? 'current' : 'complete'}>1. Correo</li>
          <li className={isSentStep ? 'current' : isNewPasswordStep ? 'complete' : ''}>2. Envío</li>
          <li className={isNewPasswordStep ? 'current' : ''}>3. Nueva contraseña</li>
        </ol>

        {token && !isRecoveryTokenValid ? (
          <div className="recovery-confirmation">
            <h1>Enlace inválido o vencido</h1>
            <p>Solicite un nuevo enlace para crear su contraseña.</p>
            <Link to="/recuperar-contrasena" className="recovery-back-button">
              Solicitar otro enlace
            </Link>
          </div>
        ) : isNewPasswordStep ? (
          <div className="new-password-step">
            <h1>Cree su nueva contraseña</h1>
            <p className="recovery-description">
              La nueva contraseña reemplaza a la anterior en todos sus dispositivos.
            </p>
            <form className="recovery-form" onSubmit={handleSavePassword} noValidate>
              <div className="recovery-field">
                <label htmlFor="new-password">Nueva contraseña</label>
                <div className="recovery-password-wrapper">
                  <input
                    id="new-password"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    aria-invalid={Boolean(passwordErrors.newPassword)}
                    className={passwordErrors.newPassword ? 'recovery-input-error' : meetsPasswordRequirements ? 'recovery-input-success' : ''}
                    required
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <span className={passwordErrors.newPassword ? 'recovery-error' : meetsPasswordRequirements ? 'recovery-password-match' : 'recovery-help'}>
                  {passwordErrors.newPassword || (meetsPasswordRequirements ? 'La contraseña cumple los requisitos.' : 'Mínimo 8 caracteres, con una mayúscula y un número.')}
                </span>
              </div>
              <div className="recovery-field">
                <label htmlFor="confirm-new-password">Confirmar nueva contraseña</label>
                <input
                  id="confirm-new-password"
                  name="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  aria-invalid={Boolean(passwordErrors.confirmNewPassword)}
                  className={passwordErrors.confirmNewPassword ? 'recovery-input-error' : passwordRequirements[3].isMet ? 'recovery-input-success' : ''}
                  required
                />
                <span className={passwordErrors.confirmNewPassword ? 'recovery-error' : passwordRequirements[3].isMet ? 'recovery-password-match' : 'recovery-help'}>
                  {passwordErrors.confirmNewPassword || (passwordRequirements[3].isMet ? 'Las contraseñas coinciden.' : 'Vuelva a escribir la nueva contraseña.')}
                </span>
              </div>
              <button type="submit" className="recovery-send-button">Guardar y entrar</button>
            </form>
          </div>
        ) : isSentStep ? (
          <div className="recovery-confirmation">
            <div className="recovery-success-banner" role="status">
              <span className="recovery-success-icon" aria-hidden="true">✓</span>
              <p>Enviamos el enlace de recuperación a {email}.</p>
            </div>
            <h1>Revise su correo</h1>
            <p>
              El enlace vence en 30 minutos. Si no lo encuentra, revise la carpeta de correo no deseado antes de solicitar uno nuevo.
            </p>
            <div className="recovery-resend-actions">
              <button
                type="button"
                className="recovery-back-button recovery-resend-button"
                onClick={handleResend}
                disabled={resendSeconds > 0}
              >
                Reenviar enlace
              </button>
              {resendSeconds > 0 && (
                <span>Podrá reenviarlo en {formattedResendTime} min</span>
              )}
              {resendSeconds === 0 && (
                <span>Puede solicitar un nuevo enlace.</span>
              )}
            </div>
            <Link
              to={`/recuperar-contrasena?token=${encodeURIComponent(recoveryToken)}`}
              className="recovery-login-link"
            >
              Abrir enlace de recuperación (simulación)
            </Link>
            <Link to="/login" className="recovery-login-link">
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            <h1>Recuperar contraseña</h1>
            <p className="recovery-description">
              Ingrese el correo con el que se registró. Le enviaremos un enlace para crear una nueva contraseña.
            </p>
            <form className="recovery-form" onSubmit={handleSubmit} noValidate>
              <div className="recovery-field">
                <label htmlFor="recovery-email">Correo institucional</label>
                <input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError('');
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'recovery-email-error' : 'recovery-email-help'}
                  autoComplete="email"
                  required
                />
                {error ? (
                  <span className="recovery-error" id="recovery-email-error">{error}</span>
                ) : (
                  <span className="recovery-help" id="recovery-email-help">El enlace vence en 30 minutos.</span>
                )}
              </div>
              <div className="recovery-actions">
                <button type="submit" className="recovery-send-button">Enviar enlace</button>
                <Link to="/login" className="recovery-back-button">Volver</Link>
              </div>
            </form>
          </>
        )}
      </section>
      </DisenoAcceso>
    </section>
  );
}

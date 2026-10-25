import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import './MiCuenta.css';

const STORAGE_KEY = 'congreso.participante';
const INTEREST_LINES = [
  'Inteligencia artificial y datos',
  'Ingeniería de software',
  'Innovación y emprendimiento',
  'Sostenibilidad y ciudad',
  'Salud y sociedad',
  'Economía y mercados'
];

function readRegistration(locationState) {
  return locationState?.registration
    || JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || 'null');
}

export default function MiCuenta() {
  const location = useLocation();
  const registration = readRegistration(location.state);

  if (!registration) {
    return <Navigate to="/registro" replace />;
  }

  return <AccountForm registration={registration} />;
}

function AccountForm({ registration }) {
  const canReview = ['revisor', 'ambos'].includes(registration.rolParticipacion);
  const [profile, setProfile] = useState({
    nombres: registration.nombres || '',
    apellidos: registration.apellidos || '',
    email: registration.email || '',
    institucion: registration.institucion || ''
  });
  const [selectedInterests, setSelectedInterests] = useState([
    ...(registration.lineasInteres || [
      'Inteligencia artificial y datos',
      'Ingeniería de software',
      'Innovación y emprendimiento'
    ])
  ]);
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: ''
  });
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = (event) => {
    event.preventDefault();
    const updatedRegistration = {
      ...registration,
      ...profile,
      lineasInteres: selectedInterests
    };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRegistration));
    setMessage('Los cambios de su perfil se guardaron correctamente.');
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((current) => (
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    ));
  };

  const updatePassword = (event) => {
    event.preventDefault();
    if (!passwords.current || passwords.next.length < 8
      || !/[A-Z]/.test(passwords.next) || !/\d/.test(passwords.next)) {
      setPasswordMessage('Ingrese su contraseña actual y una nueva contraseña de 8 caracteres, con una mayúscula y un número.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordMessage('La confirmación no coincide con la nueva contraseña.');
      return;
    }
    setPasswordMessage('Datos validados. La actualización real requiere conexión con el servicio de cuentas.');
  };

  return (
    <section className="account-page">
      <div className="account-heading">
        <div>
          <h1>Mi cuenta</h1>
          <p>Datos personales, líneas de interés y seguridad.</p>
        </div>
        <button className="account-save-button" type="submit" form="account-profile-form">
          Guardar cambios
        </button>
      </div>

      <div className="account-grid">
        <div className="account-main-column">
          <form
            className="account-card account-profile-card"
            id="account-profile-form"
            onSubmit={saveProfile}
          >
            <h2>Datos personales</h2>
            {message && <p className="account-feedback" role="status">{message}</p>}
            <div className="account-field-grid">
              <label className="account-field">
                <span>NOMBRES</span>
                <input name="nombres" value={profile.nombres} onChange={handleProfileChange} required />
              </label>
              <label className="account-field">
                <span>APELLIDOS</span>
                <input name="apellidos" value={profile.apellidos} onChange={handleProfileChange} required />
              </label>
              <label className="account-field">
                <span>CORREO INSTITUCIONAL</span>
                <input value={profile.email} readOnly />
                <small>Para cambiarlo, escriba al comité organizador.</small>
              </label>
              <label className="account-field">
                <span>INSTITUCIÓN</span>
                <input name="institucion" value={profile.institucion} onChange={handleProfileChange} required />
              </label>
            </div>
          </form>

          {canReview && (
            <section className="account-card account-interests-card">
              <div className="account-card-heading">
                <h2>Líneas de interés como revisor</h2>
                <span>{selectedInterests.length} de {INTEREST_LINES.length} seleccionadas</span>
              </div>
              <p>Las asignaciones priorizan sus líneas declaradas.</p>
              <div className="interest-options">
                {INTEREST_LINES.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`interest-option${isSelected ? ' selected' : ''}`}
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      type="button"
                    >
                      {interest}{isSelected && <span aria-hidden="true"> ✓</span>}
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <aside className="account-side-column">
          <form className="account-card password-card" onSubmit={updatePassword}>
            <h2>Cambiar contraseña</h2>
            <label className="account-field">
              <span>CONTRASEÑA ACTUAL</span>
              <input
                autoComplete="current-password"
                onChange={(event) => setPasswords({ ...passwords, current: event.target.value })}
                type="password"
                value={passwords.current}
                required
              />
            </label>
            <label className="account-field">
              <span>NUEVA CONTRASEÑA</span>
              <input
                autoComplete="new-password"
                onChange={(event) => setPasswords({ ...passwords, next: event.target.value })}
                type="password"
                value={passwords.next}
                required
              />
              <small>Mínimo 8 caracteres, con una mayúscula y un número.</small>
            </label>
            <label className="account-field">
              <span>CONFIRMAR NUEVA CONTRASEÑA</span>
              <input
                autoComplete="new-password"
                onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })}
                type="password"
                value={passwords.confirm}
                required
              />
            </label>
            {passwordMessage && (
              <p className="account-feedback" role="status">{passwordMessage}</p>
            )}
            <button className="password-update-button" type="submit">
              Actualizar contraseña
            </button>
          </form>

          <section className="account-card activity-card">
            <h2>Mi actividad</h2>
            <dl>
              <div><dt>Revisiones asignadas</dt><dd>6</dd></div>
              <div><dt>Revisiones entregadas</dt><dd>4</dd></div>
              <div><dt>Pendientes</dt><dd>2</dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </section>
  );
}

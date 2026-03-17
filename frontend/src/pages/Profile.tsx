import React, { useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paths } from '../routes/paths';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { PasswordStrengthBar } from '../design-system/components/PasswordStrengthBar';
import '../styles/Profile.css';
import {
  PHONE_HINT,
  PHONE_PATTERN,
  collectFormValidationErrors,
  updateSingleFieldError
} from '../utils/formValidation';

type Tab = 'personal' | 'animale' | 'activitate' | 'securitate';
type Message = { type: 'success' | 'error'; text: string } | null;

const ACTIVITY_ICONS: Record<string, string> = {
  adoptie:     '🐾',
  donatie:     '💜',
  voluntariat: '🤝',
  postare:     '📝',
};

const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const passwordFormRef = useRef<HTMLFormElement | null>(null);
  const emailFormRef = useRef<HTMLFormElement | null>(null);
  const phoneFormRef = useRef<HTMLFormElement | null>(null);

  // ── Parolă ──
  const [passwordDraft, setPasswordDraft] = useState({ newPassword: '', confirmPassword: '' });
  const [pwMessage, setPwMessage] = useState<Message>(null);
  const [pwFieldErrors, setPwFieldErrors] = useState<Record<string, string>>({});
  const passwordValidation = usePasswordValidation(passwordDraft.newPassword);

  // ── Email ──
  const [emailMessage, setEmailMessage] = useState<Message>(null);
  const [emailFieldErrors, setEmailFieldErrors] = useState<Record<string, string>>({});

  // ── Telefon ──
  const [phoneMessage, setPhoneMessage] = useState<Message>(null);
  const [phoneFieldErrors, setPhoneFieldErrors] = useState<Record<string, string>>({});

  if (!currentUser) {
    return <Navigate to={paths.unauthorized} replace state={{ from: location.pathname }} />;
  }

  const initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();

  const handlePasswordFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setPwFieldErrors((prev) => updateSingleFieldError(e.target, prev));
    if (pwMessage) setPwMessage(null);
  };

  const handlePasswordInputChange = (field: 'newPassword' | 'confirmPassword') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordDraft((prev) => ({ ...prev, [field]: e.target.value }));
      if (pwMessage) setPwMessage(null);
    };

  const handleEmailFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setEmailFieldErrors((prev) => updateSingleFieldError(e.target, prev));
    if (emailMessage) setEmailMessage(null);
  };

  const handlePhoneFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setPhoneFieldErrors((prev) => updateSingleFieldError(e.target, prev));
    if (phoneMessage) setPhoneMessage(null);
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { errors, firstInvalidElement } = collectFormValidationErrors(e.currentTarget);
    setPwFieldErrors(errors);
    if (firstInvalidElement) {
      setPwMessage(null);
      firstInvalidElement.focus();
      return;
    }
    const submittedData = new FormData(e.currentTarget);
    const currentPassword = String(submittedData.get('currentPassword') ?? '');
    const newPassword = String(submittedData.get('newPassword') ?? '');
    const confirmPassword = String(submittedData.get('confirmPassword') ?? '');
    if (!passwordValidation.isValid) {
      setPwMessage({ type: 'error', text: 'Parola nouă nu respectă cerințele de securitate.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMessage({ type: 'error', text: 'Parolele nu coincid.' });
      return;
    }
    if (currentPassword !== currentUser.password) {
      setPwMessage({ type: 'error', text: 'Parola curentă este incorectă.' });
      return;
    }
    setPwMessage({ type: 'success', text: '✓ Parola a fost schimbată cu succes!' });
    passwordFormRef.current?.reset();
    setPasswordDraft({ newPassword: '', confirmPassword: '' });
    setPwFieldErrors({});
  };

  const handleEmailChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { errors, firstInvalidElement } = collectFormValidationErrors(e.currentTarget);
    setEmailFieldErrors(errors);
    if (firstInvalidElement) {
      setEmailMessage(null);
      firstInvalidElement.focus();
      return;
    }
    const submittedData = new FormData(e.currentTarget);
    const newEmail = String(submittedData.get('newEmail') ?? '');
    const confirmEmail = String(submittedData.get('confirmEmail') ?? '');

    if (newEmail !== confirmEmail) {
      setEmailMessage({ type: 'error', text: 'Emailurile nu coincid.' });
      return;
    }
    if (newEmail === currentUser.username) {
      setEmailMessage({ type: 'error', text: 'Noul email este același cu cel curent.' });
      return;
    }
    setEmailMessage({ type: 'success', text: '✓ Emailul a fost actualizat cu succes!' });
    emailFormRef.current?.reset();
    setEmailFieldErrors({});
  };

  const handlePhoneChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { errors, firstInvalidElement } = collectFormValidationErrors(e.currentTarget);
    setPhoneFieldErrors(errors);
    if (firstInvalidElement) {
      setPhoneMessage(null);
      firstInvalidElement.focus();
      return;
    }
    const submittedData = new FormData(e.currentTarget);
    const newPhone = String(submittedData.get('newPhone') ?? '');
    const confirmPhone = String(submittedData.get('confirmPhone') ?? '');

    if (newPhone !== confirmPhone) {
      setPhoneMessage({ type: 'error', text: 'Numerele nu coincid.' });
      return;
    }
    if (newPhone === currentUser.phone) {
      setPhoneMessage({ type: 'error', text: 'Noul număr este același cu cel curent.' });
      return;
    }
    setPhoneMessage({ type: 'success', text: '✓ Numărul a fost actualizat cu succes!' });
    phoneFormRef.current?.reset();
    setPhoneFieldErrors({});
  };

  return (
    <div className="profile-container">

      {/* ── Sidebar ── */}
      <aside className="profile-sidebar">
        <div className="profile-avatar">
          <span className="profile-avatar-initials">{initials}</span>
        </div>
        <h2 className="profile-name">{currentUser.firstName} {currentUser.lastName}</h2>
        <p className="profile-role">{currentUser.role === 'admin' ? '🛡 Administrator' : '🐾 Adoptator'}</p>
        <p className="profile-joined">
          Membru din {new Date(currentUser.joinedAt).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
        </p>

        <nav className="profile-nav">
          {(['personal', 'animale', 'activitate', 'securitate'] as Tab[]).map((tab) => (
            <button
              key={tab}
              className={`profile-nav-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'personal'   && '👤 Date personale'}
              {tab === 'animale'    && '🐶 Animalele mele'}
              {tab === 'activitate' && '📋 Activitate'}
              {tab === 'securitate' && '🔒 Securitate'}
            </button>
          ))}
        </nav>

        <button
          className="profile-logout-btn"
          onClick={() => { logout(); navigate(paths.login); }}
        >
          Deconectare
        </button>
      </aside>

      {/* ── Content ── */}
      <main className="profile-content">

        {/* TAB: Date personale */}
        {activeTab === 'personal' && (
          <section className="profile-section">
            <h3 className="profile-section-title">Date personale</h3>
            <div className="profile-fields">
              <div className="profile-field">
                <label>Prenume</label>
                <p>{currentUser.firstName}</p>
              </div>
              <div className="profile-field">
                <label>Nume</label>
                <p>{currentUser.lastName}</p>
              </div>
              <div className="profile-field">
                <label>Email</label>
                <p>{currentUser.username}</p>
              </div>
              <div className="profile-field">
                <label>Telefon</label>
                <p>{currentUser.phone}</p>
              </div>
              <div className="profile-field profile-field--full">
                <label>Adresă</label>
                <p>{currentUser.address}</p>
              </div>
            </div>
          </section>
        )}

        {/* TAB: Animale */}
        {activeTab === 'animale' && (
          <section className="profile-section">
            <h3 className="profile-section-title">Animalele mele adoptate</h3>
            {currentUser.adoptedPets.length === 0 ? (
              <p className="profile-empty">Nu ai adoptat niciun animal încă. 🐾</p>
            ) : (
              <div className="pets-grid">
                {currentUser.adoptedPets.map((pet) => (
                  <div key={pet.id} className="pet-card">
                    <div className="pet-card-avatar">
                      {pet.species === 'câine' ? '🐶' : pet.species === 'pisică' ? '🐱' : '🐾'}
                    </div>
                    <div className="pet-card-info">
                      <h4>{pet.name}</h4>
                      <p>{pet.breed}</p>
                      <span className="pet-card-date">
                        Adoptat {new Date(pet.adoptedDate).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB: Activitate */}
        {activeTab === 'activitate' && (
          <section className="profile-section">
            <h3 className="profile-section-title">Istoricul activității</h3>
            {currentUser.activityLog.length === 0 ? (
              <p className="profile-empty">Nicio activitate înregistrată.</p>
            ) : (
              <ul className="activity-list">
                {currentUser.activityLog.map((item) => (
                  <li key={item.id} className="activity-item">
                    <span className="activity-icon">{ACTIVITY_ICONS[item.type] ?? '📌'}</span>
                    <div className="activity-info">
                      <p>{item.description}</p>
                      <span>
                        {new Date(item.date).toLocaleDateString('ro-RO', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* TAB: Securitate */}
        {activeTab === 'securitate' && (
          <section className="profile-section">
            <h3 className="profile-section-title">Securitate</h3>

            {/* ── Schimbare parolă ── */}
            <div className="security-block">
              <h4 className="security-block-title">🔒 Schimbare parolă</h4>
              <form ref={passwordFormRef} className="security-form" onSubmit={handlePasswordChange} noValidate>
                <div className="profile-form-group">
                  <label htmlFor="currentPassword">Parola curentă</label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    defaultValue=""
                    onBlur={handlePasswordFieldBlur}
                    placeholder="Introdu parola curentă"
                    required
                    className={pwFieldErrors.currentPassword ? 'field-invalid' : ''}
                    aria-invalid={Boolean(pwFieldErrors.currentPassword)}
                    aria-describedby={pwFieldErrors.currentPassword ? 'profile-currentPassword-error' : undefined}
                  />
                  {pwFieldErrors.currentPassword && (
                    <p className="validation-error" id="profile-currentPassword-error">
                      {pwFieldErrors.currentPassword}
                    </p>
                  )}
                </div>
                <div className="profile-form-group">
                  <label htmlFor="newPassword">Parola nouă</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordDraft.newPassword}
                    onChange={handlePasswordInputChange('newPassword')}
                    onBlur={handlePasswordFieldBlur}
                    placeholder="Min. 8 caractere"
                    required
                    className={pwFieldErrors.newPassword ? 'field-invalid' : ''}
                    aria-invalid={Boolean(pwFieldErrors.newPassword)}
                    aria-describedby={pwFieldErrors.newPassword ? 'profile-newPassword-error' : undefined}
                  />
                  {pwFieldErrors.newPassword && (
                    <p className="validation-error" id="profile-newPassword-error">
                      {pwFieldErrors.newPassword}
                    </p>
                  )}
                  <PasswordStrengthBar
                    validation={passwordValidation}
                    password={passwordDraft.newPassword}
                  />
                </div>
                <div className="profile-form-group">
                  <label htmlFor="confirmPassword">Confirmă parola nouă</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordDraft.confirmPassword}
                    onChange={handlePasswordInputChange('confirmPassword')}
                    onBlur={handlePasswordFieldBlur}
                    placeholder="Repetă parola nouă"
                    required
                    className={pwFieldErrors.confirmPassword ? 'field-invalid' : ''}
                    aria-invalid={Boolean(pwFieldErrors.confirmPassword)}
                    aria-describedby={pwFieldErrors.confirmPassword ? 'profile-confirmPassword-error' : undefined}
                  />
                  {pwFieldErrors.confirmPassword && (
                    <p className="validation-error" id="profile-confirmPassword-error">
                      {pwFieldErrors.confirmPassword}
                    </p>
                  )}
                  {passwordDraft.confirmPassword && (
                    <p
                      className={`password-match-hint ${
                        passwordDraft.newPassword === passwordDraft.confirmPassword ? 'match' : 'no-match'
                      }`}
                    >
                      {passwordDraft.newPassword === passwordDraft.confirmPassword
                        ? '✓ Parolele coincid'
                        : '✗ Parolele nu coincid'}
                    </p>
                  )}
                </div>
                {pwMessage && (
                  <p className={`security-message security-message--${pwMessage.type}`}>
                    {pwMessage.text}
                  </p>
                )}
                <button
                  type="submit"
                  className="security-submit-btn"
                  disabled={
                    !passwordValidation.isValid ||
                    passwordDraft.newPassword !== passwordDraft.confirmPassword
                  }
                >
                  Salvează parola
                </button>
              </form>
            </div>

            <div className="security-divider" />

            {/* ── Schimbare email ── */}
            <div className="security-block">
              <h4 className="security-block-title">✉️ Schimbare email</h4>
              <form ref={emailFormRef} className="security-form" onSubmit={handleEmailChange} noValidate>
                <div className="profile-form-group">
                  <label htmlFor="currentEmail">Email curent</label>
                  <input
                    id="currentEmail"
                    type="text"
                    value={currentUser.username}
                    disabled
                    className="input-disabled"
                  />
                </div>
                <div className="profile-form-group">
                  <label htmlFor="newEmail">Email nou</label>
                  <input
                    id="newEmail"
                    name="newEmail"
                    type="email"
                    defaultValue=""
                    onBlur={handleEmailFieldBlur}
                    placeholder="email_nou@exemplu.com"
                    required
                    className={emailFieldErrors.newEmail ? 'field-invalid' : ''}
                    aria-invalid={Boolean(emailFieldErrors.newEmail)}
                    aria-describedby={emailFieldErrors.newEmail ? 'profile-newEmail-error' : undefined}
                  />
                  {emailFieldErrors.newEmail && (
                    <p className="validation-error" id="profile-newEmail-error">{emailFieldErrors.newEmail}</p>
                  )}
                </div>
                <div className="profile-form-group">
                  <label htmlFor="confirmEmail">Confirmă emailul nou</label>
                  <input
                    id="confirmEmail"
                    name="confirmEmail"
                    type="email"
                    defaultValue=""
                    onBlur={handleEmailFieldBlur}
                    placeholder="Repetă emailul nou"
                    required
                    className={emailFieldErrors.confirmEmail ? 'field-invalid' : ''}
                    aria-invalid={Boolean(emailFieldErrors.confirmEmail)}
                    aria-describedby={emailFieldErrors.confirmEmail ? 'profile-confirmEmail-error' : undefined}
                  />
                  {emailFieldErrors.confirmEmail && (
                    <p className="validation-error" id="profile-confirmEmail-error">{emailFieldErrors.confirmEmail}</p>
                  )}
                </div>
                {emailMessage && (
                  <p className={`security-message security-message--${emailMessage.type}`}>
                    {emailMessage.text}
                  </p>
                )}
                <button
                  type="submit"
                  className="security-submit-btn"
                >
                  Salvează emailul
                </button>
              </form>
            </div>

            <div className="security-divider" />

            {/* ── Schimbare telefon ── */}
            <div className="security-block">
              <h4 className="security-block-title">📱 Schimbare număr de telefon</h4>
              <form ref={phoneFormRef} className="security-form" onSubmit={handlePhoneChange} noValidate>
                <div className="profile-form-group">
                  <label htmlFor="currentPhone">Număr curent</label>
                  <input
                    id="currentPhone"
                    type="text"
                    value={currentUser.phone}
                    disabled
                    className="input-disabled"
                  />
                </div>
                <div className="profile-form-group">
                  <label htmlFor="newPhone">Număr nou</label>
                  <input
                    id="newPhone"
                    name="newPhone"
                    type="tel"
                    defaultValue=""
                    onBlur={handlePhoneFieldBlur}
                    placeholder="+373 69 000 000"
                    required
                    pattern={PHONE_PATTERN}
                    title={PHONE_HINT}
                    inputMode="numeric"
                    autoComplete="tel"
                    className={phoneFieldErrors.newPhone ? 'field-invalid' : ''}
                    aria-invalid={Boolean(phoneFieldErrors.newPhone)}
                    aria-describedby={phoneFieldErrors.newPhone ? 'profile-newPhone-error' : undefined}
                  />
                  {phoneFieldErrors.newPhone && (
                    <p className="validation-error" id="profile-newPhone-error">{phoneFieldErrors.newPhone}</p>
                  )}
                </div>
                <div className="profile-form-group">
                  <label htmlFor="confirmPhone">Confirmă numărul nou</label>
                  <input
                    id="confirmPhone"
                    name="confirmPhone"
                    type="tel"
                    defaultValue=""
                    onBlur={handlePhoneFieldBlur}
                    placeholder="Repetă numărul"
                    required
                    pattern={PHONE_PATTERN}
                    title={PHONE_HINT}
                    inputMode="numeric"
                    autoComplete="tel"
                    className={phoneFieldErrors.confirmPhone ? 'field-invalid' : ''}
                    aria-invalid={Boolean(phoneFieldErrors.confirmPhone)}
                    aria-describedby={phoneFieldErrors.confirmPhone ? 'profile-confirmPhone-error' : undefined}
                  />
                  {phoneFieldErrors.confirmPhone && (
                    <p className="validation-error" id="profile-confirmPhone-error">{phoneFieldErrors.confirmPhone}</p>
                  )}
                </div>
                {phoneMessage && (
                  <p className={`security-message security-message--${phoneMessage.type}`}>
                    {phoneMessage.text}
                  </p>
                )}
                <button
                  type="submit"
                  className="security-submit-btn"
                >
                  Salvează numărul
                </button>
              </form>
            </div>

          </section>
        )}

      </main>
    </div>
  );
};

export default Profile;

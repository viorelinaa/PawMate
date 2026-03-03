import React, { useState } from 'react';
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

  // ── Parolă ──
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [pwMessage, setPwMessage] = useState<Message>(null);
  const [pwFieldErrors, setPwFieldErrors] = useState<Record<string, string>>({});
  const passwordValidation = usePasswordValidation(passwords.newPass);

  // ── Email ──
  const [emailData, setEmailData] = useState({ newEmail: '', confirmEmail: '' });
  const [emailMessage, setEmailMessage] = useState<Message>(null);
  const [emailFieldErrors, setEmailFieldErrors] = useState<Record<string, string>>({});

  // ── Telefon ──
  const [phoneData, setPhoneData] = useState({ newPhone: '', confirmPhone: '' });
  const [phoneMessage, setPhoneMessage] = useState<Message>(null);
  const [phoneFieldErrors, setPhoneFieldErrors] = useState<Record<string, string>>({});

  if (!currentUser) {
    return <Navigate to={paths.unauthorized} replace state={{ from: location.pathname }} />;
  }

  const initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();

  const handlePasswordInputChange = (field: 'current' | 'newPass' | 'confirm') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswords({ ...passwords, [field]: e.target.value });
      setPwFieldErrors((prev) => updateSingleFieldError(e.target, prev));
      if (pwMessage) setPwMessage(null);
    };

  const handleEmailInputChange = (field: 'newEmail' | 'confirmEmail') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmailData({ ...emailData, [field]: e.target.value });
      setEmailFieldErrors((prev) => updateSingleFieldError(e.target, prev));
      if (emailMessage) setEmailMessage(null);
    };

  const handlePhoneInputChange = (field: 'newPhone' | 'confirmPhone') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhoneData({ ...phoneData, [field]: e.target.value });
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
    if (!passwordValidation.isValid) {
      setPwMessage({ type: 'error', text: 'Parola nouă nu respectă cerințele de securitate.' });
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPwMessage({ type: 'error', text: 'Parolele nu coincid.' });
      return;
    }
    if (passwords.current !== currentUser.password) {
      setPwMessage({ type: 'error', text: 'Parola curentă este incorectă.' });
      return;
    }
    setPwMessage({ type: 'success', text: '✓ Parola a fost schimbată cu succes!' });
    setPasswords({ current: '', newPass: '', confirm: '' });
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
    if (emailData.newEmail !== emailData.confirmEmail) {
      setEmailMessage({ type: 'error', text: 'Emailurile nu coincid.' });
      return;
    }
    if (emailData.newEmail === currentUser.username) {
      setEmailMessage({ type: 'error', text: 'Noul email este același cu cel curent.' });
      return;
    }
    setEmailMessage({ type: 'success', text: '✓ Emailul a fost actualizat cu succes!' });
    setEmailData({ newEmail: '', confirmEmail: '' });
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
    if (phoneData.newPhone !== phoneData.confirmPhone) {
      setPhoneMessage({ type: 'error', text: 'Numerele nu coincid.' });
      return;
    }
    if (phoneData.newPhone === currentUser.phone) {
      setPhoneMessage({ type: 'error', text: 'Noul număr este același cu cel curent.' });
      return;
    }
    setPhoneMessage({ type: 'success', text: '✓ Numărul a fost actualizat cu succes!' });
    setPhoneData({ newPhone: '', confirmPhone: '' });
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
              <form className="security-form" onSubmit={handlePasswordChange} noValidate>
                <div className="profile-form-group">
                  <label htmlFor="currentPassword">Parola curentă</label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwords.current}
                    onChange={handlePasswordInputChange('current')}
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
                    value={passwords.newPass}
                    onChange={handlePasswordInputChange('newPass')}
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
                    password={passwords.newPass}
                  />
                </div>
                <div className="profile-form-group">
                  <label htmlFor="confirmPassword">Confirmă parola nouă</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwords.confirm}
                    onChange={handlePasswordInputChange('confirm')}
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
                  {passwords.confirm && (
                    <p className={`password-match-hint ${passwords.newPass === passwords.confirm ? 'match' : 'no-match'}`}>
                      {passwords.newPass === passwords.confirm ? '✓ Parolele coincid' : '✗ Parolele nu coincid'}
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
                    !passwords.current ||
                    !passwordValidation.isValid ||
                    passwords.newPass !== passwords.confirm
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
              <form className="security-form" onSubmit={handleEmailChange} noValidate>
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
                    value={emailData.newEmail}
                    onChange={handleEmailInputChange('newEmail')}
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
                    value={emailData.confirmEmail}
                    onChange={handleEmailInputChange('confirmEmail')}
                    placeholder="Repetă emailul nou"
                    required
                    className={emailFieldErrors.confirmEmail ? 'field-invalid' : ''}
                    aria-invalid={Boolean(emailFieldErrors.confirmEmail)}
                    aria-describedby={emailFieldErrors.confirmEmail ? 'profile-confirmEmail-error' : undefined}
                  />
                  {emailFieldErrors.confirmEmail && (
                    <p className="validation-error" id="profile-confirmEmail-error">{emailFieldErrors.confirmEmail}</p>
                  )}
                  {emailData.confirmEmail && (
                    <p className={`password-match-hint ${emailData.newEmail === emailData.confirmEmail ? 'match' : 'no-match'}`}>
                      {emailData.newEmail === emailData.confirmEmail ? '✓ Emailurile coincid' : '✗ Emailurile nu coincid'}
                    </p>
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
                  disabled={
                    !emailData.newEmail ||
                    emailData.newEmail !== emailData.confirmEmail ||
                    emailData.newEmail === currentUser.username
                  }
                >
                  Salvează emailul
                </button>
              </form>
            </div>

            <div className="security-divider" />

            {/* ── Schimbare telefon ── */}
            <div className="security-block">
              <h4 className="security-block-title">📱 Schimbare număr de telefon</h4>
              <form className="security-form" onSubmit={handlePhoneChange} noValidate>
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
                    value={phoneData.newPhone}
                    onChange={handlePhoneInputChange('newPhone')}
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
                    value={phoneData.confirmPhone}
                    onChange={handlePhoneInputChange('confirmPhone')}
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
                  {phoneData.confirmPhone && (
                    <p className={`password-match-hint ${phoneData.newPhone === phoneData.confirmPhone ? 'match' : 'no-match'}`}>
                      {phoneData.newPhone === phoneData.confirmPhone ? '✓ Numerele coincid' : '✗ Numerele nu coincid'}
                    </p>
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
                  disabled={
                    !phoneData.newPhone ||
                    phoneData.newPhone !== phoneData.confirmPhone ||
                    phoneData.newPhone === currentUser.phone
                  }
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

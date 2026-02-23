import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paths } from '../routes/paths';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { PasswordStrengthBar } from '../design-system/components/PasswordStrengthBar';
import '../styles/Profile.css';

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
  const [activeTab, setActiveTab] = useState<Tab>('personal');

  // ── Parolă ──
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [pwMessage, setPwMessage] = useState<Message>(null);
  const passwordValidation = usePasswordValidation(passwords.newPass);

  // ── Email ──
  const [emailData, setEmailData] = useState({ newEmail: '', confirmEmail: '' });
  const [emailMessage, setEmailMessage] = useState<Message>(null);

  // ── Telefon ──
  const [phoneData, setPhoneData] = useState({ newPhone: '', confirmPhone: '' });
  const [phoneMessage, setPhoneMessage] = useState<Message>(null);

  if (!currentUser) {
    navigate(paths.login);
    return null;
  }

  const initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handlePhoneChange = (e: React.FormEvent) => {
    e.preventDefault();
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
              <form className="security-form" onSubmit={handlePasswordChange}>
                <div className="profile-form-group">
                  <label>Parola curentă</label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    placeholder="Introdu parola curentă"
                    required
                  />
                </div>
                <div className="profile-form-group">
                  <label>Parola nouă</label>
                  <input
                    type="password"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    placeholder="Min. 8 caractere"
                    required
                  />
                  <PasswordStrengthBar
                    validation={passwordValidation}
                    password={passwords.newPass}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Confirmă parola nouă</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Repetă parola nouă"
                    required
                  />
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
              <form className="security-form" onSubmit={handleEmailChange}>
                <div className="profile-form-group">
                  <label>Email curent</label>
                  <input
                    type="text"
                    value={currentUser.username}
                    disabled
                    className="input-disabled"
                  />
                </div>
                <div className="profile-form-group">
                  <label>Email nou</label>
                  <input
                    type="email"
                    value={emailData.newEmail}
                    onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                    placeholder="email_nou@exemplu.com"
                    required
                  />
                </div>
                <div className="profile-form-group">
                  <label>Confirmă emailul nou</label>
                  <input
                    type="email"
                    value={emailData.confirmEmail}
                    onChange={(e) => setEmailData({ ...emailData, confirmEmail: e.target.value })}
                    placeholder="Repetă emailul nou"
                    required
                  />
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
              <form className="security-form" onSubmit={handlePhoneChange}>
                <div className="profile-form-group">
                  <label>Număr curent</label>
                  <input
                    type="text"
                    value={currentUser.phone}
                    disabled
                    className="input-disabled"
                  />
                </div>
                <div className="profile-form-group">
                  <label>Număr nou</label>
                  <input
                    type="tel"
                    value={phoneData.newPhone}
                    onChange={(e) => setPhoneData({ ...phoneData, newPhone: e.target.value })}
                    placeholder="+373 69 000 000"
                    required
                  />
                </div>
                <div className="profile-form-group">
                  <label>Confirmă numărul nou</label>
                  <input
                    type="tel"
                    value={phoneData.confirmPhone}
                    onChange={(e) => setPhoneData({ ...phoneData, confirmPhone: e.target.value })}
                    placeholder="Repetă numărul"
                    required
                  />
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
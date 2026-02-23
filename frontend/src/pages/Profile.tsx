import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paths } from '../routes/paths';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { PasswordStrengthBar } from '../design-system/components/PasswordStrengthBar';
import '../styles/Profile.css';

type Tab = 'personal' | 'animale' | 'activitate' | 'securitate';

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

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const passwordValidation = usePasswordValidation(passwords.newPass);

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
    setPwMessage({ type: 'success', text: 'Parola a fost schimbată cu succes!' });
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  return (
    <div className="profile-container">

      {/* ── Sidebar stânga ── */}
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

      {/* ── Conținut dreapta ── */}
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
            <h3 className="profile-section-title">Schimbare parolă</h3>
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
                  !passwordValidation.isValid ||
                  passwords.newPass !== passwords.confirm ||
                  !passwords.current
                }
              >
                Salvează parola
              </button>
            </form>
          </section>
        )}

      </main>
    </div>
  );
};

export default Profile;
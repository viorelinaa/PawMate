import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { paths } from "../routes/paths";
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';
import { UserRoundIcon } from "../components/UserRoundIcon";
import { ShieldUserIcon } from "../components/ShieldUserIcon";
import { EyeIcon } from "../components/EyeIcon";
import { EyeOffIcon } from "../components/EyeOffIcon";
import { AppButton } from "../components/AppButton";
import { collectFormValidationErrors, updateSingleFieldError } from "../utils/formValidation";

const DEMO = {
  user:  { username: 'user@pawmate.ro',  password: 'User1234!'  },
  admin: { username: 'admin@pawmate.ro', password: 'Admin1234!' },
};

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleRoleSwitch = (role: 'user' | 'admin') => {
    setSelectedRole(role);
    setError('');
    setFieldErrors({});
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFieldErrors((prev) => updateSingleFieldError(e.target, prev));
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { errors, firstInvalidElement } = collectFormValidationErrors(e.currentTarget);
    setFieldErrors(errors);
    if (firstInvalidElement) {
      setError('');
      firstInvalidElement.focus();
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    const ok = login(email, password);
    if (ok) {
      navigate(selectedRole === 'admin' ? paths.adminStatistici : paths.home);
    } else {
      setError('Email sau parolă incorecte.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>PawMate Login</h1>
          <p>Bine ai revenit!</p>
        </div>

        <div className="role-tabs">
          <AppButton
            type="button"
            className={`role-tab ${selectedRole === "user" ? "isSelected" : ""}`}
            variant="ghost"
            aria-pressed={selectedRole === "user"}
            onClick={() => handleRoleSwitch('user')}
          >
            <span className="role-tab-icon" aria-hidden="true">
              <UserRoundIcon size={18} />
            </span>
            <span>Utilizator</span>
          </AppButton>
          <AppButton
            type="button"
            className={`role-tab ${selectedRole === "admin" ? "isSelected" : ""}`}
            variant="ghost"
            aria-pressed={selectedRole === "admin"}
            onClick={() => handleRoleSwitch('admin')}
          >
            <span className="role-tab-icon" aria-hidden="true">
              <ShieldUserIcon size={18} />
            </span>
            <span>Admin</span>
          </AppButton>
        </div>
        <p className="role-selected">Ai ales: {selectedRole === "admin" ? "Admin" : "Utilizator"}</p>

        <div className="demo-card">
          <span className="demo-label">Date demo {selectedRole === 'admin' ? 'Admin' : 'Utilizator'}</span>
          <p><strong>Email:</strong> {DEMO[selectedRole].username}</p>
          <p><strong>Parolă:</strong> {DEMO[selectedRole].password}</p>
        </div>

        <form key={selectedRole} className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={DEMO[selectedRole].username}
              onBlur={handleFieldBlur}
              placeholder="email@example.com"
              required
              className={fieldErrors.email ? 'field-invalid' : ''}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            />
            {fieldErrors.email && (
              <p className="validation-error" id="login-email-error">{fieldErrors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Parolă</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                defaultValue={DEMO[selectedRole].password}
                onBlur={handleFieldBlur}
                placeholder="********"
                required
                className={fieldErrors.password ? 'field-invalid' : ''}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
                title={showPassword ? "Ascunde parola" : "Arată parola"}
              >
                {showPassword ? (
                  <EyeOffIcon size={18} aria-hidden="true" />
                ) : (
                  <EyeIcon size={18} aria-hidden="true" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="validation-error" id="login-password-error">{fieldErrors.password}</p>
            )}
          </div>

          {error && <p className="login-error">{error}</p>}

          <AppButton type="submit" className="login-button" variant="primary" fullWidth>
            Autentificare
          </AppButton>
        </form>

        <div className="signup-link">
          Nu ai cont? <Link to={paths.signup}>Înregistrează-te</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

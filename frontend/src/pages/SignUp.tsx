import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { paths } from "../routes/paths";
import '../styles/SignUp.css';
import { AppButton } from "../components/AppButton";
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { PasswordStrengthBar } from '../design-system/components/PasswordStrengthBar';
import {
  PHONE_HINT,
  PHONE_PATTERN,
  collectFormValidationErrors,
  updateSingleFieldError
} from "../utils/formValidation";

type UserType = 'adopter' | 'sitter';

const Signup: React.FC = () => {
  const [userType, setUserType] = useState<UserType>('adopter');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    acceptTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const passwordValidation = usePasswordValidation(formData.password);

  const passwordsMatch =
    formData.confirmPassword === '' || formData.password === formData.confirmPassword;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setFieldErrors((prev) => updateSingleFieldError(e.target, prev));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { errors, firstInvalidElement } = collectFormValidationErrors(e.currentTarget);
    setFieldErrors(errors);
    if (firstInvalidElement) {
      firstInvalidElement.focus();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Parolele nu coincid!');
      return;
    }

    if (!passwordValidation.isValid) {
      alert('Parola nu respectă toate cerințele de securitate!');
      return;
    }

    if (!formData.acceptTerms) {
      alert('Trebuie să accepți termenii și condițiile');
      return;
    }

    console.log('Signup data:', { ...formData, userType });
    // Aici vei adăuga logica de înregistrare
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <h1>🐾 Înregistrare PawMate</h1>
          <p>Alătură-te comunității noastre!</p>
        </div>

        <div className="user-type-selector">
          <div
            className={`user-type-option ${userType === 'adopter' ? 'active' : ''}`}
            onClick={() => setUserType('adopter')}
          >
            <h3>Adoptator</h3>
            <p>Vreau să adopt un animal</p>
          </div>
          <div
            className={`user-type-option ${userType === 'sitter' ? 'active' : ''}`}
            onClick={() => setUserType('sitter')}
          >
            <h3>Pet Sitter</h3>
            <p>Ofer servicii de îngrijire</p>
          </div>
        </div>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prenume</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Ion"
                required
                className={fieldErrors.firstName ? 'field-invalid' : ''}
                aria-invalid={Boolean(fieldErrors.firstName)}
                aria-describedby={fieldErrors.firstName ? 'signup-firstName-error' : undefined}
              />
              {fieldErrors.firstName && (
                <p className="validation-error" id="signup-firstName-error">{fieldErrors.firstName}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Nume</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Popescu"
                required
                className={fieldErrors.lastName ? 'field-invalid' : ''}
                aria-invalid={Boolean(fieldErrors.lastName)}
                aria-describedby={fieldErrors.lastName ? 'signup-lastName-error' : undefined}
              />
              {fieldErrors.lastName && (
                <p className="validation-error" id="signup-lastName-error">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
              required
              className={fieldErrors.email ? 'field-invalid' : ''}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
            />
            {fieldErrors.email && (
              <p className="validation-error" id="signup-email-error">{fieldErrors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefon</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+373 69 123 456"
              required
              pattern={PHONE_PATTERN}
              title={PHONE_HINT}
              inputMode="numeric"
              autoComplete="tel"
              className={fieldErrors.phone ? 'field-invalid' : ''}
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? 'signup-phone-error' : undefined}
            />
            {fieldErrors.phone && (
              <p className="validation-error" id="signup-phone-error">{fieldErrors.phone}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresă</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Chișinău, str. Exemple 1"
              required
              className={fieldErrors.address ? 'field-invalid' : ''}
              aria-invalid={Boolean(fieldErrors.address)}
              aria-describedby={fieldErrors.address ? 'signup-address-error' : undefined}
            />
            {fieldErrors.address && (
              <p className="validation-error" id="signup-address-error">{fieldErrors.address}</p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Parolă</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Min. 8 caractere"
                required
                className={fieldErrors.password ? 'field-invalid' : ''}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'signup-password-error' : undefined}
              />
              {fieldErrors.password && (
                <p className="validation-error" id="signup-password-error">{fieldErrors.password}</p>
              )}
              <PasswordStrengthBar
                validation={passwordValidation}
                password={formData.password}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmă parola</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Reintroduci parola"
                required
                className={fieldErrors.confirmPassword ? 'field-invalid' : ''}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={fieldErrors.confirmPassword ? 'signup-confirmPassword-error' : undefined}
              />
              {fieldErrors.confirmPassword && (
                <p className="validation-error" id="signup-confirmPassword-error">{fieldErrors.confirmPassword}</p>
              )}
              {formData.confirmPassword && (
                <p className={`password-match-hint ${passwordsMatch ? 'match' : 'no-match'}`}>
                  {passwordsMatch ? '✓ Parolele coincid' : '✗ Parolele nu coincid'}
                </p>
              )}
            </div>
          </div>

          <div className={`checkbox-group ${fieldErrors.acceptTerms ? 'field-invalid-block' : ''}`}>
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="acceptTerms">
              Accept <a href="/terms">termenii și condițiile</a>
            </label>
          </div>
          {fieldErrors.acceptTerms && (
            <p className="validation-error" id="signup-acceptTerms-error">{fieldErrors.acceptTerms}</p>
          )}

          <AppButton
            type="submit"
            className="signup-button"
            variant="primary"
            fullWidth
            disabled={
              !formData.acceptTerms ||
              !passwordValidation.isValid ||
              formData.password !== formData.confirmPassword
            }
          >
            Creează cont
          </AppButton>
        </form>

        <div className="login-link">
          Ai deja cont? <Link to={paths.login}>Autentifică-te</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { paths } from "../routes/paths";
import '../styles/SignUp.css';
import { AppButton } from "../components/AppButton";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Parolele nu coincid!');
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

        <form className="signup-form" onSubmit={handleSubmit}>
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
              />
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
              />
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
            />
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
            />
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
            />
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
                minLength={8}
                required
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
              />
            </div>
          </div>

          <div className="checkbox-group">
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

          <AppButton
            type="submit"
            className="signup-button"
            variant="primary"
            fullWidth
            disabled={!formData.acceptTerms}
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

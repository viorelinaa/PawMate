import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { paths } from "../routes/paths";

import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aici vei adăuga logica de autentificare
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🐾 PawMate Login</h1>
          <p>Bine ai revenit!</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Parolă</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Intră în cont
          </button>
        </form>

        <div className="signup-link">
          Nu ai cont? <Link to={paths.signup}>Înregistrează-te</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { paths } from "../routes/paths";
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const DEMO = {
  user:  { username: 'user@pawmate.ro',  password: 'User1234!'  },
  admin: { username: 'admin@pawmate.ro', password: 'Admin1234!' },
};

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');
  const [email, setEmail]       = useState(DEMO.user.username);
  const [password, setPassword] = useState(DEMO.user.password);
  const [error, setError]       = useState('');

  const handleRoleSwitch = (role: 'user' | 'admin') => {
    setSelectedRole(role);
    setEmail(DEMO[role].username);
    setPassword(DEMO[role].password);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email, password);
    if (ok) {
      navigate(paths.home);
    } else {
      setError('Email sau parolă incorecte.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🐾 PawMate Login</h1>
          <p>Bine ai revenit!</p>
        </div>

        <div className="role-tabs">
          <button
            type="button"
            className={`role-tab ${selectedRole === 'user' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('user')}
          >
            👤 Utilizator
          </button>
          <button
            type="button"
            className={`role-tab ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('admin')}
          >
            🔑 Admin
          </button>
        </div>

        <div className="demo-card">
          <span className="demo-label">Date demo {selectedRole === 'admin' ? 'Admin' : 'Utilizator'}</span>
          <p><strong>Email:</strong> {DEMO[selectedRole].username}</p>
          <p><strong>Parolă:</strong> {DEMO[selectedRole].password}</p>
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

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Autentificare
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
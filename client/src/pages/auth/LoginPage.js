import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sw-auth-page">
      <div className="sw-auth-card">
        <div className="sw-auth-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>SENAI</span>
            <span style={{ fontSize: '28px', fontWeight: 300, color: '#c7d5e0', letterSpacing: '-0.5px' }}>WORKS</span>
            <span style={{ display: 'inline-block', width: 10, height: 10, background: '#66c0f4', marginLeft: 2, marginBottom: 10 }}></span>
            <span style={{ display: 'inline-block', width: 10, height: 10, background: '#1b2838', border: '2px solid #66c0f4', marginBottom: 0 }}></span>
          </div>
        </div>
        <h2 className="sw-auth-title">Entrar na sua conta</h2>
        <p className="sw-auth-subtitle">Plataforma didática de publicação de jogos</p>

        {error && <div className="sw-error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="sw-form-group">
            <label className="sw-label">E-mail <span className="required">*</span></label>
            <input
              type="email"
              className="sw-input"
              placeholder="seunome@edu.sc.senai.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="sw-form-group">
            <label className="sw-label">Senha <span className="required">*</span></label>
            <input
              type="password"
              className="sw-input"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '14px', textAlign: 'right' }}>
            <Link to="/forgot-password" style={{ fontSize: '12px', color: '#66c0f4' }}>
              Esqueceu a senha?
            </Link>
          </div>
          <button type="submit" className="sw-btn sw-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Entrando...' : 'ENTRAR'}
          </button>
        </form>

        <div className="sw-auth-footer">
          Não tem uma conta? <Link to="/register">Criar conta</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

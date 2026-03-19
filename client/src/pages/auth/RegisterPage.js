import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SECURITY_QUESTIONS, ALLOWED_EMAIL_DOMAINS, PASSWORD_REGEX } from '../../config/constants';

const RegisterPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const domainValid = ALLOWED_EMAIL_DOMAINS.some(d => form.email.toLowerCase().endsWith(d));
    if (!domainValid) {
      return setError('E-mail deve pertencer aos domínios @edu.sc.senai.br ou @estudante.sesisenai.org.br.');
    }

    if (!PASSWORD_REGEX.test(form.password)) {
      return setError('Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.');
    }

    if (form.password !== form.confirmPassword) {
      return setError('As senhas não coincidem.');
    }

    if (!form.securityAnswer.trim()) {
      return setError('Resposta de segurança é obrigatória.');
    }

    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        securityQuestion: form.securityQuestion,
        securityAnswer: form.securityAnswer,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sw-auth-page">
      <div className="sw-auth-card" style={{ maxWidth: '500px' }}>
        <div className="sw-auth-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>SENAI</span>
            <span style={{ fontSize: '28px', fontWeight: 300, color: '#c7d5e0', letterSpacing: '-0.5px' }}>WORKS</span>
            <span style={{ display: 'inline-block', width: 10, height: 10, background: '#66c0f4', marginLeft: 2, marginBottom: 10 }}></span>
            <span style={{ display: 'inline-block', width: 10, height: 10, background: '#1b2838', border: '2px solid #66c0f4', marginBottom: 0 }}></span>
          </div>
        </div>
        <h2 className="sw-auth-title">Criar conta de desenvolvedor</h2>
        <p className="sw-auth-subtitle">Registre-se para submeter seu jogo na plataforma</p>

        {error && <div className="sw-error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="sw-form-group">
            <label className="sw-label">E-mail institucional <span className="required">*</span></label>
            <input
              type="email"
              name="email"
              className="sw-input"
              placeholder="seunome@edu.sc.senai.br"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div style={{ fontSize: '11px', color: '#8f98a0', marginTop: '2px' }}>
              Apenas domínios @edu.sc.senai.br ou @estudante.sesisenai.org.br
            </div>
          </div>
          <div className="sw-form-group">
            <label className="sw-label">Senha <span className="required">*</span></label>
            <input
              type="password"
              name="password"
              className="sw-input"
              placeholder="Mínimo 8 caracteres (A-Z, a-z, 0-9, especial)"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="sw-form-group">
            <label className="sw-label">Confirmar senha <span className="required">*</span></label>
            <input
              type="password"
              name="confirmPassword"
              className="sw-input"
              placeholder="Repita a senha"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="sw-form-group">
            <label className="sw-label">Pergunta de segurança <span className="required">*</span></label>
            <select
              name="securityQuestion"
              className="sw-select"
              value={form.securityQuestion}
              onChange={handleChange}
            >
              {SECURITY_QUESTIONS.map((q, i) => (
                <option key={i} value={q}>{q}</option>
              ))}
            </select>
          </div>
          <div className="sw-form-group">
            <label className="sw-label">Resposta de segurança <span className="required">*</span></label>
            <input
              type="text"
              name="securityAnswer"
              className="sw-input"
              placeholder="Sua resposta"
              value={form.securityAnswer}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="sw-btn sw-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Criando...' : 'CRIAR CONTA'}
          </button>
        </form>

        <div className="sw-auth-footer">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

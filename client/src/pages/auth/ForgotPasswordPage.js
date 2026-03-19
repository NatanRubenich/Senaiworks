import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { PASSWORD_REGEX } from '../../config/constants';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.getSecurityQuestion(email);
      setSecurityQuestion(res.data.securityQuestion);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao buscar pergunta de segurança.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!PASSWORD_REGEX.test(newPassword)) {
      return setError('Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.');
    }
    setLoading(true);
    try {
      await authAPI.verifySecurity({ email, securityAnswer, newPassword });
      setSuccess('Senha redefinida com sucesso!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sw-auth-page">
      <div className="sw-auth-card">
        <div className="sw-auth-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>SENAI</span>
            <span style={{ fontSize: '28px', fontWeight: 300, color: '#c7d5e0' }}>WORKS</span>
          </div>
        </div>
        <h2 className="sw-auth-title">Recuperar senha</h2>
        <p className="sw-auth-subtitle">Responda sua pergunta de segurança para redefinir a senha</p>

        {error && <div className="sw-error-box">{error}</div>}
        {success && <div className="sw-success-box">{success}</div>}

        {step === 1 && (
          <form onSubmit={handleGetQuestion}>
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
            <button type="submit" className="sw-btn sw-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Buscando...' : 'CONTINUAR'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <div className="sw-info-box">{securityQuestion}</div>
            <div className="sw-form-group">
              <label className="sw-label">Sua resposta <span className="required">*</span></label>
              <input
                type="text"
                className="sw-input"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
            </div>
            <div className="sw-form-group">
              <label className="sw-label">Nova senha <span className="required">*</span></label>
              <input
                type="password"
                className="sw-input"
                placeholder="Mínimo 8 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="sw-btn sw-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Redefinindo...' : 'REDEFINIR SENHA'}
            </button>
          </form>
        )}

        <div className="sw-auth-footer">
          <Link to="/login">Voltar ao login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

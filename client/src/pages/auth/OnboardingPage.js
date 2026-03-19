import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import Layout from '../../components/layout/Layout';
import { CPF_LENGTH, CNPJ_LENGTH, SWIFT_MIN, SWIFT_MAX } from '../../config/constants';

const OnboardingPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(
    !user?.identityCompleted ? 1 : !user?.taxCompleted ? 2 : 3
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Identity form
  const [identity, setIdentity] = useState({
    legalName: '', fullAddress: '', accountType: 'Pessoa Física',
    tradeName: '', cnpj: '', legalRepresentative: '', position: '',
  });

  // Tax form
  const [tax, setTax] = useState({ country: 'Brasil', tin: '' });

  // Bank form
  const [bank, setBank] = useState({ bankName: '', swiftCode: '', accountNumber: '' });

  const handleIdentitySubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!identity.legalName || !identity.fullAddress) {
      return setError('Nome Legal e Endereço são obrigatórios.');
    }
    if (identity.accountType === 'Pessoa Jurídica') {
      if (!identity.tradeName || !identity.cnpj || !identity.legalRepresentative || !identity.position) {
        return setError('Todos os campos de Pessoa Jurídica são obrigatórios.');
      }
      if (identity.cnpj.replace(/\D/g, '').length !== CNPJ_LENGTH) {
        return setError(`CNPJ fictício deve ter ${CNPJ_LENGTH} dígitos.`);
      }
    }
    setLoading(true);
    try {
      await userAPI.updateIdentity(identity);
      await refreshUser();
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaxSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const digits = tax.tin.replace(/\D/g, '');
    if (digits.length !== CPF_LENGTH && digits.length !== CNPJ_LENGTH) {
      return setError('Erro: Formato de CPF/CNPJ inválido.');
    }
    setLoading(true);
    try {
      await userAPI.updateTax(tax);
      await refreshUser();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar dados fiscais.');
    } finally {
      setLoading(false);
    }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!bank.bankName || !bank.swiftCode || !bank.accountNumber) {
      return setError('Todos os campos bancários são obrigatórios.');
    }
    if (bank.swiftCode.length < SWIFT_MIN || bank.swiftCode.length > SWIFT_MAX) {
      return setError(`Código SWIFT/IBAN deve ter entre ${SWIFT_MIN} e ${SWIFT_MAX} caracteres.`);
    }
    setLoading(true);
    try {
      await userAPI.updateBank(bank);
      await refreshUser();
      navigate('/pay-fee');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar dados bancários.');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['', 'Identidade do Desenvolvedor', 'Informações Fiscais Simuladas', 'Informações Bancárias Simuladas'];

  return (
    <Layout>
      <div className="sw-breadcrumb">SenaiWorks &gt; Cadastro &gt; {stepTitles[step]}</div>
      <h1 className="sw-page-title">Cadastro — Etapa {step} de 3: {stepTitles[step]}</h1>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: s <= step ? '#1a9fff' : '#2a475e',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {error && <div className="sw-error-box">{error}</div>}

      {/* Step 1: Identity */}
      {step === 1 && (
        <form onSubmit={handleIdentitySubmit}>
          <div className="sw-card">
            <h2 className="sw-section-title">Dados de Identidade</h2>
            <div className="sw-form-group">
              <label className="sw-label">Nome Legal / Razão Social <span className="required">*</span></label>
              <input type="text" className="sw-input" value={identity.legalName}
                onChange={e => setIdentity({ ...identity, legalName: e.target.value })} required />
            </div>
            <div className="sw-form-group">
              <label className="sw-label">Endereço Completo <span className="required">*</span></label>
              <input type="text" className="sw-input" value={identity.fullAddress}
                onChange={e => setIdentity({ ...identity, fullAddress: e.target.value })} required />
            </div>
            <div className="sw-form-group">
              <label className="sw-label">Tipo de Conta <span className="required">*</span></label>
              <select className="sw-select" value={identity.accountType}
                onChange={e => setIdentity({ ...identity, accountType: e.target.value })}>
                <option value="Pessoa Física">Pessoa Física</option>
                <option value="Pessoa Jurídica">Pessoa Jurídica</option>
              </select>
            </div>

            {identity.accountType === 'Pessoa Jurídica' && (
              <>
                <div className="sw-didactic-box">
                  ⚠️ Estes dados são fictícios para fins de aprendizado. Não insira dados reais de empresas.
                </div>
                <div className="sw-form-group">
                  <label className="sw-label">Nome Fantasia <span className="required">*</span></label>
                  <input type="text" className="sw-input" value={identity.tradeName}
                    onChange={e => setIdentity({ ...identity, tradeName: e.target.value })} />
                </div>
                <div className="sw-form-group">
                  <label className="sw-label">CNPJ Fictício (14 dígitos) <span className="required">*</span></label>
                  <input type="text" className="sw-input" value={identity.cnpj} maxLength={18}
                    onChange={e => setIdentity({ ...identity, cnpj: e.target.value })} />
                </div>
                <div className="sw-form-group">
                  <label className="sw-label">Responsável Legal <span className="required">*</span></label>
                  <input type="text" className="sw-input" value={identity.legalRepresentative}
                    onChange={e => setIdentity({ ...identity, legalRepresentative: e.target.value })} />
                </div>
                <div className="sw-form-group">
                  <label className="sw-label">Cargo <span className="required">*</span></label>
                  <input type="text" className="sw-input" value={identity.position}
                    onChange={e => setIdentity({ ...identity, position: e.target.value })} />
                </div>
              </>
            )}
            <button type="submit" className="sw-btn sw-btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar e Continuar'}
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Tax */}
      {step === 2 && (
        <form onSubmit={handleTaxSubmit}>
          <div className="sw-card">
            <h2 className="sw-section-title">Tax Interview — Informações Fiscais</h2>
            <div className="sw-didactic-box">
              ⚠️ Estes dados são fictícios para fins de aprendizado. Não insira dados reais.
            </div>
            <div className="sw-form-group">
              <label className="sw-label">País de Residência</label>
              <select className="sw-select" value={tax.country}
                onChange={e => setTax({ ...tax, country: e.target.value })}>
                <option value="Brasil">Brasil</option>
              </select>
            </div>
            <div className="sw-form-group">
              <label className="sw-label">TIN (CPF ou CNPJ fictício) <span className="required">*</span></label>
              <input type="text" className="sw-input" placeholder="CPF: 11 dígitos / CNPJ: 14 dígitos"
                value={tax.tin}
                onChange={e => setTax({ ...tax, tin: e.target.value })} required />
              <div style={{ fontSize: '11px', color: '#8f98a0', marginTop: '2px' }}>
                CPF = 11 dígitos; CNPJ = 14 dígitos (dados simulados)
              </div>
            </div>
            <button type="submit" className="sw-btn sw-btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar e Continuar'}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Bank */}
      {step === 3 && (
        <form onSubmit={handleBankSubmit}>
          <div className="sw-card">
            <h2 className="sw-section-title">Informações Bancárias</h2>
            <div className="sw-didactic-box">
              ⚠️ Dados bancários fictícios para fins educacionais. Não insira dados reais.
            </div>
            <div className="sw-form-group">
              <label className="sw-label">Nome do Banco Fictício <span className="required">*</span></label>
              <input type="text" className="sw-input" value={bank.bankName}
                onChange={e => setBank({ ...bank, bankName: e.target.value })} required />
            </div>
            <div className="sw-form-group">
              <label className="sw-label">Código SWIFT/IBAN Fictício <span className="required">*</span></label>
              <input type="text" className="sw-input" placeholder="8 a 11 caracteres"
                value={bank.swiftCode}
                onChange={e => setBank({ ...bank, swiftCode: e.target.value })} required />
              <div style={{ fontSize: '11px', color: '#8f98a0', marginTop: '2px' }}>
                Mínimo {SWIFT_MIN}, máximo {SWIFT_MAX} caracteres
              </div>
            </div>
            <div className="sw-form-group">
              <label className="sw-label">Número de Conta Fictício <span className="required">*</span></label>
              <input type="text" className="sw-input" value={bank.accountNumber}
                onChange={e => setBank({ ...bank, accountNumber: e.target.value.replace(/\D/g, '') })} required />
            </div>
            <button type="submit" className="sw-btn sw-btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar e Continuar'}
            </button>
          </div>
        </form>
      )}
    </Layout>
  );
};

export default OnboardingPage;

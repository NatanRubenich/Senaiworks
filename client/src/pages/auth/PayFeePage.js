import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import Layout from '../../components/layout/Layout';
import { PUBLICATION_FEE } from '../../config/constants';

const PayFeePage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(user?.feePaid || false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await userAPI.payFee();
      await refreshUser();
      setPaid(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.feePaid) {
    navigate('/dashboard');
    return null;
  }

  return (
    <Layout>
      <div className="sw-breadcrumb">SenaiWorks &gt; Cadastro &gt; Taxa de Publicação</div>
      <h1 className="sw-page-title">Taxa de Publicação — Steam Direct Fee</h1>

      <div className="sw-card" style={{ maxWidth: '600px' }}>
        <h2 className="sw-section-title">Taxa de Publicação do Aplicativo</h2>

        <div className="sw-didactic-box">
          ⚠️ Esta é uma taxa simulada para fins didáticos. Nenhum valor real será cobrado.
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '14px', color: '#8f98a0', marginBottom: '8px' }}>
            Status da taxa de publicação:
          </div>
          <div style={{
            display: 'inline-block',
            padding: '8px 24px',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 600,
            background: paid ? 'rgba(91,163,43,0.2)' : 'rgba(229,192,123,0.2)',
            color: paid ? '#8bc34a' : '#e5c07b',
            marginBottom: '16px',
          }}>
            {paid ? '✅ PAGO' : '⏳ Pendente'}
          </div>

          <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>
            ${PUBLICATION_FEE.toFixed(2)} USD
          </div>

          {!paid && (
            <button
              className="sw-btn sw-btn-green"
              style={{ fontSize: '14px', padding: '12px 32px' }}
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? 'Processando...' : `PAGAR TAXA DE PUBLICAÇÃO — $${PUBLICATION_FEE.toFixed(2)} USD`}
            </button>
          )}

          {paid && (
            <div className="sw-success-box" style={{ marginTop: '12px' }}>
              ✅ Taxa paga com sucesso! Redirecionando para o painel...
            </div>
          )}
        </div>

        <div style={{ fontSize: '12px', color: '#556772', marginTop: '12px', lineHeight: '1.6' }}>
          <p>A taxa de publicação do aplicativo é obrigatória para acessar os módulos de submissão.</p>
          <p>Após o pagamento, você terá acesso à Administração da Página da Loja e à Configuração do Jogo.</p>
        </div>
      </div>
    </Layout>
  );
};

export default PayFeePage;

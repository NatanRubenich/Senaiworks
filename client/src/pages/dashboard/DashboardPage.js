import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { gameAPI } from '../../services/api';
import Layout from '../../components/layout/Layout';
import { GAME_STATUS } from '../../config/constants';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newGameName, setNewGameName] = useState('');

  useEffect(() => {
    if (!user) return;
    if (!user.identityCompleted || !user.taxCompleted || !user.bankCompleted) {
      navigate('/onboarding');
      return;
    }
    if (!user.feePaid) {
      navigate('/pay-fee');
      return;
    }
    loadGames();
  }, [user, navigate]);

  const loadGames = async () => {
    try {
      const res = await gameAPI.getMyGames();
      setGames(res.data.games);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = async () => {
    if (!newGameName.trim()) return;
    try {
      const res = await gameAPI.create({ gameName: newGameName.trim() });
      setShowCreate(false);
      setNewGameName('');
      navigate(`/games/${res.data.game._id}/store`);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      [GAME_STATUS.DRAFT]: 'sw-badge sw-badge-pending',
      [GAME_STATUS.STORE_SUBMITTED]: 'sw-badge sw-badge-review',
      [GAME_STATUS.CONFIG_SUBMITTED]: 'sw-badge sw-badge-review',
      [GAME_STATUS.IN_REVIEW]: 'sw-badge sw-badge-review',
      [GAME_STATUS.APPROVED]: 'sw-badge sw-badge-approved',
      [GAME_STATUS.REJECTED]: 'sw-badge sw-badge-rejected',
    };
    return <span className={map[status] || 'sw-badge sw-badge-pending'}>{status}</span>;
  };

  const getLastReview = (game) => {
    if (!game.reviewHistory || game.reviewHistory.length === 0) return null;
    const last = game.reviewHistory[game.reviewHistory.length - 1];
    if (last.action === 'rejected') return last.reason;
    return null;
  };

  if (loading) {
    return <Layout><div className="sw-spinner"></div></Layout>;
  }

  return (
    <Layout>
      <div className="sw-breadcrumb">SenaiWorks &gt; Painel do Desenvolvedor</div>
      <h1 className="sw-page-title">Painel do Desenvolvedor</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ color: '#8f98a0', fontSize: '13px' }}>
          Gerencie seus jogos e submissões na plataforma SenaiWorks.
        </p>
        <button className="sw-btn sw-btn-green" onClick={() => setShowCreate(true)}>
          + Criar novo aplicativo
        </button>
      </div>

      {showCreate && (
        <div className="sw-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="sw-modal" onClick={e => e.stopPropagation()}>
            <h3 className="sw-modal-title">Criar novo aplicativo</h3>
            <div className="sw-form-group">
              <label className="sw-label">Nome do jogo <span className="required">*</span></label>
              <input
                type="text"
                className="sw-input"
                placeholder="Digite o nome do seu jogo"
                value={newGameName}
                onChange={e => setNewGameName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="sw-modal-actions">
              <button className="sw-btn sw-btn-secondary" onClick={() => setShowCreate(false)}>Cancelar</button>
              <button className="sw-btn sw-btn-primary" onClick={handleCreateGame} disabled={!newGameName.trim()}>
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {games.length === 0 ? (
        <div className="sw-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#8f98a0', marginBottom: '12px' }}>Você ainda não possui jogos cadastrados.</p>
          <button className="sw-btn sw-btn-primary" onClick={() => setShowCreate(true)}>
            Criar seu primeiro jogo
          </button>
        </div>
      ) : (
        <table className="sw-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Jogo</th>
              <th>Status</th>
              <th>Última Atualização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game._id}>
                <td style={{ color: '#8f98a0', fontSize: '12px' }}>{game.appId}</td>
                <td>
                  <span style={{ color: '#66c0f4', cursor: 'pointer' }} onClick={() => navigate(`/games/${game._id}/store`)}>
                    {game.basicData?.gameName || 'Sem nome'}
                  </span>
                  {getLastReview(game) && (
                    <div style={{ fontSize: '11px', color: '#d94126', marginTop: '2px' }}>
                      Motivo: {getLastReview(game)}
                    </div>
                  )}
                </td>
                <td>{getStatusBadge(game.status)}</td>
                <td style={{ color: '#8f98a0', fontSize: '12px' }}>
                  {new Date(game.updatedAt).toLocaleDateString('pt-BR')}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="sw-btn sw-btn-sm sw-btn-primary" onClick={() => navigate(`/games/${game._id}/store`)}>
                      Página da Loja
                    </button>
                    <button className="sw-btn sw-btn-sm sw-btn-secondary" onClick={() => navigate(`/games/${game._id}/config`)}>
                      Configuração
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default DashboardPage;

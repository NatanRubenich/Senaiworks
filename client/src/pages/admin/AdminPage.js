import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import Layout from '../../components/layout/Layout';
import { GAME_STATUS } from '../../config/constants';

const AdminPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [error, setError] = useState('');

  const loadGames = useCallback(async () => {
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const res = await adminAPI.getGames(params);
      setGames(res.data.games);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const handleApprove = async (gameId) => {
    setActionLoading(true);
    setError('');
    try {
      await adminAPI.approveGame(gameId);
      loadGames();
      setShowDetailModal(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao aprovar.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('Motivo da reprovação é obrigatório.');
      return;
    }
    setActionLoading(true);
    setError('');
    try {
      await adminAPI.rejectGame(selectedGame._id, rejectReason.trim());
      setShowRejectModal(false);
      setShowDetailModal(false);
      setRejectReason('');
      loadGames();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao reprovar.');
    } finally {
      setActionLoading(false);
    }
  };

  const openDetail = async (gameId) => {
    try {
      const res = await adminAPI.getGameDetails(gameId);
      setSelectedGame(res.data.game);
      setShowDetailModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      [GAME_STATUS.IN_REVIEW]: 'sw-badge sw-badge-review',
      [GAME_STATUS.APPROVED]: 'sw-badge sw-badge-approved',
      [GAME_STATUS.REJECTED]: 'sw-badge sw-badge-rejected',
      [GAME_STATUS.STORE_SUBMITTED]: 'sw-badge sw-badge-review',
      [GAME_STATUS.CONFIG_SUBMITTED]: 'sw-badge sw-badge-review',
    };
    return <span className={map[status] || 'sw-badge sw-badge-pending'}>{status}</span>;
  };

  const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

  if (loading) return <Layout><div className="sw-spinner"></div></Layout>;

  return (
    <Layout>
      <div className="sw-breadcrumb">SenaiWorks &gt; Painel do Administrador</div>
      <h1 className="sw-page-title">Painel do Administrador</h1>

      {/* Filters */}
      <div className="sw-card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div className="sw-form-group" style={{ marginBottom: 0 }}>
          <label className="sw-label">Filtrar por status:</label>
          <select className="sw-select" style={{ width: '180px' }} value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Reprovado">Reprovado</option>
            <option value="Loja em Revisão">Loja em Revisão</option>
            <option value="Config em Revisão">Config em Revisão</option>
          </select>
        </div>
        <div className="sw-form-group" style={{ marginBottom: 0, flex: 1 }}>
          <label className="sw-label">Pesquisar:</label>
          <input type="text" className="sw-input" placeholder="Buscar por nome ou desenvolvedor"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Games table */}
      {games.length === 0 ? (
        <div className="sw-card" style={{ textAlign: 'center', padding: '40px', color: '#556772' }}>
          Nenhum jogo encontrado com os filtros selecionados.
        </div>
      ) : (
        <table className="sw-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Desenvolvedor</th>
              <th>Data de Envio</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game._id}>
                <td>
                  <span style={{ color: '#66c0f4', cursor: 'pointer' }} onClick={() => openDetail(game._id)}>
                    {game.basicData?.gameName || 'Sem nome'}
                  </span>
                  <div style={{ fontSize: '11px', color: '#556772' }}>ID: {game.appId}</div>
                </td>
                <td>
                  <div>{game.developer?.identity?.legalName || '—'}</div>
                  <div style={{ fontSize: '11px', color: '#556772' }}>{game.developer?.email}</div>
                </td>
                <td style={{ fontSize: '12px', color: '#8f98a0' }}>
                  {game.storeSubmittedAt
                    ? new Date(game.storeSubmittedAt).toLocaleDateString('pt-BR')
                    : new Date(game.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td>{getStatusBadge(game.status)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="sw-btn sw-btn-sm sw-btn-primary" onClick={() => openDetail(game._id)}>
                      Detalhes
                    </button>
                    {game.status === 'Em Análise' && (
                      <>
                        <button className="sw-btn sw-btn-sm sw-btn-green"
                          onClick={() => handleApprove(game._id)} disabled={actionLoading}>
                          Aprovar
                        </button>
                        <button className="sw-btn sw-btn-sm sw-btn-danger"
                          onClick={() => { setSelectedGame(game); setShowRejectModal(true); }}>
                          Reprovar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedGame && (
        <div className="sw-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="sw-modal" onClick={e => e.stopPropagation()}
            style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
            <h3 className="sw-modal-title">
              {selectedGame.basicData?.gameName} ({selectedGame.appId})
            </h3>

            {error && <div className="sw-error-box">{error}</div>}

            {/* Basic Data */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: '#66c0f4', fontSize: '13px', marginBottom: '8px' }}>Dados Básicos (Módulo B)</h4>
              <table style={{ width: '100%', fontSize: '12px' }}>
                <tbody>
                  <tr><td style={{ color: '#8f98a0', width: '140px', padding: '3px 0' }}>Nome:</td><td>{selectedGame.basicData?.gameName}</td></tr>
                  <tr><td style={{ color: '#8f98a0', padding: '3px 0' }}>Desenvolvedora:</td><td>{selectedGame.basicData?.developerName}</td></tr>
                  <tr><td style={{ color: '#8f98a0', padding: '3px 0' }}>Distribuidora:</td><td>{selectedGame.basicData?.publisherName}</td></tr>
                  <tr><td style={{ color: '#8f98a0', padding: '3px 0' }}>Gêneros:</td><td>{selectedGame.basicData?.genres?.join(', ')}</td></tr>
                  <tr><td style={{ color: '#8f98a0', padding: '3px 0' }}>Tags:</td><td>{selectedGame.basicData?.tags}</td></tr>
                  <tr><td style={{ color: '#8f98a0', padding: '3px 0' }}>Idiomas:</td><td>{selectedGame.basicData?.languages?.join(', ')}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: '#66c0f4', fontSize: '13px', marginBottom: '8px' }}>Descrição</h4>
              <div style={{ fontSize: '12px', color: '#c7d5e0', marginBottom: '4px' }}>
                <strong>Curta:</strong> {selectedGame.description?.shortDescription || '—'}
              </div>
              <div style={{ fontSize: '12px', color: '#8f98a0' }}>
                <strong>Longa:</strong>
                <div dangerouslySetInnerHTML={{ __html: selectedGame.description?.longDescription || '—' }}
                  style={{ marginTop: '4px', padding: '8px', background: '#0e1621', borderRadius: '2px', maxHeight: '150px', overflow: 'auto' }} />
              </div>
            </div>

            {/* Store Graphics */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: '#66c0f4', fontSize: '13px', marginBottom: '8px' }}>Recursos Gráficos da Loja</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['headerCapsule', 'smallCapsule', 'mainCapsule', 'verticalCapsule'].map(key => (
                  <div key={key}>
                    {selectedGame.storeGraphics?.[key]?.url ? (
                      <img src={`${API_BASE}${selectedGame.storeGraphics[key].url}`} alt={key}
                        style={{ height: '60px', borderRadius: '2px', border: '1px solid #2a475e' }} />
                    ) : (
                      <div style={{ height: '60px', width: '80px', background: '#0e1621', borderRadius: '2px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#556772' }}>
                        {key}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Screenshots */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: '#66c0f4', fontSize: '13px', marginBottom: '8px' }}>
                Screenshots ({selectedGame.screenshots?.length || 0})
              </h4>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(selectedGame.screenshots || []).slice(0, 6).map((ss, i) => (
                  <img key={i} src={`${API_BASE}${ss.url}`} alt={`SS ${i + 1}`}
                    style={{ height: '50px', borderRadius: '2px', border: '1px solid #2a475e' }} />
                ))}
              </div>
            </div>

            {/* Config (Module C) */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: '#66c0f4', fontSize: '13px', marginBottom: '8px' }}>Configuração do Jogo (Módulo C)</h4>
              <table style={{ width: '100%', fontSize: '12px' }}>
                <tbody>
                  <tr><td style={{ color: '#8f98a0', width: '140px', padding: '3px 0' }}>OS:</td>
                    <td>{[
                      selectedGame.appConfig?.os?.windows && 'Windows',
                      selectedGame.appConfig?.os?.macOS && 'macOS',
                      selectedGame.appConfig?.os?.linux && 'Linux',
                    ].filter(Boolean).join(', ') || '—'}</td>
                  </tr>
                  <tr><td style={{ color: '#8f98a0', padding: '3px 0' }}>Build:</td>
                    <td>{selectedGame.buildUpload?.fileName || '—'} ({((selectedGame.buildUpload?.fileSize || 0) / (1024*1024)).toFixed(2)} MB)</td>
                  </tr>
                  <tr><td style={{ color: '#8f98a0', padding: '3px 0' }}>Executável:</td>
                    <td>{selectedGame.installConfig?.launchOptions?.[0]?.executable || '—'}</td>
                  </tr>
                  <tr><td style={{ color: '#8f98a0', padding: '3px 0' }}>Depots:</td>
                    <td>{selectedGame.depots?.length || 0} depot(s)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Review History */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: '#66c0f4', fontSize: '13px', marginBottom: '8px' }}>Histórico de Revisões</h4>
              {(selectedGame.reviewHistory || []).length === 0 ? (
                <p style={{ fontSize: '12px', color: '#556772' }}>Nenhum histórico disponível.</p>
              ) : (
                <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                  {selectedGame.reviewHistory.map((entry, i) => (
                    <div key={i} style={{
                      padding: '6px 8px', borderLeft: `3px solid ${
                        entry.action === 'approved' ? '#5ba32b' :
                        entry.action === 'rejected' ? '#d94126' : '#1a9fff'
                      }`, marginBottom: '4px', background: 'rgba(42,71,94,0.15)', fontSize: '12px',
                    }}>
                      <span style={{ color: '#8f98a0' }}>
                        [{new Date(entry.date).toLocaleString('pt-BR')}]
                      </span>{' '}
                      <strong style={{ color: '#c7d5e0', textTransform: 'capitalize' }}>{entry.action}</strong>
                      {entry.reason && <span style={{ color: '#8f98a0' }}> — {entry.reason}</span>}
                      {entry.by && <span style={{ color: '#556772' }}> (por {entry.by})</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            {selectedGame.status === 'Em Análise' && (
              <div className="sw-modal-actions">
                <button className="sw-btn sw-btn-secondary" onClick={() => setShowDetailModal(false)}>
                  Fechar
                </button>
                <button className="sw-btn sw-btn-danger"
                  onClick={() => { setShowRejectModal(true); }}>
                  Reprovar
                </button>
                <button className="sw-btn sw-btn-green"
                  onClick={() => handleApprove(selectedGame._id)} disabled={actionLoading}>
                  {actionLoading ? 'Aprovando...' : 'Aprovar'}
                </button>
              </div>
            )}
            {selectedGame.status !== 'Em Análise' && (
              <div className="sw-modal-actions">
                <button className="sw-btn sw-btn-secondary" onClick={() => setShowDetailModal(false)}>
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="sw-modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="sw-modal" onClick={e => e.stopPropagation()}>
            <h3 className="sw-modal-title">Reprovar Jogo</h3>
            {error && <div className="sw-error-box">{error}</div>}
            <p style={{ fontSize: '13px', color: '#c7d5e0', marginBottom: '12px' }}>
              Informe o motivo da reprovação. Este motivo será exibido ao desenvolvedor.
            </p>
            <div className="sw-form-group">
              <label className="sw-label">Motivo da reprovação <span className="required">*</span></label>
              <textarea
                className="sw-textarea"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Descreva o motivo da reprovação..."
                style={{ minHeight: '100px' }}
              />
            </div>
            <div className="sw-modal-actions">
              <button className="sw-btn sw-btn-secondary" onClick={() => { setShowRejectModal(false); setRejectReason(''); }}>
                Cancelar
              </button>
              <button className="sw-btn sw-btn-danger" onClick={handleReject} disabled={actionLoading || !rejectReason.trim()}>
                {actionLoading ? 'Reprovando...' : 'Confirmar Reprovação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminPage;

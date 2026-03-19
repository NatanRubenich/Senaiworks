import React, { useState } from 'react';
import { gameAPI } from '../../../services/api';
import { LANGUAGES } from '../../../config/constants';

const CHECKLIST_ITEMS = [
  { key: 'basicData', label: 'Dados básicos preenchidos' },
  { key: 'description', label: 'Descrição (longa e curta) preenchida' },
  { key: 'storeGraphics', label: 'Todos os 4 capsules da loja enviados e validados' },
  { key: 'screenshots', label: 'Mínimo de 5 screenshots enviadas' },
  { key: 'libraryAssets', label: 'Todos os 4 assets da biblioteca enviados e validados' },
];

const PublishStoreTab = ({ game, onSave }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewLang, setPreviewLang] = useState('Português (Brasil)');

  const getChecklistStatus = (key) => {
    return game.tabStatus?.[key] === 'complete';
  };

  const allComplete = CHECKLIST_ITEMS.every(item => getChecklistStatus(item.key));

  const handlePublish = async () => {
    setError('');
    setSuccess('');
    if (!allComplete) {
      setError('Todos os itens obrigatórios devem estar completos antes de publicar.');
      return;
    }
    setLoading(true);
    try {
      await gameAPI.publishStore(game._id);
      setSuccess('Página da loja publicada com sucesso! Os dados foram enviados para revisão do administrador.');
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao publicar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="sw-section-title">Publicar Página da Loja</h2>

      {error && <div className="sw-error-box">{error}</div>}
      {success && <div className="sw-success-box">{success}</div>}

      {game.storePublished && (
        <div className="sw-success-box">
          ✅ Página da loja já foi publicada em {new Date(game.storeSubmittedAt).toLocaleDateString('pt-BR')}.
          Status atual: <strong>{game.status}</strong>
        </div>
      )}

      {/* Checklist */}
      <div className="sw-card">
        <h3 style={{ fontSize: '14px', color: '#c7d5e0', marginBottom: '12px' }}>
          Checklist de itens obrigatórios
        </h3>
        {CHECKLIST_ITEMS.map(item => {
          const complete = getChecklistStatus(item.key);
          return (
            <div key={item.key} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 0', fontSize: '13px',
              color: complete ? '#8bc34a' : '#e5c07b',
            }}>
              <span style={{ fontSize: '16px' }}>{complete ? '✅' : '⚠️'}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Preview */}
      <div className="sw-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '14px', color: '#c7d5e0' }}>Pré-visualizar alterações na loja</h3>
          <select className="sw-select" style={{ width: '200px' }} value={previewLang}
            onChange={e => setPreviewLang(e.target.value)}>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <button className="sw-btn sw-btn-sm sw-btn-outline" style={{ marginTop: '8px' }}>
          Pré-visualizar alterações na loja
        </button>
      </div>

      {/* Publish button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button
          className="sw-btn sw-btn-green"
          onClick={handlePublish}
          disabled={loading || !allComplete || game.storePublished}
          style={{ fontSize: '14px', padding: '10px 24px' }}
        >
          {loading ? 'Publicando...' : game.storePublished ? 'Já Publicado' : 'Publicar Página da Loja'}
        </button>
      </div>
    </div>
  );
};

export default PublishStoreTab;

import React, { useState } from 'react';
import { gameAPI } from '../../../services/api';

const PublishConfigTab = ({ game, onSave }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [lightPublish, setLightPublish] = useState(false);
  const [diffOutput, setDiffOutput] = useState('');
  const [resultOutput, setResultOutput] = useState('');
  const [showConfirmRevert, setShowConfirmRevert] = useState(false);

  const requiredTabs = ['appConfig', 'depotUpload', 'installConfig'];
  const allComplete = requiredTabs.every(t => game.tabStatus?.[t] === 'complete');

  const handlePublish = async () => {
    setError('');
    setSuccess('');
    if (!allComplete) {
      setError('Existem etapas incompletas na Configuração do Jogo.');
      return;
    }
    setLoading(true);
    try {
      await gameAPI.publishConfig(game._id);
      setSuccess('Configurações do jogo publicadas com sucesso! Os dados foram enviados para revisão.');
      setResultOutput('Publicação realizada com sucesso. Dados enviados para análise do administrador.');
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao publicar.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDiff = () => {
    setDiffOutput(
      `--- Versão publicada\n+++ Versão atual\n\n` +
      `@@ Configurações do Aplicativo @@\n` +
      `+ OS: ${game.appConfig?.os?.windows ? 'Windows' : ''} ${game.appConfig?.os?.linux ? 'Linux' : ''}\n` +
      `+ Build: ${game.buildUpload?.fileName || 'N/A'}\n` +
      `+ Launch: ${game.installConfig?.launchOptions?.[0]?.executable || 'N/A'}\n`
    );
  };

  const handleViewHistory = () => {
    const history = game.reviewHistory || [];
    if (history.length === 0) {
      setResultOutput('Nenhuma alteração pendente ou histórico encontrado.');
    } else {
      setResultOutput(
        history.map(h =>
          `[${new Date(h.date).toLocaleString('pt-BR')}] ${h.action.toUpperCase()} — ${h.reason || ''}`
        ).join('\n')
      );
    }
  };

  const handleRevert = () => {
    setShowConfirmRevert(false);
    setResultOutput('Alterações revertidas com sucesso (simulação). Voltando à versão publicada.');
  };

  const handleSendCDN = () => {
    setResultOutput('Imagens do aplicativo enviadas à CDN com sucesso (simulação).');
  };

  return (
    <div>
      <h2 className="sw-section-title">Publicar alterações</h2>

      {error && <div className="sw-error-box">{error}</div>}
      {success && <div className="sw-success-box">{success}</div>}

      {game.configPublished && (
        <div className="sw-success-box">
          ✅ Configurações já foram publicadas em {new Date(game.configSubmittedAt).toLocaleDateString('pt-BR')}.
          Status atual: <strong>{game.status}</strong>
        </div>
      )}

      <div className="sw-card">
        <div className="sw-info-box">
          Use esta página para publicar todos os metadados informados no site. É necessário publicar para testar
          opções como a configuração de depots do jogo, novas versões ou novas conquistas adicionadas. Caso o jogo
          não esteja configurado como jogável, esta ação não o lançará, apenas publicará as alterações realizadas
          nas configurações.
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="sw-btn sw-btn-sm sw-btn-primary" onClick={handleViewHistory}>
              Ver todas as alterações pendentes e histórico
            </button>
            <span style={{ fontSize: '12px', color: '#8f98a0' }}>
              — Veja as alterações pendentes e o histórico de alterações
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="sw-btn sw-btn-sm sw-btn-primary" onClick={handleViewDiff}>
              Ver diferenças
            </button>
            <span style={{ fontSize: '12px', color: '#8f98a0' }}>
              — Verifique todas as alterações antes de publicar
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="sw-btn sw-btn-sm sw-btn-danger" onClick={() => setShowConfirmRevert(true)}>
              Reverter alterações
            </button>
            <span style={{ fontSize: '12px', color: '#8f98a0' }}>
              — Use esta opção para reverter todo o trabalho não publicado, voltando à versão atualmente publicada
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="sw-btn sw-btn-sm sw-btn-primary" onClick={handleSendCDN}>
              Enviar imagens do aplicativo à CDN
            </button>
            <span style={{ fontSize: '12px', color: '#8f98a0' }}>
              — Enviar imagens agora, para que possa realizar uma publicação "leve" depois
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="sw-btn sw-btn-sm sw-btn-green" onClick={handlePublish}
              disabled={loading || !allComplete || game.configPublished}>
              {loading ? 'Publicando...' : 'Preparar para publicação'}
            </button>
            <span style={{ fontSize: '12px', color: '#8f98a0' }}>
              — Verifique se há conflitos entre o seu trabalho e o de outros usuários
            </span>
          </div>
        </div>

        {/* Light publish checkbox */}
        <label className="sw-checkbox-group" style={{ marginBottom: '16px' }}>
          <input type="checkbox" checked={lightPublish}
            onChange={e => setLightPublish(e.target.checked)} />
          "Publicação leve" (sem imagens)
        </label>

        {/* Diff output */}
        {diffOutput && (
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ fontSize: '13px', color: '#c7d5e0', marginBottom: '4px' }}>Diferenças:</h4>
            <pre style={{
              background: '#0e1621', border: '1px solid #2a475e', borderRadius: '2px',
              padding: '12px', fontSize: '11px', color: '#8f98a0', whiteSpace: 'pre-wrap',
              fontFamily: 'monospace', maxHeight: '200px', overflow: 'auto',
            }}>
              {diffOutput}
            </pre>
          </div>
        )}

        {/* Results output */}
        {resultOutput && (
          <div>
            <h4 style={{ fontSize: '13px', color: '#c7d5e0', marginBottom: '4px' }}>Resultados:</h4>
            <pre style={{
              background: '#0e1621', border: '1px solid #2a475e', borderRadius: '2px',
              padding: '12px', fontSize: '11px', color: '#8f98a0', whiteSpace: 'pre-wrap',
              fontFamily: 'monospace', maxHeight: '200px', overflow: 'auto',
            }}>
              {resultOutput}
            </pre>
          </div>
        )}
      </div>

      {/* Revert confirmation modal */}
      {showConfirmRevert && (
        <div className="sw-modal-overlay" onClick={() => setShowConfirmRevert(false)}>
          <div className="sw-modal" onClick={e => e.stopPropagation()}>
            <h3 className="sw-modal-title">Confirmar reversão</h3>
            <p style={{ fontSize: '13px', color: '#c7d5e0', marginBottom: '12px' }}>
              Tem certeza de que deseja reverter todas as alterações não publicadas?
              Esta ação não pode ser desfeita.
            </p>
            <div className="sw-modal-actions">
              <button className="sw-btn sw-btn-secondary" onClick={() => setShowConfirmRevert(false)}>
                Cancelar
              </button>
              <button className="sw-btn sw-btn-danger" onClick={handleRevert}>
                Reverter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishConfigTab;

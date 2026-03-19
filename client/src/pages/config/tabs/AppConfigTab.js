import React, { useState, useEffect } from 'react';
import { gameAPI } from '../../../services/api';

const AppConfigTab = ({ game, onSave }) => {
  const [os, setOs] = useState({
    windows: false, windows64: false, macOS: false,
    macIntel64: false, macAppleSilicon: false, macNotarized: false,
    linux: false, android: false,
  });
  const [communityVisibility, setCommunityVisibility] = useState('default');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (game?.appConfig) {
      setOs(game.appConfig.os || {});
      setCommunityVisibility(game.appConfig.communityVisibility || 'default');
    }
  }, [game]);

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await gameAPI.updateAppConfig(game._id, { os, communityVisibility });
      setSuccess('Configurações salvas com sucesso!');
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="sw-section-title">Configurações gerais do aplicativo</h2>
      <p className="sw-section-subtitle">
        Nesta página é possível alterar as configurações gerais do aplicativo, como tipo, sistemas operacionais compatíveis e o estado de lançamento.
      </p>

      {error && <div className="sw-error-box">{error}</div>}
      {success && <div className="sw-success-box">{success}</div>}

      {/* App Name & Type */}
      <div className="sw-card">
        <h3 className="sw-section-title" style={{ fontSize: '14px' }}>Nome e tipo do aplicativo</h3>
        <div className="sw-info-box">
          Como o seu jogo já foi analisado, será necessário entrar em contato com o suporte a desenvolvedores para realizar qualquer
          alteração ou adicionar nomes traduzidos. Consulte a documentação Alteração do nome do jogo para detalhes.
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div className="sw-form-group" style={{ flex: 2 }}>
            <label className="sw-label">Nome:</label>
            <input type="text" className="sw-input" value={game.appConfig?.appName || game.basicData?.gameName || ''}
              disabled style={{ opacity: 0.7 }} />
          </div>
          <div style={{ color: '#8f98a0', fontSize: '12px', alignSelf: 'flex-end', paddingBottom: '10px' }}>(r)</div>
          <div className="sw-form-group" style={{ flex: 1 }}>
            <label className="sw-label">Tipo:</label>
            <input type="text" className="sw-input" value={game.appConfig?.appType || 'Game'}
              disabled style={{ opacity: 0.7 }} />
          </div>
        </div>
      </div>

      {/* OS Compatible */}
      <div className="sw-card">
        <h3 className="sw-section-title" style={{ fontSize: '14px' }}>Sistemas operacionais compatíveis</h3>
        <p style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '12px', lineHeight: '1.6' }}>
          Marque apenas as caixas dos sistemas operacionais para os quais o seu produto está disponível a clientes atualmente.
          Caso lance versões para outros SOs após o lançamento do seu produto no Windows, não marque as respectivas caixas
          até publicar a versão compatível. Para mais informações sobre lançamento de versões para outros SOs, consulte a
          documentação do Steamworks.
        </p>

        {/* Windows */}
        <label className="sw-checkbox-group">
          <input type="checkbox" checked={os.windows} onChange={e => setOs({ ...os, windows: e.target.checked })} />
          <strong>Windows</strong>
        </label>
        <div className="sw-checkbox-sub">
          <label className="sw-checkbox-group">
            <input type="checkbox" checked={os.windows64} onChange={e => setOs({ ...os, windows64: e.target.checked })} />
            Exige 64-bit
          </label>
        </div>

        {/* macOS */}
        <label className="sw-checkbox-group" style={{ marginTop: '8px' }}>
          <input type="checkbox" checked={os.macOS} onChange={e => setOs({ ...os, macOS: e.target.checked })} />
          <strong>macOS</strong>
        </label>
        <div className="sw-checkbox-sub">
          <label className="sw-checkbox-group">
            <input type="checkbox" checked={os.macIntel64} onChange={e => setOs({ ...os, macIntel64: e.target.checked })} />
            Binários em 64 bits (Intel) inclusos
          </label>
          <label className="sw-checkbox-group">
            <input type="checkbox" checked={os.macAppleSilicon} onChange={e => setOs({ ...os, macAppleSilicon: e.target.checked })} />
            Binários para Apple Silicon inclusos
          </label>
          <label className="sw-checkbox-group">
            <input type="checkbox" checked={os.macNotarized} onChange={e => setOs({ ...os, macNotarized: e.target.checked })} />
            App Bundles foram autenticados pela Apple
          </label>
        </div>

        {/* Linux */}
        <label className="sw-checkbox-group" style={{ marginTop: '8px' }}>
          <input type="checkbox" checked={os.linux} onChange={e => setOs({ ...os, linux: e.target.checked })} />
          <strong>Linux + SteamOS</strong>
        </label>

        {/* Android */}
        <label className="sw-checkbox-group" style={{ marginTop: '8px', opacity: 0.5 }}>
          <input type="checkbox" checked={os.android} disabled />
          <strong>Android</strong>
          <span style={{ fontSize: '11px', color: '#556772', marginLeft: '4px' }}>(informativo)</span>
        </label>

        <div style={{ marginTop: '16px' }}>
          <button className="sw-btn sw-btn-green" onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Launch State */}
      <div className="sw-card">
        <h3 className="sw-section-title" style={{ fontSize: '14px' }}>Estado de lançamento</h3>
        <p style={{ fontSize: '12px', color: '#8f98a0' }}>
          Estado de lançamento do aplicativo: <strong style={{ color: '#c7d5e0' }}>{game.appConfig?.launchState || 'coming soon'}</strong> (r)
        </p>
      </div>

      {/* Community Visibility */}
      <div className="sw-card">
        <h3 className="sw-section-title" style={{ fontSize: '14px' }}>Visibilidade na Comunidade Steam</h3>
        <p style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '8px', lineHeight: '1.6' }}>
          <strong style={{ color: '#c7d5e0' }}>Visibilidade na Comunidade</strong> — Em geral, quando um jogo demonstração ou qualquer
          outro aplicativo no Steam tem uma página da loja visível ao público, ele também pode ser exibido na Comunidade Steam,
          como em perfis de jogadores, listas de amigos e feeds de atividade.
        </p>
        <p style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '8px', lineHeight: '1.6' }}>
          <strong style={{ color: '#c7d5e0' }}>Central da Comunidade</strong> — Quando a "Visibilidade na Comunidade" for ativada,
          uma Central da Comunidade é criada para o jogo ou software em questão.
        </p>
        <div className="sw-info-box">
          O aplicativo está marcado como <strong>lançado</strong>, isso significa que o nome e ícones do seu aplicativo são públicos
          e serão exibidos na lista de jogos adquiridos e usados por usuários na Comunidade Steam; o público pode ver o nome e ícones
          do seu aplicativo.
        </div>
        <div style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '4px' }}>Presença na Comunidade em geral:</div>
        <label className="sw-checkbox-group">
          <input type="radio" name="communityVis" checked={communityVisibility === 'default'}
            onChange={() => setCommunityVisibility('default')} />
          <strong>Padrão</strong>
          <span style={{ color: '#8f98a0', marginLeft: '4px' }}>
            — O aplicativo ficará visível na Comunidade Steam assim que a data de lançamento na loja for alterada para "Em breve".
          </span>
        </label>
        <label className="sw-checkbox-group">
          <input type="radio" name="communityVis" checked={communityVisibility === 'force'}
            onChange={() => setCommunityVisibility('force')} />
          <strong>Forçar visibilidade</strong>
          <span style={{ color: '#8f98a0', marginLeft: '4px' }}>
            — A Central da Comunidade ficará visível e o aplicativo poderá aparecer no Perfil Steam de quem o possuir.
          </span>
        </label>
      </div>
    </div>
  );
};

export default AppConfigTab;

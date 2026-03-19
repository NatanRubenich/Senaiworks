import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameAPI } from '../../services/api';
import Layout from '../../components/layout/Layout';
import AppConfigTab from './tabs/AppConfigTab';
import DepotUploadTab from './tabs/DepotUploadTab';
import DepotManageTab from './tabs/DepotManageTab';
import InstallConfigTab from './tabs/InstallConfigTab';
import PublishConfigTab from './tabs/PublishConfigTab';

const CONFIG_TABS = [
  { key: 'appConfig', label: 'Aplicativo', statusKey: 'appConfig', hasSubmenu: true },
  { key: 'steamPipe', label: 'SteamPipe', statusKey: 'depotUpload', hasSubmenu: true },
  { key: 'install', label: 'Instalação', statusKey: 'installConfig', hasSubmenu: true },
  { key: 'security', label: 'Segurança', disabled: true },
  { key: 'stats', label: 'Estatísticas e conquistas', disabled: true },
  { key: 'community', label: 'Comunidade', disabled: true },
  { key: 'workshop', label: 'Oficina', disabled: true },
  { key: 'codes', label: 'Gerenciar códigos', disabled: true },
  { key: 'misc', label: 'Diversos', disabled: true },
  { key: 'publishConfig', label: 'Publicar', statusKey: 'configPublish' },
];

const STEAMPIPE_SUBMENUS = [
  { key: 'versions', label: 'Versões', disabled: true },
  { key: 'depots', label: 'Depots' },
  { key: 'webUploads', label: 'Envios pela web' },
];

const ConfigPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appConfig');
  const [steamPipeSub, setSteamPipeSub] = useState('webUploads');
  const [showSubmenu, setShowSubmenu] = useState(null);

  const loadGame = useCallback(async () => {
    try {
      const res = await gameAPI.getGame(gameId);
      setGame(res.data.game);
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [gameId, navigate]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const getTabStatus = (statusKey) => {
    if (!game || !statusKey) return '';
    const s = game.tabStatus?.[statusKey];
    if (s === 'complete') return '✅';
    if (s === 'error') return '❌';
    return '';
  };

  if (loading) return <Layout><div className="sw-spinner"></div></Layout>;
  if (!game) return <Layout><div className="sw-error-box">Jogo não encontrado.</div></Layout>;

  const handleTabClick = (tab) => {
    if (tab.disabled) return;
    if (tab.hasSubmenu) {
      setShowSubmenu(showSubmenu === tab.key ? null : tab.key);
    }
    setActiveTab(tab.key);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'appConfig': return <AppConfigTab game={game} onSave={loadGame} />;
      case 'steamPipe':
        if (steamPipeSub === 'webUploads') return <DepotUploadTab game={game} onSave={loadGame} />;
        if (steamPipeSub === 'depots') return <DepotManageTab game={game} onSave={loadGame} />;
        return <div className="sw-info-box">Selecione um submenu.</div>;
      case 'install': return <InstallConfigTab game={game} onSave={loadGame} />;
      case 'publishConfig': return <PublishConfigTab game={game} onSave={loadGame} />;
      default: return <div className="sw-info-box">Esta seção está disponível apenas para referência visual neste simulador.</div>;
    }
  };

  return (
    <Layout>
      <div className="sw-breadcrumb">
        SenaiWorks &gt; Administração de aplicativo &gt; {game.basicData?.gameName || 'Jogo'}
      </div>
      <h1 className="sw-page-title">
        Administração de dados do aplicativo: {game.basicData?.gameName || 'Jogo'}{' '}
        <span className="app-id">({game.appId})</span>
      </h1>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <select className="sw-select" style={{ width: '200px' }}>
          <option value="">—</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="sw-tabs">
        {CONFIG_TABS.map(tab => (
          <div
            key={tab.key}
            className={`sw-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
            style={{
              opacity: tab.disabled ? 0.5 : 1,
              cursor: tab.disabled ? 'default' : 'pointer',
              position: 'relative',
            }}
          >
            {tab.label}
            {tab.hasSubmenu && <span style={{ fontSize: '8px', marginLeft: '2px' }}>▼</span>}
            {tab.statusKey && <span className="tab-status" style={{ marginLeft: '4px' }}>{getTabStatus(tab.statusKey)}</span>}

            {/* Submenu dropdown for SteamPipe */}
            {tab.key === 'steamPipe' && showSubmenu === 'steamPipe' && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 100,
                background: '#2a475e', border: '1px solid #3d4f5f', borderRadius: '0 0 2px 2px',
                minWidth: '140px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}>
                {STEAMPIPE_SUBMENUS.map(sub => (
                  <div
                    key={sub.key}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!sub.disabled) {
                        setSteamPipeSub(sub.key);
                        setShowSubmenu(null);
                      }
                    }}
                    style={{
                      padding: '6px 12px', fontSize: '12px', cursor: sub.disabled ? 'default' : 'pointer',
                      color: sub.disabled ? '#556772' : '#c7d5e0',
                      background: steamPipeSub === sub.key ? 'rgba(102,192,244,0.15)' : 'transparent',
                    }}
                  >
                    {sub.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {renderContent()}
    </Layout>
  );
};

export default ConfigPage;

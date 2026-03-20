import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameAPI } from '../../services/api';
import Layout from '../../components/layout/Layout';
import BasicDataTab from './tabs/BasicDataTab';
import DescriptionTab from './tabs/DescriptionTab';
import GraphicsTab from './tabs/GraphicsTab';
import ScreenshotsTab from './tabs/ScreenshotsTab';
import LibraryTab from './tabs/LibraryTab';
import TrailersTab from './tabs/TrailersTab';
import PublishStoreTab from './tabs/PublishStoreTab';

const STORE_TABS = [
  { key: 'basicData', label: 'Dados básicos', statusKey: 'basicData' },
  { key: 'description', label: 'Descrição', statusKey: 'description' },
  { key: 'classifications', label: 'Classificações', disabled: true },
  { key: 'earlyAccess', label: 'Acesso antecipado', disabled: true },
  { key: 'graphics', label: 'Recursos gráficos', statusKey: 'graphicsAll' },
  { key: 'trailers', label: 'Trailers', statusKey: 'trailers' },
  { key: 'specialConfig', label: 'Configurações especiais', disabled: true },
  { key: 'translation', label: 'Tradução', disabled: true },
  { key: 'publish', label: 'Publicar', statusKey: 'storePublish' },
];

const GRAPHICS_SUBTABS = [
  { key: 'storeCapsules', label: 'Recursos da loja', statusKey: 'storeGraphics' },
  { key: 'screenshots', label: 'Recursos de capturas de tela', statusKey: 'screenshots' },
  { key: 'library', label: 'Recursos da biblioteca', statusKey: 'libraryAssets' },
  { key: 'broadcast', label: 'Recursos de transmissão', disabled: true, suggested: true },
];

const StorePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basicData');
  const [activeSubtab, setActiveSubtab] = useState('storeCapsules');

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
    if (statusKey === 'graphicsAll') {
      const keys = ['storeGraphics', 'screenshots', 'libraryAssets'];
      const allComplete = keys.every(k => game.tabStatus?.[k] === 'complete');
      if (allComplete) return '✅';
      const hasError = keys.some(k => game.tabStatus?.[k] === 'error');
      if (hasError) return '❌';
      return '⚠️';
    }
    const s = game.tabStatus?.[statusKey];
    if (s === 'complete') return '✅';
    if (s === 'error') return '❌';
    return '⚠️';
  };

  if (loading) {
    return <Layout><div className="sw-spinner"></div></Layout>;
  }

  if (!game) {
    return <Layout><div className="sw-error-box">Jogo não encontrado.</div></Layout>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basicData':
        return <BasicDataTab game={game} onSave={loadGame} />;
      case 'description':
        return <DescriptionTab game={game} onSave={loadGame} />;
      case 'graphics':
        if (activeSubtab === 'storeCapsules') return <GraphicsTab game={game} onSave={loadGame} />;
        if (activeSubtab === 'screenshots') return <ScreenshotsTab game={game} onSave={loadGame} />;
        if (activeSubtab === 'library') return <LibraryTab game={game} onSave={loadGame} />;
        return <div className="sw-info-box">Em breve.</div>;
      case 'trailers':
        return <TrailersTab game={game} onSave={loadGame} />;
      case 'publish':
        return <PublishStoreTab game={game} onSave={loadGame} />;
      default:
        return <div className="sw-info-box">Esta seção está disponível apenas para referência visual neste simulador.</div>;
    }
  };

  return (
    <Layout>
      <div className="sw-breadcrumb">
        SenaiWorks &gt; Administração de aplicativo &gt; {game.basicData?.gameName || 'Novo Jogo'}
      </div>
      <h1 className="sw-page-title">
        Administração de página da loja: {game.basicData?.gameName || 'Novo Jogo'}{' '}
        <span className="app-id">({game.appId})</span>
      </h1>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#8f98a0' }}>Pré-visualizar alterações na loja</span>
          <select className="sw-select" style={{ width: '140px' }}>
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en">Inglês</option>
            <option value="es">Espanhol</option>
          </select>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="sw-tabs">
        {STORE_TABS.map(tab => (
          <div
            key={tab.key}
            className={`sw-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => !tab.disabled && setActiveTab(tab.key)}
            style={{ opacity: tab.disabled ? 0.5 : 1, cursor: tab.disabled ? 'default' : 'pointer' }}
          >
            {tab.label}
            {tab.statusKey && <span className="tab-status">{getTabStatus(tab.statusKey)}</span>}
          </div>
        ))}
      </div>

      {/* Sub-tabs for Graphics */}
      {activeTab === 'graphics' && (
        <div className="sw-subtabs">
          {GRAPHICS_SUBTABS.map(sub => (
            <div
              key={sub.key}
              className={`sw-subtab ${activeSubtab === sub.key ? 'active' : ''}`}
              onClick={() => !sub.disabled && setActiveSubtab(sub.key)}
              style={{ opacity: sub.disabled ? 0.5 : 1, cursor: sub.disabled ? 'default' : 'pointer' }}
            >
              {sub.label}
              {sub.statusKey && <span style={{ marginLeft: '4px' }}>{getTabStatus(sub.statusKey)}</span>}
              {sub.suggested && <span style={{ color: '#cf6a32', marginLeft: '4px', fontSize: '10px' }}>SUGERIDO</span>}
            </div>
          ))}
        </div>
      )}

      {/* Tab Content */}
      {renderTabContent()}
    </Layout>
  );
};

export default StorePage;

import React, { useState, useCallback } from 'react';
import { gameAPI } from '../../../services/api';
import { LIBRARY_ASSETS, validateImageDimensions } from '../../../config/constants';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const LibraryAssetUpload = ({ game, assetKey, spec, onSave }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [heroTextOverlay, setHeroTextOverlay] = useState(false);

  const currentUrl = game.libraryAssets?.[assetKey]?.url || '';
  const validated = game.libraryAssets?.[assetKey]?.validated || false;

  const processFile = useCallback(async (file) => {
    setError('');
    if (!spec.formats.includes(file.type)) {
      const fmtLabel = spec.formats.map(f => f.replace('image/', '').toUpperCase()).join(', ');
      setError(`Formato inválido. Apenas ${fmtLabel} ${spec.formats.length === 1 ? 'é aceito' : 'são aceitos'}.`);
      return;
    }
    try {
      const dims = await validateImageDimensions(file, spec.width, spec.height, spec.minHeight);
      if (!dims.valid) {
        const dimStr = spec.minHeight
          ? `${spec.width}×${spec.minHeight}-${spec.height}px`
          : `${spec.width}×${spec.height}px`;
        setError(`Dimensões incorretas: ${dims.width}×${dims.height}px. Obrigatório: ${dimStr}.`);
        return;
      }
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await gameAPI.uploadImage(game._id, formData);
      await gameAPI.updateLibraryAssets(game._id, {
        assetType: assetKey,
        imageUrl: uploadRes.data.url,
        validated: true,
        hasTextOverlay: false,
      });
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro no upload.');
    } finally {
      setUploading(false);
    }
  }, [game._id, assetKey, spec, onSave]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleRemove = async () => {
    try {
      await gameAPI.updateLibraryAssets(game._id, {
        assetType: assetKey,
        imageUrl: '',
        validated: false,
      });
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  const handleHeroTextOverlay = async (val) => {
    setHeroTextOverlay(val);
    if (val) {
      setError('O Cabeçalho da biblioteca (Hero) não pode conter texto ou logotipo sobreposto. Por favor, envie uma imagem limpa.');
      try {
        await gameAPI.updateLibraryAssets(game._id, {
          assetType: assetKey,
          imageUrl: '',
          validated: false,
          hasTextOverlay: true,
        });
        onSave();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const dimLabel = spec.minHeight
    ? `${spec.width} × ${spec.height} px (mín. ${spec.width} × ${spec.minHeight} px)`
    : `${spec.width} × ${spec.height} px`;
  const formatLabel = spec.formats.map(f => f.replace('image/', '').toUpperCase()).join(' ou ');

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 className="sw-section-title" style={{ fontSize: '14px' }}>
        {spec.label}
        <span style={{ fontSize: '11px', color: '#8f98a0', fontWeight: 400, marginLeft: '8px' }}>
          {dimLabel} — {formatLabel}
        </span>
        <span style={{ marginLeft: '8px', fontSize: '14px' }}>{validated ? '✅' : '⚠️'}</span>
      </h3>

      {/* Asset-specific guidelines */}
      {assetKey === 'libraryHero' && (
        <div className="sw-info-box">
          A imagem do cabeçalho da biblioteca deve conter a logo do aplicativo em destaque. Não deve incluir textos promocionais sobrepostos.
        </div>
      )}
      {assetKey === 'libraryLogo' && (
        <div className="sw-info-box">
          O logotipo deve ter fundo transparente (formato PNG obrigatório). Usar ferramentas de IA (ex: Adobe Firefly) é sugerido.
        </div>
      )}
      {assetKey === 'libraryHeader' && (
        <div className="sw-info-box">
          Deve ser uma imagem sem detalhes de texto/logo.
        </div>
      )}

      {currentUrl ? (
        <div>
          <div className="sw-image-preview" style={{ maxWidth: Math.min(spec.width / 2, 460) + 'px' }}>
            <img src={`${API_BASE}${currentUrl}`} alt={spec.label} style={{ width: '100%', display: 'block' }} />
            <button className="preview-remove" onClick={handleRemove} title="Remover">×</button>
          </div>
          {/* Hero text overlay question */}
          {assetKey === 'libraryHero' && currentUrl && (
            <div className="sw-card" style={{ marginTop: '8px', maxWidth: '460px' }}>
              <p style={{ fontSize: '12px', color: '#c7d5e0', marginBottom: '8px' }}>
                Esta imagem contém texto ou logotipo sobreposto?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label className="sw-checkbox-group">
                  <input type="radio" name="heroOverlay" checked={heroTextOverlay === true} onChange={() => handleHeroTextOverlay(true)} />
                  Sim
                </label>
                <label className="sw-checkbox-group">
                  <input type="radio" name="heroOverlay" checked={heroTextOverlay === false} onChange={() => handleHeroTextOverlay(false)} />
                  Não
                </label>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`sw-dropzone ${dragOver ? 'drag-over' : ''}`}
          style={{ padding: '20px', maxWidth: Math.min(spec.width / 2, 460) + 'px' }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`lib-file-${assetKey}`).click()}
        >
          {uploading ? (
            <div className="sw-spinner" style={{ margin: '0 auto' }}></div>
          ) : (
            <>
              <div className="dropzone-text">Solte a imagem aqui para enviá-la</div>
              <div className="dropzone-hint">{dimLabel}</div>
            </>
          )}
          <input id={`lib-file-${assetKey}`} type="file"
            accept={spec.formats.join(',')}
            style={{ display: 'none' }} onChange={handleFileSelect} />
        </div>
      )}

      {error && <div className="sw-error-box" style={{ marginTop: '6px', maxWidth: '460px' }}>{error}</div>}
    </div>
  );
};

const LibraryTab = ({ game, onSave }) => {
  return (
    <div>
      {/* Guidelines */}
      <div className="sw-info-box">
        <strong>Diretrizes para Recursos Gráficos da Biblioteca</strong><br />
        Estas são as artes exibidas na Biblioteca Steam do jogador. Siga as dimensões obrigatórias e orientações
        de cada asset para garantir qualidade visual.
      </div>

      {/* Upload sections */}
      <div className="sw-card">
        {Object.entries(LIBRARY_ASSETS).map(([key, spec]) => (
          <LibraryAssetUpload key={key} game={game} assetKey={key} spec={spec} onSave={onSave} />
        ))}
      </div>

      {/* Positioning tool */}
      <div className="sw-card">
        <h2 className="sw-section-title">Ferramenta de posicionamento</h2>
        <p style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '12px' }}>
          Visualize como o logotipo aparecerá sobre o Hero na biblioteca do jogador.
        </p>
        <div style={{
          width: '100%', maxWidth: '600px', height: '200px',
          background: '#0e1621', border: '1px solid #2a475e', borderRadius: '4px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {game.libraryAssets?.libraryHero?.url && (
            <img src={`${API_BASE}${game.libraryAssets.libraryHero.url}`} alt="Hero"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
          )}
          {game.libraryAssets?.libraryLogo?.url && (
            <img src={`${API_BASE}${game.libraryAssets.libraryLogo.url}`} alt="Logo"
              style={{ position: 'absolute', maxWidth: '50%', maxHeight: '60%', objectFit: 'contain' }} />
          )}
          {!game.libraryAssets?.libraryHero?.url && !game.libraryAssets?.libraryLogo?.url && (
            <span style={{ color: '#556772', fontSize: '12px' }}>Envie o Hero e o Logo para visualizar</span>
          )}
        </div>
      </div>

      {/* Reference examples */}
      <div className="sw-card">
        <h2 className="sw-section-title">Exemplos de referência</h2>
        <p style={{ fontSize: '12px', color: '#8f98a0' }}>
          Para referência, observe como jogos como The Phantom Pain, Mortal Kombat e outros utilizam
          artes de biblioteca com logotipos sobrepostos em imagens Hero limpas.
        </p>
      </div>
    </div>
  );
};

export default LibraryTab;

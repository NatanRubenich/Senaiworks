import React, { useState, useCallback } from 'react';
import { gameAPI } from '../../../services/api';
import { STORE_CAPSULES, validateImageDimensions } from '../../../config/constants';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const CapsuleUpload = ({ game, capsuleKey, spec, onSave }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const currentUrl = game.storeGraphics?.[capsuleKey]?.url || '';
  const validated = game.storeGraphics?.[capsuleKey]?.validated || false;

  const processFile = useCallback(async (file) => {
    setError('');
    if (!spec.formats.includes(file.type)) {
      setError('Formato inválido. Apenas JPG e PNG são aceitos.');
      return;
    }
    try {
      const dims = await validateImageDimensions(file, spec.width, spec.height);
      if (!dims.valid) {
        setError(`Dimensões incorretas: ${dims.width}×${dims.height}px. Obrigatório: ${spec.width}×${spec.height}px.`);
        return;
      }
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await gameAPI.uploadImage(game._id, formData);
      await gameAPI.updateStoreGraphics(game._id, {
        capsuleType: capsuleKey,
        imageUrl: uploadRes.data.url,
        validated: true,
      });
      onSave();
    } catch (err) {
      setError(err.message || 'Erro no upload.');
    } finally {
      setUploading(false);
    }
  }, [game._id, capsuleKey, spec, onSave]);

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
      await gameAPI.updateStoreGraphics(game._id, {
        capsuleType: capsuleKey,
        imageUrl: '',
        validated: false,
      });
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div>
          <span style={{ fontWeight: 600, color: '#c7d5e0', fontSize: '13px' }}>{spec.label}</span>
          <span style={{ marginLeft: '8px', fontSize: '11px', color: '#8f98a0' }}>
            {spec.width} × {spec.height} px — JPG ou PNG
          </span>
        </div>
        <span style={{ fontSize: '16px' }}>{validated ? '✅' : currentUrl ? '❌' : '⚠️'}</span>
      </div>

      {currentUrl ? (
        <div className="sw-image-preview" style={{ maxWidth: Math.min(spec.width, 460) + 'px' }}>
          <img src={`${API_BASE}${currentUrl}`} alt={spec.label}
            style={{ width: '100%', display: 'block' }} />
          <button className="preview-remove" onClick={handleRemove} title="Remover">×</button>
        </div>
      ) : (
        <div
          className={`sw-dropzone ${dragOver ? 'drag-over' : ''}`}
          style={{ padding: '20px', maxWidth: Math.min(spec.width, 460) + 'px' }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`file-${capsuleKey}`).click()}
        >
          {uploading ? (
            <div className="sw-spinner" style={{ margin: '0 auto' }}></div>
          ) : (
            <>
              <div className="dropzone-text">Solte a imagem aqui para enviá-la</div>
              <div className="dropzone-hint">{spec.width} × {spec.height} px</div>
            </>
          )}
          <input id={`file-${capsuleKey}`} type="file" accept="image/jpeg,image/png"
            style={{ display: 'none' }} onChange={handleFileSelect} />
        </div>
      )}

      {error && <div className="sw-error-box" style={{ marginTop: '6px' }}>{error}</div>}
    </div>
  );
};

const GraphicsTab = ({ game, onSave }) => {
  const [mode, setMode] = useState('base'); // 'base' or 'temp'

  return (
    <div>
      {/* Drop zone hint */}
      <div style={{
        background: 'rgba(102,192,244,0.08)', border: '2px dashed #66c0f4',
        borderRadius: '4px', padding: '16px', textAlign: 'center', marginBottom: '16px',
      }}>
        <div style={{ color: '#66c0f4', fontSize: '13px', marginBottom: '4px' }}>
          Solte imagens aqui para enviá-las
        </div>
        <div style={{ color: '#66c0f4', fontSize: '12px' }}>
          Usaremos as dimensões da imagem para categorizá-la corretamente abaixo.
        </div>
        <div style={{ color: '#e5c07b', fontSize: '11px', marginTop: '6px' }}>
          Para enviar os recursos gráficos da loja, você deve primeiro selecionar se são versões temporárias para um evento ou promoção,
          ou se atualizará os recursos base a longo prazo.
        </div>
      </div>

      {/* Mode selector */}
      <h3 style={{ fontSize: '14px', color: '#c7d5e0', marginBottom: '12px' }}>
        Selecione o conjunto de recursos gráficos da loja para editar
      </h3>

      <div className="sw-card" style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <label className="sw-checkbox-group">
            <input type="radio" name="graphicsMode" checked={mode === 'temp'}
              onChange={() => setMode('temp')} />
            <span style={{ fontWeight: 500 }}>Criar nova substituição temporária dos recursos gráficos base</span>
          </label>
          {mode === 'temp' && (
            <div style={{ marginLeft: '24px', marginTop: '8px' }}>
              <button className="sw-btn sw-btn-sm sw-btn-green">Criar substituição temporária</button>
            </div>
          )}
        </div>
        <div style={{ flex: 1, fontSize: '12px', color: '#8f98a0', lineHeight: '1.6' }}>
          <h4 style={{ color: '#c7d5e0', fontSize: '13px', marginBottom: '4px' }}>O que é isso?</h4>
          <p>Exiba diferentes recursos gráficos temporariamente para divulgar um evento ou atualização por tempo limitado.
            Defina os horários de início e término e, então, envie as artes de cápsula a serem usadas durante esse período.</p>
        </div>
      </div>

      <div className="sw-card">
        <label className="sw-checkbox-group">
          <input type="radio" name="graphicsMode" checked={mode === 'base'}
            onChange={() => setMode('base')} />
          <span style={{ fontWeight: 500 }}>Atualizar ou ver os recursos gráficos base da loja</span>
        </label>
      </div>

      {/* Capsule uploads */}
      {mode === 'base' && (
        <div className="sw-card">
          <h2 className="sw-section-title">Imagens Obrigatórias da Loja (Capsules)</h2>
          {Object.entries(STORE_CAPSULES).map(([key, spec]) => (
            <CapsuleUpload key={key} game={game} capsuleKey={key} spec={spec} onSave={onSave} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GraphicsTab;

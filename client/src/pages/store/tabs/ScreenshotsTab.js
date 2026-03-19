import React, { useState, useCallback } from 'react';
import { gameAPI } from '../../../services/api';
import { SCREENSHOT_MIN_COUNT, validateScreenshot } from '../../../config/constants';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ScreenshotsTab = ({ game, onSave }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const screenshots = game.screenshots || [];

  const processFile = useCallback(async (file) => {
    setError('');
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Formato inválido. Apenas JPG e PNG são aceitos.');
      return;
    }
    try {
      const dims = await validateScreenshot(file);
      if (!dims.valid) {
        setError(`Resolução incorreta: ${dims.width}×${dims.height}px. Mínimo: 1920×1080px (16:9).`);
        return;
      }
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await gameAPI.uploadImage(game._id, formData);
      await gameAPI.addScreenshot(game._id, {
        url: uploadRes.data.url,
        altText: '',
        ageAppropriate: true,
      });
      onSave();
    } catch (err) {
      setError(err.message || 'Erro no upload.');
    } finally {
      setUploading(false);
    }
  }, [game._id, onSave]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(f => processFile(f));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => processFile(f));
  };

  const handleDelete = async (ssId) => {
    try {
      await gameAPI.deleteScreenshot(game._id, ssId);
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleReorder = async (fromIdx, toIdx) => {
    const reordered = [...screenshots];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    const updated = reordered.map((s, i) => ({ ...s, order: i }));
    try {
      await gameAPI.updateScreenshots(game._id, { screenshots: updated });
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="sw-section-title">
        Capturas<span className="required">*</span>
        <span style={{ fontSize: '12px', color: '#8f98a0', fontWeight: 400, marginLeft: '8px' }}>
          Mínimo de {SCREENSHOT_MIN_COUNT}. Atualmente: {screenshots.length}
        </span>
      </h2>

      {/* Guidelines */}
      <div className="sw-card">
        <table style={{ width: '100%', fontSize: '12px', color: '#8f98a0' }}>
          <tbody>
            <tr><td style={{ width: '120px', padding: '4px 8px', color: '#66c0f4', fontWeight: 500, verticalAlign: 'top' }}>Design</td>
              <td style={{ padding: '4px 8px' }}>Selecione capturas de tela que demonstrem a perspectiva do jogador e a jogabilidade.</td></tr>
            <tr><td style={{ padding: '4px 8px', color: '#66c0f4', fontWeight: 500, verticalAlign: 'top' }}>Formatação</td>
              <td style={{ padding: '4px 8px' }}>Deve ser 16:9 com resolução mínima de 1920×1080px.</td></tr>
            <tr><td style={{ padding: '4px 8px', color: '#66c0f4', fontWeight: 500, verticalAlign: 'top' }}>Conteúdo adulto</td>
              <td style={{ padding: '4px 8px' }}>Marque "Apropriada para todas as idades" se aplicável.</td></tr>
          </tbody>
        </table>
      </div>

      {/* Warning */}
      <div className="sw-warning-box">
        ⚠️ As capturas de tela devem retratar o jogo em si, não artes conceituais, cinemáticas pré-renderizadas ou imagens promocionais.
      </div>

      {error && <div className="sw-error-box">{error}</div>}

      {screenshots.length < SCREENSHOT_MIN_COUNT && (
        <div className="sw-error-box">
          É necessário enviar no mínimo {SCREENSHOT_MIN_COUNT} screenshots para publicar. Faltam {SCREENSHOT_MIN_COUNT - screenshots.length}.
        </div>
      )}

      {/* Accessibility button */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <button className="sw-btn sw-btn-sm sw-btn-secondary">
          Editar descrição de acessibilidade (texto alternativo)
        </button>
      </div>

      {/* Drop zone */}
      <div
        className={`sw-dropzone ${dragOver ? 'drag-over' : ''}`}
        style={{ marginBottom: '16px' }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('screenshot-upload').click()}
      >
        {uploading ? (
          <div className="sw-spinner" style={{ margin: '0 auto' }}></div>
        ) : (
          <>
            <div className="dropzone-text">Solte imagens aqui para enviá-las</div>
            <div className="dropzone-hint">1920×1080px mínimo — Formato 16:9 — JPG ou PNG</div>
          </>
        )}
        <input id="screenshot-upload" type="file" accept="image/jpeg,image/png" multiple
          style={{ display: 'none' }} onChange={handleFileSelect} />
      </div>

      {/* Screenshot list */}
      {screenshots.map((ss, idx) => (
        <div key={ss._id || idx} className="sw-card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ cursor: 'grab', color: '#556772', fontSize: '16px', padding: '8px' }}>☰</div>
          <div style={{ width: '200px', flexShrink: 0 }}>
            <img src={`${API_BASE}${ss.url}`} alt={ss.altText || `Screenshot ${idx + 1}`}
              style={{ width: '100%', borderRadius: '2px', border: '1px solid #2a475e' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: '#8f98a0' }}>Inglês</span>
              <span style={{ fontSize: '12px', color: '#8f98a0' }}>Screenshot</span>
            </div>
            <label className="sw-checkbox-group" style={{ fontSize: '12px' }}>
              <input type="checkbox" checked={ss.ageAppropriate !== false} readOnly />
              Apropriada para todas as idades
            </label>
          </div>
          <div style={{ width: '260px', flexShrink: 0 }}>
            <div className="sw-dropzone" style={{ padding: '12px', fontSize: '11px' }}>
              Solte imagens aqui para adicionar versões traduzidas desta captura de tela
            </div>
          </div>
          <button className="sw-btn sw-btn-sm sw-btn-danger" onClick={() => handleDelete(ss._id)} title="Excluir">
            ×
          </button>
        </div>
      ))}

      {/* Save button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
        <button className="sw-btn sw-btn-green">Save Changes</button>
      </div>
    </div>
  );
};

export default ScreenshotsTab;

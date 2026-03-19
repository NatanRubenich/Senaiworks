import React, { useState } from 'react';
import { gameAPI } from '../../../services/api';
import { LANGUAGES, TRAILER_MAX_SIZE } from '../../../config/constants';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const TRAILER_CATEGORIES = [
  'Selecione uma categoria...',
  'Trailer de gameplay',
  'Trailer cinematográfico',
  'Trailer de lançamento',
  'Trailer de atualização',
  'Teaser',
];

const TrailersTab = ({ game, onSave }) => {
  const [newTrailerName, setNewTrailerName] = useState('');
  const [error, setError] = useState('');
  const trailers = game.trailers || [];

  const handleCreateTrailer = async () => {
    if (!newTrailerName.trim()) return;
    setError('');
    try {
      await gameAPI.addTrailer(game._id, { publicName: newTrailerName.trim() });
      setNewTrailerName('');
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar trailer.');
    }
  };

  const handleDeleteTrailer = async (trailerId) => {
    try {
      await gameAPI.deleteTrailer(game._id, trailerId);
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTrailer = async (index, field, value) => {
    const updated = [...trailers];
    updated[index] = { ...updated[index], [field]: value };
    try {
      await gameAPI.updateTrailers(game._id, { trailers: updated });
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  const handleVideoUpload = async (index, file) => {
    if (file.size > TRAILER_MAX_SIZE) {
      setError(`O arquivo de vídeo excede o limite de ${TRAILER_MAX_SIZE / (1024 * 1024)} MB.`);
      return;
    }
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await gameAPI.uploadVideo(game._id, formData);
      handleUpdateTrailer(index, 'videoUrl', uploadRes.data.url);
    } catch (err) {
      setError('Erro ao fazer upload do vídeo.');
    }
  };

  const handleThumbnailUpload = async (index, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await gameAPI.uploadImage(game._id, formData);
      handleUpdateTrailer(index, 'thumbnailUrl', uploadRes.data.url);
    } catch (err) {
      setError('Erro ao fazer upload da miniatura.');
    }
  };

  return (
    <div>
      {/* Guidelines */}
      <div className="sw-card">
        <h2 className="sw-section-title">Diretrizes e dicas para trailers
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#66c0f4', marginLeft: '8px', cursor: 'pointer' }}>
            Consultar documentação sobre trailers
          </span>
        </h2>
        <table style={{ width: '100%', fontSize: '12px', color: '#8f98a0' }}>
          <tbody>
            <tr>
              <td style={{ width: '140px', padding: '6px 8px', color: '#c7d5e0', fontWeight: 500, verticalAlign: 'top' }}>Enviando trailers:</td>
              <td style={{ padding: '6px 8px' }}>
                O trailer deve ser enviado na maior resolução que tiver (máximo: 1920x1080), com 30/29,97 ou 60/59,94 quadros
                por segundo, alta taxa de bits (5.000+ Kbps) e em um contêiner .mov, .wmv ou .mp4. Preferimos vídeo H.264 e
                áudio AAC. É recomendável o uso do formato 16:9.
              </td>
            </tr>
            <tr>
              <td style={{ padding: '6px 8px', color: '#c7d5e0', fontWeight: 500, verticalAlign: 'top' }}>Configurações avançadas:</td>
              <td style={{ padding: '6px 8px' }}>
                Vídeo base e idioma — A configuração "Vídeo base" agrupa vários trailers, permitindo que a loja escolha
                apenas um dos vídeos dependendo do idioma escolhido pelo usuário.
              </td>
            </tr>
            <tr>
              <td style={{ padding: '6px 8px', color: '#c7d5e0', fontWeight: 500, verticalAlign: 'top' }}>Países:</td>
              <td style={{ padding: '6px 8px' }}>
                Restrições regionais — precisa ser definido apenas caso deseje que o trailer só seja exibido em alguns países.
                Use códigos ISO. (Exemplo: "DE,FR,US,CA,MX")
              </td>
            </tr>
            <tr>
              <td style={{ padding: '6px 8px', color: '#c7d5e0', fontWeight: 500, verticalAlign: 'top' }}>Dicas:</td>
              <td style={{ padding: '6px 8px' }}>
                O primeiro vídeo deve pular para a ação o mais rápido possível. Introduções lentas e dramáticas podem funcionar
                para um trailer cinematográfico no YouTube, mas quem está em busca de algo para comprar tem interesse em ver
                como é a jogabilidade.
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '12px', color: '#8f98a0', marginTop: '8px' }}>
          A loja exibirá os trailers na ordem abaixo. Arraste e solte para reorganizá-los como quiser.
        </p>
      </div>

      {error && <div className="sw-error-box">{error}</div>}

      {/* Create new trailer */}
      <div className="sw-card">
        <h3 style={{ fontSize: '14px', color: '#66c0f4', marginBottom: '8px' }}>Criar novo trailer</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#8f98a0', whiteSpace: 'nowrap' }}>Nome exibido ao público:</span>
          <input type="text" className="sw-input" style={{ flex: 1 }}
            value={newTrailerName} onChange={e => setNewTrailerName(e.target.value)}
            placeholder="Ex: Trailer 1" />
          <button className="sw-btn sw-btn-green sw-btn-sm" onClick={handleCreateTrailer}
            disabled={!newTrailerName.trim()}>
            Criar
          </button>
        </div>
      </div>

      {/* Trailer list */}
      {trailers.map((trailer, idx) => (
        <div key={trailer._id || idx} className="sw-card" style={{ position: 'relative' }}>
          {/* Close button */}
          <button
            onClick={() => handleDeleteTrailer(trailer._id)}
            style={{
              position: 'absolute', top: '8px', right: '8px',
              background: 'none', border: 'none', color: '#8f98a0', fontSize: '18px',
              cursor: 'pointer',
            }}
            title="Remover trailer"
          >×</button>

          <div style={{ display: 'flex', gap: '16px' }}>
            {/* Thumbnail */}
            <div style={{ width: '180px', flexShrink: 0 }}>
              <div style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '4px' }}>Miniatura</div>
              {trailer.thumbnailUrl ? (
                <div className="sw-image-preview" style={{ width: '100%' }}>
                  <img src={`${API_BASE}${trailer.thumbnailUrl}`} alt="Miniatura"
                    style={{ width: '100%', display: 'block' }} />
                </div>
              ) : (
                <div
                  className="sw-dropzone"
                  style={{ padding: '16px', background: 'rgba(102,192,244,0.05)' }}
                  onClick={() => document.getElementById(`trailer-thumb-${idx}`).click()}
                >
                  <div style={{ fontSize: '11px', color: '#66c0f4' }}>
                    Arraste a imagem de 1.920 × 1.080 px até aqui
                  </div>
                  <input id={`trailer-thumb-${idx}`} type="file" accept="image/jpeg,image/png"
                    style={{ display: 'none' }}
                    onChange={e => e.target.files[0] && handleThumbnailUpload(idx, e.target.files[0])} />
                </div>
              )}
            </div>

            {/* Center fields */}
            <div style={{ flex: 1 }}>
              <div className="sw-form-group">
                <label className="sw-label">Nome exibido ao público:</label>
                <input type="text" className="sw-input" value={trailer.publicName || ''}
                  onChange={e => handleUpdateTrailer(idx, 'publicName', e.target.value)} />
                <div style={{ fontSize: '10px', color: '#556772', marginTop: '2px' }}>
                  (exibido apenas caso uma categoria seja selecionada abaixo — os usuários do Steam poderão vê-lo ao passar o mouse)
                </div>
              </div>
              <div className="sw-form-group">
                <label className="sw-label">Categoria:</label>
                <select className="sw-select" value={trailer.category || ''}
                  onChange={e => handleUpdateTrailer(idx, 'category', e.target.value)}>
                  {TRAILER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <label className="sw-checkbox-group" style={{ fontSize: '12px' }}>
                  <input type="checkbox" checked={trailer.visibleInStore !== false}
                    onChange={e => handleUpdateTrailer(idx, 'visibleInStore', e.target.checked)} />
                  Visível na loja
                </label>
                <label className="sw-checkbox-group" style={{ fontSize: '12px' }}>
                  <input type="checkbox" checked={trailer.showBeforeScreenshots || false}
                    onChange={e => handleUpdateTrailer(idx, 'showBeforeScreenshots', e.target.checked)} />
                  Exibir antes de capturas de tela na página da loja
                </label>
                <label className="sw-checkbox-group" style={{ fontSize: '12px' }}>
                  <input type="checkbox" checked={trailer.ageAppropriate !== false}
                    onChange={e => handleUpdateTrailer(idx, 'ageAppropriate', e.target.checked)} />
                  Trailer apropriado para todas as idades
                </label>
              </div>
            </div>

            {/* Right fields */}
            <div style={{ width: '180px', flexShrink: 0 }}>
              <div className="sw-form-group">
                <label className="sw-label">Vídeo base (?):</label>
                <select className="sw-select">
                  <option value="">—</option>
                </select>
              </div>
              <div className="sw-form-group">
                <label className="sw-label">Idioma:</label>
                <select className="sw-select" value={trailer.language || 'Inglês'}
                  onChange={e => handleUpdateTrailer(idx, 'language', e.target.value)}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="sw-form-group">
                <label className="sw-label">Restrições regionais:</label>
                <select className="sw-select" style={{ marginBottom: '4px' }}>
                  <option>Não está em:</option>
                  <option>Apenas em:</option>
                </select>
                <input type="text" className="sw-input" placeholder="ex.: DE,FR,JP"
                  value={trailer.regionalRestrictions || ''}
                  onChange={e => handleUpdateTrailer(idx, 'regionalRestrictions', e.target.value)}
                  style={{ fontSize: '11px' }} />
                <div style={{ fontSize: '10px', color: '#556772', marginTop: '2px' }}>
                  Códigos de país de duas letras separados por vírgulas, sem espaços, usando as listagens oficiais ISO.
                </div>
              </div>
            </div>
          </div>

          {/* Upload video + action buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #2a475e', paddingTop: '12px' }}>
            <div>
              <input type="file" accept="video/mp4,video/quicktime,video/x-ms-wmv,video/webm"
                id={`trailer-video-${idx}`} style={{ display: 'none' }}
                onChange={e => e.target.files[0] && handleVideoUpload(idx, e.target.files[0])} />
              {trailer.videoUrl ? (
                <span style={{ fontSize: '12px', color: '#8bc34a' }}>✅ Vídeo enviado</span>
              ) : (
                <button className="sw-btn sw-btn-sm sw-btn-secondary"
                  onClick={() => document.getElementById(`trailer-video-${idx}`).click()}>
                  Enviar vídeo
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="sw-btn sw-btn-sm sw-btn-green">Salvar</button>
              <button className="sw-btn sw-btn-sm sw-btn-secondary"
                onClick={() => document.getElementById(`trailer-video-${idx}`).click()}>
                Substituir
              </button>
            </div>
          </div>
        </div>
      ))}

      {trailers.length === 0 && (
        <div className="sw-card" style={{ textAlign: 'center', padding: '30px', color: '#556772' }}>
          Nenhum trailer criado. Use o campo acima para criar um novo trailer.
        </div>
      )}
    </div>
  );
};

export default TrailersTab;

import React, { useState, useEffect } from 'react';
import { gameAPI } from '../../../services/api';
import { GENRES, LANGUAGES } from '../../../config/constants';

const BasicDataTab = ({ game, onSave }) => {
  const [form, setForm] = useState({
    gameName: '', appType: 'Game', developerName: '', publisherName: '',
    genres: [], tags: '', languages: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (game?.basicData) {
      setForm({
        gameName: game.basicData.gameName || '',
        appType: game.basicData.appType || 'Game',
        developerName: game.basicData.developerName || '',
        publisherName: game.basicData.publisherName || '',
        genres: game.basicData.genres || [],
        tags: game.basicData.tags || '',
        languages: game.basicData.languages || [],
      });
    }
  }, [game]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setDirty(true);
  };

  const toggleGenre = (genre) => {
    const newGenres = form.genres.includes(genre)
      ? form.genres.filter(g => g !== genre)
      : [...form.genres, genre];
    setForm({ ...form, genres: newGenres });
    setDirty(true);
  };

  const toggleLanguage = (lang) => {
    const newLangs = form.languages.includes(lang)
      ? form.languages.filter(l => l !== lang)
      : [...form.languages, lang];
    setForm({ ...form, languages: newLangs });
    setDirty(true);
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!form.gameName.trim()) {
      return setError('Nome do jogo é obrigatório.');
    }
    setLoading(true);
    try {
      await gameAPI.updateBasicData(game._id, form);
      setSuccess('Dados básicos salvos com sucesso!');
      setDirty(false);
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="sw-section-title">Dados básicos do aplicativo</h2>
      <p className="sw-section-subtitle">Configure as informações principais que serão exibidas na loja.</p>

      {error && <div className="sw-error-box">{error}</div>}
      {success && <div className="sw-success-box">{success}</div>}

      <div className="sw-card">
        <div className="sw-form-group">
          <label className="sw-label">Nome do Jogo <span className="required">*</span></label>
          <input type="text" name="gameName" className="sw-input" value={form.gameName}
            onChange={handleChange} placeholder="Título público exibido na loja" />
        </div>

        <div className="sw-form-group">
          <label className="sw-label">Tipo</label>
          <input type="text" name="appType" className="sw-input" value={form.appType}
            onChange={handleChange} style={{ maxWidth: '200px' }} />
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="sw-form-group" style={{ flex: 1 }}>
            <label className="sw-label">Desenvolvedora</label>
            <input type="text" name="developerName" className="sw-input" value={form.developerName}
              onChange={handleChange} placeholder="Nome da desenvolvedora" />
          </div>
          <div className="sw-form-group" style={{ flex: 1 }}>
            <label className="sw-label">Distribuidora</label>
            <input type="text" name="publisherName" className="sw-input" value={form.publisherName}
              onChange={handleChange} placeholder="Pode ser igual à desenvolvedora" />
          </div>
        </div>

        <div className="sw-form-group">
          <label className="sw-label">Gênero(s)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            {GENRES.map(genre => (
              <div
                key={genre}
                onClick={() => toggleGenre(genre)}
                style={{
                  padding: '5px 12px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer',
                  background: form.genres.includes(genre) ? 'rgba(26,159,255,0.3)' : 'rgba(42,71,94,0.5)',
                  border: `1px solid ${form.genres.includes(genre) ? '#1a9fff' : '#2a475e'}`,
                  color: form.genres.includes(genre) ? '#66c0f4' : '#8f98a0',
                  transition: 'all 0.15s',
                }}
              >
                {genre}
              </div>
            ))}
          </div>
        </div>

        <div className="sw-form-group">
          <label className="sw-label">Palavras-chave / Tags</label>
          <input type="text" name="tags" className="sw-input" value={form.tags}
            onChange={handleChange} placeholder="Separe por vírgulas" />
        </div>

        <div className="sw-form-group">
          <label className="sw-label">Idiomas suportados</label>
          <div style={{ maxHeight: '160px', overflow: 'auto', border: '1px solid #2a475e', borderRadius: '2px', padding: '8px', marginTop: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              {LANGUAGES.map(lang => (
                <label key={lang} className="sw-checkbox-group" style={{ fontSize: '12px' }}>
                  <input type="checkbox" checked={form.languages.includes(lang)}
                    onChange={() => toggleLanguage(lang)} />
                  {lang}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        {dirty && <span style={{ fontSize: '12px', color: '#e5c07b', alignSelf: 'center' }}>⚠️ Alterações não salvas</span>}
        <button className="sw-btn sw-btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
};

export default BasicDataTab;

import React, { useState, useEffect, useRef } from 'react';
import { gameAPI } from '../../../services/api';
import { SHORT_DESCRIPTION_MAX, LANGUAGES } from '../../../config/constants';

const TOOLBAR_BUTTONS = [
  { label: 'B', command: 'bold', title: 'Negrito' },
  { label: 'I', command: 'italic', title: 'Itálico' },
  { label: 'U', command: 'underline', title: 'Sublinhado' },
  { label: 'S', command: 'strikeThrough', title: 'Tachado' },
  { label: 'H2', command: 'heading', title: 'Título' },
  { label: '•', command: 'insertUnorderedList', title: 'Lista com marcadores' },
  { label: '1.', command: 'insertOrderedList', title: 'Lista numerada' },
  { label: '🖼', command: 'insertImage', title: 'Inserir imagem' },
];

const ALIGN_BUTTONS = [
  { label: '⬅', command: 'justifyLeft', title: 'Esquerda' },
  { label: '⬛', command: 'justifyCenter', title: 'Centro' },
  { label: '➡', command: 'justifyRight', title: 'Direita' },
  { label: '☰', command: 'justifyFull', title: 'Justificado' },
];

const DescriptionTab = ({ game, onSave }) => {
  const [longDesc, setLongDesc] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [descLang, setDescLang] = useState('Português (Brasil)');
  const [viewMode, setViewMode] = useState('visual');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [reviews, setReviews] = useState([]);
  const [awards, setAwards] = useState([]);
  const [specialAnnouncements, setSpecialAnnouncements] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (game?.description) {
      setLongDesc(game.description.longDescription || '');
      setShortDesc(game.description.shortDescription || '');
      setDescLang(game.description.descriptionLanguage || 'Português (Brasil)');
      setReviews(game.description.reviews || []);
      setAwards(game.description.awards || []);
      setSpecialAnnouncements(game.description.specialAnnouncements || []);
    }
  }, [game]);

  useEffect(() => {
    if (editorRef.current && viewMode === 'visual') {
      editorRef.current.innerHTML = longDesc;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  const execCommand = (cmd) => {
    if (cmd === 'heading') {
      document.execCommand('formatBlock', false, 'H2');
    } else if (cmd === 'insertImage') {
      const url = prompt('URL da imagem:');
      if (url) document.execCommand('insertImage', false, url);
    } else {
      document.execCommand(cmd, false, null);
    }
    if (editorRef.current) {
      setLongDesc(editorRef.current.innerHTML);
    }
  };

  const handleShortDescChange = (e) => {
    const val = e.target.value;
    if (val.length <= SHORT_DESCRIPTION_MAX) {
      setShortDesc(val);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (shortDesc.length > SHORT_DESCRIPTION_MAX) {
      return setError(`Descrição curta não pode ultrapassar ${SHORT_DESCRIPTION_MAX} caracteres.`);
    }
    setLoading(true);
    try {
      const editorContent = viewMode === 'visual' && editorRef.current
        ? editorRef.current.innerHTML
        : longDesc;
      await gameAPI.updateDescription(game._id, {
        longDescription: editorContent,
        shortDescription: shortDesc,
        descriptionLanguage: descLang,
        reviews,
        awards,
        specialAnnouncements,
      });
      setSuccess('Descrição salva com sucesso!');
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  const charCount = shortDesc.length;
  const isOverLimit = charCount > SHORT_DESCRIPTION_MAX;

  return (
    <div>
      <h2 className="sw-section-title">Sobre este Jogo<span className="required">*</span></h2>

      {error && <div className="sw-error-box">{error}</div>}
      {success && <div className="sw-success-box">{success}</div>}

      {/* Rich Text Info */}
      <div className="sw-card">
        <table style={{ width: '100%', fontSize: '12px', color: '#8f98a0', marginBottom: '12px' }}>
          <tbody>
            <tr><td style={{ width: '120px', verticalAlign: 'top', padding: '4px 8px', color: '#66c0f4', fontWeight: 500 }}>Visão geral</td>
              <td style={{ padding: '4px 8px' }}>Tudo sobre a seção "Sobre este jogo" que aparecerá na página da loja.</td></tr>
            <tr><td style={{ padding: '4px 8px', color: '#66c0f4', fontWeight: 500 }}>Design</td>
              <td style={{ padding: '4px 8px' }}>Permitido: negrito, itálico, sublinhado, tachado, títulos H2, listas, imagens.</td></tr>
            <tr><td style={{ padding: '4px 8px', color: '#66c0f4', fontWeight: 500 }}>Formatação</td>
              <td style={{ padding: '4px 8px' }}>Use as ferramentas da barra para formatar o texto. Alterne entre modo visual e código HTML.</td></tr>
            <tr><td style={{ padding: '4px 8px', color: '#66c0f4', fontWeight: 500 }}>Tradução</td>
              <td style={{ padding: '4px 8px' }}>Selecione o idioma no dropdown abaixo para criar versões traduzidas.</td></tr>
          </tbody>
        </table>

        {/* Upload images section */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            {/* View mode selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {['desktop', 'mobile', 'steamdeck'].map(m => (
                <button key={m} className={`sw-btn sw-btn-sm ${previewMode === m ? 'sw-btn-primary' : 'sw-btn-secondary'}`}
                  onClick={() => setPreviewMode(m)}>
                  {m === 'desktop' ? 'Computador e cliente Steam' : m === 'mobile' ? 'Celular' : 'Steam Deck & Big Picture'}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div style={{
              display: 'flex', gap: '2px', padding: '4px 6px', background: '#2a475e', borderRadius: '2px 2px 0 0',
              borderBottom: '1px solid #3d4f5f', flexWrap: 'wrap', alignItems: 'center'
            }}>
              {TOOLBAR_BUTTONS.map(btn => (
                <button key={btn.command} title={btn.title}
                  onClick={() => execCommand(btn.command)}
                  style={{
                    padding: '4px 8px', background: 'transparent', border: 'none', color: '#c7d5e0',
                    cursor: 'pointer', fontSize: '13px', fontWeight: btn.label === 'B' ? 700 : 400,
                    fontStyle: btn.label === 'I' ? 'italic' : 'normal',
                    textDecoration: btn.label === 'U' ? 'underline' : btn.label === 'S' ? 'line-through' : 'none',
                  }}>
                  {btn.label}
                </button>
              ))}
              <span style={{ width: '1px', height: '20px', background: '#3d4f5f', margin: '0 4px' }}></span>
              {ALIGN_BUTTONS.map(btn => (
                <button key={btn.command} title={btn.title}
                  onClick={() => execCommand(btn.command)}
                  style={{ padding: '4px 8px', background: 'transparent', border: 'none', color: '#c7d5e0', cursor: 'pointer', fontSize: '12px' }}>
                  {btn.label}
                </button>
              ))}
              <span style={{ width: '1px', height: '20px', background: '#3d4f5f', margin: '0 4px' }}></span>
              <button
                onClick={() => setViewMode(viewMode === 'visual' ? 'html' : 'visual')}
                style={{ padding: '4px 8px', background: viewMode === 'html' ? '#1a9fff' : 'transparent', border: 'none', color: '#c7d5e0', cursor: 'pointer', fontSize: '11px', borderRadius: '2px' }}>
                {viewMode === 'visual' ? '<>' : 'Visual'}
              </button>
            </div>

            {/* Editor */}
            {viewMode === 'visual' ? (
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => { if (editorRef.current) setLongDesc(editorRef.current.innerHTML); }}
                style={{
                  minHeight: '200px', padding: '12px', background: '#32404f', border: '1px solid #2a475e',
                  color: '#c7d5e0', fontSize: '13px', lineHeight: '1.6', outline: 'none',
                  borderRadius: '0 0 2px 2px', overflow: 'auto',
                }}
              />
            ) : (
              <textarea
                className="sw-textarea"
                style={{ minHeight: '200px', fontFamily: 'monospace', fontSize: '12px', borderRadius: '0 0 2px 2px' }}
                value={longDesc}
                onChange={e => setLongDesc(e.target.value)}
              />
            )}
          </div>

          <div style={{ width: '240px' }}>
            <h3 style={{ fontSize: '13px', color: '#66c0f4', marginBottom: '8px' }}>Enviar imagens personalizadas</h3>
            <div className="sw-dropzone" style={{ padding: '20px' }}>
              <div className="dropzone-text">Solte imagens aqui</div>
              <div className="dropzone-hint">ou clique para selecionar</div>
              <div className="dropzone-instructions" style={{ marginTop: '6px' }}>
                PNG, JPG, GIF, WebP, MP4 e WebM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Short Description */}
      <div className="sw-card">
        <h2 className="sw-section-title">Descrição curta<span className="required">*</span></h2>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
          <select className="sw-select" style={{ width: '200px' }} value={descLang}
            onChange={e => setDescLang(e.target.value)}>
            {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </div>
        <textarea
          className={`sw-textarea ${isOverLimit ? 'error' : ''}`}
          style={{ minHeight: '80px' }}
          value={shortDesc}
          onChange={handleShortDescChange}
          placeholder="Descreva seu jogo em poucas palavras (recomendado: 200-300 caracteres)"
          maxLength={SHORT_DESCRIPTION_MAX}
        />
        <div className={`sw-char-counter ${isOverLimit ? 'over-limit' : ''}`}>
          {charCount}/{SHORT_DESCRIPTION_MAX}
        </div>
        {isOverLimit && <div className="sw-error-box">A descrição curta ultrapassou o limite de {SHORT_DESCRIPTION_MAX} caracteres.</div>}
      </div>

      {/* Reviews */}
      <div className="sw-card">
        <h2 className="sw-section-title">Análises</h2>
        <button className="sw-btn sw-btn-sm sw-btn-primary" onClick={() => setReviews([...reviews, { source: '', text: '', link: '' }])}>
          Adicionar análises
        </button>
        {reviews.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
            <input className="sw-input" placeholder="Fonte" value={r.source} style={{ flex: 1 }}
              onChange={e => { const nr = [...reviews]; nr[i].source = e.target.value; setReviews(nr); }} />
            <input className="sw-input" placeholder="Texto" value={r.text} style={{ flex: 2 }}
              onChange={e => { const nr = [...reviews]; nr[i].text = e.target.value; setReviews(nr); }} />
            <input className="sw-input" placeholder="Link" value={r.link} style={{ flex: 1 }}
              onChange={e => { const nr = [...reviews]; nr[i].link = e.target.value; setReviews(nr); }} />
            <button className="sw-btn sw-btn-sm sw-btn-danger" onClick={() => setReviews(reviews.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
      </div>

      {/* Awards */}
      <div className="sw-card">
        <h2 className="sw-section-title">Prêmios</h2>
        <button className="sw-btn sw-btn-sm sw-btn-primary" onClick={() => setAwards([...awards, { title: '', description: '' }])}>
          Adicionar premiação
        </button>
        {awards.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
            <input className="sw-input" placeholder="Título" value={a.title} style={{ flex: 1 }}
              onChange={e => { const na = [...awards]; na[i].title = e.target.value; setAwards(na); }} />
            <input className="sw-input" placeholder="Descrição" value={a.description} style={{ flex: 2 }}
              onChange={e => { const na = [...awards]; na[i].description = e.target.value; setAwards(na); }} />
            <button className="sw-btn sw-btn-sm sw-btn-danger" onClick={() => setAwards(awards.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
      </div>

      {/* Special Announcements */}
      <div className="sw-card">
        <h2 className="sw-section-title">Seção de anúncio especial</h2>
        <p style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '8px' }}>
          Ideal para informar sobre edições especiais, DLCs, ofertas de pré-venda ou outros destaques.
        </p>
        <button className="sw-btn sw-btn-sm sw-btn-primary"
          onClick={() => setSpecialAnnouncements([...specialAnnouncements, { title: '', content: '' }])}>
          Adicionar seção
        </button>
        {specialAnnouncements.map((sa, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
            <input className="sw-input" placeholder="Título" value={sa.title} style={{ flex: 1 }}
              onChange={e => { const ns = [...specialAnnouncements]; ns[i].title = e.target.value; setSpecialAnnouncements(ns); }} />
            <input className="sw-input" placeholder="Conteúdo" value={sa.content} style={{ flex: 2 }}
              onChange={e => { const ns = [...specialAnnouncements]; ns[i].content = e.target.value; setSpecialAnnouncements(ns); }} />
            <button className="sw-btn sw-btn-sm sw-btn-danger"
              onClick={() => setSpecialAnnouncements(specialAnnouncements.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button className="sw-btn sw-btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
};

export default DescriptionTab;

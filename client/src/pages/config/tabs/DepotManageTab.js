import React, { useState, useEffect } from 'react';
import { gameAPI } from '../../../services/api';
import { LANGUAGES } from '../../../config/constants';

const DepotManageTab = ({ game, onSave }) => {
  const [depots, setDepots] = useState([]);
  const [manageDLC, setManageDLC] = useState(false);
  const [baseLanguages, setBaseLanguages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (game) {
      setDepots(game.depots || []);
      setManageDLC(game.manageDLCSeparately || false);
      setBaseLanguages(game.baseLanguages || ['Inglês']);
    }
  }, [game]);

  const addDepot = () => {
    const newId = game.appId ? game.appId + depots.length + 1 : Date.now();
    setDepots([...depots, {
      _id: String(newId),
      name: `${game.basicData?.gameName || 'Jogo'} Content`,
      os: 'Windows + Linux + SteamOS',
      architecture: 'Apenas 50 cc 64 bits',
      packagesCount: 1,
    }]);
  };

  const removeDepot = (idx) => {
    setDepots(depots.filter((_, i) => i !== idx));
  };

  const toggleLanguage = (lang) => {
    setBaseLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleSaveDepots = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await gameAPI.updateDepots(game._id, { depots, manageDLCSeparately: manageDLC, baseLanguages });
      setSuccess('Depots salvos com sucesso!');
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLanguages = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await gameAPI.updateDepots(game._id, { depots, manageDLCSeparately: manageDLC, baseLanguages });
      setSuccess('Idiomas salvos com sucesso!');
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="sw-section-title">Gerenciar depots</h2>

      {error && <div className="sw-error-box">{error}</div>}
      {success && <div className="sw-success-box">{success}</div>}

      <div className="sw-card">
        <p style={{ fontSize: '12px', color: '#8f98a0', lineHeight: '1.7', marginBottom: '8px' }}>
          No caso de um conflito, certos depots mapeiam conteúdo no mesmo local do sistema de arquivos do usuário;
          o depot mais recente (último na lista) recebe prioridade entre os demais, e o usuário "receberá" o conteúdo
          de um mais recente do mais antigo.
        </p>
        <p style={{ fontSize: '12px', color: '#8f98a0', lineHeight: '1.7', marginBottom: '8px' }}>
          <strong style={{ color: '#c7d5e0' }}>Idioma:</strong> Especificar um idioma para um depot fará com que o
          seu conteúdo só seja baixado por usuários que estejam usando o cliente Steam nesse idioma.
        </p>
        <p style={{ fontSize: '12px', color: '#8f98a0', lineHeight: '1.7', marginBottom: '12px' }}>
          <strong style={{ color: '#c7d5e0' }}>Arquitetura:</strong> só é necessário especificar a arquitetura de 32
          ou 64 bits se houver depots separados para cada um. Caso contrário, mantenha como [Todas as arquiteturas].
        </p>

        <label className="sw-checkbox-group" style={{ marginBottom: '16px' }}>
          <input type="checkbox" checked={manageDLC} onChange={e => setManageDLC(e.target.checked)} />
          Gerenciar depots de conteúdos adicionais separadamente
        </label>
      </div>

      {/* Configuring depots */}
      <div className="sw-card">
        <h3 style={{ fontSize: '14px', color: '#cf6a32', marginBottom: '8px' }}>Configurando depots</h3>
        <p style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '12px' }}>
          Clique no nome de um depot para editá-lo. Acesse os depots para reorganizá-los.
        </p>

        {depots.map((depot, idx) => (
          <div key={depot._id || idx} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 12px', background: 'rgba(42,71,94,0.2)', border: '1px solid #2a475e',
            borderRadius: '2px', marginBottom: '4px',
          }}>
            <div style={{ flex: 1 }}>
              <span style={{ color: '#66c0f4', fontSize: '12px', fontWeight: 500 }}>
                {game.appId + idx + 1}
              </span>
              <span style={{ color: '#c7d5e0', fontSize: '12px', marginLeft: '8px' }}>
                "{depot.name}"
              </span>
              <span style={{ color: '#8f98a0', fontSize: '11px', marginLeft: '8px' }}>
                Referenciado por {depot.packagesCount} pacote(s)
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#8f98a0', marginRight: '12px' }}>
              Sistema operacional: {depot.os}. Arquitetura: {depot.architecture}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="sw-btn sw-btn-sm sw-btn-primary">Editar</button>
              <button className="sw-btn sw-btn-sm sw-btn-danger" onClick={() => removeDepot(idx)}>Remover</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create depot buttons */}
      <div className="sw-card">
        <h3 style={{ fontSize: '14px', color: '#cf6a32', marginBottom: '8px' }}>Criação e adição de depots</h3>
        <p style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '12px', lineHeight: '1.6' }}>
          Após criar um novo depot, você precisará adicionar-lhe os pacotes que deverão contê-lo. Para pacotes,
          adicione-o aos pacotes de desenvolvimento. Para lançamento, adicione-o a seus pacotes na loja e pacotes
          adicionais que podem ser atribuídos com códigos ou com a compra do jogo.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="sw-btn sw-btn-sm sw-btn-green" onClick={addDepot}>
            Adicionar novo depot
          </button>
          <button className="sw-btn sw-btn-sm sw-btn-primary">
            Adicionar conteúdo adicional (associar ao depot principal)
          </button>
          <button className="sw-btn sw-btn-sm sw-btn-primary">
            Adicionar depot compartilhado
          </button>
        </div>
      </div>

      {/* Save depots */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', color: '#66c0f4', marginBottom: '4px' }}>Salvar alterações em depots</p>
        <p style={{ fontSize: '11px', color: '#8f98a0', marginBottom: '8px' }}>
          Salve depots criados, adicionados ou editados antes de continuar.
        </p>
        <button className="sw-btn sw-btn-green" onClick={handleSaveDepots} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {/* Base Languages */}
      <div className="sw-card">
        <h3 className="sw-section-title" style={{ fontSize: '14px' }}>Gerenciar idiomas base<span className="required">*</span></h3>
        <p style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '8px', lineHeight: '1.6' }}>
          Caso o seu depot base contenha mais idiomas específicos (Todos os idiomas) acima e o mesmo contenha mais de um idioma,
          a aplicação pode chamar a função GetCurrentGameLanguage() para detectar o idioma atual do Steam.
        </p>
        <p style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '12px' }}>
          Para mais detalhes, consulte o artigo Trocas e idiomas.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
          {LANGUAGES.map(lang => (
            <label key={lang} className="sw-checkbox-group" style={{ fontSize: '12px' }}>
              <input type="checkbox" checked={baseLanguages.includes(lang)}
                onChange={() => toggleLanguage(lang)} />
              {lang}
            </label>
          ))}
        </div>

        <div style={{ marginTop: '12px' }}>
          <button className="sw-btn sw-btn-green" onClick={handleSaveLanguages} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepotManageTab;

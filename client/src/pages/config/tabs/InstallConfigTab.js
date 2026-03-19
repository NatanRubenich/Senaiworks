import React, { useState, useEffect } from 'react';
import { gameAPI } from '../../../services/api';
import { LANGUAGES, OS_OPTIONS, LAUNCH_TYPES, CPU_ARCHITECTURES } from '../../../config/constants';

const emptyLaunchOption = () => ({
  executable: '',
  launchType: 'Iniciar (padrão)',
  descriptionLang: 'Inglês',
  description: '',
  os: 'Windows',
  cpuArch: 'Apenas de 64 bits',
});

const InstallConfigTab = ({ game, onSave }) => {
  const [installFolder, setInstallFolder] = useState('');
  const [launchOptions, setLaunchOptions] = useState([]);
  const [advancedGetLaunchCmd, setAdvancedGetLaunchCmd] = useState(false);
  const [advancedOverrideRes, setAdvancedOverrideRes] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (game?.installConfig) {
      setInstallFolder(game.installConfig.installFolder || game.basicData?.gameName || '');
      setLaunchOptions(game.installConfig.launchOptions?.length > 0
        ? game.installConfig.launchOptions
        : [emptyLaunchOption()]);
      setAdvancedGetLaunchCmd(game.installConfig.advancedGetLaunchCmd || false);
      setAdvancedOverrideRes(game.installConfig.advancedOverrideRes || false);
    }
  }, [game]);

  const updateLaunchOption = (idx, field, value) => {
    const updated = [...launchOptions];
    updated[idx] = { ...updated[idx], [field]: value };
    setLaunchOptions(updated);
  };

  const addLaunchOption = () => {
    setLaunchOptions([...launchOptions, emptyLaunchOption()]);
  };

  const removeLaunchOption = (idx) => {
    if (launchOptions.length <= 1) return;
    setLaunchOptions(launchOptions.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    const hasExe = launchOptions.some(lo => lo.executable.trim());
    if (!hasExe) {
      return setError('É necessário configurar ao menos uma opção de inicialização com executável.');
    }
    setLoading(true);
    try {
      await gameAPI.updateInstallConfig(game._id, {
        installFolder,
        launchOptions,
        advancedGetLaunchCmd,
        advancedOverrideRes,
      });
      setSuccess('Configurações de instalação salvas com sucesso!');
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="sw-section-title">Configurações gerais de Instalação</h2>
      <p className="sw-section-subtitle">Editar configurações básicas do jogo.</p>

      {error && <div className="sw-error-box">{error}</div>}
      {success && <div className="sw-success-box">{success}</div>}

      {/* Install folder */}
      <div className="sw-card">
        <h3 className="sw-section-title" style={{ fontSize: '14px' }}>Pasta de instalação</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#8f98a0' }}>Pasta de instalação atual:</span>
          <input type="text" className="sw-input" style={{ maxWidth: '300px' }}
            value={installFolder} onChange={e => setInstallFolder(e.target.value)} />
          <span style={{ fontSize: '11px', color: '#556772' }}>(r)</span>
        </div>
        <button className="sw-btn sw-btn-sm sw-btn-secondary" style={{ marginTop: '8px' }}>
          Alterar pasta de instalação
        </button>
      </div>

      {/* Launch Options */}
      <div className="sw-card">
        <h3 className="sw-section-title" style={{ fontSize: '14px' }}>
          Opções de inicialização<span className="required">*</span>
        </h3>
        <p style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '8px' }}>
          É necessário configurar ao menos uma opção de inicialização para que o Steam saiba que ação tomar
          quando os usuários tentarem iniciar o aplicativo.
        </p>
        <p style={{ fontSize: '12px', color: '#cf6a32', marginBottom: '16px' }}>
          * Indica campos obrigatórios
        </p>

        {launchOptions.map((lo, idx) => (
          <div key={idx} style={{
            border: '1px solid #2a475e', borderRadius: '2px', padding: '12px',
            marginBottom: '12px', background: 'rgba(42,71,94,0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#8f98a0', textTransform: 'uppercase' }}>
                Opção de Inicialização {idx}:
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="sw-btn sw-btn-sm sw-btn-primary">Editar</button>
                <button className="sw-btn sw-btn-sm sw-btn-danger"
                  onClick={() => removeLaunchOption(idx)}
                  disabled={launchOptions.length <= 1}>
                  Excluir
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr', gap: '8px', alignItems: 'start' }}>
              {/* Executable */}
              <label className="sw-label" style={{ textAlign: 'right', paddingTop: '8px' }}>
                Executável<span className="required">*</span>
              </label>
              <div>
                <input type="text" className="sw-input" value={lo.executable}
                  onChange={e => updateLaunchOption(idx, 'executable', e.target.value)}
                  placeholder="Ex: MeuJogo.exe" />
              </div>
              <div style={{ fontSize: '11px', color: '#8f98a0', paddingTop: '8px', lineHeight: '1.5' }}>
                Informe que executável rodar quando um usuário tentar iniciar o aplicativo.
                Caso o seu executável esteja em um subdiretório, inclua o caminho relativo antes do nome do mesmo.
              </div>

              {/* Launch Type */}
              <label className="sw-label" style={{ textAlign: 'right', paddingTop: '8px' }}>
                Tipo de inicialização
              </label>
              <select className="sw-select" value={lo.launchType}
                onChange={e => updateLaunchOption(idx, 'launchType', e.target.value)}>
                {LAUNCH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div style={{ fontSize: '11px', color: '#8f98a0', paddingTop: '8px' }}>
                Selecione o componente ou versão do aplicativo que será iniciada por esta opção.
              </div>

              {/* Description Language */}
              <label className="sw-label" style={{ textAlign: 'right', paddingTop: '8px' }}>Descrição</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select className="sw-select" style={{ width: '120px' }} value={lo.descriptionLang}
                  onChange={e => updateLaunchOption(idx, 'descriptionLang', e.target.value)}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <input type="text" className="sw-input" value={lo.description}
                  onChange={e => updateLaunchOption(idx, 'description', e.target.value)}
                  placeholder="Descrição visível ao usuário" />
              </div>
              <div style={{ fontSize: '11px', color: '#8f98a0', paddingTop: '8px' }}>
                Exibida a usuários ao tentarem iniciar o aplicativo caso haja mais de uma opção de inicialização e o sistema operacional atual.
              </div>

              {/* OS */}
              <label className="sw-label" style={{ textAlign: 'right', paddingTop: '8px' }}>Sistema operacional</label>
              <select className="sw-select" value={lo.os}
                onChange={e => updateLaunchOption(idx, 'os', e.target.value)}>
                {OS_OPTIONS.filter(o => o !== 'Android').map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <div style={{ fontSize: '11px', color: '#8f98a0', paddingTop: '8px' }}>
                Selecione o sistema operacional no que essa opção de inicialização deverá funcionar.
              </div>

              {/* CPU Arch */}
              <label className="sw-label" style={{ textAlign: 'right', paddingTop: '8px' }}>Arquitetura da CPU</label>
              <select className="sw-select" value={lo.cpuArch}
                onChange={e => updateLaunchOption(idx, 'cpuArch', e.target.value)}>
                {CPU_ARCHITECTURES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <div style={{ fontSize: '11px', color: '#8f98a0', paddingTop: '8px' }}>
                Selecione a arquitetura da CPU na que essa opção de inicialização deverá funcionar.
                Caso ofereça opções de inicialização exclusivas para sistemas de 64 bits, não inclua opções exclusivas para sistemas de 32 bits e vice-versa/outras.
              </div>
            </div>
          </div>
        ))}

        <button className="sw-btn sw-btn-sm sw-btn-green" onClick={addLaunchOption}>
          Adicionar nova opção de inicialização
        </button>
      </div>

      {/* Advanced Options */}
      <div className="sw-card">
        <h3 className="sw-section-title" style={{ fontSize: '14px' }}>Opções avançadas</h3>
        <p style={{ fontSize: '12px', color: '#8f98a0', marginBottom: '8px' }}>
          Use as opções avançadas com cautela. Fale com suas discussões do grupo de desenvolvedores Steamworks antes de
          usá-las a não ser que já esteja familiarizado.
        </p>
        <label className="sw-checkbox-group" style={{ opacity: 0.6 }}>
          <input type="checkbox" checked={advancedGetLaunchCmd}
            onChange={e => setAdvancedGetLaunchCmd(e.target.checked)} />
          Ativar uso da função ISteamApps::GetLaunchCommandLine(); o que dizer será o altera no Steam quando o jogo for
          iniciado com uma lista de comandos.
        </label>
        <label className="sw-checkbox-group" style={{ opacity: 0.6 }}>
          <input type="checkbox" checked={advancedOverrideRes}
            onChange={e => setAdvancedOverrideRes(e.target.checked)} />
          Substituir resolução para telas externas (Steam Deck) 16
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button className="sw-btn sw-btn-green" onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Configurações de Instalação'}
        </button>
      </div>
    </div>
  );
};

export default InstallConfigTab;

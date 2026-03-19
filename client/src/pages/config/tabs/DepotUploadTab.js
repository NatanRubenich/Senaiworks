import React, { useState } from 'react';
import { gameAPI } from '../../../services/api';
import { BUILD_MAX_SIZE, BUILD_SMALL_WARNING } from '../../../config/constants';

const DepotUploadTab = ({ game, onSave }) => {
  const [uploadMode, setUploadMode] = useState('standard');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warning, setWarning] = useState('');

  const depotName = `${game.basicData?.gameName || 'Jogo'} Content`;
  const depotId = game.appId ? game.appId + 1 : '—';

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError('');
    setWarning('');
    setSuccess('');

    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'zip') {
      setError('Formato inválido. Apenas arquivos .zip são aceitos para upload via web.');
      setSelectedFile(null);
      return;
    }

    if (file.size > BUILD_MAX_SIZE) {
      setError(`O arquivo excede o limite de ${BUILD_MAX_SIZE / (1024 * 1024)} MB.`);
      setSelectedFile(null);
      return;
    }

    if (file.size < BUILD_SMALL_WARNING) {
      setWarning('Aviso: O arquivo parece muito pequeno para um jogo completo. Verifique se enviou a build correta.');
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const uploadRes = await gameAPI.uploadBuild(game._id, formData);

      await gameAPI.updateBuildUpload(game._id, {
        depotName,
        fileName: selectedFile.name,
        fileUrl: uploadRes.data.url,
        fileSize: selectedFile.size,
        uploadMode,
      });

      setSuccess(`Build enviada com sucesso para o depot "${depotName}" (${depotId}).`);
      setSelectedFile(null);
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2 className="sw-section-title">Enviar depots por HTTP</h2>

      {error && <div className="sw-error-box">{error}</div>}
      {success && <div className="sw-success-box">{success}</div>}
      {warning && <div className="sw-warning-box">{warning}</div>}

      <div className="sw-card">
        <p style={{ fontSize: '12px', color: '#8f98a0', lineHeight: '1.7', marginBottom: '12px' }}>
          O conteúdo de depots deve ser enviado como arquivos ZIP. Caso o conteúdo comprimido ultrapasse 2.048 MB,
          use a ferramenta steamcmd para enviar depots maiores. Uma versão é composta por um ou mais depots enviados.
        </p>

        <p style={{ fontSize: '12px', color: '#8f98a0', lineHeight: '1.7', marginBottom: '12px' }}>
          A opção <strong style={{ color: '#c7d5e0' }}>Padrão</strong> realizará a atualização típica de depot,
          substituindo o depot existente pelo depot enviado. Suponha, por exemplo, que você possui uma versão no ar
          com um depot contendo os arquivos A, B e C. Ao enviar um depot novo com um arquivo C atualizado e um
          arquivo D novo usando a opção "Padrão", os arquivos A e B serão removidos, o arquivo C será atualizado,
          e o arquivo D será adicionado ao depot resultante.
        </p>

        <p style={{ fontSize: '12px', color: '#8f98a0', lineHeight: '1.7', marginBottom: '16px' }}>
          A opção <strong style={{ color: '#c7d5e0' }}>Mesclar c/ atual</strong> atualizará e adicionará os arquivos
          ao depot. Os arquivos A e B serão mantidos, o arquivo C será atualizado, e o arquivo D será adicionado ao
          depot resultante.
        </p>

        <div style={{
          background: 'rgba(42,71,94,0.3)', border: '1px solid #2a475e', borderRadius: '2px',
          padding: '12px', display: 'flex', gap: '12px', alignItems: 'center',
        }}>
          <span style={{ fontSize: '12px', color: '#8f98a0', whiteSpace: 'nowrap' }}>
            Enviar para depot "{depotName}" ({depotId}):
          </span>
          <label className="sw-btn sw-btn-sm sw-btn-secondary" style={{ cursor: 'pointer' }}>
            Escolher arquivo
            <input type="file" accept=".zip" style={{ display: 'none' }} onChange={handleFileSelect} />
          </label>
          <span style={{ fontSize: '12px', color: '#8f98a0' }}>
            {selectedFile ? selectedFile.name : 'Nenhum arquivo escolhido'}
          </span>
          <select className="sw-select" style={{ width: '160px' }} value={uploadMode}
            onChange={e => setUploadMode(e.target.value)}>
            <option value="standard">Padrão</option>
            <option value="merge">Mesclar c/ atual</option>
          </select>
          <button className="sw-btn sw-btn-green sw-btn-sm" onClick={handleUpload}
            disabled={!selectedFile || uploading}>
            {uploading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>

        {/* Current build info */}
        {game.buildUpload?.fileName && (
          <div className="sw-success-box" style={{ marginTop: '12px' }}>
            Último upload: <strong>{game.buildUpload.fileName}</strong> —{' '}
            {(game.buildUpload.fileSize / (1024 * 1024)).toFixed(2)} MB —{' '}
            Modo: {game.buildUpload.uploadMode === 'merge' ? 'Mesclar c/ atual' : 'Padrão'} —{' '}
            {game.buildUpload.uploadedAt ? new Date(game.buildUpload.uploadedAt).toLocaleString('pt-BR') : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepotUploadTab;

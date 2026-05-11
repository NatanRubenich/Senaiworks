import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit3, BookmarkCheck, Settings, Library as LibraryIcon } from 'lucide-react';
import { useAuth } from '../../controllers/AuthContext';
import { libraryModel } from '../../models/library.model';
import { LibraryGameCard } from '../components/GameCard';

const TABS = [
  { key: 'library', label: 'Minha Biblioteca', icon: LibraryIcon },
  { key: 'settings', label: 'Configurações', icon: Settings },
];

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'library';
  const [library, setLibrary] = useState([]);
  const [loadingLib, setLoadingLib] = useState(true);

  useEffect(() => {
    if (!user) return;
    libraryModel
      .getMine()
      .then((res) => setLibrary(res.data.library || []))
      .catch(() => setLibrary([]))
      .finally(() => setLoadingLib(false));
  }, [user]);

  const handlePlay = async (game) => {
    if (!game.downloadAvailable) {
      alert('Este jogo ainda não tem build disponível para download.');
      return;
    }
    try {
      const res = await libraryModel.download(game.appId);
      const a = document.createElement('a');
      a.href = res.data.url.startsWith('http') ? res.data.url : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${res.data.url}`;
      a.download = res.data.fileName || 'build.zip';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao baixar o jogo.');
    }
  };

  if (!user) return null;

  return (
    <div>
      {/* Hero Profile Banner */}
      <section className="relative w-full h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-primary-gradient">
          <div className="w-full h-full opacity-20 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-surface to-transparent" />
      </section>

      {/* Profile Info */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="p-2 bg-surface rounded-xl shadow-xl">
            <div className="w-40 h-40 rounded-lg bg-primary-gradient flex items-center justify-center text-white font-headline font-black text-6xl">
              {user.email?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
          <div className="flex-1 pb-4 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface line-clamp-1">
                {user.email?.split('@')[0]?.replace(/\./g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </h1>
              <span className="bg-secondary-container text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                {user.role === 'developer' ? 'Desenvolvedor' : user.role === 'admin' ? 'Administrador' : 'Jogador'}
              </span>
            </div>
            <p className="text-on-surface-variant font-medium mt-1">
              Membro desde{' '}
              {new Date(user.createdAt || Date.now()).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex gap-3 pb-4">
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-surface-container-highest text-primary-container font-bold px-6 py-2.5 rounded-lg hover:bg-error/10 hover:text-error transition-all active:scale-95"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 flex gap-8 border-b border-surface-variant overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setSearchParams({ tab: t.key }, { replace: true })}
                className={`flex items-center gap-2 pb-4 px-2 font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'text-primary-container border-b-2 border-secondary-container'
                    : 'text-on-surface-variant hover:text-primary-container'
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* TAB CONTENT */}
      {tab === 'library' && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-6 bg-secondary-container rounded-full" />
            <h2 className="font-headline text-2xl font-bold">Sua Biblioteca</h2>
            <span className="text-on-surface-variant ml-2">{library.length} jogo(s)</span>
          </div>

          {loadingLib ? (
            <p className="text-center text-on-surface-variant py-16">Carregando biblioteca…</p>
          ) : library.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-surface-container-low rounded-xl py-16 text-center"
            >
              <BookmarkCheck className="mx-auto text-outline mb-4" size={48} />
              <h3 className="font-headline text-xl font-bold mb-2">Sua biblioteca está vazia</h3>
              <p className="text-on-surface-variant mb-6">Explore o catálogo e adicione jogos gratuitos à sua coleção.</p>
              <Link to="/catalogo" className="btn-primary inline-flex">
                Explorar Catálogo
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {library.map((g) => (
                <LibraryGameCard key={g.appId} game={g} onPlay={handlePlay} hours={g.downloadCount * 1.5} />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'settings' && (
        <section className="bg-surface-container-low py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-6 bg-secondary-container rounded-full" />
                  <h2 className="font-headline text-2xl font-bold">Configurações da Conta</h2>
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  Veja suas informações de conta. Alterações de senha são feitas no painel SenaiWorks.
                </p>
              </div>
              <div className="lg:w-2/3 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Email Principal" value={user.email} disabled />
                    <Field
                      label="Tipo de Conta"
                      value={user.role === 'developer' ? 'Desenvolvedor' : user.role === 'admin' ? 'Administrador' : 'Jogador'}
                      disabled
                    />
                  </div>
                  {user.identity?.legalName && (
                    <Field label="Nome Legal" value={user.identity.legalName} disabled />
                  )}
                  <hr className="border-surface-variant/50" />
                  <div className="flex justify-end gap-3">
                    <Link
                      to="/"
                      className="text-on-surface-variant font-bold px-6 py-2.5 hover:bg-surface-variant/20 rounded-lg transition-colors"
                    >
                      Voltar
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                      type="button"
                      className="bg-error/10 text-error font-bold px-6 py-2.5 rounded-lg hover:bg-error hover:text-white transition-all active:scale-95"
                    >
                      Sair da Conta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const Field = ({ label, value, disabled }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold tracking-wider uppercase text-on-surface-variant">{label}</label>
    <input
      disabled={disabled}
      value={value || ''}
      readOnly
      className="bg-surface-container-high border-none rounded-lg p-3 text-on-surface-variant font-medium cursor-not-allowed outline-none"
    />
  </div>
);

export default ProfilePage;

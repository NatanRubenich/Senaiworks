import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bolt, Sparkles, ChevronRight, Swords, Compass, Trophy, Map, Brain, Gamepad2 } from 'lucide-react';
import { gameModel } from '../../models/game.model';
import { resolveImage } from '../../config/api';
import { VerticalGameCard, CompactGameCard } from '../components/GameCard';

const CATEGORIES = [
  { key: 'Ação', label: 'Ação', icon: Swords },
  { key: 'RPG', label: 'RPG', icon: Gamepad2 },
  { key: 'Esporte', label: 'Esportes', icon: Trophy },
  { key: 'Estratégia', label: 'Estratégia', icon: Map },
  { key: 'Puzzle', label: 'Puzzle', icon: Brain },
  { key: 'Aventura', label: 'Aventura', icon: Compass },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ hero: [], featured: [], newReleases: [] });
  const [activeHero, setActiveHero] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameModel
      .featured()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Auto-rotate hero
  useEffect(() => {
    if (!data.hero?.length) return;
    const id = setInterval(() => {
      setActiveHero((i) => (i + 1) % data.hero.length);
    }, 6000);
    return () => clearInterval(id);
  }, [data.hero?.length]);

  const goCategory = useCallback((cat) => navigate(`/catalogo?genero=${encodeURIComponent(cat)}`), [navigate]);

  return (
    <div className="max-w-[1920px] mx-auto px-6 lg:px-12 space-y-20 py-8">
      {/* HERO */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 relative h-[600px] rounded-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {data.hero?.[activeHero] ? (
              <HeroSlide key={data.hero[activeHero].appId} game={data.hero[activeHero]} />
            ) : (
              <div className="absolute inset-0 bg-primary-gradient flex items-center justify-center text-white">
                {loading ? 'Carregando jogos…' : 'Nenhum jogo aprovado ainda. Em breve!'}
              </div>
            )}
          </AnimatePresence>
          {/* Indicators */}
          {data.hero?.length > 1 && (
            <div className="absolute bottom-6 right-6 flex gap-2 z-20">
              {data.hero.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveHero(i)}
                  className={`w-8 h-1.5 rounded-full transition-colors ${
                    i === activeHero ? 'bg-secondary-container' : 'bg-white/40'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Side thumbnails */}
        <div className="hidden lg:flex flex-col gap-4">
          {(data.hero || []).slice(0, 4).map((g, i) => (
            <SideThumb
              key={g.appId}
              game={g}
              active={i === activeHero}
              onClick={() => setActiveHero(i)}
            />
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-secondary-container rounded-full" />
            <h2 className="font-headline text-3xl font-black text-primary-container uppercase tracking-tight">
              Destaques da Semana
            </h2>
          </div>
          <Link to="/catalogo" className="text-primary-container font-bold hover:underline flex items-center gap-1">
            Ver tudo <ChevronRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.featured?.slice(0, 4).map((g, i) => (
            <VerticalGameCard key={g.appId} game={g} index={i} />
          ))}
          {!loading && !data.featured?.length && (
            <div className="col-span-4 text-center text-on-surface-variant py-12">
              Nenhum jogo aprovado disponível ainda. Aguarde os lançamentos!
            </div>
          )}
        </div>
      </section>

      {/* OFERTAS / FREE-TO-PLAY */}
      <section className="bg-surface-container-low -mx-6 lg:-mx-12 px-6 lg:px-12 py-16">
        <div className="flex items-center gap-4 mb-10">
          <Bolt className="text-secondary-container" size={32} fill="currentColor" />
          <h2 className="font-headline text-3xl font-black text-primary-container uppercase tracking-tight">
            Free-to-Play em Destaque
          </h2>
          <span className="bg-secondary-container text-white px-3 py-1 rounded text-sm font-bold animate-pulse">
            100% GRÁTIS
          </span>
        </div>
        <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x">
          {data.newReleases?.length ? (
            data.newReleases.map((g) => <CompactGameCard key={g.appId} game={g} />)
          ) : (
            <p className="text-on-surface-variant">Sem títulos disponíveis no momento.</p>
          )}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="space-y-12 pb-12">
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-primary-container rounded-full" />
          <h2 className="font-headline text-3xl font-black text-primary-container uppercase tracking-tight">
            Categorias Populares
          </h2>
          <Sparkles className="text-secondary-container" size={20} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              key={key}
              onClick={() => goCategory(key)}
              className="group flex flex-col items-center justify-center p-8 bg-surface-container-lowest rounded-xl hover:bg-primary-container transition-colors duration-300 shadow-sm"
            >
              <Icon className="text-secondary-container group-hover:text-white transition-colors mb-4" size={36} />
              <span className="font-bold uppercase text-xs tracking-widest text-primary-container group-hover:text-white transition-colors">
                {label}
              </span>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
};

const HeroSlide = ({ game }) => {
  const bg =
    resolveImage(game.libraryAssets?.libraryHero?.url) ||
    resolveImage(game.storeGraphics?.mainCapsule?.url);
  const genre = game.basicData?.genres?.[0] || 'Jogo';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0"
    >
      {bg ? (
        <img src={bg} alt={game.basicData?.gameName} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-primary-gradient" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-primary-container/40 to-transparent" />
      <div className="absolute bottom-12 left-12 right-12 flex flex-col items-start space-y-6 z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-overlay p-8 rounded-xl max-w-2xl border border-white/20"
        >
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-secondary-container text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              Destaque
            </span>
            <span className="px-3 py-1 bg-white/30 backdrop-blur-md text-on-surface text-[10px] font-bold uppercase tracking-widest rounded-full">
              {genre} · GRÁTIS
            </span>
          </div>
          <h1 className="font-headline text-4xl lg:text-6xl font-black text-primary-container tracking-tight mb-4 line-clamp-2">
            {game.basicData?.gameName || 'SenaiWorks Game'}
          </h1>
          <p className="text-on-surface-variant font-medium leading-relaxed mb-6 line-clamp-3">
            {game.description?.shortDescription || 'Jogo educacional desenvolvido por alunos do SENAI.'}
          </p>
          <div className="flex items-center gap-4">
            <Link to={`/jogo/${game.appId}`} className="btn-primary flex items-center gap-2">
              Ver na Loja →
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const SideThumb = ({ game, active, onClick }) => {
  const cover =
    resolveImage(game.storeGraphics?.verticalCapsule?.url) ||
    resolveImage(game.storeGraphics?.mainCapsule?.url);
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl p-4 flex items-center gap-4 transition-all text-left ${
        active
          ? 'bg-surface-container-lowest border-l-4 border-secondary-container shadow-sm'
          : 'bg-surface-container-low hover:bg-surface-container-lowest'
      }`}
    >
      <div className="w-20 h-24 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0">
        {cover ? (
          <img src={cover} alt={game.basicData?.gameName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary-gradient" />
        )}
      </div>
      <div className="min-w-0">
        <h3
          className={`font-headline text-sm font-bold line-clamp-1 ${
            active ? 'text-primary-container' : 'text-on-surface-variant'
          }`}
        >
          {game.basicData?.gameName || 'Jogo'}
        </h3>
        <p className="text-xs text-on-surface-variant">Já disponível</p>
      </div>
    </button>
  );
};

export default HomePage;

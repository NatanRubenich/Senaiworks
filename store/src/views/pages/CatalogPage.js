import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Check, Filter, X } from 'lucide-react';
import { gameModel } from '../../models/game.model';
import { HorizontalGameCard } from '../components/GameCard';

const GENRES = ['Ação', 'Aventura', 'RPG', 'Estratégia', 'Simulação', 'Esporte', 'Casual', 'Corrida', 'Puzzle'];
const SORT_OPTIONS = [
  { key: '', label: 'Mais Recentes' },
  { key: 'oldest', label: 'Mais Antigos' },
  { key: 'name', label: 'A → Z' },
];

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialQ = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genero') || '';
  const initialSort = searchParams.get('sort') || '';

  const [q, setQ] = useState(initialQ);
  const [genres, setGenres] = useState(initialGenre ? [initialGenre] : []);
  const [sort, setSort] = useState(initialSort);

  // Sync URL params
  useEffect(() => {
    const params = {};
    if (q) params.q = q;
    if (genres[0]) params.genero = genres[0];
    if (sort) params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [q, genres, sort, setSearchParams]);

  // Fetch games (server filters by single genre and search)
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (q) params.search = q;
    if (genres[0]) params.genre = genres[0];
    if (sort) params.sort = sort;
    gameModel
      .list(params)
      .then((res) => setGames(res.data.games || []))
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, [q, genres, sort]);

  // Client filter for additional genres if multi-select
  const filtered = useMemo(() => {
    if (genres.length <= 1) return games;
    return games.filter((g) => g.basicData?.genres?.some((x) => genres.includes(x)));
  }, [games, genres]);

  const toggleGenre = (g) => {
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const clearFilters = () => {
    setQ('');
    setGenres([]);
    setSort('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-10">
        <FilterSection title="Gêneros">
          <ul className="flex flex-col gap-3">
            {GENRES.map((g) => (
              <li key={g}>
                <button
                  onClick={() => toggleGenre(g)}
                  className="flex items-center gap-3 cursor-pointer group w-full text-left"
                >
                  <div
                    className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                      genres.includes(g)
                        ? 'border-secondary-container bg-secondary-container'
                        : 'border-outline-variant group-hover:border-secondary-container'
                    }`}
                  >
                    {genres.includes(g) && <Check className="text-white" size={14} />}
                  </div>
                  <span
                    className={`transition-colors ${
                      genres.includes(g)
                        ? 'text-on-surface font-semibold'
                        : 'text-on-surface-variant group-hover:text-on-surface'
                    }`}
                  >
                    {g}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </FilterSection>

        {(q || genres.length > 0 || sort) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-secondary-container font-bold text-sm hover:underline"
          >
            <X size={14} /> Limpar filtros
          </button>
        )}
      </aside>

      {/* Main content */}
      <section className="flex-grow">
        {/* Search bar */}
        <div className="mb-12">
          <div className="relative group">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="Buscar por títulos, gêneros ou desenvolvedores..."
              className="w-full bg-surface-container-high border-none rounded-xl py-5 px-14 focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all duration-300 font-body text-lg shadow-sm outline-none"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary-container" />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-baseline justify-between mb-8 flex-wrap gap-4">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface flex items-center gap-2">
            {filtered.length > 0 ? `${filtered.length} jogo${filtered.length > 1 ? 's' : ''} encontrado${filtered.length > 1 ? 's' : ''}` : 'Catálogo'}
            <span className="text-secondary-container ml-1 opacity-50">.</span>
          </h1>
          <div className="flex items-center gap-3 text-sm font-bold text-on-surface-variant">
            <Filter size={14} /> ORDENAR POR:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border-none font-bold text-primary-container focus:ring-0 cursor-pointer outline-none"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center text-on-surface-variant py-24">Carregando jogos…</div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface-container-low rounded-xl py-24 text-center"
          >
            <Search className="mx-auto text-outline mb-4" size={48} />
            <h3 className="font-headline text-xl font-bold mb-2">Nenhum jogo encontrado</h3>
            <p className="text-on-surface-variant">Tente ajustar os filtros ou buscar por outro termo.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((g, i) => (
              <HorizontalGameCard key={g.appId} game={g} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const FilterSection = ({ title, children }) => (
  <div>
    <h3 className="font-headline text-sm font-bold tracking-widest text-on-surface-variant uppercase mb-6 flex items-center gap-2">
      <span className="w-2 h-2 bg-secondary-container rounded-full" />
      {title}
    </h3>
    {children}
  </div>
);

export default CatalogPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resolveImage } from '../../config/api';
import { Star } from 'lucide-react';

// Placeholder gradient when no image
const Placeholder = ({ name }) => (
  <div className="w-full h-full bg-primary-gradient flex items-center justify-center">
    <span className="text-white font-headline font-black text-2xl text-center px-4 truncate">
      {name || 'SENAI WORKS'}
    </span>
  </div>
);

// Vertical capsule card (374×448) — for "Destaques"
export const VerticalGameCard = ({ game, index = 0 }) => {
  const cover = resolveImage(game.storeGraphics?.verticalCapsule?.url);
  const genre = game.basicData?.genres?.[0] || 'Jogo';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <Link to={`/jogo/${game.appId}`} className="group block cursor-pointer">
        <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative shadow-sm gamer-accent transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-card-hover bg-surface-container-high">
          {cover ? (
            <img src={cover} alt={game.basicData?.gameName} className="w-full h-full object-cover" />
          ) : (
            <Placeholder name={game.basicData?.gameName} />
          )}
          <div className="absolute top-3 left-3 bg-secondary-container text-white text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1">
            Grátis
          </div>
        </div>
        <h3 className="font-headline text-xl font-bold group-hover:text-secondary-container transition-colors line-clamp-1">
          {game.basicData?.gameName || 'Jogo SenaiWorks'}
        </h3>
        <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold">
          {genre}
        </p>
      </Link>
    </motion.div>
  );
};

// Horizontal capsule (616×353) — for "Catálogo"
export const HorizontalGameCard = ({ game, index = 0 }) => {
  const cover =
    resolveImage(game.storeGraphics?.headerCapsule?.url) ||
    resolveImage(game.storeGraphics?.mainCapsule?.url);
  const genres = game.basicData?.genres || [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
    >
      <Link to={`/jogo/${game.appId}`} className="group flex flex-col gap-3">
        <div className="relative aspect-[616/353] rounded-xl overflow-hidden shadow-sm transform transition-all duration-500 group-hover:scale-[1.02] bg-surface-container-high">
          {cover ? (
            <img src={cover} alt={game.basicData?.gameName} className="w-full h-full object-cover" />
          ) : (
            <Placeholder name={game.basicData?.gameName} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <span className="text-white font-bold tracking-widest text-xs uppercase">
              Ver detalhes →
            </span>
          </div>
          <div className="absolute top-3 right-3 bg-secondary-container text-white font-bold px-3 py-1 rounded-md text-xs shadow-lg uppercase tracking-widest">
            Grátis
          </div>
        </div>
        <div className="px-1">
          <div className="flex justify-between items-start mb-2 gap-2">
            <h2 className="font-headline text-lg font-bold text-on-surface group-hover:text-secondary-container transition-colors line-clamp-1">
              {game.basicData?.gameName || 'Jogo SenaiWorks'}
            </h2>
            {game.rating > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-on-surface-variant flex-shrink-0">
                <Star size={12} className="fill-secondary-container text-secondary-container" />
                {game.rating.toFixed(1)}
              </span>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-[10px] font-extrabold tracking-widest text-outline uppercase border border-outline-variant px-2 py-0.5 rounded"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Compact horizontal card (small h-40) — for "Ofertas"
export const CompactGameCard = ({ game }) => {
  const cover =
    resolveImage(game.storeGraphics?.headerCapsule?.url) ||
    resolveImage(game.storeGraphics?.mainCapsule?.url);
  return (
    <Link
      to={`/jogo/${game.appId}`}
      className="flex-none w-80 bg-surface-container-lowest rounded-xl overflow-hidden snap-start shadow-sm border border-outline-variant/10 group transition-shadow hover:shadow-card-hover"
    >
      <div className="h-40 relative gamer-accent bg-surface-container-high">
        {cover ? (
          <img
            src={cover}
            alt={game.basicData?.gameName}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <Placeholder name={game.basicData?.gameName} />
        )}
      </div>
      <div className="p-5">
        <h4 className="font-bold text-lg mb-1 truncate">
          {game.basicData?.gameName || 'Jogo'}
        </h4>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-primary-container">Grátis</span>
        </div>
      </div>
    </Link>
  );
};

// Library card (2:3 vertical) — for Profile
export const LibraryGameCard = ({ game, onPlay, hours }) => {
  const cover =
    resolveImage(game.libraryAssets?.libraryCapsule?.url) ||
    resolveImage(game.storeGraphics?.verticalCapsule?.url);
  const genre = game.basicData?.genres?.[0] || 'Jogo';
  return (
    <div className="group bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover">
      <div className="aspect-[2/3] relative bg-surface-container-high">
        {cover ? (
          <img src={cover} alt={game.basicData?.gameName} className="w-full h-full object-cover" />
        ) : (
          <Placeholder name={game.basicData?.gameName} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              onPlay && onPlay(game);
            }}
            className="w-full bg-secondary-container text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#e85d00] transition-colors"
          >
            <span className="material-symbols-outlined text-base">download</span> BAIXAR JOGO
          </button>
        </div>
      </div>
      <div className="p-4">
        <span className="text-[10px] font-label font-bold tracking-widest text-secondary-container uppercase">
          {genre}
        </span>
        <h3 className="font-headline font-bold text-lg leading-tight mt-1 line-clamp-1">
          {game.basicData?.gameName || 'Jogo'}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-on-surface-variant text-xs font-medium">
            {hours ? `${hours}h registradas` : 'Não jogado ainda'}
          </span>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
    </div>
  );
};

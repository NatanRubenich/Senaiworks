import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Download, Library, Play, Monitor, Apple, Globe, Calendar, Users } from 'lucide-react';
import { gameModel } from '../../models/game.model';
import { reviewModel } from '../../models/review.model';
import { libraryModel } from '../../models/library.model';
import { resolveImage } from '../../config/api';
import { useAuth } from '../../controllers/AuthContext';

const GamePage = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ avgRating: 0, totalReviews: 0 });
  const [owned, setOwned] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await gameModel.getByAppId(appId);
      setGame(res.data.game);
      const r = await reviewModel.list(appId);
      setReviews(r.data.reviews || []);
      setStats(r.data.stats || { avgRating: 0, totalReviews: 0 });
      if (user) {
        try {
          const own = await libraryModel.check(appId);
          setOwned(own.data.owned);
        } catch {
          /* ignore */
        }
      }
    } catch {
      setGame(null);
    } finally {
      setLoading(false);
    }
  }, [appId, user]);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleClaim = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/jogo/${appId}` } });
      return;
    }
    await libraryModel.claim(appId);
    setOwned(true);
  };

  const handleDownload = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/jogo/${appId}` } });
      return;
    }
    try {
      const res = await libraryModel.download(appId);
      setOwned(true);
      // Trigger download
      const url = resolveImage(res.data.url);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.data.fileName || 'build.zip';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(err.response?.data?.error || 'Build ainda não disponível para download.');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-8 py-32 text-center text-on-surface-variant">Carregando jogo…</div>;
  }
  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-32 text-center">
        <h1 className="font-headline text-4xl font-bold text-primary-container mb-4">Jogo não encontrado</h1>
        <Link to="/catalogo" className="text-secondary-container font-bold hover:underline">
          ← Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const heroBg =
    resolveImage(game.libraryAssets?.libraryHero?.url) ||
    resolveImage(game.storeGraphics?.mainCapsule?.url);
  const logoSrc = resolveImage(game.libraryAssets?.libraryLogo?.url);
  const cover =
    resolveImage(game.libraryAssets?.libraryCapsule?.url) ||
    resolveImage(game.storeGraphics?.mainCapsule?.url);

  // Build media array (trailers + screenshots)
  const media = [
    ...(game.trailers || [])
      .filter((t) => t.visibleInStore !== false && t.videoUrl)
      .map((t) => ({ type: 'video', url: resolveImage(t.videoUrl), thumb: resolveImage(t.thumbnailUrl), name: t.publicName })),
    ...(game.screenshots || []).map((s) => ({ type: 'image', url: resolveImage(s.url), thumb: resolveImage(s.url), name: s.altText })),
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[420px] md:h-[560px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {heroBg ? (
            <img src={heroBg} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary-gradient" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-8 w-full"
          >
            {logoSrc && (
              <div className="glass-overlay p-6 rounded-xl shadow-2xl border border-white/20 mb-[-2rem] hidden md:block">
                <img src={logoSrc} alt="" className="w-48 h-auto" />
              </div>
            )}
            <div className="flex-1 pb-4 min-w-0">
              <div className="flex gap-2 mb-3 flex-wrap">
                {(game.basicData?.genres || []).slice(0, 2).map((g) => (
                  <span
                    key={g}
                    className="bg-secondary-container/90 text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                  >
                    {g}
                  </span>
                ))}
                <span className="bg-primary-container text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                  Free-to-Play
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter line-clamp-2">
                {game.basicData?.gameName}
              </h1>
              {game.basicData?.developerName && (
                <p className="mt-3 text-on-surface-variant font-medium text-lg">
                  por <span className="text-primary-container font-bold">{game.basicData.developerName}</span>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-24 flex flex-col md:flex-row gap-12">
        {/* Left: gallery + description + reviews */}
        <div className="w-full md:w-[65%] space-y-12">
          {/* Gallery */}
          {media.length > 0 && (
            <div className="space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-surface-container-high relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMedia}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    {media[activeMedia]?.type === 'video' ? (
                      <video src={media[activeMedia].url} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={media[activeMedia]?.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              {media.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {media.slice(0, 8).map((m, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveMedia(i)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        i === activeMedia ? 'border-secondary-container' : 'border-transparent hover:border-outline-variant'
                      }`}
                    >
                      <div className="w-full h-full bg-surface-container-high relative">
                        {m.thumb && (
                          <img
                            src={m.thumb}
                            alt=""
                            className={`w-full h-full object-cover transition-opacity ${
                              i === activeMedia ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                            }`}
                          />
                        )}
                        {m.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="text-white" size={28} fill="white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <article className="space-y-6">
            <h2 className="text-3xl font-headline font-bold flex items-center gap-3">
              <span className="w-2 h-8 bg-secondary-container rounded-full" />
              Sobre o Jogo
            </h2>
            {game.description?.shortDescription && (
              <p className="text-lg text-on-surface-variant leading-relaxed font-medium italic">
                {game.description.shortDescription}
              </p>
            )}
            <div
              className="prose-content text-on-surface-variant leading-relaxed font-body"
              dangerouslySetInnerHTML={{
                __html: game.description?.longDescription || '<p>Descrição não disponível.</p>',
              }}
            />
          </article>

          {/* Awards / Press Reviews */}
          {(game.description?.awards?.length > 0 || game.description?.reviews?.length > 0) && (
            <section className="space-y-6">
              {game.description?.awards?.length > 0 && (
                <div>
                  <h3 className="font-headline text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-secondary-container rounded-full" /> Prêmios
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {game.description.awards.map((a, i) => (
                      <div key={i} className="bg-surface-container-low p-5 rounded-xl">
                        <h4 className="font-bold text-primary-container">{a.title}</h4>
                        <p className="text-sm text-on-surface-variant mt-1">{a.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Reviews Section */}
          <ReviewsSection
            appId={appId}
            user={user}
            reviews={reviews}
            stats={stats}
            onChange={reload}
            onLoginRequired={() => navigate('/login', { state: { from: `/jogo/${appId}` } })}
          />
        </div>

        {/* Right: Sticky Info Card */}
        <aside className="w-full md:w-[35%]">
          <div className="sticky top-28 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden border border-surface-variant">
              {cover ? (
                <img src={cover} alt="" className="w-full aspect-[4/3] object-cover" />
              ) : (
                <div className="w-full aspect-[4/3] bg-primary-gradient" />
              )}
              <div className="p-7 space-y-5">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-3xl font-headline font-bold text-secondary-container">Grátis</span>
                    <span className="text-xs text-green-600 font-bold tracking-widest uppercase">DISPONÍVEL AGORA</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {game.downloadAvailable ? (
                    <button onClick={handleDownload} className="w-full btn-primary text-base flex items-center justify-center gap-2">
                      <Download size={18} /> {owned ? 'Baixar Novamente' : 'Baixar Jogo'}
                    </button>
                  ) : (
                    <button
                      onClick={handleClaim}
                      disabled={owned}
                      className="w-full btn-primary text-base flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Library size={18} /> {owned ? 'Já na Biblioteca' : 'Adicionar à Biblioteca'}
                    </button>
                  )}
                  {!owned && game.downloadAvailable && (
                    <button onClick={handleClaim} className="w-full btn-secondary text-sm flex items-center justify-center gap-2">
                      <Library size={16} /> Salvar na Biblioteca
                    </button>
                  )}
                </div>

                <div className="pt-5 border-t border-surface-variant space-y-3">
                  <InfoRow label="Desenvolvedor" value={game.basicData?.developerName || '-'} />
                  <InfoRow label="Distribuidora" value={game.basicData?.publisherName || '-'} />
                  <InfoRow
                    label="Lançamento"
                    value={
                      game.publishedAt
                        ? new Date(game.publishedAt).toLocaleDateString('pt-BR')
                        : '-'
                    }
                    icon={<Calendar size={14} />}
                  />
                  <InfoRow label="App ID" value={`#${game.appId}`} />
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Plataformas</span>
                    <div className="flex gap-1.5">
                      {game.appConfig?.os?.windows && <Monitor size={16} title="Windows" />}
                      {game.appConfig?.os?.macOS && <Apple size={16} title="macOS" />}
                      {game.appConfig?.os?.linux && <span title="Linux" className="text-xs font-bold">🐧</span>}
                    </div>
                  </div>
                </div>

                {game.basicData?.genres?.length > 0 && (
                  <div className="pt-5 border-t border-surface-variant">
                    <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-2">Gêneros</p>
                    <div className="flex gap-2 flex-wrap">
                      {game.basicData.genres.map((g) => (
                        <Link
                          key={g}
                          to={`/catalogo?genero=${encodeURIComponent(g)}`}
                          className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-surface-container-high rounded text-primary-container hover:bg-secondary-container hover:text-white transition-colors"
                        >
                          {g}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {game.basicData?.languages?.length > 0 && (
                  <div className="pt-5 border-t border-surface-variant">
                    <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Globe size={12} /> Idiomas
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {game.basicData.languages.slice(0, 4).join(', ')}
                      {game.basicData.languages.length > 4 && ` +${game.basicData.languages.length - 4}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Rating snapshot */}
            {stats.totalReviews > 0 && (
              <div className="bg-surface-container-low rounded-xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Avaliação</p>
                  <p className="font-headline text-2xl font-black text-primary-container">{stats.avgRating}/5</p>
                </div>
                <div className="flex items-center gap-1 text-secondary-container">
                  <Users size={16} />
                  <span className="font-bold">{stats.totalReviews}</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, icon }) => (
  <div className="flex justify-between text-sm">
    <span className="text-on-surface-variant flex items-center gap-1.5">
      {icon} {label}
    </span>
    <span className="font-bold text-right truncate max-w-[60%]">{value}</span>
  </div>
);

// =================== Reviews Section ===================
const ReviewsSection = ({ appId, user, reviews, stats, onChange, onLoginRequired }) => {
  const myReview = user ? reviews.find((r) => r.user?._id === user._id) : null;
  const [rating, setRating] = useState(myReview?.rating || 0);
  const [comment, setComment] = useState(myReview?.comment || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setRating(myReview?.rating || 0);
    setComment(myReview?.comment || '');
  }, [myReview?._id]); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return onLoginRequired();
    if (rating < 1) return;
    setSubmitting(true);
    try {
      await reviewModel.upsert(appId, { rating, comment });
      onChange();
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Remover sua avaliação?')) return;
    await reviewModel.remove(appId);
    setRating(0);
    setComment('');
    onChange();
  };

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <h2 className="text-3xl font-headline font-bold flex items-center gap-3">
          <span className="w-2 h-8 bg-secondary-container rounded-full" />
          Avaliações dos Jogadores
        </h2>
        {stats.totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <StarBar value={stats.avgRating} />
            <span className="font-bold text-xl">{stats.avgRating}</span>
            <span className="text-on-surface-variant text-sm">({stats.totalReviews})</span>
          </div>
        )}
      </div>

      {/* Submit form */}
      <form
        onSubmit={submit}
        className="bg-surface-container-low p-6 rounded-xl space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-on-surface mb-1">{myReview ? 'Edite sua avaliação' : 'Avalie este jogo'}</p>
            <p className="text-xs text-on-surface-variant">
              {user ? 'Sua avaliação ajuda a comunidade SenaiWorks.' : 'Faça login para deixar sua avaliação.'}
            </p>
          </div>
          <StarInput value={rating} onChange={setRating} disabled={!user} />
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={user ? 'Conte sua experiência (opcional)' : 'Faça login para comentar'}
          disabled={!user}
          rows={3}
          maxLength={1000}
          className="w-full bg-surface-container-lowest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary-container outline-none transition-all resize-none disabled:opacity-60"
        />
        <div className="flex justify-end gap-2">
          {myReview && (
            <button type="button" onClick={remove} className="text-error font-bold text-sm hover:underline">
              Remover avaliação
            </button>
          )}
          {user ? (
            <button type="submit" disabled={submitting || rating < 1} className="btn-primary text-sm">
              {submitting ? 'Enviando…' : myReview ? 'Atualizar' : 'Enviar avaliação'}
            </button>
          ) : (
            <button type="button" onClick={onLoginRequired} className="btn-primary text-sm">
              Fazer login
            </button>
          )}
        </div>
      </form>

      {/* Review list */}
      <div className="space-y-4">
        <AnimatePresence>
          {reviews.length === 0 ? (
            <p className="text-on-surface-variant text-center py-8">Seja o primeiro a avaliar este jogo!</p>
          ) : (
            reviews.map((r) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-surface-container-low p-6 rounded-xl space-y-3"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">
                      {r.user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{r.user?.name}</h4>
                      <span className="text-xs text-on-surface-variant uppercase tracking-wide">
                        {new Date(r.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <StarBar value={r.rating} small />
                </div>
                {r.comment && <p className="text-on-surface-variant italic">"{r.comment}"</p>}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const StarBar = ({ value, small }) => {
  const size = small ? 14 : 18;
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(value) ? 'fill-secondary-container text-secondary-container' : 'text-outline-variant'}
        />
      ))}
    </div>
  );
};

const StarInput = ({ value, onChange, disabled }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onMouseEnter={() => !disabled && setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => !disabled && onChange(n)}
          className="p-0.5 disabled:cursor-not-allowed"
        >
          <Star
            size={28}
            className={`transition-colors ${
              n <= (hover || value)
                ? 'fill-secondary-container text-secondary-container'
                : 'text-outline-variant'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default GamePage;

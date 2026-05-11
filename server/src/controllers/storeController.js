const Game = require('../models/Game');
const Review = require('../models/Review');
const LibraryEntry = require('../models/Library');

// Helper: aggregate rating stats for one game
async function getRatingStats(gameId) {
  const stats = await Review.aggregate([
    { $match: { game: gameId } },
    {
      $group: {
        _id: '$game',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);
  if (!stats.length) return { avgRating: 0, totalReviews: 0 };
  return {
    avgRating: Math.round(stats[0].avgRating * 10) / 10,
    totalReviews: stats[0].totalReviews,
  };
}

// Helper: serialize a game for the public store
async function serializeGame(game, includeStats = true) {
  const obj = game.toObject ? game.toObject() : game;
  let stats = { avgRating: 0, totalReviews: 0 };
  if (includeStats) {
    stats = await getRatingStats(game._id);
  }
  return {
    _id: obj._id,
    appId: obj.appId,
    basicData: obj.basicData,
    description: obj.description,
    storeGraphics: obj.storeGraphics,
    libraryAssets: obj.libraryAssets,
    screenshots: obj.screenshots,
    trailers: obj.trailers,
    appConfig: obj.appConfig,
    publishedAt: obj.storeSubmittedAt || obj.updatedAt,
    rating: stats.avgRating,
    reviewsCount: stats.totalReviews,
    downloadAvailable: !!obj.buildUpload?.fileUrl,
  };
}

// GET /api/store/games  → Lista todos os jogos aprovados
exports.listGames = async (req, res) => {
  try {
    const { genre, search, sort } = req.query;

    const query = { status: 'Aprovado' };
    if (genre) query['basicData.genres'] = genre;
    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [
        { 'basicData.gameName': re },
        { 'basicData.developerName': re },
        { 'basicData.tags': re },
      ];
    }

    let sortBy = { storeSubmittedAt: -1 };
    if (sort === 'name') sortBy = { 'basicData.gameName': 1 };
    if (sort === 'oldest') sortBy = { storeSubmittedAt: 1 };

    const games = await Game.find(query).sort(sortBy).limit(100);
    const result = await Promise.all(games.map(g => serializeGame(g)));
    res.json({ games: result, total: result.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/store/games/featured → Top 4 + carousel
exports.getFeatured = async (req, res) => {
  try {
    const games = await Game.find({ status: 'Aprovado' })
      .sort({ storeSubmittedAt: -1 })
      .limit(12);
    const result = await Promise.all(games.map(g => serializeGame(g)));
    res.json({
      hero: result.slice(0, 4),
      featured: result.slice(0, 8),
      newReleases: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/store/games/:appId → Detalhes
exports.getGameByAppId = async (req, res) => {
  try {
    const game = await Game.findOne({
      appId: parseInt(req.params.appId, 10),
      status: 'Aprovado',
    });
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });
    const data = await serializeGame(game);
    res.json({ game: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================== REVIEWS ======================

// GET /api/store/games/:appId/reviews
exports.listReviews = async (req, res) => {
  try {
    const game = await Game.findOne({ appId: parseInt(req.params.appId, 10) });
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });
    const reviews = await Review.find({ game: game._id })
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    const stats = await getRatingStats(game._id);
    res.json({
      reviews: reviews.map(r => ({
        _id: r._id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        user: {
          _id: r.user?._id,
          name: r.user?.email?.split('@')[0] || 'Anônimo',
        },
      })),
      stats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/store/games/:appId/reviews  (auth)
exports.upsertReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Avaliação deve ser entre 1 e 5.' });
    }
    const game = await Game.findOne({ appId: parseInt(req.params.appId, 10) });
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const review = await Review.findOneAndUpdate(
      { game: game._id, user: req.user._id },
      { rating, comment: comment || '' },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/store/games/:appId/reviews/mine  (auth)
exports.deleteMyReview = async (req, res) => {
  try {
    const game = await Game.findOne({ appId: parseInt(req.params.appId, 10) });
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });
    await Review.deleteOne({ game: game._id, user: req.user._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================== LIBRARY ======================

// POST /api/store/library/:appId  (auth) → Adicionar à biblioteca (grátis)
exports.claimGame = async (req, res) => {
  try {
    const game = await Game.findOne({
      appId: parseInt(req.params.appId, 10),
      status: 'Aprovado',
    });
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const entry = await LibraryEntry.findOneAndUpdate(
      { user: req.user._id, game: game._id },
      { $setOnInsert: { acquiredAt: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/store/library  (auth)
exports.getMyLibrary = async (req, res) => {
  try {
    const entries = await LibraryEntry.find({ user: req.user._id })
      .populate('game')
      .sort({ acquiredAt: -1 });
    const filtered = entries.filter(e => e.game);
    const result = await Promise.all(
      filtered.map(async e => {
        const data = await serializeGame(e.game, false);
        return {
          ...data,
          acquiredAt: e.acquiredAt,
          lastDownloadAt: e.lastDownloadAt,
          downloadCount: e.downloadCount,
        };
      })
    );
    res.json({ library: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/store/library/check/:appId  (auth)
exports.checkOwnership = async (req, res) => {
  try {
    const game = await Game.findOne({ appId: parseInt(req.params.appId, 10) });
    if (!game) return res.json({ owned: false });
    const entry = await LibraryEntry.findOne({ user: req.user._id, game: game._id });
    res.json({ owned: !!entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/store/download/:appId  (auth) → registra download e retorna URL
exports.downloadGame = async (req, res) => {
  try {
    const game = await Game.findOne({
      appId: parseInt(req.params.appId, 10),
      status: 'Aprovado',
    });
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });
    if (!game.buildUpload?.fileUrl) {
      return res.status(404).json({ error: 'Build ainda não disponível para download.' });
    }

    // Garante entrada da biblioteca
    await LibraryEntry.findOneAndUpdate(
      { user: req.user._id, game: game._id },
      {
        $setOnInsert: { acquiredAt: new Date() },
        $set: { lastDownloadAt: new Date() },
        $inc: { downloadCount: 1 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      url: game.buildUpload.fileUrl,
      fileName: game.buildUpload.fileName,
      fileSize: game.buildUpload.fileSize,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

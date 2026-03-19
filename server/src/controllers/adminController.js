const Game = require('../models/Game');
const User = require('../models/User');

// GET /api/admin/games — List all submitted games
exports.getAllGames = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    } else {
      filter.status = { $ne: 'Rascunho' };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { 'basicData.gameName': searchRegex },
        { 'basicData.developerName': searchRegex },
      ];
    }

    const games = await Game.find(filter)
      .populate('developer', 'email identity.legalName')
      .sort({ createdAt: -1 });

    res.json({ games });
  } catch (error) {
    console.error('[AdminGetGames Error]', error);
    res.status(500).json({ error: 'Erro ao buscar jogos.' });
  }
};

// GET /api/admin/games/:id — Get game details
exports.getGameDetails = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('developer', 'email identity');
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar detalhes do jogo.' });
  }
};

// POST /api/admin/games/:id/approve
exports.approveGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    if (game.status !== 'Em Análise') {
      return res.status(400).json({ error: 'Apenas jogos "Em Análise" podem ser aprovados.' });
    }

    game.status = 'Aprovado';
    game.reviewHistory.push({
      action: 'approved',
      date: new Date(),
      reason: 'Jogo aprovado pelo administrador.',
      by: req.user.email,
    });
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aprovar jogo.' });
  }
};

// POST /api/admin/games/:id/reject
exports.rejectGame = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'Motivo da reprovação é obrigatório.' });
    }

    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    if (game.status !== 'Em Análise') {
      return res.status(400).json({ error: 'Apenas jogos "Em Análise" podem ser reprovados.' });
    }

    game.status = 'Reprovado';
    game.storePublished = false;
    game.configPublished = false;
    game.reviewHistory.push({
      action: 'rejected',
      date: new Date(),
      reason: reason.trim(),
      by: req.user.email,
    });
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao reprovar jogo.' });
  }
};

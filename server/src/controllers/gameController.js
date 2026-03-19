const Game = require('../models/Game');
const path = require('path');

// POST /api/games — Create a new game
exports.createGame = async (req, res) => {
  try {
    const game = new Game({
      developer: req.user._id,
      basicData: {
        gameName: req.body.gameName || '',
        developerName: req.user.identity?.legalName || '',
      },
      appConfig: {
        appName: req.body.gameName || '',
      },
    });
    await game.save();
    res.status(201).json({ game });
  } catch (error) {
    console.error('[CreateGame Error]', error);
    res.status(500).json({ error: 'Erro ao criar jogo.' });
  }
};

// GET /api/games — List user's games
exports.getMyGames = async (req, res) => {
  try {
    const games = await Game.find({ developer: req.user._id }).sort({ createdAt: -1 });
    res.json({ games });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar jogos.' });
  }
};

// GET /api/games/:id
exports.getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });
    if (req.user.role !== 'admin' && game.developer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar jogo.' });
  }
};

// PUT /api/games/:id/basic-data — B1
exports.updateBasicData = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const { gameName, appType, developerName, publisherName, genres, tags, languages } = req.body;
    if (!gameName) return res.status(400).json({ error: 'Nome do jogo é obrigatório.' });

    game.basicData = { gameName, appType: appType || 'Game', developerName, publisherName, genres: genres || [], tags: tags || '', languages: languages || [] };
    game.appConfig.appName = gameName;
    game.tabStatus.basicData = gameName && developerName ? 'complete' : 'pending';
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar dados básicos.' });
  }
};

// PUT /api/games/:id/description — B2
exports.updateDescription = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const { longDescription, shortDescription, descriptionLanguage, reviews, awards, specialAnnouncements } = req.body;

    if (shortDescription && shortDescription.length > 300) {
      return res.status(400).json({ error: 'Descrição curta não pode ultrapassar 300 caracteres.' });
    }

    game.description = {
      longDescription: longDescription || '',
      shortDescription: shortDescription || '',
      descriptionLanguage: descriptionLanguage || 'Português (Brasil)',
      reviews: reviews || [],
      awards: awards || [],
      specialAnnouncements: specialAnnouncements || [],
    };
    game.tabStatus.description = (longDescription && shortDescription) ? 'complete' : 'pending';
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar descrição.' });
  }
};

// PUT /api/games/:id/store-graphics — B3
exports.updateStoreGraphics = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const { capsuleType, imageUrl, validated, isTemporary, tempStartDate, tempEndDate } = req.body;

    if (capsuleType && imageUrl !== undefined) {
      game.storeGraphics[capsuleType] = { url: imageUrl, validated: validated || false };
    }
    if (isTemporary !== undefined) {
      game.storeGraphics.isTemporary = isTemporary;
      game.storeGraphics.tempStartDate = tempStartDate || null;
      game.storeGraphics.tempEndDate = tempEndDate || null;
    }

    const allCapsules = ['headerCapsule', 'smallCapsule', 'mainCapsule', 'verticalCapsule'];
    const allValid = allCapsules.every(c => game.storeGraphics[c]?.url && game.storeGraphics[c]?.validated);
    game.tabStatus.storeGraphics = allValid ? 'complete' : 'pending';

    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar recursos gráficos.' });
  }
};

// PUT /api/games/:id/screenshots — B4
exports.updateScreenshots = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const { screenshots } = req.body;
    game.screenshots = screenshots || [];
    game.tabStatus.screenshots = (game.screenshots.length >= 5) ? 'complete' : 'pending';
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar screenshots.' });
  }
};

// POST /api/games/:id/screenshots/add
exports.addScreenshot = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const { url, altText, ageAppropriate } = req.body;
    game.screenshots.push({
      url,
      altText: altText || '',
      ageAppropriate: ageAppropriate !== false,
      order: game.screenshots.length,
    });
    game.tabStatus.screenshots = (game.screenshots.length >= 5) ? 'complete' : 'pending';
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar screenshot.' });
  }
};

// DELETE /api/games/:id/screenshots/:screenshotId
exports.deleteScreenshot = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    game.screenshots = game.screenshots.filter(s => s._id.toString() !== req.params.screenshotId);
    game.tabStatus.screenshots = (game.screenshots.length >= 5) ? 'complete' : 'pending';
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover screenshot.' });
  }
};

// PUT /api/games/:id/library-assets — B5
exports.updateLibraryAssets = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const { assetType, imageUrl, validated, hasTextOverlay } = req.body;

    if (assetType === 'libraryHero' && hasTextOverlay) {
      return res.status(400).json({ error: 'O Cabeçalho da biblioteca (Hero) não pode conter texto ou logotipo sobreposto.' });
    }

    if (assetType && imageUrl !== undefined) {
      game.libraryAssets[assetType] = { url: imageUrl, validated: validated || false };
      if (assetType === 'libraryHero') {
        game.libraryAssets[assetType].hasTextOverlay = hasTextOverlay || false;
      }
    }

    const allAssets = ['libraryCapsule', 'libraryHeader', 'libraryHero', 'libraryLogo'];
    const allValid = allAssets.every(a => game.libraryAssets[a]?.url && game.libraryAssets[a]?.validated);
    game.tabStatus.libraryAssets = allValid ? 'complete' : 'pending';

    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar recursos da biblioteca.' });
  }
};

// PUT /api/games/:id/trailers — B6
exports.updateTrailers = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    game.trailers = req.body.trailers || [];
    game.tabStatus.trailers = game.trailers.length > 0 ? 'complete' : 'pending';
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar trailers.' });
  }
};

// POST /api/games/:id/trailers/add
exports.addTrailer = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    game.trailers.push({
      publicName: req.body.publicName || '',
      order: game.trailers.length,
    });
    game.tabStatus.trailers = 'complete';
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar trailer.' });
  }
};

// DELETE /api/games/:id/trailers/:trailerId
exports.deleteTrailer = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    game.trailers = game.trailers.filter(t => t._id.toString() !== req.params.trailerId);
    game.tabStatus.trailers = game.trailers.length > 0 ? 'complete' : 'pending';
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover trailer.' });
  }
};

// POST /api/games/:id/publish-store — B7
exports.publishStore = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const requiredTabs = ['basicData', 'description', 'storeGraphics', 'screenshots', 'libraryAssets'];
    const incomplete = requiredTabs.filter(t => game.tabStatus[t] !== 'complete');
    if (incomplete.length > 0) {
      return res.status(400).json({
        error: 'Existem etapas incompletas na Página da Loja.',
        incompleteTabs: incomplete,
      });
    }

    game.storePublished = true;
    game.storeSubmittedAt = new Date();

    if (game.configPublished) {
      game.status = 'Em Análise';
    } else {
      game.status = 'Loja em Revisão';
    }

    game.tabStatus.storePublish = 'complete';
    game.reviewHistory.push({ action: 'submitted', date: new Date(), reason: 'Página da loja publicada.' });
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao publicar página da loja.' });
  }
};

// PUT /api/games/:id/app-config — C1
exports.updateAppConfig = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const { os, communityVisibility } = req.body;
    game.appConfig.os = os || game.appConfig.os;
    game.appConfig.communityVisibility = communityVisibility || game.appConfig.communityVisibility;

    const hasOS = os && (os.windows || os.macOS || os.linux);
    game.tabStatus.appConfig = hasOS ? 'complete' : 'pending';
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar configurações do aplicativo.' });
  }
};

// PUT /api/games/:id/build-upload — C2
exports.updateBuildUpload = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const { depotName, fileName, fileUrl, fileSize, uploadMode } = req.body;
    game.buildUpload = {
      depotName: depotName || game.buildUpload.depotName,
      fileName: fileName || '',
      fileUrl: fileUrl || '',
      fileSize: fileSize || 0,
      uploadMode: uploadMode || 'standard',
      uploadedAt: new Date(),
    };
    game.tabStatus.depotUpload = fileName ? 'complete' : 'pending';
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar upload de build.' });
  }
};

// PUT /api/games/:id/depots — C3
exports.updateDepots = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const { depots, manageDLCSeparately, baseLanguages } = req.body;
    if (depots !== undefined) game.depots = depots;
    if (manageDLCSeparately !== undefined) game.manageDLCSeparately = manageDLCSeparately;
    if (baseLanguages !== undefined) game.baseLanguages = baseLanguages;
    game.tabStatus.depotManage = (game.depots.length > 0) ? 'complete' : 'pending';
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar depots.' });
  }
};

// PUT /api/games/:id/install-config — C4
exports.updateInstallConfig = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const { installFolder, launchOptions, advancedGetLaunchCmd, advancedOverrideRes } = req.body;
    game.installConfig = {
      installFolder: installFolder || game.installConfig.installFolder,
      launchOptions: launchOptions || game.installConfig.launchOptions,
      advancedGetLaunchCmd: advancedGetLaunchCmd || false,
      advancedOverrideRes: advancedOverrideRes || false,
    };

    const hasLaunch = game.installConfig.launchOptions.length > 0 &&
      game.installConfig.launchOptions.some(lo => lo.executable);
    game.tabStatus.installConfig = hasLaunch ? 'complete' : 'pending';
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar configurações de instalação.' });
  }
};

// POST /api/games/:id/publish-config — C5
exports.publishConfig = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });

    const requiredTabs = ['appConfig', 'depotUpload', 'installConfig'];
    const incomplete = requiredTabs.filter(t => game.tabStatus[t] !== 'complete');
    if (incomplete.length > 0) {
      return res.status(400).json({
        error: 'Existem etapas incompletas na Configuração do Jogo.',
        incompleteTabs: incomplete,
      });
    }

    game.configPublished = true;
    game.configSubmittedAt = new Date();

    if (game.storePublished) {
      game.status = 'Em Análise';
    } else {
      game.status = 'Config em Revisão';
    }

    game.tabStatus.configPublish = 'complete';
    game.reviewHistory.push({ action: 'submitted', date: new Date(), reason: 'Configurações do jogo publicadas.' });
    await game.save();
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao publicar configurações.' });
  }
};

// POST /api/games/:id/upload-file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }
    const fileUrl = `/uploads/${req.uploadSubDir || 'general'}/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer upload.' });
  }
};

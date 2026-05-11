const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/storeController');
const { auth } = require('../middleware/auth');

// Públicas
router.get('/games', ctrl.listGames);
router.get('/games/featured', ctrl.getFeatured);
router.get('/games/:appId', ctrl.getGameByAppId);
router.get('/games/:appId/reviews', ctrl.listReviews);

// Autenticadas
router.post('/games/:appId/reviews', auth, ctrl.upsertReview);
router.delete('/games/:appId/reviews/mine', auth, ctrl.deleteMyReview);

router.post('/library/:appId', auth, ctrl.claimGame);
router.get('/library', auth, ctrl.getMyLibrary);
router.get('/library/check/:appId', auth, ctrl.checkOwnership);

router.get('/download/:appId', auth, ctrl.downloadGame);

module.exports = router;

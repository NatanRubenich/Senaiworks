const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/games', auth, adminOnly, adminController.getAllGames);
router.get('/games/:id', auth, adminOnly, adminController.getGameDetails);
router.post('/games/:id/approve', auth, adminOnly, adminController.approveGame);
router.post('/games/:id/reject', auth, adminOnly, adminController.rejectGame);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

router.put('/identity', auth, userController.updateIdentity);
router.put('/tax', auth, userController.updateTax);
router.put('/bank', auth, userController.updateBank);
router.post('/pay-fee', auth, userController.payFee);

module.exports = router;

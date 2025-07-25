const express = require('express');
const { placeBet } = require('../controllers/gameController');
const router = express.Router();

router.post('/bet', placeBet);

const { getWallet } = require('../controllers/gameController');

router.get('/wallet/:username', getWallet);


module.exports = router;

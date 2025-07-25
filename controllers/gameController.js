const Player = require('../models/Player');
const GameRound = require('../models/GameRound');
const Transaction = require('../models/Transaction');
const { getCryptoPrice } = require('../utils/cryptoUtils');
const { v4: uuidv4 } = require('uuid');

exports.placeBet = async (req, res) => {
  try {
    const { username, usdAmount, currency } = req.body;
    if (!['BTC', 'ETH'].includes(currency)) return res.status(400).json({ error: 'Invalid currency' });

    const player = await Player.findOne({ username });
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const cryptoPrice = await getCryptoPrice(currency);
    const cryptoAmount = usdAmount / cryptoPrice;

    // Check balance
    if (player.wallet[currency] < cryptoAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct balance
    player.wallet[currency] -= cryptoAmount;
    await player.save();

    // Create new round if needed (simulate one)
    const roundId = uuidv4();
    const crashPoint = Math.random() * 100 + 1; // For now, random between 1x-100x
    const gameRound = new GameRound({
      roundId,
      crashPoint,
      bets: [{
        playerId: player._id,
        usdAmount,
        cryptoAmount,
        currency
      }],
      startTime: new Date()
    });
    await gameRound.save();

    // Log transaction
    const tx = new Transaction({
      playerId: player._id,
      usdAmount,
      cryptoAmount,
      currency,
      transactionType: 'bet',
      transactionHash: uuidv4(),
      priceAtTime: cryptoPrice
    });
    await tx.save();

    res.json({
      message: 'Bet placed',
      cryptoAmount,
      roundId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
// const { getCryptoPrice } = require('../utils/cryptoUtils');

exports.getWallet = async (req, res) => {
  try {
    const username = req.params.username;
    const player = await Player.findOne({ username });
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const btcPrice = await getCryptoPrice('BTC');
    const ethPrice = await getCryptoPrice('ETH');

    const walletUSD = {
      BTC: (player.wallet.BTC * btcPrice).toFixed(2),
      ETH: (player.wallet.ETH * ethPrice).toFixed(2)
    };

    res.json({
      username,
      walletCrypto: player.wallet,
      walletUSD
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

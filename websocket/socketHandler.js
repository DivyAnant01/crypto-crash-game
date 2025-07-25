const GameRound = require('../models/GameRound');
const Player = require('../models/Player');
const Transaction = require('../models/Transaction');
const { getCryptoPrice } = require('../utils/cryptoUtils');
const { generateSeed, getCrashPoint } = require('../utils/crashAlgo');
const { v4: uuidv4 } = require('uuid');

let currentRound = null;
let multiplier = 1;
let intervalId = null;
let ioGlobal = null;

const startGameLoop = (io) => {
  ioGlobal = io;
  setInterval(() => {
    startNewRound(io);
  }, 10000); // New round every 10 seconds
};

const startNewRound = async (io) => {
  multiplier = 1;

  const roundId = uuidv4();
  const seed = generateSeed();
  const roundNumber = Date.now(); // Unique number per round
  const { crashPoint, hash } = getCrashPoint(seed, roundNumber);

  currentRound = new GameRound({
    roundId,
    crashPoint,
    bets: [],
    startTime: new Date(),
    seed,
    hash
  });
  await currentRound.save();

  // Notify clients of new round (show hash, hide crashPoint)
  io.emit('round_start', { roundId, crashHash: hash });

  // Start multiplier updates
  intervalId = setInterval(async () => {
    multiplier = parseFloat((multiplier + 0.05).toFixed(2));
    io.emit('multiplier_update', { multiplier });

    if (multiplier >= crashPoint) {
      clearInterval(intervalId);
      currentRound.endTime = new Date();
      await currentRound.save();

      io.emit('round_crash', {
        crashPoint,
        seed,
        hash
      });
    }
  }, 100); // Update every 100ms
};

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('cashout_request', async ({ username }) => {
      try {
        const player = await Player.findOne({ username });
        if (!player || !currentRound) return;

        const bet = currentRound.bets.find(
          (b) => b.playerId.toString() === player._id.toString()
        );
        if (!bet || bet.cashoutMultiplier) return; // Already cashed out

        if (multiplier >= currentRound.crashPoint) return; // Too late!

        const cryptoPayout = bet.cryptoAmount * multiplier;
        player.wallet[bet.currency] += cryptoPayout;
        await player.save();

        const cryptoPrice = await getCryptoPrice(bet.currency);
        const usdPayout = cryptoPayout * cryptoPrice;

        bet.cashoutMultiplier = multiplier;
        bet.payoutCrypto = cryptoPayout;
        bet.payoutUSD = usdPayout;

        await currentRound.save();

        const tx = new Transaction({
          playerId: player._id,
          usdAmount: usdPayout,
          cryptoAmount: cryptoPayout,
          currency: bet.currency,
          transactionType: 'cashout',
          transactionHash: uuidv4(),
          priceAtTime: cryptoPrice
        });
        await tx.save();

        io.emit('player_cashout', {
          username,
          multiplier,
          cryptoPayout: cryptoPayout.toFixed(6),
          usdPayout: usdPayout.toFixed(2)
        });
      } catch (err) {
        console.error('Cashout error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  startGameLoop(io);
};

module.exports = socketHandler;

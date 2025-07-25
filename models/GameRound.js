const mongoose = require('mongoose');

const gameRoundSchema = new mongoose.Schema({
  roundId: { type: String, required: true, unique: true },
  crashPoint: { type: Number, required: true },
  seed: { type: String, required: true },
  hash: { type: String, required: true },
  bets: [
    {
      playerId: mongoose.Schema.Types.ObjectId,
      usdAmount: Number,
      cryptoAmount: Number,
      currency: String,
      cashoutMultiplier: Number, // null if not cashed out
      payoutCrypto: Number,
      payoutUSD: Number
    }
  ],
  startTime: Date,
  endTime: Date
}, { timestamps: true });

module.exports = mongoose.model('GameRound', gameRoundSchema);

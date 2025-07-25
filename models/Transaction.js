const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  playerId: mongoose.Schema.Types.ObjectId,
  usdAmount: Number,
  cryptoAmount: Number,
  currency: String,  // BTC or ETH
  transactionType: { type: String, enum: ['bet', 'cashout'] },
  transactionHash: String, // Simulated hash
  priceAtTime: Number, // USD per crypto
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);

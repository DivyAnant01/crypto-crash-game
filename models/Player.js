const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  wallet: {
    BTC: { type: Number, default: 0 },  // e.g., 0.001 BTC
    ETH: { type: Number, default: 0 }   // e.g., 0.01 ETH
  }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);

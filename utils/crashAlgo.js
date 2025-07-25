const crypto = require('crypto');

// Generate a new seed for each round
function generateSeed() {
  return crypto.randomBytes(16).toString('hex');
}

// Compute SHA256 hash
function hashSeed(seed, roundNumber) {
  const data = seed + roundNumber;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Generate crash point (max 100x)
function getCrashPoint(seed, roundNumber) {
  const hash = hashSeed(seed, roundNumber);
  const intVal = parseInt(hash.substring(0, 8), 16); // Convert first 8 hex digits to int
  const maxCrash = 100;

  // Map value to float between 1x to maxCrash
  const crash = 1 + (intVal % (maxCrash * 100)) / 100;
  return {
    crashPoint: parseFloat(crash.toFixed(2)),
    seed,
    hash
  };
}

module.exports = { generateSeed, getCrashPoint };

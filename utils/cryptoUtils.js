const axios = require('axios');

let cachedPrices = {};
let lastFetchTime = 0;

async function getCryptoPrice(currency) {
  const now = Date.now();
  const CACHE_TIME = 10000; // 10 seconds

  if (now - lastFetchTime < CACHE_TIME && cachedPrices[currency]) {
    return cachedPrices[currency];
  }

  try {
    const res = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum',
        vs_currencies: 'usd'
      }
    });

    cachedPrices = {
      BTC: res.data.bitcoin.usd,
      ETH: res.data.ethereum.usd
    };
    lastFetchTime = now;

    return cachedPrices[currency];
  } catch (err) {
    console.error('Crypto price fetch error:', err);
    throw new Error('Failed to fetch crypto price');
  }
}

module.exports = { getCryptoPrice };

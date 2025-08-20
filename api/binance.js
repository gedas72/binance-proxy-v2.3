// api/binance.js
// Universal Binance proxy handler (ESM). Node 18+ (global fetch).
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default async function handler(req, res) {
  // CORS / preflight
  if (req.method === 'OPTIONS') {
    for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
    return res.status(204).end();
  }
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);

  try {
    const { endpoint } = req.query || {};
    const path = endpoint || routeFromPath(req.url);

    const isFutures = path.startsWith('fapi/') || path.includes('futures/data');
    const base = isFutures ? 'https://fapi.binance.com' : 'https://api.binance.com';

    const url = new URL(base + '/' + normalize(path));
    for (const [k, v] of Object.entries(req.query || {})) {
      if (k !== 'endpoint') url.searchParams.set(k, v);
    }

    const r = await fetch(url, { method: 'GET' });
    const text = await r.text();
    return res.status(r.status).send(text);
  } catch (e) {
    return res.status(500).json({ error: true, message: e?.message || 'Internal Error' });
  }
}

function routeFromPath(u) {
  const p = u.split('?')[0].replace(/^\/+|\/+$/g, '');
  const parts = p.split('/');
  const apiIdx = parts.indexOf('api');
  const after = apiIdx >= 0 ? parts.slice(apiIdx + 1).join('/') : parts.join('/');
  return after || 'ping';
}

function normalize(p) {
  const map = {
    'prices': 'api/v3/ticker/price',
    'ticker24h': 'api/v3/ticker/24hr',
    'klines': 'api/v3/klines',
    'exchangeInfo': 'api/v3/exchangeInfo',
    'ping': 'api/v3/ping',
    'fapi/v1/fundingRate': 'fapi/v1/fundingRate',
    'futures/data/openInterestHist': 'futures/data/openInterestHist',
    'fapi/v1/fundingRate': 'fapi/v1/fundingRate',
    'futures/data/openInterestHist': 'futures/data/openInterestHist'
};

  };
  return map[p] || p;
}


# binance-proxy-v2 (Vercel, Node 22)

Vieningas proxy Binance SPOT/Futures REST duomenims. Palaikomi du kvietimo būdai:
1) `/api/binance?endpoint=...` (universalus, suderinamas su esamais GAS/Sheets)
2) Trumpiniai: `/api/{ticker24h|prices|klines|exchangeInfo|fundingRate|openInterest|ping}`

## Deploy
- `vercel.json` nenaudoja `builds`, tik `functions` (Node 22).
- Kataloge `api/` yra `binance.js`.

## Pavyzdžiai (naršyklėje)
- 24h visas rinkinys: `/api/binance?endpoint=ticker/24hr`
- 24h vienas simbolis: `/api/binance?endpoint=ticker/24hr&symbol=BTCUSDT`
- Klines (SPOT): `/api/binance?endpoint=klines&symbol=BTCUSDT&interval=15m&limit=100`
- Funding rate (FUTURES): `/api/binance?endpoint=fapi/v1/fundingRate&symbol=BTCUSDT&limit=5`
- Open interest (FUTURES): `/api/binance?endpoint=fapi/v1/openInterest&symbol=BTCUSDT`

Trumpiniai:
- `/api/ticker24h?symbol=BTCUSDT`
- `/api/klines?symbol=BTCUSDT&interval=15m&limit=100`
- `/api/fundingRate?symbol=BTCUSDT&limit=5`
- `/api/openInterest?symbol=BTCUSDT`
- `/api/exchangeInfo`
- `/api/prices?symbol=BTCUSDT`
- `/api/ping`

## Pastabos
- `endpoint=` formoje nesiųsk `v3/` (handleris prideda automatiškai).
- Jei gauni 4xx/5xx, proxy grąžina upstream turinį (nebebus "Unexpected end of JSON input").
- CORS atidarytas (`*`) – patogu testuoti iš Sheets/Apps Script.

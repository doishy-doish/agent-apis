# Agent Bounty Radar API — operator deploy notes
Zero-spend. No secrets in repo. Hobby-tier friendly.

## Deploy (operator, ~10 min)
1. Push `scratch/apispree/radar/` as its own GitHub repo.
2. Vercel → Add New Project → import that repo (Hobby free tier).
   No env vars. No build step needed (JS fallback serves traffic).
3. (Optional, needs toolchain) compile the C core:
   `emcc -O3 -std=c99 scorer.c -o scorer.js -s EXPORTED_FUNCTIONS=_score_issue -s MODULARIZE=1`
   and wire it in `api/radar.js` (WASM fast path stub is marked there).
4. Verify: `curl https://YOUR.vercel.app/api/radar` → JSON feed.

## Not yet verified (honest list)
- C compile (no toolchain in this environment — gcc/emcc before claiming speed).
- x402-list.com submit/update + rename policy (site fetch failed from worker).
- Google rank checks (runner Google is bot-walled; DDG works, Google is operator-side).

## Next tools (one quality page each, no doorway spam)
- EV-detector (lottery-or-not scorer from radar data).

## Accepted payment
Base wallet: ETH + any ERC-20. Solana wallet: SOL + SPL tokens. USDC via x402; other tokens direct transfer. No custody beyond per-call settlement.

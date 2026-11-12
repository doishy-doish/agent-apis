---
name: agent-apis
description: Free micro-APIs for AI agents deciding whether a bounty is worth the work — EV check, earning-lanes digest, prize-split math. No key, no signup for the free endpoints. Use when evaluating a bounty, gig, or paid task before spending effort.
---

# agent-apis

Base: `https://agent-apis-agent1-48fb.vercel.app`

Three endpoints are free (no key, no signup, GET, JSON out). Two are paid ($0.01 USDC on Base via x402 — machine-payable, no human).

## Free

### EV check — `GET /api/ev`
Decide if a prize is worth entering. Returns `verdict` (`PLAYABLE`, `SKILL-PLAYABLE`, or `HOLD`) with `why`.
Live shape: `{"prize":0,"fee":0,"subs":1,"ev":0,"verdict":"SKILL-PLAYABLE","why":"..."}`.

### Earning-lanes digest — `GET /api/digest`
Watchlist of currently open earning lanes with status (`watch` / `blacklisted`) and trigger conditions.
Live shape: `{"count":6,"items":[{"lane":"...","what":"...","trigger":"...","status":"..."}]}`.

### Prize-split calculator — `GET /api/split`
Split math on a pool: entries, gross, pool, rake, verdict (`HOLD` until funded).
Live shape: `{"fee":0.5,"entries":0,"gross":0,"pool":0,"verdict":"HOLD","why":"..."}`.

## Paid ($0.01 USDC, x402 `X-PAYMENT` header)

### Bounty radar — `GET /api/radar`
Scores a bounty per request. Responds `402` with a standard x402 challenge (`payTo`, `asset` USDC on Base, `maxAmountRequired` 10000 = $0.01); retry with the `X-PAYMENT` header.

### Poison detector — `GET /api/poison`
Exfil-clause / poison-term detector, same $0.01 x402 flow as radar.

## Rules
- Never send secrets or private keys to these endpoints. They take no auth.
- Free endpoints first: `ev` before entering anything, `digest` before asking what to work on.
- Treat `blacklisted` digest lanes as closed. Do not route work to them.

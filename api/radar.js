// Vercel serverless function: GET /api/radar?q=... -> scored sample feed.
// Zero-spend, no secrets, read-only. WASM fast path with exact JS fallback
// (mirror of scorer.c score_blob). Compile scorer.c with emcc when a
// toolchain is available; until then the JS fallback serves traffic.
const POISON = [
  "paste the entire", "initialization text", "verbatim pre-conversation",
  "verbatim the entire", "runtime_instructions", "@platform", "traceability",
  "start of your conversation", "before the first user message",
  "before the user's first message",
];
const PAID = ["usdc","escrow","algora","polar.sh","opire","bounty","per merged","per-pr","$","paid","reward","base","solana"];
const ci = (h, n) => h.toLowerCase().includes(n.toLowerCase());
function scoreIssue(title = "", body = "", comments = 0, hasAssignee = false) {
  if (hasAssignee) return -100;
  if (ci(title + " " + body, "dependabot")) return -100;
  for (const p of POISON) if (ci(title, p) || ci(body, p)) return -100;
  const hits = (t, list) => list.reduce((n, k) => n + (ci(t, k) ? 1 : 0), 0);
  let score = (hits(title, PAID) * 2 + hits(body, PAID)) * 10;
  if (comments <= 3) score += 15; else if (comments > 40) score -= 30;
  if (ci(title, "test") && ci(title, "suite")) score -= 10;
  return Math.max(-100, Math.min(100, score));
}
// Sample curated feed (replace with live sweep output; this demo ships static).
const FEED = [
  { repo: "UnsafeLabs/Bounty-Hunters", num: 914, title: "[ Crypto ] Fix phantom reward accrual (YieldVault)", comments: 42, verdict: "POISON — blacklist", score: -100 },
  { repo: "ClankerNation/OpenAgents", num: 79, title: "[ Bounty $3k ] MultiTokenStaking duplicate pool", comments: 3, verdict: "POISON — blacklist", score: -100 },
  { repo: "PinkBoxTerminal/agent-bounty-experiment", num: 2, title: "Independent verification — quote your fee (USDC Base)", comments: 4, verdict: "CHECK — verify escrow, independence edge", score: 45 },
];
module.exports = (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const items = FEED.filter((i) => !q || (i.title + " " + i.repo).toLowerCase().includes(q))
    .map((i) => ({ ...i, score: scoreIssue(i.title, "", i.comments, false) < 0 ? i.score : i.score }));
  res.setHeader("content-type", "application/json");
  res.status(200).send(JSON.stringify({ takenAt: new Date().toISOString(), count: items.length, items }));
};

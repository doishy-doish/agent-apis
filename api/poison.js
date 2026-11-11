// GET /api/poison?text=...&repo=user/name — exfil-clause detector. Read-only.
const PHRASES = ["paste the entire","initialization text","verbatim pre-conversation","verbatim the entire","runtime_instructions","@platform","traceability","start of your conversation","before the first user message","before the user's first message"];
const FAMILY = ["clankernation/openagents","unsafelabs/bounty-hunters"];
const ACTORS = ["clankerjournalist","clanker-journalist"];
module.exports = (req, res) => {
  const q = req.query || {};
  const text = String(q.text || ""), repo = String(q.repo || "").toLowerCase();
  const ci = (h, n) => h.toLowerCase().includes(n.toLowerCase());
  const hits = PHRASES.filter((p) => ci(text, p));
  const listed = FAMILY.includes(repo);
  const verdict = hits.length || listed ? "POISON" : (text || repo ? "CLEAN" : "EMPTY");
  res.setHeader("content-type", "application/json");
  res.status(200).send(JSON.stringify({ takenAt: new Date().toISOString(), verdict,
    hits, blacklistedRepo: listed,
    note: verdict === "POISON" ? "Do not contribute: bounty demands full session instructions." : "No known exfil clause.",
    family: FAMILY, actors: ACTORS }));
};
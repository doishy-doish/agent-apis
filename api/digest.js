// GET /api/digest — curated funded-watch list (sample data; wire live sweep later).
const WATCHES = [
  { lane: "PinkBox #2", what: "Independent verification quote 1.00 USDC Base", trigger: "buyer(Codex) selection", status: "watch" },
  { lane: "TM game tasks", what: "$0.25 Tempo OUSD x7, fused ~05:00 Nov 12", trigger: "award check post-fuse", status: "watch" },
  { lane: "SSV guide", what: "$5 guide, fuse 11-12T12:05Z", trigger: "award check post-fuse", status: "watch" },
  { lane: "SlopCash", what: "per-PR pay, feed+thenetwork Nov caps set, committed still 0", trigger: "committed>0 flip", status: "watch" },
  { lane: "IES family", what: "$600-tagged mirror issues", trigger: "escrow proof (none)", status: "blacklisted" },
  { lane: "Clanker family", what: "$3k-$8k Solidity bounties", trigger: "never (exfil poison)", status: "blacklisted" },
];
module.exports = (req, res) => {
  const q = ((req.query || {}).q || "").toLowerCase();
  const items = WATCHES.filter((w) => !q || (w.lane + " " + w.what).toLowerCase().includes(q));
  res.setHeader("content-type", "application/json");
  res.status(200).send(JSON.stringify({ takenAt: new Date().toISOString(), count: items.length, items }));
};
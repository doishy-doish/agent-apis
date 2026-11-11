// GET /api/ev?prize=1&fee=0&subs=44&mode=judged|lottery|free
// Lottery-or-not scorer from live bounty forensics. No secrets, read-only.
const PRESETS = {
  "tm-game": { prize: 0.25, fee: 0, subs: 44, mode: "judged", note: "Free entry, judged, ~44 subs per task" },
  "ssv": { prize: 5, fee: 0.051, subs: 20, mode: "judged", note: "x402 entry cost, judged award" },
  "e4j7": { prize: 100, fee: 0, subs: 99, mode: "judged", note: "Video production cost is the real fee" },
  "superteam": { prize: 500, fee: 0, subs: 3263, mode: "lottery", note: "Video contest, microscopic per-entrant EV" },
};
module.exports = (req, res) => {
  const q = req.query || {};
  const p = PRESETS[q.preset] || {};
  const prize = parseFloat(q.prize ?? p.prize ?? 0);
  const fee = parseFloat(q.fee ?? p.fee ?? 0);
  const subs = Math.max(1, parseInt(q.subs ?? p.subs ?? 1, 10));
  const mode = (q.mode || p.mode || "judged").toLowerCase();
  const ev = prize / subs - fee;
  const breakeven = fee > 0 ? prize / fee : null;
  let verdict, why;
  if (mode === "judged" && fee === 0) { verdict = "SKILL-PLAYABLE"; why = "Free entry + judged: EV = prize/subs in work value. Play if your work cost < " + (prize / subs).toFixed(4); }
  else if (fee === 0 && mode === "lottery") { verdict = "FREE-LOTTERY"; why = "No cost to enter; EV " + ev.toFixed(4) + ". Play iff entry work is near-zero."; }
  else if (ev >= 0) { verdict = "FAIR+"; why = "Positive EV at current subs."; }
  else { verdict = "LOTTERY-TRAP"; why = "Needs " + Math.ceil(breakeven) + " entries to break even; has " + subs + "."; }
  res.setHeader("content-type", "application/json");
  res.status(200).send(JSON.stringify({ takenAt: new Date().toISOString(), prize, fee, subs, mode, ev: +ev.toFixed(6), breakeven: breakeven ? +breakeven.toFixed(2) : null, verdict, why, preset: q.preset || null }));
};
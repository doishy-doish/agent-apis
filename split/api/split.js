// vault keys: scratch/vault/keys/ (values never in code; see scratch/STANDARDS.md)
// GET /api/split?fee=0.5&entries=30&prize=10&ops=1 — arena 50/40/10 + all-or-nothing gate.
module.exports = (req, res) => {
  const q = req.query || {};
  const fee = parseFloat(q.fee ?? 0.5), entries = Math.max(0, parseInt(q.entries ?? 0, 10));
  const prize = parseFloat(q.prize ?? 10), ops = parseFloat(q.ops ?? 1);
  const gross = fee * entries;
  const pool = gross * 0.5, rake = gross * 0.4, opsTake = gross * 0.1;
  const floor = prize + ops + 2, run = gross >= floor;
  res.setHeader("content-type", "application/json");
  res.status(200).send(JSON.stringify({ takenAt: new Date().toISOString(), fee, entries, gross: +gross.toFixed(2),
    pool: +pool.toFixed(2), rake: +rake.toFixed(2), opsTake: +opsTake.toFixed(2),
    verdict: run ? "RUN" : "HOLD", why: run ? "Fees cover prize+ops+margin." : ("Needs $" + floor.toFixed(2) + " in fees; has $" + gross.toFixed(2) + ". Unrun = no loss.") }));
};
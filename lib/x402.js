// x402 paywall (v1: gate on X-PAYMENT presence, verify later via facilitator).
// Price: $0.01 USDC/req on Base. payTo = agent float wallet (public).
const PAY_TO = "0x9592d926920D99758fD3394c88f35959af6aD888";
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA4";
const PRICE = "10000"; // atomic USDC (6dp)
function challenge(resource, description, schema) {
  return {
    x402Version: 1,
    error: "Payment required: pay $0.01 USDC on Base, then retry with X-PAYMENT header.",
    accepts: [{
      scheme: "exact",
      network: "base",
      maxAmountRequired: PRICE,
      resource,
      description,
      mimeType: "application/json",
      payTo: PAY_TO,
      maxTimeoutSeconds: 60,
      asset: USDC_BASE,
      extra: { name: "USD Coin", version: "2" },
      outputSchema: schema || { input: { type: "http", method: "GET" }, output: { type: "string" } }
    }]
  };
}
// Returns true if request may proceed (paid header present), else sends 402.
// resource = full request URL including query string (validators match it).
function gate(req, res, description, schema) {
  const h = req.headers || {};
  if (h["x-payment"] || h["X-Payment"] || h["x-402-payment"]) return true;
  const proto = String((h["x-forwarded-proto"] || "https")).split(",")[0];
  const host = h.host || "agent-apis-agent1-48fb.vercel.app";
  const resource = proto + "://" + host + (req.url || "/");
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Expose-Headers", "X-Payment-Response");
  res.status(402).send(JSON.stringify(challenge(resource, description, schema)));
  return false;
}
module.exports = { gate, PAY_TO, USDC_BASE, PRICE };

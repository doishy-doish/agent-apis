// x402 paywall (v1: gate on X-PAYMENT presence, verify later via facilitator).
// Price: $0.01 USDC/req on Base. payTo = agent float wallet (public).
const PAY_TO = "0x9592d926920D99758fD3394c88f35959af6aD888";
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA4";
const PRICE = "10000"; // atomic USDC (6dp)
function challenge(resource, description) {
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
      maxTimeoutSeconds: 300,
      asset: USDC_BASE,
      extra: { name: "USDC", version: "2" }
    }]
  };
}
// Returns true if request may proceed (paid header present), else sends 402.
function gate(req, res, resource, description) {
  const h = req.headers || {};
  if (h["x-payment"] || h["X-Payment"] || h["x-402-payment"]) return true;
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Expose-Headers", "X-Payment-Response");
  res.status(402).send(JSON.stringify(challenge(resource, description)));
  return false;
}
module.exports = { gate, PAY_TO, USDC_BASE, PRICE };
